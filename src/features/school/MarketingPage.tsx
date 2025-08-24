import React, { useEffect, useState } from 'react';
import { getDynamicSubdomain } from '../../utils/getSubdomain';

const MarketingPage: React.FC = () => {
  const [schoolData, setSchoolData] = useState({
    name: "test.com",
    email: `info@.eduvia.space`,
    phone: '+1 (555) 123-4567',
    address: '123 Education Rd, Knowledge City, 00000',
    description: 'Join our community and gain the skills to transform your career and passion. Flexible courses designed for real-world success.',
  });

  useEffect(() => {
    const subdomain = getDynamicSubdomain();
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

  // Update document title and meta tags manually
  useEffect(() => {
    document.title = `${schoolData.name} - Unlock Your Future with Expert Learning`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', schoolData.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = schoolData.description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywordsContent = `${schoolData.name}, online courses, education, career development`;
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywordsContent;
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
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
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#222", lineHeight: "1.6" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #6e8efb, #a777e3)",
          color: "white",
          padding: "4rem 1rem",
          textAlign: "center",
          borderRadius: "0 0 50% 50% / 20% 20% 80% 80%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Unlock Your Future with Expert Learning at {schoolData.name}
        </h1>
        <p style={{ fontSize: "1.3rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
          {schoolData.description}
        </p>
        <button
          style={{
            backgroundColor: "#ff6f61",
            border: "none",
            color: "white",
            padding: "1rem 2.5rem",
            fontSize: "1.2rem",
            fontWeight: "600",
            borderRadius: "30px",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(255,111,97,0.6)"
          }}
          onClick={() => window.location.href = "#enroll"}
          aria-label="Enroll Now"
        >
          Enroll Now
        </button>
      </section>

      {/* About the School */}
      <section style={{ padding: "3rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#4a4a4a" }}>
          About {schoolData.name}
        </h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          Founded on a passion for empowering learners, {schoolData.name} combines decades of educational excellence with cutting-edge teaching methods.
          Our vision is to create life-changing opportunities through accessible, high-quality education.
        </p>
        <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          Trusted by thousands of students globally, our alumni excel in diverse industries including technology, business, and creative arts.
          Accredited and recognized, we are dedicated to your success every step of the way.
        </p>
      </section>

      {/* Courses Offered */}
      <section style={{ backgroundColor: "#f9f9fb", padding: "3rem 1rem" }}>
        <h2 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "2.5rem", color: "#4a4a4a" }}>
          Explore Our Courses at {schoolData.name}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            maxWidth: "1000px",
            margin: "0 auto"
          }}
        >
          {[
            {
              title: "Full-Stack Web Development",
              desc: "Master modern web technologies and build dynamic, responsive websites and applications.",
              benefits: ["Hands-on projects", "Industry-relevant skills", "Career-ready portfolio"],
              career: "Web Developer, Frontend Engineer, Backend Developer"
            },
            {
              title: "Data Science & Machine Learning",
              desc: "Learn to analyze data, build predictive models, and leverage AI to solve complex problems.",
              benefits: ["Real datasets", "Python & R tools", "Insightful analytics"],
              career: "Data Scientist, ML Engineer, Business Analyst"
            },
            {
              title: "Digital Marketing",
              desc: "Develop expertise in SEO, content marketing, social media, and advertising to grow brands online.",
              benefits: ["Strategy building", "Tools & campaigns", "Performance tracking"],
              career: "Marketing Specialist, Brand Manager, SEO Expert"
            },
            {
              title: "Graphic Design & Branding",
              desc: "Create compelling visuals and branding strategies that catch attention and communicate effectively.",
              benefits: ["Creative software", "Design principles", "Portfolio development"],
              career: "Graphic Designer, Brand Strategist, UX/UI Designer"
            },
            {
              title: "Cybersecurity Fundamentals",
              desc: "Learn to protect digital assets and understand the essentials of network and information security.",
              benefits: ["Risk assessment", "Defense strategies", "Ethical hacking basics"],
              career: "Security Analyst, Cybersecurity Consultant"
            },
            {
              title: "Project Management",
              desc: "Gain skills to lead projects efficiently, manage teams, and deliver on time and budget.",
              benefits: ["Agile & Scrum", "Planning & execution", "Leadership"],
              career: "Project Manager, Operations Manager"
            }
          ].map(({ title, desc, benefits, career }) => (
            <div key={title} style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 3px 10px rgba(0,0,0,0.1)" }}>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "0.7rem", color: "#333" }}>{title}</h3>
              <p style={{ fontSize: "1rem", marginBottom: "0.8rem", color: "#555" }}>{desc}</p>
              <ul style={{ color: "#444", fontSize: "0.95rem", marginBottom: "0.8rem", paddingLeft: "1.2rem" }}>
                {benefits.map((b) => (
                  <li key={b} style={{ marginBottom: "0.3rem" }}>• {b}</li>
                ))}
              </ul>
              <p style={{ fontWeight: "600", color: "#777" }}>Career Opportunities: {career}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: "3rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#4a4a4a", textAlign: "center" }}>
          Why Choose {schoolData.name}?
        </h2>
        <ul style={{ listStyleType: "none", paddingLeft: 0, color: "#555", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
          <li style={{ marginBottom: "1rem" }}>
            <strong>Expert Faculty:</strong> Learn from industry professionals with years of real-world experience.
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <strong>Flexible Learning:</strong> Study at your own pace with online and part-time options to fit your lifestyle.
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <strong>Certified Courses:</strong> Receive accredited certificates that enhance your resume and boost your credibility.
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <strong>Student Success Stories:</strong> Join thousands of alumni who have launched successful careers worldwide.
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <strong>Placement Assistance:</strong> Benefit from interview prep, resume workshops, and connections to leading companies.
          </li>
        </ul>
      </section>

      {/* Mid-page Call-to-Action */}
      <section
        id="enroll"
        style={{
          backgroundColor: "#6e8efb",
          color: "white",
          textAlign: "center",
          padding: "2.5rem 1rem",
          marginTop: "3rem",
          borderRadius: "12px",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 6px 20px rgba(110,142,251,0.6)"
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Ready to Start Your Journey at {schoolData.name}?</h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "1.8rem" }}>
          Take the first step toward a brighter future by enrolling in one of our transformative courses.
        </p>
        <button
          style={{
            backgroundColor: "#ff6f61",
            border: "none",
            padding: "1rem 3rem",
            fontSize: "1.2rem",
            fontWeight: "700",
            borderRadius: "30px",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(255,111,97,0.7)"
          }}
          onClick={() => window.location.href = "#contact"}
          aria-label="Start Learning Today"
        >
          Start Learning Today
        </button>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "3rem 1rem", maxWidth: "900px", margin: "3rem auto" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#4a4a4a", textAlign: "center" }}>
          Success Stories from Our Students at {schoolData.name}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem"
          }}
        >
          {[
            {
              name: "Asha R.",
              course: "Full-Stack Web Development",
              quote: "This school helped me launch my career as a web developer. The projects were practical and the instructors always supportive."
            },
            {
              name: "Ravi K.",
              course: "Digital Marketing",
              quote: "I landed my dream job within 3 months of completing the course. The placement support made all the difference."
            },
            {
              name: "Meera S.",
              course: "Data Science & Machine Learning",
              quote: "The curriculum was intense but rewarding. I now confidently build machine learning models and analyze complex data."
            }
          ].map(({ name, course, quote }) => (
            <blockquote key={name} style={{
              backgroundColor: "#f0f4ff",
              borderLeft: "6px solid #6e8efb",
              padding: "1rem 1.5rem",
              borderRadius: "10px",
              fontStyle: "italic",
              color: "#333"
            }}>
              "{quote}"
              <footer style={{ marginTop: "0.7rem", fontWeight: "600", color: "#555" }}>
                — {name}, <span style={{ fontWeight: "400" }}>{course}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Final Call-to-Action */}
      <section
        style={{
          backgroundColor: "#ff6f61",
          color: "white",
          textAlign: "center",
          padding: "3rem 1rem",
          borderRadius: "12px",
          margin: "2rem auto",
          maxWidth: "700px",
          boxShadow: "0 6px 25px rgba(255,111,97,0.7)"
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Don't Miss Out at {schoolData.name}!</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
          Spaces fill quickly. Secure your spot today and start building the career you've always wanted.
        </p>
        <button
          style={{
            backgroundColor: "white",
            color: "#ff6f61",
            padding: "1rem 3rem",
            fontSize: "1.3rem",
            fontWeight: "700",
            borderRadius: "30px",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(255,111,97,0.8)"
          }}
          onClick={() => window.location.href = "#contact"}
          aria-label="Enroll Now"
        >
          Enroll Now
        </button>
      </section>

      {/* Contact / Next Steps */}
      <section
        id="contact"
        style={{
          backgroundColor: "#f9f9fb",
          padding: "3rem 1rem",
          maxWidth: "700px",
          margin: "0 auto 4rem auto",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#4a4a4a", textAlign: "center" }}>
          Get in Touch with {schoolData.name}
        </h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", textAlign: "center", color: "#555" }}>
          Have questions or want more info? Fill out the form below, or contact us directly.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for your interest! We'll contact you soon.");
          }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          aria-label="Contact form to request more information"
        >
          <input
            type="text"
            placeholder="Your Name"
            required
            style={{
              padding: "0.8rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
            aria-label="Your Name"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            style={{
              padding: "0.8rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
            aria-label="Your Email"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            style={{
              padding: "0.8rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical"
            }}
            aria-label="Your Message"
          ></textarea>
          <button
            type="submit"
            style={{
              backgroundColor: "#6e8efb",
              color: "white",
              border: "none",
              padding: "1rem",
              fontSize: "1.2rem",
              borderRadius: "30px",
              cursor: "pointer",
              fontWeight: "600"
            }}
            aria-label="Submit contact form"
          >
            Request Info
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#444", fontSize: "1rem" }}>
          <p>Phone: {schoolData.phone}</p>
          <p>Email: {schoolData.email}</p>
          <p>Address: {schoolData.address}</p>
        </div>
      </section>
    </div>
  );
};

export default MarketingPage;
