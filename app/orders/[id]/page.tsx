"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../src/lib/supabaseClient";
import OrderDetailsPage, {
  BakridOrder,
} from "../../../src/components/orders/OrderDetailsPage";

export default function OrderDetailsRoute() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<BakridOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("vendor_order")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 18,
          color: "#646A78",
        }}
      >
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 18,
          color: "#646A78",
        }}
      >
        Order not found
      </div>
    );
  }

  return <OrderDetailsPage order={order} />;
}
