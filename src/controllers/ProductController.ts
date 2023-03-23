import { Request, Response } from 'express';
import { getPath, s3 } from '../utils/imageUtility';
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
		this.uploadImageProduct = this.uploadImageProduct.bind(this);
		this.deleteImageProduct = this.deleteImageProduct.bind(this);
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
		const { name, stock, price, category, description }: IProducts = req.body;
		const user_id = Number(req.user.id);

		if (!name && !stock && !price && !category && !description) {
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
				description
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

	async uploadImageProduct(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;
		const user_id = Number(req.user.id);
		const image = req.file;

		validateRequest({ user_id, id, image });

		const product = await this.productRepository.findById(id, user_id);

		if (!product) {
			throw new NotFoundError('Produto não encontrado');
		}

		if (product.image) {
			await s3.deleteObject({
				Bucket: process.env.BUCKET_NAME as string,
				Key: getPath(product.image as string)
			});
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

		return res.status(200).json('Imagem do produto atualizada com sucesso');
	}

	async deleteImageProduct(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;
		const user_id = Number(req.user.id);

		validateRequest({ user_id, id });

		const product = await this.productRepository.findById(id, user_id);

		if (!product) {
			throw new NotFoundError('Produto não encontrado');
		}

		if (!product.image) {
			throw new BadRequestError('Não existe imagem para ser excluída');
		}
		const del = await s3
			.deleteObject({
				Bucket: process.env.BUCKET_NAME as string,
				Key: getPath(product.image as string)
			})
			.promise();

		product.image = null;

		const productUpdateImage = await this.productRepository.update(
			product,
			product.id,
			user_id
		);

		if (!productUpdateImage) {
			throw new Error('Não foi possível remover a imagem do produto');
		}

		return res.status(200).json('Imagem do produto excluída com sucesso');
	}
}
