import React from 'react';

const About = () => (
  <div
    style={{
      minHeight: '90vh',
      background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2em',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ textAlign: 'center', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3em', marginBottom: '0.5em', color: '#fff' }}>
        About Upskillr
      </h1>
      <h2 style={{ fontSize: '2em', fontWeight: 400, color: '#fff', marginBottom: '2em' }}>
        The Ultimate Online Teaching Platform for Schools
      </h2>
      <p style={{ fontSize: '1.4em', marginBottom: '2em' }}>
        Upskillr empowers schools, teachers, and students by providing interactive live classes, certified schools directory, and always-on technical support. Our mission is to transform learning experiences with seamless, intuitive, and reliable technology.
      </p>
      <a
        href="/studentRegister"
        style={{
          display: 'inline-block',
          backgroundColor: '#ff69b4', // Pink
          color: '#fff',
          padding: '0.75em 1.5em',
          fontSize: '1.25em',
          borderRadius: '4px',
          textDecoration: 'none',
          marginRight: '1em',
          cursor: 'pointer',
        }}
      >
        🚀 Get Started
      </a>
   
    </div>
  </div>
);

export default About;
