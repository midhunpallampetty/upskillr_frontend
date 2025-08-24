import React, { useEffect, useState } from 'react';
import { getSchoolBySubdomain } from './api/school.api'; // Adjust the import path to match your project structure (e.g., the api folder where this function exists)
import { getCoursesBySchool } from './api/course.api'; // Assuming this is the import for the new API function; adjust path accordingly


// Embedded utility function to extract subdomain
const getSubdomain = (url: string = window.location.href): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[parts.length - 2] === 'eduvia' && parts[parts.length - 1] === 'space') {
      return parts.slice(0, -2).join('.');
    }
    return '';
  } catch (error) {
    console.error('Error extracting subdomain:', error);
    return '';
  }
};


const MarketingPage: React.FC = () => {
  const [schoolData, setSchoolData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    foundedYear: '',
    studentsGraduated: '',
    successRate: '',
    experience: '',
    image: '',
    coverImage: '',
    coursesOffered: [] // Keep empty initially; will be set from API
  });


  useEffect(() => {
    const subdomain = getSubdomain();
    if (subdomain) {
      const fetchSchoolData = async () => {
        try {
          // Replace with actual token retrieval (e.g., from auth context, localStorage, etc.)
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGQ4YjI5NDRhMzg4N2E4MjJkNTg2YiIsImVtYWlsIjoieWljZXdhYjkzOUBsaXRlcGF4LmNvbSIsInJvbGUiOiJzY2hvb2wiLCJzdWJEb21haW4iOiJodHRwOi8vZ2FtZXJzY2x1Yi5lZHV2aWEuc3BhY2UiLCJpYXQiOjE3NTU5NjMyMjUsImV4cCI6MTc1NTk2MzI4NX0.1GcqFwkWRABUA6RvFdNjTZaRZHCQY-djW8SIeslT4es'; // Implement proper token handling
          console.log(subdomain, 'subdomain');
          
          const response = await getSchoolBySubdomain(subdomain, token);
          console.log(response.data.school, 'response');
          
          const data = response.data.school; // Adjust based on axios response structure
          
          const updatedData = {
            name: data.name || '',
            email: data.email || '',
            phone: data.officialContact || '',
            address: data.address || '',
            description: data.description || '', // If not provided by API, remains empty
            foundedYear: data.createdAt ? new Date(data.createdAt).getFullYear().toString() : '',
            studentsGraduated: data.studentsGraduated || '', // If not provided, empty
            successRate: data.successRate || '', // If not provided, empty
            experience: data.experience || '',
            image: data.image || '',
            coverImage: data.coverImage || '',
            coursesOffered: [] // Initialize empty; will be updated below
          };

          setSchoolData(updatedData);
          console.log(updatedData, 'data'); // Log after setting state (note: state update is async, use callback if needed for immediate logging)

          // Fetch courses using getCoursesBySchool API
          // Assuming schoolId is available as data._id and dbname is 'eduvia' based on context
          const schoolId = data._id; // Adjust based on actual school ID field in response
          const dbname = 'gamersclub'; // Adjust if dbname is dynamic or from response
          const coursesResponse = await getCoursesBySchool(schoolId, dbname);
          console.log(coursesResponse, 'courses response');

          // Assuming response structure has courses in coursesResponse.data.courses as an array of strings
          const fetchedCourses = coursesResponse || [];

          // Update schoolData with fetched courses
          setSchoolData(prevData => ({
            ...prevData,
            coursesOffered: fetchedCourses
          }));

        } catch (error) {
          console.error('Error fetching school data or courses:', error);
        }
      };
      fetchSchoolData();
    }
  }, []);


  // SEO and meta tag updates
  useEffect(() => {
    if (schoolData.name) {
      document.title = `${schoolData.name} - Transform Your Career with Expert-Led Courses`;
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && schoolData.description) {
      metaDescription.setAttribute('content', `${schoolData.description} Join ${schoolData.studentsGraduated || 'thousands of'} successful graduates. Flexible learning, industry certification, career support.`);
    } else if (schoolData.description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = `${schoolData.description} Join ${schoolData.studentsGraduated || 'thousands of'} successful graduates.`;
      document.head.appendChild(meta);
    }


    const updateOrCreateMetaTag = (property: string, content: string) => {
      if (!content) return; // Skip if content is empty
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


  // Dummy course details for enhanced display (kept as per instructions, extended for potential new courses)
  const courseDetails = {
    'Full Stack Web Development': {
      icon: '💻',
      duration: '24 weeks',
      level: 'Beginner to Advanced',
      description: 'Master React, Node.js, MongoDB and become a complete web developer',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      salary: '$75K - $130K'
    },
    'Data Science & Analytics': {
      icon: '📊',
      duration: '20 weeks',
      level: 'Intermediate',
      description: 'Learn Python, Machine Learning, and data visualization techniques',
      skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
      salary: '$80K - $140K'
    },
    'Digital Marketing Mastery': {
      icon: '📱',
      duration: '16 weeks',
      level: 'All Levels',
      description: 'Master SEO, social media marketing, and digital advertising strategies',
      skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
      salary: '$50K - $90K'
    },
    'UI/UX Design Professional': {
      icon: '🎨',
      duration: '18 weeks',
      level: 'Beginner to Advanced',
      description: 'Create stunning user interfaces and exceptional user experiences',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      salary: '$65K - $110K'
    },
    'Mobile App Development': {
      icon: '📱',
      duration: '22 weeks',
      level: 'Intermediate',
      description: 'Build native iOS and Android apps with React Native and Flutter',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      salary: '$70K - $125K'
    },
    'Cloud Computing & DevOps': {
      icon: '☁️',
      duration: '20 weeks',
      level: 'Advanced',
      description: 'Master AWS, Docker, Kubernetes and modern deployment practices',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      salary: '$85K - $150K'
    },
    'Game Development Using Unity': { // Added based on sample data for better matching
      icon: '🎮',
      duration: '20 weeks',
      level: 'Beginner to Advanced',
      description: 'Learn Unity engine to create immersive 2D and 3D games',
      skills: ['Unity', 'C#', 'Game Design', '3D Modeling'],
      salary: '$70K - $120K'
    }
  };


  return (
    <div className="font-inter text-gray-800 leading-7 bg-gray-50 min-h-screen">
      
      {/* Enhanced Hero Section with Cover Image and Logo */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center text-white"
        style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.85), rgba(147, 51, 234, 0.85)), url(${schoolData.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>


        <div className="relative z-10 container mx-auto px-6">
          {/* School Header with Logo */}
          <div className="text-center mb-12">
            {/* Logo Section */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img 
                  src={schoolData.image || 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=LOGO'} 
                  alt={`${schoolData.name} Logo`} 
                  className="relative w-32 h-32 rounded-full border-4 border-white/40 shadow-2xl backdrop-blur-sm hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>


            {/* School Name with Enhanced Typography */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 drop-shadow-lg">
                {schoolData.name || 'EduVia Academy'}
              </span>
            </h1>
            
            <div className="max-w-4xl mx-auto mb-8">
              {schoolData.description && (
                <p className="text-xl md:text-2xl font-light mb-8 text-blue-100 leading-relaxed">
                  {schoolData.description}
                </p>
              )}
              
              {/* Enhanced Contact Information - Ensured all are displayed if available */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {schoolData.address && (
                  <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <span className="text-2xl">📍</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Location</p>
                      <p className="text-blue-100 text-sm">{schoolData.address}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.phone && (
                  <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <span className="text-2xl">📞</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Call Us</p>
                      <p className="text-blue-100 text-sm">{schoolData.phone}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.email && (
                  <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                    <span className="text-2xl">✉️</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">Email</p>
                      <p className="text-blue-100 text-sm">{schoolData.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-12 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-2 transition-all duration-300 transform"
              onClick={() => window.location.href = "#courses"}
            >
              <span className="relative z-10 flex items-center justify-center">
                🚀 <span className="ml-2">Explore Our Courses</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button
              className="group bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-12 py-5 text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => window.location.href = "#contact"}
            >
              <span className="flex items-center justify-center">
                💬 <span className="ml-2">Free Consultation</span>
              </span>
            </button>
          </div>


          {/* Enhanced Trust Indicators (conditionally render based on available data) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {schoolData.studentsGraduated && (
              <div className="text-center bg-gradient-to-br from-green-400 to-blue-500 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3 filter drop-shadow-lg">🎓</div>
                <div className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">{schoolData.studentsGraduated}</div>
                <div className="text-white/90 font-semibold text-sm">Successful Graduates</div>
              </div>
            )}
            {schoolData.successRate && (
              <div className="text-center bg-gradient-to-br from-purple-400 to-pink-500 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3 filter drop-shadow-lg">📈</div>
                <div className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">{schoolData.successRate}</div>
                <div className="text-white/90 font-semibold text-sm">Job Placement Rate</div>
              </div>
            )}
            {schoolData.foundedYear && (
              <div className="text-center bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
                <div className="text-4xl mb-3 filter drop-shadow-lg">⭐</div>
                <div className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">Since {schoolData.foundedYear}</div>
                <div className="text-white/90 font-semibold text-sm">Years of Excellence</div>
              </div>
            )}
            <div className="text-center bg-gradient-to-br from-teal-400 to-cyan-500 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
              <div className="text-4xl mb-3 filter drop-shadow-lg">🌍</div>
              <div className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">50+ Countries</div>
              <div className="text-white/90 font-semibold text-sm">Global Alumni Network</div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Courses Section with API-provided courses and dummy details */}
      {schoolData.coursesOffered.length > 0 && (
        <section id="courses" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                  Our Premium Courses
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Master in-demand skills with our industry-aligned curriculum designed by experts from top companies
              </p>
              <div className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold">
                🔥 {schoolData.coursesOffered.length} Courses Available
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {schoolData.coursesOffered.map((course, index) => {
                const details = courseDetails[course] || courseDetails['Full Stack Web Development']; // Fallback if course not in dummy map
                
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-gradient-to-b from-purple-500 to-pink-500 hover:-translate-y-2 transform"
                    style={{
                      borderImage: 'linear-gradient(to bottom, #8B5CF6, #EC4899) 1'
                    }}
                  >
                    {/* Course Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                        {details.icon}
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-1">
                          🔥 Popular
                        </div>
                        <div className="text-gray-500 text-sm">Course {index + 1}</div>
                      </div>
                    </div>


                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors leading-tight">
                      {course}
                    </h3>


                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {details.description}
                    </p>


                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-sm flex items-center font-medium">
                        📅 {details.duration}
                      </span>
                      <span className="bg-orange-50 text-orange-600 px-3 py-2 rounded-xl text-sm flex items-center font-medium">
                        📊 {details.level}
                      </span>
                      <span className="bg-green-50 text-green-600 px-3 py-2 rounded-xl text-sm flex items-center font-medium">
                        🏆 Certified
                      </span>
                    </div>


                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-3">Key Skills You'll Learn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {details.skills.map((skill, idx) => (
                          <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>


                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-3">What You'll Get:</h4>
                      <ul className="space-y-2">
                        {[
                          "🎯 Live Interactive Sessions", 
                          "👨‍🏫 1-on-1 Expert Mentorship", 
                          "💼 Career Placement Support",
                          "📜 Industry Certificate"
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-700 text-sm">
                            <span className="mr-2">{feature.split(' ')[0]}</span>
                            <span>{feature.split(' ').slice(1).join(' ')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>


                    {/* Salary Range */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6 border border-green-200">
                      <p className="text-green-800 font-semibold flex items-center">
                        💰 <span className="ml-2">Average Salary: <span className="text-green-600">{details.salary}</span></span>
                      </p>
                    </div>


                    {/* CTA Button */}
                    <button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-lg font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      onClick={() => window.location.href = "#contact"}
                    >
                      Start Learning Today →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* Enhanced About Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Why Choose {schoolData.name || 'Us'}?
                </span>
              </h2>
              
              {(schoolData.experience || schoolData.foundedYear) && (
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  With <span className="font-bold text-blue-600">{schoolData.experience || 'many'}</span> years of experience since {schoolData.foundedYear || 'our founding'}, we've been transforming careers through cutting-edge education and practical skill development.
                </p>
              )}


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: "🎯", title: "Industry-Focused", desc: "Real-world projects and skills", color: "from-blue-500 to-purple-500" },
                  { icon: "👥", title: "Expert Mentors", desc: "Learn from industry leaders", color: "from-green-500 to-teal-500" },
                  { icon: "🌟", title: "Proven Results", desc: `${schoolData.successRate ? `${schoolData.successRate} success rate` : 'High success rate'}`, color: "from-yellow-500 to-orange-500" },
                  { icon: "🤝", title: "Career Support", desc: "Job placement assistance", color: "from-pink-500 to-red-500" }
                ].map((feature, index) => (
                  <div key={index} className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-white transform hover:-translate-y-1`}>
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-white/90 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>


            {/* Right Column - Contact Card - Ensured logo, address, phone, email are prominently displayed */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-center mb-8">
                <img 
                  src={schoolData.image || 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=LOGO'} 
                  alt={`${schoolData.name || 'School'} Logo`} 
                  className="w-24 h-24 rounded-full border-4 border-white/30 mx-auto mb-4" 
                />
                <h3 className="text-3xl font-bold">Get In Touch</h3>
                <p className="text-blue-100 mt-2">Ready to start your journey?</p>
              </div>
              
              <div className="space-y-4">
                {schoolData.address && (
                  <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-blue-100 text-sm">{schoolData.address}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.email && (
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-blue-100">{schoolData.email}</p>
                    </div>
                  </div>
                )}
                
                {schoolData.phone && (
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-blue-100">{schoolData.phone}</p>
                    </div>
                  </div>
                )}
              </div>


              <button
                className="w-full mt-8 bg-white text-purple-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
                onClick={() => window.location.href = "#contact"}
              >
                Schedule a Call Today
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Modern Footer - Ensured logo and other details are shown */}
      <footer id="contact" className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={schoolData.image || 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=LOGO'} 
                  alt={`${schoolData.name || 'School'} Logo`} 
                  className="w-16 h-16 rounded-full border-2 border-purple-400" 
                />
                <h3 className="text-4xl font-black">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
                    {schoolData.name || 'EduVia Academy'}
                  </span>
                </h3>
              </div>
              {schoolData.description && (
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  {schoolData.description}
                </p>
              )}
              {(schoolData.studentsGraduated || schoolData.successRate || schoolData.foundedYear) && (
                <p className="text-lg text-purple-200">
                  🎯 {schoolData.studentsGraduated || 'Thousands of'} graduates • {schoolData.successRate || 'High'} success rate • Since {schoolData.foundedYear || '2015'}
                </p>
              )}
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
              © 2024 {schoolData.name || 'EduVia Academy'}. Empowering futures through education. All rights reserved.
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
