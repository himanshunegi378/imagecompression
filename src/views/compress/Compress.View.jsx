import { useEffect, useMemo, useRef, useState } from "react";
import makeCancellablePromise from "make-cancellable-promise";
import lodash from "lodash";
// import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { compressImage } from "./utils/compress-image";
import { Layout } from "./components/Layout/Layout.component";
import styles from "./compress.module.css";
import { useUndoRedo } from "../hooks/useUndoRedo";
import {
  CompressButtton,
  MainMenu,
} from "./components/menus/mainMenu/MainMenu.component";
import {
  CancelButton,
  CompressionMenu,
  CompressionSizeInput,
  DoneButton,
} from "./components/menus/compressionMenu/CompressionMenu.component";
// import { useDropzone } from 'react-dropzone';

const TOOLBAR_OPTION = {
  crop: "crop",
  compress: "compress",
  mainMenu: "mainMenu",
};

const defaultConfig = {
  compressionSize: "",
  crop: {},
};

function CompressView() {
  // const { acceptedFiles, getRootProps, getInputProps } = useDropzone({accept: 'image/*'});
  const { undo, redo, canRedo, canUndo, push, flush } = useUndoRedo();
  const [imgUrl, setImgUrl] = useState("");
  const [originalFile, setOriginalFile] = useState();
  const [modifiedFile, setModifiedFile] = useState();
  const [config, setConfig] = useState(defaultConfig);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileSelectorRef = useRef();
  const [fileBeforeManipulation, setFileBeforeManipulation] = useState();
  const [currentMenu, setCurrentMenu] = useState(TOOLBAR_OPTION.mainMenu);

  useEffect(() => {
    if (!modifiedFile) return;
    const newImageUrl = URL.createObjectURL(modifiedFile);
    setImgUrl(newImageUrl);
    return () => {
      URL.revokeObjectURL(newImageUrl);
    };
  }, [modifiedFile]);

  const recentCompression = () => {
    let promise,
      cancel = () => {};
    return (file, option) => {
      cancel();
      const data = makeCancellablePromise(compressImage(file, option));
      promise = data.promise;
      cancel = data.cancel;
      return promise;
    };
  };
  const compress = recentCompression();
  useEffect(() => {
    /*
      anytime selecte toolbar changes we want the current modified image to store in some variable
      so in case user cancels then we can restore the image to its state before user started to manipulate it
      */
    if (currentMenu === TOOLBAR_OPTION.mainMenu) return;
    if (!fileBeforeManipulation) setFileBeforeManipulation(modifiedFile);
  }, [currentMenu, fileBeforeManipulation, modifiedFile]);

  const handleCompressSizeChange = useMemo(
    () =>
      lodash.debounce((e) => {
        if (!modifiedFile) return;
        const newCompressionSize = Number(e.target.value);
        setIsProcessing(true);
        compress(modifiedFile, {
          maxSizeMB: newCompressionSize,
          initialQuality: 1,
        })
          .then((compressedFile) => setModifiedFile(compressedFile))
          .catch((err) => alert(err.message))
          .finally(() => setIsProcessing(false));
        setConfig((config) => ({
          ...config,
          compressionSize: newCompressionSize,
        }));
      }, 1000),
    [modifiedFile, compress]
  );

  function handleFile(event) {
    const file = event.target.files[0];
    if (file && !file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }
    setOriginalFile(file);
    setModifiedFile(file);
    flush();
    push(file);
  }

  let CurrentToolbarMenu;
  switch (currentMenu) {
    case TOOLBAR_OPTION.compress:
      // CurrentToolbarMenu = (
      //   <div>
      //     <label htmlFor="compressed-image-size">
      //       Compressed Image Size(Mb)
      //     </label>
      //     <input
      //       type="number"
      //       min={0.1}
      //       step={0.1}
      //       defaultValue={""}
      //       onChange={handleCompressSizeChange}
      //       id="compressed-image-size"
      //     />
      //     <input
      //       type="button"
      //       value="Done"
      // onClick={() => {
      //   push(modifiedFile);
      //   setFileBeforeManipulation(undefined);
      //   setCurrentMenu(TOOLBAR_OPTION.mainMenu);
      // }}
      //     />
      //     <input
      //       type="button"
      //       value="Cancel"
      // onClick={() => {
      //   setModifiedFile(fileBeforeManipulation);
      //   setFileBeforeManipulation(undefined);
      //   setCurrentMenu(TOOLBAR_OPTION.mainMenu);
      // }}
      //     />
      //   </div>
      // );
      CurrentToolbarMenu = (
        <CompressionMenu
          inputButton={
            <CompressionSizeInput onChange={handleCompressSizeChange} />
          }
          doneButton={
            <DoneButton
              onClick={() => {
                push(modifiedFile);
                setFileBeforeManipulation(undefined);
                setCurrentMenu(TOOLBAR_OPTION.mainMenu);
              }}
            />
          }
          cancelButton={
            <CancelButton
              onClick={() => {
                setModifiedFile(fileBeforeManipulation);
                setFileBeforeManipulation(undefined);
                setCurrentMenu(TOOLBAR_OPTION.mainMenu);
              }}
            />
          }
        />
      );
      break;
    case TOOLBAR_OPTION.mainMenu:
      // CurrentToolbarMenu = (
      //   <div>
      //     <input
      //       type={"button"}
      //       onClick={() => setCurrentMenu(TOOLBAR_OPTION.compress)}
      //       value={"Compress"}
      //     />
      //   </div>
      CurrentToolbarMenu = (
        <MainMenu>
          <CompressButtton
            disabled={!modifiedFile}
            onClick={() => setCurrentMenu(TOOLBAR_OPTION.compress)}
          />
        </MainMenu>
      );
      break;
    default:
      CurrentToolbarMenu = <div>How did it get here?</div>;
  }

  return (
    <div>
      <Layout
        header={
          <header className={styles.header}>
            <input
              style={{
                display: "none",
              }}
              type={"file"}
              ref={fileSelectorRef}
              onChange={handleFile}
            />

            <input
              type="button"
              disabled={!canUndo()}
              value={"undo"}
              onClick={() => {
                const snapShot = undo();
                if (snapShot) setModifiedFile(snapShot);
              }}
            />

            <input
              type="button"
              disabled={!canRedo()}
              value={"redo"}
              onClick={() => {
                const snapshot = redo();
                if (snapshot) setModifiedFile(snapshot);
              }}
            />
          </header>
        }
        main={
          <div className={styles.main}>
            {isProcessing && (
              <div className={styles.image_processing}>Processing... </div>
            )}
            {imgUrl && (
              <img
                className={styles.image_view}
                src={imgUrl}
                crop={config.crop}
                alt="compressed"
              />
            )}
            {/* {imgUrl && <ReactCrop className='ReactCrop__modifiers' src={imgUrl} crop={crop} onChange={(crop) => setCrop(crop)} alt='compressed' />} */}
          </div>
        }
        sidebar={
          <div className={styles.sidebar}>
            {/* {imgUrl && <ReactCrop src={imgUrl} crop={crop} onChange={(crop) => setCrop(crop)} alt='compressed' />} */}
            {/* image download link */}
            <button
              style={{
                width: "100%",
              }}
              className={`${styles.button} ${styles.button__button2}`}
              onClick={() => {
                fileSelectorRef.current?.click();
              }}
            >
              Select File
            </button>

            {modifiedFile && (
              <>
                <div>Name: {modifiedFile?.name}</div>
                <div>Size: {modifiedFile?.size / 1000} kb</div>
              </>
            )}
            {imgUrl && (
              <a href={imgUrl} download={modifiedFile?.name}>
                Download
              </a>
            )}
          </div>
        }
        toolbar={CurrentToolbarMenu}
      />
    </div>
  );
}

export default CompressView;
