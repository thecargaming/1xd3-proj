import styles from './round_container.module.scss';

export default function RoundContainer({ children }: {children: React.ReactNode}) {
    return (
        <div className={styles.container}>
        {children}
        </div>
    )
}
