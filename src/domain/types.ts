export type OrderStage = 
  | 'ORDER_RECEIVED'
  | 'ITEM_PAYMENT_VERIFIED'
  | 'ORDER_CONFIRMED'
  | 'PACKING'
  | 'COURIER_RECEIPT_UPLOADED'
  | 'COURIER_CHARGE_VERIFIED'
  | 'SUBMITTED_FOR_DISPATCH'
  | 'DELIVERED'
  | 'CANCELLED';

export type UserRole = 'DEVELOPER' | 'OWNER' | 'HELPER' | 'CUSTOMER';

export interface CustomerAddress {
  fullName: string;
  phone: string;
  street: string;
  landmark1: string;
  landmark2?: string;
  pincode: string;
  googleMapsPin: string;
  consentTimestamp: string;
}

export interface PaymentRecord {
  paymentId: string;
  kind: 'ITEM' | 'COURIER';
  amount: number;
  utr: string;
  screenshotUrl: string;
  verified: boolean;
  ocrExtractedUtr?: string;
  ocrExtractedAmount?: number;
}

export interface CourierBill {
  billId: string;
  courierName: string;
  trackingId: string;
  amount: number;
  receiptPhotoUrl: string;
  weightKg?: number;
}

export interface Order {
  orderId: string;
  userId: string;
  items: Array<{ id: number; name: string; price: number; category: string }>;
  itemTotal: number;
  stage: OrderStage;
  isWithheld: boolean;
  courierNoticeAccepted: boolean;
  address: CustomerAddress;
  itemPayment?: PaymentRecord;
  courierBill?: CourierBill;
  courierPayment?: PaymentRecord;
  createdAt: string;
  updatedAt: string;
}
