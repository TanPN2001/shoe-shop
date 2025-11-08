"use client"
import { useAtom } from "jotai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CART, ORDER } from "@/services/service.atom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { save } from "@/services/service.storage";
import './product.tool.css';
import AuthFormLogin from "../layout/auth-form/auth-form.login";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LabelWithIcon } from "../common/label-icon";
import AuthFormRegister from "../layout/auth-form/auth-form.register";
import { IoPersonOutline } from "react-icons/io5";

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
    const [openLogin, setOpenLogin] = useState(false);

    useEffect(() => {
        const savedOrder = localStorage.getItem("order");
        if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
        }
    }, []);

    useEffect(() => {
        const redirectAction = localStorage.getItem("redirectAfterLogin");
        if (redirectAction) {
            const { type, productId, slug, variantId } = JSON.parse(redirectAction);
            if (type === "buyNow") {
                localStorage.removeItem("redirectAfterLogin");
                router.push(`/dat-hang?productId=${productId}&product=${slug}&variant=${variantId}`);
            }
        }
    }, []);


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
            setSelectedVariant(undefined);
        }
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
            if (!selectedVariant) throw new Error("Vui lòng chọn size");
            if (!selectedColor) throw new Error("Vui lòng chọn màu");

            const token = localStorage.getItem("ezman-token");
            const temp = { product, variants: selectedVariant, quantity: 1 };

            setOrder(temp);
            localStorage.setItem("order", JSON.stringify(temp));

            if (!token) {
                localStorage.setItem(
                    "redirectAfterLogin",
                    JSON.stringify({
                        type: "buyNow",
                        productId: product.itemId,
                        slug: product.slug,
                        variantId: selectedVariant.itemVariantId,
                    })
                );
                setOpenLogin(true);
                return;
            }

            router.push(`/dat-hang?productId=${product.itemId}&product=${product.slug}&variant=${selectedVariant.itemVariantId}`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };


    return <div className="!sticky !bottom-0 flex py-2 items-center flex-col lg:flex-row space-x-0 space-y-4 lg:space-y-0 lg:space-x-2">
        {/* Bộ select size sử dụng shadcn */}

        {/* Select Size */}
        <div className="lg:w-44 w-full" translate="no">
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
                            {/* {size.name} - {size.gender} */}
                            {size.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Select Màu */}
        <div className="lg:w-44 w-full" translate="no">
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

        {openLogin && (
            <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                <DialogTrigger>
                    <LabelWithIcon className="cursor-pointer text-white" icon={<IoPersonOutline className="text-[24px] lg:text-base" />}>
                        <span className="lg:flex hidden">Đăng nhập</span>
                    </LabelWithIcon>
                </DialogTrigger>
                <DialogContent>
                    <Tabs defaultValue="login" className="">
                        <TabsList>
                            <TabsTrigger value="login" className="cursor-pointer custom-tab-trigger text-lg">Đăng nhập</TabsTrigger>
                            <TabsTrigger value="register" className="cursor-pointer custom-tab-trigger text-lg">Đăng ký</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="w-full">
                            <AuthFormLogin setOpen={setOpenLogin} />
                        </TabsContent>
                        <TabsContent value="register">
                            <AuthFormRegister setOpen={setOpenLogin} />
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        )}
    </div>
};
export default ProductTool