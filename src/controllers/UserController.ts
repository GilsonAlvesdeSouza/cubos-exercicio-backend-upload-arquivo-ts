import { Request, Response } from 'express';
import { NotFoundError } from '../errors';
import IUser from '../Models/IUser';
import IBaseRepository from '../repositories/IBaseRepository';

export class UserController {
	readonly userRepository: IBaseRepository<IUser>;

	constructor(userRepository: IBaseRepository<IUser>) {
		this.userRepository = userRepository;
		this.create = this.create.bind(this);
	}

	async create(req: Request, res: Response) {
		const { name, email, password, store_name }: IUser = req.body;

		if (!name || ' ') {
			throw new NotFoundError('O campo nome é obrigatório');
		}

		if (!email || ' ') {
			throw new NotFoundError('O campo email é obrigatório');
		}

		if (!password || ' ') {
			throw new NotFoundError('O campo senha é obrigatório');
		}

		if (!store_name || ' ') {
			throw new NotFoundError('O campo nome_loja é obrigatório');
		}

		const user = await this.userRepository.create({
			name: name.trim(),
			email: email.trim(),
			password: password.trim(),
			store_name: store_name.trim()
		});

		if (!user) {
			throw new NotFoundError('Não foi possível criar o usuário');
		}

		return res.status(201).json(user);
	}
}
