import React, { useEffect, useState } from 'react';
import UpperNav from '../components/UpperNav';
import Navbar from '../components/Navbar';
import './Home.css';
import Footer from '../components/Footer';
import { RecipeMenu } from './RecipeMenu';
import  LoginMenu from '../components/LoginMenu'
const Home = () => {
  const [userName, setUserName] = useState('');
  const [email, setUserEmail] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData) {
      setUserName(userData.name);
      setUserEmail(userData.email);
    }
  }, []);

  return (
    <div>
        <UpperNav userName={userName} email ={email}/>
        
        {userName?<>
        <Navbar/>
        <RecipeMenu/>
        </>:
        <LoginMenu/>
        }
        <Footer />
    </div>
  );
};

export default Home;
