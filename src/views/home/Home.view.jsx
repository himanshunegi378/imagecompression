import { Route, Routes, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useContext } from "react";
import { actionType, ImageContext } from "../../contexts/image.context";
import { RequirementsInputForm } from "./components/requirementsInputForm/RequirementsInputForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export function HomeView() {
  const { state, dispatch } = useContext(ImageContext);
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
            <div
              className={`container flex justify-center items-center h-screen mx-auto`}
            >
              <RequirementsInputForm
                onChange={(config) => {
                  dispatch({ type: actionType.config, payload: { config } });
                  navigate("/workbench");
                }}
                defaultConfig={{
                  size: state.file && Number(state.file.size),
                  sizeUnit: "B",
                }}
              />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div
              className={`container flex justify-center items-center h-screen mx-auto`}
            >
              <div
                {...getRootProps({
                  className: `w-96 h-40 max-w-full border-4 border-dashed border-blue-400 hover:border-blue-500
                    p-4 rounded-lg cursor-pointer flex justify-center items-center
                    ${isDragActive ? "border-blue-500" : ""}`,
                })}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center text-blue-500 text-lg font-bold">
                    <FontAwesomeIcon icon={faImage} /> Drop the image here ...
                  </p>
                ) : (
                  <p className="text-center text-blue-500 text-lg font-bold">
                    <FontAwesomeIcon icon={faImage} /> Drag 'n' drop some image
                    here, or click to select image
                  </p>
                )}
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
