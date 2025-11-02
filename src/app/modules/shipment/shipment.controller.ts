import { Request, Response } from 'express';

interface Shipment {
  id: string;
  description: string;
  status: string;
}

const shipments: Shipment[] = [];

export const createShipment = (req: Request, res: Response) => {
  const { description, status } = req.body;
  const newShipment: Shipment = {
    id: Math.random().toString(36).substr(2, 9),
    description,
    status,
  };
  shipments.push(newShipment);
  res.status(201).json({ success: true, shipment: newShipment });
};

export const getShipments = (req: Request, res: Response) => {
  res.json({ success: true, shipments });
};

export const getShipmentById = (req: Request, res: Response) => {
  const { id } = req.params;
  const shipment = shipments.find(s => s.id === id);
  if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
  res.json({ success: true, shipment });
};

export const updateShipment = (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, status } = req.body;
  const shipment = shipments.find(s => s.id === id);
  if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
  if (description !== undefined) shipment.description = description;
  if (status !== undefined) shipment.status = status;
  res.json({ success: true, shipment });
};

export const deleteShipment = (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = shipments.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Shipment not found' });
  const removed = shipments.splice(idx, 1);
  res.json({ success: true, shipment: removed[0] });
};
