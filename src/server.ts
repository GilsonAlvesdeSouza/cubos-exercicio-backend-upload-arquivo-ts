import 'express-async-errors';
import express from 'express';
import router from './router';
import 'dotenv/config';
import cors from 'cors';
import errorMiddleware from './middlewares/error';

const port = process.env.PORT_APP || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

app.listen(port, () => {
	console.log(`Server is running on port ${port}\nhttp://localhost:${port}`);
});
