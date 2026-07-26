import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderApi } from "../services/api";
import {
  FiCheckCircle,
  FiMapPin,
  FiCreditCard,
  FiClock,
  FiShield,
  FiPlus,
  FiCheck,
  FiDollarSign,
  FiLock,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiSmartphone,
  FiTruck,
} from "react-icons/fi";

// --- DUMMY CHECKOUT DATA ---
const INITIAL_ADDRESSES = [
  {
    id: 1,
    type: "Home",
    isDefault: true,
    name: "Vishesh Sharma",
    phone: "+91 98765 43210",
    street: "Flat 402, Green Valley Apartments, Sector 14",
    city: "Meerut",
    state: "Uttar Pradesh",
    zip: "250001",
  },
  {
    id: 2,
    type: "Work",
    isDefault: false,
    name: "Vishesh Sharma",
    phone: "+91 98765 43210",
    street: "MIET Innovation Hub, Delhi Road, NH-58",
    city: "Meerut",
    state: "Uttar Pradesh",
    zip: "250005",
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();

  // State Management
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [deliveryInstruction, setDeliveryInstruction] = useState("");
  const [deliveryTip, setDeliveryTip] = useState(30);
  const [customTip, setCustomTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Redirect to cart if empty (and not currently processing an order)
  useEffect(() => {
    if (!cartItems.length && !isProcessing) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems.length, navigate, isProcessing]);

  const orderItems = cartItems.map((item) => ({
    id: item.foodId,
    name: item.name,
    qty: item.quantity,
    price: item.price,
    isVeg: item.isVeg,
  }));

  // New Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    name: "",
    phone: "",
    street: "",
    city: "Meerut",
    state: "Uttar Pradesh",
    zip: "",
  });

  // Calculate Bill Details
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const platformFee = 10;
  const gst = Math.round(subtotal * 0.05);
  const discount = 20; // Coupon discount applied
  const tipAmount = customTip !== "" ? Number(customTip) || 0 : deliveryTip;
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + gst + tipAmount - discount);

  // Handle Add New Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.phone) return;

    const createdAddress = {
      id: Date.now(),
      isDefault: false,
      ...newAddress,
    };

    setAddresses([...addresses, createdAddress]);
    setSelectedAddressId(createdAddress.id);
    setShowAddressModal(false);
    setNewAddress({
      type: "Home",
      name: "",
      phone: "",
      street: "",
      city: "Meerut",
      state: "Uttar Pradesh",
      zip: "",
    });
  };

  // Place Order Handler
  const handlePlaceOrder = async () => {
    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (!selected) {
      setOrderError("Please select a delivery address.");
      return;
    }
    if (!orderItems.length) {
      setOrderError("Your cart is empty.");
      return;
    }

    const addressText = `${selected.street}, ${selected.city}, ${selected.state} - ${selected.zip}`;
    const apiPayment = paymentMethod === "cod" ? "COD" : "Online";

    setIsProcessing(true);
    setOrderError("");

    try {
      const response = await orderApi.place({
        items: orderItems.map((item) => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        address: addressText,
        phone: selected.phone,
        paymentMethod: apiPayment,
      });

      // Clear the cart
      clearCart();

      // Redirect directly to dedicated Payment Success page
      navigate("/payment-success", {
        state: {
          orderId: response.order?._id || "FH-" + Math.floor(100000 + Math.random() * 900000),
          paymentId: response.order?.paymentId || "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
          totalAmount: grandTotal,
          paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Online (UPI / Card)",
          dateTime: new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        replace: true,
      });
    } catch (err) {
      setOrderError(err.message || "Could not place order.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* PAGE HEADER */}
      <div className="pt-24 pb-6 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              to="/cart"
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors"
            >
              <FiArrowLeft className="mr-2 w-4 h-4" />
              Back to Cart
            </Link>

            {/* STEP PROGRESS INDICATOR */}
            <div className="hidden md:flex items-center space-x-6 text-xs font-bold tracking-wider uppercase">
              <div className="flex items-center text-emerald-600 space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                <span>Cart</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-200" />
              <div className="flex items-center text-orange-500 space-x-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">2</span>
                <span>Checkout</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-200" />
              <div className="flex items-center text-slate-400 space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs">3</span>
                <span>Confirmation</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <FiShield className="text-emerald-600 w-4 h-4" />
              <span className="hidden sm:inline">100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CHECKOUT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ADDRESS, INSTRUCTIONS & PAYMENT */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. DELIVERY ADDRESS SECTION */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">Delivery Address</h2>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Address Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/20 shadow-md shadow-orange-500/10"
                          : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {addr.type}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center">
                            <FiCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{addr.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                        {addr.street}, {addr.city} - {addr.zip}
                      </p>
                      <span className="text-[11px] font-semibold text-slate-600">{addr.phone}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. DELIVERY INSTRUCTIONS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                  <FiTruck className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Delivery Instructions</h2>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Select an option to guide our delivery partner safely.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "ring", label: "Avoid Ringing Bell" },
                  { id: "door", label: "Leave at Door" },
                  { id: "call", label: "Call Before Arrival" },
                  { id: "guard", label: "Leave with Security" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setDeliveryInstruction(
                        deliveryInstruction === item.label ? "" : item.label
                      )
                    }
                    className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      deliveryInstruction === item.label
                        ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. DELIVERY PARTNER TIP */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                  <FiDollarSign className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Tip Your Delivery Partner</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                100% of this tip goes directly to your delivery executive.
              </p>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {[20, 30, 50].map((tip) => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => {
                      setDeliveryTip(tip);
                      setCustomTip("");
                    }}
                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                      deliveryTip === tip && customTip === ""
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ₹{tip}
                  </button>
                ))}

                <input
                  type="number"
                  placeholder="Custom"
                  value={customTip}
                  onChange={(e) => {
                    setCustomTip(e.target.value);
                    setDeliveryTip(0);
                  }}
                  className="w-24 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>
            </div>

            {/* 4. PAYMENT METHOD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
                  <FiCreditCard className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Payment Options</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "upi",
                    title: "Instant UPI (GPay / PhonePe / Paytm)",
                    desc: "Pay instantly using any installed UPI app.",
                    icon: <FiSmartphone className="w-5 h-5 text-purple-600" />,
                  },
                  {
                    id: "card",
                    title: "Credit or Debit Card",
                    desc: "Supports Visa, Mastercard, RuPay & Amex.",
                    icon: <FiCreditCard className="w-5 h-5 text-blue-600" />,
                  },
                  {
                    id: "cod",
                    title: "Cash on Delivery (COD)",
                    desc: "Pay with cash or scan QR code on delivery.",
                    icon: <FiDollarSign className="w-5 h-5 text-emerald-600" />,
                  },
                ].map((method) => {
                  const isChecked = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isChecked
                          ? "border-orange-500 bg-orange-50/20"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 mt-0.5">
                          {method.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{method.title}</h4>
                          <p className="text-xs text-slate-500">{method.desc}</p>
                        </div>
                      </div>

                      <input
                        type="radio"
                        name="payment_option"
                        value={method.id}
                        checked={isChecked}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-orange-500 w-4 h-4 mt-1"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & CHECKOUT BUTTON */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            {/* ORDER ITEMS ACCORDION CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="flex items-center justify-between cursor-pointer pb-4 border-b border-slate-100"
              >
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Order Summary</h3>
                  <p className="text-xs text-slate-400">{orderItems.length} Items in your cart</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  {showOrderSummary ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {showOrderSummary && (
                <div className="py-4 space-y-3 max-h-60 overflow-y-auto scrollbar-none border-b border-slate-100">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2.5 h-2.5 border flex items-center justify-center ${
                            item.isVeg ? "border-green-600" : "border-red-600"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              item.isVeg ? "bg-green-600" : "bg-red-600"
                            }`}
                          />
                        </span>
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 font-bold">x{item.qty}</span>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ESTIMATED TIME */}
              <div className="my-4 p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center space-x-3 text-amber-800 text-xs font-semibold">
                <FiClock className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Estimated Delivery Time: <strong className="text-slate-900">25 - 35 mins</strong></span>
              </div>

              {/* BILL DETAILS BREAKDOWN */}
              <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-bold text-slate-900">₹{platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Taxes (5%)</span>
                  <span className="font-bold text-slate-900">₹{gst}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-orange-600 font-semibold">
                    <span>Delivery Partner Tip</span>
                    <span>+₹{tipAmount}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-base font-extrabold text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-orange-500">₹{grandTotal}</span>
                </div>
              </div>

              {orderError ? (
                <p className="text-xs text-red-500 font-medium mb-3">{orderError}</p>
              ) : null}

              {/* SUBMIT BUTTON */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 text-base flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    <span>Pay ₹{grandTotal} & Place Order</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-3">
                By placing this order, you agree to FoodieHub's Terms & Conditions.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Delivery Address</h3>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Address Type</label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddress({ ...newAddress, type: t })}
                      className={`px-3 py-1.5 rounded-lg border font-bold ${
                        newAddress.type === t
                          ? "bg-orange-500 text-white border-orange-500"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Vishesh Sharma"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Street Address / House No.</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat No, Apartment Name, Area..."
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-slate-600 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-slate-600 font-semibold mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="250001"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}