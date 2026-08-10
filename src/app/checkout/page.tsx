import CheckoutClient from "@/src/components/checkout/checkoutClient";
import { Suspense } from "react";
export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutClient />
    </Suspense>
  )
}