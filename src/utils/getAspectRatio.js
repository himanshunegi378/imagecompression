import computedGcd from "compute-gcd";
export const getAspectRatioFromImageFile = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => {
      const imageWidth = img.width;
      const imageHeight = img.height;
      URL.revokeObjectURL(url);
      const gcd = computedGcd([imageWidth, imageHeight]);
      resolve({ wr: imageWidth / gcd, hr: imageHeight / gcd });
    };
    img.src = url;
  });
};

export const getAspectRatioFromDimension = ({ w, h }) => {
  const gcd = computedGcd([w, h]);
  return { wr: w / gcd, hr: h / gcd };
};
