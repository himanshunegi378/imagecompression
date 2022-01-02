import styles from "./compressionMenu.module.css";
import tickIcon from "./tick.png";
import crossIcon from "./cross.png";

export function CompressionMenu({ inputButton, doneButton, cancelButton }) {
  return (
    <div className={styles.container}>
      <div
        style={{
          marginRight: "50px",
          display: "flex",
        }}
      >
        <label
          htmlFor="compressed-image-size"
          style={{
            paddingRight: "12px",
          }}
        >
          Compress to:
        </label>
        <span
          style={{
            paddingRight: "3px",
            backgroundColor: "blue",
            borderRadius: "3px",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          {inputButton}
          Mb
        </span>
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
      <img src={tickIcon} className={styles.image} alt="" />
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
      <img src={crossIcon} className={styles.image} alt="" />
    </button>
  );
}
