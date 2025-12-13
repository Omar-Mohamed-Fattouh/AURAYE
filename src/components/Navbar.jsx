// src/components/Navbar.jsx
import { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Menu,
  ChevronDown,
  ShoppingCart,
  User,
  X,
  Heart,
  LogOut,
} from "lucide-react";
import { logoutUser } from "../api/authApi.js";
import userApi from "../api/userApi.js";
import { AuthContext } from "../features/auth/AuthContext";
import { CartContext } from "../store/cartContext";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Navbar({ user, setUser }) {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { cartCount, wishlistCount, refreshCounts } = useContext(CartContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const lastScrollY = useRef(0);

  /* -------- Scroll behavior (background + hide/show) -------- */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      // هل نعدّي مرحلة الـ hero في الـ Home
      setScrolled(current > 40);

      // hide on scroll down, show on scroll up
      if (current > lastScrollY.current && current > 80) {
        setHideOnScroll(true); // نازل لتحت → خبيه
      } else {
        setHideOnScroll(false); // طالع لفوق → رجّعه
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -------- Fetch user profile -------- */
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        if (!isLoggedIn) {
          if (setUser) setUser(null);
          return;
        }

        const res = await userApi.getProfile(); // GET /Users/profile
        const profile = res.data?.data || res.data || res;
        if (setUser) setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUserProfile();
  }, [isLoggedIn, setUser]);

  /* -------- Sync cart & wishlist counts on route change -------- */
  useEffect(() => {
    if (typeof refreshCounts === "function") {
      refreshCounts();
    }
  }, [location.pathname, refreshCounts]);

  /* -------- Logout logic + Confirm dialog -------- */
  const handleLogoutClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setLogoutLoading(true);
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      if (setUser) setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setIsLoggedIn(false);
      setMobileOpen(false);
      setLogoutLoading(false);
      setConfirmOpen(false);
    }
  };

  /* -------- Close mobile menu when clicking outside -------- */
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

  const isUserLoggedIn = isLoggedIn;
  /* -------- Navbar classes (fixed + bg variants) -------- */
  const navBaseClasses =
    (isHome ? "fixed top-0 left-0 right-0" : "sticky top-0") +
    " w-full text-white font-semibold z-50 transition-transform duration-300";

  const bgClasses = isHome
    ? scrolled
      ? "bg-black/95 shadow-xl backdrop-blur-md border-b border-white/10"
      : "bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-sm"
    : "bg-black shadow-xl backdrop-blur-md border-b border-white/10";

  const translateClass = hideOnScroll ? "-translate-y-full" : "translate-y-0";

  return (
    <>
      <nav
        className={`${navBaseClasses} ${translateClass} ${
          mobileOpen ? "bg-black" : bgClasses
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between relative">
          {/* LEFT SIDE: Logo + main links */}
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-2xl shrink-0"
            >
              <span className="text-white tracking-widest">AURAYE</span>
            </Link>

            <div className="w-px h-7 bg-neutral-600" />

            <div className="hidden lg:flex items-center gap-6 truncate">
              <NavItem to="/">Home</NavItem>

              <Dropdown label="About">
                <DropItem to="/about" icon={<User size={14} />}>
                  About Us
                </DropItem>
                <DropItem to="/mission">Our Mission</DropItem>
                <DropItem to="/why-us">Why Choose Us</DropItem>
                <DropItem to="/team">Team</DropItem>
              </Dropdown>

              <Dropdown label="Products">
                <DropItem to="/products">All Products</DropItem>
                <DropItem to="/products/sunglasses">Sunglasses</DropItem>
                <DropItem to="/products/eyeglasses">Eyeglasses</DropItem>
                <DropItem to="/products/men">Men</DropItem>
                <DropItem to="/products/women">Women</DropItem>
                <DropItem to="/products/shapes">Shapes</DropItem>
                <DropItem to="/products/frames">Frames Material</DropItem>
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
                <DropItem to="/track">Track Order</DropItem>
              </Dropdown>
            </div>
          </div>

          {/* RIGHT SIDE: Wishlist + Cart + Profile */}
          <div className="flex items-center gap-4 min-w-0">
            {/* DESKTOP: Wishlist + Cart + Profile */}
            <div className="hidden md:flex items-center gap-4">
              {isUserLoggedIn && (
                <>
                  <WishlistMenu count={wishlistCount} />
                  <CartMenu count={cartCount} />
                </>
              )}

              {isUserLoggedIn && (
                <div className="hidden md:flex">
                  <ProfileMenu
                    user={user}
                    onLogoutClick={handleLogoutClick}
                    logoutLoading={logoutLoading}
                  />
                </div>
              )}
            </div>

            {/* LOGIN / REGISTER (desktop) */}
            {!isUserLoggedIn && (
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
              {isUserLoggedIn && (
                <>
                  {/* Wishlist mobile */}
                  <div className="md:hidden">
                    <NavItem to="/wishlist" className="relative">
                      <div className="relative">
                        <Heart size={20} />
                        {wishlistCount > 0 && (
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
                            {wishlistCount}
                          </span>
                        )}
                      </div>
                    </NavItem>
                  </div>

                  {/* Cart mobile */}
                  <div className="md:hidden">
                    <NavItem to="/cart" className="relative">
                      <div className="relative">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
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
                            {cartCount}
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

        {/* MOBILE MENU (overlay) */}
        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            className="
              lg:hidden
              absolute top-full left-0 right-0
              bg-black text-white
              px-4 pb-4 pt-2
              space-y-2
              border-t border-white/10
              z-40
              max-h-[80vh]
              overflow-y-auto
            "
          >
            <NavItemMobile to="/" onClick={() => setMobileOpen(false)}>
              Home
            </NavItemMobile>

            <DropdownMobile
              label="About"
              closeMenu={() => setMobileOpen(false)}
            >
              <DropItemMobile
                to="/about"
                closeMenu={() => setMobileOpen(false)}
              >
                About Us
              </DropItemMobile>
              <DropItemMobile
                to="/mission"
                closeMenu={() => setMobileOpen(false)}
              >
                Our Mission
              </DropItemMobile>
              <DropItemMobile
                to="/why-us"
                closeMenu={() => setMobileOpen(false)}
              >
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
                to="/products/shapes"
                closeMenu={() => setMobileOpen(false)}
              >
                Shapes
              </DropItemMobile>
              <DropItemMobile
                to="/products/frames"
                closeMenu={() => setMobileOpen(false)}
              >
                Frames Material
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
              <DropItemMobile
                to="/saved"
                closeMenu={() => setMobileOpen(false)}
              >
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
                to="/track"
                closeMenu={() => setMobileOpen(false)}
              >
                Track Order
              </DropItemMobile>
            </DropdownMobile>

            {isUserLoggedIn && (
              <div className="md:hidden">
                <DropdownMobile
                  label={
                    <>
                      {user?.fullName || "My Account"}'s Profile
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
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 rounded-md hover:bg-white/10 transition text-sm flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </DropdownMobile>
              </div>
            )}

            {!isUserLoggedIn && (
              <div className="md:hidden">
                <div className="border-t border-white/50" />
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-white/10 rounded-md"
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

      {/* CONFIRM LOGOUT DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        loading={logoutLoading}
        title="Log out?"
        message="You will be logged out from your account on this device."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

/* NAV ITEM DESKTOP */
function NavItem({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={
        "transition text-sm uppercase tracking-wide px-3 py-2 gap-3 rounded-md hover:bg-white/10 flex items-center whitespace-nowrap " +
        className
      }
    >
      {children}
    </Link>
  );
}

/* PROFILE MENU DESKTOP */
function ProfileMenu({ user, onLogoutClick, logoutLoading }) {
  const nameNotSlice = user?.fullName || "My Account";
  const name =
    nameNotSlice.length > 7 ? nameNotSlice.slice(0, 7) : nameNotSlice;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex items-center gap-2 hover:text-gray-300 truncate max-w-[180px] text-lg"
        aria-label="Open profile menu"
      >
        <User size={22} />{" "}
        <span className="truncate">{name}&apos;s Profile</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-[#111] text-white rounded-md p-4 shadow-xl min-w-[200px] border border-white/10 flex flex-col gap-2"
        sideOffset={8}
      >
        <DropItem to="/profile" icon={<User size={16} />}>
          My Profile
        </DropItem>
        <DropItem to="/shipping" icon={<ShoppingCart size={16} />}>
          Orders
        </DropItem>
        <button
          onClick={onLogoutClick}
          disabled={logoutLoading}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition text-sm flex items-center gap-2 disabled:opacity-60"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

/* CART ICON + COUNTER DESKTOP */
function CartMenu({ count }) {
  return (
    <Link
      to="/cart"
      className="flex items-center gap-2 hover:text-gray-300 text-lg relative"
    >
      <div className="relative">
        <ShoppingCart size={22} />
        {count > 0 && (
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
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}

/* WISHLIST MENU DESKTOP */
function WishlistMenu({ count }) {
  return (
    <Link
      to="/wishlist"
      className="flex items-center gap-2 hover:text-gray-300 text-lg relative"
    >
      <div className="relative">
        <Heart size={22} />
        {count > 0 && (
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
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}

/* DROPDOWN DESKTOP (generic) */
function Dropdown({ label, children }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="flex items-center px-4 py-2 gap-1 rounded-md hover:bg-white/10 transition text-sm">
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

const UserIcon = () => <User size={22} />;

/* DROPDOWN ITEM DESKTOP */
function DropItem({ to, children, icon }) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        to={to}
        className="px-3 py-2 rounded-md hover:bg-white/10 transition text-sm whitespace-nowrap flex items-center gap-2"
      >
        {icon && <span className="inline-flex items-center">{icon}</span>}
        <span>{children}</span>
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
function DropdownMobile({ label, children, icon: Icon, closeMenu }) {
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
  }, []);

  return (
    <div ref={dropdownRef} className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-4 py-2 text-left rounded-md hover:bg-white/10 transition"
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
