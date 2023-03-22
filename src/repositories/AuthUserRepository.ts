import knexInstancePG from '../connection/pg_connection';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { BadRequestError, NotFoundError } from '../errors';
import IBaseRepository from './IBaseRepository';
interface AuthRequest {
	email: string;
	password: string;
}

export interface IAuth {
	user: {
		id: number;
		name: string;
		store_name: string;
		email: string;
	};
	token: string;
}

dotenv.config();

export class AuthUserRepository implements IBaseRepository<IAuth> {
	findAll(): Promise<IAuth[]> {
		throw new Error('Method not implemented.');
	}
	findById(id: number): Promise<any> {
		throw new Error('Method not implemented.');
	}
	create(data: IAuth): Promise<IAuth> {
		throw new Error('Method not implemented.');
	}
	update(data: IAuth, id: number): Promise<IAuth> {
		throw new Error('Method not implemented.');
	}
	delete(id: number): Promise<void> {
		throw new Error('Method not implemented.');
	}
	async auth({ email, password }: AuthRequest) {
		const user = await knexInstancePG('users').where({ email }).first();

		if (!user) {
			throw new BadRequestError('Email e senha não conferem.');
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new NotFoundError('O usuario não foi encontrado.');
		}

		const token = sign(
			{
				name: user.name,
				email: user.email
			},
			process.env.JWT_SECRET as string,
			{
				subject: String(user.id),
				expiresIn: '8h'
			}
		);

		const { password: _, ...userWithoutPassword } = user;

		return { user: userWithoutPassword, token };
	}
}
