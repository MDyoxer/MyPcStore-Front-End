import Allproducts from "@/src/components/products/allproducts";
type Props = {
        searchParams: Promise<{ search?: string }>;
    }
export default async function AllProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div>
      <Allproducts initialSearch={params.search ?? ""} />
    </div>
  );
}