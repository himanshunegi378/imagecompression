import styles from "./compressionMenu.module.css";

export function CompressionMenu({ inputButton, doneButton, cancelButton }) {
  return (
    <div className={styles.container}>
      <div
        style={{
          marginRight: "50px",
        }}
      >
        <label
          htmlFor="compressed-image-size"
          style={{
            paddingRight: "12px",
          }}
        >
          Compress to(Mb)
        </label>
        {inputButton}
      </div>
      <div className={styles.buttonContainer}>
        {doneButton}
        {cancelButton}
      </div>
    </div>
  );
}

export function CompressionSizeInput({ className, ...props }) {
  return (
    <input
      {...props}
      className={`${styles.input} ${className}`}
      type="number"
      id="compressed-image-size"
    />
  );
}

export function DoneButton({ className, ...props }) {
  return (
    <button
      title="Done"
      type="button"
      {...props}
      className={`${styles.button} ${className}`}
    >
      Done
    </button>
  );
}

export function CancelButton({ className, ...props }) {
  return (
    <button
      title="Cancel"
      type="button"
      {...props}
      className={`${styles.button} ${className}`}
    >
      Cancel
    </button>
  );
}
