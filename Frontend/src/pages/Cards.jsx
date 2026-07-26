
import mpizza from "../assets/MargPizza.png";
import CBurger from "../assets/CBurger.png";
import Butter from "../assets/Butter.png";
import RedPasta from "../assets/RedPasta.png";
import Lava from "../assets/Lava.png";
import Biryani from "../assets/VegBriyani.png";
import { Link } from "react-router-dom";

const dishes = [
  {
    name: "Margherita Pizza",
    image: mpizza,
    rating: "4.6",
    type: "Veg",
    description: "Fresh basil, mozzarella & tomato sauce.",
    price: 299,
    bestSeller: true,
  },
  {
    name: "Cheese Burger",
    image: CBurger,
    rating: "4.4",
    type: "Non-Veg",
    description: "Juicy grilled patty with cheddar cheese.",
    price: 249,
  },
  {
    name: "Butter Chicken",
    image: Butter,
    rating: "4.7",
    type: "Non-Veg",
    description: "Tender chicken in rich buttery tomato gravy.",
    price: 349,
    bestSeller: true,
  },
  {
    name: "Red Sauce Pasta",
    image: RedPasta,
    rating: "4.3",
    type: "Veg",
    description: "Penne pasta tossed in rich tomato sauce with herbs.",
    price: 229,
  },
  {
    name: "Chocolate Lava Cake",
    image: Lava,
    rating: "4.8",
    type: "Veg",
    description: "Warm chocolate cake with a molten centre.",
    price: 179,
  },
  {
    name: "Veg Biryani",
    image: Biryani,
    rating: "4.5",
    type: "Veg",
    description: "Aromatic basmati rice with garden vegetables.",
    price: 279,
  },
];

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M3 3h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function Cards() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
          Handpicked for you
        </p>

        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Popular Dishes
        </h2>

        <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-orange-500"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <article
            key={dish.name}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            {/* Image Box Fix: Controlled Height + Proper Centering */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-50">
              <img
                src={dish.image}
                alt={dish.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {dish.bestSeller && (
                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                  ★ Best Seller
                </span>
              )}

              <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-white/80 text-slate-700 backdrop-blur-md transition hover:bg-orange-500 hover:text-white">
                <HeartIcon />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  {dish.name}
                </h3>

                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  ★ {dish.rating}
                </span>
              </div>

              <span
                className={`mt-2 inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                  dish.type === "Veg"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    dish.type === "Veg"
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                  }`}
                ></span>

                {dish.type}
              </span>

              <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                {dish.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="text-xl font-bold text-slate-900">
                  ₹{dish.price}
                </span>

                <Link to="/menu" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
                  <CartIcon />
                  View menu
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Cards;
