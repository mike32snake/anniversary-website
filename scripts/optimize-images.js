import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BACKUP_DIR = path.join(__dirname, '..', 'public-backup');

// Configuration
const MAX_WIDTH = 1920;  // Max width for images
const QUALITY = 80;       // JPEG quality (80 is a good balance)

async function ensureBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('Creating backup of original images...');
    await fs.promises.cp(PUBLIC_DIR, BACKUP_DIR, { recursive: true });
    console.log('✅ Backup created at:', BACKUP_DIR);
  } else {
    console.log('ℹ️  Backup already exists, skipping...');
  }
}

async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();

    // Only process image files (including HEIC)
    if (!['.jpg', '.jpeg', '.png', '.webp', '.heic'].includes(ext)) {
      return { skipped: true };
    }

    const originalStats = await fs.promises.stat(filePath);
    const originalSize = originalStats.size;

    // Load image and get metadata
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Auto-rotate based on EXIF orientation, then strip EXIF (but keep the rotation)
    let processing = image.rotate();

    // Only resize if image is larger than MAX_WIDTH
    if (metadata.width > MAX_WIDTH) {
      processing = processing.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convert to JPEG with optimization
    await processing
      .jpeg({
        quality: QUALITY,
        progressive: true,
        mozjpeg: true
      })
      .toFile(filePath + '.tmp');

    // Replace original with optimized version
    await fs.promises.unlink(filePath);
    await fs.promises.rename(filePath + '.tmp', filePath.replace(/\.(png|webp)$/i, '.jpg'));

    const newStats = await fs.promises.stat(filePath.replace(/\.(png|webp)$/i, '.jpg'));
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    return {
      success: true,
      originalSize,
      newSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message);
    return { error: true };
  }
}

async function processDirectory(dirPath) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  let totalOriginal = 0;
  let totalNew = 0;
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n📁 Processing: ${path.relative(PUBLIC_DIR, dirPath)}`);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subResults = await processDirectory(fullPath);
      totalOriginal += subResults.totalOriginal;
      totalNew += subResults.totalNew;
      processed += subResults.processed;
      skipped += subResults.skipped;
      errors += subResults.errors;
    } else {
      const result = await optimizeImage(fullPath);

      if (result.skipped) {
        skipped++;
      } else if (result.error) {
        errors++;
      } else if (result.success) {
        totalOriginal += result.originalSize;
        totalNew += result.newSize;
        processed++;

        const fileName = path.basename(fullPath);
        const sizeMB = (result.originalSize / 1024 / 1024).toFixed(2);
        const newSizeMB = (result.newSize / 1024 / 1024).toFixed(2);
        console.log(`  ✓ ${fileName}: ${sizeMB}MB → ${newSizeMB}MB (${result.savings}% smaller)`);
      }
    }
  }

  return { totalOriginal, totalNew, processed, skipped, errors };
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('This will optimize all images in the public directory.');
  console.log(`Max width: ${MAX_WIDTH}px | Quality: ${QUALITY}`);

  // Create backup first
  await ensureBackup();

  const startTime = Date.now();

  // Process all directories
  const results = await processDirectory(PUBLIC_DIR);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const originalMB = (results.totalOriginal / 1024 / 1024).toFixed(1);
  const newMB = (results.totalNew / 1024 / 1024).toFixed(1);
  const savedMB = (originalMB - newMB).toFixed(1);
  const savedPercent = ((savedMB / originalMB) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Images processed: ${results.processed}`);
  console.log(`⏭️  Files skipped: ${results.skipped}`);
  console.log(`❌ Errors: ${results.errors}`);
  console.log(`📦 Original size: ${originalMB}MB`);
  console.log(`📦 New size: ${newMB}MB`);
  console.log(`💾 Space saved: ${savedMB}MB (${savedPercent}%)`);
  console.log(`⏱️  Time taken: ${duration}s`);
  console.log('='.repeat(60));
  console.log(`\n💡 Original images backed up to: ${BACKUP_DIR}`);
}

main().catch(console.error);
