import { Route, Routes, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useContext } from "react";
import { actionType, ImageContext } from "../../contexts/image.context";
import { RequirementsInputForm } from "./components/requirementsInputForm/RequirementsInputForm";

export function HomeView() {
  const { dispatch } = useContext(ImageContext);
  const navigate = useNavigate();
  const handleUploadeFile = (file) => {
    if (file.length !== 1) return;
    dispatch({ type: actionType.file, payload: { file: file[0] } });
    navigate("/config");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: handleUploadeFile,
    accept: "image/*",
    maxFiles: 1,
  });

  return (
    <div>
      <Routes>
        <Route
          path="/config"
          element={
            <RequirementsInputForm
              onChange={(config) => {
                dispatch({ type: actionType.config, payload: { config } });
                navigate("/workbench");
              }}
            />
          }
        />
        <Route
          path="/"
          element={
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag 'n' drop some image here, or click to select image</p>
              )}
            </div>
          }
        />
      </Routes>
    </div>
  );
}
