import React from 'react'
import { Navigate } from 'react-router-dom'
import style from "./ProtectedRoute.module.css"






export default function ProtectedRoute (props) {
  if(localStorage.getItem("userToken")){
   return props.children
  }
  else {
    return <Navigate to={"/Login"}/>
  }

  
  
  
}
