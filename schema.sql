drop table if exists products;

drop table if exists users;

create table users (
	id serial primary key,
	name text not null,
	store_name text not null,
	email text not null unique,
	password text not null
);

create table products (
	id serial primary key,
	user_id integer not null,
	name text not null,
	stock integer not null,
	price integer not null,
	category text,
	description text,
	image text,
	foreign key (user_id) references users (id)
);
