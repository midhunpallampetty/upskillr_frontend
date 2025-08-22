import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const subjects: string[] = [
  'Playlist',
  'Directory',
  'Zodotry',
  'Botany',
  'Math',
  'History',
  'Computer',
  'Computing',
];

const features = [
  {
    title: 'Certified Schools',
    description: 'Every school is verified and certified before onboarding.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2l7 6-7 6-7-6 7-6z" />
        <path d="M2 8v6a10 10 0 0020 0V8" />
      </svg>
    ),
  },
  {
    title: 'Expert Teachers',
    description: 'Live classes by highly qualified teachers with years of experience.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21h13a2.5 2.5 0 00-13 0z" />
      </svg>
    ),
  },
  {
    title: '24/7 Support',
    description: 'Dedicated support team available around the clock for all students.',
    icon: (
      <svg className="w-8 h-8 text-indigo-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 10c0-3.314-2.686-6-6-6S6 6.686 6 10c0 2.21 1.343 4.104 3.293 5.093L12 21l2.707-5.907C16.657 14.104 18 12.21 18 10z" />
      </svg>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    // Example: navigate to subject page
    // navigate(`/subjects/${subject.toLowerCase()}`);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 2000);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="font-sans bg-gradient-to-br from-pink-100 via-indigo-100 to-yellow-100 min-h-screen">
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-md py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center sticky top-0 z-30"
      >
        <div className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
          <img src="/images/logo.png" alt="Upskillr" className="w-10 h-10" />
          Upskillr
        </div>
        <nav className="flex space-x-4 md:space-x-6 mb-4 md:mb-0 text-lg">
          <a href="#" className="text-gray-700 hover:text-pink-600 transition font-medium">Home</a>
          <a href="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</a>
          <a href="/contact" className="text-gray-700 hover:text-green-500 transition font-medium">Contact</a>
        </nav>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: "#f472b6", color: "#fff" }}
            onClick={() => navigate('/signupSelection')}
            className="px-5 py-2 text-sm border rounded text-indigo-600 border-indigo-600 hover:bg-indigo-50 transition font-semibold"
          >
            Sign up
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: "#6366f1", color: "#fff" }}
            onClick={() => navigate('/loginSelection')}
            className="px-5 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-semibold"
          >
            Login
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-pink-600 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 max-w-3xl mx-auto drop-shadow-lg"
          >
            Online Teaching Platform For Schools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-lg md:text-2xl mb-8 max-w-xl mx-auto opacity-90"
          >
            Empowering students and teachers with interactive live classes, certified schools, and 24/7 support.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex justify-center gap-4 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#f472b6" }}
              onClick={() => navigate('/signupSelection')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition"
            >
              Get Started
            </motion.button>

          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="rounded-lg p-4 max-w-2xl mx-auto h-64 flex items-center justify-center bg-indigo-800/30 shadow-lg"
          >
            <img className="w-96 h-80 object-cover rounded-xl" src="/images/schools/school1.png" alt="School" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/60 to-pink-600/60 pointer-events-none"
        ></motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute -bottom-16 -right-16 w-72 h-72 bg-yellow-400 rounded-full blur-2xl"
        ></motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-yellow-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-3xl font-extrabold text-center text-pink-600 mb-12"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.7 }}
                className="bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition flex flex-col items-center text-center"
              >
                {item.icon}
                <h3 className="font-bold text-xl mb-2 text-indigo-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="bg-gradient-to-br from-indigo-800 via-pink-600 to-yellow-500 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-3xl font-extrabold text-center mb-12"
          >
            Find Your Subject
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-5xl mx-auto">
            {subjects.map((subject, index) => (
              <motion.button
                key={index}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#f472b6",
                  boxShadow: "0 0 0 8px #f472b633",
                }}
                whileTap={{ scale: 0.95 }}
                className={`bg-indigo-700 p-5 rounded-lg text-center font-semibold text-lg shadow-md hover:bg-pink-600 transition cursor-pointer outline-none focus:ring-2 focus:ring-pink-400 ${selectedSubject === subject ? 'ring-4 ring-yellow-400' : ''
                  }`}
                onClick={() => handleSubjectClick(subject)}
                aria-pressed={selectedSubject === subject}
              >
                {subject}
              </motion.button>
            ))}
          </div>
          {selectedSubject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-center"
            >
              <span className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full shadow-lg font-bold animate-bounce">
                Selected: {selectedSubject}
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-pink-50 to-indigo-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-3xl font-extrabold text-center mb-8 text-gray-800"
          >
            About Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-gray-600 text-center text-lg leading-relaxed mb-6"
          >
            Welcome to Upskillr! We are a team of passionate MCA students, bridging the gap between schools and eager learners. Our platform delivers the latest learning tools and resources to foster academic growth and success.
          </motion.p>
          {/* <div className="flex justify-center gap-6">
            {['team1', 'team2', 'team3'].map((img, i) => (
              <motion.img
                key={img}
                src={`/images/${img}.png`}
                alt="Team"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* Contact Section */}
      {/* <section className="bg-gradient-to-br from-indigo-900 via-pink-600 to-yellow-500 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-3xl font-extrabold text-center mb-12"
          >
            Contact Us
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center"
            >
              <div className="bg-indigo-700 rounded-xl w-full h-64 flex items-center justify-center shadow-lg">
                <img className="w-96 h-80 object-cover rounded-xl" src="/images/schools/school2.png" alt="Contact" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Send a Message</h3>
              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Send Message
                </motion.button>
                {formSent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 font-semibold text-center mt-2 animate-pulse"
                  >
                    Message sent! We'll get back to you soon.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-indigo-900 via-pink-600 to-yellow-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="text-2xl font-bold mb-4">Upskillr</div>
              <p className="text-gray-200">Content © 2024 Upskillr</p>
            </div>
            <div className="md:col-span-2">

              <div className="flex space-x-4">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/midhun-ps/"
                  aria-label="LinkedIn"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center
               hover:bg-blue-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 .774v22.452C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.774V1.774C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/digitalsciencemalayalam"
                  aria-label="YouTube"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center
               hover:bg-red-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.01 3.01 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.013 3.013 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.01 3.01 0 002.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.376-.505a3.01 3.01 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L16.09 12l-6.545 3.568z" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
