import React from 'react'
import { useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Button from './Button';

const Navbar = () => {
    const pathname = useLocation().pathname;
    const { logout } = useAuth();
    return (
        <div className='flex justify-between items-center h-20 px-12 shadow-md'>
            <img src="TT Logo.png" width={250} alt="Logo" />
            {!pathname.includes('login') && <Button onClick={logout}>Log out</Button>}
        </div>
    )
}

export default Navbar