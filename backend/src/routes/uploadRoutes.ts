import express, { Request, Response } from 'express';
import multer from 'multer';
import storage from '../config/cloudinary';

const router = express.Router();
const upload = multer({ storage });

router.post('/', (req: Request, res: Response) => {
    upload.single('image')(req, res, (err: any) => {
        if (err) {
            console.error('CLOUDINARY UPLOAD ERROR:', err);
            return res.status(500).send({
                message: `Cloudinary Error: ${err.message || 'Unknown error'}`,
                error: err
            });
        }

        if (req.file && req.file.path) {
            res.send({
                message: 'Image uploaded successfully',
                image: req.file.path,
            });
        } else {
            res.status(400).send({ message: 'No file uploaded' });
        }
    });
});

export default router;
