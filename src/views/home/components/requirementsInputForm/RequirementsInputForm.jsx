import { useState } from "react";
import { fileSizeFromTo } from "../../../../utils/fileSizeConversion";

const factoryConfig = {
  dimension: {
    unit: "cm",
    w: 1,
    h: 1,
  },
  size: 1,
  sizeUnit: "MB",
};

export function RequirementsInputForm({
  defaultConfig = {},
  onChange,
  isDisabled = false,
}) {
  const [config, setConfig] = useState({
    ...factoryConfig,
    ...defaultConfig,
  });

  const requestConfigChange = (updatedConfig) => {
    if (isDisabled) return;

    setConfig(updatedConfig);
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;

    onChange(config);
  };

  return (
    <form
      className="border-2 p-4 rounded-md shadow-md shadow-rose-300"
      onSubmit={handlSubmit}
    >
      <h3 className="text-xl font-bold mb-4">Dimension</h3>
      <div className="grid grid-cols-2 gap-4">
        <label>
          <span className="block text-gray-700 text-sm font-bold mb-2">
            <span className="inline">width</span>
            <select
              className="inline appearance-none  bg-white border border-gray-400 hover:border-gray-500 ml-1 px-1 py-1rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              required
              value={config.dimension.unit}
              onChange={(e) => {
                requestConfigChange({
                  ...config,
                  dimension: {
                    ...config.dimension,
                    unit: e.target.value,
                  },
                });
              }}
            >
              <option value="in">Inch</option>
              <option value="cm">Centimeter</option>
              <option value="mm">millimeter</option>
              <option value="px">Pixel</option>
            </select>
          </span>
          <input
            className="border-2 border-gray-400 p-2 rounded-md w-full"
            type="number"
            required
            min={0}
            step={0.01}
            value={config.dimension.w}
            onChange={(e) =>
              requestConfigChange({
                ...config,
                dimension: { ...config.dimension, w: Number(e.target.value) },
              })
            }
          />
        </label>
        <label>
          <span className="block text-gray-700 text-sm font-bold mb-2">
            <span className="inline">Height</span>
            <select
              className="inline appearance-none  bg-white border border-gray-400 hover:border-gray-500 ml-1 px-1 py-1rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              required
              value={config.dimension.unit}
              onChange={(e) => {
                requestConfigChange({
                  ...config,
                  dimension: {
                    ...config.dimension,
                    unit: e.target.value,
                  },
                });
              }}
            >
              <option value="in">Inch</option>
              <option value="cm">Centimeter</option>
              <option value="mm">millimeter</option>
              <option value="px">Pixel</option>
            </select>
          </span>
          <input
            className="border-2 border-gray-400 p-2 rounded-md w-full"
            type="number"
            required
            min={0}
            step={1}
            value={config.dimension.h}
            onChange={(e) =>
              requestConfigChange({
                ...config,
                dimension: { ...config.dimension, h: Number(e.target.value) },
              })
            }
          />
        </label>
        <label>
          <span className="block text-gray-700 text-sm font-bold mb-2">
            <span className="inline">Maximum Size ({config.sizeUnit})</span>
            <select
              className="inline appearance-none bg-white border border-gray-400 hover:border-gray-500 ml-1 px-1 py-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              required
              value={config.sizeUnit}
              onChange={(e) => {
                requestConfigChange({
                  ...config,
                  size: fileSizeFromTo(
                    config.size,
                    config.sizeUnit,
                    e.target.value
                  ).toFixed(2),
                  sizeUnit: e.target.value,
                });
              }}
            >
              <option value="B">Byte</option>
              <option value="KB">Kilobyte</option>
              <option value="MB">Megabyte</option>
            </select>
          </span>
          <input
            className="border-2 border-gray-400 p-2 rounded-md"
            type="number"
            min={0}
            step={0.01}
            value={config.size}
            onChange={(e) =>
              requestConfigChange({
                ...config,
                size: Number(e.target.value),
              })
            }
          />
        </label>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          disabled={isDisabled}
        >
          Apply
        </button>
      </div>
    </form>
  );
}
