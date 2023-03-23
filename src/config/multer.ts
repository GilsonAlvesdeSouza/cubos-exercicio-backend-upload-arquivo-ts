import multer from 'multer';

const upload = multer({});

export const singleUpload = (arquivo: string) => upload.single(arquivo);
