import React from 'react';
import Navbar from '../layout/Navbar';
import Routes from './Routes';
import Footer from '../layout/Footer';

const MainPanel = () => {
    return (  
        <div className="main-panel">     
            <Navbar/>           
            <Routes/>
            <Footer/>  
               
        </div>
       
    )
}
export default MainPanel;