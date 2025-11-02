import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const baseAppUrl = process.env.APP_URL || "http://localhost:5001/api";

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  APP_URL: baseAppUrl,
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    exprires_in: process.env.REDIS_TOKEN_EXPRES_IN,
  },
  rabbitmq:{
    url: process.env.RABBITMQ_URL || "amqp://localhost:5672"
  }
};
