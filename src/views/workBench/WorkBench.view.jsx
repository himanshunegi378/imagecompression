import { useState, useContext, useEffect } from "react";
import { ImageContext } from "../../contexts/image.context";
import { ImagePreviewContainer } from "./components/imagePreview/ImagePreview.component";
import { Layout } from "./components/Layout/Layout.component";
import { RequirementsInputForm } from "./components/requirementsInputForm/RequirementsInputForm";
import { SideBarContainer } from "./components/SidebarContainer.Component";
export const WorkBenchView = () => {
  const [selectedFile, setSelectedFile] = useContext(ImageContext);
  const [modifiedFile, setModifiedFile] = useState(selectedFile);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const handleConfigChange = (config) => {
    console.log(JSON.stringify(config, null, 2));
  };

  useEffect(() => {
    setModifiedFile(selectedFile);
  }, [selectedFile]);

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

  return (
    <Layout
      main={
        <ImagePreviewContainer>
          <ImagePreviewContainer.Image src={imagePreviewUrl} alt='preivew'/>
        </ImagePreviewContainer>
      }
      sidebar={
        <SideBarContainer>
          <RequirementsInputForm
            isDisabled={false}
            onChange={handleConfigChange}
          />
        </SideBarContainer>
      }
    />
  );
};
