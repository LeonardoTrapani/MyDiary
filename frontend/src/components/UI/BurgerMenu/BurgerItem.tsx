import React from 'react';
import { NavLink } from 'react-router-dom';

const BurgerItem: React.FC<{
  path: string;
  children?: JSX.Element;
}> = (props) => {
  return (
    <div>
      <NavLink
        to={props.path}
        className='flex items-center gap-3 text-indigo-100 hover:text-indigo-400 p-2 text-xl'
      >
        {props.children}
      </NavLink>
    </div>
  );
};

export default BurgerItem;
