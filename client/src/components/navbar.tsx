import { AccountInfoContext } from 'context';
import styles from './navbar.module.scss';
import Link from 'next/link';
import { useContext } from 'react';
import { BiHome } from 'react-icons/bi';

function AccountInfo() {
    const [accountInfo, _] = useContext(AccountInfoContext);
    if (accountInfo === null) return (
        <>
        <button><Link href="/register">Register</Link></button>
        <button><Link href="/login">Login</Link></button>
        <button><Link href="/aboutus">About us</Link></button>
        </>
    ); else return (
        <>
            <Link href="/booking.html"><button>Booking</button></Link>
            <Link href="/appointmentbooked.html"><button>Booked Appointments</button></Link>
            <Link href="/account">{`${accountInfo.firstName} ${accountInfo.lastName}`}</Link>
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
