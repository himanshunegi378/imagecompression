import styles from "./mainMenu.module.css";
import compressionImage from "./compression-image.png";
export function MainMenu({ children }) {
  return <div className={styles.toolbarContainer}>{children}</div>;
}

export function CompressButtton({ className, ...props }) {
  return (
    <button title="Compress Image" type='button' {...props} className={`${styles.button} ${className}`}>
      <img className={styles.image} src={compressionImage} alt="" />
    </button>
  );
}
