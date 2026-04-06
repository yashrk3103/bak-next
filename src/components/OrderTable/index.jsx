"use client";

import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const statusStyles = {
  delivered: "bg-[#E0FFDD] text-[#0A8100] border-[#0A8100]",
  ready_for_pickup: "bg-[#E7C9FF] text-[#590C96] border-[#590C96]",
  pending: "bg-[#DDE7FF] text-[#4679F3] border-[#4679F3]",
  processing:"bg-[#FFEAAA] text-[#B54708] border-[#B54708]",
  cancelled:"bg-[#FFDBD9] text-[#BF0000] border-[#BF0000]",
  shipped:"bg-[#AAFFF6] text-[#055048] border-[#055048]"

};

const statusText = {
  pending: "Qurbani Confirmed",
  processing:"Qurbani in Progress",
  shipped:"Packing & Dispatch",
  delivered:"Qurbani Delivered",
  cancelled:"Cancelled",
  ready_for_pickup:"Out for Delivery"


}


const PaymentMethod = {
  case: "bg-[#1AB75921] text-green-300 ",
  UPI:"bg-[#AE422921] text-red-300 ",
  Razorpay :"bg-[#5441C321] text-[#5441C3]"
}

const PAGE_SIZE = 5;

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("date_desc");
  const sortRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    if (sortOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortOpen]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_all_bakrid_order_for_user', {
          p_limit: PAGE_SIZE,
          p_offset: (currentPage - 1) * PAGE_SIZE
        });


        console.log("data" ,data)
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const now = Date.now();
    

      const formattedOrders = data.data.map((order) => {
        const createdTime = new Date(order.created_at).getTime();
        const diffInSeconds = (now - createdTime) / 1000;

        return {
          ...order,
          isCancelDisabled:
            diffInSeconds > 180 || order.order_status !== "pending",
        };
      });

      setOrders(formattedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, [currentPage]);
  const sortedOrders = [...orders].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.products?.[0]?.name || "").localeCompare(
          b.products?.[0]?.name || ""
        );
      case "size":
        return (b.products?.length || 0) - (a.products?.length || 0);
      case "date_asc":
        return new Date(a.created_at) - new Date(b.created_at);
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });
  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const handleOrderDetails = (order) =>{
    router.push(`orders?orderId=${order.id}`)
  }

  
  return (
    <div className="bg-white w-full rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-red-500">
          Profile Settings
        </h2>

{orders.length > 1 &&  <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="border border-primary px-4 py-1.5 rounded-full text-sm text-primary flex items-center gap-2"
          >
            Sort By <MdOutlineKeyboardArrowDown />
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-20">
              {[
                { label: "Newest", value: "date_desc" },
                { label: "Oldest", value: "date_asc" },
      
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setSortOpen(false);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div> }
       

      </div>

      {/* Table */}
      <div className="">
        {!loading && orders.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm">You haven’t placed any orders yet.</p>
          </div>
        ) : (
          <table className="w-full border-spacing-y-4 text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-3 font-medium text-left">Order ID</th>
       
                <th className="py-3 font-medium text-left">Status</th>
                <th className="py-3 font-medium text-left">Payment Method</th>
                <th className="py-3 font-medium text-left">Amount</th>
                <th className="py-3 font-medium text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b cursor-pointer last:border-none hover:bg-gray-50 transition"
                >
                  {/* Order ID */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Image
                      draggable={false}

                        src={order.products?.[0]?.image?.image_url || "/images/order.svg"}
                        alt="product"
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div>
                      <p className="font-medium capitalize text-gray-800">
                        {order.id.slice(0, 8)}
                      </p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Products */}
                

                  {/* Status */}
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 w-[130px] capitalize rounded-lg text-xs border font-medium ${statusStyles[order.order_status]
                        }`}
                    >
                      {statusText[order.order_status]}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="py-4">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium  ${PaymentMethod[order.paid_via]
                        }`} >
                      {order.paid_via === "Razorpay" ? "Razorpay" : "Cash"}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-4">
                    <p className="font-medium text-gray-700">₹{order.total_amount}</p>
                    {order.coupon_discount_amount > 0 && (
                      <p className="text-xs text-green-600 font-medium mt-0.5">
                        Discount: -₹{order.coupon_discount_amount}
                      </p>
                    )}
                  </td>

                  <td className="py-4 text-center relative">
                    <button
                      onClick={() => handleOrderDetails(order)}
                      className="w-7 h-7 rounded-full btn-gradient text-white"
                    >
                      ⋮
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between mt-6 text-sm">
          <p>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, orders.length)} of{" "}
            {orders.length}
          </p>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-full ${currentPage === i + 1
                    ? "btn-gradient text-white"
                    : "border border-primary"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
