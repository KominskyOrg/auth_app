import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import DeactivateAccountModal from './DeactivateAccountModal';


const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const navigate = useNavigate();


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div>
    <h2>Home Page</h2>
    <p>Welcome to the home page!</p>
    <button onClick={handleLoginClick}>Login</button>
    <button onClick={handleRegisterClick}>Register</button>
      <button onClick={handleOpenModal}>Delete Account</button>
      <DeactivateAccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage;
