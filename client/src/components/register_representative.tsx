import { createRef } from "react";
import RoundContainer from "./round_container";
import { basePrefix, createPostParameters } from "net_utils";
import styles from "./register_representative.module.scss";

export function RegisterRepresentative() {
    const name = createRef<HTMLInputElement>();
    const email = createRef<HTMLInputElement>();
    const phone = createRef<HTMLInputElement>();
    const error = createRef<HTMLParagraphElement>();
    const register = async (e: any) => {
        e.preventDefault();
        if (error.current)
            error.current.innerHTML = "";

        if (!name.current || name.current?.value.length == 0) {
            if (error.current)
                error.current.innerHTML = "company name must be provided";
            return;
        }
        if (!phone.current || (phone.current.value.length != 0 && !(/^[0-9]{10}$/).test(phone.current?.value))) {
            if (error.current)
                error.current.innerHTML = "invalid phone number";
            return;
        }
        if (!email.current || (email.current.value.length != 0 && !(/^[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]+/).test(email.current.value))) {
            if (error.current)
                error.current.innerHTML = "email is invalid";
            return;
        }

        let res = await fetch(basePrefix('/api/representative/register.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                company: name.current?.value,
                email: email.current?.value,
                phone: phone.current?.value,
            })
        });
        if (!res.ok) {
            let { msg } = await res.json();
            if (error.current)
                error.current.innerHTML = msg;
            return;
        }
        if (error.current)
            error.current.innerHTML = "representative successfully created";
    }

    return (
        <RoundContainer>
            <form className={styles.form} onSubmitCapture={register}>
                <h1>Register as a Representative</h1>
                <div className={styles.field}>
                    <p>Company Name</p>
                    <input ref={name} />
                </div>
                <div className={styles.field}>
                    <p>email</p>
                    <input ref={email} />
                </div>
                <div className={styles.field}>
                    <p>phone</p>
                    <input ref={phone} />
                </div>
                <input type="submit" value="Register" />
                <p ref={error}/>
            </form>
        </RoundContainer>
    )
}
