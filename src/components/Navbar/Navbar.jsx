import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import logo from "../../assets/freshcart-logo.svg";
import { UserContext } from './../../Context/UserContext';
import { CartContext } from '../../Context/CartContext';

export default function Navbar() {
  let navigate = useNavigate();
  let { UserLogin, setUserLogin } = useContext(UserContext);
  let { NumOfCartItems } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  function signout() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/login");
  }

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 border-gray-200 bg-slate-200"
    >
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.4 }}
          className='flex items-center'
        >
          <Link to="" className="items-center space-x-3 rtl:space-x-reverse" onClick={closeMobileMenu}>
            <img src={logo} width={"150px"} className="h-8" alt="Fresh cart" />
          </Link>
        </motion.div>

        {UserLogin !== null && (
          <ul className='hidden md:flex gap-3 font-serif'>
            <li><Link to="" className="text-slate-600">Home</Link></li>
            <li><Link to="products" className="text-slate-600">Products</Link></li>
            <li><Link to="wishlist" className="text-slate-600">Wish List</Link></li>
            <li><Link to="categories" className="text-slate-600">Categories</Link></li>
            <li><Link to="brands" className="text-slate-600">Brands</Link></li>
            <li><Link to="allorders" className="text-slate-600">My Orders</Link></li>
          </ul>
        )}

        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <ul className='flex gap-5 items-center'>
            {UserLogin !== null && (
              <motion.li 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Link to="cart" onClick={closeMobileMenu} className="flex items-center">
                  <i className="fa-solid text-green-600 hover:text-green-700 cursor-pointer text-[25px] fa-cart-shopping"></i>
                  {NumOfCartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {NumOfCartItems}
                    </span>
                  )}
                </Link>
              </motion.li>
            )}

            {UserLogin !== null ? (
              <>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link 
                    onClick={() => {
                      signout();
                      closeMobileMenu();
                    }} 
                    className='hover:text-blue-800 border pt-1 border-blue-700 cursor-pointer rounded-xl p-2'
                  >
                    LogOut
                  </Link>
                </motion.li>
                <motion.button 
                  whileHover={{ scale: 1.2 }}
                  className="text-gray-700 focus:outline-none md:hidden" 
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <i className="fa-solid fa-bars text-xl"></i>
                </motion.button>
              </>
            ) : (
              <>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link className='hover:text-blue-800 border pt-1 border-blue-700 cursor-pointer rounded-xl p-2 focus:border-b-2 focus:border-blue-400' to="login">
                    Login
                  </Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link className='hover:text-blue-800 border border-blue-700 cursor-pointer rounded-xl pt-1 p-2 focus:border-b-2 focus:border-blue-400' to="register">
                    Register
                  </Link>
                </motion.li>
              </>
            )}
          </ul>
        </div>
      </div>

      <motion.div 
        initial={{ height: 0, opacity: 0 }} 
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} 
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="md:hidden bg-slate-200 w-full absolute top-full left-0 shadow-md overflow-hidden"
      >
        <ul className='flex flex-col gap-3 p-4 text-center text-lg font-serif'>
          <li><Link to="" className="text-slate-600 block py-0.5" onClick={closeMobileMenu}>Home</Link></li>
          <li><Link to="products" className="text-slate-600 block py-0.5" onClick={closeMobileMenu}>Products</Link></li>
          <li><Link to="wishlist" className="text-slate-600 block py-0.5" onClick={closeMobileMenu}>Wish List</Link></li>
          <li><Link to="categories" className="text-slate-600 block py-0.5" onClick={closeMobileMenu}>Categories</Link></li>
          <li><Link to="brands" className="text-slate-600 block py-0.5" onClick={closeMobileMenu}>Brands</Link></li>
          <li><Link to="allorders" className="text-slate-600 block py-0.5" onClick={closeMobileMenu}>My Orders</Link></li>
        </ul>
      </motion.div>

      <motion.button 
        whileHover={{ scale: 1.2 }}
        className="fixed top-20 right-5 bg-sky-400 text-white p-2 rounded-full shadow-lg focus:outline-none"
        onClick={() => setShowSocial(!showSocial)}
      >
        <i className="fa-solid fa-circle-user text-lg px-1"></i>
      </motion.button>

      {showSocial && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.3 }}
          className="fixed top-28 right-5 bg-white p-4 shadow-lg rounded-lg flex gap-5 text-xl"
        >
          <a href="https://www.facebook.com/share/1C9a3TCRWX/?mibextid=wwXIfr"><i className='fab text-slate-600 fa-facebook'></i></a>
          <a href="https://www.instagram.com/abdalla7_elbana?igsh=MTYzbm13dHhrMXY4Mw%3D%3D&utm_source=qr"><i className='fab text-slate-600 fa-instagram'></i></a>
          <a href="https://www.tiktok.com/@abdalla7ali?_t=ZS-8wO54LfIxPk&_r=1"><i className='fab text-slate-600 fa-tiktok'></i></a>
          <a href="https://x.com/skill_camper?s=21"><i className='fab text-slate-600 fa-twitter'></i></a>
          <a href="https://www.linkedin.com/in/abdallah-ali-3b5956307?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"><i className='fab text-slate-600 fa-linkedin'></i></a>
        </motion.div>
      )}
    </motion.nav>
  );
}