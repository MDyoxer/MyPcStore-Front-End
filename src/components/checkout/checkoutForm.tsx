"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ orderId }: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      // Si el PaymentIntent ya no es válido (p. ej. fue cancelado por un
      // createCheckout posterior), recargar para obtener uno nuevo.
      if (submitError.code === "payment_intent_unexpected_state") {
        window.location.reload();
        return;
      }
      // Si Stripe exige redirect (ej. Link), sigue la URL que devuelve
      const redirectUrl =
        submitError.type === "card_error" &&
        (submitError as any).payment_intent?.next_action?.redirect_to_url?.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      setError(submitError.message ?? "Error al procesar el pago");
      setProcessing(false);
      return;
    }

    router.push(`/orders/${orderId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 bg-[#c8ff00] text-black
                   hover:bg-purple-600 active:scale-[0.98] transition-all duration-200 py-4 disabled:opacity-50"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
      >
        {processing ? "Procesando..." : "Pagar ahora →"}
      </button>
    </form>
  );
}