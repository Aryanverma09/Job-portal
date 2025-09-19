import React from 'react';
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className="bg-white text-black py-6 px-6 border-t border-black w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        <p className="text-sm">&copy; {new Date().getFullYear()} HireUp. All rights reserved.</p>

        <div className="flex space-x-6 text-sm">
          <button onClick={() => navigate('/about')} className="hover:text-indigo-600 transition">About</button>
          <button onClick={() => navigate('/contact')} className="hover:text-indigo-600 transition">Contact</button>
          <a href="/privacy" className="hover:text-indigo-600 transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-indigo-600 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
