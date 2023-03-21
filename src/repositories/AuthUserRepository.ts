import knexInstancePG from '../connection/pg_connection';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { BadRequestError, NotFoundError } from '../errors';
interface AuthRequest {
	email: string;
	password: string;
}

dotenv.config();

export default class AuthUserRepository {
	async auth({ email, password }: AuthRequest) {
		const user = await knexInstancePG('usuarios').where({ email }).first();

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
				subject: user.id,
				expiresIn: '8h'
			}
		);

		const { password: _, ...userWithoutPassword } = user;

		return { user: userWithoutPassword, token };
	}
}
