import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../errors';
import IUser from '../Models/IUser';
import IBaseRepository from '../repositories/IBaseRepository';

export class UserController {
	private readonly userRepository: IBaseRepository<IUser>;

	constructor(userRepository: IBaseRepository<IUser>) {
		this.userRepository = userRepository;
		this.create = this.create.bind(this);
		this.findById = this.findById.bind(this);
		this.update = this.update.bind(this);
	}

	async create(req: Request, res: Response) {
		const { name, email, password, store_name }: IUser = req.body;

		if (!name) {
			throw new NotFoundError('O campo nome é obrigatório');
		}

		if (!email) {
			throw new NotFoundError('O campo email é obrigatório');
		}

		if (!password) {
			throw new NotFoundError('O campo senha é obrigatório');
		}

		if (!store_name) {
			throw new NotFoundError('O campo nome_loja é obrigatório');
		}

		const encryptedPassword = await bcrypt.hash(password, 10);

		const user = await this.userRepository.create({
			name: name,
			email: email,
			password: encryptedPassword,
			store_name: store_name
		});

		if (!user) {
			throw new NotFoundError('Não foi possível criar o usuário');
		}

		return res.status(201).json(user);
	}

	async findById(req: Request, res: Response) {
		const user_id = Number(req.user_id);

		if (!user_id) {
			throw new NotFoundError('O id do usuário é obrigatório');
		}

		const user = await this.userRepository.findById(user_id);
		if (!user) {
			throw new NotFoundError('Usuário não encontrado');
		}
		return res.status(200).json(user);
	}

	async update(req: Request, res: Response) {
		const user_id = Number(req.user_id);
		let { name, email, password, store_name }: IUser = req.body;

		if (!name && !email && !password && !store_name) {
			throw new NotFoundError(
				'É obrigatório informar ao menos um campo para atualização'
			);
		}

		if (password) {
			password = await bcrypt.hash(password, 10);
		}

		const user = await this.userRepository.update(user_id, {
			id: user_id,
			name,
			email,
			password,
			store_name
		});

		if (!user) {
			throw new NotFoundError('Não foi possível atualizar o usuário');
		}

		return res.status(200).json(user);
	}
}
