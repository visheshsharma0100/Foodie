import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { 
  FaUser,
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaShieldAlt,
  FaArrowRight,
} from 'react-icons/fa';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  // State for UI controls
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength logic (0 to 4 score)
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthLabel = () => {
    if (!formData.password) return '';
    if (passwordStrength <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (passwordStrength === 2 || passwordStrength === 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

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
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Google signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the Terms & Conditions to proceed.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(formData.fullName.trim(), formData.email.trim(), formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans antialiased text-slate-800 flex flex-col justify-between">
      
      {/* ========================================================= */}
      {/* MAIN CONTENT CONTAINER                                     */}
      {/* ========================================================= */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: HERO ILLUSTRATION & BRANDING                   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            
            {/* Background Decorative Circles */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Tagline */}
            <div className="relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs tracking-wider uppercase">
                FoodieHub Delivery
              </span>
            </div>

            {/* Middle Illustration & Text */}
            <div className="my-8 relative z-10 space-y-6">
              <div className="relative mx-auto max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                  alt="Join FoodieHub"
                  className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-2xl border-2 border-white/20 transform hover:scale-[1.02] transition duration-300"
                />
              </div>

              <div className="text-center lg:text-left space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Join FoodieHub
                </h1>
                <p className="text-orange-100 text-sm leading-relaxed">
                  Create your account and start ordering your favorite meals with a fast, secure, and seamless experience.
                </p>
              </div>
            </div>

            {/* Bottom Footer Text */}
            <div className="relative z-10 text-xs text-orange-200 text-center lg:text-left">
              © {new Date().getFullYear()} FoodieHub Inc. All rights reserved.
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: REGISTER FORM CARD                            */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
            
            <div className="max-w-md w-full mx-auto space-y-5">
              
              {/* Form Heading */}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Create Your <span className="text-orange-500">Account</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Fill in your details to get started.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name Field */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaUser className="text-sm" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Vishesh Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email Address Field */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1">
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1">
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
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-slate-500">Strength:</span>
                        <span className={strengthInfo.text}>{strengthInfo.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 1 ? strengthInfo.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 2 ? strengthInfo.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 3 ? strengthInfo.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 transition-all duration-300 ${passwordStrength >= 4 ? strengthInfo.color : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaLock className="text-sm" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500/30 accent-orange-500 shrink-0"
                    />
                    <span className="text-xs text-slate-600 leading-tight">
                      I agree to the{' '}
                      <a href="#terms" className="font-semibold text-orange-500 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" className="font-semibold text-orange-500 hover:underline">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </form>

              {/* Google Social Signup */}
              <div className="space-y-3 pt-1">
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
                      onError={() => setError('Google sign-up was cancelled or failed.')}
                      useOneTap
                      text="signup_with"
                      shape="pill"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setError('Google sign-up is not configured yet. Please use email registration for now.')}
                      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                    >
                      <FaGoogle className="text-red-500 text-base" />
                      <span>Google signup unavailable</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Login Navigation Prompt */}
              <p className="text-center text-xs text-slate-500 pt-1">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition"
                >
                  Login Now
                </Link>
              </p>

            </div>

            {/* Security Message Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
              <FaShieldAlt className="text-xs text-emerald-500" />
              <span>Your personal information is encrypted and securely protected.</span>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
};

export default RegisterPage;
