import { IoHelp, IoEarthOutline, IoStarOutline } from "react-icons/io5";
import Link from "next/link";
import { LabelWithIcon } from "../common/label-icon";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CartContainer from "./cart/cart.container";
import SearchBar from "./layout.search";
import AuthForm from "./layout.auth-form";
import OtherContainer from "./other/other.container";

function LayoutHeader() {

    return <div className="sticky border-b lg:border-none border-ezman-red z-10 top-0 bg-ezman-bg layout-header-wrapper">
        <div className="flex p-4 lg:p-12 w-full justify-between">

            <div className="flex gap-2 lg:gap-0 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="block lg:hidden border border-ezman-red">
                        <button className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-ezman-red" aria-label="Mở menu">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black">
                        <DropdownMenuItem asChild>
                            <Link href="/danh-muc/giay-sneaker" className="block px-4 py-3 text-white hover:bg-ezman-red">Giày sneaker</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/danh-muc/giay-danh-pick" className="block px-4 py-3 text-white hover:bg-ezman-red">Giày đánh pick</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/danh-muc/giay-the-thao" className="block px-4 py-3 text-white hover:bg-ezman-red">Giày thể thao</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/danh-muc/ma-hottrend" className="block px-4 py-3 text-white hover:bg-ezman-red">Mã hot trend</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/danh-muc/quan-ao" className="block px-4 py-3 text-white hover:bg-ezman-red">Quần áo</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/danh-muc/phu-kien" className="block px-4 py-3 text-white hover:bg-ezman-red">Phụ kiện</Link>
                        </DropdownMenuItem>

                        <div className="px-4 py-3">
                            <OtherContainer />
                        </div>


                    </DropdownMenuContent>
                </DropdownMenu>

                <Link href={"/"}><p className="text-5xl text-ezman-red font-extrabold font-ezman">EZM</p></Link>
            </div>
            <div className="mobile-menu-bar flex justify-end items-center gap-6 lg:hidden">

                <div className="flex flex-col items-center">
                    <SearchBar />
                    <span className="text-gray-400 text-xs">Tìm kiếm</span>
                </div>

                <div className="flex flex-col items-center">
                    <CartContainer />
                    <span className="text-gray-400 text-xs">Giỏ hàng</span>
                </div>

                <div className="flex flex-col items-center">
                <AuthForm />
                    <span className="text-gray-400 text-xs">Cá nhân</span>
                </div>

            </div>
            <div className="hidden lg:flex flex-col space-y-4">
                <div className="top-bar text-white justify-end flex gap-6">

                    <LabelWithIcon className="cursor-pointer" icon={<IoEarthOutline />}>
                        Đặt hàng quốc tế
                    </LabelWithIcon>

                    <LabelWithIcon className="cursor-pointer text-red-400" icon={<IoStarOutline />}>
                        Khám phá
                    </LabelWithIcon>

                    <CartContainer />

                    <AuthForm />

                </div>

                <div className="text-sm mt-3 bot-bar text-white flex justify-end gap-4">
                    <SearchBar />
                    <Link href="/danh-muc/giay-sneaker" className='flex gap-1 items-center'>
                        <span>Giày sneaker</span>
                    </Link>
                    <Link href="/tim-kiem?query=giay-the-thao" className='flex gap-1 items-center'>
                        <span>Giày thể thao</span>
                    </Link>
                    <Link href="/danh-muc/quan-ao" className='flex gap-1 items-center'>
                        <span>Quần áo</span>
                    </Link>
                    <Link href="/danh-muc/phu-kien" className='flex gap-1 items-center'>
                        <span>Phụ kiện</span>
                    </Link>
                    <Link href="/tim-kiem?query=ma-hottrend" className='flex gap-1 items-center'>
                        <span>Mã hottrend</span>
                    </Link>
                    <Link href="/tim-kiem?query=giay-danh-pick" className='flex gap-1 items-center'>
                        <span>Giày đánh pick</span>
                    </Link>
                    <OtherContainer />
                </div>

            </div>
        </div>

    </div>
}

export default LayoutHeader