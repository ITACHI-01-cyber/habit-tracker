import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Contact } from '../models/Contact';
import { ContactService } from '../services/ContactService';

export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  }

  handleContact = async (req: Request, res: Response) => {
    try {
      const result = await this.contactService.processContactMessage(req.body);
      
      if (result.dbSaved || result.emailSent) {
        return res.status(201).json({
          message: 'Message processed',
          ...result
        });
      }
      
      throw new Error('Processing failed');
    } catch (error) {
      console.error('Controller Error:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  };

  getAllMessages = async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Database not connected' });
      }
      const messages = await Contact.find().sort({ createdAt: -1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  };
}
