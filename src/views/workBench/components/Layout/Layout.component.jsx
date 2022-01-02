import styles from './layout.module.css';

export function Layout({header, main, sidebar, toolbar }) {
    return <div className={styles.layout}>
        <div className={styles.header}>{header}</div>
        <div className={styles.main}>{main}</div>
        <div className={styles.toolbar}>{toolbar}</div>
        <div className={styles.sidebar}>{sidebar}</div>
    </div>
}