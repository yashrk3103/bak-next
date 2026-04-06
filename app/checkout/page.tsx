"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../src/lib/supabaseClient";
import { IoClose } from "react-icons/io5";
import { HiMinus, HiPlus } from "react-icons/hi";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRegion } from "../../src/components/layout/RegionContext";

/* ── Qurbani session types ── */

interface QurbaniCheckoutData {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedTier: string;
  serviceDateId: string;
  timingId: string;
  deliveryPreference: string;
  fullName: string;
  contactNumber: string;
  area: string;
  building: string;
  landmark: string;
  city: string;
  state: string;
  qurbaniNames: string[];
  region: string;
  serviceWeightLow: number;
  serviceWeightHigh: number;
}

interface CartItem {
  id: string;
  title: string;
  qty: number;
  price: number;
  image?: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
    paypal?: {
      Buttons: (options: {
        createOrder: (data: unknown, actions: { order: { create: (details: { purchase_units: { amount: { currency_code: string; value: string } }[] }) => Promise<string> } }) => Promise<string>;
        onApprove: (data: { orderID: string }, actions: { order: { capture: () => Promise<{ id: string; status: string }> } }) => Promise<void>;
        onError: (err: unknown) => void;
      }) => { render: (selector: string) => void };
    };
  }
}

/* ---------------- DOMAIN DETECTION ---------------- */

function getCurrencySymbol(region: string) {
  return region === "uk" ? "\u00a3" : "\u20b9";
}

