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

async function processMobileImages() {
  console.log("Generating full-view mobile images with zero person cropping...");

  for (const imgName of HERO_IMAGES) {
    const inputPath = path.join(publicDir, imgName);
    const outputPath = path.join(mobileDir, imgName);

    if (!fs.existsSync(inputPath)) {
      console.warn(`Input image not found: ${inputPath}`);
      continue;
    }

    try {
      // 1. Create a dark blurred background from the image itself
      const bgBuffer = await sharp(inputPath)
        .resize({ width: 750, height: 1200, fit: 'cover', position: 'center' })
        .blur(30)
        .modulate({ brightness: 0.4 })
        .toBuffer();

      // 2. Resize original image so 100% of it (including people/subjects) fits inside
      const fgBuffer = await sharp(inputPath)
        .resize({ width: 730, height: 1180, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

      // 3. Composite foreground onto the dark blurred background
      await sharp(bgBuffer)
        .composite([{ input: fgBuffer, gravity: 'center' }])
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`Successfully generated mobile image: public/mobile/${imgName}`);
    } catch (err) {
      console.error(`Error processing ${imgName}:`, err);
    }
  }

  console.log("All mobile images updated with 100% full subject visibility!");
}

processMobileImages();
