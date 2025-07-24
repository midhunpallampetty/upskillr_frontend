import Cookies from 'js-cookie';

import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout=(()=>{
Cookies.remove('accessToken');
Cookies.remove('refreshToken');
Cookies.remove('schoolData');
Cookies.remove('dbname');
navigate('/schoolLogin')



  })

  return (
    <nav className="w-full h-16 flex items-center justify-between bg-gray-300 shadow px-4">
      {/* Left Logo */}
      <div
      className="h-full flex items-center bg-[#0D2B45] px-6 cursor-pointer"
      onClick={() => navigate(-1)} // 👈 Go to previous page
    >
      <img
        src="/images/navbar_home.png"
        alt="Upskillr Logo"
        className="h-12 w-auto"
      />
    </div>

      {/* Right Logout Button */}
      <button onClick={handleLogout} className="bg-[#1A2FA0] text-white font-bold px-5 py-2 rounded-full hover:bg-[#0d1e75] transition">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
