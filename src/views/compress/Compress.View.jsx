import { useEffect, useMemo, useRef, useState } from 'react';
import makeCancellablePromise from 'make-cancellable-promise'
import lodash from 'lodash';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { compressImage } from './utils/compress-image';
import { Layout } from './components/Layout/Layout.component';
import styles from './compress.module.css';
// import { useDropzone } from 'react-dropzone';

function CompressView() {
    // const { acceptedFiles, getRootProps, getInputProps } = useDropzone({accept: 'image/*'});

    const [imgUrl, setImgUrl] = useState('');
    const [file, setFile] = useState();
    const [modifiedFile, setModifiedFile] = useState();
    const [fileInImageFormat, setFileInImageFormat] = useState();
    const [compressionSize, setCompressionSize] = useState(1);
    const [crop, setCrop] = useState({})
    const [isCompressing, setIsCompressing] = useState(false);
    const fileSelectorRef = useRef();

    useEffect(() => {
        // clone imgurl
        const preivousImageUrl = lodash.cloneDeep(imgUrl);
        return () => {
            URL.revokeObjectURL(preivousImageUrl);
        }
    }, [imgUrl]);

    useEffect(() => {
        if (!file || !compressionSize) return
        setIsCompressing(true);
        const { promise, cancel } = makeCancellablePromise(compressImage(file, { maxSizeMB: compressionSize, initialQuality: 0.9 }));
        promise
            .then(async (compressedFile) => {
                const compressedImageurl = URL.createObjectURL(compressedFile);
                setImgUrl(compressedImageurl);
                setModifiedFile(compressedFile);
            })
            .catch((err) => {
                alert(err.message);
            })
            .finally(() => {
                setIsCompressing(false);
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
        if (file && !file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        setFile(file);
    }



    return (
        <div >
            <Layout
                header={
                    <header className={styles.header}>
                        <input style={{
                            display: 'none'
                        }} type={'file'} ref={fileSelectorRef} onChange={handleFile} />
                        <label htmlFor='compressed-image-size'>Compressed Image Size(Mb)</label>
                        <input type='number' min={0.1} step={0.1} defaultValue={compressionSize} onChange={handleCompressSizeChange} id='compressed-image-size' />
                    </header>
                }
                main={<div className={styles.main}>
                    {isCompressing && <div className={styles.image_processing}>Processing... </div>}
                    {imgUrl && <img className={styles.image_view} src={imgUrl} crop={crop} alt='compressed' />}
                    {/* {imgUrl && <ReactCrop className='ReactCrop__modifiers' src={imgUrl} crop={crop} onChange={(crop) => setCrop(crop)} alt='compressed' />} */}
                </div>}
                sidebar={<div className={styles.sidebar}>
                    {/* {imgUrl && <ReactCrop src={imgUrl} crop={crop} onChange={(crop) => setCrop(crop)} alt='compressed' />} */}
                    {/* image download link */}
                        <button
                        style={{
                            width: '100%'
                        }}
                        className={`${styles.button} ${styles.button__button2}`}
                            onClick={() => {
                                fileSelectorRef.current?.click();
                            }}
                        >Select File</button>

                    {modifiedFile && <>
                        <div>
                            Name: {modifiedFile?.name}
                        </div>
                        <div>
                            Size: {modifiedFile?.size / 1000} kb
                        </div>
                    </>}
                    {imgUrl && <a href={imgUrl} download={modifiedFile?.name} >Download</a>}
                </div>}
            />
        </div>
    );
}

export default CompressView;
