import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    content: null,
    props: {}
  });

  const openModal = (content, props = {}) => {
    setModal({
      isOpen: true,
      content,
      props
    });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      content: null,
      props: {}
    });
    document.body.style.overflow = 'auto';
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50">
          {React.cloneElement(modal.content, { ...modal.props, onClose: closeModal })}
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext;
