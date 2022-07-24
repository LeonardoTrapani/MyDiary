import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';

const BurgerMenu: React.FC = () => {
  return (
    <Menu>
      <Link to='/login'>Login</Link>
      <Link to='/signup'>Signup</Link>
      <Link to='/home'>Home</Link>
    </Menu>
  );
};

export default BurgerMenu;
