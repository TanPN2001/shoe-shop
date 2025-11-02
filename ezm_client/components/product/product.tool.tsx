"use client"
import { useAtom } from "jotai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CART, ORDER } from "@/services/service.atom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { save } from "@/services/service.storage";
import './product.tool.css';

type Props = {
    product: ProductDocument
    variants: VariantDocument[]
}

function ProductTool({ product, variants }: Props) {
    console.log("loanhtm variants: ", variants);
    const [cart, setCart] = useAtom(CART);
    const [order, setOrder] = useAtom(ORDER);
    const [selectedVariant, setSelectedVariant] = useState<VariantDocument | undefined>(undefined);
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<any | undefined>(undefined);
    const [selectedSize, setSelectedSize] = useState<any | undefined>(undefined);

    // Lấy danh sách màu & size duy nhất
    const uniqueColors = useMemo(() => {
        return Array.from(
            new Map(
                variants
                    .filter(v => v.item_variant_item_color_fk && v.quantity > 0)
                    .map(v => [v.item_variant_item_color_fk?.itemColorId, v.item_variant_item_color_fk])
            ).values()
        );
    }, [variants]);

    const uniqueSizes = useMemo(() => {
        return Array.from(
            new Map(
                variants
                    .filter(v => v.item_variant_item_size_fk && v.quantity > 0)
                    .map(v => [v.item_variant_item_size_fk?.itemSizeId, v.item_variant_item_size_fk])
            ).values()
        );
    }, [variants]);

    const filteredSizes = useMemo(() => {
        if (!selectedColor) return uniqueSizes;
        const filtered = variants
            .filter(v => v.item_variant_item_color_fk?.itemColorId === selectedColor.itemColorId)
            .map(v => v.item_variant_item_size_fk)
            .filter(Boolean);
        return Array.from(new Map(filtered.map(s => [s.itemSizeId, s])).values());
    }, [selectedColor, variants]);

    // Khi chọn size → lọc lại danh sách màu phù hợp
    const filteredColors = useMemo(() => {
        if (!selectedSize) return uniqueColors;
        const filtered = variants
            .filter(v => v.item_variant_item_size_fk?.itemSizeId === selectedSize.itemSizeId)
            .map(v => v.item_variant_item_color_fk)
            .filter(Boolean);
        return Array.from(new Map(filtered.map(c => [c.itemColorId, c])).values());
    }, [selectedSize, variants]);

    const handleSelectColor = (colorId: string) => {
        const colorObj = uniqueColors.find(c => c.itemColorId === Number(colorId));
        setSelectedColor(colorObj);

        // Nếu đã chọn size mà size đó không tồn tại với màu này → reset
        if (selectedSize) {
            const exist = variants.some(
                v =>
                    v.item_variant_item_color_fk?.itemColorId === colorObj?.itemColorId &&
                    v.item_variant_item_size_fk?.itemSizeId === selectedSize.itemSizeId
            );
            if (!exist) setSelectedSize(undefined);
        }

        // Tìm variant khớp giữa color + size (nếu có)
        if (selectedSize && colorObj) {
            const found = variants.find(
                v =>
                    v.item_variant_item_color_fk?.itemColorId === colorObj.itemColorId &&
                    v.item_variant_item_size_fk?.itemSizeId === selectedSize.itemSizeId
            );
            setSelectedVariant(found);
        } else {
            // Nếu chưa chọn đủ thì reset variant
            setSelectedVariant(undefined);
        }
    };

    const handleSelectSize = (sizeId: string) => {
        const sizeObj = uniqueSizes.find(s => s.itemSizeId === Number(sizeId));
        setSelectedSize(sizeObj);

        // Nếu đã chọn màu mà màu đó không tồn tại với size này → reset
        if (selectedColor) {
            const exist = variants.some(
                v =>
                    v.item_variant_item_color_fk?.itemColorId === selectedColor.itemColorId &&
                    v.item_variant_item_size_fk?.itemSizeId === sizeObj?.itemSizeId
            );
            if (!exist) setSelectedColor(undefined);
        }

        // Tìm variant khớp giữa color + size (nếu có)
        if (selectedColor && sizeObj) {
            const found = variants.find(
                v =>
                    v.item_variant_item_color_fk?.itemColorId === selectedColor.itemColorId &&
                    v.item_variant_item_size_fk?.itemSizeId === sizeObj.itemSizeId
            );
            setSelectedVariant(found);
        } else {
            // Nếu chưa chọn đủ thì reset variant
            setSelectedVariant(undefined);
        }
    };

    useEffect(() => {
        console.log("loanhtm Selected Color:", selectedColor);
        console.log("loanhtm Selected Size:", selectedSize);
        console.log("loanhtm Selected Variant:", selectedVariant);
    }, [selectedColor, selectedSize, selectedVariant]);

    const addToCart = () => {
        // Tìm xem sản phẩm đã có trong giỏ chưa (dựa vào id)
        const existingIndex = cart.findIndex(item => item.product.itemId === product.itemId)
        if (!selectedVariant) throw new Error("Vui lòng chọn size")
        if (existingIndex !== -1) {
            // Nếu đã có, tăng count
            const newCart = [...cart];
            newCart[existingIndex] = {
                ...newCart[existingIndex],
                count: newCart[existingIndex].count + 1
            }; setCart(newCart); save(newCart)
        } else {
            // Nếu chưa có, thêm mới vào giỏ
            const temp = [...cart, {
                product: product,
                variants: selectedVariant,
                count: 1
            }]

            setCart(temp)
            save(temp)
        }
    }

    const handleAddToCart = () => {
        try {
            addToCart()
            toast.success("Thêm thành công")
        } catch (err: any) { toast.error(err.message) }
    }

    const orderNow = () => {
        try {
            if (!selectedVariant) throw new Error("Vui lòng chọn size");
            if (!selectedColor) throw new Error("Vui lòng chọn màu")
            const temp = {
                product: product,
                variants: selectedVariant,
                quantity: 1
            }
            // addToCart()
            setOrder(temp);
            router.push(`/dat-hang?product=${product.itemId}&&variant=${selectedVariant.itemId}`)
        } catch (err: any) { toast.error(err.message) }
    }

    return <div className="!sticky !bottom-0 flex py-2 items-center flex-col lg:flex-row space-x-0 space-y-4 lg:space-y-0 lg:space-x-2">
        {/* Bộ select size sử dụng shadcn */}

        {/* Select Size */}
        <div className="lg:w-44 w-full">
            <Select
                value={selectedSize ? String(selectedSize.itemSizeId) : ''}
                onValueChange={handleSelectSize}
            >
                <SelectTrigger className="w-full bg-white rounded-none">
                    <SelectValue placeholder="Chọn size" className="text-black" />
                </SelectTrigger>
                <SelectContent>
                    {filteredSizes.map(size => (
                        <SelectItem key={size.itemSizeId} value={String(size.itemSizeId)}>
                            {size.name} - {size.gender}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Select Màu */}
        <div className="lg:w-44 w-full">
            <Select
                value={selectedColor ? String(selectedColor.itemColorId) : ""}
                onValueChange={handleSelectColor}
            >
                <SelectTrigger className="w-full bg-white rounded-none">
                    <SelectValue placeholder="Chọn màu" className="text-black" />
                </SelectTrigger>
                <SelectContent>
                    {filteredColors.map(color => (
                        <SelectItem key={color.itemColorId} value={String(color.itemColorId)}>
                            {color?.name || ''}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="lg:space-x-2 flex flex-col lg:flex-row w-full">
            <button onClick={handleAddToCart} className="cursor-pointer w-full bg-white px-6 py-1.5 text-black font-medium">
                Thêm vào giỏ hàng
            </button>

            <button onClick={orderNow} className="cursor-pointer w-full flex-grow bg-ezman-red px-6 py-1.5 text-white font-medium">
                Mua ngay - {selectedVariant ? Number(selectedVariant?.price || 0).toLocaleString() : 0}đ
            </button>
        </div>
    </div>
};
export default ProductTool