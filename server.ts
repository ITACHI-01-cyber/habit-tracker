import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Controllers
import { ContactController } from './src/backend/controllers/ContactController';
import { ProjectController } from './src/backend/controllers/ProjectController';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
  private app: express.Application;
  private port: string | number;
  private contactController: ContactController;
  private projectController: ProjectController;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.contactController = new ContactController();
    this.projectController = new ProjectController();

    this.setupMiddlewares();
    this.setupDatabase();
    this.setupRoutes();
  }

  private setupMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupDatabase() {
    let MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI || MONGODB_URI.includes('YOUR_PASSWORD')) {
      console.warn('WARNING: MONGODB_URI not properly set in Secrets. Skipping database.');
      return;
    }

    // Auto-Fix: Detect and encode '@' in passwords
    // A standard URI is mongodb+srv://username:password@host...
    // If there are multiple '@', the last one is the host separator.
    const lastAtIndex = MONGODB_URI.lastIndexOf('@');
    const protocolSeparatorIndex = MONGODB_URI.indexOf('://');
    
    if (lastAtIndex !== -1 && protocolSeparatorIndex !== -1) {
      const protocol = MONGODB_URI.substring(0, protocolSeparatorIndex + 3);
      const rest = MONGODB_URI.substring(protocolSeparatorIndex + 3);
      const lastAtInRest = rest.lastIndexOf('@');
      
      const authPart = rest.substring(0, lastAtInRest);
      const hostPart = rest.substring(lastAtInRest + 1);

      if (authPart.includes('@')) {
        console.warn('DIAGNOSTIC: Detected unencoded "@" in password. Auto-encoding to "%40"...');
        // Encode only the password part (everything after the first ':')
        if (authPart.includes(':')) {
          const firstColonIndex = authPart.indexOf(':');
          const username = authPart.substring(0, firstColonIndex);
          const password = authPart.substring(firstColonIndex + 1);
          const encodedPassword = password.replace(/@/g, '%40');
          MONGODB_URI = `${protocol}${username}:${encodedPassword}@${hostPart}`;
        }
      }
    }

    // Serverless optimization: Prevent multiple connections on cold starts
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Already connected to MongoDB (cached for Serverless)');
      return;
    }

    // Diagnostic logging (safely masked)
    const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log('Attempting to connect to:', maskedUri);

    mongoose.connect(MONGODB_URI, {
      dbName: 'portfolio', // Explicitly ensure we use 'portfolio'
      serverApi: { version: '1', strict: true, deprecationErrors: true },
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    })
    .then(() => console.log('✅ Successfully connected to MongoDB Atlas (Database: portfolio)'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      if (err.message.includes('authentication failed') || err.message.includes('auth failed')) {
        console.error('CRITICAL HINT: Authentication failed.');
        console.error('1. Check if "bhardwajvivek226_db_user" has been created in Atlas > Database Access.');
        console.error('2. Ensure the user has "Read and Write to any database" permissions.');
        console.error('3. Verify the password matches EXACTLY.');
      }
    });
  }

  private setupRoutes() {
    // API Routes
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', db: mongoose.connection.readyState === 1 });
    });

    this.app.get('/api/projects', this.projectController.getAllProjects);
    this.app.post('/api/contact', this.contactController.handleContact);
    this.app.get('/api/messages', this.contactController.getAllMessages);

    // Vite Integration
    void this.setupVite();
  }

  private async setupVite() {
    // Skip static/Vite setup on Vercel, as Vercel automatically serves the frontend
    if (process.env.VERCEL) {
      return;
    }

    try {
      if (process.env.NODE_ENV !== 'production') {
        // Use vite.config.ts as the single source of truth for config
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
          // `configFile` is not needed; Vite finds it automatically
        });
        this.app.use(vite.middlewares);
      } else {
        const distPath = path.join(process.cwd(), 'dist');
        this.app.use(express.static(distPath));
        this.app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    } catch (err) {
      console.error('❌ Vite middleware setup failed:', err);
    }
  }

  public listen() {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`[Server]: Portfolio backend and frontend running at http://localhost:${this.port}`);
    });
  }
}

const server = new Server();

// Only listen on a port if NOT deployed on Vercel
if (!process.env.VERCEL) {
  server.listen();
}

export default server.app;
