export default interface IBaseRepository<T> {
	findAll(): Promise<T[]>;
	findById(id: string): Promise<T | undefined>;
	create(data: T): Promise<T | Partial<T>>;
	update(id: string, data: T): Promise<T>;
	delete(id: string): Promise<void>;
}
