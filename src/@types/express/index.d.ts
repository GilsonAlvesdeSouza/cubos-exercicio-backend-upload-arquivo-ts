import { IUsers } from '../models/Users';

declare global {
	namespace Express {
		interface Request {
			user: IUsers;
		}
	}
}
