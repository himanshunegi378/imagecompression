import { createContext, useReducer } from "react";
export const actionType = {
  file: "file",
  config: "config",
};

const initialState = {
  file: null,
  config: {
    dimension: {
      unit: "cm",
      w: 1,
      h: 1,
    },
    size: 1,
    sizeUnit: "MB",
  },
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.file: {
      const { file } = action.payload;
      return {
        ...state,
        file,
      };
    }
    case actionType.config: {
      const { config } = action.payload;
      return {
        ...state,
        config,
      };
    }
    default:
      return { ...state };
  }
};

export const ImageContext = createContext({});

export const ImageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ImageContext.Provider value={{ state, dispatch }}>
      {children}
    </ImageContext.Provider>
  );
};
