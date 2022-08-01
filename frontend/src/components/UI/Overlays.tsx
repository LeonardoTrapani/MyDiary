import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Overlays.module.css';

export const Backdrop: React.FC = () => {
  return <div className={styles.backdrop}></div>;
};

const ModalOverlay: React.FC<{
  children: React.ReactElement;
}> = (props) => {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays') as HTMLDivElement;

export const Modal: React.FC<{
  children: React.ReactElement;
}> = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export const Snackbar: React.FC = () => {
  return <div></div>;
};
