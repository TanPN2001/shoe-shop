"use client"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer"
import Link from "next/link";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { IoSearch, IoArrowForwardCircleOutline } from "react-icons/io5";

const hotKeys = [
    { key: "giay-the-thao", label: "Giày thể thao" },
    { key: "giay-danh-pick", label: "Giày đánh pick" },
    { key: "quan-ao", label: "Quần áo" },
    { key: "phu-kien", label: "Phụ kiện" },
]

function SearchBar() {

    const [text, setText] = useState("")

    const onSearch: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        // Chuyển hướng đến trang tìm kiếm với từ khóa
        if (text.trim()) {
            window.location.href = `/tim-kiem?query=${encodeURIComponent(text.trim())}`;
        }
    }

    const textChanging: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        const { value } = target
        setText(value)
    }

    return <Drawer direction="top">
        <DrawerTrigger asChild>
            <div className='cursor-pointer flex p-0 lg:p-2 rounded text-white gap-1 items-center'>
                <IoSearch className="text-[24px] lg:text-base" /> <span className="hidden lg:flex">Tìm kiếm</span>
            </div>
        </DrawerTrigger>
        <DrawerContent style={{ margin: 0, padding: 0, borderRadius: 0 }}>
            <div className="p-4 lg:p-12">
                <p className="text-3xl lg:text-6xl text-ezman-red font-extrabold font-ezman">EZM</p>

                <form onSubmit={onSearch} className="flex items-center border-b-2 border-gray-300 py-3 px-2 space-x-2">
                    <IoSearch className="text-2xl text-gray-400" />
                    <input onChange={textChanging} type="text" className="w-full text-black text-xl border-none outline-none placeholder:font-semibold placeholder:text-xl" placeholder="NHẬP TÊN, LOẠI, NHÃN HIỆU, ..." />
                    <button type="submit"><IoArrowForwardCircleOutline className="text-3xl text-gray-400" /></button>
                </form>

                <div className="mt-6">
                    <p className="text-lg font-semibold mb-2 text-gray-700">Từ khóa phổ biến:</p>
                    <div className="flex flex-wrap gap-2">
                        {hotKeys.map((item) => (
                            <DrawerClose asChild key={item.key}>
                                <Link
                                    href={`/tim-kiem?query=${item.key}`}
                                    type="button"
                                    className="px-3 py-1 rounded-full bg-gray-200 hover:bg-ezman-red hover:text-white text-gray-700 font-medium transition-colors"
                                >
                                    {item.label}
                                </Link>
                            </DrawerClose>
                        ))}
                    </div>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
}; export default SearchBar