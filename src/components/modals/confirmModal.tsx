import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;    
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'success'; 
  onConfirm: () => void; 
  onCancel: () => void;
}

// 2. Le asignamos la interfaz al objeto de props
export default function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro?",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{title}</h2>
        <p>{message}</p>
        <div>
          <button type="button" onClick={onCancel}>{cancelText}</button>
          <button type="button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}