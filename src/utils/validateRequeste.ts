import { BadRequestError } from '../errors';

interface IObjectKeys {
	[key: string]: any | undefined;
}

export function validateRequest(entries: IObjectKeys) {
	Object.keys(entries).forEach((arg) => {
		if (!entries[arg]) {
			throw new BadRequestError(`${arg} é obrigatório`);
		}
	});
}
