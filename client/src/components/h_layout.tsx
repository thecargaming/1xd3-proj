// vertical page layout
import styles from './h_layout.module.scss';
export default function HLayout({ children }: {children: React.ReactNode}) {
    return (
        <div className={styles.horizontal}>
            {children}
        </div>
    )
}
