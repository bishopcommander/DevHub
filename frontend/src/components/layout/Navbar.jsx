import React, { useState } from 'react';
import { Menu, X, Github } from 'lucide-react';

export const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-dark-950/80 backdrop-blur-md border-b border-dark-800 z-50">
      <div className="container-app flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-white">
            DH
          </div>
          <span className="text-xl font-bold gradient-text">DevHub</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-dark-300 hover:text-primary transition">Features</a>
          <a href="#pricing" className="text-dark-300 hover:text-primary transition">Pricing</a>
          <a href="#testimonials" className="text-dark-300 hover:text-primary transition">Testimonials</a>
          <button className="btn-primary btn-sm">Start Coding Smarter</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dark-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-900 border-t border-dark-800 p-4 space-y-4">
          <a href="#features" className="block text-dark-300 hover:text-primary">Features</a>
          <a href="#pricing" className="block text-dark-300 hover:text-primary">Pricing</a>
          <a href="#testimonials" className="block text-dark-300 hover:text-primary">Testimonials</a>
          <button className="btn-primary w-full">Start Coding Smarter</button>
        </div>
      )}
    </nav>
  );
};

export const DashboardNavbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-dark-900 border-b border-dark-800 h-16 flex items-center px-6">
      <button onClick={onMenuClick} className="text-dark-300 hover:text-primary md:hidden">
        <Menu size={24} />
      </button>
      
      <div className="flex-1 flex items-center justify-end gap-6 ml-6 md:ml-0">
        <input 
          type="text" 
          placeholder="Quick search..." 
          className="input w-64 hidden md:block"
        />
        
        <div className="flex items-center gap-4">
          <button className="text-dark-300 hover:text-primary relative">
            <span className="text-2xl">🔔</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition">
            P
          </div>
        </div>
      </div>
    </nav>
  );
};
