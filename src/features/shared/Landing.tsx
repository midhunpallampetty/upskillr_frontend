import React from 'react';
import { useNavigate } from 'react-router-dom';

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

const LandingPage: React.FC = () => {
    const navigate=useNavigate()
  return (
    <div className="font-sans bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl md:text-3xl font-bold text-indigo-700 mb-4 md:mb-0">Upskillr</div>
        <nav className="flex space-x-4 md:space-x-6 mb-4 md:mb-0">
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Home</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Courses</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">About</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Contact us</a>
        </nav>
        <div className="flex space-x-3">
          <button  onClick={()=>navigate('/signupSelection')} className="px-4 py-2 text-sm border rounded text-indigo-600 border-indigo-600 hover:bg-indigo-50 transition">Sign up</button>
          <button onClick={()=>navigate('/loginSelection')} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
            Online Teaching Platform For Schools
          </h1>
          <div className=" rounded-lg p-4 max-w-2xl mx-auto h-64 flex items-center justify-center">
            <div className="text-xl text-indigo-200">
            <img className='w-96 h-80' src='/images/schools/school1.png'/>
            </div>
            s
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-pink-600 mb-12">Why you choose us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Certified Schools',
                description: 'Every school is verified and certified before onboarding.',
              },
              {
                title: 'Highly Qualified Live Class Teachers',
                description: 'All classes are conducted by experts with years of teaching experience.',
              },
              {
                title: '24/7 Student Support',
                description: 'Dedicated support team available around the clock for all students.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <h3 className="font-bold text-xl mb-3 text-indigo-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="bg-gradient-to-br from-indigo-800 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Find your Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-5xl mx-auto">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-indigo-700 p-4 rounded-lg text-center hover:bg-indigo-600 transition cursor-pointer"
              >
                {subject}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">About Us</h2>
          <p className="text-gray-600 text-center text-lg leading-relaxed">
            Welcome to our platform! We are a team of hard-working students pursuing our Master's in
            Computer Applications (MCA) with a shared passion for education and technology. This
            platform is a bridge between schools and eager students, providing the latest learning
            tools and resources to foster academic growth.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-indigo-700 rounded-xl w-full h-64 flex items-center justify-center">
                <div className="text-xl text-indigo-200">          
                      <img className='w-96 h-80' src='/images/schools/school2.png'/>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Send a message</h3>
              <form className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Send a message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="text-2xl font-bold mb-4">Landscape Software</div>
              <p className="text-gray-400">Content © 2004 Landscape Software</p>
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-4 mb-6">
                <a href="#" className="text-gray-300 hover:text-white transition">Home</a>
                <a href="#" className="text-gray-300 hover:text-white transition">Courses</a>
                <a href="#" className="text-gray-300 hover:text-white transition">Contact us</a>
                <a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a>
              </div>
              <div className="flex space-x-4">
                {/* Social icons - Facebook and Twitter */}
                {/* Use real links and aria-labels for accessibility */}
                <a href="#" aria-label="Facebook" className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2..."></path>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253..."></path>
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
