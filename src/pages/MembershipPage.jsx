import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Info, MapPin, Briefcase, Droplets } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';

const API = {
  submitMembership: async (data) => {
    const res = await fetch('/api/membership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

const MembershipPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError(null);
    setValidated(true);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Rename website to honeypot
    data.honeypot = data.website;
    delete data.website;

    try {
      const res = await API.submitMembership(data);
      if (res.message && (res.message.includes('successfully') || res.message.includes('सफलतापूर्वक'))) {
        setSubmitted(true);
      } else {
        setError(res.message || 'त्रुटि भयो।');
      }
    } catch (err) {
      setError('सर्भरसँग जडान हुन सकेन। पछि फेरि प्रयास गर्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-vh-100 bg-slate-50 d-flex align-items-center justify-content-center p-4">
        <Fade>
          <Card className="border-0 shadow-lg p-5 text-center max-w-lg rounded-5">
            <div className="bg-success/10 text-success w-20 h-20 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4">
              <UserPlus size={40} />
            </div>
            <h2 className="font-serif fw-bold mb-3">धन्यवाद!</h2>
            <p className="text-slate-600 mb-4">
              तपाईंको सदस्यता आवेदन सफलतापूर्वक प्राप्त भएको छ। समाजको तर्फबाट तपाईंलाई चाँडै सम्पर्क गरिनेछ।
            </p>
            <Button variant="primary" onClick={() => navigate('/')} className="rounded-pill px-5 py-3 fw-bold">
              गृहपृष्ठमा फर्कनुहोस्
            </Button>
          </Card>
        </Fade>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-slate-50 pb-20">
      <div className="bg-primary pt-32 pb-20 text-white text-center">
        <Container>
          <Fade direction="up" triggerOnce={true}>
            <Link to="/" className="inline-flex align-items-center gap-2 text-white/70 hover:text-white mb-4 text-decoration-none transition-all group">
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-2" /> गृहपृष्ठ
            </Link>
            <h1 className="font-serif display-4 fw-bold mb-2">सदस्यता आवेदन</h1>
            <p className="opacity-80 max-w-2xl mx-auto">नेपाल क्षेत्री समाज युएईको सदस्य बन्नका लागि कृपया तलको फारम भर्नुहोस्।</p>
          </Fade>
        </Container>
      </div>

      <Container className="mt-n5 relative z-10">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Fade direction="up" triggerOnce={true}>
              <Card className="border-0 shadow-2xl rounded-5 overflow-hidden">
                <Card.Body className="p-4 p-md-5">
                  {error && <Alert variant="danger" className="mb-4 rounded-4">{error}</Alert>}
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* Honeypot field for anti-spam */}
                    <div style={{ display: 'none' }}>
                      <input name="website" tabIndex="-1" autoComplete="off" />
                    </div>

                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 text-primary mb-4 pb-2 border-bottom border-slate-100">
                        <Info size={20} />
                        <h5 className="mb-0 fw-bold">व्यक्तिगत विवरण (Personal Details)</h5>
                      </div>
                      
                      <Row className="g-4">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">पूरा नाम (Full Name)</Form.Label>
                            <Form.Control 
                              name="name" 
                              required 
                              minLength={3}
                              maxLength={100}
                              placeholder="नेपाली वा अंग्रेजीमा" 
                              className="form-input-samaj py-3 rounded-3" 
                            />
                            <Form.Control.Feedback type="invalid">कृपया कम्तिमा ३ अक्षरको नाम राख्नुहोस्।</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">लिङ्ग (Gender)</Form.Label>
                            <Form.Select name="gender" required className="form-input-samaj py-3 rounded-3 shadow-none pointer">
                              <option value="">छान्नुहोस्...</option>
                              <option value="Male">पुरुष (Male)</option>
                              <option value="Female">महिला (Female)</option>
                              <option value="Other">अन्य (Other)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">जन्म मिति (Date of Birth)</Form.Label>
                            <Form.Control name="dob" type="date" required className="form-input-samaj py-3 rounded-3" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">रक्त समूह (Blood Group)</Form.Label>
                            <Form.Select name="blood_group" className="form-input-samaj py-3 rounded-3 shadow-none pointer">
                              <option value="">छान्नुहोस्...</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 text-primary mb-4 pb-2 border-bottom border-slate-100">
                        <MapPin size={20} />
                        <h5 className="mb-0 fw-bold">सम्पर्क र ठेगाना (Contact & Address)</h5>
                      </div>
                      
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">फोन नम्बर (Phone Number)</Form.Label>
                            <Form.Control 
                              name="phone" 
                              required 
                              pattern="^\+?[0-9\s]{7,15}$"
                              placeholder="+971" 
                              className="form-input-samaj py-3 rounded-3" 
                            />
                            <Form.Text className="text-muted small">उदा: +971 50 1234567</Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">इमेल (Email Address)</Form.Label>
                            <Form.Control 
                              name="email" 
                              type="email" 
                              required 
                              maxLength={100}
                              placeholder="example@email.com" 
                              className="form-input-samaj py-3 rounded-3" 
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">हालको ठेगाना (Current Address in UAE)</Form.Label>
                            <Form.Control 
                              name="address_uae" 
                              required 
                              minLength={5}
                              maxLength={200}
                              placeholder="Emirate, Area Name" 
                              className="form-input-samaj py-3 rounded-3" 
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">स्थायी ठेगाना - नेपाल (Permanent Address - Nepal)</Form.Label>
                            <Form.Control 
                              name="address_nepal" 
                              required 
                              minLength={5}
                              maxLength={200}
                              placeholder="District, Municipality/Rural Municipality" 
                              className="form-input-samaj py-3 rounded-3" 
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 text-primary mb-4 pb-2 border-bottom border-slate-100">
                        <Briefcase size={20} />
                        <h5 className="mb-0 fw-bold">पेशा र रोजगार (Profession & Employment)</h5>
                      </div>
                      
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">पेशा (Occupation)</Form.Label>
                            <Form.Control 
                              name="occupation" 
                              maxLength={100}
                              placeholder="Your role/job" 
                              className="form-input-samaj py-3 rounded-3" 
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold small uppercase tracking-wider text-slate-400">कम्पनीको नाम (Company Name)</Form.Label>
                            <Form.Control 
                              name="company" 
                              maxLength={100}
                              placeholder="Working at" 
                              className="form-input-samaj py-3 rounded-3" 
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="btn-samaj w-100 py-3 fs-5 rounded-pill shadow-lg d-flex align-items-center justify-content-center gap-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                            प्रक्रियामा छ...
                          </>
                        ) : (
                          <>सदस्यता आवेदन बुझाउनुहोस्</>
                        )}
                      </Button>
                      <p className="text-center mt-4 small text-slate-400">
                        आवेदन बुझाएर तपाईं समाजको विधान र नियमहरू पालना गर्न सहमत हुनुहुन्छ।
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Fade>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MembershipPage;
