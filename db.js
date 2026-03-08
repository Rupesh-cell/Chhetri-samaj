import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('samaj.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    content TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS membership (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    logo TEXT
  );
`);

// Create default admin if not exists
const adminExists = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
}

// Seed some data if empty
const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get().count;
if (newsCount === 0) {
  db.prepare('INSERT INTO news (title, date, content, image) VALUES (?, ?, ?, ?)').run(
    'New Membership Drive Started',
    'March 5, 2026',
    'We are excited to announce our new membership drive for the year 2026. Join us to be part of a vibrant community.',
    'https://picsum.photos/seed/news1/800/600'
  );
  db.prepare('INSERT INTO news (title, date, content, image) VALUES (?, ?, ?, ?)').run(
    'Relief Fund for Earthquake Victims',
    'Feb 20, 2026',
    'Samaj has successfully collected and sent relief funds to the victims of the recent earthquake in Nepal.',
    'https://picsum.photos/seed/news2/800/600'
  );
}

const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get().count;
if (galleryCount === 0) {
  for (let i = 1; i <= 6; i++) {
    db.prepare('INSERT INTO gallery (title, image) VALUES (?, ?)').run(
      `Gallery Image ${i}`,
      `https://picsum.photos/seed/gallery-${i}/600/400`
    );
  }
}

const partnersCount = db.prepare('SELECT COUNT(*) as count FROM partners').get().count;
if (partnersCount === 0) {
  const partners = [
    { name: 'Nepal Airlines', logo: 'https://picsum.photos/seed/partner1/200/100' },
    { name: 'Everest Bank', logo: 'https://picsum.photos/seed/partner2/200/100' },
    { name: 'UAE Exchange', logo: 'https://picsum.photos/seed/partner3/200/100' },
    { name: 'Ncell', logo: 'https://picsum.photos/seed/partner4/200/100' }
  ];
  const insertPartner = db.prepare('INSERT INTO partners (name, logo) VALUES (?, ?)');
  partners.forEach(p => insertPartner.run(p.name, p.logo));
}

export default db;
