const supportedUnits = ["cm", "in", "mm", "px"];

export function unitToPixel(magnitude, unit) {
  if (!supportedUnits.includes(unit)) {
    throw new Error("Unit is not supported");
  }
  switch (unit) {
    case "cm": {
      return (magnitude * 96) / 2.54;
    }
    case "in": {
      return magnitude * 96;
    }
    case "mm": {
      return (magnitude * 96) / 25.4;
    }
    case "px": {
      return magnitude;
    }
    default: {
      throw new Error("Unit is not supported");
    }
  }
}
