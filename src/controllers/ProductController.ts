import { Request, Response } from 'express';
import { s3 } from '../utils/sendImage';
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
		this.update = this.update.bind(this);
		this.delete = this.delete.bind(this);
	}

	async findAll(req: Request, res: Response): Promise<Response> {
		const category = req.query.category as string;
		const user_id = Number(req.user.id);

		if (!user_id) {
			throw new BadRequestError('O id do usuário é obrigatório');
		}

		const products = await this.productRepository.findAll(category, user_id);

		return res.status(200).json(products);
	}

	async findById(req: Request, res: Response): Promise<Response> {
		const id = Number(req.params.id);
		const user_id = Number(req.user.id);

		validateRequest({ user_id, id });

		const product = await this.productRepository.findById(id, user_id);

		if (!product) {
			throw new NotFoundError('Produto não encontrado');
		}

		return res.status(200).json(product);
	}

	async create(req: Request, res: Response): Promise<Response> {
		const { name, stock, price, category, description }: IProducts = req.body;
		const user_id = Number(req.user.id);

		console.log(req.user);
		const image = req.file;

		validateRequest({ user_id, name, stock, price });

		const product = await this.productRepository.create({
			user_id,
			name,
			stock,
			price,
			category,
			description
		});

		if (!product) {
			throw new BadRequestError('O produto não foi cadastrado');
		}

		if (image) {
			const file = await s3
				.upload({
					Bucket: process.env.BUCKET_NAME as string,
					Key: `produto/${product.id}/${image.originalname}`,
					Body: image.buffer,
					ContentType: image.mimetype
				})
				.promise();

			product.image = file.Location;
			const productUpdateImage = await this.productRepository.update(
				product,
				product.id,
				user_id
			);

			if (!productUpdateImage) {
				throw new Error('Não foi possível atualizar a imagem do produto');
			}
		}

		return res.status(201).json(product);
	}

	async update(req: Request, res: Response): Promise<Response> {
		const id = Number(req.params.id);
		const { name, stock, price, category, description, image }: IProducts =
			req.body;
		const user_id = Number(req.user.id);

		if (!name && !stock && !price && !category && !description && !image) {
			throw new BadRequestError(
				'Informe ao menos um campo para atualização do produto'
			);
		}

		const product = await this.productRepository.update(
			{
				user_id,
				name,
				stock,
				price,
				category,
				description,
				image
			},
			id,
			user_id
		);

		if (!product) {
			throw new BadRequestError('O produto não foi atualizado');
		}

		return res.status(200).json('produto foi atualizado com sucesso.');
	}

	async delete(req: Request, res: Response): Promise<Response> {
		const id = Number(req.params.id);
		const user_id = Number(req.user.id);

		validateRequest({ user_id, id });

		await this.productRepository.delete(id, user_id);

		return res.status(200).json('Produto deletado com sucesso');
	}
}
