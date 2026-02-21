import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Directories containing source images
const imageDirs = [
    path.resolve(__dirname, '../../frontend/assets'),
    path.resolve(__dirname, '../../frontend/images'),
];

// Desired output formats and sizes
interface TargetSpec {
    width: number; // max width
    height: number; // max height
    formats: ('webp' | 'avif' | 'jpeg')[]; // output formats
}

// Map of relative image paths (or patterns) to target specs
const specs: Record<string, TargetSpec> = {
    // Logos (displayed 60x60)
    'logo-j7nQFvIz.png': { width: 60, height: 60, formats: ['webp', 'avif'] },
    'logo-BKdvDCOO.webp': { width: 60, height: 60, formats: ['webp', 'avif'] },
    // Hero background (displayed 1920x600)
    'background-CqhUna1X.webp': { width: 1920, height: 600, formats: ['webp', 'avif'] },
    // Product thumbnails (displayed ~336x336)
    // Use a wildcard for any image in the images folder
    '*': { width: 336, height: 336, formats: ['webp', 'avif'] },
};

async function processImage(filePath: string) {
    const fileName = path.basename(filePath);
    const dir = path.dirname(filePath);
    const spec = Object.entries(specs).find(([pattern]) => {
        if (pattern === '*') return true;
        return pattern === fileName;
    })?.[1] ?? specs['*'];

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Resize only if larger than target dimensions
    const resizeOptions = {
        width: spec.width,
        height: spec.height,
        fit: 'inside' as const,
        withoutEnlargement: true,
    };

    for (const fmt of spec.formats) {
        const outPath = path.join(dir, `${path.parse(fileName).name}.${fmt}`);
        await image
            .clone()
            .resize(resizeOptions)
            .toFormat(fmt, { quality: 80 }) // 80% quality is a good trade‑off
            .toFile(outPath);
        console.log(`Generated ${outPath}`);
    }
}

async function walk(dir: string) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(fullPath);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(ext)) {
                await processImage(fullPath);
            }
        }
    }
}

(async () => {
    for (const dir of imageDirs) {
        if (fs.existsSync(dir)) {
            await walk(dir);
        } else {
            console.warn(`Directory not found: ${dir}`);
        }
    }
    console.log('Image optimization complete');
})();
