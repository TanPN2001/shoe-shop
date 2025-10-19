"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { useEffect, useState } from "react"
import api from "@/services/service.api"

type Size = {
    itemSizeId: number
    gender: string
    name: string
    size: string
}

function CategoryFilter() {
    // State cho sắp xếp và lọc kích cỡ
    const [sort, setSort] = useState<string>("newest")
    const [selectedSize, setSelectedSize] = useState<Size | undefined>()
    const [sizes, setSizes] = useState<Size[]>([])
    const [priceRange, setPriceRange] = useState([0, 20000000])

    useEffect(() => {

        api.get("/item-size/get").then(res => {
            setSizes(res.data.data)
        })

    }, [])

    const handlePickSize = (size: Size) => {
        setSelectedSize(size)
    }

    // Làm mới bộ lọc
    const handleReset = () => {
        setSort("newest")
        setSelectedSize(undefined)
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href)
            url.searchParams.delete("sort")
            url.searchParams.delete("sizes")
            url.searchParams.delete("priceMax")
            url.searchParams.delete("priceMin")
            window.location.href = url.pathname // reload lại trang không query
        }
    }

    // Áp dụng bộ lọc
    const handleSubmitFilter = () => {
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href)
            url.searchParams.set("sort", sort)

            if (selectedSize) {
                url.searchParams.set("itemSizeId", String(selectedSize.itemSizeId))
            } else {
                url.searchParams.delete("sizes")
            }

            if (priceRange[0] !== 0) {
                url.searchParams.set("priceMin", String(priceRange[0]))
            }

            if (priceRange[1] !== 0) {
                url.searchParams.set("priceMax", String(priceRange[1]))
            }

            window.location.href = url.toString()
        }
    }

    const onPriceChange = ([min, max]: [number, number]) => {
        setPriceRange([min, max])
    }

    return (
        <div className="px-4 h-full flex flex-col">
            <div className="flex-grow">
                {/* sắp xếp */}
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full border-ezman-red rounded-none">
                        <SelectValue placeholder="MỚI NHẤT" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest" className="uppercase">Mới nhất</SelectItem>
                        <SelectItem value="oldest" className="uppercase">Cũ nhất</SelectItem>
                        <SelectItem value="to_cheap" className="uppercase">Giá từ cao đến thấp</SelectItem>
                        <SelectItem value="to_expensive" className="uppercase">Giá từ thấp đến cao</SelectItem>
                    </SelectContent>
                </Select>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>KÍCH CỠ</AccordionTrigger>
                        <AccordionContent>
                            {/* lọc theo kích cỡ */}
                            <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                                {sizes.map(item => (
                                    <button
                                        key={"size_id:" + item.itemSizeId}
                                        type="button"
                                        className={`cursor-pointer text-sm font-medium rounded py-1`}
                                        style={{ border: "1px solid", borderColor: selectedSize?.itemSizeId === item.itemSizeId ? "red" : "gray" }}
                                        onClick={() => handlePickSize(item)}
                                    >
                                        {item.name} ({item.gender})
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>

            <div className="my-6 space-y-2">
                <p className="block mb-2 text-sm font-medium text-black">Khoảng giá (VNĐ)</p>
                <p className="text-gray-500 text-sm">{priceRange[0].toLocaleString()} đ - {priceRange[1].toLocaleString()} đ</p>
                <Slider
                    min={0}
                    max={20000000}
                    step={100000}
                    defaultValue={[priceRange[0], priceRange[1]]}
                    onValueChange={onPriceChange}
                    className="bg-red-500/30 h-2 rounded-full" // custom background color and height
                />

            </div>

            <div className="flex flex-col lg:flex-row justify-between space-x-4 pb-4">
                <button
                    className="cursor-pointer w-full border border-gray-500 px-10 py-2 text-base font-medium"
                    onClick={handleReset}
                    type="button"
                >
                    Làm mới
                </button>
                <button
                    onClick={handleSubmitFilter}
                    className="cursor-pointer w-full bg-ezman-red px-10 py-2 text-base font-medium text-white"
                    type="button"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    )
}
export default CategoryFilter