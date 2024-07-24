import React from 'react'

import logo from '../../assets/open-book.png';
import menu from '../../assets/menu.png';
import close from '../../assets/close.png';
import {Link} from 'react-router-dom';

function AdminNavbar() {
    return (
        <nav>
            {/* logo */}
            <div className='flex gap-2 m-2 items-center'>
                <img src={logo} alt="Logo" className='object-cover max-w-12 max-h-12' />
                <span className='text-lg font-medium font-display'>Schooler</span>
            </div>

            {/* settings */}

        </nav>
    );
}

export default AdminNavbar;
