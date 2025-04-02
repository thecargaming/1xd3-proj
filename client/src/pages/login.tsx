import { createPostParameters, basePrefix } from 'net_utils';
import { createRef } from "react"


export default function Login() {
    const email = createRef<HTMLInputElement>();
    const password = createRef<HTMLInputElement>();
    const error = createRef<HTMLParagraphElement>();
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
            console.log('ok');
            return;
        }
        let err = error.current;
        if (err) err.innerHTML = (await res.json()).msg;
    }
    return (
        <div>
            <form onSubmitCapture={handleLogin}>
                <input type="email" ref={email} />
                <input type="password" ref={password} />
                <button>Login</button>
                <p ref={error} />
            </form>
        </div>
    )
}
