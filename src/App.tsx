import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { checkAuth } from './store/auth-slice';
import { Skeleton } from './components/ui/skeleton';
import AuthLayout from './components/auth/layout';
import AuthRegister from './pages/auth/register';
import AuthLogin from './pages/auth/login';
import AdminLayout from './components/admin-view/layout';
import AdminDashboard from './pages/admin-view/Dashboard';
import AdminOrders from './pages/admin-view/Orders';
import AdminProducts from './pages/admin-view/Products';
import ShoppingLayout from './components/shop-view/layout';
import NotFoundPage from './pages/not-found/NotFoundPage';
import NotAuthPage from './pages/not-auth/NotAuthPage';
import CheckAuth from '@/components/common/check-auth';
import Homepage from './pages/shopping-view/shopHome';
import ListingPage from './pages/shopping-view/listing';
import CheckoutPage from './pages/shopping-view/checkout';
import AccountPage from './pages/shopping-view/account';
import SearchPage from './pages/shopping-view/search';
import { RootState, AppDispatch } from './store/store';
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600]" />;
  // console.log(isLoading, user);
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              {' '}
            </CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />{' '}
            </CheckAuth>
          }
        >
          <Route path="register" element={<AuthRegister />} />
          <Route path="login" element={<AuthLogin />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<Homepage />} />
          <Route path="listing" element={<ListingPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
        <Route path="/unauth-page" element={<NotAuthPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
