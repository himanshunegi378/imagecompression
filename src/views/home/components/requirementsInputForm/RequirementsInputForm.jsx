import { useState } from "react";

const factoryConfig = {
  dimension: {
    w: 1,
    h: 1,
  },
  size: 1,
};

export function RequirementsInputForm({
  defaultConfig,
  onChange,
  isDisabled = false,
}) {
  const [config, setConfig] = useState(defaultConfig || factoryConfig);

  const requestConfigChange = (updatedConfig) => {
    if (isDisabled) return;

    setConfig(updatedConfig);
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    // change w,h form cm to pixel

    onChange(config);
  };

  return (
    <form className="border-2 p-4 rounded-md shadow-md shadow-rose-300" onSubmit={handlSubmit}>
      <h3 className="text-xl font-bold mb-4">Dimension</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
              <option value="">Select a unit</option>
              <option value="in">Inch</option>
              <option value="cm">Centimeter</option>
              <option value="mm">millimeter</option>
              <option value="px">Pixel</option>
            </select>
          </label>
        </div>
        <label>
          <span className="block text-gray-700 text-sm font-bold mb-2">
            width
          </span>
          <input
            className="border-2 border-gray-400 p-2 rounded-md w-full"
            type="number"
            required
            min={0}
            step={1}
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
            height
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
            Maximum Size (MB)
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
          Mb
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
