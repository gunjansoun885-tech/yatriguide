const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const HERO_IMAGES = [
  "oo1.png",
  "g1.png",
  "ch.png",
  "nw.png",
  "opp.png",
  "jj1.png",
  "nn1.png",
  "s1.png",
  "kk2.png",
];

const publicDir = path.join(__dirname, '../public');
const mobileDir = path.join(publicDir, 'mobile');

if (!fs.existsSync(mobileDir)) {
  fs.mkdirSync(mobileDir, { recursive: true });
}

async function processImages() {
  console.log("Processing mobile images...");
  for (const imgName of HERO_IMAGES) {
    const inputPath = path.join(publicDir, imgName);
    const outputPath = path.join(mobileDir, imgName);

    if (!fs.existsSync(inputPath)) {
      console.warn(`Input image not found: ${inputPath}`);
      continue;
    }

    try {
      const metadata = await sharp(inputPath).metadata();
      console.log(`Original ${imgName}: ${metadata.width}x${metadata.height}`);

      // Generate mobile portrait version (e.g. 750x1200 or fitting portrait aspect ratio cleanly)
      await sharp(inputPath)
        .resize({
          width: 750,
          height: 1200,
          fit: 'cover',
          position: 'center'
        })
        .png({ quality: 85 })
        .toFile(outputPath);

      console.log(`Created mobile image: public/mobile/${imgName}`);
    } catch (err) {
      console.error(`Error processing ${imgName}:`, err);
    }
  }
  console.log("All mobile images created successfully!");
}

processImages();
