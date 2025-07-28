// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-white shadow-inner border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
        <div className="text-center md:text-left text-gray-600 text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-purple-600">Upskillr</span>. All rights reserved.
        </div>
        <div className="mt-4 md:mt-0 flex justify-center space-x-6 text-sm">
          <a href="/about" className="text-gray-500 hover:text-purple-600">About</a>
          <a href="/contact" className="text-gray-500 hover:text-purple-600">Contact</a>
          <a href="/privacy" className="text-gray-500 hover:text-purple-600">Privacy</a>
          <a href="/terms" className="text-gray-500 hover:text-purple-600">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
