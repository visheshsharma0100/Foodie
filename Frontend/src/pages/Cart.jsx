import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import { 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiMapPin, 
  FiTag, 
  FiArrowRight, 
  FiShoppingBag,
  FiCheckCircle
}  from "react-icons/fi";

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const navigate = useNavigate();

  // --- QUANTITY HANDLERS ---
  const handleIncrement = (foodId) => {
    const item = cartItems.find((line) => line.foodId === foodId);
    if (item) updateQuantity(foodId, item.quantity + 1);
  };

  const handleDecrement = (foodId) => {
    const item = cartItems.find((line) => line.foodId === foodId);
    if (item) updateQuantity(foodId, Math.max(1, item.quantity - 1));
  };

  const handleRemoveItem = (foodId) => {
    removeItem(foodId);
  };

  // --- COUPON HANDLER ---
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    
    if (couponCode.trim().toUpperCase() === 'SAVE20') {
      setAppliedCoupon({ code: 'SAVE20', discount: 20 });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon. Try "SAVE20" for ₹20 off!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // --- PRICE CALCULATIONS ---
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const deliveryFee = subtotal > 0 ? (subtotal > 500 ? 0 : 40) : 0;
  const platformFee = subtotal > 0 ? 10 : 0;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + gst - discount);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* 2. MAIN CONTAINER */}
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {cartItems.length === 0 ? (
          /* EMPTY CART STATE */
          <div className="max-w-lg mx-auto py-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
              <FiShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mb-8">
              Looks like you haven't added anything to your cart yet. Explore our delicious menu!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              <span>Browse Menu</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* TWO-COLUMN CART LAYOUT */
          <div>
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Your Shopping <span className="text-orange-500">Cart</span>
              </h1>
              <p className="text-slate-500 text-sm sm:text-base mt-1">
                You have {cartItems.length} dish{cartItems.length > 1 ? 'es' : ''} in your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: CART ITEMS */}
              <div className="lg:col-span-7 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.foodId}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between"
                  >
                    {/* Food Image & Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Veg / Non-Veg Icon & Rating */}
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="bg-white p-0.5 rounded shadow-sm border border-slate-200">
                            <div
                              className={`w-3 h-3 border-2 flex items-center justify-center ${
                                item.isVeg ? 'border-green-600' : 'border-red-600'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.isVeg ? 'bg-green-600' : 'bg-red-600'
                                }`}
                              />
                            </div>
                          </div>
                          
                          <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-1.5 py-0.5 rounded border border-amber-100">
                            ★ 4.5
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                          {item.description || ''}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity, Item Total & Delete */}
                    <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60">
                        <button
                          onClick={() => handleDecrement(item.foodId)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200 transition-colors shadow-sm active:scale-90"
                        >
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.foodId)}
                          className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200 transition-colors shadow-sm active:scale-90"
                        >
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Price for item */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.foodId)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove Item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT COLUMN: ORDER SUMMARY (STICKY) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
                
                {/* 1. DELIVERY ADDRESS CARD */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                      <FiMapPin className="text-orange-500 w-5 h-5" />
                      <span>Delivery Address</span>
                    </div>
                    <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
                      Change Address
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-7">
                    Home: Flat 402, Green Valley Apartments, Sector 14, Meerut, UP - 250001
                  </p>
                </div>

                {/* 2. SUMMARY CARD */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-5 pb-3 border-b border-slate-100">
                    Order Summary
                  </h2>

                  {/* Coupon Input */}
                  <div className="mb-6">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon code (e.g. SAVE20)"
                          className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95"
                      >
                        Apply
                      </button>
                    </form>

                    {couponError && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">{couponError}</p>
                    )}

                    {appliedCoupon && (
                      <div className="mt-2.5 flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-800 text-xs font-semibold">
                        <div className="flex items-center space-x-1.5">
                          <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Code '{appliedCoupon.code}' applied (₹20 Off)</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-emerald-900 hover:underline text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bill Breakup */}
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-bold text-slate-900">₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-bold text-slate-900">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Platform Fee</span>
                      <span className="font-bold text-slate-900">₹{platformFee}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>GST (5%)</span>
                      <span className="font-bold text-slate-900">₹{gst}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Coupon Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                      <span className="text-base font-extrabold text-slate-900">Grand Total</span>
                      <span className="text-xl font-black text-orange-500">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="mb-6 pt-4 border-t border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                      Select Payment Method
                    </p>
                    <div className="space-y-2">
                      {[
                        { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)' },
                        { id: 'card', label: 'Credit / Debit Card' },
                        { id: 'cod', label: 'Cash on Delivery' },
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-orange-500 bg-orange-50/40 text-orange-600'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{method.label}</span>
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="accent-orange-500 w-4 h-4"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button onClick={() => navigate("/checkout")} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-base flex items-center justify-center space-x-2">
                    <span>Proceed to Checkout</span>
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