export default function Checkout() {
  const { region } = useRegion();
  const router = useRouter();
  const [qurbaniData] = useState<QurbaniCheckoutData | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("qurbani_checkout_data");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [qurbaniLoading, setQurbaniLoading] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addressId, setAddressId] = useState<string | null>(null);

  /* ── Coupon state ── */
  interface BakridCoupon {
    id: string;
    name: string;
    code: string;
    amount: number | null;
    discount_percentage: number;
    valid_from: string;
    valid_to: string;
  }
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("netbanking");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<BakridCoupon | null>(null);
  const [coupons, setCoupons] = useState<BakridCoupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);

  const openCouponModal = async () => {
    setShowCouponModal(true);
    if (coupons.length > 0) return;
    setCouponsLoading(true);
    const { data, error } = await supabase.from("bakrid_coupon").select("*");
    if (!error && data) setCoupons(data as BakridCoupon[]);
    setCouponsLoading(false);
  };

  const applyCoupon = (coupon: BakridCoupon) => {
    setAppliedCoupon(coupon);
    setCouponInput(coupon.code);
    setShowCouponModal(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  const [scheduleType] = useState<"instant" | "schedule">(
    "instant"
  );

  const [hour] = useState<string>("10");
  const [minute] = useState<string>("00");
  const [ampm] = useState<"AM" | "PM">("AM");

  const [paymentMethod] = useState<string>("netbanking");

  const currencySymbol = getCurrencySymbol(region);

  /* ---------------- ADDRESS ---------------- */

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("selected_address_id");
      setTimeout(() => setAddressId(id), 0);
    }
  }, []);

  /* ---------------- CART LOAD ---------------- */

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc("get_user_cart");

      if (error) {
        console.error("Cart error:", error);
        setLoading(false);
        return;
      }

      if (!data?.data?.products) {
        setItems([]);
        setLoading(false);
        return;
      }

      const cart = data.data;

      const mappedItems: CartItem[] = cart.products.map(
        (product: { id: string; name: string; sale_price: number; image?: { image_url: string } }, index: number) => ({
          id: product.id,
          title: product.name,
          qty: cart.quantities[index] || 1,
          price: product.sale_price,
          image: product.image?.image_url,
        })
      );

      setItems(mappedItems);
      setLoading(false);
    };

    fetchCart();
  }, []);

  /* ---------------- CART UPDATE ---------------- */

  const updateCartQty = async (productId: string, quantity: number) => {
    await supabase.rpc("upsert_user_cart", {
      p_address_id: null,
      p_delete_product_id: null,
      p_product_id: productId,
      p_quantity: quantity,
    });
  };

  const increaseQty = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.qty + 1;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );

    await updateCartQty(id, newQty);
  };

  const decreaseQty = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.qty === 1) return;

    const newQty = item.qty - 1;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );

    await updateCartQty(id, newQty);
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    await supabase.rpc("upsert_user_cart", {
      p_address_id: null,
      p_delete_product_id: id,
      p_product_id: null,
      p_quantity: null,
    });
  };

  const clearUserCart = async () => {
    const { error } = await supabase.rpc("clear_user_cart");

    if (error) {
      console.error("Failed to clear cart:", error);
      return false;
    }

    setItems([]);
    return true;
  };

  /* ---------------- TOTAL ---------------- */

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  /* ---------------- ORDER PAYLOAD ---------------- */

  const buildInsertOrderPayload = async ({
    paidVia,
    paymentId = null,
    paymentData = null,
  }: {
    paidVia: string;
    paymentId?: string | null;
    paymentData?: RazorpayResponse | Record<string, string> | null;
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    return {
      p_user_id: user.id,
      p_address: addressId,
      p_products_uuid: items.map((i) => i.id),
      p_product_quantities: items.map((i) => i.qty),
      p_item_total: subtotal,
      p_tax_amount: tax,
      p_delivery_fee: 0,
      p_packaging_fee: 0,
      p_total_amount: total,
      p_paid_via: paidVia,
      p_payment_id: paymentId,
      p_payment_data: paymentData,
      p_schedule_time:
        scheduleType === "schedule" ? `${hour}:${minute} ${ampm}` : null,
      p_nearby_vendors: null,
    };
  };

  /* ---------------- COD ORDER ---------------- */

  const placeCODOrder = async () => {
    setLoading(true);

    const payload = await buildInsertOrderPayload({
      paidVia: "cod",
    });

    const { error } = await supabase.rpc("insert_order", payload);

    setLoading(false);

    if (error) {
      toast.error("Failed to place order");
      console.error(error);
      return;
    }

    await clearUserCart();
    toast.success("Order placed successfully (COD)");
  };

  /* ---------------- RAZORPAY (.in) ---------------- */

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const payWithRazorpay = async () => {
    setLoading(true);

    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Chop & Chicks",
      description: "Qurbani Payment",

      handler: async (response: RazorpayResponse) => {
        const payload = await buildInsertOrderPayload({
          paidVia: "razorpay",
          paymentId: response.razorpay_payment_id,
          paymentData: response,
        });

        const { error } = await supabase.rpc("insert_order", payload);

        if (error) {
          toast.error("Payment done but order not saved");
          return;
        }

        await clearUserCart();
        toast.success("Payment successful!");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    setLoading(false);
  };

  /* ---------------- PAYPAL (.uk) ---------------- */

  const loadPaypal = () =>
    new Promise<boolean>((resolve) => {
      if (window.paypal) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=GBP`;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const payWithPaypal = async () => {
    setLoading(true);

    const loaded = await loadPaypal();

    if (!loaded) {
      toast.error("PayPal SDK failed to load");
      setLoading(false);
      return;
    }

    setLoading(false);

    // Clear any previous PayPal button
    const container = document.getElementById("paypal-button-container");
    if (container) container.innerHTML = "";

    window.paypal!.Buttons({
      createOrder: (_data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "GBP",
                value: total.toFixed(2),
              },
            },
          ],
        });
      },
      onApprove: async (_data, actions) => {
        try {
          const details = await actions.order.capture();

          const payload = await buildInsertOrderPayload({
            paidVia: "paypal",
            paymentId: details.id,
            paymentData: { paypal_order_id: details.id, status: details.status },
          });

          const { error } = await supabase.rpc("insert_order", payload);

          if (error) {
            console.error("insert_order error:", error);
            toast.error("Payment done but order not saved");
            return;
          }

          await clearUserCart();
          toast.success("Payment successful!");
        } catch (err) {
          console.error("PayPal onApprove error:", err);
          toast.error("Order could not be saved after payment");
        }
      },
      onError: (err) => {
        console.error("PayPal error:", err);
        toast.error("PayPal payment failed");
      },
    }).render("#paypal-button-container");
  };

  /* ---------------- PLACE ORDER ---------------- */

  const placeOrder = () => {
    if (paymentMethod === "cod") {
      placeCODOrder();
    } else if (region === "uk") {
      payWithPaypal();
    } else {
      payWithRazorpay();
    }
  };

  /* ---------------- QURBANI PAYMENT (session-based, no cart) ---------------- */

  const placeServiceOrder = async (paymentData: {
    payment_id: string;
    order_id: string | null;
    signature: string | null;
    paypal_meta: unknown | null;
  }) => {
    if (!qurbaniData) return;
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.access_token) {
      toast.error("Please log in to place an order");
      return;
    }
    const addressStr = [qurbaniData.building, qurbaniData.area, qurbaniData.landmark, qurbaniData.city, qurbaniData.state]
      .filter(Boolean).join(", ");
    let addressId: string | null = null;
    if (qurbaniData.deliveryPreference === "Self / Family" && addressStr) {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: a } = await supabase.from("user_address").insert({
          id: crypto.randomUUID(),
          user_id: u.user.id,
          full_name: qurbaniData.fullName,
          contact_number: qurbaniData.contactNumber,
          flat_house_building: qurbaniData.building || "N/A",
          address_line: addressStr,
          city: qurbaniData.city,
          state: qurbaniData.state,
          landmark: qurbaniData.landmark,
          country: qurbaniData.region === "uk" ? "GB" : "IN",
          postal_code: "000000",
        }).select().single();
        addressId = (a as any)?.id ?? null;
      }
    }
    const { error } = await supabase.functions.invoke("place_bakrid_service_order", {
      body: {
        payment_data: paymentData,
        coupon_code: appliedCoupon?.code ?? null,
        coupon_discount_amount: discountAmount > 0 ? discountAmount : null,
        address_id: addressId,
        qurbani_names: qurbaniData.qurbaniNames, service_date_id: qurbaniData.serviceDateId,
        timing_id: qurbaniData.timingId, full_name: qurbaniData.fullName,
        phone_number: qurbaniData.contactNumber,
        currency: qurbaniData.region === "uk" ? "GBP" : "INR",
        selected_tier: qurbaniData.selectedTier,
        delivery_prefs: qurbaniData.deliveryPreference,
      },
    });
    if (error) { toast.error("Payment done but order not saved. Contact support."); return; }
    sessionStorage.removeItem("qurbani_checkout_data");
    toast.success("Order placed successfully!");
    router.push("/profile?active=orders");
  };

  const qurbaniPayWithRazorpay = async () => {
    if (!qurbaniData) return;
    setQurbaniLoading(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
    await new Promise((res) => { script.onload = res; script.onerror = res; });
    if (!window.Razorpay) { toast.error("Razorpay failed to load"); setQurbaniLoading(false); return; }
    new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(qurbaniFinalTotal * 100),
      currency: "INR",
      name: "Zibra Qurbani",
      description: `Qurbani — ${qurbaniData.selectedTier}`,
      prefill: { name: qurbaniData.fullName, contact: qurbaniData.contactNumber },
      handler: async (r: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        await placeServiceOrder({ payment_id: r.razorpay_payment_id, order_id: r.razorpay_order_id, signature: r.razorpay_signature, paypal_meta: null });
      },
      theme: { color: "#ED0213" },
    }).open();
    setQurbaniLoading(false);
  };

  const qurbaniPayWithPaypal = async () => {
    if (!qurbaniData) return;
    setQurbaniLoading(true);
    if (!window.paypal) {
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=GBP`;
      document.body.appendChild(s);
      await new Promise((res) => { s.onload = res; s.onerror = res; });
    }
    setQurbaniLoading(false);
    const container = document.getElementById("qurbani-paypal-btn");
    if (container) container.innerHTML = "";
    window.paypal!.Buttons({
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{ amount: { currency_code: "GBP", value: qurbaniFinalTotal.toFixed(2) } }],
      }),
      onApprove: async (_d, actions) => {
        try {
          const details = await actions.order.capture();
          await placeServiceOrder({ payment_id: details.id, order_id: null, signature: null, paypal_meta: { paypal_order_id: details.id, status: details.status } });
        } catch (err) {
          console.error("PayPal onApprove error:", err);
          toast.error("Order could not be saved after payment");
        }
      },
      onError: (err) => { console.error(err); toast.error("PayPal payment failed"); },
    }).render("#qurbani-paypal-btn");
  };

  /* ---------------- COUPON DISCOUNT CALCULATION ---------------- */

  const discountAmount = qurbaniData && appliedCoupon
    ? appliedCoupon.amount
      ? appliedCoupon.amount
      : Math.round(qurbaniData.totalPrice * (appliedCoupon.discount_percentage / 100))
    : 0;
  const qurbaniFinalTotal = qurbaniData ? Math.max(0, qurbaniData.totalPrice - discountAmount) : 0;

  /* ---------------- UI ---------------- */

  /* -- Qurbani mode: session-based checkout, bypasses cart -- */
  if (qurbaniData) {
    const isUk = qurbaniData.region === "uk";
    const sym = isUk ? "£" : "₹";
    const fmt = (n: number) => `${sym}${n.toLocaleString()}`;
    const deliveryFree = true; // Qurbani service includes delivery
    const grandTotal = qurbaniFinalTotal;
    const addressStr = [qurbaniData.building, qurbaniData.area, qurbaniData.landmark, qurbaniData.city, qurbaniData.state].filter(Boolean).join(", ");
    const tierLabel = qurbaniData.selectedTier.charAt(0).toUpperCase() + qurbaniData.selectedTier.slice(1);

    // Payment method options (non-UK shows Razorpay options, UK shows PayPal)
    const paymentMethods = isUk
      ? [{ id: "paypal", label: "PayPal" }]
      : [
          { id: "netbanking", label: "Net Banking" },
          { id: "googlepay", label: "Google Pay" },
          { id: "visa", label: "Visa" },
          { id: "mastercard", label: "MasterCard" },
          { id: "applepay", label: "Apple Pay" },
          { id: "creditdebit", label: "Credit/Debit" },
          { id: "upi", label: "Pay using UPI" },
        ];

    return (
      <div className="min-h-screen bg-[#F7FBFF] px-4 py-8">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: "26px", color: "#1a1a1a" }}>
              Checkout
            </h1>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 flex flex-col gap-4">

              {/* ORDER SUMMARY */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Order Summary</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <Row label="Package & Tier" value={`${tierLabel} — ${qurbaniData.serviceWeightLow}–${qurbaniData.serviceWeightHigh} kg`} />
                  <Row label="Quantity" value={String(qurbaniData.quantity)} />
                  <Row label="Total Price" value={fmt(qurbaniData.totalPrice)} />
                  {discountAmount > 0 && <Row label="Coupon Discount" value={`-${fmt(discountAmount)}`} green />}
                  <Row label="Delivery Fee" value={deliveryFree ? "Free" : fmt(qurbaniData.totalPrice * 0.05)} green={deliveryFree} />
                  <div className="border-t border-dashed border-gray-200 my-2" />
                  <div className="flex justify-between font-semibold text-base text-gray-900">
                    <span>Grand Total</span>
                    <span>{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* APPLY COUPON */}
              {!isUk && (<div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Apply Coupon</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    readOnly={!!appliedCoupon}
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400 transition"
                    style={{ fontFamily: "Fredoka, sans-serif" }}
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition"
                      style={{ fontFamily: "Fredoka, sans-serif" }}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={openCouponModal}
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition"
                      style={{ fontFamily: "Fredoka, sans-serif" }}
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Coupon <span className="font-bold">{appliedCoupon.code}</span> applied!
                    {appliedCoupon.amount ? ` Save ${sym}${appliedCoupon.amount}` : appliedCoupon.discount_percentage ? ` Save ${appliedCoupon.discount_percentage}%` : ""}
                  </p>
                )}
              </div>)}

              {/* COUPON MODAL */}
              {showCouponModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <h2 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600, fontSize: "20px", color: "#ED0213" }}>
                        Apply Coupon
                      </h2>
                      <button
                        onClick={() => setShowCouponModal(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 text-lg"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Coupon Input inside modal */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Enter Coupon Code</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="e.g. COCH500"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 transition"
                          style={{ fontFamily: "Fredoka, sans-serif" }}
                        />
                        {appliedCoupon ? (
                          <button
                            onClick={removeCoupon}
                            className="px-4 py-2 text-sm font-semibold text-red-600 hover:underline"
                            style={{ fontFamily: "Fredoka, sans-serif" }}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const match = coupons.find((c) => c.code.toLowerCase() === couponInput.toLowerCase());
                              if (match) applyCoupon(match);
                              else if (couponInput.trim()) {
                                applyCoupon({ id: "manual", name: "", code: couponInput.trim().toUpperCase(), amount: null, discount_percentage: 0, valid_from: "", valid_to: "" });
                              }
                            }}
                            className="px-4 py-2 text-sm font-semibold text-red-600 hover:underline"
                            style={{ fontFamily: "Fredoka, sans-serif" }}
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Coupon List */}
                    <div className="px-5 py-4 max-h-72 overflow-y-auto">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">More Offers</p>

                      {couponsLoading ? (
                        <p className="text-sm text-gray-400 text-center py-6">Loading offers…</p>
                      ) : coupons.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No offers available</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {coupons.map((coupon) => (
                            <div
                              key={coupon.id}
                              className="flex items-start gap-3 border border-gray-100 rounded-xl p-3"
                            >
                              {/* Coupon icon */}
                              <div
                                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ background: "#FFF0F0" }}
                              >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                  <path d="M20 12a2 2 0 0 0 0-4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2z" stroke="#ED0213" strokeWidth="1.8" strokeLinejoin="round" />
                                  <path d="M9 12h6" stroke="#ED0213" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2" />
                                </svg>
                              </div>

                              {/* Coupon details */}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-gray-800" style={{ fontFamily: "Fredoka, sans-serif" }}>
                                  {coupon.code}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{coupon.name}</p>
                                {(coupon.valid_from || coupon.valid_to) && (
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {coupon.valid_from} – {coupon.valid_to}
                                  </p>
                                )}
                              </div>

                              {/* Savings + Apply */}
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <p className="text-[11px] text-gray-500 text-right leading-tight max-w-[90px]">
                                  {coupon.amount
                                    ? `Save ${sym}${coupon.amount}`
                                    : coupon.discount_percentage
                                    ? `Save ${coupon.discount_percentage}%`
                                    : ""}
                                </p>
                                <button
                                  onClick={() => applyCoupon(coupon)}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
                                  style={{ background: "linear-gradient(90deg,#FF4B55,#BA3139)", fontFamily: "Fredoka, sans-serif" }}
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* DELIVERY LOCATION */}
              {addressStr && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Delivery Location</p>
                    <button className="text-xs font-semibold text-red-500 hover:underline">Change</button>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="#ED0213" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{addressStr}</p>
                  </div>
                </div>
              )}

              {/* PAYMENT METHOD */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                <p className="text-xs font-bold text-red-600 mb-4">WE ACCEPT DOMESTIC AND INTERNATIONAL PAYMENTS</p>
                <div className="flex flex-col gap-2">
                  {paymentMethods.map((method) => {
                    const active = selectedPaymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition"
                        style={{
                          background: active ? "#FFF5F5" : "#FFFFFF",
                          borderColor: active ? "#FFCCCC" : "#F0F0F0",
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: active ? "#ED0213" : "#C0C0C0" }}
                        >
                          {active && <div className="w-2 h-2 rounded-full bg-[#ED0213]" />}
                        </div>
                        <span className="text-sm text-gray-700" style={{ fontFamily: "Fredoka, sans-serif" }}>
                          {method.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="w-full lg:w-[340px] flex flex-col gap-4">

              {/* Timeline */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col gap-0">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#ED0213] flex-shrink-0 mt-0.5" />
                      <div className="w-px flex-1 bg-gray-200 my-1" style={{ minHeight: "40px" }} />
                    </div>
                    <div className="pb-4">
                      <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "Fredoka, sans-serif" }}>Customer Details</p>
                      <p className="text-xs text-gray-400 mt-0.5">{qurbaniData.fullName} · {qurbaniData.contactNumber}</p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#ED0213] flex-shrink-0 mt-0.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "Fredoka, sans-serif" }}>Payment Method</p>
                      <p className="text-xs text-gray-400 mt-0.5">via {isUk ? "PayPal" : "Razorpay"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Total Summary */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{fmt(qurbaniData.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Coupon Discount</span>
                      <span className="text-green-600 font-medium">-{fmt(discountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-base text-gray-900">
                    <span>Order Total</span>
                    <span>{fmt(grandTotal)}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-400 flex items-start gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" stroke="#C0C0C0" strokeWidth="2" />
                    <path d="M12 8v4m0 4h.01" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Cancellation must be made within 3 minutes of placing the order.
                </p>

                {/* PayPal button container (UK) */}
                {isUk && <div id="qurbani-paypal-btn" className="mt-4" />}

                <button
                  onClick={() => isUk ? qurbaniPayWithPaypal() : qurbaniPayWithRazorpay()}
                  disabled={qurbaniLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-white font-semibold text-base disabled:opacity-60 hover:opacity-90 transition"
                  style={{ background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)", fontFamily: "Fredoka, sans-serif" }}
                >
                  {qurbaniLoading ? "Processing…" : "Book Order"}
                  {!qurbaniLoading && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
        <Image
                      draggable={false}

          src="/images/empty-cart.png"
          width={300}
          height={300}
          alt="Empty Cart"
        />
        <p className="text-[#82131B] text-2xl text-center mt-3 font-medium">
          Start Filling Your Cart with <br /> Premium Fresh Meat.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* CART ITEMS */}

        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 bg-white shadow-md p-3 rounded-xl border relative"
            >
              <IoClose
                size={20}
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => removeItem(item.id)}
              />

              {item.image && (
                <Image
                      draggable={false}

                  src={item.image}
                  width={100}
                  height={100}
                  alt={item.title}
                  className="rounded-md object-cover"
                />
              )}

              <div className="flex mt-3 justify-between w-full items-end">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="font-medium text-primary mt-1">{currencySymbol}{item.price}</p>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="bg-red-500 text-white p-1 rounded-full"
                  >
                    <HiMinus />
                  </button>

                  <span className="px-2 font-semibold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="bg-red-500 text-white p-1 rounded-full"
                  >
                    <HiPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}

        <div className="bg-[#FFF1F1] p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>{currencySymbol}{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{currencySymbol}{total.toFixed(2)}</span>
            </div>
          </div>

          {region === "uk" && (
            <p className="text-sm text-gray-500 mt-2">Payment via PayPal</p>
          )}
          {region === "in" && (
            <p className="text-sm text-gray-500 mt-2">Payment via Razorpay</p>
          )}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="mt-5 w-full py-3 text-white rounded-lg btn-gradient"
          >
            {loading ? "Processing..." : `Place Order \u2192`}
          </button>

          {/* PayPal button renders here for .uk domains */}
          {region === "uk" && (
            <div id="paypal-button-container" className="mt-4" />
          )}
        </div>

      </div>
    </div>
  );
}

function Row({ label, value, green, highlight }: { label: string; value: string; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-right ${green ? "text-green-600 font-medium" : ""} ${highlight ? "text-red-600 font-semibold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
