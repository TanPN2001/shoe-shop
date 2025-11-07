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
import Link from 'next/link';
import { redirect } from 'next/navigation';

type WithQueryParams = {
	sort?: string;
	itemSizeId?: string;
	priceMax?: string;
	priceMin?: string;
	page?: string;
	limit?: string;
};

const DEFAULT_LIMIT = 20;

type PaginationResult = {
	total: number | null;
	totalPages: number | null;
	limit: number;
	page: number;
};

const resolvePagination = (
	source: any,
	defaults: { page: number; limit: number }
): PaginationResult => {
	const candidates = [source?.pagination, source?.meta, source];
	const pickFirst = <T,>(selector: (input: any) => T | null | undefined): T | null => {
		for (const candidate of candidates) {
			const value = selector(candidate);
			if (value !== undefined && value !== null) {
				return value;
			}
		}
		return null;
	};

	const total = pickFirst<number>((input) =>
		input?.total ?? input?.totalItems ?? input?.count ?? input?.records
	);
	const limit =
		pickFirst<number>((input) =>
			input?.limit ?? input?.pageSize ?? input?.perPage ?? input?.size
		) ?? defaults.limit;
	const page =
		pickFirst<number>((input) =>
			input?.page ?? input?.currentPage ?? input?.pageIndex ?? input?.pageNumber
		) ?? defaults.page;
	const totalPages =
		pickFirst<number>((input) => input?.totalPages ?? input?.pages) ??
		(total !== null && limit ? Math.ceil(total / limit) : null);

	return {
		total,
		totalPages,
		limit,
		page,
	};
};

async function CategoryPage(props: { params: any; searchParams: any }) {
	const { slug } = await props.params;

	const searchParams = (await props.searchParams) as WithQueryParams;
	const { sort, itemSizeId, priceMin, priceMax, page: pageQuery, limit: limitQuery } =
		searchParams;

	const page = Number(pageQuery) > 0 ? Number(pageQuery) : 1;
	const limit = Number(limitQuery) > 0 ? Number(limitQuery) : DEFAULT_LIMIT;

	const buildQueryString = (targetPage: number) => {
		const params = new URLSearchParams();
		if (sort) params.set('sort', sort);
		if (itemSizeId) params.set('itemSizeId', itemSizeId);
		if (priceMin) params.set('priceMin', priceMin);
		if (priceMax) params.set('priceMax', priceMax);
		if (limitQuery || limit !== DEFAULT_LIMIT) {
			params.set('limit', limit.toString());
		}
		if (targetPage > 1) {
			params.set('page', targetPage.toString());
		}
		return params.size > 0 ? `?${params.toString()}` : '';
	};

	const loader = async () => {
		if (slug === 'tat-ca') {
			try {
				const getItems = await server.get(`/item/get`, {
					params: {
						page,
						limit,
						...(sort ? { sort } : {}),
						...(itemSizeId ? { itemSizeId } : {}),
						...(priceMin ? { priceMin } : {}),
						...(priceMax ? { priceMax } : {}),
					},
				});

				return {
					products: getItems?.data?.data as ProductDocument[],
					category: { name: 'Tất cả sản phẩm' } as CategoryDocument,
					pagination: resolvePagination(getItems?.data, { page, limit }),
				};
			} catch (err) {
				redirect('/danh-muc/giay-sneaker');
			}
		}
		try {
			const [getItems, getItemType] = await Promise.all([
				server.get(`/item/list-item-by-type-slug/${slug}`, {
					params: {
						page,
						limit,
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
				pagination: resolvePagination(getItems?.data, { page, limit }),
			};
		} catch (err) {
			redirect('/404');
		}
	};

	const { products, category, pagination } = await loader();

	const totalProducts = pagination.total ?? products.length;
	const currentPage = pagination.page;
	const totalPages = pagination.totalPages;
	const hasPrevious = currentPage > 1;
	const hasNext = totalPages
		? currentPage < totalPages
		: products.length === pagination.limit;
	const pageNumbers = totalPages
		? Array.from({ length: totalPages }, (_, index) => index + 1)
		: [];

	const renderPaginationItem = (
		label: string,
		targetPage: number,
		options: { disabled?: boolean; active?: boolean } = {}
	) => {
		const baseClasses =
			'px-4 py-2 uppercase text-sm border border-white rounded-none transition-colors min-w-[44px] text-center tracking-wide';
		if (options.disabled) {
			return (
				<span
					key={`${label}-${targetPage}`}
					className={`${baseClasses} text-white/50 border-white/40 cursor-not-allowed`}
				>
					{label}
				</span>
			);
		}
		if (options.active) {
			return (
				<span
					key={`${label}-${targetPage}`}
					className={`${baseClasses} bg-white text-black`}
				>
					{label}
				</span>
			);
		}
		return (
			<Link
				key={`${label}-${targetPage}`}
				href={buildQueryString(targetPage)}
				className={`${baseClasses} text-white hover:bg-white hover:text-black`}
			>
				{label}
			</Link>
		);
	};

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
					Có [{totalProducts}] sản phẩm trong danh mục này
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

			{products.length === 0 && (
				<div className="mt-6">
					<div className="w-full h-52 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
						Không có sản phẩm nào trong danh mục này
					</div>
				</div>
			)}

			<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
				{renderPaginationItem('Trang trước', currentPage - 1, {
					disabled: !hasPrevious,
				})}
				{pageNumbers.length > 0 ? (
					pageNumbers.map((pageNumber) =>
						renderPaginationItem(pageNumber.toString(), pageNumber, {
							active: pageNumber === currentPage,
						})
					)
				) : (
					renderPaginationItem(`Trang ${currentPage}`, currentPage, {
						active: true,
					})
				)}
				{renderPaginationItem('Trang sau', currentPage + 1, {
					disabled: !hasNext,
				})}
			</div>
		</div>
	);
}
export default CategoryPage;
