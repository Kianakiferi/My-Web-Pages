import {
    scaleImage
} from '/libs/xBRZ.js'

let displayScale = 3;
let targetSize = 500;

var Width, Height = 0;

export function ScaleImageAndDraw(ImagePath) {
    if (!(ImagePath == null || ImagePath === "")) {
        let image = new Image();
        image.onload = () => {
            Width = image.width;
            Height = image.height;

            let scaleSize = 6;
            let widthScaled = Width * scaleSize;
            let heightScaled = Height * scaleSize;

            let imageData = ImageToImageData(image);
            let pixels = ImageDataToPixels(imageData);

            let pixelsBlank = GetScaledSizeBlankPixels(scaleSize);

            scaleImage(scaleSize, pixels, pixelsBlank, Width, Height, 0, Height);

            let imageDataScaled = new ImageData(PixelsToDataArray(pixelsBlank), widthScaled, heightScaled);

            let imageSrc = ImageDataToImageSrc(imageDataScaled);

            DrawImageWithNoSmoothing(imageSrc);
            //context.putImageData(imageDataScaled, 0, 0);
            //context.scale(displayScale, displayScale);
            //context.imageSmoothingEnabled = false;
        }
        image.src = ImagePath;
    }
};

function DrawImageWithNoSmoothing(ImageSrc) {
    let imageScaled = new Image();
    imageScaled.onload = () => {
        let canvasScaled = document.getElementById('canvasScaled');
        let context = canvasScaled.getContext('2d');
        canvasScaled.width = targetSize;
        canvasScaled.height = targetSize;

        context.clearRect(0, 0, targetSize, targetSize);
        context.imageSmoothingEnabled = false;
        context.drawImage(imageScaled, 0, 0, targetSize, targetSize);
    };
    imageScaled.src = ImageSrc.data;
}

//#region xBRZ
class ImageSrc {
    constructor(data, width, height) {
        this.data = data;
        this.width = width;
        this.height = height;
    }
}

function PixelsToDataArray(canvasNew) {
    let buffer = [];
    for (let i = 0, len = canvasNew.length; i < len; ++i) {
        let pixel = canvasNew[i];
        let a = (pixel >> 24) & 0xff;
        let r = (pixel >> 16) & 0xff;
        let g = (pixel >> 8) & 0xff;
        let b = (pixel) & 0xff;
        buffer.push(r);
        buffer.push(g);
        buffer.push(b);
        buffer.push(a);
    }

    return new Uint8ClampedArray(buffer);
}

function ImageToImageData(Image) {
    var data;

    try {
        data = DrawOnOffscreenCanvas(Image);
    } catch (e) {
        //Safari and ie don't support offscreen canvas.
        data = DrawOnTempCanvas(Image);
    }
    return data;
}

function DrawOnOffscreenCanvas(Image) {
    let offscreenCanvas = new OffscreenCanvas(Width, Height).getContext('2d');
    let context = offscreenCanvas.getContext('2d');

    context.drawImage(Image, 0, 0, Width, Height);
    return context.getImageData(0, 0, Width, Height);
}

function DrawOnTempCanvas(Image) {
    let tempCanvas = document.getElementById('tempCanvas').getContext('2d');
    tempCanvas.width = Width;
    tempCanvas.height = Height;
    tempCanvas.clearRect(0, 0, Width, Height);

    tempCanvas.drawImage(Image, 0, 0, Width, Height);
    return tempCanvas.getImageData(0, 0, Width, Height);
}

function ImageDataToImageSrc(ImageData) {
    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = ImageData.width;
    tempCanvas.height = ImageData.height;
    let context = tempCanvas.getContext('2d');

    context.putImageData(ImageData, 0, 0);

    return new ImageSrc(
        tempCanvas.toDataURL("image/png"),
        ImageData.width,
        ImageData.height
    )
}

function ImageDataToPixels(imageData) {
    let buffer = Array.from(imageData.data);
    let source = [];
    for (let i = 0, len = buffer.length; i < len; i += 4) {
        let r = buffer[i];
        let g = buffer[i + 1];
        let b = buffer[i + 2];
        let a = buffer[i + 3];
        let pixel = a << 24 | r << 16 | g << 8 | b;
        source.push(pixel);
    }
    return source;
}

function GetScaledSizeBlankPixels(scaleSize) {
    let target = new Array(Width * scaleSize * Height * scaleSize);
    target.fill(0);

    return target;
}
//#endregion