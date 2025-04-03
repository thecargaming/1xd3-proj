import { AccountInfoContext } from 'context';
import styles from './navbar.module.scss';
import Link from 'next/link';
import { useContext } from 'react';
import { BiHome } from 'react-icons/bi';

function AccountInfo() {
    const [accountInfo, _] = useContext(AccountInfoContext);
    if (accountInfo === null) return (
        <>
        <Link href="/login">Login</Link>
        </>
    ); else return (
        <>
        <p>{accountInfo.firstName} {accountInfo.lastName}</p>
        </>
    );
}

export default function NavBar() {
    return (
        <div className={styles.navbar}>
            <div className={styles.left}>
                <Link href="/" className={styles.button}>
                <BiHome />
                </Link>
            </div>
            <div className={styles.right}>
                <AccountInfo />
            </div>
        </div>
    )
}
