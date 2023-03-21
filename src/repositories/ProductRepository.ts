import knexInstancePG from '../connection/pg_connection';
import IProducts from '../Models/IProducts';
import IBaseRepository from './IBaseRepository';

export default class ProductRepository implements IBaseRepository<IProducts> {
	findAll(): Promise<IProducts[]> {
		throw new Error('Method not implemented.');
	}

	findById(id: number): Promise<any> {
		throw new Error('Method not implemented.');
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
