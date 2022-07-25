import React, { ReactNode } from 'react';

const Card: React.FC<{ children?: ReactNode }> = (props) => {
  return <div className='drop-shadow-lg p-3 min-w-min'>{props.children}</div>;
};
export default Card;
