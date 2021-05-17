import { scaleImage } from '/libs/xBRZ.js'

let canvasScaled = document.querySelector('#canvasScale');
let context = canvasScaled.getContext('2d');

var pixelPerfect = new CodePeg.PixelPerfect($('canvas.pixelperfect'), {
    urlTag: 'url',
    scaleTag: 'scale',
    filter: 'nearestneighbor'
});
let srcImage = new Image();
srcImage.src = '/images/Pixel/bookshelf.png';

srcImage.onload = () => {
    let { width, height } = srcImage;

    context.drawImage(srcImage, 0, 0, width, height);
    let imageData = context.getImageData(0, 0, width, height);

    let buffer = Array.from(imageData.data);
    let source = [];
    for (let i = 0, len = buffer.length; i < len; i += 4) {
        let r = buffer[i];
        let g = buffer[i + 1];
        let b = buffer[i + 2];
        let a = buffer[i + 3];
        let pixel = a << 24 | r << 16 | g << 8 | b;
        source.push(pixel)
    }

    let scaleSize = 6;
    let target = new Array(width * scaleSize * height * scaleSize);
    target.fill(0);
    scaleImage(scaleSize, source, target, width, height, 0, height);

    let bufferScale = [];
    for (let i = 0, len = target.length; i < len; ++i) {
        let pixel = target[i];
        let a = (pixel >> 24) & 0xff;
        let r = (pixel >> 16) & 0xff;
        let g = (pixel >> 8) & 0xff;
        let b = (pixel) & 0xff;
        bufferScale.push(r);
        bufferScale.push(g);
        bufferScale.push(b);
        bufferScale.push(a);
    }

    let widthScaled = width * scaleSize;
    let heightScaled = height * scaleSize;

    let scaleBuffer = new Uint8ClampedArray(bufferScale);
    let imageDataScaled = new ImageData(scaleBuffer, widthScaled, heightScaled);

    canvasScaled.width = 300;
    canvasScaled.height = 300;

    context.putImageData(imageDataScaled, 0, 0)
    context.scale(displayScale, displayScale);
    context.drawImage(canvasScaled, 0, 0, 314, 314);

}