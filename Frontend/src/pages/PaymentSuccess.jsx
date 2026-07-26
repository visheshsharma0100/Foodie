import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiCheck, 
  HiShoppingBag, 
  HiClipboardList, 
  HiDownload, 
  HiSparkles,
  HiCheckCircle,
  HiCreditCard
} from 'react-icons/hi';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // ya "auto"
    });
  }, []);
  // Extract order details passed via router state or fall back to sample data
  const orderData = location.state || {
    orderId: "FH-" + Math.floor(100000 + Math.random() * 900000),
    paymentId: "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    totalAmount: "48.50",
    paymentMethod: "Credit Card (•••• 4242)",
    paymentStatus: "Paid",
    dateTime: new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  };

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Copy Order ID functionality
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderData.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock Receipt Download
  const handleDownloadReceipt = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Receipt for Order #${orderData.orderId} downloaded successfully!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 relative z-10 text-center transform transition-all animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Checkmark Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outer Ripple Ring */}
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
          {/* Subtle Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-50 scale-110 border border-emerald-100/80 shadow-inner" />
          {/* Core Green Circle */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform transition-transform hover:scale-105">
            <HiCheck className="w-12 h-12 text-white stroke-[1.5] animate-bounce-short" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
            <HiSparkles className="w-3.5 h-3.5" /> Confirmed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Thank you for your order. Your payment has been completed successfully.
          </p>
        </div>

        {/* Informational Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 text-slate-700 text-xs sm:text-sm text-left flex items-start gap-3">
          <div className="p-1 bg-orange-500 text-white rounded-lg mt-0.5 shrink-0">
            <HiCheckCircle className="w-4 h-4" />
          </div>
          <p className="leading-snug">
            Your order has been placed successfully. You can view all your orders anytime from the <span className="font-semibold text-orange-600">Orders page</span>.
          </p>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <span className="text-xs font-medium text-slate-500">Order ID</span>
            <button 
              onClick={handleCopyOrderId}
              title="Click to copy"
              className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors flex items-center gap-1 active:scale-95"
            >
              {orderData.orderId}
              <span className="text-[10px] text-orange-600 font-semibold">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Payment ID</span>
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {orderData.paymentId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Date & Time</span>
            <span className="text-xs font-semibold text-slate-700">
              {orderData.dateTime}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Payment Method</span>
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <HiCreditCard className="w-3.5 h-3.5 text-slate-400" />
              {orderData.paymentMethod}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Payment Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              Paid ✅
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Total Amount</span>
            <span className="text-lg font-black text-orange-600">
              ${parseFloat(orderData.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Button */}
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base group"
          >
            <HiShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            Continue Shopping
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold py-3.5 px-4 rounded-xl border border-slate-200 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <HiClipboardList className="w-5 h-5 text-slate-500" />
            View My Orders
          </button>

          {/* Optional Download Receipt */}
          <button
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="w-full text-slate-400 hover:text-slate-600 font-medium py-2 text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <HiDownload className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
            {downloading ? 'Generating Receipt...' : 'Download Receipt'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
