import React, { useState } from 'react';
import { deactivate } from '../services/api';

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeactivateAccountModal: React.FC<DeactivateAccountModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await deactivate(username, password);
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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Deactivate Account</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit">ARE YOU SURE</button>
        </form>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;
