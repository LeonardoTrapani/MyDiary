import React from 'react';
import ReactDOM from 'react-dom';
import { useAppSelector } from '../../utilities/hooks';
import styles from './Overlays.module.css';

export const Backdrop: React.FC<{
  onClose: () => void;
}> = (props) => {
  return <div className={styles.backdrop} onClick={props.onClose} />;
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
  onClose: () => void;
}> = (props) => {
  const modalOpened = useAppSelector((state) => state.ui.modalOpened);
  return modalOpened ? (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </>
  ) : (
    <></>
  );
};

export const Snackbar: React.FC = () => {
  return <div></div>;
};
