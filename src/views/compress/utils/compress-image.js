import imageCompression from "browser-image-compression";

export async function compressImage(file, option) {
    option.initialQuality = typeof option.initialQuality === 'undefined' ? 1 : option.initialQuality;
    if (option.initialQuality <= 0.0) {
        throw new Error(`Unable to compress file upto ${option.maxSizeMB} MB`);
    }
    // file size should in MB
    const expectedCompressionSize = option.maxSizeMB;
    const fileCopy = new File([file], file.name, { type: file.type });
    const compressedImage = await imageCompression(fileCopy, option);
    const compressedImageSize = compressedImage.size / (1000 * 1024);
    if (compressedImageSize <= expectedCompressionSize) return compressedImage;
    option.initialQuality -= 0.1;
    return compressImage(file, option);
}
