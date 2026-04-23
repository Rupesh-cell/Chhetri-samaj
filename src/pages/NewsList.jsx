import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';

const API = {
  getNews: async () => {
    const res = await fetch('/api/news');
    return res.json();
  }
};

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await API.getNews();
        setNews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    window.scrollTo(0, 0);
  }, []);

  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center text-primary">
      <div className="spinner-border animate-pulse" role="status"></div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-slate-50">
      <div className="bg-primary pt-32 pb-20 text-white text-center">
        <Container>
          <Fade direction="up" triggerOnce={true}>
            <h6 className="uppercase tracking-widest font-bold opacity-80 mb-3">हाम्रो समाचार पोर्टल</h6>
            <h1 className="font-serif display-3 fw-bold mb-0">सबै समाचार र जानकारीहरू</h1>
          </Fade>
        </Container>
      </div>

      <Container className="py-20">
        <Row className="g-5">
           {news.map((item, idx) => (
             <Col md={6} lg={4} key={item.id}>
               <Fade direction="up" delay={idx * 100} triggerOnce={true}>
                 <Link to={`/news/${item.id}`} className="text-decoration-none group">
                   <Card className="card-blog border-0 shadow-sm h-100 bg-white overflow-hidden">
                     <div className="relative aspect-video overflow-hidden">
                       <img 
                         src={item.image} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                         alt={item.title} 
                       />
                       <div className="absolute bottom-4 left-4">
                         <Badge bg="primary" className="rounded-pill shadow-lg">{item.date.split(' ')[0]}</Badge>
                       </div>
                     </div>
                     <Card.Body className="p-4">
                       <div className="d-flex align-items-center gap-2 text-slate-400 small mb-3">
                         <Calendar size={14} /> {item.date}
                       </div>
                       <h4 className="font-serif fw-bold text-slate-900 group-hover:text-primary transition-colors leading-tight mb-3 line-clamp-2">
                         {item.title}
                       </h4>
                       <p className="text-slate-500 small mb-4 line-clamp-2">
                         {item.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                       </p>
                       <div className="d-flex align-items-center gap-2 text-primary fw-bold small">
                         थप पढ्नुहोस् <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                       </div>
                     </Card.Body>
                   </Card>
                 </Link>
               </Fade>
             </Col>
           ))}
        </Row>
      </Container>
    </div>
  );
};

export default NewsList;
