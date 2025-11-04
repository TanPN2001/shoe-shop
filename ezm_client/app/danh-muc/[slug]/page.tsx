import CategoryFilter from '@/components/category/category.filter';
import ProductCard from '@/components/product/product.card';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { server } from '@/services/service.api';
import { redirect } from 'next/navigation';

type WithQueryParams = {
	sort?: string;
	itemSizeId?: string;
	priceMax?: string;
	priceMin?: string;
};

async function CategoryPage(props: { params: any; searchParams: any }) {
	const { slug } = await props.params;

	const { sort, itemSizeId, priceMin, priceMax } =
		(await props.searchParams) as WithQueryParams;

	const loader = async () => {
		if (slug === 'tat-ca') {
			try {
				const getItems = await server.get(`/item/get`, {
					params: {
						...(sort ? { sort } : {}),
						...(itemSizeId ? { itemSizeId } : {}),
						...(priceMin ? { priceMin } : {}),
						...(priceMax ? { priceMax } : {}),
					},
				});

				return {
					products: getItems?.data?.data as ProductDocument[],
					category: { name: 'Tất cả sản phẩm' } as CategoryDocument,
				};
			} catch (err) {
				redirect('/danh-muc/giay-sneaker');
			}
		}
		try {
			const [getItems, getItemType] = await Promise.all([
				server.get(`/item/list-item-by-type-slug/${slug}`, {
					params: {
						...(sort ? { sort } : {}),
						...(itemSizeId ? { itemSizeId } : {}),
						...(priceMin ? { priceMin } : {}),
						...(priceMax ? { priceMax } : {}),
					},
				}),
				server.get(`/item-type-by-slug/${slug}`),
			]);
			return {
				products: getItems?.data?.data as ProductDocument[],
				category: getItemType?.data?.data as CategoryDocument,
			};
		} catch (err) {
			redirect('/404');
		}
	};

	const { products, category } = await loader();

	return (
		<div className="px-4 lg:px-12">
			<div className="text-white flex items-center gap-2 mb-6">
				<p className="text-lg text-ezman-red font-bold font-ezman">EZMAN</p>
				<p> / </p>
				<p className="font-semibold">{category.name}</p>
			</div>

			<div className="text-white pt-12">
				<p className="text-4xl uppercase pb-6">{category.name}</p>
			</div>

			<div className="mt-3 page-tools flex border-b border-white py-3 justify-between">
				<p className="text-white text-xl">
					Có [{products.length}] sản phẩm trong danh mục này
				</p>
				<Sheet>
					<SheetTrigger asChild>
						<Button className="cursor-pointer bg-white rounded-none hover:bg-gray-200 text-black hover:">
							Mở bộ lọc
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader className="border-b border-gray-300">
							<SheetTitle>Bộ lọc</SheetTitle>
						</SheetHeader>
						<CategoryFilter />
					</SheetContent>
				</Sheet>
			</div>

			<div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8">
				{products.map((item) => (
					<ProductCard
						key={'item_product:' + item.itemId}
						detail={item}
					/>
				))}
			</div>
		</div>
	);
}
export default CategoryPage;
