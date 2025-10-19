"use client"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LabelWithIcon } from "../common/label-icon";
import { IoPersonOutline } from "react-icons/io5";
import { userService } from "@/services/service.api";
import { useEffect, useState } from "react";
import AuthFormRegister from "./auth-form/auth-form.register";
import { useAtom } from "jotai";
import { USER_DETAIL } from "@/services/service.atom";
import AuthFormLogin from "./auth-form/auth-form.login";
import Link from "next/link";
import { CiUser, CiMap, CiLogout, CiCircleList } from "react-icons/ci";

function AuthForm() {
    const [userDetail, setUserDetail] = useAtom(USER_DETAIL)
    const [open, setOpen] = useState(false)

    const load = async () => {
        const { data: res } = await userService.get("/user/profile")
        setUserDetail(res.data)
    }

    useEffect(() => {

        if (!userDetail) {
            load()
        }

    }, [userDetail])

    const logout = () => {
        setUserDetail(null)
        localStorage.removeItem("ezman-token")
    }

    return userDetail ? <DropdownMenu>
        <DropdownMenuTrigger className="text-white">

            <div>
                {/* Hiển thị avatar chữ cái đầu trên màn hình nhỏ, tên đầy đủ trên màn hình lớn */}
                <div className="flex lg:hidden ml-2 w-6 h-6 bg-ezman-red text-center items-center justify-center rounded-full">
                    <span className="text-white text-sm font-bold">{userDetail.fullname[0]}</span>
                </div>
                <div className="hidden lg:block">
                    <span>{userDetail.fullname}</span>
                </div>
            </div>

        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>
                <div>
                    <p className="text-lg text-ezman-red font-ezman">{userDetail.fullname}</p>
                    <p className="text-black">👤 {userDetail.username}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer"><CiUser /> Thông tin cá nhân</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer"><CiMap /> Địa chỉ giao hàng</Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
                <Link href="/my-orders" className="cursor-pointer"><CiCircleList /> Danh sách đơn hàng</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
                <CiLogout /> Đăng xuất
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu> : <Dialog open={open} onOpenChange={setOpen}>
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
                    <AuthFormLogin setOpen={setOpen} />
                </TabsContent>
                <TabsContent value="register">
                    <AuthFormRegister setOpen={setOpen} />
                </TabsContent>
            </Tabs>
        </DialogContent>
    </Dialog>
}; export default AuthForm