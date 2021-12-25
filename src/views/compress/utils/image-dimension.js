export async function imageDimension(imageUrl) {
    const img = new Image();
    img.src = imageUrl;
    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
        img.onerror = () => {
            reject(new Error('Could not load image'));
        };
    });
}