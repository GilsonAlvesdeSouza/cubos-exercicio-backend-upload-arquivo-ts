export default interface IBaseRepository<T> {
	findAll(...rest: any): Promise<T[]>;
	findById(id: number): Promise<T | undefined>;
	create(data: T): Promise<T>;
	update(id: number, data: T): Promise<T>;
	delete(id: number): Promise<void>;
}
