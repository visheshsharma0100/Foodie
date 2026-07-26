import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
            F
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Foodie<span className="text-orange-500">Hub</span>
          </span>
        </Link>

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
                isActive(path) ? "text-orange-500 font-bold" : "text-slate-600 hover:text-orange-500"
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
                isActive("/orders") ? "text-orange-500 font-bold" : "text-slate-600 hover:text-orange-500"
              }`}
            >
              My Orders
            </Link>
          ) : null}
          {isAdmin ? (
            <Link
              to="/admin"
              className={`transition-colors duration-200 ${
                isActive("/admin") ? "text-orange-500 font-bold" : "text-slate-600 hover:text-orange-500"
              }`}
            >
              Admin
            </Link>
          ) : null}
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-xs font-semibold text-slate-600 truncate max-w-[120px]">
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
      </div>
    </nav>
  );
}

export default Navbar;
