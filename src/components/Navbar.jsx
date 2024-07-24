import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/open-book.png';
import menu from '../assets/menu.png';
import close from '../assets/close.png';
import { Link } from 'react-router-dom';

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);

    // Function to toggle the mobile menu
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    
    return (
        <nav className='flex p-3 justify-between items-center'>

            {/* Logo */}
            <Link to='/home' className='flex gap-2 items-center'>
                <img src={logo} alt="Logo" className='object-cover max-w-12 max-h-12' />
                <span className='text-lg font-medium font-display'>Schooler</span>
            </Link>

            {/* Desktop Menu Items */}
            <div className='hidden md:flex gap-12 p-5'>
                <Link to="/home" className='text-lg hover:text-blue-600'>Home</Link>
                <Link to="/services" className='text-lg hover:text-blue-600'>Services</Link>
                <Link to="/home" className='text-lg hover:text-blue-600'>About us</Link>
                <Link to="/login" className='text-lg hover:text-blue-600'>Login</Link>
            </div>

            {/* Mobile Menu Icon */}
            <button className='p-2 md:hidden' onClick={toggleMenu}>
                <img src={menu} alt="Menu" className={`object-cover max-w-6 max-h-8 ${showMenu ? 'hidden' : 'block'}`} />
                <img src={close} alt="Close" className={`object-cover max-w-6 max-h-8 ${showMenu ? 'block' : 'hidden'}`} />
            </button>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-white flex flex-col items-center transform ${showMenu ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out`}>
                <div id='nav-bar' className='flex justify-between w-full p-4'>
                    {/* Logo in Mobile Menu */}
                    <Link to='/home' className='flex gap-2 items-center'>
                        <img src={logo} alt="Logo" className='object-cover max-w-12 max-h-12' />
                        <span className='text-lg font-medium font-display'>Schooler</span>
                    </Link>

                    {/* Close Button for Mobile Menu */}
                    <button className='p-2' onClick={toggleMenu}>
                        <img src={close} alt="Close" className='object-cover max-w-6 max-h-8' />
                    </button>
                </div>

                {/* Links in Mobile Menu */}
                <div className='flex flex-col justify-center items-center gap-8'>
                    <Link to="/home" className='text-lg hover:text-blue-600' onClick={toggleMenu}>Home</Link>
                    <Link to="/services" className='text-lg hover:text-blue-600' onClick={toggleMenu}>Services</Link>
                    <Link to="/home" className='text-lg hover:text-blue-600' onClick={toggleMenu}>About us</Link>
                    <Link to="/login" className='text-lg hover:text-blue-600' onClick={toggleMenu}>Login</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
