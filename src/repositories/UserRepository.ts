import IUser from '../Models/IUser';
import IBaseRepository from './IBaseRepository';
import knexInstancePG from '../connection/pg_connection';
import { BadRequestError } from '../errors';

export class UserRepository implements IBaseRepository<IUser> {
	update(id: string, data: IUser): Promise<IUser> {
		throw new Error('Method not implemented.');
	}
	async findAll(): Promise<IUser[]> {
		const users = await knexInstancePG('users').select('*');
		return users;
	}

	async findById(id: string): Promise<IUser | undefined> {
		const user = await knexInstancePG('users').where('id', id).first();
		return user;
	}

	async create(data: IUser): Promise<Partial<IUser>> {
		const emailExists = await knexInstancePG('users')
			.where({ email: data.email })
			.first();

		if (emailExists) {
			throw new BadRequestError('O email já existe.');
		}

		const user = (await knexInstancePG('users')
			.insert(data)
			.returning(['id', 'name', 'email', 'store_name'])
			.then((user) => user[0])) as Partial<IUser>;
		return user;
	}

	// async update(id: string, data: IUser): Promise<IUser> {
	// 	const user = await knexInstancePG('users').where('id', id).update(data);
	// 	return user;
	// }

	async delete(id: string): Promise<void> {
		await knexInstancePG('users').where('id', id).del();
	}
}
