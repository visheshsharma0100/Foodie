import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaShieldAlt,
  FaArrowRight
} from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      await googleLogin({ credential: credentialResponse.credential });
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(formData.email.trim(), formData.password);
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 flex flex-col justify-between">
      
      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* LEFT SIDE: HERO ILLUSTRATION */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs tracking-wider uppercase">
                FoodieHub Delivery
              </span>
            </div>

            <div className="my-8 relative z-10 space-y-6">
              <div className="relative mx-auto max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Meals"
                  className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-2xl border-2 border-white/20 transform hover:scale-[1.02] transition duration-300"
                />
              </div>

              <div className="text-center lg:text-left space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome Back!
                </h1>
                <p className="text-orange-100 text-sm leading-relaxed">
                  Login to continue ordering your favorite meals and track your orders effortlessly.
                </p>
              </div>
            </div>

            <div className="relative z-10 text-xs text-orange-200 text-center lg:text-left">
              © {new Date().getFullYear()} FoodieHub Inc. All rights reserved.
            </div>
          </div>

          {/* RIGHT SIDE: LOGIN FORM CARD */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
            
            <div className="max-w-md w-full mx-auto space-y-6">
              
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Login to <span className="text-orange-500">FoodieHub</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Welcome back! Please enter your details.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaEnvelope className="text-sm" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaLock className="text-sm" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500/30 accent-orange-500"
                    />
                    <span className="text-xs font-medium text-slate-600">Remember me</span>
                  </label>

                  <a
                    href="#forgot-password"
                    className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline transition"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Logging in...' : 'Login'}</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </form>

              {/* ONLY GOOGLE LOGIN BUTTON */}
              <div className="space-y-4 pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest absolute">
                    OR
                  </span>
                </div>

                <div className="flex justify-center">
                  {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google sign-in was cancelled or failed.')}
                      useOneTap
                      text="continue_with"
                      shape="pill"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setError('Google sign-in is not configured yet. Please use email login for now.')}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                    >
                      <FaGoogle className="text-red-500 text-base" />
                      <span>Google login unavailable</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Register Redirect */}
              <p className="text-center text-xs text-slate-500 pt-2">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition"
                >
                  Register Now
                </Link>
              </p>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <FaShieldAlt className="text-xs text-emerald-500" />
              <span>Your information is secure and encrypted.</span>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
};

export default LoginPage;
