import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const parentDir = path.resolve(projectRoot, '..');
const publicImagesDir = path.join(projectRoot, 'public', 'images');
const outputJsonPath = path.join(projectRoot, 'src', 'images.json');

// Ensure public/images exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const collectedImages = [];

function scanDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
        // Skip the project directory itself and node_modules to avoid infinite loops or clutter
        if (fullPath === projectRoot || file === 'node_modules' || file.startsWith('.')) {
            continue;
        }
        // We only want to scan sibling directories of the project root, not deep recursive scan of everything
        // But the user said "Use all these pictures" and they seem to be in date-named folders in the parent.
        // Let's scan the immediate subdirectories of the parent folder.
         // Actually, the recursive logic here is fine if we limit depth or just be careful.
         // Given the structure shown in `list_dir`, the folders are direct children of "Meghan & Mikey Website".
         // So we are scanning `../` (Meghan & Mikey Website).
         // We should avoid scanning `anniversary-page` (projectRoot).
         
         // If we are currently scanning the parentDir, we dive into subdirs.
         // If we are in a subdir, we might not want to go deeper if the structure is flat-ish.
         // Let's just look for images in the directories found in parentDir.
    } else {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        const destName = `${path.basename(directory)}_${file}`.replace(/[^a-zA-Z0-9._-]/g, '_');
        const destPath = path.join(publicImagesDir, destName);
        
        fs.copyFileSync(fullPath, destPath);
        collectedImages.push(`/images/${destName}`);
        console.log(`Copied: ${file} -> ${destName}`);
      }
    }
  }
}

// Read the parent directory
const parentItems = fs.readdirSync(parentDir);
for (const item of parentItems) {
    const itemPath = path.join(parentDir, item);
    try {
        if (fs.statSync(itemPath).isDirectory()) {
            if (itemPath === projectRoot) continue; // Skip our own project dir
            
            // Scan this directory for images
            const subFiles = fs.readdirSync(itemPath);
            for (const subFile of subFiles) {
                const subFilePath = path.join(itemPath, subFile);
                if (fs.statSync(subFilePath).isFile()) {
                     const ext = path.extname(subFile).toLowerCase();
                     if (imageExtensions.includes(ext)) {
                        // Create a unique name: FolderName_FileName
                        const safeFolderName = item.replace(/[^a-zA-Z0-9]/g, '_');
                        const safeFileName = subFile.replace(/[^a-zA-Z0-9._-]/g, '_');
                        const destName = `${safeFolderName}_${safeFileName}`;
                        const destPath = path.join(publicImagesDir, destName);
                        
                        fs.copyFileSync(subFilePath, destPath);
                        collectedImages.push(`/images/${destName}`);
                        console.log(`Copied: ${subFile} from ${item}`);
                     }
                }
            }
        }
    } catch (e) {
        console.error(`Error processing ${item}:`, e);
    }
}

fs.writeFileSync(outputJsonPath, JSON.stringify(collectedImages, null, 2));
console.log(`\nSuccessfully collected ${collectedImages.length} images.`);
console.log(`Manifest written to ${outputJsonPath}`);
