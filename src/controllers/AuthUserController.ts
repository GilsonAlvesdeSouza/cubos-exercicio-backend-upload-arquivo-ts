import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import AuthUserRepository from '../repositories/AuthUserRepository';

export default class AuthUserController {
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
