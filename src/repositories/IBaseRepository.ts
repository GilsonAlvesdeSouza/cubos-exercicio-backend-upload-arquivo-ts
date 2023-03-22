export default interface IBaseRepository<T> {
	findAll(...rest: any): Promise<T[]>;
	findById(...rest: any): Promise<T | undefined>;
	create(data: T): Promise<T | undefined>;
	update(data: T, ...rest: any): Promise<T | number | undefined>;
	delete(...rest: any): Promise<void>;
}
