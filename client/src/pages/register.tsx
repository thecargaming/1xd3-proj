import Layout from 'components/layout';
import { AccountInfoContext } from 'context';
import { createPostParameters, basePrefix } from 'net_utils';
import { useRouter } from 'next/router';
import { createRef, useContext } from "react"
import styles from './register.module.scss';
import RoundContainer from 'components/round_container';


export default function Login() {
    const router = useRouter();
    const firstName = createRef<HTMLInputElement>();
    const lastName = createRef<HTMLInputElement>();
    const email = createRef<HTMLInputElement>();
    const password = createRef<HTMLInputElement>();
    const error = createRef<HTMLParagraphElement>();
    const [_, updateAccoutInfo] = useContext(AccountInfoContext);
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
            updateAccoutInfo();
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
                        <input type="text" ref={firstName}/>
                    </div>
                    <div className={styles.field}>
                        <p>Last Name</p>
                        <input type="text" ref={lastName} />
                    </div>
                    <div className={styles.field}>
                        <p>Email</p>
                        <input type="email" ref={email} />
                    </div>
                    <div className={styles.field}>
                        <p>Password</p>
                        <input type="password" ref={password} />
                    </div>
                    <button>Register</button>
                    <p ref={error} />
                </form>
            </RoundContainer>
        </Layout>
    )
}
