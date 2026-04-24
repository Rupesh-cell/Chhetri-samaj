import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import MembershipPage from './pages/MembershipPage';
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
  Alert,
  Badge
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

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
                      <th>सम्पर्क विवरण</th>
                      <th>पेशा र ठेगाना</th>
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
                            <div className="small text-primary">{item.email}</div>
                            <div className="x-small text-slate-400">
                              {item.gender} | {item.dob} | {item.blood_group}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold">{item.phone}</div>
                            <div className="small text-slate-400">UAE: {item.address_uae}</div>
                          </td>
                          <td>
                            <div className="small fw-bold">{item.occupation}</div>
                            <div className="x-small text-slate-400">{item.company}</div>
                            <div className="x-small text-slate-400">Nepal: {item.address_nepal}</div>
                          </td>
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
                    <Form.Label>तस्बिर (Upload Image)</Form.Label>
                    <div className="d-flex flex-column gap-3">
                      <div 
                        className="upload-zone border-2 border-dashed rounded-3 p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => document.getElementById('newsImageUpload').click()}
                      >
                        {formData.image ? (
                          <div className="relative group">
                            <img src={formData.image} alt="Preview" className="max-h-40 mx-auto rounded shadow-sm" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex align-items-center justify-center rounded">
                              <span className="text-white small">तस्बिर परिवर्तन गर्न क्लिक गर्नुहोस्</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-400 py-3">
                            <ImageIcon size={40} className="mx-auto mb-2 opacity-20" />
                            <p className="mb-0">यहाँ क्लिक गरेर तस्बिर अपलोड गर्नुहोस्</p>
                            <small className="text-slate-300">सिफारिस गरिएको: १६:९ साइज</small>
                          </div>
                        )}
                        <input 
                          id="newsImageUpload"
                          type="file" 
                          hidden 
                          accept="image/*" 
                          onChange={(e) => handleFileChange(e, 'image')} 
                        />
                      </div>
                      {/* Keep manual URL as fallback */}
                      <div>
                        <small className="text-slate-400 d-block mb-1">वा तस्बिरको URL सिधै राख्नुहोस्:</small>
                        <Form.Control 
                          className="form-input-samaj small py-2" 
                          placeholder="https://..."
                          value={formData.image || ''} 
                          onChange={e => setFormData({...formData, image: e.target.value})} 
                        />
                      </div>
                    </div>
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
                    <Form.Label>तस्बिर (Upload Image)</Form.Label>
                    <div 
                      className="upload-zone border-2 border-dashed rounded-3 p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => document.getElementById('galleryImageUpload').click()}
                    >
                      {formData.image ? (
                        <div className="relative group">
                          <img src={formData.image} alt="Preview" className="max-h-40 mx-auto rounded shadow-sm" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex align-items-center justify-center rounded">
                            <span className="text-white small">परिवर्तन गर्नुहोस्</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 py-3">
                          <ImageIcon size={40} className="mx-auto mb-2 opacity-20" />
                          <p className="mb-0">तस्बिर चयन गर्नुहोस्</p>
                        </div>
                      )}
                      <input 
                        id="galleryImageUpload"
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'image')} 
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <small className="text-slate-400">वा URL:</small>
                      <Form.Control className="form-input-samaj small py-1" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} />
                    </div>
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
                    <Form.Label>लोगो (Upload Logo)</Form.Label>
                    <div 
                      className="upload-zone border-2 border-dashed rounded-3 p-3 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => document.getElementById('partnerLogoUpload').click()}
                    >
                      {formData.logo ? (
                        <div className="relative group">
                          <img src={formData.logo} alt="Preview" className="max-h-20 mx-auto rounded" />
                        </div>
                      ) : (
                        <div className="text-slate-400 py-2">
                          <ImageIcon size={24} className="mx-auto mb-1 opacity-20" />
                          <p className="mb-0 small">लोगो अपलोड गर्नुहोस्</p>
                        </div>
                      )}
                      <input 
                        id="partnerLogoUpload"
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'logo')} 
                      />
                    </div>
                    <div className="mt-2">
                      <small className="text-slate-400 small">वा URL:</small>
                      <Form.Control className="form-input-samaj small py-1" value={formData.logo || ''} onChange={e => setFormData({...formData, logo: e.target.value})} />
                    </div>
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
  const navigate = useNavigate();
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <Routes>
      <Route path="/" element={
        <div className="samaj-website">
          {/* Navigation */}
          <Navbar 
            expand="lg" 
            fixed="top" 
            collapseOnSelect
            onToggle={(expanded) => setIsMenuOpen(expanded)}
            className={`navbar-samaj ${scrolled || isMenuOpen ? 'scrolled shadow-sm' : 'navbar-transparent'}`}
          >
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
                  <Nav.Link onClick={() => {
                    navigate('/membership');
                    setIsMenuOpen(false);
                  }}>आबद्ध हुनुहोस्</Nav.Link>
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
          <Row className="g-4 align-items-stretch">
            <Col md={4} className="d-flex">
              <Fade direction="up" delay={100} triggerOnce={true} className="w-100 d-flex">
                <Card className="feature-card h-100 border-0 shadow-lg rounded-4 p-4 flex-fill">
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
            <Col md={4} className="d-flex">
              <Fade direction="up" delay={200} triggerOnce={true} className="w-100 d-flex">
                <Card className="feature-card h-100 border-0 shadow-lg rounded-4 p-4 flex-fill">
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
            <Col md={4} className="d-flex">
              <Fade direction="up" delay={300} triggerOnce={true} className="w-100 d-flex">
                <Card className="feature-card h-100 border-0 shadow-lg rounded-4 p-4 flex-fill">
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
              <h2 className="section-title">हाम्रा <span>सहयोगी</span> संस्थाहरू</h2>
              <p className="lead text-slate-500">हाम्रो अभियानमा साथ दिने प्रतिष्ठित संस्थाहरू</p>
            </div>
            <Row className="g-4">
              {partners.map(partner => (
                <Col md={3} sm={6} xs={6} key={partner.id} className="mb-3 d-flex align-items-stretch">
                  <Zoom triggerOnce={true} className="w-100 d-flex">
                    <Card className="partner-card h-100 border-0 shadow-sm p-2 p-md-4 text-center flex-fill">
                      <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: '80px', maxHeight: '140px' }}>
                        <img src={partner.logo} alt={partner.name} className="partner-logo-large" style={{ maxWidth: '100%', height: 'auto', maxHeight: '60px' }} referrerPolicy="no-referrer" />
                      </div>
                      <div className="mt-2 mt-md-4">
                        <h6 className="mb-0 fw-bold small">{partner.name}</h6>
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
        <section id="news" className="section-padding bg-slate-50">
          <Container>
            <div className="text-center mb-5">
              <Fade direction="down" triggerOnce={true}>
                <h6 className="text-primary fw-bold uppercase tracking-widest mb-2">हाम्रा गतिविधिहरू</h6>
                <h2 className="section-title mb-0">पछिल्ला <span>जानकारीहरू</span></h2>
                <div className="mt-4 d-none d-md-block">
                  <Button 
                    variant="outline-primary" 
                    className="rounded-pill px-4 d-inline-flex align-items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
                    onClick={() => navigate('/news')}
                  >
                    सबै समाचारहरू हेर्नुहोस् <ArrowRight size={16} />
                  </Button>
                </div>
              </Fade>
            </div>

            <Row className="g-4">
              {/* Featured Post - The First One */}
              <Col lg={news.length > 1 ? 8 : 12}>
                <Fade direction="up" triggerOnce={true}>
                  <Card 
                    className="card-blog border-0 overflow-hidden shadow-sm h-100 group cursor-pointer" 
                    onClick={() => navigate(`/news/${news[0].id}`)}
                  >
                    <div className="row g-0 h-100">
                      <div className={news.length > 1 ? "col-md-7 h-100" : "col-md-6 h-100"}>
                        <div className="relative h-100 min-h-[350px] overflow-hidden">
                          <img 
                            src={news[0].image} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt={news[0].title}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge bg="primary" className="px-3 py-2 rounded-pill shadow-lg">ताजा समाचार</Badge>
                          </div>
                        </div>
                      </div>
                      <div className={news.length > 1 ? "col-md-5 d-flex align-items-center" : "col-md-6 d-flex align-items-center"}>
                        <Card.Body className="p-4 p-xl-5">
                          <div className="d-flex align-items-center gap-2 text-slate-400 small mb-3 fw-bold">
                            <Calendar size={14} className="text-primary" /> {news[0].date}
                          </div>
                          <h3 className="font-serif h2 mb-4 leading-tight group-hover:text-primary transition-colors text-slate-900 fw-bold">
                            {news[0].title}
                          </h3>
                          <p className="text-slate-500 mb-4 line-clamp-3 fs-5">
                            {news[0].content.replace(/<[^>]*>?/gm, '').substring(0, 180)}...
                          </p>
                          <div className="d-flex align-items-center gap-2 text-primary fw-bold">
                            थप पढ्नुहोस् <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                          </div>
                        </Card.Body>
                      </div>
                    </div>
                  </Card>
                </Fade>
              </Col>

              {/* Side Posts - 2nd and 3rd */}
              {news.length > 1 && (
                <Col lg={4}>
                  <div className="d-flex flex-column gap-4 h-100">
                    {news.slice(1, 3).map((item, idx) => (
                      <Fade key={item.id} direction="up" delay={idx * 150} triggerOnce={true}>
                        <Card 
                          className="card-blog border-0 shadow-sm overflow-hidden group cursor-pointer bg-white"
                          onClick={() => navigate(`/news/${item.id}`)}
                        >
                          <Card.Body className="p-3">
                            <div className="d-flex gap-3">
                              <div className="flex-shrink-0 w-28 h-28 rounded-4 overflow-hidden">
                                <img 
                                  src={item.image} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                  alt={item.title} 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-grow-1 py-1 d-flex flex-column justify-content-center">
                                <div className="text-primary x-small mb-1">{item.date}</div>
                                <h6 className="mb-2 line-clamp-2 font-serif fw-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                                  {item.title}
                                </h6>
                                <div className="text-slate-400 x-small d-flex align-items-center gap-1 mt-auto">
                                  थप पढ्नुहोस् <ArrowRight size={12} />
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Fade>
                    ))}
                  </div>
                </Col>
              )}

              {/* Grid for Remaining Posts (4th onwards) - Hidden on mobile to keep page concise */}
              {news.length > 3 && news.slice(3, 7).map((item, idx) => (
                <Col md={6} lg={4} xl={3} key={item.id} className="d-none d-md-block">
                  <Fade direction="up" delay={idx * 100} triggerOnce={true}>
                    <Card 
                      className="card-blog border-0 overflow-hidden shadow-sm h-100 group cursor-pointer bg-white" 
                      onClick={() => navigate(`/news/${item.id}`)}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={item.image} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          alt={item.title} 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/90 backdrop-blur px-2 py-1 rounded small fw-bold text-primary shadow-sm">
                            {item.date.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                      <Card.Body className="p-4 d-flex flex-column">
                        <h5 className="font-serif fw-bold text-slate-900 group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-tight">
                          {item.title}
                        </h5>
                        <p className="text-slate-500 small mb-4 line-clamp-2 flex-grow-1">
                          {item.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>
                        <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                          <span className="small text-slate-400">लेखक: एडमिसन</span>
                          <span className="text-primary fw-bold small d-flex align-items-center gap-1">
                            थप हेर्नुहोस् <ArrowRight size={14} />
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Fade>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-5 d-md-none">
              <Button 
                variant="outline-primary" 
                className="rounded-pill px-5 py-3 w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate('/news')}
              >
                सबै लेखहरू हेर्नुहोस् <ArrowRight size={18} />
              </Button>
            </div>
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
              {gallery.slice(0, 8).map((item, idx) => (
                <Zoom key={item.id} delay={idx * 50} triggerOnce={true} className={idx >= 4 ? "d-none d-md-block" : ""}>
                  <div className="gallery-item">
                    <img src={item.image} alt={item.title} referrerPolicy="no-referrer" />
                    <div className="overlay">
                      <h5 className="mb-0 font-serif small">{item.title}</h5>
                    </div>
                  </div>
                </Zoom>
              ))}
            </div>
            {gallery.length > 4 && (
              <div className="text-center mt-5">
                <Button variant="outline-primary" className="rounded-pill px-5">अरु तस्बिरहरू हेर्नुहोस्</Button>
              </div>
            )}
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
                <Card className="membership-form-card rounded-5 p-5 text-dark shadow-2xl h-100 d-flex flex-column justify-content-center text-center">
                  <UserPlus size={64} className="text-primary mx-auto mb-4" />
                  <h3 className="font-serif fw-bold mb-3">हाम्रो समाजमा आबद्ध हुनुहोस्</h3>
                  <p className="text-slate-600 mb-5 fs-5">
                    नेपाल क्षेत्री समाज युएईको सदस्य बनेर हाम्रो अभियानमा साथ दिनुहोस् र विभिन्न सामुदायिक फाइदाहरू प्राप्त गर्नुहोस्।
                  </p>
                  <div>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/membership')} 
                      className="rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg d-inline-flex align-items-center justify-content-center gap-2"
                    >
                      अहिले नै फारम भर्नुहोस् <ArrowRight size={20} />
                    </Button>
                  </div>
                </Card>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer-samaj py-5">
        <Container>
          <Row className="g-5">
            <Col lg={4}>
              <h3 className="font-serif mb-4">नेपाल क्षेत्री समाज युएई</h3>
              <p className="mb-4">संयुक्त अरब इमिरेट्समा क्षेत्री समुदायका लागि एकता बढाउँदै र सम्पदा संरक्षण गर्दै।</p>
              <div className="d-flex gap-3">
                <a href="#" className="transition-colors"><Facebook /></a>
                <a href="#" className="transition-colors"><Twitter /></a>
                <a href="#" className="transition-colors"><Instagram /></a>
              </div>
            </Col>
            <Col lg={2} md={6}>
              <h5 className="fw-bold mb-4">नेभिगेसन</h5>
              <Nav className="flex-column gap-2">
                <Nav.Link href="#home" className="p-0">गृहपृष्ठ</Nav.Link>
                <Nav.Link href="#about" className="p-0">हाम्रो बारेमा</Nav.Link>
                <Nav.Link href="#news" className="p-0">समाचार</Nav.Link>
                <Nav.Link onClick={() => navigate('/membership')} className="p-0 pointer">आबद्ध हुनुहोस्</Nav.Link>
              </Nav>
            </Col>
            <Col lg={3} md={6}>
              <h5 className="fw-bold mb-4">सम्पर्क जानकारी</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3"><MapPin size={18} /> दुबई, युएई</div>
                <div className="d-flex align-items-center gap-3"><Phone size={18} /> +९७१ ५० ००० ००००</div>
                <div className="d-flex align-items-center gap-3"><Mail size={18} /> info@chettrizamajuae.com</div>
              </div>
            </Col>
            <Col lg={3}>
              <h5 className="fw-bold mb-4">न्युजलेटर</h5>
              <Form className="d-flex gap-2">
                <Form.Control placeholder="इमेल" className="bg-white/10 border-0 text-white rounded-pill px-4" />
                <Button className="btn-samaj p-2 rounded-circle"><ArrowRight size={20} /></Button>
              </Form>
            </Col>
          </Row>
          <hr className="border-white/10 my-5" />
          <div className="text-center small">
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

      {/* Login Modal (Inside Home Page or global? Putting it inside Home for now or keeping it in the div) */}
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
    </div>} />
      <Route path="/news" element={<NewsList />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/membership" element={<MembershipPage />} />
    </Routes>
  );
}
