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
    if (!window.confirm('Are you sure you want to delete this item?')) return;
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
            <h5 className="mb-0">Samaj Admin</h5>
            <small>Management Portal</small>
          </div>
        </div>
        
        <Nav className="flex-column sidebar-nav">
          <Nav.Link 
            onClick={() => setActiveTab('membership')} 
            className={`nav-item ${activeTab === 'membership' ? 'active' : ''}`}
          >
            <Users size={20} /> 
            <span>Memberships</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('news')} 
            className={`nav-item ${activeTab === 'news' ? 'active' : ''}`}
          >
            <Newspaper size={20} /> 
            <span>News & Updates</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('gallery')} 
            className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
          >
            <ImageIcon size={20} /> 
            <span>Gallery</span>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('partners')} 
            className={`nav-item ${activeTab === 'partners' ? 'active' : ''}`}
          >
            <ShieldCheck size={20} /> 
            <span>Partners</span>
          </Nav.Link>
          
          <div className="mt-auto pt-4 border-top border-white/10">
            <Nav.Link onClick={onLogout} className="nav-item logout">
              <LogOut size={20} /> 
              <span>Sign Out</span>
            </Nav.Link>
          </div>
        </Nav>
      </div>

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h2 className="page-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="page-subtitle">Manage your community {activeTab} content</p>
          </div>
          <div className="header-right">
            {activeTab !== 'membership' && (
              <Button onClick={openAddModal} className="btn-add">
                <Plus size={18} /> Add New
              </Button>
            )}
          </div>
        </header>

        <div className="admin-content-card">
          {loading ? (
            <div className="p-5 text-center text-slate-400">Loading data...</div>
          ) : (
            <Table hover responsive className="admin-table">
              <thead>
                <tr>
                  {activeTab === 'membership' && (
                    <>
                      <th>Applicant Info</th>
                      <th>Contact</th>
                      <th>Status</th>
                    </>
                  )}
                  {activeTab === 'news' && (
                    <>
                      <th>Article Title</th>
                      <th>Publish Date</th>
                    </>
                  )}
                  {activeTab === 'gallery' && (
                    <>
                      <th>Image Title</th>
                      <th>Preview</th>
                    </>
                  )}
                  {activeTab === 'partners' && (
                    <>
                      <th>Partner Name</th>
                      <th>Logo</th>
                    </>
                  )}
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data[activeTab].length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-5 text-slate-400">No records found</td>
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
                              {item.status}
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
                              Approve
                            </Button>
                          )}
                          {activeTab !== 'membership' && (
                            <Button 
                              variant="link" 
                              onClick={() => handleEdit(item)} 
                              className="btn-action-edit text-slate-400 hover:text-primary"
                            >
                              Edit
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
            <Modal.Title>{isEditing ? 'Edit' : 'Create New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {activeTab === 'news' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control required placeholder="e.g. March 8, 2026" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control required value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <div className="quill-wrapper bg-white rounded-3 overflow-hidden border">
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
                    <Form.Label>Title</Form.Label>
                    <Form.Control required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control required value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </Form.Group>
                </>
              )}
              {activeTab === 'partners' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Partner Name</Form.Label>
                    <Form.Control required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Logo URL</Form.Label>
                    <Form.Control required value={formData.logo || ''} onChange={e => setFormData({...formData, logo: e.target.value})} />
                  </Form.Group>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" className="btn-save">{isEditing ? 'Update Changes' : 'Publish Now'}</Button>
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
      setLoginError('Invalid username or password');
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
          <Navbar.Brand href="#home" className="fw-bold">Nepal Chettri Samaj UAE</Navbar.Brand>
          <Navbar.Toggle aria-controls="samaj-nav" className="border-0 shadow-none">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="samaj-nav" className="justify-content-end">
            <Nav className="align-items-center">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              {news.length > 0 && <Nav.Link href="#news">News</Nav.Link>}
              {gallery.length > 0 && <Nav.Link href="#gallery">Gallery</Nav.Link>}
              <Nav.Link href="#membership">Join</Nav.Link>
              <Button 
                variant="link" 
                onClick={() => setShowLogin(true)} 
                className="nav-link text-primary fw-bold border-0 bg-transparent"
              >
                Admin
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
                <h1>Preserving Culture, Empowering Community</h1>
                <p className="mb-5">Welcome to Nepal Chettri Samaj UAE. We are dedicated to uniting the Chettri community in the UAE, preserving our rich heritage, and providing support to our members.</p>
                <div className="d-flex gap-3">
                  <Button href="#membership" className="btn-samaj">Join Our Community</Button>
                  <Button href="#about" variant="outline-light" className="rounded-pill px-5 py-3 border-2">Our Story</Button>
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
                    <h4 className="font-serif fw-bold mb-3">Preserving Culture</h4>
                    <p className="text-slate-500 mb-0">We are dedicated to preserving our rich heritage and passing it to the next generation.</p>
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
                    <h4 className="font-serif fw-bold mb-3">Empowering Community</h4>
                    <p className="text-slate-500 mb-0">Uniting the Chettri community in the UAE through mutual support and brotherhood.</p>
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
                    <h4 className="font-serif fw-bold mb-3">Join Our Community</h4>
                    <p className="text-slate-500 mb-0">Become a member today and access exclusive benefits and a supportive network.</p>
                  </Card.Body>
                </Card>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-5 bg-light border-bottom">
          <Container>
            <Row className="align-items-center justify-content-center gap-5">
              {partners.map(partner => (
                <Col xs="auto" key={partner.id}>
                  <Zoom triggerOnce={true}>
                    <img src={partner.logo} alt={partner.name} className="partner-logo" referrerPolicy="no-referrer" />
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
                <h2 className="section-title">Our <span>Mission</span> & Vision</h2>
                <p className="lead mb-4 fw-medium text-slate-600">Nepal Chettri Samaj UAE is a non-profit community organization established to foster unity and brotherhood among the Chettri community residing in the UAE.</p>
                <p className="text-slate-500 mb-5 leading-relaxed">Our history dates back to the early days of the Nepali diaspora in the UAE, where a group of visionaries came together to create a platform for cultural preservation and mutual support. Today, we stand as a strong pillar for our community.</p>
                <div className="d-flex gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-4 flex-fill">
                    <h3 className="font-serif text-primary mb-0">15+</h3>
                    <small className="text-primary/70 uppercase fw-bold tracking-wider">Years</small>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-4 flex-fill">
                    <h3 className="font-serif text-secondary mb-0">5k+</h3>
                    <small className="text-secondary/70 uppercase fw-bold tracking-wider">Members</small>
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
                        <h6 className="mb-0 fw-bold">Official Organization</h6>
                        <small className="text-slate-500">Registered in UAE</small>
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
              <h2 className="section-title">Latest <span>Updates</span></h2>
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
                          Read Story <ArrowRight size={16} />
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
              <h2 className="section-title">Our <span>Moments</span></h2>
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
                <h2 className="font-serif display-4 fw-bold mb-4">Join Our Community</h2>
                <p className="fs-5 opacity-90 mb-5 leading-relaxed">Be part of a supportive network that celebrates Chettri culture and provides mutual aid in the UAE.</p>
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-circle"><UserPlus size={24} /></div>
                    <div>
                      <h5 className="mb-1 fw-bold">Member Benefits</h5>
                      <p className="mb-0 opacity-70">Access to exclusive events and community support.</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-circle"><Calendar size={24} /></div>
                    <div>
                      <h5 className="mb-1 fw-bold">Cultural Events</h5>
                      <p className="mb-0 opacity-70">Celebrate Dashain, Tihar and more together.</p>
                    </div>
                  </div>
                </div>
              </Fade>
            </Col>
            <Col lg={6}>
              <Fade direction="right" triggerOnce={true}>
                <Card className="border-0 rounded-5 p-5 text-dark shadow-2xl">
                  <h3 className="font-serif mb-4">Registration Form</h3>
                  <Form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                      name: formData.get('name'),
                      email: formData.get('email'),
                      phone: formData.get('phone')
                    };
                    await API.submitMembership(data);
                    alert('Application submitted successfully!');
                    e.currentTarget.reset();
                  }}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">Full Name</Form.Label>
                      <Form.Control name="name" required className="bg-slate-50 border-0 py-3 rounded-3" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">Email Address</Form.Label>
                      <Form.Control name="email" type="email" required className="bg-slate-50 border-0 py-3 rounded-3" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">Phone Number</Form.Label>
                      <Form.Control name="phone" required className="bg-slate-50 border-0 py-3 rounded-3" />
                    </Form.Group>
                    <Button type="submit" className="btn-samaj w-100 py-3 fs-5">Submit Application</Button>
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
              <h3 className="font-serif mb-4">Nepal Chettri Samaj UAE</h3>
              <p className="text-slate-400 mb-4">Fostering unity and preserving heritage for the Chettri community in the United Arab Emirates.</p>
              <div className="d-flex gap-3">
                <a href="#" className="text-white hover:text-primary transition-colors"><Facebook /></a>
                <a href="#" className="text-white hover:text-primary transition-colors"><Twitter /></a>
                <a href="#" className="text-white hover:text-primary transition-colors"><Instagram /></a>
              </div>
            </Col>
            <Col lg={2} md={6}>
              <h5 className="fw-bold mb-4">Navigation</h5>
              <Nav className="flex-column gap-2">
                <Nav.Link href="#home" className="text-slate-400 p-0 hover:text-white">Home</Nav.Link>
                <Nav.Link href="#about" className="text-slate-400 p-0 hover:text-white">About</Nav.Link>
                <Nav.Link href="#news" className="text-slate-400 p-0 hover:text-white">News</Nav.Link>
              </Nav>
            </Col>
            <Col lg={3} md={6}>
              <h5 className="fw-bold mb-4">Contact Info</h5>
              <div className="d-flex flex-column gap-3 text-slate-400">
                <div className="d-flex align-items-center gap-3"><MapPin size={18} /> Dubai, UAE</div>
                <div className="d-flex align-items-center gap-3"><Phone size={18} /> +971 50 000 0000</div>
                <div className="d-flex align-items-center gap-3"><Mail size={18} /> info@chettrizamajuae.com</div>
              </div>
            </Col>
            <Col lg={3}>
              <h5 className="fw-bold mb-4">Newsletter</h5>
              <Form className="d-flex gap-2">
                <Form.Control placeholder="Email" className="bg-slate-800 border-0 text-white rounded-pill px-4" />
                <Button className="btn-samaj p-2 rounded-circle"><ArrowRight size={20} /></Button>
              </Form>
            </Col>
          </Row>
          <hr className="border-slate-800 my-5" />
          <div className="text-center text-slate-500 small">
            &copy; {new Date().getFullYear()} Nepal Chettri Samaj UAE. All Rights Reserved.
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
            <h3 className="font-serif">Admin Login</h3>
            <p className="text-slate-500">Access the management portal</p>
          </div>
          {loginError && <Alert variant="danger" className="py-2 small">{loginError}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold uppercase tracking-wider text-slate-400">Username</Form.Label>
              <Form.Control 
                required 
                className="bg-slate-50 border-0 py-3 rounded-3"
                onChange={e => setLoginData({...loginData, username: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold uppercase tracking-wider text-slate-400">Password</Form.Label>
              <Form.Control 
                type="password" 
                required 
                className="bg-slate-50 border-0 py-3 rounded-3"
                onChange={e => setLoginData({...loginData, password: e.target.value})}
              />
            </Form.Group>
            <Button type="submit" className="btn-samaj w-100 py-3">Login to Dashboard</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
