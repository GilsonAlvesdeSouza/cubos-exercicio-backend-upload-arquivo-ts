import { Router } from 'express';
import isAuthenticated from './middlewares/isAuthenticated';
import { UserController } from './controllers/UserController';
import { UserRepository } from './repositories/UserRepository';
import AuthUserController from './controllers/AuthUserController';
import { AuthUserRepository } from './repositories/AuthUserRepository';

const userController = new UserController(new UserRepository());
const authUserController = new AuthUserController(new AuthUserRepository());

const router = Router();

router.post('/usuarios', userController.create);
router.post('/login', authUserController.auth);

router.use(isAuthenticated);
router.get('/perfil', userController.findById);
router.put('/perfil', userController.update);
router;

export default router;
