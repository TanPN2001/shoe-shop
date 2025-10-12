import { useState } from "react"
import { Button, Card, Form, Input, Typography, message } from "antd"
import { useAtom } from "jotai"
import { AUTH } from "../store"
import { useNavigate } from "react-router-dom"

function LoginPage() {
    const [_auth, setAuth] = useAtom(AUTH)
    const [buzz, context] = message.useMessage()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            // simple static login: accept any non-empty username/password
            if (!values.username || !values.password) {
                buzz.error("Vui lòng nhập đầy đủ thông tin")
                return
            }

            if (values.username !== "ezadmin") {
                buzz.error("Sai tài khoản hoặc mật khẩu")
                return
            }

            if (values.password !== "Tu1den10") {
                buzz.error("Vui lòng nhập đầy đủ thông tin")
                return
            }

            const next = { isAuthenticated: true }
            setAuth(next)
            localStorage.setItem("auth", JSON.stringify(next))
            buzz.success("Đăng nhập thành công")
            nav("/products")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {context}
            <Card style={{ width: 360 }}>
                <Typography.Title level={4} style={{ textAlign: "center" }}>Đăng nhập</Typography.Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="username" label="Tài khoản" rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}>
                        <Input placeholder="Nhập tài khoản" />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>Đăng nhập</Button>
                </Form>
            </Card>
        </div>
    )
}

export default LoginPage


