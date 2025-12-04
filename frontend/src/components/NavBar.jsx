import React from 'react'
import { useNavigate } from 'react-router-dom';


export default function NavBar() {
    const navigate = useNavigate();
     const handleGoHome = () => navigate('/');
  return (
   <>
   <div className="nav">
    <div className="left-nav">
        <ul>
            <li><button onClick={handleGoHome}>Home</button></li>
        </ul>
    </div>
     <div className="center-nav">
        <div className="logo"></div>
     </div>
      <div className="right-nav">
        <div className="user-profile"></div>
      </div>
   </div>
   
 
   </>
  )
}
