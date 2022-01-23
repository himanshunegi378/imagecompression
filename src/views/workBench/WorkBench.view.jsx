import { useState, useContext, useEffect, useRef } from "react";
import { ImageContext } from "../../contexts/image.context";
import { ImagePreviewContainer } from "./components/imagePreview/ImagePreview.component";
import { Layout } from "./components/Layout/Layout.component";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import convertImage from "image-file-resize";
import { unitToPixel } from "../../utils/unitToPixel";
import { downloadFile } from "../../utils/downloadFile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

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
            width: unitToPixel(
              state.config.dimension.w,
              state.config.dimension.unit
            ),
            height: unitToPixel(
              state.config.dimension.h,
              state.config.dimension.unit
            ),
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
      sidebar={
        <div className="p-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 active:bg-red-400 text-white font-bold py-2 px-4 rounded-md w-full"
            onClick={() => {
              downloadFile(modifiedFile);
            }}
          >
            Download <FontAwesomeIcon className="ml-1" icon={faDownload} />
          </button>
        </div>
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
      header={
        <div className="flex justify-center items-center shadow-md h-full">
          <h1 className="text-2xl font-bold">Crop Image</h1>
        </div>
      }
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
        <div className="p-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 active:bg-red-400 text-white font-bold py-2 px-4 rounded-md w-full"
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
        </div>
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
