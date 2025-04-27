import { AccountInfoContext } from 'context';
import styles from './navbar.module.scss';
import Link from 'next/link';
import { useContext } from 'react';
import { BiHome, BiLogIn, BiMessage, BiTime, BiUser } from 'react-icons/bi';

function AccountInfo() {
    const [accountInfo, _] = useContext(AccountInfoContext);
    if (accountInfo === null) return (
        <div className={styles.links}>
        <Link href="/register"><button className={styles.accountButton}><span>Register</span><BiUser /></button></Link>
        <Link href="/login"><button className={styles.accountButton}><span>Login</span><BiLogIn /></button></Link>
        <Link href="/aboutus"><button><span>About us</span><BiMessage/></button></Link>
        </div>
    ); else return (
        <div className={styles.links}>
            <Link href="/booking.html"><button className={styles.accountButton}><span>Booking</span><BiMessage /></button></Link>
            <Link href="/appointmentbooked.html"><button className={styles.accountButton}><span>Booked Appointments</span><BiTime /></button></Link>
            <Link href="/account"><button className={styles.accountButton}><span>{`${accountInfo.firstName} ${accountInfo.lastName}`}</span><BiUser /></button></Link>
        </div>
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
