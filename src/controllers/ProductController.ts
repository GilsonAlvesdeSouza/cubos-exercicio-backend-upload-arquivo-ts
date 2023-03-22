import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors';
import IProducts from '../Models/IProducts';
import IBaseRepository from '../repositories/IBaseRepository';
import { validateRequest } from '../utils/validateRequeste';

export default class ProductController {
	private readonly productRepository: IBaseRepository<IProducts>;

	constructor(productRepository: IBaseRepository<IProducts>) {
		this.productRepository = productRepository;
		this.findAll = this.findAll.bind(this);
		this.findById = this.findById.bind(this);
		this.create = this.create.bind(this);
	}

	async findAll(req: Request, res: Response): Promise<Response> {
		const category = req.query.category as string;
		const user_id = Number(req.user_id);

		if (!user_id) {
			throw new BadRequestError('O id do usuário é obrigatório');
		}

		const products = await this.productRepository.findAll(category, user_id);

		return res.status(200).json(products);
	}

	async findById(req: Request, res: Response): Promise<Response> {
		const id = Number(req.params.id);
		const user_id = Number(req.user_id);

		validateRequest({ user_id, id });

		const product = await this.productRepository.findById(id, user_id);

		if (!product) {
			throw new NotFoundError('Produto não encontrado');
		}

		return res.status(200).json(product);
	}

	async create(req: Request, res: Response): Promise<Response> {
		const { name, stock, price, category, description, image }: IProducts =
			req.body;
		const user_id = Number(req.user_id);

		validateRequest({ user_id, name, stock, price, category });

		const product = await this.productRepository.create({
			user_id,
			name,
			stock,
			price,
			category,
			description,
			image
		});

		if (!product) {
			throw new BadRequestError('O produto não foi cadastrado');
		}

		return res.status(201).json(product);
	}
}
