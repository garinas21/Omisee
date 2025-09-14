import type { Product } from "@/db/model/productModel";

export type SortKey = "default" | "price-asc" | "price-desc";
export const TAG_UNCATEGORIZED = "uncategorized";

export function computeAvailableTags(products: Product[]): Array<[string, number]> {
    const counter = new Map<string, number>();
    for (const p of products) {
        const tag = (p.tags?.[0]?.trim().toLowerCase() || TAG_UNCATEGORIZED);
        counter.set(tag, (counter.get(tag) || 0) + 1);
    }
    return Array.from(counter.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export function getVisibleProducts(
    products: Product[],
    selectedTag: string | null,
    sortKey: SortKey,
    search?: string
): Product[] {
    let list = products.slice();

    if (selectedTag) {
        const key = selectedTag.toLowerCase();
        list = list.filter(
            (p) => (p.tags?.[0]?.trim().toLowerCase() || TAG_UNCATEGORIZED) === key
        );
    }

    if (search) {
        const s = search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(s));
    }

    if (sortKey === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortKey === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
}
