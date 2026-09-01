import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ImageModal } from '../ui/ImageModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="w-full bg-surface border-b border-border h-16 flex items-center justify-between px-6 z-40 sticky top-0">
        <Link to="/" className="text-2xl font-heading font-bold text-trust-blue hover:opacity-90 transition-opacity">
          Fidus
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 mr-4 hidden sm:flex">
                {user.profilePicUrl ? (
                  <img 
                    src={user.profilePicUrl} 
                    alt={user.fullName} 
                    className="w-8 h-8 rounded-full object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => setModalOpen(true)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-trust-blue/20 flex items-center justify-center text-trust-blue font-heading font-bold text-sm">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-primary font-body text-sm font-medium">{user.fullName}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-trust-blue/10 text-trust-blue">
                  {user.role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      {user?.profilePicUrl && (
        <ImageModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          imageUrl={user.profilePicUrl} 
          altText={`${user.fullName}'s avatar`}
        />
      )}
    </>
  );
};
