import aws from 'aws-sdk';
import 'dotenv/config';

const endpoint = new aws.Endpoint(process.env.ENDPOINT as string);

export const s3 = new aws.S3({
	endpoint,
	credentials: {
		accessKeyId: process.env.KEY_ID as string,
		secretAccessKey: process.env.APP_KEY as string
	}
});

export const getPath = (url: string) => {
	const path = url.split('/');
	const file = path[path.length - 1];
	const folder = path[path.length - 2];
	const bucket = path[path.length - 3];

	return `${bucket}/${folder}/${file}`;
};
