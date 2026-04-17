import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  Container, 
  Row, 
  Col, 
  Navbar, 
  Nav, 
  Button, 
  Card, 
  Form,
  Table,
  Modal,
  Alert
} from 'react-bootstrap';
import { 
  Calendar, 
  Users, 
  Newspaper, 
  Image as ImageIcon, 
  UserPlus, 
  Phone, 
  MapPin, 
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  ArrowUp,
  LogOut,
  Plus,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { Fade, Slide, Zoom } from "react-awesome-reveal";

// --- API Service ---
const API = {
  login: (credentials) => fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(res => res.json()),

  getNews: () => fetch('/api/news').then(res => res.json()),
  getGallery: () => fetch('/api/gallery').then(res => res.json()),
  getPartners: () => fetch('/api/partners').then(res => res.json()),
  submitMembership: (data) => fetch('/api/membership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  admin: {
    getMembership: (token) => fetch('/api/admin/membership', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),
    deleteMembership: (id, token) => fetch(`/api/admin/membership/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    approveMembership: (id, token) => fetch(`/api/admin/membership/${id}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    addNews: (data, token) => fetch('/api/admin/news', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),
    updateNews: (id, data, token) => fetch(`/api/admin/news/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),
    deleteNews: (id, token) => fetch(`/api/admin/news/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    addGallery: (data, token) => fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),
    updateGallery: (id, data, token) => fetch(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),
    deleteGallery: (id, token) => fetch(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    addPartner: (data, token) => fetch('/api/admin/partners', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),
    updatePartner: (id, data, token) => fetch(`/api/admin/partners/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    }),
    deletePartner: (id, token) => fetch(`/api/admin/partners/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }),
  }
};

// --- Components ---

const AdminPanel = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('membership');
  const [data, setData] = useState({ membership: [], news: [], gallery: [], partners: [] });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'membership') {
        const res = await API.admin.getMembership(token);
        setData(prev => ({ ...prev, membership: res }));
      } else if (activeTab === 'news') {
        const res = await API.getNews();
        setData(prev => ({ ...prev, news: res }));
      } else if (activeTab === 'gallery') {
        const res = await API.getGallery();
        setData(prev => ({ ...prev, gallery: res }));
      } else if (activeTab === 'partners') {
        const res = await API.getPartners();
        setData(prev => ({ ...prev, partners: res }));
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('के तपाईं पक्का यो आइटम हटाउन चाहनुहुन्छ?')) return;
    if (activeTab === 'membership') await API.admin.deleteMembership(id, token);
    if (activeTab === 'news') await API.admin.deleteNews(id, token);
    if (activeTab === 'gallery') await API.admin.deleteGallery(id, token);
    if (activeTab === 'partners') await API.admin.deletePartner(id, token);
    loadData();
  };

  const handleApprove = async (id) => {
    await API.admin.approveMembership(id, token);
    loadData();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      if (activeTab === 'news') await API.admin.updateNews(formData.id, formData, token);
      if (activeTab === 'gallery') await API.admin.updateGallery(formData.id, formData, token);
      if (activeTab === 'partners') await API.admin.updatePartner(formData.id, formData, token);
    } else {
      if (activeTab === 'news') await API.admin.addNews(formData, token);
      if (activeTab === 'gallery') await API.admin.addGallery(formData, token);
      if (activeTab === 'partners') await API.admin.addPartner(formData, token);
    }
    setShowModal(false);
    setFormData({});
    setIsEditing(false);
    loadData();
  };

  const openAddModal = () => {
    setFormData({});
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="admin-layout">
      {/* Modern Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <ShieldCheck size={28} />
          </div>
          <div className="logo-text">
            <h5 className="mb-0">समाज एडमिन</h5>
            <small>व्यवस्थापन पोर्टल</small>
          </div>
        </div>
        
        <Nav className="flex-column sidebar-nav">
          <Nav.Link 
            onClick={() => setActiveTab('membership')} 
            className={`nav-item ${activeTab === 'membership' ? 'active' : ''}`}
          >
            <Users size={20} /> 
            <span>सदस्यताहरू</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('news')} 
            className={`nav-item ${activeTab === 'news' ? 'active' : ''}`}
          >
            <Newspaper size={20} /> 
            <span>समाचार र अपडेटहरू</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('gallery')} 
            className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
          >
            <ImageIcon size={20} /> 
            <span>ग्यालरी</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('partners')} 
            className={`nav-item ${activeTab === 'partners' ? 'active' : ''}`}
          >
            <ShieldCheck size={20} /> 
            <span>साझेदारहरू</span>
          </Nav.Link>
          
          <div className="mt-auto pt-4 border-top border-white/10">
            <Nav.Link onClick={onLogout} className="nav-item logout">
              <LogOut size={20} /> 
              <span>साइन आउट</span>
            </Nav.Link>
          </div>
        </Nav>
      </div>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h2 className="page-title">{activeTab === 'membership' ? 'सदस्यताहरू' : activeTab === 'news' ? 'समाचार' : activeTab === 'gallery' ? 'ग्यालरी' : 'साझेदारहरू'}</h2>
            <p className="page-subtitle">आफ्नो सामुदायिक सामग्री व्यवस्थापन गर्नुहोस्</p>
          </div>
          <div className="header-right">
            {activeTab !== 'membership' && (
              <Button onClick={openAddModal} className="btn-add">
                <Plus size={18} /> नयाँ थप्नुहोस्
              </Button>
            )}
          </div>
        </header>

        <div className="admin-content-card">
          {loading ? (
            <div className="p-5 text-center text-slate-400">डाटा लोड हुँदैछ...</div>
          ) : (
            <Table hover responsive className="admin-table">
              <thead>
                <tr>
                  {activeTab === 'membership' && (
                    <>
                      <th>आवेदकको विवरण</th>
                      <th>सम्पर्क</th>
                      <th>अवस्था</th>
                    </>
                  )}
                  {activeTab === 'news' && (
                    <>
                      <th>लेखको शीर्षक</th>
                      <th>प्रकाशन मिति</th>
                    </>
                  )}
                  {activeTab === 'gallery' && (
                    <>
                      <th>तस्बिरको शीर्षक</th>
                      <th>पूर्वावलोकन</th>
                    </>
                  )}
                  {activeTab === 'partners' && (
                    <>
                      <th>साझेदारको नाम</th>
                      <th>लोगो</th>
                    </>
                  )}
                  <th className="text-end">कार्यहरू</th>
                </tr>
              </thead>
              <tbody>
                {data[activeTab].length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-5 text-slate-400">कुनै रेकर्ड फेला परेन</td>
                  </tr>
                ) : (
                  data[activeTab].map(item => (
                    <tr key={item.id}>
                      {activeTab === 'membership' && (
                        <>
                          <td>
                            <div className="fw-bold">{item.name}</div>
                            <div className="small text-slate-400">{item.email}</div>
                          </td>
                          <td>{item.phone}</td>
                          <td>
                            <span className={`status-badge ${item.status}`}>
                              {item.status === 'pending' ? 'पेन्डिङ' : 'अनुमोदित'}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === 'news' && (
                        <>
                          <td className="fw-bold">{item.title}</td>
                          <td>{item.date}</td>
                        </>
                      )}
                      {activeTab === 'gallery' && (
                        <>
                          <td className="fw-bold">{item.title}</td>
                          <td>
                            <img src={item.image} alt="" className="table-img-preview" referrerPolicy="no-referrer" />
                          </td>
                        </>
                      )}
                      {activeTab === 'partners' && (
                        <>
                          <td className="fw-bold">{item.name}</td>
                          <td>
                            <img src={item.logo} alt="" className="table-img-preview" referrerPolicy="no-referrer" />
                          </td>
                        </>
                      )}
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {activeTab === 'membership' && item.status === 'pending' && (
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="rounded-pill px-3"
                              onClick={() => handleApprove(item.id)}
                            >
                              अनुमोदन गर्नुहोस्
                            </Button>
                          )}
                          {activeTab !== 'membership' && (
                            <Button 
                              variant="link" 
                              onClick={() => handleEdit(item)} 
                              className="btn-action-edit text-slate-400 hover:text-primary"
                            >
                              सम्पादन गर्नुहोस्
                            </Button>
                          )}
                          <Button 
                            variant="link" 
                            onClick={() => handleDelete(item.id)} 
                            className="btn-action-delete"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Add Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered className="admin-modal" size={activeTab === 'news' ? 'lg' : undefined}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'सम्पादन गर्नुहोस्' : 'नयाँ सिर्जना गर्नुहोस्'} {activeTab === 'news' ? 'समाचार' : activeTab === 'gallery' ? 'ग्यालरी' : 'साझेदार'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {activeTab === 'news' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>शीर्षक</Form.Label>
                    <Form.Control required className="form-input-samaj" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>मिति</Form.Label>
                    <Form.Control required className="form-input-samaj" placeholder="उदाहरण: मार्च ८, २०२६" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>तस्बिरको URL</Form.Label>
                    <Form.Control required className="form-input-samaj" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>सामग्री</Form.Label>
                    <div className="quill-wrapper bg-white rounded-3 overflow-hidden form-input-samaj">
                      <ReactQuill 
                        theme="snow" 
                        value={formData.content || ''} 
                        onChange={val => setFormData({...formData, content: val})}
                        modules={{
                          toolbar: [
                            [{ 'font': [] }],
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link', 'image'],
                            ['clean']
                          ],
                        }}
                      />
                    </div>
                  </Form.Group>
                </>
              )}
              {activeTab === 'gallery' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>शीर्षक</Form.Label>
                    <Form.Control required className="form-input-samaj" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>तस्बिरको URL</Form.Label>
                    <Form.Control required className="form-input-samaj" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </Form.Group>
                </>
              )}
              {activeTab === 'partners' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>साझेदारको नाम</Form.Label>
                    <Form.Control required className="form-input-samaj" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>लोगोको URL</Form.Label>
                    <Form.Control required className="form-input-samaj" value={formData.logo || ''} onChange={e => setFormData({...formData, logo: e.target.value})} />
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={() => setShowModal(false)}>रद्द गर्नुहोस्</Button>
              <Button type="submit" className="btn-save">{isEditing ? 'परिवर्तनहरू अद्यावधिक गर्नुहोस्' : 'अहिले प्रकाशन गर्नुहोस्'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [partners, setPartners] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    loadPublicData();
    // Check for existing token and set admin state
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAdmin(true);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadPublicData = async () => {
    try {
      const [n, g, p] = await Promise.all([API.getNews(), API.getGallery(), API.getPartners()]);
      setNews(n);
      setGallery(g);
      setPartners(p);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await API.login(loginData);
    if (res.token) {
      localStorage.setItem('adminToken', res.token);
      setToken(res.token);
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError('');
    } else {
      setLoginError('गलत प्रयोगकर्ता नाम वा पासवर्ड');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAdmin(false);
  };

  if (isAdmin && token) {
    return <AdminPanel token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="samaj-website">
      {/* Navigation */}
      <Navbar expand="lg" fixed="top" className={`navbar-samaj ${scrolled ? 'scrolled shadow-sm' : 'navbar-transparent'}`}>
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">नेपाल क्षेत्री समाज युएई</Navbar.Brand>
          <Navbar.Toggle aria-controls="samaj-nav" className="border-0 shadow-none">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="samaj-nav" className="justify-content-end">
            <Nav className="align-items-center">
              <Nav.Link href="#home">गृहपृष्ठ</Nav.Link>
              <Nav.Link href="#about">हाम्रो बारेमा</Nav.Link>
              {news.length > 0 && <Nav.Link href="#news">समाचार</Nav.Link>}
              {gallery.length > 0 && <Nav.Link href="#gallery">ग्यालरी</Nav.Link>}
              {partners.length > 0 && <Nav.Link href="#partners">साझेदारहरू</Nav.Link>}
              <Nav.Link href="#membership">आबद्ध हुनुहोस्</Nav.Link>
              <Button 
                variant="link" 
                onClick={() => setShowLogin(true)} 
                className="nav-link text-primary fw-bold border-0 bg-transparent"
              >
                एडमिन
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <Container>
          <Row>
            <Col lg={8}>
              <Fade direction="up" cascade damping={0.1} triggerOnce={true}>
                <h1>संस्कृति संरक्षण, समुदाय सशक्तिकरण</h1>
                <p className="mb-5">नेपाल क्षेत्री समाज युएईमा तपाईंलाई स्वागत छ। हामी युएईमा रहेका क्षेत्री समुदायलाई एकताबद्ध गर्न, हाम्रो समृद्ध सम्पदाको जगेर्ना गर्न र हाम्रा सदस्यहरूलाई सहयोग प्रदान गर्न समर्पित छौं।</p>
                <div className="d-flex gap-3">
                  <Button href="#membership" className="btn-samaj">हाम्रो समुदायमा जोडिनुहोस्</Button>
                  <Button href="#about" variant="outline-light" className="rounded-pill px-5 py-3 border-2">हाम्रो कथा</Button>
                </div>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values / Features Section */}
      <section className="py-5 bg-light relative z-10">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Fade direction="up" delay={100} triggerOnce={true}>
                <Card className="feature-card h-100 border-0 shadow-lg rounded-4 p-4">
                  <Card.Body className="text-center">
                    <div className="feature-icon mb-4 bg-secondary/10 text-secondary rounded-circle d-inline-flex p-3">
                      <ShieldCheck size={32} />
                    </div>
                    <h4 className="font-serif fw-bold mb-3">संस्कृति संरक्षण</h4>
                    <p className="text-slate-500 mb-0">हामी हाम्रो समृद्ध सम्पदाको जगेर्ना गर्न र यसलाई भावी पुस्तामा हस्तान्तरण गर्न समर्पित छौं।</p>
                  </Card.Body>
                </Card>
              </Fade>
            </Col>
            <Col md={4}>
              <Fade direction="up" delay={200} triggerOnce={true}>
                <Card className="feature-card h-100 border-0 shadow-lg rounded-4 p-4">
                  <Card.Body className="text-center">
                    <div className="feature-icon mb-4 bg-primary/10 text-primary rounded-circle d-inline-flex p-3">
                      <Users size={32} />
                    </div>
                    <h4 className="font-serif fw-bold mb-3">समुदाय सशक्तिकरण</h4>
                    <p className="text-slate-500 mb-0">आपसी सहयोग र भ्रातृत्व मार्फत युएईमा क्षेत्री समुदायलाई एकताबद्ध गर्दै।</p>
                  </Card.Body>
                </Card>
              </Fade>
            </Col>
            <Col md={4}>
              <Fade direction="up" delay={300} triggerOnce={true}>
                <Card className="feature-card h-100 border-0 shadow-lg rounded-4 p-4">
                  <Card.Body className="text-center">
                    <div className="feature-icon mb-4 bg-dark/10 text-dark rounded-circle d-inline-flex p-3">
                      <UserPlus size={32} />
                    </div>
                    <h4 className="font-serif fw-bold mb-3">हाम्रो समुदायमा जोडिनुहोस्</h4>
                    <p className="text-slate-500 mb-0">आजै सदस्य बन्नुहोस् र विशेष लाभहरू र सहयोगी नेटवर्कमा पहुँच प्राप्त गर्नुहोस्।</p>
                  </Card.Body>
                </Card>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <section id="partners" className="section-padding bg-light border-bottom">
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-title">हाम्रा <span>साझेदारहरू</span></h2>
              <p className="text-slate-500">हामीलाई सहयोग पुर्याउने आदरणीय संस्थाहरू</p>
            </div>
            <Row className="align-items-center justify-content-center g-4">
              {partners.map(partner => (
                <Col md={3} sm={6} xs={12} key={partner.id}>
                  <Zoom triggerOnce={true}>
                    <Card className="partner-card h-100 border-0 shadow-sm p-4 text-center">
                      <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: '120px' }}>
                        <img src={partner.logo} alt={partner.name} className="partner-logo-large" referrerPolicy="no-referrer" />
                      </div>
                      <div className="mt-3">
                        <h6 className="mb-0 fw-bold text-dark">{partner.name}</h6>
                      </div>
                    </Card>
                  </Zoom>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="section-padding bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <Slide direction="left" triggerOnce={true}>
                <h2 className="section-title">हाम्रो <span>लक्ष्य</span> र दृष्टिकोण</h2>
                <p className="lead mb-4 fw-medium text-slate-600">नेपाल क्षेत्री समाज युएई युएईमा बसोबास गर्ने क्षेत्री समुदायबीच एकता र भ्रातृत्व प्रवर्द्धन गर्न स्थापित एक गैर-नाफामूलक सामुदायिक संस्था हो।</p>
                <p className="text-slate-500 mb-5 leading-relaxed">हाम्रो इतिहास युएईमा नेपाली प्रवासीहरूको सुरुवाती दिनहरूमा जान्छ, जहाँ दूरदर्शीहरूको समूहले सांस्कृतिक संरक्षण र आपसी सहयोगको लागि एक मञ्च सिर्जना गर्न एकजुट भएका थिए। आज, हामी हाम्रो समुदायको लागि एक बलियो स्तम्भको रूपमा उभिएका छौं।</p>
                <div className="d-flex gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-4 flex-fill">
                    <h3 className="font-serif text-primary mb-0">१५+</h3>
                    <small className="text-primary/70 uppercase fw-bold tracking-wider">वर्ष</small>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-4 flex-fill">
                    <h3 className="font-serif text-secondary mb-0">५k+</h3>
                    <small className="text-secondary/70 uppercase fw-bold tracking-wider">सदस्यहरू</small>
                  </div>
                </div>
              </Slide>
            </Col>
            <Col lg={6}>
              <Fade direction="right" triggerOnce={true}>
                <div className="position-relative">
                  <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop" alt="Community" className="img-fluid rounded-5 shadow-2xl" referrerPolicy="no-referrer" />
                  <div className="position-absolute bottom-0 start-0 glass p-4 m-4 rounded-4 shadow-lg">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white p-2 rounded-3"><ShieldCheck size={24} /></div>
                      <div>
                        <h6 className="mb-0 fw-bold">आधिकारिक संस्था</h6>
                        <small className="text-slate-500">युएईमा दर्ता गरिएको</small>
                      </div>
                    </div>
                  </div>
                </div>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* News Section */}
      {news.length > 0 && (
        <section id="news" className="section-padding bg-light/50">
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-title">पछिल्ला <span>जानकारीहरू</span></h2>
            </div>
            <Row>
              {news.map((item, idx) => (
                <Col md={4} key={item.id} className="mb-4">
                  <Fade direction="up" delay={idx * 100} triggerOnce={true}>
                    <Card className="card-modern h-100">
                      <div className="relative h-56 overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt={item.title} referrerPolicy="no-referrer" />
                      </div>
                      <Card.Body className="p-4">
                        <div className="text-primary small fw-bold mb-2 uppercase tracking-wider">{item.date}</div>
                        <Card.Title className="font-serif h4 mb-3">{item.title}</Card.Title>
                        <Card.Text className="text-slate-500">{item.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</Card.Text>
                        <Button variant="link" className="text-primary p-0 fw-bold text-decoration-none d-flex align-items-center gap-2">
                          थप पढ्नुहोस् <ArrowRight size={16} />
                        </Button>
                      </Card.Body>
                    </Card>
                  </Fade>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section id="gallery" className="section-padding bg-light">
          <Container>
            <div className="text-center mb-5">
              <h2 className="section-title">हाम्रा <span>क्षणहरू</span></h2>
            </div>
            <div className="gallery-grid">
              {gallery.map((item, idx) => (
                <Zoom key={item.id} delay={idx * 50} triggerOnce={true}>
                  <div className="gallery-item">
                    <img src={item.image} alt={item.title} referrerPolicy="no-referrer" />
                    <div className="overlay">
                      <h5 className="mb-0 font-serif">{item.title}</h5>
                    </div>
                  </div>
                </Zoom>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Membership Section */}
      <section id="membership" className="section-padding bg-primary text-white">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <Fade direction="left" triggerOnce={true}>
                <h2 className="font-serif display-4 fw-bold mb-4">हाम्रो समुदायमा जोडिनुहोस्</h2>
                <p className="fs-5 opacity-90 mb-5 leading-relaxed">युएईमा क्षेत्री संस्कृतिको उत्सव मनाउने र आपसी सहयोग प्रदान गर्ने सहयोगी नेटवर्कको हिस्सा बन्नुहोस्।</p>
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-circle"><UserPlus size={24} /></div>
                    <div>
                      <h5 className="mb-1 fw-bold">सदस्यताका फाइदाहरू</h5>
                      <p className="mb-0 opacity-70">विशेष कार्यक्रमहरू र सामुदायिक सहयोगमा पहुँच।</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-circle"><Calendar size={24} /></div>
                    <div>
                      <h5 className="mb-1 fw-bold">सांस्कृतिक कार्यक्रमहरू</h5>
                      <p className="mb-0 opacity-70">दशैं, तिहार र अन्य चाडपर्वहरू सँगै मनाऔं।</p>
                    </div>
                  </div>
                </div>
              </Fade>
            </Col>
            <Col lg={6}>
              <Fade direction="right" triggerOnce={true}>
                <Card className="membership-form-card rounded-5 p-5 text-dark shadow-2xl">
                  <h3 className="font-serif mb-4">दर्ता फारम</h3>
                  <Form onSubmit={async (e) => {
                    const currentForm = e.currentTarget;
                    e.preventDefault();
                    const formData = new FormData(currentForm);
                    const data = {
                      name: formData.get('name'),
                      email: formData.get('email'),
                      phone: formData.get('phone'),
                      honeypot: formData.get('website')
                    };
                    
                    try {
                      const res = await API.submitMembership(data);
                      if (res.message && (res.message.includes('successfully') || res.message.includes('सफलतापूर्वक'))) {
                        alert('आवेदन सफलतापूर्वक बुझाइयो! यसपछिको प्रक्रियाको लागि हाम्रो सदस्यले तपाईंलाई सम्पर्क गर्नुहुनेछ।');
                        currentForm.reset();
                      } else {
                        alert(res.message || 'त्रुटि भयो।');
                      }
                    } catch (error) {
                      alert('त्रुटि भयो: फेरि प्रयास गर्नुहोस्।');
                    }
                  }}>
                    {/* Honeypot field for anti-spam */}
                    <div style={{ display: 'none' }}>
                      <input name="website" tabIndex="-1" autoComplete="off" />
                    </div>
                    
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">पूरा नाम</Form.Label>
                      <Form.Control name="name" required className="bg-slate-50 form-input-samaj py-3 rounded-3" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">इमेल ठेगाना</Form.Label>
                      <Form.Control name="email" type="email" required className="bg-slate-50 form-input-samaj py-3 rounded-3" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">फोन नम्बर</Form.Label>
                      <Form.Control name="phone" required className="bg-slate-50 form-input-samaj py-3 rounded-3" />
                    </Form.Group>
                    <Button type="submit" className="btn-samaj w-100 py-3 fs-5">आवेदन बुझाउनुहोस्</Button>
                  </Form>
                </Card>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row className="g-5">
            <Col lg={4}>
              <h3 className="font-serif mb-4">नेपाल क्षेत्री समाज युएई</h3>
              <p className="text-slate-400 mb-4">संयुक्त अरब इमिरेट्समा क्षेत्री समुदायका लागि एकता बढाउँदै र सम्पदा संरक्षण गर्दै।</p>
              <div className="d-flex gap-3">
                <a href="#" className="text-white hover:text-primary transition-colors"><Facebook /></a>
                <a href="#" className="text-white hover:text-primary transition-colors"><Twitter /></a>
                <a href="#" className="text-white hover:text-primary transition-colors"><Instagram /></a>
              </div>
            </Col>
            <Col lg={2} md={6}>
              <h5 className="fw-bold mb-4">नेभिगेसन</h5>
              <Nav className="flex-column gap-2">
                <Nav.Link href="#home" className="text-slate-400 p-0 hover:text-white">गृहपृष्ठ</Nav.Link>
                <Nav.Link href="#about" className="text-slate-400 p-0 hover:text-white">हाम्रो बारेमा</Nav.Link>
                <Nav.Link href="#news" className="text-slate-400 p-0 hover:text-white">समाचार</Nav.Link>
              </Nav>
            </Col>
            <Col lg={3} md={6}>
              <h5 className="fw-bold mb-4">सम्पर्क जानकारी</h5>
              <div className="d-flex flex-column gap-3 text-slate-400">
                <div className="d-flex align-items-center gap-3"><MapPin size={18} /> दुबई, युएई</div>
                <div className="d-flex align-items-center gap-3"><Phone size={18} /> +९७१ ५० ००० ००००</div>
                <div className="d-flex align-items-center gap-3"><Mail size={18} /> info@chettrizamajuae.com</div>
              </div>
            </Col>
            <Col lg={3}>
              <h5 className="fw-bold mb-4">न्युजलेटर</h5>
              <Form className="d-flex gap-2">
                <Form.Control placeholder="इमेल" className="bg-slate-800 border-0 text-white rounded-pill px-4" />
                <Button className="btn-samaj p-2 rounded-circle"><ArrowRight size={20} /></Button>
              </Form>
            </Col>
          </Row>
          <hr className="border-slate-800 my-5" />
          <div className="text-center text-slate-500 small">
            &copy; {new Date().getFullYear()} नेपाल क्षेत्री समाज युएई। सबै अधिकार सुरक्षित।
          </div>
        </Container>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button 
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={24} />
        </Button>
      )}

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Body className="p-5">
          <div className="text-center mb-4">
            <ShieldCheck size={48} className="text-primary mb-3" />
            <h3 className="font-serif">एडमिन लगइन</h3>
            <p className="text-slate-500">व्यवस्थापन पोर्टलमा पहुँच गर्नुहोस्</p>
          </div>
          {loginError && <Alert variant="danger" className="py-2 small">{loginError}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold uppercase tracking-wider text-slate-400">प्रयोगकर्ता नाम</Form.Label>
              <Form.Control 
                required 
                className="bg-slate-50 form-input-samaj py-3 rounded-3"
                onChange={e => setLoginData({...loginData, username: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold uppercase tracking-wider text-slate-400">पासवर्ड</Form.Label>
              <Form.Control 
                type="password" 
                required 
                className="bg-slate-50 form-input-samaj py-3 rounded-3"
                onChange={e => setLoginData({...loginData, password: e.target.value})}
              />
            </Form.Group>
            <Button type="submit" className="btn-samaj w-100 py-3">ड्यासबोर्डमा लगइन गर्नुहोस्</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
