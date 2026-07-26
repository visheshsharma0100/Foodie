import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { orderApi } from "../services/api";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Preparing: "bg-sky-100 text-sky-800",
  "Out for Delivery": "bg-violet-100 text-violet-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-800",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    orderApi.mine()
      .then(({ orders: nextOrders }) => !cancelled && setOrders(nextOrders))
      .catch((requestError) => !cancelled && setError(requestError.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return <div className="min-h-screen bg-slate-50"><Navbar /><main className="mx-auto max-w-5xl px-4 pb-16 pt-28">
    <h1 className="text-3xl font-extrabold text-slate-900">My <span className="text-orange-500">Orders</span></h1>
    <p className="mt-1 text-sm text-slate-500">Track every order you place with FoodieHub.</p>
    {loading ? <p className="py-14 text-center text-slate-500">Loading your orders…</p> : null}
    {error ? <p className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
    {!loading && !error && orders.length === 0 ? <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm"><p className="font-semibold text-slate-800">No orders yet.</p><a className="mt-4 inline-block text-sm font-bold text-orange-500" href="/menu">Browse the menu</a></div> : null}
    <div className="mt-8 space-y-4">{orders.map((order) => <article key={order._id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4"><div><p className="font-bold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p><p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString("en-IN")}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[order.status] || "bg-slate-100 text-slate-700"}`}>{order.status}</span></div>
      <ul className="my-4 space-y-2 text-sm text-slate-600">{order.items.map((item) => <li key={item._id || item.foodId} className="flex justify-between"><span>{item.quantity} × {item.name}</span><span>₹{item.price * item.quantity}</span></li>)}</ul>
      <div className="flex justify-between border-t border-slate-100 pt-4 text-sm"><span className="text-slate-500">{order.paymentMethod} · {order.address}</span><strong className="text-slate-900">₹{order.totalPrice}</strong></div>
    </article>)}</div>
  </main></div>;
}
