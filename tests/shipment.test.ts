import request from 'supertest';
import app from '../src/app';

describe('Shipment API', () => {
  let shipmentId: string;

  it('should create a shipment', async () => {
    const res = await request(app)
      .post('/api/shipment')
      .send({ description: 'Box of electronics', status: 'pending' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.shipment).toHaveProperty('id');
    shipmentId = res.body.shipment.id;
  });

  it('should get all shipments', async () => {
    const res = await request(app).get('/api/shipment');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.shipments)).toBe(true);
  });

  it('should get a shipment by id', async () => {
    const res = await request(app).get(`/api/shipment/${shipmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.shipment.id).toBe(shipmentId);
  });

  it('should update a shipment', async () => {
    const res = await request(app)
      .put(`/api/shipment/${shipmentId}`)
      .send({ status: 'in-transit' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.shipment.status).toBe('in-transit');
  });

  it('should delete a shipment', async () => {
    const res = await request(app).delete(`/api/shipment/${shipmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.shipment.id).toBe(shipmentId);
  });

  it('should return 404 for deleted shipment', async () => {
    const res = await request(app).get(`/api/shipment/${shipmentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
