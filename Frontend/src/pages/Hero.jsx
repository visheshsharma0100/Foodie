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
    /* pt-24 se fixed navbar ke niche space secure ho jata hai */
    <section className="pt-24 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* HERO BANNER CONTAINER */}
      <div className="relative w-full overflow-hidden rounded-3xl shadow-xl bg-slate-900 group">
        <img
          className="h-64 sm:h-80 md:h-96 w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          src={HeroImage}
          alt="Hero Banner - Good Food, Good Mood"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200";
          }}
        />
        {/* Fixed gradient overlay direction */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CATEGORIES / WHAT'S ON YOUR MIND SECTION */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What's on your mind?
          </h2>
          <div className="h-1 flex-1 bg-slate-100 ml-6 rounded-full hidden sm:block" />
        </div>

        {/* FOOD CATEGORIES SCROLL / GRID */}
        <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto pb-4 scrollbar-none">
          {CATEGORIES.map((cat, index) => (
            <div
              key={index}
              className="flex flex-col items-center group cursor-pointer shrink-0"
            >
              {/* Circular Badge with Ring Effect */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-white border border-slate-100 shadow-md group-hover:shadow-lg group-hover:border-orange-500/40 transition-all duration-300">
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
              <p className="mt-2.5 text-sm sm:text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">
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
