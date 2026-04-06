"use client";

import {
  ArrowLeft,
  MessageSquare,
  User,
  MapPin,
  Briefcase,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateInvoicePDF } from "@/lib/invoice-pdf/generateInvoicePDF";

/* ---------------- TYPES ---------------- */

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled";

interface ProductImage {
  image_url: string;
  thumbnail_url: string;
}

interface OrderPlacerDetails {
  phone: string;
  city: string;
  contact_number: string;
  email: string;
  full_name: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  shop_address: string;
  shop_name: string;
  state: string;
  upi_id: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  sub_category_id: number;
  image: ProductImage;
  original_price: number;
  sale_price: number;
  popularity: number;
  quantity: string;
  quantity_limit: number | null;
  servings: number;
  weight: string;
  weight_in_kg: number;
  created_at: string;
  updated_at: string;
}

interface VendorDetails {
  alternate_contact_number: string;
  city: string;
  contact_number: string;
  email: string;
  full_name: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  shop_address: string;
  shop_name: string;
  state: string;
  upi_id: string;
}
interface Address {
  id: string;
  user_id: string;
  full_name: string;
  contact_number: string;
  address_line: string;
  flat_house_building: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  address_type: "home" | "work" | "other";
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface OrderRow {
  id: string;
  order_placer_details: OrderPlacerDetails;
  products: Product[];
  product_quantities: number[];
  order_status: OrderStatus;
  payment_id: string | null;
  total_amount: number;
  schedule_time: string | null;
  created_at: string;
  updated_at: string;
  vendor_details?: VendorDetails;
  paid_via: string;
  payment_data: Date;
  address: Address;
}

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import { useRegion } from "./layout/RegionContext";




type OrderDetailsViewProps = {
  orderId: string;
  onBack?: () => void;
  className?: string;
  isStatusShow?: boolean;
};

/* ---------------- TIMELINE CONFIG ---------------- */

const ORDER_TIMELINE = [
  { key: "pending", label: "Order Pending" },
  { key: "processing", label: "Order Confirmed" },
  { key: "shipped", label: "Order On The Way" },
  { key: "delivered", label: "Order Delivered" },
] as const;

const getActiveStepIndex = (status: OrderStatus) => {
  if (status === "cancelled") return -1;
  if (status === "ready_for_pickup") return 2;
  return ORDER_TIMELINE.findIndex((step) => step.key === status);
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "border-yellow-500 text-yellow-600",
  processing: "border-blue-500 text-blue-600",
  shipped: "border-purple-500 text-purple-600",
  ready_for_pickup: "border-indigo-500 text-indigo-600",
  delivered: "border-green-500 text-green-600",
  cancelled: "border-red-500 text-red-600",
};

/* ---------------- COMPONENT ---------------- */

export default function OrderDetailsView({
  orderId,
  onBack,
  className,
  isStatusShow
}: OrderDetailsViewProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<OrderRow | null>(null);
  const router = useRouter();
  const { region } = useRegion();
  const supabase = createClient();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc(
        "get_order_details_by_id_for_admin",
        { p_order_id: orderId }
      );

  
      if (error) console.error(error);
      setDetails(data?.data ?? null);
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId, supabase]);

  const items = details?.products ?? [];
  const activeIndex = details ? getActiveStepIndex(details.order_status) : 0;

  const handleDownloadInvoice = () => {
    if (!details) return;

    generateInvoicePDF({
      orderId: details.id,
      invoiceNumber: `INV-${details.id.slice(0, 8).toUpperCase()}`,
      customerName: details.order_placer_details.full_name,
      customerPhone: details.order_placer_details.phone,
      address: details.address.address_line,
      paidVia: details.paid_via,
      invoiceDate: new Date(details.payment_data || details.created_at).toLocaleDateString(),
      totalAmount: details.total_amount,
      deliveryCharge: 0,
      couponDiscount: 0,
      region,
      items: details.products.map((p, i) => ({
        name: p.name,
        quantity: details.product_quantities[i],
        price: p.sale_price,
      })),
    });
  };

  if (!details || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4 h-full bg-white rounded-xl border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 bg-white p-6 rounded-xl border", className)}>
      {/* Header */}
      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center gap-3  ">
          {onBack ? (
            <button
              className="border border-black p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onBack}
            >
              <ArrowLeft />
            </button>
          ):   <button
              className="border border-black p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => router.push("/orders")}
            >
              <ArrowLeft />
            </button> }
          <h1 className="text-2xl font-semibold">Order Details</h1>
        </div>
        <div className="flex gap-4 justify-center items-center">

        <Link
          href={`/order-management/chat/${details.id}/vendor`}
          className="flex items-center gap-2 border px-4 py-2 rounded-full text-red-600 border-[#E72343] hover:bg-red-50"
        >
          <MessageSquare />
          Vendor Chat
        </Link>
        <Link
          href={`/order-management/chat/${details.id}/consumer`}
          className="flex items-center gap-2 border px-4 py-2 rounded-full text-red-600 border-[#E72343] hover:bg-red-50"
        >
          <MessageSquare />
          Consumer Chat
        </Link>
        {isStatusShow && (
          <Button
            variant="outline"
            className={cn(
              "rounded-xl px-4 py-1.5 text-xs font-semibold capitalize transition-all",
              details.order_status === "cancelled"
                ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
            )}
          >
            {details.order_status.replaceAll("_", " ")}
          </Button>
        )}
        </div>
      </div>

      {/* Timeline */}
      {details.order_status === "cancelled" && !isStatusShow ? (
        <div className="text-center">
          <span className="capitalize px-6 py-2 rounded-lg text-sm font-medium bg-red-50 border border-red-500 text-red-600">
            Order Cancelled
          </span>
        </div>
      ) : (
        <div className="relative px-4">
          {/* Background line */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-300" />

          {/* Active progress line */}
          <div
            className="absolute top-4 left-0 h-[2px] bg-green-500 transition-all duration-300"
            style={{
              width: `${(activeIndex / (ORDER_TIMELINE.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="flex items-center justify-between relative">
            {ORDER_TIMELINE.map((step, index) => {
              const completed = index < activeIndex;
              const active = index === activeIndex;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center w-28"
                >
                  {/* Circle */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center z-10
              ${
                completed || active
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-white"
              }
            `}
                  >
                    {active && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={`text-xs mt-2 ${
                      active
                        ? "text-black font-semibold"
                        : completed
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          <div className="border rounded-xl p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Order ID</p>
              <p>#{details.id}</p>
            </div>

            <div className="flex justify-between items-center text-sm">
              <p className="font-semibold">Order Status</p>
              <span
                className={`border px-6 py-2 rounded-lg text-xs font-medium ${
                  statusStyles[details.order_status]
                }`}
              >
                {details.order_status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <p className="font-semibold">No. of Items</p>
              <p>{items.length}</p>
            </div>
          </div>

          <div className="border rounded-xl p-5 space-y-4">
            <p className="font-bold">Consumer Details </p>
            <div className="flex items-center gap-3">
              <User className="text-gray-400" />
              <div>
                <p className="font-semibold">
                  {details.order_placer_details?.full_name ?? "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {details.order_placer_details?.phone ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t flex items-center gap-2">
              <div className="flex items-center">
                <Wallet className="text-gray-400" />
              </div>
              <div>
                <p>Payment Method</p>
                <p>Paid via: {details.paid_via}</p>
              </div>
            </div>

            <div className="border-t flex items-center gap-2">
              <div className="flex items-center">
                <Briefcase className="text-gray-400" />
              </div>
              <div>
                <p>Payment Date</p>
                <p>
                  {new Date(
                    details.created_at
                      ? details.created_at
                      : details.payment_data
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border-t flex items-center gap-2">
              <div className="flex items-center">
                <MapPin className="text-gray-400" />
              </div>
              <div>
                <p>Delivery Address</p>
                <p>{details.address.address_line}</p>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <p className="font-semibold">Delivery Address</p>
              <div className="flex gap-2 text-gray-600">
                <MapPin className="text-red-500" />
                <p>
                  {details.vendor_details
                    ? `${details.vendor_details.shop_address}, ${details.vendor_details.city}, ${details.vendor_details.state} - ${details.vendor_details.postal_code}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="border rounded-xl p-5">
          <h3 className="font-semibold mb-3">🧾 Bill Summary</h3>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Image
                      draggable={false}

                  src={item.image.image_url}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty {details.product_quantities[i]}
                  </p>
                  <p className="font-semibold mt-1">
                    ₹{item.sale_price}
                    {item.original_price > item.sale_price && (
                      <span className="line-through text-xs ml-1 text-gray-400">
                        ₹{item.original_price}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <p>Item Total</p>
              <p>₹{details.total_amount}</p>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <p>Grand Total</p>
              <p>₹{details.total_amount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          disabled
          className="px-6 py-3 rounded-lg bg-gradient-to-bl from-[#ff4b55] to-[#ba3139] text-white opacity-60"
        >
          Track Order
        </button>
        <button
          onClick={handleDownloadInvoice}
          className="px-6 py-3 rounded-lg bg-gradient-to-bl from-[#ff4b55] to-[#ba3139] text-white"
        >
          Download Invoice  
        </button>
      </div>
    </div>
  );
}
