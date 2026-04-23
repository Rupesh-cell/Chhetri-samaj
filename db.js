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
  const seedNews = [
    {
      title: 'भूकम्प पीडितका लागि संकलित राहत रकम हस्तान्तरण',
      date: 'फेब्रुअरी २८, २०२६',
      image: 'https://images.unsplash.com/photo-1469571483331-50798fd93361?q=80&w=2070&auto=format&fit=crop',
      content: `
        <p>नेपाल क्षेत्री समाज युएईले नेपालका हालैका भूकम्प पीडितहरूको सहयोगका लागि संकलन गरेको राहत कोष सफलतापूर्वक सम्बन्धित निकायमा हस्तान्तरण गरेको छ। प्रवासमा रहेर पनि आफ्नो मातृभूमिको दुःखमा मल्हम लगाउने उद्देश्यले यो अभियान सञ्चालन गरिएको थियो।</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" style="width: 100%; border-radius: 12px; height: 180px; object-fit: cover;" />
          <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop" style="width: 100%; border-radius: 12px; height: 180px; object-fit: cover;" />
        </div>
        <p>कोष संकलन अभियानमा युएईभरका विभिन्न क्षेत्रमा कार्यरत नेपाली दाजुभाइ तथा दिदीबहिनीहरूले स्वतःस्फूर्त रूपमा आर्थिक सहयोग गर्नुभएको थियो। संकलित कुल रकम प्रधानमन्त्री दैवी प्रकोप उद्धार कोषमा जम्मा गरिएको छ। समाजले आगामी दिनमा पनि यस्ता आपतकालीन अवस्थामा सहयोग जारी राख्ने प्रतिबद्धता जनाएको छ।</p>
      `
    },
    { 
      title: 'दोस्रो वार्षिक साधारण सभा सम्पन्न', 
      date: 'मार्च ८, २०२६', 
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop',
      content: '<p>समाजको दोस्रो वार्षिक साधारण सभा दुबईको एक होटलमा भव्यताका साथ सम्पन्न भयो। सभाले आगामी कार्यकालका लागि नयाँ कार्य समिति चयन गरेको छ। कार्यक्रममा युएईभरका विभिन्न पेशामा संलग्न क्षेत्री व्यक्तित्वहरूको बाक्लो उपस्थिति रहेको थियो।</p><p>नयाँ कार्यसमितिले समाजको विधानलाई अझ परिष्कृत गर्ने र युएईमा रहेका नेपाली कामदारहरूको हकहितमा थप सशक्त ढंगले काम गर्ने प्रतिबद्धता जनाएट छ। कार्यक्रमको अन्त्यमा सांस्कृतिक नाचगण समेत प्रस्तुत गरिएको थियो।</p>'
    },
    { 
      title: 'सांस्कृतिक साँझ २०२६ को तयारी', 
      date: 'फेब्रुअरी १५, २०२६', 
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop',
      content: '<p>आउँदै गरेको नयाँ वर्षको अवसरमा वृहत सांस्कृतिक साँझ आयोजना गरिने भएको छ। यसका लागि विभिन्न कलाकारहरूसँग सम्झौता भइसकेको छ। यो कार्यक्रम दुबईको प्रतिष्ठित प्रेक्षालयमा सञ्चालन हुनेछ।</p><p>हाम्रो उद्देश्य परदेशमा रहेर पनि आफ्नो संस्कृतिलाई जोगाइराख्नु हो। कार्यक्रममा नेपालका चर्चित लोकदोहोरी गायकहरूको विशेष सांगीतिक प्रस्तुति रहनेछ भने स्थानीय प्रतिभाहरूलाई पनि मञ्च प्रदान गरिनेछ।</p>'
    },
    { 
      title: 'रक्तदान कार्यक्रममा उत्साहजनक सहभागिता', 
      date: 'जनवरी २२, २०२६', 
      image: 'https://images.unsplash.com/photo-1615461066841-6116ecaaba74?q=80&w=2000&auto=format&fit=crop',
      content: '<p>मानवीय सेवाको भावनाका साथ आयोजना गरिएको रक्तदान कार्यक्रममा १०० भन्दा बढी सदस्यहरूले रक्तदान गर्नुभयो। दुबई हेल्थ अथोरिटीको समन्वयमा आयोजित यस कार्यक्रमले आपतकालीन अवस्थामा रगतको अभावलाई कम गर्न मद्दत पुर्याउने विश्वास लिइएको छ।</p><p>रक्तदान गर्ने सबै सदस्यहरूलाई समाजको तर्फबाट प्रशंसापत्र प्रदान गरिएको थियो। यस्ता सामाजिक कार्यहरू आगामी दिनमा पनि निरन्तर जारी रहने समाजका अध्यक्षले बताउनुभयो।</p>'
    }
  ];
  const insertNews = db.prepare('INSERT INTO news (title, date, content, image) VALUES (?, ?, ?, ?)');
  seedNews.forEach(n => insertNews.run(n.title, n.date, n.content, n.image));
}

const galleryCount = db.prepare('SELECT COUNT(*) as count FROM gallery').get().count;
if (galleryCount === 0) {
  const seedGallery = [
    { title: 'साधारण सभा छलफल', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop' },
    { title: 'सांस्कृतिक झाँकी', image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974&auto=format&fit=crop' },
    { title: 'रक्तदान शिविर', image: 'https://images.unsplash.com/photo-1536859358241-af36283ff13c?q=80&w=2070&auto=format&fit=crop' },
    { title: 'वनभोज कार्यक्रम', image: 'https://images.unsplash.com/photo-1526726533290-43788211a946?q=80&w=2070&auto=format&fit=crop' },
    { title: 'सम्मान समारोह', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop' },
    { title: 'खेलकुद प्रतियोगिता', image: 'https://images.unsplash.com/photo-1517603915032-d35330372346?q=80&w=2070&auto=format&fit=crop' }
  ];
  const insertGallery = db.prepare('INSERT INTO gallery (title, image) VALUES (?, ?)');
  seedGallery.forEach(g => insertGallery.run(g.title, g.image));
}

const partnersCount = db.prepare('SELECT COUNT(*) as count FROM partners').get().count;
if (partnersCount === 0) {
  const partners = [
    { name: 'Nepal Airlines', logo: 'https://cdn.worldvectorlogo.com/logos/nepal-airlines-logo.svg' },
    { name: 'Buddha Air', logo: 'https://www.buddhaair.com/assets/images/logo.png' },
    { name: 'Ncell Axiata', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Ncell_logo.png' },
    { name: 'Global IME Bank', logo: 'https://upload.wikimedia.org/wikipedia/en/2/29/Global_IME_Bank_Logo.png' },
    { name: 'Everest Bank', logo: 'https://www.everestbankltd.com/wp-content/themes/ebl/images/logo.png' },
    { name: 'Nabil Bank', logo: 'https://www.nabilbank.com/assets/images/nabil-logo.png' },
    { name: 'IME Pay', logo: 'https://www.imepay.com.np/wp-content/uploads/2021/04/ime-pay-logo.png' },
    { name: 'NIC ASIA Bank', logo: 'https://www.nicasiabank.com/assets/frontend/images/nic-asia-logo.png' }
  ];
  const insertPartner = db.prepare('INSERT INTO partners (name, logo) VALUES (?, ?)');
  partners.forEach(p => insertPartner.run(p.name, p.logo));
}

export default db;
