import { buildApiUrl } from "@/src/utils/baseApiUrl";

export type UpdateCartQuantityDto = {
  idProducto: number;
  cantidad: number;
};

export async function UpdateCartQuantity(
  idToken: string,
  updateCartQuantityDto: UpdateCartQuantityDto,
): Promise<void> {
  const response = await fetch(buildApiUrl("/cart/quantity"), {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(updateCartQuantityDto),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart quantity");
  }
}