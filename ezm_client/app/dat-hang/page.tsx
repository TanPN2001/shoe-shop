'use client';
import { useEffect, useState, useCallback, ChangeEventHandler } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import debounce from 'lodash.debounce';
import { CART } from '@/services/service.atom';
import api, { userService } from '@/services/service.api';
import { save } from '@/services/service.storage';
import { useSearchParams } from 'next/navigation';

type OrderForm = {
	name: string;
	phone: string;
	email: string;
	address: string;
	voucherCode: string;
};

type PriceInfo = {
	subtotal: number;
	voucherDiscount: number;
	total: number;
};

function OrderPage() {
	const [cart, setCart] = useAtom(CART);
	const searchParams = useSearchParams();
	const productId = searchParams.get('productId');
	const productParam = searchParams.get('product');
	const variantParam = searchParams.get('variant');

	// const [detail, setDetail] = useState<any>(null);
	// const [variants, setVariants] = useState<any[]>([]);
	const [order, setOrder] = useState<any>(null); // ❗ đổi sang state local

	const [form, setForm] = useState<OrderForm>({
		name: '',
		phone: '',
		email: '',
		address: '',
		voucherCode: '',
	});

	const [priceInfo, setPriceInfo] = useState<PriceInfo>({
		subtotal: 0,
		voucherDiscount: 0,
		total: 0,
	});

	// ===== helper: compute base total =====
	// ===== helper: compute base total =====
	const computeBaseTotal = (overrideItems?: { variantId: number; quantity: number }[]) => {
		let total = 0;

		// ✅ Ưu tiên dữ liệu override
		if (overrideItems && overrideItems.length > 0) {
			overrideItems.forEach((it) => {
				// tìm giá variant
				let price = 0;
				console.log("0 order?.variants: ", order?.variants)
				// Nếu đang ở trang đặt nhanh (có order)
				if (order && order?.variants?.itemVariantId === it.variantId) {
					price = Number(order?.variants?.price || 0);
					console.log("1-- ", price);
				}
				// Nếu có trong giỏ hàng
				else {
					const found = cart.find((c) => c.variants?.itemVariantId === it.variantId);
					if (found) price = Number(found.variants?.price || 0);
					console.log("2-- ", price);
				}

				total += price * Number(it?.quantity || 0);
			});
			console.log("1 ", total);
			return total;
		}

		// ✅ Nếu có param → tính theo sản phẩm trong order
		if (order && productParam && productId && variantParam) {
			console.log("2 total: ", Number(order?.variants?.price || 0) * Number(order?.quantity || 0));
			return Number(order?.variants?.price || 0) * Number(order?.quantity || 0);
		}

		// ✅ Nếu không có param → tính theo giỏ hàng
		if (cart && cart.length > 0) {
			return cart.reduce(
				(acc, item) => acc + Number(item.variants?.price || 0) * Number(item.count || 0),
				0
			);
		}

		return 0;
	};

	// ✅ Luôn gọi API khi có param (kể cả reload)
	useEffect(() => {
		const loader = async (slug: string, productId: string, variantParam: string) => {
			try {
				const [itemRes, variantRes] = await Promise.all([
					api.get(`/item/by-slug/${slug}`),
					api.get(`/item-variant/detail-by-item/${productId}`),
				]);

				const productData = itemRes.data.data;
				const variantsData = variantRes.data.data;

				// setDetail(productData);
				// setVariants(variantsData);

				console.log("variantsData: ", variantsData)

				// Tìm variant khớp
				const selectedVariant = Array.isArray(variantsData)
					? variantsData.find((v) => String(v.itemVariantId) === String(variantParam))
					: null;

				if (productData && selectedVariant) {
					const newOrder = {
						product: productData,
						variants: selectedVariant,
						quantity: 1,
					};
					setOrder(newOrder);
					console.log('✅ Loader set order:', newOrder);
				} else {
					toast.error('Không tìm thấy thông tin sản phẩm hoặc biến thể.');
				}
			} catch (err) {
				console.error('Loader error:', err);
				toast.error('Không thể tải thông tin sản phẩm.');
			}
		};

		if (productParam && productId && variantParam) {
			loader(productParam, productId, variantParam);
		}
	}, [productParam, productId, variantParam]);

	// ====== GỌI API TÍNH GIÁ ======
	const fetchCalculatePrice = async (items: any[], voucherCode?: string, varientOrder?: any[]) => {
		console.log("loanhtm items: ", varientOrder)
		if (!items || items.length === 0) return;
		try {
			const response = await api.post('/order/calculate-price', {
				items,
				voucherCode: voucherCode || '',
			});
			if (response?.data?.status === 0) {
				const data = response.data.data;
				setPriceInfo({
					subtotal: data?.subtotal ?? 0,
					voucherDiscount: data?.voucherDiscount ?? 0,
					total: data?.total ?? 0,
				});
				return;
			} else {
				// toast.error(response?.data?.errors?.message || 'Mã giảm giá không hợp lệ');
				const base = computeBaseTotal(items);
				setPriceInfo({
					subtotal: base,
					voucherDiscount: 0,
					total: base,
				});
				if (form.voucherCode.trim() !== '') {
					console.log("...")
					toast.error(response?.data?.errors?.message || 'Mã giảm giá không hợp lệ');
				}
			}
		} catch (err: any) {
			const base = computeBaseTotal(items);
			setPriceInfo({
				subtotal: base,
				voucherDiscount: 0,
				total: base,
			});
			toast.error(err.message || 'Không thể tính giá đơn hàng');
		}
	};

	const debouncedFetchPrice = useCallback(
		debounce((items: any[], code?: string, varientOrder?: any[]) => {
			fetchCalculatePrice(items, code, varientOrder);
		}, 1000),
		[]
	);

	// ====== Nhập form ======
	const changingForm: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
		const { name, value } = target;
		setForm((prev) => ({ ...prev, [name]: value }));

		if (name === 'voucherCode') {
			let items: any[] = [];

			if (order && productParam && productId && variantParam) {
				items = [{ variantId: order.variants.itemVariantId, quantity: order.quantity }];
			} else {
				items = cart.map((item) => ({ variantId: item.variants.itemVariantId, quantity: item.count }));
			}
			debouncedFetchPrice(items, value);
		}
	};

	useEffect(() => {
		if (order && productParam && productId && variantParam) {
			// Chỉ gọi khi order đã có dữ liệu thật
			const items = [{ variantId: order.variants.itemVariantId, quantity: order.quantity }];
			const varientOrder = [{ varientOrder: order.variants }];
			fetchCalculatePrice(items, form.voucherCode, varientOrder);
		} else if (cart && cart.length > 0) {
			// Giỏ hàng thông thường
			const items = cart.map((item) => ({
				variantId: item.variants.itemVariantId,
				quantity: item.count,
			}));
			const varientOrder = cart.map((item) => ({
				varientOrder: item.variants,
			}));
			fetchCalculatePrice(items, form.voucherCode, varientOrder);
		}
	}, [order, cart]);


	// ====== Đặt hàng ======
	const handleOrder = async () => {
		try {
			let items: any[] = [];

			if (order && productParam && productId && variantParam) {
				items = [{ variantId: order.variants.itemVariantId, quantity: order.quantity }];
			} else {
				items = cart.map((item) => ({ variantId: item.variants.itemVariantId, quantity: item.count }));
			}

			if (items.length === 0) {
				toast.error('Vui lòng chọn thêm sản phẩm để đặt hàng');
				return;
			}

			if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
				toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
				return;
			}

			const response = await userService.post('/order/place-order', {
				items,
				...form,
			});

			if (response?.data?.status !== 0) {
				toast.error(response?.data?.errors?.message || 'Đặt hàng thất bại');
			} else {
				toast.success('Đặt hàng thành công');
				setCart([]);
				save([]);
			}
		} catch (err: any) {
			toast.error(err.message || 'Đặt hàng thất bại');
		}
	};

	// ====== Cộng trừ số lượng ======
	const handleQuantityChange = (type: 'increase' | 'decrease', idx?: number) => {
		if (order && productParam && productId && variantParam) {
			const maxQty = order?.variants?.quantity ?? 1;
			let newQty = order.quantity;

			if (type === 'increase') {
				if (newQty < maxQty) newQty += 1;
				else return toast.warning(`Chỉ còn ${maxQty} sản phẩm`);
			} else {
				newQty = Math.max(1, newQty - 1);
			}

			const newOrder = { ...order, quantity: newQty };
			setOrder(newOrder);

			const items = [{ variantId: newOrder.variants.itemVariantId, quantity: newQty }];
			debouncedFetchPrice(items, form.voucherCode);
		} else {
			const newCart = cart.map((item, i) => {
				if (i === idx) {
					const maxQty = item?.variants?.quantity ?? 1;
					let newCount = item.count;

					if (type === 'increase') {
						if (newCount < maxQty) newCount += 1;
						else {
							toast.warning(`"${item.product.name}" chỉ còn ${maxQty} sản phẩm`);
							return item;
						}
					} else {
						newCount = Math.max(1, newCount - 1);
					}

					return { ...item, count: newCount };
				}
				return item;
			});

			setCart(newCart);
			save(newCart);
			const items = newCart.map((item) => ({
				variantId: item.variants.itemVariantId,
				quantity: item.count,
			}));
			debouncedFetchPrice(items, form.voucherCode);
		}
	};
	console.log("loanhtm order: ", order);

	// ====== RENDER ======
	return (
		<div className="px-4 lg:px-12">
			<div className="text-white flex items-center gap-2">
				<p className="text-lg text-ezman-red font-bold font-ezman">EZMAN</p>
				<p> / </p>
				<p className="font-semibold">Đặt hàng</p>
			</div>

			<div className="mt-6 text-white">
				<p className="font-ezman text-2xl font-medium">Người nhận hàng</p>

				<div className="flex mt-4 space-x-12 flex-col lg:flex-row">
					{/* --- Bên trái: Thông tin người nhận --- */}
					<div className="w-full lg:w-auto">
						<p className="text-xl">Thông tin vận chuyển</p>

						<div className="mt-4 space-y-6">
							<input name="name" onChange={changingForm} type="text" placeholder="Họ tên người nhận" className="w-full bg-white text-black px-4 py-2" />
							<input name="phone" onChange={changingForm} type="text" placeholder="Số điện thoại" className="w-full bg-white text-black px-4 py-2" />
							<input name="address" onChange={changingForm} type="text" placeholder="Địa chỉ cụ thể" className="w-full bg-white text-black px-4 py-2" />
						</div>

						<p className="mt-6 text-xl">Mã giảm giá</p>
						<div className="mt-4 space-y-6">
							<input name="voucherCode" onChange={changingForm} type="text" placeholder="Nhập mã giảm giá" className="w-full bg-white text-black px-4 py-2" />
						</div>
					</div>

					{/* --- Bên phải: Giỏ hàng + Tổng tiền --- */}
					<div className="flex-grow mt-6 lg:mt-0">
						<p className="text-xl">Giỏ hàng</p>

						{/* 1 sản phẩm (mua nhanh) */}
						{order && productParam && productId && variantParam ? (
							<div className="border-b border-gray-600 py-4 flex items-center gap-4">
								<img src={order?.product?.thumbnail || ''} alt={order?.product?.name || ''} className="w-32 h-32 object-cover rounded" />
								<div className="w-full flex justify-between">
									<div>
										<p className="font-semibold font-ezman text-ezman-red">/ {order?.product?.brand || ''} /</p>
										<p className="text-base">{order?.product?.name || ''}</p>
										<div className="variants">
											<span className="px-3 bg-ezman-red text-white">
												{order?.variants?.item_variant_item_size_fk?.name || ''}
												{order?.variants?.item_variant_item_color_fk ? `, ${order?.variants?.item_variant_item_color_fk?.name}` : ''}
											</span>
										</div>

										<div className="inline-block mt-2 border border-gray-300">
											<button className="w-8 py-1 hover:bg-gray-300 text-lg font-bold" onClick={() => handleQuantityChange('decrease')}>-</button>
											<span className="px-2">{order.quantity || 0}</span>
											<button className="w-8 py-1 hover:bg-gray-300 text-lg font-bold" onClick={() => handleQuantityChange('increase')}>+</button>
										</div>
									</div>
									<div>
										<p className="text-ezman-red font-bold">{Number(order?.variants?.price || 0).toLocaleString()}đ</p>
									</div>
								</div>
							</div>
						) : cart && cart.length > 0 ? (
							<div className="divide-y divide-gray-200">
								{cart.map((item, idx) => (
									<div key={item.product.itemId ?? idx} className="border-b border-gray-600 py-4 flex items-center gap-4 ">
										<img src={item.product.thumbnail} alt={item?.product?.name} className="w-32 h-32 object-cover rounded" />
										<div className="w-full flex justify-between">
											<div>
												<p className="font-semibold font-ezman text-ezman-red">/ {item?.product?.brand || ''} /</p>
												<p className="text-base">{item?.product?.name || ''}</p>
												<div className="variants">
													<span className="px-3 bg-ezman-red text-white">
														{item?.variants?.item_variant_item_size_fk?.name || ''}
														{item?.variants?.item_variant_item_color_fk ? `, ${item?.variants?.item_variant_item_color_fk?.name}` : ''}
													</span>
												</div>
												<div className="inline-block mt-2 border border-gray-300">
													<button className="w-8 py-1 hover:bg-gray-300 text-lg font-bold" onClick={() => handleQuantityChange('decrease', idx)}>-</button>
													<span className="px-2">{item.count || 0}</span>
													<button className="w-8 py-1 hover:bg-gray-300 text-lg font-bold" onClick={() => handleQuantityChange('increase', idx)}>+</button>
												</div>
											</div>
											<div>
												<p className="text-ezman-red font-bold">{Number(item?.variants?.price || 0).toLocaleString()}đ</p>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center text-gray-500 py-8">Giỏ hàng của bạn đang trống.</div>
						)}

						{/* --- Tổng tiền --- */}
						<div className="w-full mt-4 space-y-2">
							<div className="text-gray-500 flex justify-between items-center">
								<span className="font-semibold text-lg">Tổng tiền</span>
								<span className="font-semibold text-lg">{Number(priceInfo.subtotal).toLocaleString()}đ</span>
							</div>

							<div className="text-gray-500 flex justify-between items-center">
								<span className="font-semibold text-lg">Giảm giá</span>
								<span className="font-semibold text-lg text-green-500">-{Number(priceInfo.voucherDiscount).toLocaleString()}đ</span>
							</div>

							<div className="flex justify-between items-center">
								<span className="font-semibold text-lg">Tổng thanh toán</span>
								<span className="font-semibold text-lg text-ezman-red">{Number(priceInfo.total).toLocaleString()}đ</span>
							</div>

							<button onClick={handleOrder} className="mt-2 cursor-pointer bg-ezman-red w-full py-2 text-lg font-medium text-white">Đặt hàng</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderPage;