
import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Copyright } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-quiz-primary/90 to-quiz-secondary/90 text-white shadow-md mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold mb-4">Test YourLevel</h2>
            <p className="text-sm text-white/80 text-center md:text-left">
              The ultimate platform for testing knowledge and improving skills through interactive quizzes.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
              <Link to="/login" className="hover:text-white/80 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white/80 transition-colors">Register</Link>
            </nav>
          </div>
          
          {/* Social and contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white/80 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@testyourlevel.com" className="hover:text-white/80 transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm text-white/80">
              contact@testyourlevel.com
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 flex justify-center items-center">
          <div className="flex items-center text-sm text-white/70">
            <Copyright size={16} className="mr-2" />
            <span>{currentYear} Test YourLevel. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
