export interface BakridServiceData {
  id: string;
  name: string;
  sale_price: number;
  sale_price_uk?: number;
  original_price?: number;
  original_price_uk?: number;
  weight_low: number;
  weight_high: number;
  enable: boolean;
  is_free_delivery?: boolean;
  delivery_charge?: number;
  basic_price_uk?: number;
  standard_price_uk?: number;
  premium_price_uk?: number;
  basic_uk_sold_out?: boolean;
  standard_uk_sold_out?: boolean;
  premium_uk_sold_out?: boolean;
}

export interface SidebarOrderData {
  quantity: number;
  serviceDateId: string;
  timingId: string;
  deliveryPreference: string;
  service: BakridServiceData;
  unitPrice: number;
  selectedTier: string;
}

export interface DeliveryDay {
  id: string;
  date: string;
  is_sold_out?: boolean;
  day?: string;
  service_date: string;
}

export interface TimeSlot {
  id: string;
  bakrid_service_date_id: string;
  start_time: string;
  end_time: string;
  is_sold_out?: boolean;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill?: { name?: string; contact?: string };
  theme?: { color?: string };
}
