import knexInstancePG from '../connection/pg_connection';
import IProducts from '../Models/IProducts';
import IBaseRepository from './IBaseRepository';

export default class ProductRepository implements IBaseRepository<IProducts> {
	async findAll(category: string, user_id: number): Promise<IProducts[]> {
		const products = await knexInstancePG('products')
			.where({ user_id })
			.where((query) => {
				if (category) {
					return query.where('category', 'ilike', `%${category}%`);
				}
			});
		console.log(category);

		return products;
	}

	async findById(id: number, user_id: number): Promise<any> {
		const product = await knexInstancePG('products')
			.where({
				id,
				user_id
			})
			.first();

		return product;
	}

	async create(data: IProducts): Promise<IProducts> {
		const product = (await knexInstancePG('products')
			.insert(data)
			.returning('*')
			.then((product) => product[0])) as IProducts;
		return product;
	}

	update(id: number, data: IProducts): Promise<IProducts> {
		throw new Error('Method not implemented.');
	}

	delete(id: number): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
