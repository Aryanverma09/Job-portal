import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom' // ✅ ADDED: Link for navigation
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ThemeToggle } from './ThemeToggle';
import { Briefcase, LogIn, UserPlus } from 'lucide-react'; // ✅ ADDED: LogIn, UserPlus icons
import { motion } from 'framer-motion';
import { Button } from './ui/button'; // ✅ ADDED: Button component

const Navbar = () => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // ✅ ADDED: Track login state
  const navigate = useNavigate()

  // ✅ IMPROVED: Check if user is logged in and update state
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const u = JSON.parse(localStorage.getItem('user'))
        
        if (token && u) {
          setIsLoggedIn(true)
          setUserName(u?.name || null)
        } else {
          setIsLoggedIn(false)
          setUserName(null)
        }
      } catch (e) {
        setIsLoggedIn(false)
        setUserName(null)
      }
    }
    
    checkAuth()
    
    // ✅ Listen for storage changes (for cross-tab login/logout)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/main')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              HireHub
            </h1>
          </motion.div>
          
          {/* Navigation Links */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex space-x-1">
              <NavigationMenuItem>
                <button 
                  onClick={() => navigate('/jobs')} 
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
                >
                  Jobs
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button 
                  onClick={() => navigate('/companies')} 
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
                >
                  Companies
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button 
                  onClick={() => navigate('/profile')} 
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
                >
                  Dashboard
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side - Theme Toggle + Auth Buttons OR Profile */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* ✅ CONDITIONAL RENDERING: Show Login/Sign Up OR Profile based on auth state */}
            {!isLoggedIn ? (
              // ✅ NOT LOGGED IN: Show Login and Sign Up buttons
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')} // ✅ FIXED: Navigate to /login
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
                <Button
                  onClick={() => navigate('/register')} // ✅ FIXED: Navigate to /register
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </motion.div>
            ) : (
              // ✅ LOGGED IN: Show Profile dropdown
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-lg p-1 hover:bg-accent transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <Avatar className="w-9 h-9 rounded-full border-2 border-border overflow-hidden">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" className="w-full h-full object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center w-full h-full text-sm font-semibold">
                      {userName ? userName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium text-sm text-foreground">
                    {userName || 'User'}
                  </span>
                  <motion.svg
                    animate={{ rotate: profileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {profileMenuOpen && (
                  <motion.ul 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-2 text-sm z-50"
                  >
                    <li>
                      <button
                        onClick={() => { setProfileMenuOpen(false); navigate('/profile') }}
                        className="w-full text-left px-4 py-2 hover:bg-accent text-foreground transition-colors"
                        role="menuitem"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => { setProfileMenuOpen(false); navigate('/admin') }}
                        className="w-full text-left px-4 py-2 hover:bg-accent text-foreground transition-colors"
                        role="menuitem"
                      >
                        Employer Dashboard
                      </button>
                    </li>
                    <li className="border-t border-border my-1"></li>
                    <li>
                      <button
                        onClick={() => { 
                          // ✅ IMPROVED: Clear auth and update state
                          localStorage.removeItem('token'); 
                          localStorage.removeItem('user'); 
                          setIsLoggedIn(false);
                          setUserName(null);
                          setProfileMenuOpen(false); 
                          navigate('/') 
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-accent text-destructive transition-colors"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </li>
                  </motion.ul>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
