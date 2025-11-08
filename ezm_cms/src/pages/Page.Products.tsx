import { useEffect, useState } from 'react';
import type { ProductDocument } from '../types/Product';
import { InitPaging, type Paging } from '../paging';
import {
	Table,
	Image,
	Modal,
	Button,
	Form,
	Input,
	Upload,
	message,
	Select,
	InputNumber,
	Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { CATEGORIES, COLORS, SIZES } from '../store';
import api from '../api';
import ListVariant from '../components/ListVariants';

function ProductsPage() {
	const [listProduct, setListProduct] = useState<{
		data: ProductDocument[];
		paging: Paging;
	}>({ data: [], paging: InitPaging });
	const categories = useAtomValue(CATEGORIES);
	const colors = useAtomValue(COLORS);
	const sizes = useAtomValue(SIZES);

	const loadItems = async () => {
		const res = await api.get<{ data: ProductDocument[]; paging: Paging }>(
			'/item/get'
		);
		// const res = await api.get<{ data: ProductDocument[]; count: number }>(
		// 	'/item/get'
		// );
		const items = res.data.data;
		const paging = res.data.paging;

		const updatedProducts = await Promise.all(
			items.map(async (product) => {
				const re = await api.get(
					`/item-variant/detail-by-item/${product?.itemId}`
				);
				console.log('loan re: ', re);
				const variants = re.data?.data || [];

				// Tính tổng quantity của variant có status = 1
				const total = variants
					.filter((v: any) => v.status === 1)
					.reduce((sum: number, v: any) => sum + (v.quantity || 0), 0);
				const listSize = variants.map((v: any) => ({
					name: v?.item_variant_item_size_fk?.name,
					quantity: v?.quantity,
				}));
				return {
					...product,
					totalVariants: total,
					listSizeVariants: listSize,
				};
			})
		);

		console.log('updatedProducts: ', updatedProducts);
		setListProduct({ data: updatedProducts, paging });
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();
	const [variantForm] = Form.useForm();
	const [uploading, setUploading] = useState(false);
	const [imageList, setImageList] = useState<any[]>([]);
	const [editImageList, setEditImageList] = useState<any[]>([]);
	const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(
		null
	);
	const [variantProduct, setVariantProduct] = useState<ProductDocument | null>(
		null
	);

	useEffect(() => {
		loadItems();
	}, []);

	const [variantsS, setVariantsS] = useState<any>([]);

	const updateVariant = (index: any, newVariant: any) => {
		setVariantsS((prev: any) =>
			prev.map((v: any, i: any) => (i === index ? newVariant : v))
		);
	};

	const deleteProduct = async (rec: ProductDocument) => {
		await api.post('/item/delete', { itemId: rec.itemId });
		loadItems();
	};

	const columns: ColumnsType<ProductDocument> = [
		{
			title: 'ID',
			dataIndex: 'itemId',
			key: 'itemId',
			width: 80,
		},
		{
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Mã sản phẩm',
			dataIndex: 'code',
			key: 'code',
		},
		{
			title: 'Loại sản phẩm',
			dataIndex: ['item_item_type_fk', 'name'],
			key: 'itemType',
			render: (_, record) => record.item_item_type_fk?.name || '',
		},
		{
			title: 'Thương hiệu',
			dataIndex: 'brand',
			key: 'brand',
		},
		{
			title: 'Ảnh',
			dataIndex: 'thumbnail',
			key: 'thumbnail',
			render: (url: string) => (
				<Image
					src={url}
					width={50}
					alt="thumbnail"
				/>
			),
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			render: (price: string) =>
				Number(price).toLocaleString('vi-VN', {
					style: 'currency',
					currency: 'VND',
				}),
		},
		{
			title: 'Giảm giá',
			dataIndex: 'discount',
			key: 'discount',
			render: (discount: any) => (discount ? discount + '%' : '--'),
		},
		// {
		//     title: "Số lượt mua",
		//     dataIndex: "numBuy",
		//     key: "numBuy",
		// },
		// {
		//     title: "Sao TB",
		//     dataIndex: "averageStar",
		//     key: "averageStar",
		// },
		{
			title: 'Tồn kho',
			dataIndex: 'totalVariants',
			key: 'totalVariants',
			render: (totalVariants: number) => totalVariants ?? 0,
		},
		{
			title: 'Size tồn kho',
			dataIndex: 'listSizeVariants',
			key: 'listSizeVariants',
			render: (listSizeVariants: any[]) => {
				if (!listSizeVariants?.length) return '—';
				return (
					<div
						style={{
							whiteSpace: 'pre',
							// overflowX: "auto",
							maxWidth: 150,
						}}
					>
						{listSizeVariants
							.map((v) => `${v.name}: ${v.quantity}`)
							.join(',\n')}
					</div>
				);
			},
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: string) => new Date(date).toLocaleString(),
		},
		{
			title: 'Ngày cập nhật',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			render: (date: string) => new Date(date).toLocaleString(),
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 120,
			render: (_, record) => (
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<Button
						type="link"
						onClick={() => handleEditProduct(record)}
					>
						Sửa
					</Button>

					<ListVariant item={record} />

					<Button
						type="link"
						onClick={() => handleAddVariant(record)}
					>
						Thêm biến thể
					</Button>

					<Popconfirm
						title="Bạn có chắc chắn muốn xóa sản phẩm này?"
						okText="Xóa"
						cancelText="Hủy"
						onConfirm={() => deleteProduct(record)}
					>
						<Button
							type="primary"
							danger
							size="small"
						>
							Xóa
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];

	// Handle modal open/close
	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		form.resetFields();
		setImageList([]);
		setVariantsS([]);
	};

	// Handle form submit (create)
	const handleOk = async () => {
		try {
			console.log('Loanhtm: ');
			setUploading(true);
			console.log('Loanhtm: ', form);
			const values = await form.validateFields();
			console.log('Loanhtm variantsS: ', variantsS);
			// images: array of {url}
			const images = imageList
				.map((file) => file.url || file.thumbUrl || file.response?.url)
				.filter(Boolean);

			if (images.length === 0) {
				message.error('Vui lòng upload ít nhất 1 ảnh.');
				setUploading(false);
				return;
			}

			const res = await api.post('/item/create-variation', {
				// await api.post("/item/create-variation", {
				...values,
				thumbnail: images[0],
				images: images,
				variants: variantsS,
			});
			if (res.data.status == 0) {
				message.success('Tạo sản phẩm thành công!');
				setIsModalOpen(false);
				// message.success("Tạo sản phẩm thành công!");
				form.resetFields();
				setImageList([]);
				loadItems();
			} else {
				// setIsModalOpen(false);
				message.error('Tạo sản phẩm thất bại!');
			}
		} catch (err) {
			// Validation error
			message.error('Lỗi tạo sản phẩm!');
		} finally {
			setUploading(false);
		}
	};

	const customRequest = async ({ file, onSuccess, onError }: any) => {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await api.post('/media/upload-s3', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			console.log(193, response.data.data.URL);
			// Assume response.data.url is the uploaded image URL
			file.url = response.data.data.URL;
			file.thumbUrl = response.data.data.URL;
			onSuccess(response.data, file);
		} catch (error) {
			onError?.(error);
		}
	};

	// ---------- VARIANT LOGIC ----------
	const handleAddVariant = (product: ProductDocument) => {
		setVariantProduct(product);
		console.log(product);
		setIsVariantModalOpen(true);
		// variantForm.setFieldsValue({
		//     itemId: product.itemId,
		//     itemColorId: undefined,
		//     itemSizeId: undefined,
		//     quantity: undefined,
		//     price: undefined,
		// });
	};

	const handleVariantCancel = () => {
		setIsVariantModalOpen(false);
		setVariantProduct(null);
		variantForm.resetFields();
	};

	const handleVariantOk = async () => {
		try {
			const values = await variantForm.validateFields();
			console.log('loanhtm values: ', values);
			const payload = {
				itemId: Number(values.itemId),
				itemColorId: Number(values.itemColorId),
				itemSizeId: Number(values.itemSizeId),
				quantity: Number(values.quantity),
				price: Number(values.price),
			};

			const res = await api.post('/item-variant/create', payload);
			if (res.data.status == 0) {
				message.success('Tạo biến thể thành công!');
				setIsVariantModalOpen(false);
				setVariantProduct(null);
				variantForm.resetFields();
				loadItems();
			} else {
				message.error('Tạo biến thể thất bại!');
			}
		} catch (err) {
			// validation error or api error
			message.error('Lỗi tạo biến thể!');
		}
	};

	// ----------- EDIT PRODUCT LOGIC -----------
	const handleEditProduct = (product: ProductDocument) => {
		setEditingProduct(product);
		setIsEditModalOpen(true);

		const sourceImages: string[] =
			Array.isArray(product.images) && product.images.length > 0
				? product.images
				: product.thumbnail
					? [product.thumbnail]
					: [];

		const fileList = sourceImages.map((imgUrl, idx) => ({
			uid: `${idx}`,
			name: `image${idx + 1}.png`,
			status: 'done',
			url: imgUrl,
			thumbUrl: imgUrl,
		}));
		setEditImageList(fileList);

		editForm.setFieldsValue({
			name: product.name,
			code: product.code,
			description: product.description,
			brand: product.brand,
			price: product.price,
			itemTypeId: product.itemTypeId ?? product.item_item_type_fk?.itemTypeId,
			discount: product.discount,
			// numBuy: product.numBuy,
			// averageStar: product.averageStar
		});
	};

	const handleEditCancel = () => {
		setIsEditModalOpen(false);
		setEditingProduct(null);
		editForm.resetFields();
		setEditImageList([]);
	};

	const handleEditOk = async () => {
		try {
			setUploading(true);
			const values = await editForm.validateFields();
			const images = editImageList
				.map((file) => file.url || file.thumbUrl || file.response?.url)
				.filter(Boolean);
			if (images.length === 0) {
				message.error('Vui lòng upload ít nhất 1 ảnh.');
				setUploading(false);
				return;
			}
			if (!editingProduct) {
				setUploading(false);
				return;
			}
			await api.post('/item/update', {
				itemId: editingProduct.itemId,
				name: values.name,
				code: values.code,
				description: values.description,
				brand: values.brand,
				price: values.price,
				itemTypeId: values.itemTypeId,
				numBuy: values.numBuy,
				averageStar: values.averageStar,
				discount: values.discount,
				thumbnail: images[0],
				images: images,
			});
			message.success('Cập nhật sản phẩm thành công!');
			setIsEditModalOpen(false);
			setEditingProduct(null);
			editForm.resetFields();
			setEditImageList([]);
			loadItems();
		} catch (err) {
			// Validation error
		} finally {
			setUploading(false);
		}
	};
	console.log("loanhtm2 listProduct: ", listProduct)
	return (
		<div>
			<Button
				type="primary"
				icon={<PlusOutlined />}
				style={{ marginBottom: 16 }}
				onClick={showModal}
			>
				Thêm sản phẩm
			</Button>
			<Table
				columns={columns}
				dataSource={listProduct.data}
			// scroll={{ x: true }}
			// pagination={{
			//     current: listProduct.paging.pageIndex,
			//     pageSize: listProduct.paging.pageSize,
			//     total: listProduct.paging.total,
			//     showSizeChanger: true,
			// }}
			/>
			{/* Modal tạo sản phẩm */}
			<Modal
				title="Tạo sản phẩm mới"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				confirmLoading={uploading}
				okText="Tạo"
				cancelText="Hủy"
				// width={1100}
				width={'fit-content'}
			// destroyOnHidden
			>
				<div style={{ display: 'flex', gap: 24 }}>
					{/* CỘT TRÁI: Thông tin sản phẩm */}
					<Form
						form={form}
						layout="vertical"
						preserve={false}
						style={{ flex: 1 }}
					>
						<Form.Item
							label="Tên sản phẩm"
							name="name"
							rules={[
								{ required: true, message: 'Vui lòng nhập tên sản phẩm' },
							]}
						>
							<Input placeholder="Nhập tên sản phẩm" />
						</Form.Item>

						<Form.Item
							label="Loại sản phẩm"
							name="itemTypeId"
							rules={[
								{ required: true, message: 'Vui lòng chọn loại sản phẩm' },
							]}
						>
							<Select
								options={categories.map((i) => ({
									label: i.name,
									value: i.itemTypeId,
								}))}
								placeholder="Chọn loại mặt hàng"
							/>
						</Form.Item>

						<Form.Item
							label="Mã sản phẩm"
							name="code"
							rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
						>
							<Input placeholder="Nhập mã sản phẩm" />
						</Form.Item>

						<Form.Item
							label="Mô tả"
							name="description"
							rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
						>
							<Input.TextArea placeholder="Nhập mô tả sản phẩm" />
						</Form.Item>

						<Form.Item
							label="Thương hiệu"
							name="brand"
							rules={[{ required: true, message: 'Vui lòng nhập thương hiệu' }]}
						>
							<Input placeholder="Nhập thương hiệu" />
						</Form.Item>

						<Form.Item
							label="Giá"
							name="price"
							rules={[
								{ required: true, message: 'Vui lòng nhập giá' },
								{ pattern: /^\d+$/, message: 'Giá phải là số' },
							]}
						>
							<Input placeholder="Nhập giá (VND)" />
						</Form.Item>

						<Form.Item
							label="Tỷ lệ khuyến mại (%)"
							name="discount"
							rules={[
								{ required: true, message: 'Vui lòng nhập tỷ lệ khuyến mại' },
								{ pattern: /^\d+$/, message: 'Phải là số' },
							]}
						>
							<Input placeholder="Nhập phần trăm khuyến mại" />
						</Form.Item>

						<Form.Item
							label="Ảnh sản phẩm"
							required
						>
							<Upload
								listType="picture-card"
								fileList={imageList}
								onChange={({ fileList }) => setImageList(fileList)}
								customRequest={customRequest}
								multiple
								accept="image/*"
							>
								{imageList.length < 5 && (
									<div>
										<UploadOutlined />
										<div style={{ marginTop: 8 }}>Tải lên</div>
									</div>
								)}
							</Upload>
							<div style={{ color: '#888', fontSize: 12 }}>
								Chọn tối đa 5 ảnh. Ảnh đầu tiên sẽ là thumbnail.
							</div>
						</Form.Item>
					</Form>

					{/* CỘT PHẢI: Biến thể sản phẩm */}
					<div style={{ flex: 1 }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: 8,
							}}
						>
							<h4>Biến thể sản phẩm</h4>
							<Button
								style={{ backgroundColor: '#1677ff', color: 'white' }}
								icon={<PlusOutlined />}
								onClick={() =>
									setVariantsS((prev: any) => [
										...prev,
										{
											color: '',
											size: '',
											quantity: undefined,
											price: undefined,
										},
									])
								}
							>
								Thêm biến thể
							</Button>
						</div>

						{variantsS.map((variant: any, index: any) => {
							// Kiểm tra lỗi
							const errors = {
								size: !variant.itemSizeId ? 'Bắt buộc' : '',
								color: !variant.itemColorId ? 'Bắt buộc' : '',
								quantity:
									variant.quantity === undefined || variant.quantity === ''
										? 'Bắt buộc'
										: variant.quantity < 0
											? 'Số lượng >= 0'
											: '',
								price:
									variant.price === undefined || variant.price === ''
										? 'Bắt buộc'
										: variant.price < 0
											? 'Giá >= 0'
											: '',
								discount:
									variant.discount === undefined || variant.discount === ''
										? 0
										: variant.discount > 1 || variant.discount < 0
											? 'Khuyến mãi >= 0 và <= 1'
											: 0,
								amountOff:
									variant.amountOff === undefined || variant.amountOff === ''
										? 0
										: variant.amountOff < 0
											? 'Giảm giá tiền >= 0'
											: 0,
							};

							const hasError = (field: keyof typeof errors) =>
								Boolean(errors[field]);

							return (
								<div
									key={index}
									style={{
										display: 'grid',
										gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
										gap: 8,
										marginBottom: 10,
										alignItems: 'flex-start',
									}}
								>
									{/* Size */}
									<div>
										<Select
											placeholder="Size"
											value={variant.itemSizeId || undefined}
											onChange={(value) =>
												updateVariant(index, { ...variant, itemSizeId: value })
											}
											options={sizes.map((s) => ({
												label: s.name,
												value: s.itemSizeId,
											}))}
											showSearch
											optionFilterProp="label"
											style={{
												borderColor: hasError('size') ? 'red' : undefined,
												width: '100%',
											}}
										/>
										{hasError('size') && (
											<div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
												{errors.size}
											</div>
										)}
									</div>

									{/* Màu sắc */}
									<div>
										<Select
											placeholder="Màu sắc"
											value={variant.itemColorId || undefined}
											onChange={(value) =>
												updateVariant(index, { ...variant, itemColorId: value })
											}
											options={colors.map((c) => ({
												label: c.name,
												value: c.itemColorId,
											}))}
											showSearch
											optionFilterProp="label"
											style={{
												borderColor: hasError('color') ? 'red' : undefined,
												width: '100%',
											}}
										/>
										{hasError('color') && (
											<div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
												{errors.color}
											</div>
										)}
									</div>

									{/* Số lượng */}
									<div>
										<Input
											placeholder="Số lượng"
											type="number"
											value={variant.quantity ?? ''}
											onChange={(e) =>
												updateVariant(index, {
													...variant,
													quantity: e.target.value
														? Number(e.target.value)
														: undefined,
												})
											}
											style={{
												borderColor: hasError('quantity') ? 'red' : undefined,
											}}
										/>
										{hasError('quantity') && (
											<div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
												{errors.quantity}
											</div>
										)}
									</div>

									{/* Giá */}
									<div>
										<Input
											placeholder="Giá"
											type="number"
											value={variant.price ?? ''}
											onChange={(e) =>
												updateVariant(index, {
													...variant,
													price: e.target.value
														? Number(e.target.value)
														: undefined,
												})
											}
											style={{
												borderColor: hasError('price') ? 'red' : undefined,
											}}
										/>
										{hasError('price') && (
											<div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
												{errors.price}
											</div>
										)}
									</div>

									{/* giảm giá */}
									<div>
										<Input
											placeholder="Giảm giá %. VD: 0.1 = 10%, 0.2 = 20%"
											type="number"
											value={variant.discount ?? ''}
											onChange={(e) =>
												updateVariant(index, {
													...variant,
													discount: e.target.value
														? Number(e.target.value)
														: undefined,
												})
											}
											style={{
												borderColor: hasError('discount') ? 'red' : undefined,
											}}
										/>
										{hasError('discount') && (
											<div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
												{errors.discount}
											</div>
										)}
									</div>

									{/* giảm giá */}
									<div>
										<Input
											placeholder="Giảm giá tiền"
											type="number"
											value={variant.amountOff ?? ''}
											onChange={(e) =>
												updateVariant(index, {
													...variant,
													amountOff: e.target.value
														? Number(e.target.value)
														: undefined,
												})
											}
											style={{
												borderColor: hasError('amountOff') ? 'red' : undefined,
											}}
										/>
										{hasError('amountOff') && (
											<div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
												{errors.amountOff}
											</div>
										)}
									</div>

									{/* Nút xoá */}
									<Button
										danger
										type="text"
										onClick={() =>
											setVariantsS((prev: any) =>
												prev.filter((_: any, i: any) => i !== index)
											)
										}
									>
										X
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			</Modal>

			{/* Modal tạo biến thể sản phẩm */}
			<Modal
				title={`Tạo biến thể cho sản phẩm${variantProduct ? `: ${variantProduct.name}` : ''
					}`}
				open={isVariantModalOpen}
				onOk={handleVariantOk}
				onCancel={handleVariantCancel}
				okText="Tạo"
				cancelText="Hủy"
				destroyOnHidden
			>
				<Form
					form={variantForm}
					initialValues={
						variantProduct
							? {
								itemId: variantProduct.itemId,
								itemColorId: undefined,
								itemSizeId: undefined,
								quantity: undefined,
								price:
									variantProduct &&
										variantProduct.price &&
										variantProduct.discount
										? Math.round(
											Number(variantProduct.price) *
											(1 - Number(variantProduct.discount) / 100)
										)
										: undefined,
							}
							: {}
					}
					layout="vertical"
					preserve={false}
				>
					<Form.Item
						label="ID sản phẩm"
						name="itemId"
						style={{ display: 'none' }}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Màu"
						name="itemColorId"
						rules={[{ required: true, message: 'Vui lòng chọn màu' }]}
					>
						<Select
							placeholder="Chọn màu"
							options={colors.map((c) => ({
								label: c.name,
								value: c.itemColorId,
							}))}
							showSearch
							optionFilterProp="label"
						/>
					</Form.Item>
					<Form.Item
						label="Size"
						name="itemSizeId"
						rules={[{ required: true, message: 'Vui lòng chọn size' }]}
					>
						<Select
							placeholder="Chọn size"
							options={sizes.map((s) => ({
								label: s.name,
								value: s.itemSizeId,
							}))}
							showSearch
							optionFilterProp="label"
						/>
					</Form.Item>
					<Form.Item
						label="Số lượng"
						name="quantity"
						rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
					>
						<InputNumber
							min={1}
							style={{ width: '100%' }}
						/>
					</Form.Item>
					<Form.Item
						label="Giá"
						name="price"
						rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
					>
						<InputNumber
							min={0}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</Form>
			</Modal>
			{/* Modal chỉnh sửa sản phẩm */}
			<Modal
				title="Chỉnh sửa sản phẩm"
				open={isEditModalOpen}
				onOk={handleEditOk}
				onCancel={handleEditCancel}
				confirmLoading={uploading}
				okText="Lưu"
				cancelText="Hủy"
				destroyOnHidden
			>
				<Form
					form={editForm}
					initialValues={
						editingProduct
							? {
								name: editingProduct.name,
								code: editingProduct.code,
								description: editingProduct.description,
								brand: editingProduct.brand,
								price: editingProduct.price,
								itemTypeId:
									editingProduct.itemTypeId ??
									editingProduct.item_item_type_fk?.itemTypeId,
								discount: editingProduct.discount,
								numBuy: editingProduct.numBuy,
								averageStar: editingProduct.averageStar,
							}
							: {}
					}
					layout="vertical"
					preserve={false}
				>
					<Form.Item
						label="Loại sản phẩm"
						name="itemTypeId"
						rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
					>
						<Select
							options={categories.map((i) => ({
								label: i.name,
								value: i.itemTypeId,
							}))}
							placeholder="Chọn loại mặt hàng"
						/>
					</Form.Item>
					<Form.Item
						label="Tên sản phẩm"
						name="name"
						rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
					>
						<Input placeholder="Nhập tên sản phẩm" />
					</Form.Item>
					<Form.Item
						label="Mã sản phẩm"
						name="code"
						rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm' }]}
					>
						<Input placeholder="Nhập mã sản phẩm" />
					</Form.Item>
					<Form.Item
						label="Giá"
						name="price"
						rules={[
							{ required: true, message: 'Vui lòng nhập giá' },
							{ pattern: /^\d+$/, message: 'Giá phải là số' },
						]}
					>
						<Input placeholder="Nhập giá (VND)" />
					</Form.Item>

					<Form.Item
						name="numBuy"
						label="Lượt mua ảo"
					>
						<InputNumber
							type="number"
							style={{ width: '100%' }}
							min={0}
						/>
					</Form.Item>

					<Form.Item
						name="averageStar"
						label="Đánh giá"
					>
						<InputNumber
							type="number"
							style={{ width: '100%' }}
							min={0}
							max={5}
						/>
					</Form.Item>

					<Form.Item
						label="Mô tả"
						name="description"
						rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
					>
						<Input.TextArea placeholder="Nhập mô tả sản phẩm" />
					</Form.Item>
					<Form.Item
						label="Thương hiệu"
						name="brand"
						rules={[{ required: true, message: 'Vui lòng nhập thương hiệu' }]}
					>
						<Input placeholder="Nhập thương hiệu" />
					</Form.Item>
					<Form.Item
						label="Tỷ lệ khuyến mại (%)"
						name="discount"
						rules={[
							{ required: true, message: 'Vui lòng nhập tỷ lệ khuyến mại' },
							{ pattern: /^\d+$/, message: 'Phải là số' },
						]}
					>
						<Input placeholder="Nhập tỷ lệ khuyến mại" />
					</Form.Item>
					<Form.Item
						label="Ảnh sản phẩm"
						required
					>
						<Upload
							listType="picture-card"
							fileList={editImageList}
							onChange={({ fileList }) => setEditImageList(fileList)}
							customRequest={customRequest}
							multiple
							accept="image/*"
						>
							{editImageList.length < 5 && (
								<div>
									<UploadOutlined />
									<div style={{ marginTop: 8 }}>Tải lên</div>
								</div>
							)}
						</Upload>
						<div style={{ color: '#888', fontSize: 12 }}>
							Chọn tối đa 5 ảnh. Ảnh đầu tiên sẽ là thumbnail.
						</div>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}

export default ProductsPage;
