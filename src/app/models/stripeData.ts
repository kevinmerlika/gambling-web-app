export type Address = {
    city: string | null;
    country: string;
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    state: string | null;
  };
  
  export type CustomerDetails = {
    address: Address;
    email: string;
    name: string;
    phone: string | null;
    tax_exempt: string;
    tax_ids: string[];
  };
  
  export type LineItem = {
    price_data: {
      product: string;
      currency: string;
      unit_amount: number;
    };
    quantity: number;
  };
  
  export type CheckoutSession = {
    id: string;
    object: string;
    amount_subtotal: number | null; // Can be null
    amount_total: number | null; // Can be null
    billing_address_collection: string | null;
    cancel_url: string | null; // Allow null here
    paymentMethod: string | null;
    client_reference_id: string | null;
    created: number;
    currency: string;
    customer: string | null;
    customer_details: CustomerDetails;
    customer_email: string;
    expires_at: number;
    line_items: {
      object: string;
      data: LineItem[];
      has_more: boolean;
      url: string;
    };
    payment_status: string;
    success_url: string;
    total_details: {
      amount_discount: number;
      amount_shipping: number;
      amount_tax: number;
    };
    status: string;
    metadata: Record<string, string>; // Include metadata

  };
  