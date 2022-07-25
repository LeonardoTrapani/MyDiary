import React from 'react';

import { AcademicCapIcon } from '@heroicons/react/outline';
const NavBar: React.FC = () => {
  return (
    <header>
      <nav className='bg-gray-100 h-14 flex items-center p-3 w-screen drop-shadow-lg'>
        <ul className='flex gap-3 items-center text-gray-900'>
          <li>
            <AcademicCapIcon className='h-8' />
          </li>
          <li>
            <p>Signup</p>
          </li>
          <li>
            <p>Search</p>
          </li>
          <li>
            <p>Home</p>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
