import HeroImage from "../assets/Hero.png";
import Pizza from "../assets/Pizza.png";
import Burger from "../assets/Burger.png";
import Thali from "../assets/Thali.png";
import Pasta from "../assets/Pasta.png";
import Desert from "../assets/Desert.png";

const CATEGORIES = [
  { name: "Pizza", image: Pizza },
  { name: "Burger", image: Burger },
  { name: "North Indian", image: Thali },
  { name: "Pasta", image: Pasta },
  { name: "Desserts", image: Desert },
];

function Hero() {
  return (
    <section className="pt-16 sm:pt-20 md:pt-24 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all">
      
      {/* HERO BANNER CONTAINER */}
      <div className="relative w-full min-h-[260px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[460px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-slate-900 group flex items-center">
        
        {/* Background Image with Responsive Object Position */}
        <img
          className="absolute inset-0 w-full h-full object-cover object-right sm:object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out opacity-60 sm:opacity-75"
          src={HeroImage}
          alt="FoodieHub Special Cuisine Banner"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200";
          }}
        />

        {/* Multi-stage Gradient Overlays for High Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent z-0 pointer-events-none" />

        {/* Hero HTML/CSS Content Overlay */}
        <div className="relative z-10 p-5 sm:p-8 md:p-12 lg:p-16 max-w-xl sm:max-w-2xl">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 backdrop-blur-md mb-3 sm:mb-4">
            <span>⚡</span> Fast Delivery & Fresh Food
          </span>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug drop-shadow-sm">
            Good Food, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Good Mood.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-2 sm:mt-4 text-xs sm:text-base md:text-lg text-slate-200 font-normal line-clamp-2 sm:line-clamp-none max-w-md">
            Order your favorite meals from top-rated restaurants near you and get them delivered hot & fresh.
          </p>

          {/* CTA Button */}
          <div className="mt-4 sm:mt-6 flex items-center gap-3">
            <a
              href="#menu"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Order Now
              <svg
                className="w-4 h-4 ml-1.5 -mr-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* CATEGORIES / WHAT'S ON YOUR MIND SECTION */}
      <div className="mt-8 sm:mt-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            What's on your mind?
          </h2>
          <div className="h-1 flex-1 bg-slate-100 ml-6 rounded-full hidden sm:block" />
        </div>

        {/* FOOD CATEGORIES SCROLL / GRID */}
        <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 md:gap-10 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {CATEGORIES.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center group cursor-pointer shrink-0 snap-center"
            >
              {/* Circular Badge with Ring Effect */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-1 bg-white border border-slate-100 shadow-sm sm:shadow-md group-hover:shadow-lg group-hover:border-orange-500/50 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 ease-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Food";
                  }}
                />
              </div>

              {/* Category Title */}
              <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Hero;
