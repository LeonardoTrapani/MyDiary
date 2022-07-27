import React from 'react';
import styles from './NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../utilities/contants';

const NavBar: React.FC = () => {
  const navBarItems = NAVIGATION_ITEMS.map((navigation_item) => {
    return (
      <li key={navigation_item.name}>
        <NavLink to={navigation_item.to}>{navigation_item.name}</NavLink>
      </li>
    );
  });
  return (
    <header>
      <nav className={'shadow ' + styles['nav-bar']}>
        <ul>{navBarItems}</ul>
      </nav>
    </header>
  );
};

export default NavBar;
