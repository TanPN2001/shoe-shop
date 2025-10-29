import api from "@/services/service.api"
import { toast } from "sonner"
import { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from "react"
import { useSetAtom } from "jotai"
import { USER_DETAIL } from "@/services/service.atom"

type Props = { setOpen: Dispatch<SetStateAction<boolean>> }

function AuthFormRegister({ setOpen }: Props) {
    const setUserDetail = useSetAtom(USER_DETAIL)
    const [form, setForm] = useState({
        username: "",
        fullname: "",
        phone: "",
        password: ""
    })

    const submit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        try {
            if (!form.username || form.username.trim() === "") {
                throw new Error("Tên đăng nhập không được để trống");
            }
            if (!form.fullname || form.fullname.trim() === "") {
                throw new Error("Họ và tên không được để trống");
            }
            if (!form.phone || form.phone.trim() === "") {
                throw new Error("Số điện thoại không được để trống");
            }
            if (!/^\d{9,11}$/.test(form.phone.trim())) {
                throw new Error("Số điện thoại không hợp lệ");
            }
            if (!form.password || form.password.trim() === "") {
                throw new Error("Mật khẩu không được để trống");
            }
            const { data } = await api.post("/auth/register", form)
            setUserDetail(data.data.detail)
            localStorage.setItem("ezman-token", data.data.token)
            toast.success("Đăng nhập thành công", { position: "top-center" })
            setOpen(false)
        } catch (err: any) {
            console.log(err)
            toast.error(err?.response?.data?.message ?? err.message, { position: "top-center" })
        }
    }

    const formChanging: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        const { name, value } = target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    return <form onSubmit={submit} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
            <label htmlFor="register-username" className="text-sm font-medium">
                Tên đăng nhập
            </label>
            <input
                id="register-username"
                name="username"
                type="text"
                onChange={formChanging}
                autoComplete="username"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ezman-red"
                placeholder="Nhập tên đăng nhập"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="register-fullname" className="text-sm font-medium">
                Họ và tên
            </label>
            <input
                id="register-fullname"
                name="fullname"
                type="text"
                onChange={formChanging}
                autoComplete="name"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ezman-red"
                placeholder="Nhập họ và tên"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="register-phone" className="text-sm font-medium">
                Số điện thoại
            </label>
            <input
                id="register-phone"
                name="phone"
                type="tel"
                onChange={formChanging}
                autoComplete="tel"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ezman-red"
                placeholder="Nhập số điện thoại"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="register-password" className="text-sm font-medium">
                Mật khẩu
            </label>
            <input
                id="register-password"
                name="password"
                type="password"
                onChange={formChanging}
                autoComplete="new-password"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ezman-red"
                placeholder="Nhập mật khẩu"
            />
        </div>
        <button
            type="submit"
            className="bg-ezman-red text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-red-600 transition-colors"
        >
            Đăng ký
        </button>
    </form>
}; export default AuthFormRegister