import { Knex, knex } from 'knex';
import 'dotenv/config';

const config: Knex.Config = {
	client: process.env.PG_CLIENT,
	connection: {
		host: process.env.PG_HOST,
		port: Number(process.env.PG_PORT),
		user: process.env.PG_USER,
		password: process.env.PG_PASS,
		database: process.env.PG_NAME
	}
};

const knexInstancePG = knex(config);

export default knexInstancePG;
