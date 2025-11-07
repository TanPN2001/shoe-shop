function LayoutFooter() {
	return (
		<footer className="bg-[#252525] text-gray-300 py-6 !mt-12">
			<div className="px-4 lg:px-12 mx-auto !pb-6 flex flex-col md:flex-row justify-between items-start gap-8">
				<div>
					<h2 className="text-2xl font-bold font-ezman text-red-500 mb-2">
						Ezman Sneaker
					</h2>
					<p className="text-sm mb-2">
						Địa chỉ: Số 95 Nguyễn Văn Cừ , Vinh, Vietnam
					</p>
					<p className="text-sm mb-2">
						Hotline cskh:{' '}
						<a
							href="tel:+84368371383"
							className="text-red-400 hover:underline"
						>
							036 837 1383
						</a>
					</p>
					<p className="text-sm mb-2">
						Hotline khiếu nại:{' '}
						<a
							href="tel:+84334565538"
							className="text-red-400 hover:underline"
						>
							033 456 5538
						</a>
					</p>
					<p className="text-sm">
						Email:{' '}
						<a
							href="mailto:hungnguyen079079@gmail.com"
							className="text-red-400 hover:underline"
						>
							Hungnguyen079079@gmail.com
						</a>
					</p>
				</div>
				<div>
					<h3 className="text-lg font-semibold mb-2">Về chúng tôi</h3>
					<ul className="space-y-1">
						<li>
							<a
								href="/bai-viet/chinh-sach-bao-hanh"
								className="hover:text-red-400"
							>
								Chính sách bảo hành
							</a>
						</li>
						<li>
							<a
								href="/bai-viet/chinh-sach-bao-mat"
								className="hover:text-red-400"
							>
								Chính sách bảo mật
							</a>
						</li>
						<li>
							<a
								href="/bai-viet/huong-dan-mua-hang"
								className="hover:text-red-400"
							>
								Hướng dẫn mua hàng
							</a>
						</li>
						<li>
							<a
								href="#"
								className="hover:text-red-400"
							>
								Liên hệ
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="text-lg font-semibold mb-2">Kết nối với chúng tôi</h3>
					<div className="flex gap-4">
						<a
							target="_blank"
							href={process.env.NEXT_PUBLIC_FACEBOOK}
							className="hover:text-red-400"
							aria-label="Facebook"
						>
							<svg
								className="w-6 h-6 fill-current"
								viewBox="0 0 24 24"
							>
								<path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
							</svg>
						</a>
						<a
							href={process.env.NEXT_PUBLIC_INSTAGRAM}
							className="hover:text-red-400"
							aria-label="Instagram"
						>
							<svg
								className="w-6 h-6 fill-current"
								viewBox="0 0 24 24"
							>
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.212 2.092-1.271 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.291 2.393 1.271 3.373.98.98 2.092 1.212 3.373 1.271C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.291 3.373-1.271.98-.98 1.212-2.092 1.271-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.291-2.393-1.271-3.373-.98-.98-2.092-1.212-3.373-1.271C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
							</svg>
						</a>
						<a
							href={process.env.NEXT_PUBLIC_TIKTOK}
							className="hover:text-red-400"
							aria-label="YouTube"
						>
							<svg
								className="w-6 h-6 fill-current"
								viewBox="0 0 24 24"
							>
								<path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
							</svg>
						</a>
					</div>
				</div>
			</div>
			<div className="border-t !pt-5 border-gray-700 flex items-center justify-center text-xs text-gray-500">
				<span>
					© {new Date().getFullYear()} Ezman Sneaker. All rights reserved.
				</span>
			</div>
		</footer>
	);
}
export default LayoutFooter;
