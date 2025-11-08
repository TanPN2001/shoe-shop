import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function genRandomNumberInRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Tính giá sau khi áp dụng discount/amountOff của variant
 * @param {Object} variant - Variant object chứa price, discount, amountOff
 * @returns {Number} Giá sau khi áp dụng discount/amountOff
 */
export const calculateItemPrice = (
	price: number,
	discount: number,
	amountOff: number
) => {
	let itemPrice = price;

	if (discount && discount > 0) {
		itemPrice = itemPrice * (1 - discount/100);
	}
	// Áp dụng amountOff nếu có (ưu tiên amountOff nếu cả hai đều có)
	else if (amountOff && amountOff > 0) {
		itemPrice = itemPrice - amountOff;
	}

	// Đảm bảo giá không âm
	if (itemPrice < 0) itemPrice = 0;

	return itemPrice;
};
