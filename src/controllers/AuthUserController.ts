import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import { IAuth } from '../repositories/AuthUserRepository';
import { AuthUserRepository } from '../repositories/AuthUserRepository';
import IBaseRepository from '../repositories/IBaseRepository';

export default class AuthUserController {
	private readonly authUserRepository: IBaseRepository<IAuth>;

	constructor(authUserRepository: IBaseRepository<IAuth>) {
		this.authUserRepository = authUserRepository;
		this.auth = this.auth.bind(this);
	}

	async auth(req: Request, res: Response) {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new BadRequestError('É obrigatório email e senha');
		}

		const authUserRepository = new AuthUserRepository();

		const auth = await authUserRepository.auth({ email, password });
		return res.json(auth);
	}
}
