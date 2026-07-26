import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import { foodApi } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Pasta', 'Biryani', 'Dessert'];

export default function MenuPage() {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedToast, setAddedToast] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setFetchError('');
      try {
        const data = await foodApi.list();
        if (active) setFoodItems(data.item || []);
      } catch (err) {
        if (active) setFetchError(err.message || 'Could not load menu.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const itemId = (item) => item._id || item.id;

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getQuantity = (id) => quantities[id] || 1;

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      setAddedToast('Please login or sign up first to add food to your cart');
      window.setTimeout(() => setAddedToast(''), 2500);
      return;
    }

    const id = itemId(item);
    addItem(item, getQuantity(id));
    setAddedToast(`${item.name} added to cart`);
    window.setTimeout(() => setAddedToast(''), 2000);
  };

  const handleIncrement = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: getQuantity(id) + 1 }));
  };

  const handleDecrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, getQuantity(id) - 1),
    }));
  };

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, foodItems]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Reusable Main Navbar Component */}
      <Navbar />

      {addedToast ? (
        <div className="fixed top-20 right-3 left-3 sm:left-auto sm:right-4 z-50 rounded-xl bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 shadow-lg max-w-sm">
          {addedToast}
        </div>
      ) : null}

      {/* MAIN CONTAINER */}
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP SECTION */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            Explore Our <span className="text-orange-500">Menu</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg mb-8 font-normal">
            Discover freshly prepared dishes made with premium ingredients.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for delicious dishes..."
              className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shadow-sm ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-orange-500/30 scale-105'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* MENU GRID */}
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading menu...</div>
        ) : fetchError ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-red-100 text-red-600 max-w-lg mx-auto">
            {fetchError}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No items found</h3>
            <p className="text-slate-500 text-sm">
              We couldn't find anything matching "{searchQuery}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const id = itemId(item);
              const isFav = wishlist.includes(id);
              const qty = getQuantity(id);

              return (
                <div
                  key={id}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm flex items-center justify-center">
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

                      {item.isBestseller ? (
                        <span className="bg-orange-500/95 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm backdrop-blur-sm">
                          Bestseller
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => toggleWishlist(id)}
                      aria-label="Add to wishlist"
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm active:scale-90"
                    >
                      <svg
                        className={`w-5 h-5 transition-colors ${
                          isFav ? 'fill-red-500 text-red-500' : 'fill-none'
                        }`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h2 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-orange-500 transition-colors">
                          {item.name}
                        </h2>
                        <div className="flex items-center space-x-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-100 flex-shrink-0">
                          <svg className="w-3.5 h-3.5 fill-green-600" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs font-bold text-green-700">
                            {item.rating || '4.5'}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Price</span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{item.price}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200/60">
                          <button
                            onClick={() => handleDecrement(id)}
                            className="w-6 h-6 rounded-md bg-white text-slate-600 flex items-center justify-center font-bold text-xs hover:bg-slate-200 transition-colors shadow-sm active:scale-95"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleIncrement(id)}
                            className="w-6 h-6 rounded-md bg-white text-slate-600 flex items-center justify-center font-bold text-xs hover:bg-slate-200 transition-colors shadow-sm active:scale-95"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          aria-label={`Add ${item.name} to cart`}
                          className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-md shadow-orange-500/20 active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
