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
    successRate: '95%',
    experience: '0',
    image: '',
    coverImage: '',
    coursesOffered: []
  });

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
              phone: data.officialContact || schoolData.phone,
              address: data.address || schoolData.address,
              description: data.description || schoolData.description,
              foundedYear: data.createdAt ? new Date(data.createdAt).getFullYear().toString() : schoolData.foundedYear,
              studentsGraduated: data.studentsGraduated || schoolData.studentsGraduated,
              successRate: data.successRate || schoolData.successRate,
              experience: data.experience || schoolData.experience,
              image: data.image || schoolData.image,
              coverImage: data.coverImage || schoolData.coverImage,
              coursesOffered: data.coursesOffered || schoolData.coursesOffered
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

  // SEO and meta tag updates
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
    if (schoolData.image) {
      updateOrCreateMetaTag('og:image', schoolData.image);
    }
  }, [schoolData]);

  return (
    <div className="font-inter text-gray-800 leading-7 bg-gray-50 min-h-screen">
      
      {/* Enhanced Hero Section with School Details */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center text-white"
        style={{
          background: schoolData.coverImage 
            ? `linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9)), url(${schoolData.coverImage})` 
            : 'linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          {/* School Header with Logo and Details */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-8">
              {schoolData.image && (
                <div className="relative">
                  <img 
                    src={schoolData.image} 
                    alt={`${schoolData.name} Logo`} 
                    className="w-32 h-32 rounded-full border-4 border-white/30 shadow-2xl backdrop-blur-sm"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
                </div>
              )}
            </div>

            {/* School Name and Tagline */}
            <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                {schoolData.name}
              </span>
            </h1>
            
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-2xl md:text-3xl font-light mb-6 text-blue-100">
                {schoolData.description}
              </p>
              
              {/* Contact Information Bar */}
              <div className="flex flex-wrap justify-center gap-8 text-lg text-white/90 mb-8">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-2xl">📍</span>
                  <span className="hidden md:inline">{schoolData.address}</span>
                  <span className="md:hidden">Location Available</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-2xl">📞</span>
                  <span>{schoolData.phone}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-2xl">✉️</span>
                  <span>{schoolData.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-2 transition-all duration-300"
              onClick={() => window.location.href = "#courses"}
            >
              <span className="relative z-10">🚀 Explore Our Courses</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button
              className="group bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-12 py-4 text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300"
              onClick={() => window.location.href = "#contact"}
            >
              💬 Free Consultation
            </button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: "🎓", value: schoolData.studentsGraduated, label: "Successful Graduates" },
              { icon: "📈", value: schoolData.successRate, label: "Job Placement Rate" },
              { icon: "⭐", value: `Since ${schoolData.foundedYear}`, label: "Years of Excellence" },
              { icon: "🌍", value: "50+ Countries", label: "Global Alumni Network" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Courses Section */}
      <section id="courses" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                Our Premium Courses
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Master in-demand skills with our industry-aligned curriculum designed by experts from top companies
            </p>
          </div>

          {schoolData.coursesOffered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {schoolData.coursesOffered.map((course, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-gradient-to-b from-purple-500 to-pink-500 hover:-translate-y-2"
                  style={{
                    borderImage: 'linear-gradient(to bottom, #8B5CF6, #EC4899) 1'
                  }}
                >
                  {/* Course Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                      {index + 1}
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      🔥 Popular
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors">
                    {course}
                  </h3>

                  {/* Course Meta */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center">
                      📅 16 Weeks
                    </span>
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center">
                      📊 All Levels
                    </span>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm flex items-center">
                      🏆 Certified
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Transform your career with hands-on projects, expert mentorship, and industry-recognized certification.
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-800 mb-3">What You'll Get:</h4>
                    <ul className="space-y-2">
                      {[
                        "🎯 Live Interactive Sessions", 
                        "👨‍🏫 1-on-1 Expert Mentorship", 
                        "💼 Career Placement Support",
                        "📜 Industry Certificate"
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <span className="mr-2">{feature.split(' ')[0]}</span>
                          <span>{feature.split(' ').slice(1).join(' ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Salary Range */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6 border border-green-200">
                    <p className="text-green-800 font-semibold">
                      💰 Average Salary: <span className="text-green-600">$70K - $120K</span>
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-lg font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => window.location.href = "#contact"}
                  >
                    Start Learning Today →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🚀</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Exciting Courses Coming Soon!</h3>
              <p className="text-xl text-gray-600 mb-8">We're crafting amazing learning experiences just for you.</p>
              <button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all"
                onClick={() => window.location.href = "#contact"}
              >
                Get Notified When Available
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              <h2 className="text-5xl font-black mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Why Choose {schoolData.name}?
                </span>
              </h2>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                With <span className="font-bold text-blue-600">{schoolData.experience}</span> years of experience since {schoolData.foundedYear}, we've been transforming careers through cutting-edge education and practical skill development.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: "🎯", title: "Industry-Focused", desc: "Real-world projects and skills" },
                  { icon: "👥", title: "Expert Mentors", desc: "Learn from industry leaders" },
                  { icon: "🌟", title: "Proven Results", desc: `${schoolData.successRate} success rate` },
                  { icon: "🤝", title: "Career Support", desc: "Job placement assistance" }
                ].map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              {schoolData.image && (
                <div className="text-center mb-8">
                  <img 
                    src={schoolData.image} 
                    alt={`${schoolData.name} Logo`} 
                    className="w-24 h-24 rounded-full border-4 border-white/30 mx-auto mb-4" 
                  />
                </div>
              )}
              
              <h3 className="text-3xl font-bold mb-6 text-center">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-blue-100">{schoolData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-blue-100">{schoolData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-blue-100">{schoolData.phone}</p>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-8 bg-white text-purple-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                onClick={() => window.location.href = "#contact"}
              >
                Schedule a Call Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer id="contact" className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                {schoolData.image && (
                  <img 
                    src={schoolData.image} 
                    alt={`${schoolData.name} Logo`} 
                    className="w-16 h-16 rounded-full border-2 border-purple-400" 
                  />
                )}
                <h3 className="text-4xl font-black">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
                    {schoolData.name}
                  </span>
                </h3>
              </div>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                {schoolData.description}
              </p>
              <p className="text-lg text-purple-200">
                🎯 {schoolData.studentsGraduated} graduates • {schoolData.successRate} success rate • Since {schoolData.foundedYear}
              </p>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-6 text-pink-300">Quick Links</h4>
              <ul className="space-y-3">
                {['Courses', 'About Us', 'Contact', 'Privacy Policy', 'Terms'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-lg hover:text-pink-300 transition-colors flex items-center">
                      <span className="mr-2">→</span>{link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-6 text-pink-300">Connect With Us</h4>
              <div className="grid grid-cols-2 gap-3">
                {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((platform) => (
                  <button
                    key={platform}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
                    onClick={() => alert(`Visit our ${platform} page`)}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-lg text-blue-200">
              © 2024 {schoolData.name}. Empowering futures through education. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MarketingPage;
