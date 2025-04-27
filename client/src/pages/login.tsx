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
    const submit = createRef<HTMLButtonElement>();
    const error = createRef<HTMLParagraphElement>();
    const [accountInfo, updateAccountInfo] = useContext(AccountInfoContext);
    if (accountInfo != null) {
        // update and try again
        updateAccountInfo();
        if (accountInfo != null) {
            router.push('/account');
            return;
        }
    }

    const isValid = () => {
        if (error.current) error.current.innerHTML = "";
        if (email.current && !(/^[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+/).test(email.current.value)) {
            if (error.current) error.current.innerHTML = "Invalid email";
            if (submit.current) submit.current.disabled = true;
            return false;
        }
        if (password.current && !password.current.value.length) {
            if (error.current) error.current.innerHTML = "Password required";
            if (submit.current) submit.current.disabled = true;
            return false;
        }
        if (submit.current) submit.current.disabled = false;
        return true;
    }
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
            await updateAccountInfo();
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
                        <input type="email" ref={email} onInput={isValid} />
                    </div>
                    <div className={styles.field}>
                        <p>Password</p>
                        <input type="password" ref={password} onInput={isValid} />
                    </div>
                    <button ref={submit} disabled>Login</button>
                    <p ref={error} />
                    <Link href="/register" className={styles.register}>Don't have an account?</Link>
                </form>
            </RoundContainer>
        </Layout>
    )
}
