import api from "@/services/service.api"
import { toast } from "sonner"
import { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from "react"
import { useSetAtom } from "jotai"
import { USER_DETAIL } from "@/services/service.atom"

type Props = { setOpen: Dispatch<SetStateAction<boolean>> }

function AuthFormLogin({ setOpen }: Props) {
    const [form, setForm] = useState({ username: "", password: "" })
    const setUserDetail = useSetAtom(USER_DETAIL)

    const submit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        try {
            if (!form.username || form.username.trim() === "") {
                throw new Error("Tên đăng nhập không được để trống");
            }
            if (!form.password || form.password.trim() === "") {
                throw new Error("Mật khẩu không được để trống");
            }
            const { data } = await api.post("/auth/login", form)
            setUserDetail(data.data.detail)
            localStorage.setItem("ezman-token", data.data.token)
            toast.success("Đăng ký thành công", { position: "top-center" })
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
            <label htmlFor="login-username" className="text-sm font-medium">
                Tên đăng nhập
            </label>
            <input
                id="login-username"
                name="username"
                type="text"
                onChange={formChanging}
                autoComplete="username"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ezman-red"
                placeholder="Nhập tên đăng nhập"
            />
        </div>
        <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-sm font-medium">
                Mật khẩu
            </label>
            <input
                id="login-password"
                name="password"
                type="password"
                onChange={formChanging}
                autoComplete="current-password"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ezman-red"
                placeholder="Nhập mật khẩu"
            />
        </div>
        <button
            type="submit"
            className="bg-ezman-red text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-red-600 transition-colors"
        >
            Đăng nhập
        </button>
    </form>
}; export default AuthFormLogin