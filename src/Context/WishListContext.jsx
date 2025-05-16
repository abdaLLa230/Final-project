import axios from "axios";
import {useContext, useEffect, useState, createContext } from "react"


export let WishListContext = createContext();
export let headers ={
     token : localStorage.getItem("userToken") ,
}

export default function WishListContextProvider(props) {


    function addProductToWishList (productId){
       return axios
       .post(`https://ecommerce.routemisr.com/api/v1/wishlist`, {productId : productId} , { headers ,})
       .then((res) => res)
       .catch((err)=> err)    
    } 



    function getUserLogedWishList(){
        return axios
        .get(`https://ecommerce.routemisr.com/api/v1/wishlist`,  { headers, })
        .then((res) => res)
        .catch((err)=> err) 
     } 





     function deleteWishListItem( productId){
        return axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`
            ,{headers})
        .then((res) => res)
        .catch((err)=> err) 
     } 




    return<>
    
    <WishListContext.Provider  value ={{addProductToWishList,getUserLogedWishList,deleteWishListItem}}>
     
     {props.children}

    </WishListContext.Provider>
   
   
    </>   
}