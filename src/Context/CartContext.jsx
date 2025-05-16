


// import axios from "axios";
// import { createContext, useState, useEffect } from "react";

// export let CartContext = createContext();

// export default function CartContextProvider(props) {
//     const [NumOfCartItems, setNumOfCartItems] = useState(0);
//     const [cartId, setcartId] = useState();

//     function getHeaders() {
//         return { token: localStorage.getItem("userToken") };
//     }

//     function getUserLogedCart() {
        
//         return axios
//             .get(`https://ecommerce.routemisr.com/api/v1/cart`, { headers: getHeaders() })
//             .then((res) => {
//                 setNumOfCartItems(res.data.numOfCartItems);
//                 setcartId(res.data.data._id);
//                 return res;
//             })
//             .catch((err) => err);
//     }

//     function addProductToCart(productId) {
//         return axios
//             .post(`https://ecommerce.routemisr.com/api/v1/cart`, { productId }, { headers: getHeaders() })
//             .then((res) => {
//                 getUserLogedCart(); 
//                 return res;
//             })
//             .catch((err) => err);
//     }

//     function updateCartProductQantity(newCount, productId) {
//         return axios
//             .put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { count: newCount }, { headers: getHeaders() })
//             .then((res) => {
//                 getUserLogedCart();
//                 return res;
//             })
//             .catch((err) => err);
//     }

//     function deleteCartItem(productId) {
//         return axios
//             .delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { headers: getHeaders() })
//             .then((res) => {
//                 getUserLogedCart(); 
//                 return res;
//             })
//             .catch((err) => err);
//     }

//     function clearAllCartItems() {
//         return axios
//             .delete(`https://ecommerce.routemisr.com/api/v1/cart`, { headers: getHeaders() })
//             .then((res) => {
//                 setNumOfCartItems(0); 
//                 return res;
//             })
//             .catch((err) => err);
//     }




//     function OnlinePay(cartId, formData, url) {
//         return axios.post(
//                 `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
//                 { shippingAddress: formData },
//                 { headers: getHeaders() }
//             )
//             .then((res) => {
//                 return res;
//             })
//             .catch((err) => {
//                 throw err; 
//             });
//     }


//     function CashOrder(cartId, formData) {
//         return axios.post(
//                 `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
//                 { shippingAddress: formData },
//                 { headers: getHeaders() }
//             )
//             .then((res) => {
//                 return res;
//             })
//             .catch((err) => {
//                 throw err; 
//             });
//     }
    
    


//     useEffect(() => {
//         getUserLogedCart();
//     }, []);

//     return (
//         <CartContext.Provider
//             value={{
//                 clearAllCartItems,
//                 addProductToCart,
//                 deleteCartItem,
//                 updateCartProductQantity,
//                 NumOfCartItems,
//                 setNumOfCartItems,
//                 getUserLogedCart,
//                 OnlinePay,
//                 CashOrder,
//                 cartId
//             }}
//         >
//             {props.children}
//         </CartContext.Provider>
//     );
// }



import axios from "axios";
import { createContext, useState, useEffect } from "react";

export let CartContext = createContext();

export default function CartContextProvider(props) {
    const [NumOfCartItems, setNumOfCartItems] = useState(0);
    const [cartId, setcartId] = useState(null);

    function getHeaders() {
        return { 
            token: localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        };
    }

    function getUserLogedCart() {
        return axios
            .get(`https://ecommerce.routemisr.com/api/v1/cart`, { 
                headers: getHeaders() 
            })
            .then((res) => {
                setNumOfCartItems(res.data.numOfCartItems);
                setcartId(res.data.data._id);
                return res;
            })
            .catch((err) => {
                console.error("Error getting user cart:", err);
                return err;
            });
    }

    function addProductToCart(productId) {
        return axios
            .post(`https://ecommerce.routemisr.com/api/v1/cart`, 
                { productId }, 
                { headers: getHeaders() }
            )
            .then((res) => {
                getUserLogedCart();
                return res;
            })
            .catch((err) => {
                console.error("Error adding product to cart:", err);
                return err;
            });
    }

    function updateCartProductQantity(newCount, productId) {
        return axios
            .put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, 
                { count: newCount }, 
                { headers: getHeaders() }
            )
            .then((res) => {
                getUserLogedCart();
                return res;
            })
            .catch((err) => {
                console.error("Error updating cart quantity:", err);
                return err;
            });
    }

    function deleteCartItem(productId) {
        return axios
            .delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, 
                { headers: getHeaders() }
            )
            .then((res) => {
                getUserLogedCart();
                return res;
            })
            .catch((err) => {
                console.error("Error deleting cart item:", err);
                return err;
            });
    }

    function clearAllCartItems() {
        return axios
            .delete(`https://ecommerce.routemisr.com/api/v1/cart`, 
                { headers: getHeaders() }
            )
            .then((res) => {
                setNumOfCartItems(0);
                setcartId(null);
                return res;
            })
            .catch((err) => {
                console.error("Error clearing cart:", err);
                return err;
            });
    }

    function OnlinePay(cartId, formData, url) {
        return axios
            .post(
                `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
                { shippingAddress: formData },
                { headers: getHeaders() }
            )
            .then((res) => res)
            .catch((err) => {
                console.error("Online payment error:", err);
                throw err;
            });
    }

    function CashOrder(cartId, formData) {
        return axios
            .post(
                `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
                { shippingAddress: formData },
                { headers: getHeaders() }
            )
            .then((res) => res)
            .catch((err) => {
                console.error("Cash order error:", err);
                throw err;
            });
    }

    useEffect(() => {
        getUserLogedCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                NumOfCartItems,
                cartId,
                addProductToCart,
                updateCartProductQantity,
                deleteCartItem,
                clearAllCartItems,
                getUserLogedCart,
                OnlinePay,
                CashOrder
            }}
        >
            {props.children}
        </CartContext.Provider>
    );
}