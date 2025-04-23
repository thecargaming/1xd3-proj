// vertical page layout
import styles from './v_layout.module.scss';
export default function VLayout({ children }: {children: React.ReactNode}) {
    return (
        <div className={styles.vertical}>
            {children}
        </div>
    )
}
