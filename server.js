import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import db from './db.js';

const JWT_SECRET = 'your-secret-key';

// Rate Limiter for public form submissions
const membershipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: 'Too many applications from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());

  // Auth Middleware
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  // Public Routes
  app.get('/api/news', (req, res) => {
    const news = db.prepare('SELECT * FROM news ORDER BY id DESC').all();
    res.json(news);
  });

  app.get('/api/gallery', (req, res) => {
    const gallery = db.prepare('SELECT * FROM gallery ORDER BY id DESC').all();
    res.json(gallery);
  });

  app.get('/api/partners', (req, res) => {
    const partners = db.prepare('SELECT * FROM partners').all();
    res.json(partners);
  });

  app.post('/api/membership', membershipLimiter, (req, res) => {
    const { name, email, phone, honeypot } = req.body;
    
    // Honeypot check (bots fill this, humans don't)
    if (honeypot) {
      return res.status(400).json({ message: 'Bot detected' });
    }

    // Basic Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    db.prepare('INSERT INTO membership (name, email, phone) VALUES (?, ?, ?)').run(name, email, phone);
    res.json({ message: 'Application submitted successfully' });
  });

  // Admin CRUD Routes
  app.get('/api/admin/membership', authenticateToken, (req, res) => {
    const applications = db.prepare('SELECT * FROM membership ORDER BY id DESC').all();
    res.json(applications);
  });

  app.delete('/api/admin/membership/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM membership WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  });

  app.post('/api/admin/membership/:id/approve', authenticateToken, (req, res) => {
    db.prepare("UPDATE membership SET status = 'approved' WHERE id = ?").run(req.params.id);
    res.json({ message: 'Membership approved successfully' });
  });

  app.post('/api/admin/news', authenticateToken, (req, res) => {
    const { title, date, content, image } = req.body;
    db.prepare('INSERT INTO news (title, date, content, image) VALUES (?, ?, ?, ?)').run(title, date, content, image);
    res.json({ message: 'News added successfully' });
  });

  app.put('/api/admin/news/:id', authenticateToken, (req, res) => {
    const { title, date, content, image } = req.body;
    db.prepare('UPDATE news SET title = ?, date = ?, content = ?, image = ? WHERE id = ?').run(title, date, content, image, req.params.id);
    res.json({ message: 'News updated successfully' });
  });

  app.delete('/api/admin/news/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  });

  app.post('/api/admin/gallery', authenticateToken, (req, res) => {
    const { title, image } = req.body;
    db.prepare('INSERT INTO gallery (title, image) VALUES (?, ?)').run(title, image);
    res.json({ message: 'Gallery image added successfully' });
  });

  app.put('/api/admin/gallery/:id', authenticateToken, (req, res) => {
    const { title, image } = req.body;
    db.prepare('UPDATE gallery SET title = ?, image = ? WHERE id = ?').run(title, image, req.params.id);
    res.json({ message: 'Gallery updated successfully' });
  });

  app.delete('/api/admin/gallery/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  });

  app.post('/api/admin/partners', authenticateToken, (req, res) => {
    const { name, logo } = req.body;
    db.prepare('INSERT INTO partners (name, logo) VALUES (?, ?)').run(name, logo);
    res.json({ message: 'Partner added successfully' });
  });

  app.put('/api/admin/partners/:id', authenticateToken, (req, res) => {
    const { name, logo } = req.body;
    db.prepare('UPDATE partners SET name = ?, logo = ? WHERE id = ?').run(name, logo, req.params.id);
    res.json({ message: 'Partner updated successfully' });
  });

  app.delete('/api/admin/partners/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
