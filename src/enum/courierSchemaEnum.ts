import { z } from "zod"

/* --------------------------- ENUMS --------------------------- */
export const PartnerTypeEnum = z.enum(["REGULAR", "MONTHLY"])
export const CourierStatusEnum = z.enum([
  "REGISTERED",
  "RECEIVED",
  "PACKED",
  "BOXED",
  "IN_SHIPMENT",
  "IN_TRANSIT",
  "ARRIVED_DESTINATION",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "HANDED_TO_THIRD_PARTY",
  "RETURN",
  "CANCELLED",
  "MISSING",
  "LOST",
])
export const ThirdPartyCourierEnum = z.enum(["NONE", "DHL", "FEDEX", "UPS", "OTHER"])
export const PaymentStatusEnum = z.enum(["UNPAID", "PARTIAL", "PAID", "CANCELLED"])
export const PaymentMethodEnum = z.enum(["CASH", "BANK_TRANSFER", "MOBILE_PAYMENT", "CARD", "OTHER"])

