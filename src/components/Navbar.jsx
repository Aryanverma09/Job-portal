import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const Navbar = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user'))
      setUserName(u?.name || null)
    } catch (e) {
      setUserName(null)
    }
  }, [])

  return (
    <nav className="bg-white text-black flex items-center justify-between px-8 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer select-none" >HireUp</h1>
        
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="hover:text-indigo-600 transition">
                <button onClick={() => navigate('/jobs')} className="hover:text-indigo-600 transition">Jobs</button>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="hover:text-indigo-600 transition">
                <button onClick={() => navigate('/companies')} className="hover:text-indigo-600 transition">Companies</button>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="hover:text-indigo-600 transition">
                <button onClick={() => navigate('/profile')} className="hover:text-indigo-600 transition">Profile</button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="relative">
        <button
          onClick={() => setProfileMenuOpen((open) => !open)}
          className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
          aria-haspopup="true"
          aria-expanded={profileMenuOpen}
        >
          <Avatar className="w-10 h-10 rounded-full border border-gray-300 overflow-hidden">
            <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
            <AvatarFallback className="bg-gray-100 text-gray-700 flex items-center justify-center w-full h-full">
              {userName ? userName.split(' ').map(s => s[0]).slice(0,2).join('') : 'CN'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block font-medium">{userName || 'Candidate Name'}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              profileMenuOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {profileMenuOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 text-sm space-y-1 z-50">
            <li>
              <button
                onClick={() => { setProfileMenuOpen(false); navigate('/profile') }}
                className="w-full text-left px-4 py-2 hover:bg-indigo-100 text-gray-700"
                role="menuitem"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => { setProfileMenuOpen(false); navigate('/settings') }}
                className="w-full text-left px-4 py-2 hover:bg-indigo-100 text-gray-700"
                role="menuitem"
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setProfileMenuOpen(false); navigate('/') }}
                className="w-full text-left px-4 py-2 hover:bg-indigo-100 text-gray-700"
                role="menuitem"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
