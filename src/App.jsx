import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Categories from './components/Categories/Categories';
import Brands from './components/Brands/Brands';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Notfound from './components/Notfound/Notfound';
import UserContextProvider from './Context/UserContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProductDetails from './components/ProductDetails/ProductDetails';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CartContextProvider from './Context/CartContext';
import { Toaster } from 'react-hot-toast';
import WishList from './components/WishList/WishList';
import WishListContextProvider from './Context/WishListContext';
import CheckOut from './components/CheckOut/CheckOut';
import Orders from './components/Orders/Orders';


let x = createBrowserRouter([
  {path:"" , element : <Layout/> ,
  children : [
    { index : true  , element : <Home/>},
    {path:"products" , element :<ProtectedRoute> <Products/> </ProtectedRoute> },
    {path:"productdetails/:id/:category" , element :<ProtectedRoute> <ProductDetails/> </ProtectedRoute> },
    {path:"cart" , element :<ProtectedRoute> <Cart/> </ProtectedRoute> },
    {path:"allOrders" , element :<ProtectedRoute> <Orders/> </ProtectedRoute> },
    {path:"brands" , element :<ProtectedRoute> <Brands/> </ProtectedRoute> },
    {path:"categories" , element :<ProtectedRoute> <Categories/> </ProtectedRoute> },
    {path:"register" , element : <Register/>},
    {path:"wishlist" , element : <ProtectedRoute><WishList/></ProtectedRoute>},
    {path:"checkout" , element : <ProtectedRoute><CheckOut/></ProtectedRoute>},
    {path:"login" , element : <Login/>},
    {path:"*" , element : <Notfound/>},
  ]}
  
])

let query = new QueryClient()




function App() {
  

  return <>
      
  <UserContextProvider>
    <QueryClientProvider client={query}>
      <CartContextProvider>
        <WishListContextProvider>
          <RouterProvider  router={x}></RouterProvider>
            <Toaster   position="bottom-right"
            
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
                padding: '10px',
              },
              success: {
                icon: '✅',
                style: {
                  background: '#4CAF50',
                  color: '#fff',
                },
              },
              error: {
                icon: '❌',
                style: {
                  background: '#F44336',
                  color: '#fff',
                },
              },
            }}
            containerStyle={{
              bottom: 20, // تحكم دقيق بالمكان
              right: 20,
            }}
            />
        </WishListContextProvider>
      </CartContextProvider>
      <ReactQueryDevtools/>
    </QueryClientProvider> 
  </UserContextProvider>


    </> 
}

export default App
