import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { uiActions } from '../../store/ui-slice';

const BurgerItem: React.FC<{
  path: string;
  children?: JSX.Element;
}> = (props) => {
  const dispatch = useAppDispatch();
  const clickHandler = () => {
    dispatch(uiActions.closeBurgerMenu());
  };
  return (
    <div>
      <NavLink
        to={props.path}
        onClick={clickHandler}
        className='flex items-center gap-3 text-zinc-800 hover:text-blue-500 p-2 text-xl font-medium'
      >
        {props.children}
      </NavLink>
    </div>
  );
};

export default BurgerItem;
