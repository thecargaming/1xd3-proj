import Layout from 'components/layout';
import RoundContainer from 'components/round_container';
import { AccountInfoContext } from 'context';
import { createPostParameters, basePrefix } from 'net_utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createRef, useContext } from "react"
import styles from "./login.module.scss";


export default function Login() {
    const router = useRouter();
    const email = createRef<HTMLInputElement>();
    const password = createRef<HTMLInputElement>();
    const error = createRef<HTMLParagraphElement>();
    const [_, updateAccountInfo] = useContext(AccountInfoContext);
    const handleLogin = async (e: any) => {
        e.preventDefault();

        let res = await fetch(basePrefix('/api/auth/login.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                email:email.current?.value,
                password:password.current?.value
            })
        });
        if (res.ok) {
            updateAccountInfo();
            router.push('/')
            return;
        }
        let err = error.current;
        if (err) err.innerHTML = (await res.json()).msg;
    }
    return (
        <Layout>
            <RoundContainer>
                <form onSubmitCapture={handleLogin} className={styles.form}>
                    <div className={styles.field}>
                        <p>Email</p>
                        <input type="email" ref={email} />
                    </div>
                    <div className={styles.field}>
                        <p>Password</p>
                        <input type="password" ref={password} />
                    </div>
                    <button>Login</button>
                    <p ref={error} />
                    <Link href="/register" className={styles.register}>Register an account</Link>
                </form>
            </RoundContainer>
        </Layout>
    )
}
