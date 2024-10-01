import express from 'express';
import upload from '../middlewares/upload';
import Car from '../models/Car';


const router = express.Router();

// Route for image upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const image = new Image({
            name: req.body.name,            // Name field from the form
            imagePath: req.file.path,       // Path from multer
        });



        await image.save();
        res.status(201).json({ message: 'Image uploaded successfully', image });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
});

export default router;
