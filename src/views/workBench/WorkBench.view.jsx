import { useState, useContext, useEffect, useRef } from "react";
import { ImageContext } from "../../contexts/image.context";
import { ImagePreviewContainer } from "./components/imagePreview/ImagePreview.component";
import { Layout } from "./components/Layout/Layout.component";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import convertImage from "image-file-resize";

export const WorkBenchView = () => {
  const { state } = useContext(ImageContext);
  const [modifiedFile, setModifiedFile] = useState(state.file);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [viewState, setViewState] = useState("crop");

  useEffect(() => {
    setModifiedFile(state.file);
  }, [state.file]);

  useEffect(() => {
    if (modifiedFile) {
      const url = URL.createObjectURL(modifiedFile);
      setImagePreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      alert("Image is not supported");
    }
  }, [modifiedFile]);

  if (viewState === "crop") {
    return (
      <CropView
        imageUrl={imagePreviewUrl}
        initialCropConfig={{
          unit: "%",
          width: 100,
          aspect: state.config.dimension.w / state.config.dimension.h,
        }}
        onImageCropped={(croppedImageBlob) => {
          const imageFile = new File([croppedImageBlob], modifiedFile.name, {
            type: modifiedFile.type,
          });
          convertImage({
            file: imageFile,
            width: state.config.dimension.w,
            height: state.config.dimension.h,
            type: imageFile.type.split("/")[1],
          })
            .then((resizedImage) => {
              console.log(resizedImage);
              setModifiedFile(resizedImage);
              setViewState("");
            })
            .catch((err) => {
              console.log(`Error while resizing image ${err}`);
              console.log(err.stack);
            });
        }}
      />
    );
  }

  return (
    <Layout
      main={
        <ImagePreviewContainer>
          <ImagePreviewContainer.Image src={imagePreviewUrl} alt="preivew" />
        </ImagePreviewContainer>
      }
    />
  );
};

const CropView = ({ imageUrl, onImageCropped, initialCropConfig }) => {
  const [crop, setCrop] = useState(initialCropConfig);
  const [isProcessing, setIsProcessing] = useState(false);
  const imageToCropRef = useRef(null);
  return (
    <Layout
      main={
        <ImagePreviewContainer>
          {imageUrl && (
            <ReactCrop
              className="ReactCrop__modifiers"
              src={imageUrl}
              onImageLoaded={(image) => (imageToCropRef.current = image)}
              crop={crop}
              onChange={(crop) => setCrop(crop)}
              alt="cropped"
            />
          )}
        </ImagePreviewContainer>
      }
      sidebar={
        <button
          disabled={isProcessing}
          onClick={() => {
            setIsProcessing(true);
            getCroppedImgBlob(imageToCropRef.current, crop).then(
              (croppedImageBlob) => {
                onImageCropped(croppedImageBlob);
              }
            );
          }}
        >
          Done
        </button>
      }
    />
  );
};

async function getCroppedImgBlob(image, crop) {
  const canvas = document.createElement("canvas");
  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    });
  });
}
