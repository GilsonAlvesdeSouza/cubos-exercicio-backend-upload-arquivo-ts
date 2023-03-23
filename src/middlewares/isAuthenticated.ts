import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';
import { UserRepository } from '../repositories/UserRepository';

interface Payload {
	sub: string;
}

export default async function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authToken = req.headers.authorization;

	if (!authToken) {
		throw new UnauthorizedError('Token não informado.');
	}

	const [_, token] = authToken.split(' ');

	const { sub } = verify(token, process.env.JWT_SECRET as string) as Payload;
	const user_id = Number(sub);

	const userRepository = new UserRepository();
	const user = await userRepository.findById(user_id);

	if (!user) {
		throw new UnauthorizedError('Token inválido.');
	}

	req.user = user;
	return next();
}
