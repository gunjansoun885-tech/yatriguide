const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
const mobileDir = path.join(publicDir, 'mobile');

async function testCrop() {
  const images = ['ch.png', 'nw.png'];

  for (const imgName of images) {
    const inputPath = path.join(publicDir, imgName);
    const meta = await sharp(inputPath).metadata();
    console.log(`${imgName} dimensions: ${meta.width}x${meta.height}`);

    // Option 1: contain fit (100% of image visible with dark background padding)
    await sharp(inputPath)
      .resize({
        width: 750,
        height: 1200,
        fit: 'contain',
        background: { r: 12, g: 10, b: 9, alpha: 1 } // stone-950
      })
      .png()
      .toFile(path.join(mobileDir, `${imgName.replace('.png', '')}_contain.png`));

    // Option 2: position left
    await sharp(inputPath)
      .resize({
        width: 750,
        height: 1200,
        fit: 'cover',
        position: 'left'
      })
      .png()
      .toFile(path.join(mobileDir, `${imgName.replace('.png', '')}_left.png`));

    // Option 3: position right
    await sharp(inputPath)
      .resize({
        width: 750,
        height: 1200,
        fit: 'cover',
        position: 'right'
      })
      .png()
      .toFile(path.join(mobileDir, `${imgName.replace('.png', '')}_right.png`));

    // Option 4: position top
    await sharp(inputPath)
      .resize({
        width: 750,
        height: 1200,
        fit: 'cover',
        position: 'top'
      })
      .png()
      .toFile(path.join(mobileDir, `${imgName.replace('.png', '')}_top.png`));
  }
  console.log("Done generating crop test variants!");
}

testCrop();
