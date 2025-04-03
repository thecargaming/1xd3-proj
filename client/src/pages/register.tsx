import Layout from 'components/layout';
import { AccountInfoContext } from 'context';
import { createPostParameters, basePrefix } from 'net_utils';
import { createRef, useContext } from "react"


export default function Login() {
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
            return;
        }
        let err = error.current;
        if (err) err.innerHTML = (await res.json()).msg;
    }
    return (
        <Layout>
            <form onSubmitCapture={handleLogin}>
                <input type="text" ref={firstName} placeholder="first name" />
                <input type="text" ref={lastName} placeholder="last name" />
                <input type="email" ref={email} placeholder="email" />
                <input type="password" ref={password} placeholder="password" />
                <button>Register</button>
                <p ref={error} />
            </form>
        </Layout>
    )
}
