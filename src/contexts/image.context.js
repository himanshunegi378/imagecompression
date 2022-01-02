import { createContext, useState } from "react";

export const ImageContext = createContext({});

export const ImageProvider = ({ children }) => {
  const [imageFile, setImageFile] = useState(null);

  return (
    <ImageContext.Provider value={[imageFile, setImageFile]}>
      {children}
    </ImageContext.Provider>
  );
};
