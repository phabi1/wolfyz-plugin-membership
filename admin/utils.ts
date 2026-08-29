export const TEXT_DOMAIN = "wolf-membership";

export function convertStringToDate(dateString: string): Date | null {
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : date;
}

export function convertTimestampToDate(timestamp: number): Date {
	return new Date(timestamp * 1000);
}

export function convertDateToString(date: Date | null): string {
	return date ? date.toISOString() : "";
}

export function convertDateToTimestamp(date: Date): number {
	return Math.floor(date.getTime() / 1000);
}

export function uuid(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}