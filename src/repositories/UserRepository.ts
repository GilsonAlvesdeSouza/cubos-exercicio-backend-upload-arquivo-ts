import IUser from '../Models/IUser';
import IBaseRepository from './IBaseRepository';
import knexInstancePG from '../connection/pg_connection';
import { BadRequestError, NotFoundError } from '../errors';

export class UserRepository implements IBaseRepository<IUser> {
	async findAll(): Promise<IUser[]> {
		const users = await knexInstancePG('users').select('*');
		return users;
	}

	async findById(id: number): Promise<IUser | undefined> {
		const user = await knexInstancePG('users')
			.where('id', id)
			.select(['id', 'name', 'store_name', 'email'])
			.first();
		return user;
	}

	async create(data: IUser): Promise<IUser> {
		const emailExists = await knexInstancePG('users')
			.where({ email: data.email })
			.first();

		if (emailExists) {
			throw new BadRequestError('O email já existe.');
		}

		const user = (await knexInstancePG('users')
			.insert(data)
			.returning(['id', 'name', 'email', 'store_name'])
			.then((user) => user[0])) as IUser;
		return user;
	}

	async update(data: IUser, id: number): Promise<IUser | undefined> {
		const userExists = await knexInstancePG('users')
			.where({ id })
			.returning('email')
			.first();

		if (!userExists) {
			return undefined
		}

		if (userExists.email !== data.email) {
			const emailUserExists = await knexInstancePG('users')
				.where({ email: data.email })
				.first();
			if (emailUserExists) {
				throw new BadRequestError('O email já existe.');
			}
		}

		const user = (await knexInstancePG('users')
			.where('id', id)
			.update(data)
			.returning(['id', 'name', 'email', 'store_name'])
			.then((user) => user[0])) as IUser;
		return user;
	}

	async delete(id: number): Promise<void> {
		await knexInstancePG('users').where('id', id).del();
	}
}
