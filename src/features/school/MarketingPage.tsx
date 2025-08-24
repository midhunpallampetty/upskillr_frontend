import React, { useEffect, useState } from 'react';
import { getSubdomain } from '../../utils/getSubdomain';

const MarketingPage: React.FC = () => {
  const [schoolData, setSchoolData] = useState({
    name: "EduVia Academy",
    email: `info@eduvia.space`,
    phone: '+1 (555) 123-4567',
    address: '123 Education Boulevard, Knowledge City, 00000',
    description: 'Transform your future with industry-leading education designed for real-world success.',
    foundedYear: '2015',
    studentsGraduated: '10,000+',
    successRate: '95%'
  });

  function getPage(url: string) {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    
    if (parts.length > 2) {
      return parts[0];
    }
    return null;
  }

  useEffect(() => {
    const subdomain = getSubdomain();
    if (subdomain) {
      const fetchSchoolData = async () => {
        try {
          const response = await fetch(`/api/school/${subdomain}`);
          if (response.ok) {
            const data = await response.json();
            setSchoolData({
              name: data.name || schoolData.name,
              email: data.email || schoolData.email,
              phone: data.phone || schoolData.phone,
              address: data.address || schoolData.address,
              description: data.description || schoolData.description,
              foundedYear: data.foundedYear || schoolData.foundedYear,
              studentsGraduated: data.studentsGraduated || schoolData.studentsGraduated,
              successRate: data.successRate || schoolData.successRate,
            });
          } else {
            console.error('School not found');
          }
        } catch (error) {
          console.error('Error fetching school data:', error);
        }
      };
      fetchSchoolData();
    }
  }, []);

  // SEO and meta tag updates (keeping your existing implementation)
  useEffect(() => {
    document.title = `${schoolData.name} - Transform Your Career with Expert-Led Courses`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `${schoolData.description} Join ${schoolData.studentsGraduated} successful graduates. Flexible learning, industry certification, career support.`);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `${schoolData.description} Join ${schoolData.studentsGraduated} successful graduates.`;
      document.head.appendChild(meta);
    }

    const updateOrCreateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (metaTag) {
        metaTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMetaTag('og:title', `${schoolData.name} - Expert Learning Platform`);
    updateOrCreateMetaTag('og:description', schoolData.description);
    updateOrCreateMetaTag('og:url', 'https://eduvia.space');
  }, [schoolData]);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#2d3748", lineHeight: "1.7" }}>
      
      {/* Hero Section - Enhanced */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "5rem 1rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "700", 
            marginBottom: "1.5rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}>
            Launch Your Dream Career with {schoolData.name}
          </h1>
          <p style={{ 
            fontSize: "1.4rem", 
            fontWeight: "300", 
            maxWidth: "700px", 
            margin: "0 auto 2.5rem auto",
            opacity: "0.95"
          }}>
            {schoolData.description} Join {schoolData.studentsGraduated} successful graduates who transformed their lives through our proven learning system.
          </p>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <button
              style={{
                backgroundColor: "#f6ad55",
                border: "none",
                color: "white",
                padding: "1.2rem 3rem",
                fontSize: "1.3rem",
                fontWeight: "600",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(246,173,85,0.6)",
                transition: "transform 0.3s ease"
              }}
              onClick={() => window.location.href = "#courses"}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Explore Courses
            </button>
            <button
              style={{
                backgroundColor: "transparent",
                border: "2px solid white",
                color: "white",
                padding: "1.2rem 3rem",
                fontSize: "1.3rem",
                fontWeight: "600",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onClick={() => window.location.href = "#contact"}
            >
              Get Free Consultation
            </button>
          </div>

          {/* Trust Indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", fontSize: "1.1rem" }}>
            <div>
              <strong>{schoolData.studentsGraduated}</strong><br />
              <span style={{ opacity: "0.9" }}>Graduates</span>
            </div>
            <div>
              <strong>{schoolData.successRate}</strong><br />
              <span style={{ opacity: "0.9" }}>Success Rate</span>
            </div>
            <div>
              <strong>Since {schoolData.foundedYear}</strong><br />
              <span style={{ opacity: "0.9" }}>Trusted Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - Enhanced */}
      <section style={{ padding: "4rem 1rem", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            About {schoolData.name}
          </h2>
          <div style={{ width: "80px", height: "4px", backgroundColor: "#667eea", margin: "0 auto" }}></div>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#4a5568" }}>Our Mission</h3>
            <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem", color: "#718096" }}>
              Since {schoolData.foundedYear}, {schoolData.name} has been at the forefront of transforming lives through education. 
              We believe that quality learning should be accessible, practical, and career-focused.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#718096" }}>
              Our expert instructors bring real-world experience from leading companies, ensuring you learn skills that employers actually need. 
              With a {schoolData.successRate} job placement rate and {schoolData.studentsGraduated} successful graduates, we're committed to your success.
            </p>
          </div>
          
          <div style={{ backgroundColor: "#f7fafc", padding: "2rem", borderRadius: "12px" }}>
            <h3 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", color: "#4a5568" }}>Our Achievements</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                "Industry-recognized certifications",
                "Partnership with Fortune 500 companies",
                "Award-winning online learning platform",
                "24/7 student support system",
                "Global alumni network in 50+ countries"
              ].map((achievement, index) => (
                <li key={index} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginBottom: "1rem", 
                  fontSize: "1.1rem",
                  color: "#4a5568" 
                }}>
                  <span style={{ 
                    color: "#38a169", 
                    marginRight: "0.5rem", 
                    fontSize: "1.3rem" 
                  }}>✓</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced */}
      <section style={{ backgroundColor: "#edf2f7", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            Why {schoolData.name} is Your Best Choice
          </h2>
          <p style={{ fontSize: "1.2rem", color: "#718096", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
            We don't just teach courses – we build careers. Here's what sets us apart from other learning platforms.
          </p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem"
          }}>
            {[
              {
                icon: "👨‍🏫",
                title: "Industry Expert Instructors",
                description: "Learn from professionals currently working at Google, Microsoft, Amazon, and other leading companies."
              },
              {
                icon: "🎯",
                title: "Job-Ready Skills",
                description: "Our curriculum is designed with hiring managers. Focus on skills that get you hired, not just theory."
              },
              {
                icon: "💼",
                title: "Career Support Guarantee",
                description: "Resume reviews, interview preparation, and job placement assistance until you land your dream role."
              },
              {
                icon: "⏰",
                title: "Learn at Your Pace",
                description: "Flexible scheduling with live classes, recorded sessions, and self-paced modules to fit your lifestyle."
              },
              {
                icon: "🏆",
                title: "Industry Certifications",
                description: "Earn recognized credentials from Google, AWS, Microsoft, and other industry leaders."
              },
              {
                icon: "🤝",
                title: "Lifetime Community Access",
                description: "Join our exclusive alumni network, get mentorship, and access job opportunities forever."
              }
            ].map(({ icon, title, description }) => (
              <div key={title} style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                textAlign: "center",
                transition: "transform 0.3s ease"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "1rem", color: "#2d3748" }}>{title}</h3>
                <p style={{ color: "#718096", lineHeight: "1.6" }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section - Enhanced */}
      <section id="courses" style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
              Transform Your Career with Our Expert-Led Courses
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#718096", maxWidth: "700px", margin: "0 auto" }}>
              Choose from our carefully crafted programs designed to get you job-ready in months, not years.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem"
          }}>
            {[
              {
                title: "Full-Stack Web Development Bootcamp",
                duration: "16 weeks",
                level: "Beginner to Advanced",
                description: "Master React, Node.js, databases, and cloud deployment. Build 5 real projects for your portfolio.",
                highlights: ["Live coding sessions", "1-on-1 mentorship", "Job guarantee program"],
                salary: "$70,000 - $120,000",
                popular: true
              },
              {
                title: "Data Science & AI Mastery",
                duration: "20 weeks",
                level: "Intermediate",
                description: "Python, machine learning, deep learning, and big data. Work with real datasets from top companies.",
                highlights: ["Kaggle competitions", "Industry capstone project", "ML model deployment"],
                salary: "$80,000 - $140,000",
                popular: false
              },
              {
                title: "Digital Marketing & Growth Hacking",
                duration: "12 weeks",
                level: "All levels",
                description: "SEO, social media, PPC, analytics, and conversion optimization. Launch real campaigns.",
                highlights: ["Google Ads certification", "Real budget campaigns", "Agency partnerships"],
                salary: "$50,000 - $90,000",
                popular: false
              },
              {
                title: "UX/UI Design Professional",
                duration: "14 weeks",
                level: "Beginner to Advanced",
                description: "User research, wireframing, prototyping, and visual design. Create a stunning portfolio.",
                highlights: ["Design system creation", "Client project work", "Portfolio reviews"],
                salary: "$60,000 - $110,000",
                popular: true
              },
              {
                title: "Cloud Computing & DevOps",
                duration: "18 weeks",
                level: "Intermediate",
                description: "AWS, Docker, Kubernetes, CI/CD pipelines. Get certified and deployment-ready.",
                highlights: ["AWS certification prep", "Production deployments", "Infrastructure automation"],
                salary: "$85,000 - $150,000",
                popular: false
              },
              {
                title: "Cybersecurity Specialist",
                duration: "16 weeks",
                level: "Intermediate",
                description: "Ethical hacking, network security, compliance, and incident response. Hands-on labs included.",
                highlights: ["CEH certification prep", "Live hacking simulations", "Security audits"],
                salary: "$75,000 - $130,000",
                popular: false
              }
            ].map(({ title, duration, level, description, highlights, salary, popular }) => (
              <div key={title} style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
                position: "relative",
                border: popular ? "3px solid #f6ad55" : "1px solid #e2e8f0"
              }}>
                {popular && (
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#f6ad55",
                    color: "white",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}>
                    Most Popular
                  </div>
                )}
                
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem", color: "#2d3748" }}>
                  {title}
                </h3>
                
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: "0.9rem", color: "#718096" }}>
                  <span>📅 {duration}</span>
                  <span>📊 {level}</span>
                </div>
                
                <p style={{ color: "#4a5568", marginBottom: "1.5rem", lineHeight: "1.6" }}>{description}</p>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2d3748" }}>
                    What You'll Get:
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {highlights.map((highlight, index) => (
                      <li key={index} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        marginBottom: "0.5rem",
                        color: "#4a5568" 
                      }}>
                        <span style={{ color: "#38a169", marginRight: "0.5rem" }}>✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ 
                  backgroundColor: "#f7fafc", 
                  padding: "1rem", 
                  borderRadius: "8px", 
                  marginBottom: "1.5rem" 
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#4a5568" }}>
                    <strong>Average Salary:</strong> {salary}
                  </p>
                </div>
                
                <button
                  style={{
                    width: "100%",
                    backgroundColor: popular ? "#f6ad55" : "#667eea",
                    color: "white",
                    border: "none",
                    padding: "1rem",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => window.location.href = "#contact"}
                >
                  Start This Course
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section style={{ backgroundColor: "#2d3748", color: "white", padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
            Success Stories That Inspire Us Daily
          </h2>
          <p style={{ fontSize: "1.2rem", opacity: "0.9", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
            Real students, real results. See how {schoolData.name} transformed their careers and lives.
          </p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem"
          }}>
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                course: "Full-Stack Development",
                image: "👩‍💻",
                quote: "I went from restaurant server to Google engineer in 8 months. The instructors didn't just teach me to code – they taught me to think like a developer. The job support was incredible; they helped me negotiate a $95k starting salary.",
                outcome: "Career change • $95k salary • 8 months"
              },
              {
                name: "Marcus Johnson",
                role: "Senior Data Scientist",
                course: "Data Science & AI",
                image: "👨‍🔬",
                quote: "After 10 years in finance, I wanted a change. The hands-on projects with real datasets gave me confidence. Now I'm building ML models that impact millions of users. Best investment I ever made.",
                outcome: "Career pivot • 40% salary increase • 6 months"
              },
              {
                name: "Priya Patel",
                role: "Digital Marketing Director",
                course: "Digital Marketing",
                image: "👩‍💼",
                quote: "I started my own agency 3 months after graduation. The real campaign experience and client connections from the course were game-changers. I'm now managing $500k+ in ad spend monthly.",
                outcome: "Started business • $500k+ managed • 3 months"
              },
              {
                name: "David Kim",
                role: "Lead UX Designer",
                course: "UX/UI Design",
                image: "👨‍🎨",
                quote: "The portfolio I built during the course landed me interviews at 5 top companies. The design thinking methodology they teach is what sets their graduates apart. I got multiple offers!",
                outcome: "5 interviews • Multiple offers • Lead position"
              }
            ].map(({ name, role, course, image, quote, outcome }) => (
              <div key={name} style={{
                backgroundColor: "white",
                color: "#2d3748",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                position: "relative"
              }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{image}</div>
                <blockquote style={{
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  marginBottom: "1.5rem",
                  lineHeight: "1.6",
                  color: "#4a5568"
                }}>
                  "{quote}"
                </blockquote>
                <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "1rem" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem", color: "#2d3748" }}>
                    {name}
                  </h4>
                  <p style={{ color: "#667eea", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {role}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#718096", marginBottom: "0.5rem" }}>
                    Graduate: {course}
                  </p>
                  <p style={{ 
                    fontSize: "0.9rem", 
                    color: "#38a169", 
                    fontWeight: "600",
                    backgroundColor: "#f0fff4",
                    padding: "0.5rem",
                    borderRadius: "6px"
                  }}>
                    {outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strong Call-to-Action Section */}
      <section style={{
        background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
        color: "white",
        textAlign: "center",
        padding: "4rem 1rem",
        position: "relative"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "1rem" }}>
            Ready to Transform Your Life?
          </h2>
          <p style={{ fontSize: "1.3rem", marginBottom: "2rem", opacity: "0.95" }}>
            Join {schoolData.studentsGraduated} successful graduates who chose to invest in their future. 
            Limited seats available for our next cohort starting soon.
          </p>
          
          <div style={{ 
            backgroundColor: "rgba(255,255,255,0.15)", 
            padding: "2rem", 
            borderRadius: "12px", 
            marginBottom: "2rem",
            backdropFilter: "blur(10px)"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🚀 Early Bird Special - Save $500!</h3>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Register by <strong>[End of Month]</strong> and get:
            </p>
            <ul style={{ 
              listStyle: "none", 
              padding: 0, 
              display: "flex", 
              flexWrap: "wrap", 
              justifyContent: "center", 
              gap: "1rem",
              fontSize: "1rem"
            }}>
              <li>✓ $500 discount</li>
              <li>✓ Free career coaching</li>
              <li>✓ Lifetime alumni access</li>
              <li>✓ Job guarantee*</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                backgroundColor: "white",
                color: "#ed8936",
                border: "none",
                padding: "1.5rem 3rem",
                fontSize: "1.4rem",
                fontWeight: "700",
                borderRadius: "50px",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(255,255,255,0.3)",
                transition: "transform 0.3s ease"
              }}
              onClick={() => window.location.href = "#contact"}
            >
              Claim Your Spot Now
            </button>
            <button
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "2px solid white",
                padding: "1.5rem 3rem",
                fontSize: "1.4rem",
                fontWeight: "700",
                borderRadius: "50px",
                cursor: "pointer"
              }}
              onClick={() => window.location.href = "#contact"}
            >
              Schedule Free Call
            </button>
          </div>
          
          <p style={{ fontSize: "0.9rem", marginTop: "2rem", opacity: "0.8" }}>
            *Job guarantee terms apply. See full details in course information.
          </p>
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section id="contact" style={{
        backgroundColor: "#f7fafc",
        padding: "4rem 1rem"
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
              Take the First Step Toward Your New Career
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#718096" }}>
              Speak with our career counselors and discover which program is perfect for your goals.
            </p>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "3rem",
            alignItems: "start"
          }}>
            {/* Contact Form */}
            <div style={{ backgroundColor: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <h3 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", color: "#2d3748" }}>
                Get Your Free Career Consultation
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you! Our career counselor will contact you within 24 hours.");
                }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input
                    type="text"
                    placeholder="First Name *"
                    required
                    style={{
                      padding: "1rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0",
                      transition: "border-color 0.3s ease"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name *"
                    required
                    style={{
                      padding: "1rem",
                      fontSize: "1rem",
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0"
                    }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  style={{
                    padding: "1rem",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0"
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  style={{
                    padding: "1rem",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0"
                  }}
                />
                <select
                  required
                  style={{
                    padding: "1rem",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0"
                  }}
                >
                  <option value="">Select Course of Interest *</option>
                  <option value="fullstack">Full-Stack Development</option>
                  <option value="datascience">Data Science & AI</option>
                  <option value="marketing">Digital Marketing</option>
                  <option value="uxui">UX/UI Design</option>
                  <option value="cloud">Cloud Computing</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="undecided">Not sure yet</option>
                </select>
                <textarea
                  placeholder="Tell us about your career goals and current background..."
                  rows={4}
                  style={{
                    padding: "1rem",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    resize: "vertical"
                  }}
                ></textarea>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    padding: "1.2rem",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease"
                  }}
                >
                  Get My Free Consultation
                </button>
              </form>
            </div>

            {/* Contact Information & Benefits */}
            <div>
              <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", marginBottom: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#2d3748" }}>
                  Why Schedule a Consultation?
                </h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {[
                    "Personalized career roadmap",
                    "Course recommendations based on your goals",
                    "Scholarship and financing options",
                    "Job market insights and salary expectations",
                    "Learning schedule that fits your life"
                  ].map((benefit, index) => (
                    <li key={index} style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      color: "#4a5568"
                    }}>
                      <span style={{ color: "#38a169", marginRight: "0.5rem", fontSize: "1.2rem" }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#2d3748" }}>
                  Get in Touch
                </h3>
                <div style={{ space: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>📞</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#2d3748" }}>Call Us</p>
                      <p style={{ margin: 0, color: "#718096" }}>{schoolData.phone}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>✉️</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#2d3748" }}>Email Us</p>
                      <p style={{ margin: 0, color: "#718096" }}>{schoolData.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>📍</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#2d3748" }}>Visit Us</p>
                      <p style={{ margin: 0, color: "#718096" }}>{schoolData.address}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #e2e8f0" }}>
                  <h4 style={{ marginBottom: "1rem", color: "#2d3748" }}>Follow Us</h4>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube'].map((platform) => (
                      <button
                        key={platform}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#667eea",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                        onClick={() => alert(`Visit our ${platform} page`)}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#2d3748", color: "white", padding: "2rem 1rem", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{schoolData.name}</h3>
          <p style={{ opacity: "0.8", marginBottom: "1rem" }}>
            Transforming lives through education since {schoolData.foundedYear}
          </p>
          <p style={{ fontSize: "0.9rem", opacity: "0.7" }}>
            © 2024 {schoolData.name}. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MarketingPage;
