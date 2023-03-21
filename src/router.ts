import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { UserRepository } from './repositories/UserRepository';

const userController = new UserController(new UserRepository());

const router = Router();

router.post('/usuarios', userController.create);

export default router;
