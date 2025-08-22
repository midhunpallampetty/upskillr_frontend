    import React from 'react';

    const Contact = () => (
 <div className="min-h-[90vh] bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center p-8">
  <div className="text-center max-w-3xl">
    <h1 className="text-5xl mb-4 font-bold">Contact Us</h1>
    <h2 className="text-2xl font-light mb-8">We're Here to Help with Your Online Teaching Needs</h2>
    <p className="text-lg mb-8">
      Reach out to our support team for inquiries, feedback, or assistance. Upskillr is committed to providing top-notch service for schools, teachers, and students.
    </p>
    <div className="mb-8">
      <p className="text-lg">📧 Email: support@upskillr.com</p>
      <p className="text-lg">📞 Phone: +1 (123) 456-7890</p>
      <p className="text-lg">📍 Address: 123 Education Lane, Tech City, USA</p>
    </div>
    <a href="/" className="inline-block border border-white px-6 py-3 text-lg rounded-lg mr-4 hover:bg-white hover:text-purple-600 transition">
      🏠 Back to Home
    </a>
    <a href="/forum" className="inline-block border border-white px-6 py-3 text-lg rounded-lg hover:bg-white hover:text-purple-600 transition">
      ❓ Support Center
    </a>
  </div>
</div>

    );

    export default Contact;
