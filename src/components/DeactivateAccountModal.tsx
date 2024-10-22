// src/components/DeactivateAccountModal.tsx

import React, { useState } from 'react';
import { deactivate } from '../services/api';

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null); // Updated type to include null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Now accepts null

    if (!username || !password) {
      setMessage('Username and password are required.');
      return;
    }

    try {
      const response = await deactivate(username, password);
      // Assuming deactivate returns { status: number, message: string }
      if (response.status === 200) {
        setMessage('Account deactivated successfully.');
      } else {
        setMessage('Failed to deactivate account.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while deactivating the account.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deactivate-account-title"
    >
      <div className="modal-content">
        <button className="close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 id="deactivate-account-title">Deactivate Account</h2>
        {message && <p role="alert">{message}</p>}{' '}
        {/* Added role="alert" for accessibility */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username-input">Username:</label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password-input">Password:</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">ARE YOU SURE</button>
        </form>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;
