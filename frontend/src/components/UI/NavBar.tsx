import React from 'react';
import styles from './NavBar.module.css';
import { AcademicCapIcon } from '@heroicons/react/outline';
import { NavLink } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <header>
      <nav className={'shadow ' + styles['nav-bar']}>
        <ul>
          <li>
            <AcademicCapIcon className='h-8' />
          </li>
          <li>
            <NavLink to='/signup'>Signup</NavLink>
          </li>
          <li>
            <NavLink to='/signup'>Search</NavLink>
          </li>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
