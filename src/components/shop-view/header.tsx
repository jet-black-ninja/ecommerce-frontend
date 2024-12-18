import { House, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { shoppingViewHeaderMenuItems } from '@/config/config';
import { Label } from '../ui/label';
import { AppDispatch, RootState } from '@/store/store';
import { logoutUser } from '@/store/auth-slice';
import { fetchCartItems } from '@/store/shop/cart-slice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import UserCartWrapper from './cartWrapper.tsx';
import { Avatar, AvatarFallback } from '../ui/avatar.tsx';

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  function handleNavigate(getCurrentMenuItem: any) {
    sessionStorage.removeItem('filters');
    const currentFilter =
      getCurrentMenuItem.id !== 'home' &&
      getCurrentMenuItem.id !== 'products' &&
      getCurrentMenuItem.id !== 'search'
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));

    if (location.pathname.includes('listing') && currentFilter !== null) {
      setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      );
    } else navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className={`text-sm font-medium cursor-pointer hover:underline`}
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { cartItems = { items: [] } } = useSelector(
    (state: RootState) => state.shopCart
  );
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  function handleLogout() {
    dispatch(logoutUser());
  }
  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);
  // console.log(cartItems, 'sachin');
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {/*@ts-ignore*/}
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">Usercart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={//@ts-ignore
            cartItems && cartItems?.items && cartItems?.items.length > 0//@ts-ignore
              ? cartItems.items
              : []
          }
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-gray-600 text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-560">
          <DropdownMenuLabel>
            Logged in As{' '}
            <div className="underline inline-block size-5">
              {user?.userName}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/shop/account')}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
            LogOut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold">E-commerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
