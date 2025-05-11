// frontend/src/components/Navbar.tsx
import React from 'react';
import './Navbar.css';

interface NavbarProps {
  onNavigate: (page: 'upload' | 'history') => void;
  onLogout: () => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLogout, currentPage }) => (
  <nav>
    <ul className="navbar-ul">
      <div className="navbar-left">
        <li>
          <a
            className={currentPage === 'upload' ? 'active' : ''}
            onClick={() => onNavigate('upload')}
            href="#"
          >
            Upload
          </a>
        </li>
        <li>
          <a
            className={currentPage === 'history' ? 'active' : ''}
            onClick={() => onNavigate('history')}
            href="#"
          >
            Histórico
          </a>
        </li>
      </div>
      <li className="navbar-right">
        <a onClick={onLogout} href="#">
          Sair
        </a>
      </li>
    </ul>
  </nav>
);

export default Navbar;