import { useEffect, useMemo, useState } from 'react';
import makeCancellablePromise from 'make-cancellable-promise'
import lodash from 'lodash';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { compressImage } from './utils/compress-image';

function CompressView() {

    const [imgUrl, setImgUrl] = useState('');
    const [file, setFile] = useState();
    const [compressionSize, setCompressionSize] = useState(1);
    const [crop, setCrop] = useState({})
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        // clone imgurl
        const preivousImageUrl = lodash.cloneDeep(imgUrl);
        return () => {
            URL.revokeObjectURL(preivousImageUrl);
        }
    }, [imgUrl]);

    useEffect(() => {
        if (!file || !compressionSize) return
        setIsResizing(true);
        const { promise, cancel } = makeCancellablePromise(compressImage(file, { maxSizeMB: compressionSize, initialQuality: 0.9 }));
        promise
            .then(async (compressedFile) => {
                const compressedImageurl = URL.createObjectURL(compressedFile);
                setImgUrl(compressedImageurl);
            })
            .catch((err) => {
                alert(err.message);
            })
            .finally(() => {
                setIsResizing(false);
            });

        return () => {
            cancel();
        }
    }, [file, compressionSize])

    const handleCompressSizeChange = useMemo(() => lodash.debounce((e) => {
        setCompressionSize(Number(e.target.value))
    }, 1000), [])

    function handleFile(event) {
        const file = event.target.files[0];
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        setFile(file);
    }

    return (
        <div >
            <div>
                <input type={'file'} onChange={handleFile} />
                <label htmlFor='compressed-image-size'>Compressed Image Size(Mb)</label>
                <input type='number' min={0.1} step={0.1} defaultValue={compressionSize} onChange={handleCompressSizeChange} id='compressed-image-size' />
            </div>
            <div>
                {isResizing && <div>Resizing...</div>}
                {imgUrl && <ReactCrop src={imgUrl} crop={crop} onChange={(crop) => setCrop(crop)} alt='compressed' />}
                {/* image download link */}
                {imgUrl && <a href={imgUrl} download={file.name} >Download</a>}
            </div>

        </div>
    );
}

export default CompressView;
