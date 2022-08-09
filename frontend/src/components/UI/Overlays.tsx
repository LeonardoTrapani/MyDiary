import React from 'react';
import ReactModal from 'react-modal';
import styles from './Overlays.module.css';
import { GrClose } from 'react-icons/gr';
ReactModal.setAppElement('#root');

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel='Modal'
      shouldCloseOnOverlayClick={true}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles['modal--close-icon']} onClick={onClose}>
        <GrClose />
      </div>
      {children}
    </ReactModal>
  );
};

export const Snackbar: React.FC = () => {
  return <div></div>;
};
