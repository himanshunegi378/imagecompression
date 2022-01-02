import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useContext } from "react";
import { ImageContext } from "../../contexts/image.context";

export function HomeView() {
  const [, setImageFile] = useContext(ImageContext);
  const navigate = useNavigate();
  const handleUploadeFile = (file) => {
    setImageFile(file[0]);
    navigate("/compress");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: handleUploadeFile,
    accept: "image/*",
    maxFiles: 1,
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop some image here, or click to select image</p>
        )}
      </div>
    </div>
  );
}
