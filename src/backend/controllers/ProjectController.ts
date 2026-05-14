import { Request, Response } from 'express';
import { Project } from '../models/Project';

export class ProjectController {
  getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find().sort({ order: 1 });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  };
}
