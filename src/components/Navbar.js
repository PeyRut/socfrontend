// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaExpand,
  FaCompress,
  FaUserShield,
  FaUserCircle,
} from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/logo.png';

const Nav = styled.nav`
  background: var(--secondary-background);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  margin-right: 10px;
`;

const Brand = styled.div`
  color: var(--accent-color);
  font-size: 1.5em;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  gap: 5px; /* Adjust gap as needed */
`;

const UsernameDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: var(--text-color);
`;

const UsernameText = styled.span`
  margin-left: 8px;
`;

const IconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  font-size: 1.5em;
  text-decoration: none;
  height: 40px;
  width: 40px;

  &:hover {
    color: var(--accent-color);
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5em;
  cursor: pointer;
  outline: none;
  height: 40px;
  width: 40px;

  &:hover {
    color: var(--accent-color);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const LogoutButton = styled.button`
  background: var(--accent-color);
  border: none;
  color: var(--button-text-color);
  padding: 8px 12px;
  border-radius: 4px;
  margin-left: 20px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background: var(--hover-accent);
  }
`;

const Navbar = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || '');
        setIsAdmin(decoded.isAdmin || false);
      } catch (err) {
        console.error('Error decoding token:', err);
        setUsername('');
        setIsAdmin(false);
      }
    }
  }, []);

  return (
    <Nav>
      <BrandContainer>
        <Logo src={logo} alt="Company Logo" />
        <Brand>BeyondID SOC Rotation Dashboard</Brand>
      </BrandContainer>
      <NavLinks>
        <IconGroup>
          <IconLink to="/calendar">
            <FaCalendarAlt />
          </IconLink>
          <IconButton onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </IconButton>
          {isAdmin && (
            <IconLink to="/admin">
              <FaUserShield />
            </IconLink>
          )}
        </IconGroup>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        {username && (
          <UsernameDisplay>
            <FaUserCircle style={{ fontSize: '1.5em' }} />
            <UsernameText>{username}</UsernameText>
          </UsernameDisplay>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
