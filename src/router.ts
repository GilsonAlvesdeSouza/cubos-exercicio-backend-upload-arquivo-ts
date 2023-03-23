import { Router } from 'express';
import { singleUpload } from './config/multer';
import isAuthenticated from './middlewares/isAuthenticated';
import { UserController } from './controllers/UserController';
import { UserRepository } from './repositories/UserRepository';
import AuthUserController from './controllers/AuthUserController';
import { AuthUserRepository } from './repositories/AuthUserRepository';
import ProductController from './controllers/ProductController';
import ProductRepository from './repositories/ProductRepository';

const userController = new UserController(new UserRepository());
const authUserController = new AuthUserController(new AuthUserRepository());
const product = new ProductController(new ProductRepository());

const router = Router();

router.post('/usuarios', userController.create);
router.post('/login', authUserController.auth);

router.use(isAuthenticated);
router.get('/perfil', userController.findById);
router.put('/perfil', userController.update);

router.get('/produtos', product.findAll);
router.get('/produtos/:id', product.findById);
router.post('/produtos', singleUpload('image'), product.create);
router.put('/produtos/:id', product.update);
router.delete('/produtos/:id', product.delete);

router.put(
	'/produtos/upload-image/:id',
	singleUpload('image'),
	product.uploadImageProduct
);
router.delete('/produtos/delete-image/:id', product.deleteImageProduct);

export default router;
