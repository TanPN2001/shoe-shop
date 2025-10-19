function Page() {
    return <div className="px-4 lg:px-12">
        <div className="text-white flex items-center gap-2 mb-6">
            <p className="text-lg text-ezman-red font-bold font-ezman">EZMAN</p>
            <p> / </p>
            <p className="font-semibold">Giới thiệu</p>
        </div>

        <div className="text-white pt-12">
            <p className="text-4xl uppercase pb-6 text-ezman-red">Về chúng tôi</p>
        </div>

        <div className="p-0 mt-8 w-full max-w-none bg-transparent text-white">
            <div className="px-0 lg:px-0">
                <p className="mb-4">
                    EZMAN cam kết bảo vệ thông tin cá nhân của khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi truy cập và sử dụng website của chúng tôi.
                </p>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">1. Thu thập thông tin cá nhân</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Chúng tôi thu thập các thông tin như họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng khi bạn đăng ký tài khoản hoặc đặt hàng.</li>
                    <li>Thông tin thanh toán sẽ được bảo mật và không lưu trữ trên hệ thống của chúng tôi.</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">2. Mục đích sử dụng thông tin</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Xử lý đơn hàng, giao hàng và hỗ trợ khách hàng.</li>
                    <li>Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.</li>
                    <li>Gửi thông báo về các chương trình khuyến mãi, cập nhật mới (nếu bạn đồng ý nhận).</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">3. Bảo mật thông tin</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân khỏi truy cập, sử dụng hoặc tiết lộ trái phép.</li>
                    <li>Chỉ những nhân viên có thẩm quyền mới được phép truy cập thông tin cá nhân của bạn.</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">4. Chia sẻ thông tin</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba, trừ khi được sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">5. Quyền của khách hàng</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Bạn có quyền kiểm tra, cập nhật, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất cứ lúc nào.</li>
                    <li>Liên hệ với chúng tôi qua email hoặc số điện thoại trên website để được hỗ trợ.</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">6. Thay đổi chính sách</h3>
                <p className="mb-4">
                    Chính sách bảo mật có thể được cập nhật để phù hợp với các thay đổi về pháp luật hoặc dịch vụ. Mọi thay đổi sẽ được thông báo trên website.
                </p>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">7. Liên hệ</h3>
                <p>
                    Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:hungnguyen079079@gmail.com" className="text-ezman-red underline">Hungnguyen079079@gmail.com</a> hoặc số điện thoại trên website.
                </p>
            </div>
        </div>
    </div>
} export default Page