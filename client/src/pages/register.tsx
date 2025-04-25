import Layout from 'components/layout';
import { AccountInfoContext } from 'context';
import { createPostParameters, basePrefix } from 'net_utils';
import { useRouter } from 'next/router';
import { createRef, useContext } from "react"
import styles from './register.module.scss';
import RoundContainer from 'components/round_container';


export default function Register() {
    const router = useRouter();
    const firstName = createRef<HTMLInputElement>();
    const lastName = createRef<HTMLInputElement>();
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
    const isValid = (): boolean => {
        if (firstName.current && !firstName.current.value.length) {
            if (error.current) error.current.innerHTML = "First name is required";
            if (submit.current) submit.current.disabled = true;
            return false;
        }
        if (lastName.current && !lastName.current.value.length) {
            if (error.current) error.current.innerHTML = "Last name is required";
            if (submit.current) submit.current.disabled = true;
            return false;
        }
        if (password.current && !password.current.value.length) {
            if (error.current) error.current.innerHTML = "Password is required";
            if (submit.current) submit.current.disabled = true;
            return false;
        }
        if (password.current && password.current.value.length <= 7) {
            if (error.current) error.current.innerHTML = "Password must be at least 8 characters long";
            if (submit.current) submit.current.disabled = true;
            return false;
        }
        if (email.current && !(/^[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+/).test(email.current.value)) {
            if (error.current) error.current.innerHTML = "Invalid email";
            if (submit.current) submit.current.disabled = true;
            return false;
        }
        if (submit.current) submit.current.disabled = false;
        return true;

    }
    const handleLogin = async (e: any) => {
        e.preventDefault();

        let res = await fetch(basePrefix('/api/auth/register.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                first_name: firstName.current?.value,
                last_name: lastName.current?.value,
                email:email.current?.value,
                password:password.current?.value
            })
        });
        if (res.ok) {
            await updateAccountInfo();
            router.push('/');
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
                        <p>First Name</p>
                        <input type="text" ref={firstName} onInput={isValid} />
                    </div>
                    <div className={styles.field}>
                        <p>Last Name</p>
                        <input type="text" ref={lastName} onInput={isValid} />
                    </div>
                    <div className={styles.field}>
                        <p>Email</p>
                        <input type="email" ref={email} onInput={isValid} />
                    </div>
                    <div className={styles.field}>
                        <p>Password</p>
                        <input type="password" ref={password} onInput={isValid} />
                    </div>
                    <button ref={submit} disabled>Register</button>
                    <p ref={error} />
                </form>
            </RoundContainer>
        </Layout>
    )
}
