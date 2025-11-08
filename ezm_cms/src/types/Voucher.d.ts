export interface VoucherDocument {
	voucherId: number;
	title: string;
	description: string;
	discount: number;
	amount: number;
	amountOff?: number;
	itemCodes: string[];
	expire?: string;
	tags: string[];
	thumbnail: string;
	images: string[];
	content: string;
	status: number;
	quantity: number;
	remainingQuantity: number;
	voucherCode: string;
	slug: string;
	createdBy?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface VoucherCreateRequest {
	title: string;
	description: string;
	discount: number;
	amount: number;
	itemCodes: string[];
	tags: string[];
	thumbnail: string;
	images: string[];
	content: string;
	status: number;
	quantity: number;
	voucherCode: string;
}

export interface VoucherResponse {
	status: number;
	data: VoucherDocument;
	count?: number;
}
