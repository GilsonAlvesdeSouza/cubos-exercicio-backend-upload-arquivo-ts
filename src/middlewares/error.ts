import { log } from 'console';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError';

const errorMiddleware = (
	err: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	_: NextFunction
) => {
	console.log(err);

	const statusCode = err.statusCode ?? 500;
	const message = err.statusCode ? err.message : `${err.message}`;

	return res.status(statusCode).json({ message });
};

export default errorMiddleware;
