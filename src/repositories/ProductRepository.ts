import knexInstancePG from '../connection/pg_connection';
import { NotFoundError } from '../errors';
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

	async create(data: IProducts): Promise<IProducts | undefined> {
		const product = (await knexInstancePG('products')
			.insert(data)
			.returning('*')
			.then((product) => product[0])) as IProducts;
		return product;
	}

	async update(data: IProducts, id: number, user_id: number): Promise<number> {
		const productFound = await this.findById(id, user_id);

		if (!productFound) {
			throw new NotFoundError('Produto não encontrado');
		}

		const product = await knexInstancePG('products').where({ id }).update(data);

		return product;
	}

	async delete(id: number, user_id: number): Promise<void> {
		const productFound = await this.findById(id, user_id);

		console.log(productFound);
		if (!productFound) {
			throw new NotFoundError('Produto não encontrado');
		}
		await knexInstancePG('products')
			.where({
				id,
				user_id
			})
			.del();
	}
}
