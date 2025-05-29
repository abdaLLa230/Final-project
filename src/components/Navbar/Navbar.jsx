import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/freshcart-logo.svg";
import { UserContext } from './../../Context/UserContext';
import { CartContext } from '../../Context/CartContext';

export default function Navbar() {
  let navigate = useNavigate();
  let { UserLogin, setUserLogin } = useContext(UserContext);
  let { NumOfCartItems } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mobileMenuRef = useRef(null);
  const burgerButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        if (burgerButtonRef.current && !burgerButtonRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      if (showProfileMenu) {
        if (
          profileButtonRef.current &&
          !profileButtonRef.current.contains(event.target) &&
          (!event.target.closest('.profile-menu-mobile') && !event.target.closest('.profile-menu-desktop'))
        ) {
          setShowProfileMenu(false);
        }
      }
    };
    document.addEventListener('', handleClickOutside);
    return () => {
      document.removeEventListener('', handleClickOutside);
    };
  }, [isOpen, showProfileMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 1200 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  function signout() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/login");
    setShowProfileMenu(false); // إضافة هذا السطر لإغلاق القائمة بعد تسجيل الخروج
  }

  const closeAllMenus = () => {
    setIsOpen(false);
    setShowProfileMenu(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 mt-0 bg-gray-300/95 backdrop-blur-md rounded-2xl border text-black border-white/20 shadow-lg w-[90%] max-w-7xl px-8  mx-auto left-0 right-0 top-5 "
          >
            <div className="flex items-center justify-between py-3 w-full">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.4 }}
                className='flex items-center'
              >
                <Link to="" className="items-center space-x-3 rtl:space-x-reverse" onClick={closeAllMenus}>
                  <img src={logo} width={"120px"} className="h-8" alt="Fresh cart" />
                </Link>
              </motion.div>

              {UserLogin !== null && (
                <ul className='hidden md:flex gap-5 font-serif mx-6'>
                  <li><Link to="" className="text-black hover:text-blue-500 transition-colors text-base font-medium">Home</Link></li>
                  <li><Link to="products" className="text-black hover:text-blue-500 transition-colors text-base font-medium">Products</Link></li>
                  <li><Link to="wishlist" className="text-black hover:text-blue-500 transition-colors text-base font-medium">Wish List</Link></li>
                  <li><Link to="categories" className="text-black hover:text-blue-500 transition-colors text-base font-medium">Categories</Link></li>
                  <li><Link to="brands" className="text-black hover:text-blue-500 transition-colors text-base font-medium">Brands</Link></li>
                  <li><Link to="allorders" className="text-black hover:text-blue-500 transition-colors text-base font-medium">My Orders</Link></li>
                </ul>
              )}

              <div className="flex items-center gap-6">
                {/* Cart icon for large screens only */}
                {UserLogin !== null && (
                  <Link to="cart" className="hidden md:flex items-center relative text-green-500">
                    <i className="fa-solid fa-cart-shopping text-2xl"></i>
                    {NumOfCartItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {NumOfCartItems}
                      </span>
                    )}
                  </Link>
                )}
                
                {/* Mobile icons */}
                {UserLogin !== null ? (
                  <div className="flex items-center gap-3">
                    {/* User icon for mobile - shown only on mobile */}
                    <button 
                      ref={profileButtonRef}
                      onClick={() => {
                        setShowProfileMenu(!showProfileMenu);
                        setIsOpen(false);
                      }}
                      className="md:hidden flex items-center justify-center text-white hover:text-blue-300 transition-colors focus:outline-none"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center bg-white/20 shadow-md hover:bg-white/30 transition-all">
                        <i className="fa-solid fa-user text-md text-blue-500"></i>
                      </div>
                    </button>
                    
                    {/* Burger menu button - hidden on large screens */}
                    <motion.button 
                      ref={burgerButtonRef}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="md:hidden  focus:outline-none flex items-center justify-center w-9 h-9 rounded-full bg-white/50 hover:bg-white/20 transition-all"
                      onClick={() => {
                        setIsOpen(!isOpen);
                        setShowProfileMenu(false);
                      }}
                    >
                      <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
                    </motion.button>
                    
                    {/* Desktop profile */}
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="relative hidden md:block"
                    >
                      <button 
                        ref={profileButtonRef}
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="text-white hover:text-blue-300 focus:outline-none relative group"
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center bg-white/20 shadow-md hover:shadow-lg transition-all duration-300 group-hover:border-blue-500">
                          <i className="fa-solid fa-user text-xl text-blue-500 group-hover:text-blue-500"></i>
                        </div>
                      </button>
                      <AnimatePresence>
                        {showProfileMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0  md:mt-3 w-40 md:w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-white/20 hidden md:block"
                          >
                            <div className="px-4    border-b border-gray-100">
                              <p className="text-sm text-gray-500">Welcome</p>
                            </div>
                            <Link 
                              to="profile" 
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <i className="fa-solid fa-user-circle text-lg w-6 text-blue-500"></i>
                              <span className="ml-3">Profile</span>
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={signout}
                              className="flex items-center w-full pb-0 mb-0.5 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                            >
                              <i className="fa-solid fa-right-from-bracket text-lg w-6 text-red-500"></i>
                              <span className="ml-3">Sign Out</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Link className=' border-2 pt-1 border-blue-400 cursor-pointer rounded-xl p-2 focus:border-b-2 ' to="login">
                      Login
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Link className='  cursor-pointer rounded-xl pt-1 p-2 focus:border-b-2 border-2  border-blue-400' to="register">
                      Register
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  ref={mobileMenuRef}
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="md:hidden bg-white/95 backdrop-blur-md w-full absolute top-full left-0 mt-2 rounded-xl shadow-lg overflow-hidden border border-white/20"
                >
                  <div className="p-4">
                    <ul className='flex flex-col gap-3 text-lg font-serif'>
                      <li><Link to="" className="text-slate-700 block py-2 hover:text-blue-600 transition-colors font-medium" onClick={closeAllMenus}>Home</Link></li>
                      <li><Link to="categories" className="text-slate-700 block py-2 hover:text-blue-600 transition-colors font-medium" onClick={closeAllMenus}>Categories</Link></li>
                      <li><Link to="brands" className="text-slate-700 block py-2 hover:text-blue-600 transition-colors font-medium" onClick={closeAllMenus}>Brands</Link></li>
                      <li><Link to="allorders" className="text-slate-700 block py-2 hover:text-blue-600 transition-colors font-medium" onClick={closeAllMenus}>My Orders</Link></li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation - Only shows quick actions */}
      {UserLogin !== null && (
        <div className="md:hidden fixed left-1/2 bottom-4 -translate-x-1/2 z-40 bg-gray-300/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg w-[95%]  px-4 py-2 flex justify-around items-center">
          <Link to="products" className="flex flex-col items-center text-gray-600*20  transition-colors" onClick={closeAllMenus}>
            <i className="fa-solid fa-store text-blue-500 text-xl"></i>
            <span className="text-xs mt-1">Products</span>
          </Link>
          <Link to="wishlist" className="flex flex-col items-center text-gray-600*20  transition-colors" onClick={closeAllMenus}>
            <i className="fa-solid fa-heart text-red-600 text-xl"></i>
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
          <Link to="cart" className="flex flex-col items-center text-gray-600*20  transition-colors" onClick={closeAllMenus}>
            <div className="relative">
              <i className="fa-solid fa-cart-shopping text-green-600 text-xl"></i>
              {NumOfCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600  text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                  {NumOfCartItems}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">Cart</span>
          </Link>
        </div>
      )}

      {/* Mobile profile menu (outside md:block, only md:hidden) */}
      <AnimatePresence>
        {showProfileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed left-1/2 -translate-x-1/2 w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 border border-white/20"
            style={{ top: '80px' }}
          >
            <div className="px-4  border-b border-gray-100">
              <p className="text-sm text-gray-500">Welcome</p>
            </div>
            <Link 
              to="profile" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setShowProfileMenu(false)}
            >
              <i className="fa-solid fa-user-circle text-lg w-6 text-blue-500"></i>
              <span className="ml-3">Profile</span>
            </Link>
            <div className="border-t border-gray-100 my-1"></div>
            <button 
              onClick={signout}
              className="flex items-center w-full pb-0 mb-0.5 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <i className="fa-solid fa-right-from-bracket text-lg w-6 text-red-500"></i>
              <span className="ml-3">Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
