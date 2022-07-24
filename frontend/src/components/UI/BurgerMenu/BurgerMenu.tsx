import React from 'react';
import { slide as Menu } from 'react-burger-menu';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { uiActions } from '../../../store/ui-slice';
import { BiCalendarStar, BiChip, BiAccessibility } from 'react-icons/bi';

import BurgerItem from './BurgerItem';
const BurgerMenu = () => {
  const dispatch = useAppDispatch();

  const styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '36px',
      height: '30px',
      left: '36px',
      top: '36px',
    },
    bmBurgerBars: {
      background: '#373a47',
    },
    bmBurgerBarsHover: {
      background: '#a90000',
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
    },
    bmCross: {
      background: '#bdc3c7',
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
    },
    bmMenu: {
      background: '#373a47',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em',
    },
    bmMorphShape: {
      fill: '#373a47',
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em',
    },
    bmItem: {
      display: 'block',
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  };
  const isHamburgerOpen = useAppSelector((state) => state.ui.burgerMenuOpen);
  const openHamburgerHandler = () => {
    dispatch(uiActions.openBurgerMenu());
  };
  const closeHamburgerHandler = () => {
    dispatch(uiActions.closeBurgerMenu());
  };
  const ICON_SIZE = 20;
  return (
    <Menu
      styles={styles}
      onOpen={openHamburgerHandler}
      isOpen={isHamburgerOpen}
      onClose={closeHamburgerHandler}
    >
      <BurgerItem path='/'>
        <>
          <BiCalendarStar size={ICON_SIZE} />
          <p>Home</p>
        </>
      </BurgerItem>
      <BurgerItem path='/login'>
        <>
          <BiChip size={ICON_SIZE} />
          <p>Login</p>
        </>
      </BurgerItem>
      <BurgerItem path='/signup'>
        <>
          <BiAccessibility size={ICON_SIZE} />
          <p>Signup</p>
        </>
      </BurgerItem>
    </Menu>
  );
};

export default BurgerMenu;
