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
    onChange(config);
  };

  return (
    <form onSubmit={handlSubmit}>
      <h3>Dimension</h3>
      <label>w: </label>
      <input
        type="number"
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
      <label>h: </label>
      <input
        type="number"
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
      <h3>Maximum Size</h3>
      <input
        type="number"
        min={0}
        step={1}
        value={config.size}
        onChange={(e) =>
          requestConfigChange({
            ...config,
            size: Number(e.target.value),
          })
        }
      />
      Mb
      <button disabled={isDisabled}>Apply</button>
    </form>
  );
}
