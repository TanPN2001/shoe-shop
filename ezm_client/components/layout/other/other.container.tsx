'use client';

import {
	Drawer,
	DrawerContent,
	DrawerTrigger,
	DrawerClose,
} from '@/components/ui/drawer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import api from '@/services/service.api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import OtherTabContent from './other.tab';
import { DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface Menu {
	categoryMenu: string;
	subTags?: { tag: string[]; tagName: string }[];
	value?: string[];
}

function OtherContainer() {
	const [categories, setCategories] = useState<{ [key: string]: Menu[] }>({});

	const loader = async () => {
		try {
			// const { data: res } = await api.get("/item-type/get")
			// const temp = res.data as CategoryDocument[]
			// setCategories(temp.sort((a, b) => a.itemTypeId - b.itemTypeId))

			const { data: res } = await api.get<{
				data: {
					value: {
						[key: string]: Menu[];
					};
				};
			}>('/config/by-code/MENU');
			setCategories(res.data.value);
		} catch (err) {}
	};

	useEffect(() => {
		loader();
	}, []);

	return (
		<Drawer direction="top">
			<DrawerTrigger className="text-white text-sm lg:text-base">
				{'{Danh mục khác}'}
			</DrawerTrigger>
			<DrawerContent
				style={{ margin: 0, padding: 0, borderRadius: 0, height: '95vh' }}
			>
				<div className="p-4 lg:p-12 w-full h-full">
					<div className="flex justify-between">
						<p className="text-3xl lg:text-6xl text-ezman-red font-extrabold font-ezman">
							EZM
						</p>
						<DrawerClose className="cursor-pointer flex text-gray-500">
							<X /> Đóng
						</DrawerClose>
					</div>
					<Tabs
						defaultValue={Object.keys(categories)[0] || '0'}
						className="!p-0 flex flex-col lg:flex-row !items-start"
					>
						<div className="w-[280px] mt-4">
							<TabsList className="h-full flex flex-row lg:flex-col !p-0">
								{Object.keys(categories).map((categoryKey) => (
									<TabsTrigger
										key={':tablist-item:' + categoryKey}
										style={{ textAlign: 'start' }}
										value={categoryKey}
										className="w-full cursor-pointer tab-triggle-vertical !pr-5 lg:!pr-0"
									>
										{categoryKey}
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						<div className="overflow-y-auto w-full">
							{Object.entries(categories).map(([categoryKey, menus]) => (
								<TabsContent
									key={':tablist-content:' + categoryKey}
									value={categoryKey}
									className="px-0 lg:px-6"
								>
									<p className="text-xl lg:text-5xl font-semibold font-ezman">
										{categoryKey}
									</p>

									<div className="mt-4 lg:mt-8 grid grid-cols-3 lg:grid-cols-6 gap-x-5 lg:gap-x-20 gap-y-2 lg:gap-y-4">
										{menus.map((menu, menuIdx) => (
											<div
												key={`menu-${categoryKey}-${menuIdx}`}
												className=""
											>
												<DrawerClose asChild>
													<Link
														href={`/tim-kiem?query=${menu.categoryMenu}`}
														className="cursor-pointer text-sm lg:text-base font-semibold"
													>
														{menu.categoryMenu}
													</Link>
												</DrawerClose>

												{menu.subTags && menu.subTags.length > 0 && (
													<div className="mt-2 flex flex-col gap-1 lg:gap-2">
														{menu.subTags.map((subTag, subIdx) => (
															<div
																key={`subtag-${menuIdx}-${subIdx}`}
																className="text-gray-500 py-0.5 border-b last:border-b-0"
															>
																<DrawerClose asChild>
																	<Link
																		href={`/tim-kiem?query=${subTag.tagName}`}
																		className="cursor-pointer text-sm lg:text-base"
																	>
																		{subTag.tagName}
																	</Link>
																</DrawerClose>
															</div>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								</TabsContent>
							))}
						</div>
					</Tabs>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
export default OtherContainer;
