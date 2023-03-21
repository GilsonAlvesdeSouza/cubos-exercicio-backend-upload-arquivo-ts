import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

interface Payload {
	sub: string;
}

export default function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authToken = req.headers.authorization;

	if (!authToken) {
		throw new UnauthorizedError('Token não informado.');
	}

	const [_, token] = authToken.split(' ');

	try {
		const { sub } = verify(token, process.env.JWT_SECRET as string) as Payload;
		req.user_id = sub;
		return next();
	} catch (error) {
		throw new UnauthorizedError('Token inválido.');
	}
}
