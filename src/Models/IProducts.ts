export default interface IProducts {
	id?: number;
	user_id: number;
	name: string;
	stock: number;
	price: number;
	category?: string;
	description?: string;
	image?: string;
}
