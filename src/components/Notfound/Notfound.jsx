import React from 'react';
import { Link } from 'react-router-dom';
import errorImage from "../../assets/error.svg"; 

export default function Notfound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl text-red-500 font-bold text-center w-max pt-4 pb-6 hover:text-green-600">
        Oops! Page Not Found!
      </h1>
      
      
      <img src={errorImage} alt="Not Found" className="w-max pb-20" />

      <Link to={localStorage.getItem("userToken") ? "/" : "/Login"}>
        <span className="text-slate-700 pb-[1px] text-2xl relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-400 font-bold  before:transition-all before:duration-300 hover:before:w-full">
          Go Back  <i className="fa-solid ps-5 fa-right-to-bracket"></i>
        </span>
      </Link>
    </div>
  );
}
