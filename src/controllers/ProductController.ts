import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import IProducts from '../Models/IProducts';
import IBaseRepository from '../repositories/IBaseRepository';

export default class ProductController {
	private readonly productRepository: IBaseRepository<IProducts>;
	constructor(productRepository: IBaseRepository<IProducts>) {
		this.productRepository = productRepository;
		this.create = this.create.bind(this);
	}

	async create(req: Request, res: Response): Promise<Response> {
		const { name, stock, price, category, description, image }: IProducts =
			req.body;
		const user_id = Number(req.user_id);

		if (!name) {
			throw new BadRequestError('O campo nome é obrigatório');
		}

		if (!stock) {
			throw new BadRequestError('O campo estoque é obrigatório');
		}

		if (!price) {
			throw new BadRequestError('O campo preco é obrigatório');
		}

		if (!category) {
			throw new BadRequestError('O campo categoria é obrigatório');
		}

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