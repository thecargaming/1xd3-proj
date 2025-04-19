import { createRef } from "react";
import RoundContainer from "./round_container";
import { basePrefix, createPostParameters } from "net_utils";
import styles from "./register_company.module.scss";

export function RegisterCompany() {
    const name = createRef<HTMLInputElement>();
    const address = createRef<HTMLInputElement>();
    const phone = createRef<HTMLInputElement>();
    const error = createRef<HTMLParagraphElement>();
    const register = async (e: any) => {
        e.preventDefault();
        if (error.current)
            error.current.innerHTML = "";

        if (!phone.current || !(/^[0-9]{10}$/).test(phone.current?.value)) {
            if (error.current)
                error.current.innerHTML = "invalid phone number";
            return;
        }
        if (!name.current || name.current?.value.length <= 4) {
            if (error.current)
                error.current.innerHTML = "company name is too short";
            return;
        }
        if (!address.current || address.current?.value.length == 0) {
            if (error.current)
                error.current.innerHTML = "address must be provided";
            return;
        }

        let res = await fetch(basePrefix('/api/company/register.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                company: name.current?.value,
                address: address.current?.value,
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
            error.current.innerHTML = "company successfully created";
    }

    return (
        <RoundContainer>
            <form className={styles.form} onSubmitCapture={register}>
                <h1>Register a Company</h1>
                <div className={styles.field}>
                    <p>Company Name</p>
                    <input ref={name} />
                </div>
                <div className={styles.field}>
                    <p>address</p>
                    <input ref={address} />
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
