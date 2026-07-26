import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* TOP MAIN HEADER */}
        <div className="h-16 sm:h-20 flex items-center justify-between gap-2">
          
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
              F
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Foodie<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION (Unchanged for md+ screens) */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            {[
              ["/", "Home"],
              ["/menu", "Menu"],
              ["/about", "About"],
              ["/cart", "Cart"],
            ].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className={`transition-colors duration-200 ${
                  isActive(path)
                    ? "text-orange-500 font-bold"
                    : "text-slate-600 hover:text-orange-500"
                }`}
              >
                {label}
                {path === "/cart" && cartCount > 0 ? (
                  <span className="ml-1.5 inline-flex min-w-[1.25rem] justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to="/orders"
                className={`transition-colors duration-200 ${
                  isActive("/orders")
                    ? "text-orange-500 font-bold"
                    : "text-slate-600 hover:text-orange-500"
                }`}
              >
                My Orders
              </Link>
            ) : null}
            {isAdmin ? (
              <Link
                to="/admin"
                className={`transition-colors duration-200 ${
                  isActive("/admin")
                    ? "text-orange-500 font-bold"
                    : "text-slate-600 hover:text-orange-500"
                }`}
              >
                Admin
              </Link>
            ) : null}
          </div>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-700 hover:text-orange-500 px-4 py-2 text-sm font-semibold transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-orange-500 px-4 py-2 text-sm font-semibold transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md shadow-orange-500/20 active:scale-95"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* MOBILE ACTION CONTROLS (Cart Badge + Menu Toggle) */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Always-Visible Mobile Cart Icon */}
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              aria-label="View shopping cart"
              className={`relative p-2.5 rounded-xl border transition-all active:scale-95 ${
                isActive("/cart")
                  ? "bg-orange-50 border-orange-200 text-orange-500"
                  : "bg-slate-50 border-slate-200/80 text-slate-700 hover:text-orange-500"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white shadow-sm animate-pulse">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {/* Mobile Hamburger / Close Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-slate-900 transition-colors active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE QUICK-NAV BAR (Always visible below header on small screens) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-semibold">
          {[
            ["/", "Home"],
            ["/menu", "Menu"],
            ["/cart", "Cart"],
            ["/about", "About"],
          ].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={closeMobileMenu}
              className={`px-3 py-1.5 rounded-lg transition-colors relative ${
                isActive(path)
                  ? "bg-orange-500 text-white font-bold shadow-sm shadow-orange-500/20"
                  : "text-slate-600 hover:text-orange-500"
              }`}
            >
              {label}
              {path === "/cart" && cartCount > 0 && !isActive(path) ? (
                <span className="ml-1 inline-flex rounded-full bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.2">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>

      {/* SLIDE-DOWN MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 shadow-xl transition-all duration-300">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Logged in as</span>
                <span className="text-sm font-bold text-slate-800">{user?.name}</span>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col space-y-1 font-semibold text-sm">
            {isAuthenticated ? (
              <Link
                to="/orders"
                onClick={closeMobileMenu}
                className={`p-3 rounded-xl transition-colors flex items-center justify-between ${
                  isActive("/orders")
                    ? "bg-orange-50 text-orange-600 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>My Orders</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : null}

            {isAdmin ? (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className={`p-3 rounded-xl transition-colors flex items-center justify-between ${
                  isActive("/admin")
                    ? "bg-orange-50 text-orange-600 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>Admin Dashboard</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : null}
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center bg-red-50 hover:bg-red-100 text-red-600 font-bold p-3 rounded-xl transition-colors text-sm"
              >
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold p-3 rounded-xl transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold p-3 rounded-xl shadow-md shadow-orange-500/20 transition-colors text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
