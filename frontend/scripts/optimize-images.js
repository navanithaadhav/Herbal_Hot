
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');
const PUBLIC_DIR = path.join(__dirname, '../public');
const ASSETS_IMAGES_DIR = path.join(__dirname, '../src/assets/images');

const processImage = async (filePath, outputName, width, quality = 80) => {
    try {
        const image = sharp(filePath);
        const metadata = await image.metadata();

        let pipeline = image.webp({ quality });

        if (width && metadata.width > width) {
            pipeline = pipeline.resize(width);
        }

        const outputPath = path.join(path.dirname(filePath), outputName);
        console.log(`Optimizing ${filePath} -> ${outputPath}`);
        await pipeline.toFile(outputPath);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
};

const run = async () => {
    // 1. Process Logo
    const logoPath = path.join(ASSETS_IMAGES_DIR, 'logo.png');
    if (fs.existsSync(logoPath)) {
        // Logo doesn't strictly need webp if transparency is key and simple, but webp handles transparency well.
        // Let's just resize it if it's huge, or convert to webp.
        // The user complained about logo being 2.8MB.
        await processImage(logoPath, 'logo.webp', 300); // 300px width is plenty for header
    }

    // Also check public/logo.png if it exists and is used
    const publicLogoPath = path.join(PUBLIC_DIR, 'logo.png');
    if (fs.existsSync(publicLogoPath)) {
        await processImage(publicLogoPath, 'logo.webp', 300);
    }


    // 2. Process Product Images in public/images
    if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
        const files = fs.readdirSync(PUBLIC_IMAGES_DIR);
        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png)$/i)) {
                await processImage(
                    path.join(PUBLIC_IMAGES_DIR, file),
                    file.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
                    800 // Max width 800 for product details is good
                );
            }
        }
    }

    // 3. Process Background in src/assets/images
    const bgPath = path.join(ASSETS_IMAGES_DIR, 'background.jpg');
    if (fs.existsSync(bgPath)) {
        await processImage(bgPath, 'background.webp', 1920);
    }

    console.log('Image optimization complete!');
};

run();
