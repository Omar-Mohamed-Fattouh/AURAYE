import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Menu, ChevronDown, ShoppingCart, User, X, Heart } from "lucide-react";
import { logoutUser } from "../api/authApi.js";
import { getCart } from "../api/productsApi.js";
export default function Navbar({ user, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getCart();
        setItems(cartData.items || []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
    fetchCart();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setMobileOpen(false);
    }
  };

  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    }

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  return (
    <nav className="w-full bg-black text-white shadow-xl backdrop-blur-md sticky top-0 z-50 border-b border-white/10 font-semibold">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT SIDE: Logo + main links */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl shrink-0"
          >
            <span className="text-white tracking-widest">AURAYE</span>
          </Link>

          <div className="w-px h-7 bg-neutral-600"></div>

          <div className="hidden lg:flex items-center gap-6 truncate">
            <NavItem to="/">Home</NavItem>

            <Dropdown label="About">
              <DropItem to="/about">About Us</DropItem>
              <DropItem to="/mission">Our Mission</DropItem>
              <DropItem to="/why-us">Why Choose Us</DropItem>
              <DropItem to="/team">Team</DropItem>
            </Dropdown>

            <Dropdown label="Products">
              <DropItem to="/products">All Products</DropItem>
              <DropItem to="/products/men">Men</DropItem>
              <DropItem to="/products/women">Women</DropItem>
              <DropItem to="/products/sunglasses">Sunglasses</DropItem>
              <DropItem to="/products/eyeglasses">Eyeglasses</DropItem>
              <DropItem to="/products/frames">Frames</DropItem>
              <DropItem to="/products/shapes">Shapes</DropItem>
              <DropItem to="/products/colors">Colors</DropItem>
            </Dropdown>

            <Dropdown label="AR Try-On">
              <DropItem to="/try">Try Now</DropItem>
              <DropItem to="/how-it-works">How It Works</DropItem>
              <DropItem to="/devices">Supported Devices</DropItem>
              <DropItem to="/saved">My Saved Try-ons</DropItem>
            </Dropdown>

            <Dropdown label="Help">
              <DropItem to="/contact">Contact Us</DropItem>
              <DropItem to="/faq">FAQs</DropItem>
              <DropItem to="/shipping">Shipping Info</DropItem>
              <DropItem to="/refunds">Returns & Refunds</DropItem>
              <DropItem to="/track">Track Order</DropItem>
            </Dropdown>
          </div>
        </div>

        {/* RIGHT SIDE: Wishlist + Cart + Profile */}
        <div className="flex items-center gap-4 min-w-0">
          {/* DESKTOP: Wishlist + Cart + Profile */}
          <div className="hidden md:flex items-center gap-2">
            {user && (
              <>
                <WishlistMenu />

                <NavItem
                  to="/cart"
                  className="flex items-center gap-2 relative"
                >
                  <div className="relative">
                    <ShoppingCart size={22} />

                    {items.length > 0 && (
                      <span
                        className="
              absolute -top-1 -right-2
              bg-white text-black 
              text-[10px] md:text-xs 
              w-4 h-4 md:w-4 md:h-4
              flex items-center justify-center 
              rounded-full
            "
                      >
                        {items.length}
                      </span>
                    )}
                  </div>

                  {/* <span className="text-lg">Cart</span> */}
                </NavItem>
              </>
            )}

            {user && (
              <div className="hidden md:flex">
                <ProfileMenu user={user} logout={logout} />
              </div>
            )}
          </div>

          {/* LOGIN / REGISTER (desktop) */}
          {!user && (
            <div className="hidden md:flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm uppercase rounded-md hover:bg-white/10 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm uppercase rounded-md bg-white text-black hover:bg-white/90 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* MOBILE ICONS */}
          <div className="flex lg:hidden items-center">
            {/* Wishlist mobile */}
            {user && (
              <>
                <div className="md:hidden">
                  <NavItem to="/wishlist">
                    <Heart size={20} />
                  </NavItem>
                </div>

                {/* Cart mobile */}
                <div className="md:hidden">
                  <NavItem to="/cart" className="relative">
                    <div className="relative">
                      <ShoppingCart size={20} />

                      {items.length > 0 && (
                        <span
                          className="
            absolute -top-1 -right-2
            bg-white text-black
            text-[10px]
            w-4 h-4
            flex items-center justify-center
            rounded-full
          "
                        >
                          {items.length}
                        </span>
                      )}
                    </div>
                  </NavItem>
                </div>
              </>
            )}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-black text-white w-full px-4 pb-4 space-y-2"
        >
          <NavItemMobile to="/" onClick={() => setMobileOpen(false)}>
            Home
          </NavItemMobile>

          <DropdownMobile label="About" closeMenu={() => setMobileOpen(false)}>
            <DropItemMobile to="/about" closeMenu={() => setMobileOpen(false)}>
              About Us
            </DropItemMobile>
            <DropItemMobile
              to="/mission"
              closeMenu={() => setMobileOpen(false)}
            >
              Our Mission
            </DropItemMobile>
            <DropItemMobile to="/why-us" closeMenu={() => setMobileOpen(false)}>
              Why Choose Us
            </DropItemMobile>
            <DropItemMobile to="/team" closeMenu={() => setMobileOpen(false)}>
              Team
            </DropItemMobile>
          </DropdownMobile>

          <DropdownMobile
            label="Products"
            closeMenu={() => setMobileOpen(false)}
          >
            <DropItemMobile
              to="/products"
              closeMenu={() => setMobileOpen(false)}
            >
              All Products
            </DropItemMobile>
            <DropItemMobile
              to="/products/men"
              closeMenu={() => setMobileOpen(false)}
            >
              Men
            </DropItemMobile>
            <DropItemMobile
              to="/products/women"
              closeMenu={() => setMobileOpen(false)}
            >
              Women
            </DropItemMobile>
            <DropItemMobile
              to="/products/sunglasses"
              closeMenu={() => setMobileOpen(false)}
            >
              Sunglasses
            </DropItemMobile>
            <DropItemMobile
              to="/products/eyeglasses"
              closeMenu={() => setMobileOpen(false)}
            >
              Eyeglasses
            </DropItemMobile>
            <DropItemMobile
              to="/products/shapes"
              closeMenu={() => setMobileOpen(false)}
            >
              Shapes
            </DropItemMobile>
            <DropItemMobile
              to="/products/frames"
              closeMenu={() => setMobileOpen(false)}
            >
              Frames
            </DropItemMobile>
            <DropItemMobile
              to="/products/colors"
              closeMenu={() => setMobileOpen(false)}
            >
              Colors
            </DropItemMobile>
          </DropdownMobile>

          <DropdownMobile
            label="AR Try-On"
            closeMenu={() => setMobileOpen(false)}
          >
            <DropItemMobile to="/try" closeMenu={() => setMobileOpen(false)}>
              Try Now
            </DropItemMobile>
            <DropItemMobile
              to="/how-it-works"
              closeMenu={() => setMobileOpen(false)}
            >
              How It Works
            </DropItemMobile>
            <DropItemMobile
              to="/devices"
              closeMenu={() => setMobileOpen(false)}
            >
              Supported Devices
            </DropItemMobile>
            <DropItemMobile to="/saved" closeMenu={() => setMobileOpen(false)}>
              My Saved Try-ons
            </DropItemMobile>
          </DropdownMobile>

          <DropdownMobile label="Help" closeMenu={() => setMobileOpen(false)}>
            <DropItemMobile
              to="/contact"
              closeMenu={() => setMobileOpen(false)}
            >
              Contact Us
            </DropItemMobile>
            <DropItemMobile to="/faq" closeMenu={() => setMobileOpen(false)}>
              FAQs
            </DropItemMobile>
            <DropItemMobile
              to="/shipping"
              closeMenu={() => setMobileOpen(false)}
            >
              Shipping Info
            </DropItemMobile>
            <DropItemMobile
              to="/refunds"
              closeMenu={() => setMobileOpen(false)}
            >
              Returns & Refunds
            </DropItemMobile>
            <DropItemMobile to="/track" closeMenu={() => setMobileOpen(false)}>
              Track Order
            </DropItemMobile>
          </DropdownMobile>

          {user && (
            <div className="md:hidden">
              <DropdownMobile
                label={
                  <>
                    {user.fullName}'s Profile
                    <UserIcon />
                  </>
                }
                closeMenu={() => setMobileOpen(false)}
              >
                <DropItemMobile
                  to="/profile"
                  closeMenu={() => setMobileOpen(false)}
                >
                  My Profile
                </DropItemMobile>
                <DropItemMobile
                  to="/shipping"
                  closeMenu={() => setMobileOpen(false)}
                >
                  My Orders
                </DropItemMobile>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-white/10 transition text-sm"
                >
                  Logout
                </button>
              </DropdownMobile>
            </div>
          )}

          {!user && (
            <div className="md:hidden">
              <div className="border-t border-white/50"></div>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 hover:bg:white/10 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 bg-white text-black rounded-md hover:bg-white/90"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

/* NAV ITEM DESKTOP */
function NavItem({ to, children }) {
  return (
    <Link
      to={to}
      className="transition text-sm uppercase tracking-wide px-3 py-2 gap-3 rounded-md hover:bg-white/10 flex items-center whitespace-nowrap"
    >
      {children}
    </Link>
  );
}

/* PROFILE MENU DESKTOP */
function ProfileMenu({ user, logout }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex items-center gap-2 hover:text-gray-300 truncate max-w-[180px] text-lg"
        aria-label="Open profile menu"
      >
        <User size={20} />{" "}
        <span className="truncate">{user.fullName}'s Profile</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-[#111] text-white rounded-md p-4 shadow-xl min-w-[180px] border border-white/10 flex flex-col gap-2"
        sideOffset={8}
      >
        <DropItem to="/profile">My Profile</DropItem>
        <DropItem to="/shipping">Orders</DropItem>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition text-sm"
        >
          Logout
        </button>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/* WISHLIST MENU DESKTOP (نفس ستايل ProfileMenu) */
function WishlistMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex items-center gap-2 hover:text-gray-300 truncate text-lg"
        aria-label="Open wishlist menu"
        asChild
      >
        <Link
          to="/wishlist"
          className="flex items-center gap-2 hover:text-gray-300 truncate text-lg"
        >
          <Heart size={22} />
          {/* <span className="truncate">Wishlist</span> */}
        </Link>
      </DropdownMenu.Trigger>
    </DropdownMenu.Root>
  );
}

/* DROPDOWN DESKTOP (generic) */
function Dropdown({ label, children }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="flex items-center px-4 py-2 gap-1 rounded-md hover:bg-white/10 transition">
        {label} <ChevronDown size={16} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="bg-[#111] text-white rounded-md p-4 shadow-xl min-w-[220px] border border-white/10 grid grid-cols-3 gap-2"
        sideOffset={8}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

const UserIcon = () => <User size={22} className="" />;

/* DROPDOWN ITEM DESKTOP */
function DropItem({ to, children }) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        to={to}
        className="px-3 py-2 rounded-md hover:bg-white/10 transition text-sm whitespace-nowrap"
      >
        {children}
      </Link>
    </DropdownMenu.Item>
  );
}

/* MOBILE NAV ITEM */
function NavItemMobile({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 rounded-md hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );
}

/* MOBILE DROPDOWN */
function DropdownMobile({ label, children, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef} className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-4 py-2 text-left rounded-md hover:bg:white/10 transition"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon size={22} />}
          {label}
        </span>
        <ChevronDown
          size={16}
          className={`${open ? "rotate-180" : ""} transition`}
        />
      </button>
      {open && <div className="flex flex-col pl-4">{children}</div>}
    </div>
  );
}

/* MOBILE DROPDOWN ITEM */
function DropItemMobile({ to, children, closeMenu }) {
  return (
    <Link
      to={to}
      onClick={closeMenu}
      className="block px-4 py-2 rounded-md hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );
}
