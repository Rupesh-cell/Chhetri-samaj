import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
import DOMPurify from 'dompurify';

const API = {
  getNews: async () => {
    const res = await fetch('/api/news');
    return res.json();
  }
};

const NewsDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const news = await API.getNews();
        const found = news.find(n => n.id.toString() === id.toString());
        if (found) {
          setPost(found);
          setOtherPosts(news.filter(n => n.id.toString() !== id.toString()).slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center text-primary">
      <div className="spinner-border animate-pulse" role="status"></div>
    </div>
  );

  if (!post) return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
      <div className="p-5 rounded-circle bg-slate-50 mb-4">
        <ArrowLeft size={48} className="text-slate-300" />
      </div>
      <h2 className="font-serif mb-3 fw-bold">लेख फेला परेन</h2>
      <p className="text-slate-500 mb-4">तपाईंले खोज्नुभएको समाचार उपलब्ध छैन वा हटाइएको हुन सक्छ।</p>
      <Link to="/" className="btn-samaj d-flex align-items-center gap-2">
        <ArrowLeft size={18} /> गृहपृष्ठमा फर्कनुहोस्
      </Link>
    </div>
  );

  return (
    <div className="article-page min-vh-100 bg-white">
      {/* Article Hero */}
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <Container className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-16 z-10 w-full text-center">
          <Fade direction="up" triggerOnce={true}>
            <Link to="/" className="inline-flex align-items-center gap-2 text-white/70 hover:text-white mb-6 text-decoration-none transition-all group">
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" /> गृहपृष्ठमा फर्कनुहोस्
            </Link>
            <div className="d-flex justify-content-center gap-2 mb-4">
              <Badge bg="primary" className="px-3 py-2 rounded-pill uppercase tracking-wider small shadow-lg">आधिकारिक समाचार</Badge>
            </div>
            <h1 className="text-white font-serif display-3 fw-bold mb-5 leading-tight mx-auto max-w-4xl text-center">{post.title}</h1>
            <div className="d-flex flex-wrap justify-content-center gap-5 text-white/80 border-top border-white/10 pt-5">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary p-2 rounded-circle"><Calendar size={18} className="text-white" /></div>
                <div>
                  <div className="x-small text-white/50">प्रकाशित मिति</div>
                  <div className="fw-bold">{post.date}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="bg-white/10 p-2 rounded-circle"><User size={18} className="text-white" /></div>
                <div>
                  <div className="x-small text-white/50">लेखक</div>
                  <div className="fw-bold">नेपाल क्षेत्री समाज</div>
                </div>
              </div>
            </div>
          </Fade>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-20">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Fade direction="up" triggerOnce={true} delay={200}>
              <div className="article-content fs-4 leading-relaxed text-slate-800 font-serif">
                <style>
                  {`
                    .markdown-body p { margin-bottom: 2rem; }
                    .markdown-body h2, .markdown-body h3 { margin: 3rem 0 1.5rem; color: #0f172a; font-weight: 700; }
                    .markdown-body img { border-radius: 1rem; margin: 2rem 0; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.1); }
                  `}
                </style>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} className="markdown-body" />
              </div>
              
              <div className="mt-20 p-10 bg-slate-50 rounded-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-5 border border-slate-100">
                <div className="d-flex align-items-center gap-4">
                  <div className="fw-bold text-slate-900 fs-5">साझेदारी गर्नुहोस्:</div>
                  <div className="d-flex gap-2">
                    {['Facebook', 'Twitter', 'WhatsApp'].map(platform => (
                      <Button key={platform} variant="white" className="border-0 shadow-sm rounded-circle p-3 hover:bg-primary hover:text-white transition-all">
                        <Share2 size={20} />
                      </Button>
                    ))}
                  </div>
                </div>
                <Link to="/" className="btn-samaj px-8 py-3 rounded-pill shadow-lg">
                  सबै समाचारहरू हेर्नुहोस्
                </Link>
              </div>
            </Fade>
          </Col>
        </Row>
      </Container>

      {/* Recommended Area */}
      {otherPosts.length > 0 && (
        <section className="py-20 bg-slate-50 border-top border-slate-100">
          <Container>
            <div className="text-center mb-10">
              <h6 className="text-primary fw-bold uppercase tracking-widest mb-2">थप पढ्नुहोस्</h6>
              <h2 className="font-serif display-5 fw-bold text-slate-900">सम्बन्धित लेखहरू</h2>
            </div>
            <Row className="g-4">
              {otherPosts.map((item, idx) => (
                <Col md={4} key={item.id}>
                   <Fade direction="up" delay={idx * 100} triggerOnce={true}>
                      <Link to={`/news/${item.id}`} className="text-decoration-none group">
                        <Card className="border-0 bg-transparent h-100">
                          <div className="aspect-video rounded-5 overflow-hidden mb-4 shadow-sm">
                            <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                          </div>
                          <Card.Body className="p-0">
                            <div className="text-primary x-small mb-2">{item.date}</div>
                            <h4 className="font-serif fw-bold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                              {item.title}
                            </h4>
                          </Card.Body>
                        </Card>
                      </Link>
                   </Fade>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default NewsDetail;
