import 'express-async-errors';
import 'reflect-metadata';
import express from 'express';
import router from './router';
import 'dotenv/config';
import cors from 'cors';

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
	console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
