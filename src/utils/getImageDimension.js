export const getImageDimension = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => {
      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;
      URL.revokeObjectURL(url);
      resolve({ w: imageWidth, h: imageHeight });
    };
    img.src = url;
  });
};
