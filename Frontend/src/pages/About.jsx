import { 
  FaRocket, 
  FaUtensils, 
  FaStar, 
  FaHeadset, 
  FaGithub, 
  FaLinkedin, 
  FaPhoneAlt,
  FaQuoteLeft
} from 'react-icons/fa';
import Navbar from './Navbar';

const AboutPage = () => {
  const features = [
    { id: 1, icon: <FaRocket className="text-orange-500" />, title: 'Fast Delivery', desc: 'Fresh meals delivered quickly.' },
    { id: 2, icon: <FaUtensils className="text-orange-500" />, title: 'Fresh Food', desc: 'Prepared with quality ingredients.' },
    { id: 3, icon: <FaStar className="text-orange-500" />, title: 'Best Quality', desc: 'Top-rated partner restaurants.' },
    { id: 4, icon: <FaHeadset className="text-orange-500" />, title: '24/7 Support', desc: 'Always available to help.' },
  ];

  const devLinks = [
    {
      id: 'github',
      icon: <FaGithub className="text-lg text-slate-700 group-hover:text-orange-500" />,
      label: 'GitHub',
      value: 'visheshsharma0100',
      href: 'https://github.com/visheshsharma0100',
    },
    {
      id: 'linkedin',
      icon: <FaLinkedin className="text-lg text-slate-700 group-hover:text-orange-500" />,
      label: 'LinkedIn',
      value: 'vishesh-sharma0100',
      href: 'https://linkedin.com/in/vishesh-sharma0100',
    },
    {
      id: 'contact',
      icon: <FaPhoneAlt className="text-base text-slate-700 group-hover:text-orange-500" />,
      label: 'Contact',
      value: '+91 8393990234',
      href: 'tel:+918393990234',
    },
  ];

  const reviews = [
    { id: 1, name: 'Rahul Sharma', text: 'Excellent food quality and super fast delivery.' },
    { id: 2, name: 'Priya Verma', text: 'Beautiful website and an amazing ordering experience.' },
    { id: 3, name: 'Aman Gupta', text: 'Fresh food, quick delivery and great service.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ========================================================= */}
        {/* SECTION 1: FOODIEHUB OVERVIEW (COMPACT & QUICK READ)       */}
        {/* ========================================================= */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold text-xs tracking-wider uppercase">
                About Platform
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                About <span className="text-orange-500">FoodieHub</span>
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
                FoodieHub is a modern food delivery platform built to make ordering food simple, fast, and enjoyable. Our mission is to connect food lovers with freshly prepared meals, clean UI, and reliable doorstep delivery.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex sm:flex-col gap-3 shrink-0">
              <a
                href="#menu"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md shadow-orange-500/20 text-center transition"
              >
                Explore Menu
              </a>
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm text-center transition"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Why Choose Us - Compact 4 Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            {features.map((item) => (
              <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-xs text-xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
       

{/* ========================================================= */}
{/* SECTION 2: DEVELOPER DETAILS (FIXED OVERFLOW ISSUE)        */}
{/* ========================================================= */}
<section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
  
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
    {/* Left Side Info */}
    <div className="space-y-1 max-w-lg">
      <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
        Built By
      </span>
      <h2 className="text-2xl font-bold text-slate-900">Vishesh Sharma</h2>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Full Stack Developer
      </p>
      <p className="text-sm text-slate-600 pt-2 leading-relaxed italic">
        &ldquo;Passionate about building clean, modern and user-friendly web applications with a focus on great user experience.&rdquo;
      </p>
    </div>

    {/* Right Side Links - FIXED WRAP & TRUNCATE */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
      {devLinks.map((link) => (
        <a
          key={link.id}
          href={link.href}
          target={link.id !== 'contact' ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200/60 hover:border-orange-200 rounded-2xl transition min-w-0"
        >
          <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">
            {link.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 leading-tight">
              {link.label}
            </p>
            <p className="text-xs font-semibold text-slate-800 group-hover:text-orange-600 transition truncate">
              {link.value}
            </p>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>







        <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                Testimonials
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                What Our Customers Say
              </h2>
            </div>
            <div className="flex gap-1 text-orange-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between relative group hover:border-orange-200 transition"
              >
                <FaQuoteLeft className="text-xl text-orange-200/60 absolute top-4 right-4" />
                <div className="space-y-2">
                  <div className="flex gap-1 text-orange-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <p className="font-bold text-xs text-slate-900 mt-4 pt-3 border-t border-slate-200/50">
                  — {rev.name}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
