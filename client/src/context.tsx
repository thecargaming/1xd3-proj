import { basePrefix } from "net_utils";
import { createContext, useEffect, useState, type ReactNode } from "react";

export type AccountInfo = {
    firstName: string,
    lastName: string,
    email: string,
};

export const AccountInfoContext = createContext<[AccountInfo | null, ()=>Promise<AccountInfo | null>]>([null, async()=>null]);

export function GlobalStateProvider({children}: {children: ReactNode}) {
    const [accountInfo, setAccountInfo] = useState(null as (AccountInfo | null));
    const updateAccountInfo = async () => {
        let res = await fetch(basePrefix("/api/auth/info.php?name=1&email=1"));
        if (!res.ok) {
            setAccountInfo(null);
            return null;
        }
        let {logged_in, first_name, last_name, email} = await res.json();
        if (logged_in) {
            let a = {
                firstName: first_name,
                lastName: last_name,
                email
            };
            setAccountInfo(a);
            return a;
        } else {
            setAccountInfo(null);
            return null;
        }
    };

    useEffect(()=>{updateAccountInfo()}, []);

    return (
        <AccountInfoContext.Provider value={[accountInfo, updateAccountInfo]}>
            {children}
        </AccountInfoContext.Provider>
    )
}
