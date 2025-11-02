/* eslint-disable @typescript-eslint/no-explicit-any */
import amqp, { Channel, ConsumeMessage } from 'amqplib';
import config from '@config/index';
import logger from './logger';

let connection: any = null;
let channel: any = null;

const EXCHANGE_NAME = 'central_event';
const EXCHANGE_TYPE = 'topic'; // allows pattern-based routing

export async function connectToRabbitMQ(): Promise<Channel> {
  if (channel) return channel;

  try {
    logger.info('Connecting to RabbitMQ...');

    connection = await amqp.connect(config.rabbitmq.url);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: true,
    });

    connection.on('close', () => {
      logger.error('RabbitMQ connection closed, retrying...');
      connection = null;
      channel = null;
      setTimeout(connectToRabbitMQ, 5000); // auto-reconnect
    });

    connection.on('error', (err: any) => {
      logger.error('RabbitMQ connection error:', err);
    });

    logger.info(`✅ Connected to RabbitMQ Exchange: ${EXCHANGE_NAME}`);
    return channel;
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export async function publishEvent(
  routingKey: string,
  message: Record<string, unknown>,
): Promise<void> {
  const ch = await connectToRabbitMQ();

  const payload = Buffer.from(JSON.stringify(message));

  ch.publish(EXCHANGE_NAME, routingKey, payload, {
    persistent: true,
    contentType: 'application/json',
  });

  logger.info(`📤 Event published -> ${routingKey}`);
}

export async function consumeEvent(
  routingKey: string,
  callback: (data: any) => Promise<void> | void,
): Promise<void> {
  const ch = await connectToRabbitMQ();

  // Each routing key gets its own durable queue (named by service)
  const queueName = `${routingKey.replace(/\./g, '_')}_queue`;

  await ch.assertQueue(queueName, { durable: true });
  await ch.bindQueue(queueName, EXCHANGE_NAME, routingKey);

  ch.consume(
    queueName,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        await callback(content);
        ch.ack(msg);
      } catch (error) {
        logger.error(`❌ Error handling message for ${routingKey}:`, error);
        ch.nack(msg, false, false); // discard bad messages
      }
    },
    { noAck: false },
  );

  logger.info(`📥 Subscribed to event -> ${routingKey}`);
}
