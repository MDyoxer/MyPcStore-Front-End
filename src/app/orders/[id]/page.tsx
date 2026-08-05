import OrderDetails from "@/src/components/orders/orderDetails";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetails orderId={Number(id)} />;
}