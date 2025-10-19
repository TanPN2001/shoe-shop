"use client"
import { MdOutlineSupportAgent } from "react-icons/md";

function LayoutSupport() {
    return <div className="fixed flex flex-col items-center justify-center bottom-44 lg:bottom-16 right-2 z-50 text-white">
        <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" className="cursor-pointer w-12 h-12 rounded-full bg-ezman-red flex items-center justify-center">
            <MdOutlineSupportAgent className="text-3xl" />
        </a>
        <span className="text-sm">Hỗ trợ 24/7</span>
    </div>
} export default LayoutSupport