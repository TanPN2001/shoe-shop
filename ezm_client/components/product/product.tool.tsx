"use client"
import { useAtom } from "jotai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CART, ORDER } from "@/services/service.atom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { save } from "@/services/service.storage";

type Props = {
    product: ProductDocument
    variants: VariantDocument[]
}

function ProductTool({ product, variants }: Props) {

    const [cart, setCart] = useAtom(CART);
    const [order, setOrder] = useAtom(ORDER);
    const [selectedVariant, setSelectedVariant] = useState<VariantDocument | undefined>(undefined);
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<string | undefined>();
    const [selectedSize, setSelectedSize] = useState<string | undefined>();

    const onSelectingVariant = (value: string) => {
        const variantId = Number(value)
        const foundVariant = variants.find(variant => variant.itemVariantId === variantId);
        setSelectedVariant(foundVariant);
    }

    // Lấy danh sách màu và size duy nhất
    const uniqueColors = Array.from(
        new Set(variants.map(v => v.item_variant_item_color_fk?.name).filter(Boolean))
    );
    const uniqueSizes = Array.from(
        new Set(variants.map(v => v.item_variant_item_size_fk?.name).filter(Boolean))
    );

    // Khi người dùng chọn màu hoặc size
    const handleSelectColor = (color: string) => {
        setSelectedColor(color);
        updateVariant(color, selectedSize);
    };

    const handleSelectSize = (size: string) => {
        setSelectedSize(size);
        updateVariant(selectedColor, size);
    };

    // Hàm tìm variant khớp giữa color + size
    const updateVariant = (color?: string, size?: string) => {
        if (!color || !size) {
            setSelectedVariant(undefined);
            return;
        }

        const found = variants.find(
            v =>
                v.item_variant_item_color_fk?.name === color &&
                v.item_variant_item_size_fk?.name === size
        );
        setSelectedVariant(found);
    };


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
            if (!selectedVariant) throw new Error("Vui lòng chọn size")
            const temp = {
                product: product,
                variants: selectedVariant,
                quantity: 1
            }
            // addToCart()
            setOrder(temp);
            router.push(`/dat-hang?product=${product.itemId}&&variant=${selectedVariant}`)
        } catch (err: any) { toast.error(err.message) }
    }

    return <div className="!sticky !bottom-0 flex py-2 items-center flex-col lg:flex-row space-x-0 space-y-4 lg:space-y-0 lg:space-x-2">
        {/* Bộ select size sử dụng shadcn */}
        {/* <div className="lg:w-44 w-full">
            <Select onValueChange={onSelectingVariant}>
                <SelectTrigger className="w-full bg-white rounded-none">
                    <SelectValue placeholder="Chọn size" />
                </SelectTrigger>
                <SelectContent>
                    {variants.map(item => <SelectItem key={item.itemVariantId} disabled={item?.quantity === 0} value={String(item?.itemVariantId)}>
                        {!!item?.item_variant_item_size_fk ? item?.item_variant_item_size_fk?.gender : ''}{!!item?.item_variant_item_color_fk ? `, ${item?.item_variant_item_color_fk?.name}` : ''}{item?.item_variant_item_size_fk ? `, ${item?.item_variant_item_size_fk?.name}` : ''} - (Còn {item?.quantity || 0} cái)
                    </SelectItem>)}
                </SelectContent>
            </Select>
        </div> */}

        {/* Select Màu sắc */}
        <div className="lg:w-44 w-full">
            <Select onValueChange={handleSelectColor}>
                <SelectTrigger className="w-full bg-white rounded-none">
                    <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueColors.map((color) => (
                        <SelectItem key={color} value={color}>
                            {color}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Select Size */}
        <div className="lg:w-44 w-full">
            <Select onValueChange={handleSelectSize}>
                <SelectTrigger className="w-full bg-white rounded-none">
                    <SelectValue placeholder="Chọn size" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                            {size}
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