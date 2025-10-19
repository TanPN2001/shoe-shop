function Page() {
    return <div className="px-4 lg:px-12">
        <div className="text-white flex items-center gap-2 mb-6">
            <p className="text-lg text-ezman-red font-bold font-ezman">EZMAN</p>
            <p> / </p>
            <p className="font-semibold">Chính sách bảo hành</p>
        </div>

        <div className="text-white pt-12">
            <p className="text-4xl uppercase pb-6 text-ezman-red">Chính sách bảo hành</p>
        </div>

        <div className="p-0 mt-8 w-full max-w-none bg-transparent text-white">
            <div className="px-0 lg:px-0">

                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">Điều kiện đổi sản phẩm EZMAN:</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Chưa qua sử dụng</li>
                    <li>Đầy đủ nhãn mác</li>
                    <li>Hỗ trợ đổi size đổi lỗi trong vòng 7 ngày.</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-ezman-red">Bảo hành tại EZMAN:</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>Bảo hành keo 6 tháng tại shop</li>
                    <li>Cam kết chất lượng bán ra chuẩn như lúc thoả thuận bán hàng.</li>
                    <li>Không áp dụng bảo hành: với các lỗi phát sinh do quá trình sử dụng hoặc bảo quản không đúng cách (Ví dụ: da/vải bị rách, bong tróc, phai màu do tác động bên ngoài).</li>
                </ul>

                <p>
                    Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo hành, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:hungnguyen079079@gmail.com" className="text-ezman-red underline">Hungnguyen079079@gmail.com</a> hoặc số điện thoại trên website.
                </p>
            </div>
        </div>
    </div>
} export default Page