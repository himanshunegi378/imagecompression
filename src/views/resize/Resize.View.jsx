import { useEffect, useState } from 'react';
import ReactCrop from 'react-image-crop';

async function getCroppedImgBlob(image, crop) {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

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
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            },

        );

    })


}


export function ResizeView() {
    const [originalImgUrl, setOriginalImgUrl] = useState('');
    const [originalImageFile, setOriginalImageFile] = useState();
    const [imageUsedForCropping, setImageUsedForCropping] = useState();
    const [croppedImageFile, setCroppedImageFile] = useState();
    const [croppedImageurl, setCroppedImageurl] = useState('');
    const [crop, setCrop] = useState({});

    useEffect(() => {
        if (!originalImageFile) return;
        const imageUrl = URL.createObjectURL(originalImageFile);
        setOriginalImgUrl(imageUrl);
        return () => {
            URL.revokeObjectURL(imageUrl
            );
        }
    }, [originalImageFile])

    useEffect(() => {
        if (!croppedImageFile) return;
        const croppedImageUrl = URL.createObjectURL(croppedImageFile);
        setCroppedImageurl(croppedImageUrl);
        return () => {
            URL.revokeObjectURL(croppedImageUrl);
        }
    }, [croppedImageFile])



    function handleFile(event) {
        const file = event.target.files[0];
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        setOriginalImageFile(file);
    }

    async function handleCropping(crop) {
        const croppedImageBlob = await getCroppedImgBlob(imageUsedForCropping, crop);
        const croppedImageFile = new File([croppedImageBlob], 'croppedImage.jpg', { type: originalImageFile.type, lastModified: Date.now() });
        setCroppedImageFile(croppedImageFile);
    }

    return <div>
        <div>
            <input type={'file'} onChange={handleFile} />
        </div>
        <div>
            {originalImgUrl && <ReactCrop src={originalImgUrl} onImageLoaded={(image) => setImageUsedForCropping(image)} crop={crop} onComplete={handleCropping} onChange={(crop) => setCrop(crop)} alt='' />}
            {croppedImageurl && <img src={croppedImageurl} alt='' />}
        </div>
        <div>
            <a href={croppedImageurl} download={'croppedImage.jpg'}>Download</a>
        </div>
    </div>
}