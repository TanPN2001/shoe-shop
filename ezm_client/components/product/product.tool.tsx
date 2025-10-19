"use client"
import { useAtom } from "jotai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CART } from "@/services/service.atom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { save } from "@/services/service.storage";

type Props = {
    product: ProductDocument
    variants: VariantDocument[]
}

function ProductTool({ product, variants }: Props) {

    const [cart, setCart] = useAtom(CART)
    const [selectedVariant, setSelectedVariant] = useState<VariantDocument | undefined>(undefined)
    const router = useRouter()

    const onSelectingVariant = (value: string) => {
        const variantId = Number(value)
        const foundVariant = variants.find(variant => variant.itemVariantId === variantId);
        setSelectedVariant(foundVariant);
    }

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
            addToCart()
            router.push("/dat-hang")
        } catch (err: any) { toast.error(err.message) }
    }

    return <div className="!sticky !bottom-0 flex py-2 items-center flex-col lg:flex-row space-x-0 space-y-4 lg:space-y-0 lg:space-x-2">
        {/* Bộ select size sử dụng shadcn */}
        <div className="lg:w-44 w-full">
            <Select onValueChange={onSelectingVariant}>
                <SelectTrigger className="w-full bg-white rounded-none">
                    <SelectValue placeholder="Chọn size" />
                </SelectTrigger>
                <SelectContent>
                    {variants.map(item => <SelectItem key={item.itemVariantId} disabled={item.quantity === 0} value={String(item.itemVariantId)}>
                        {item.item_variant_item_size_fk.gender}, {item.item_variant_item_color_fk.name}, {item.item_variant_item_size_fk.name} - (Còn {item.quantity} cái)
                    </SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <div className="lg:space-x-2 flex flex-col lg:flex-row w-full">
            <button onClick={handleAddToCart} className="cursor-pointer w-full bg-white px-6 py-1.5 text-black font-medium">
                Thêm vào giỏ hàng
            </button>

            <button onClick={orderNow} className="cursor-pointer w-full flex-grow bg-ezman-red px-6 py-1.5 text-white font-medium">
                Mua ngay - {selectedVariant ? Number(selectedVariant.price).toLocaleString() : 0}đ
            </button>
        </div>
    </div>
}; export default ProductTool