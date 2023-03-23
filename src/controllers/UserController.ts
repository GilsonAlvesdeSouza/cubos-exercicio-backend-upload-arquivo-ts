import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../errors';
import IUser from '../Models/IUser';
import IBaseRepository from '../repositories/IBaseRepository';
import { validateRequest } from '../utils/validateRequeste';

export class UserController {
	private readonly userRepository: IBaseRepository<IUser>;

	constructor(userRepository: IBaseRepository<IUser>) {
		this.userRepository = userRepository;
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
	}

	async create(req: Request, res: Response) {
		const { name, email, password, store_name }: IUser = req.body;

		validateRequest({ name, email, password, store_name });

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
		const user = req.user;
		return res.status(200).json(user);
	}

	async update(req: Request, res: Response) {
		const user_id = Number(req.user.id);
		let { name, email, password, store_name }: IUser = req.body;

		if (!name && !email && !password && !store_name) {
			throw new NotFoundError(
				'É obrigatório informar ao menos um campo para atualização'
			);
		}

		if (password) {
			password = await bcrypt.hash(password, 10);
		}

		const user = await this.userRepository.update(
			{
				id: user_id,
				name,
				email,
				password,
				store_name
			},
			user_id
		);

		if (!user) {
			throw new NotFoundError('Não foi possível atualizar o usuário');
		}

		return res.status(200).json(user);
	}
}
