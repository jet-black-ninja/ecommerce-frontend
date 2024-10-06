import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { CheckAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import  AuthRegister  from "./pages/auth/register"
import  AuthLogin  from './pages/auth/login';
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminOrders from "./pages/admin-view/Orders";
import AdminProducts from "./pages/admin-view/Products";
import ShoppingLayout from './components/shop-view/layout';
import NotFoundPage from "./pages/not-found/NotFoundPage";
import NotAuthPage from "./pages/not-auth/NotAuthPage";

function App() {
  const {user,isAuthenticated, isLoading} = useSelector(
    (state)=> state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CheckAuth());
  },[dispatch]);
  if(isLoading) return <Skeleton className="w-[800] bg-black h-[600]"/>;
  // console.log(isLoading, user);
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route 
        path='/' 
        element={
          <CheckAuth 
          isAuthenticated={isAuthenticated} 
          user={user}></CheckAuth>
          }
        />
        <Route path ="/auth" element={<AuthLayout />} >
          <Route path = "register" element ={<AuthRegister/>}/>
          <Route path = 'login' element = {<AuthLogin/>}/>
        </Route>

        <Route path = "/admin" element={<AdminLayout />}>
          <Route path = "dashboard" element={<AdminDashboard/>}/>
          <Route path = "orders" element ={<AdminOrders/>} />
          <Route path = "products" element = {<AdminProducts/>} />
        </Route>

        <Route path = "/shop" element ={<ShoppingLayout/>}>
          <Route path = "" />
        </Route>
        <Route path ="/unauth" element ={<NotAuthPage />}/>
        <Route path="/*" element={<NotFoundPage/>} />
      </Routes>
    </div>
  )
}

export default App
