import Layout from "components/layout";
import { AccountInfoContext } from "context";
import { basePrefix } from "net_utils";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BiLogOut } from "react-icons/bi";

export default function Profile() {
    const [accountInfo, updateAccountInfo] = useContext(AccountInfoContext);
    const router = useRouter();
    if (accountInfo == null) {
        setTimeout(()=>{
            router.push('/');
        }, 0);
        return;
    };

    const logout = async () => {
        let res = await fetch(basePrefix('/api/auth/logout.php'));
        if (!res.ok) {
            console.error(await res.text());
        }
        updateAccountInfo();
        router.push('/');
    }

    return (
        <Layout>
        <h1>{accountInfo.firstName} {accountInfo.lastName}</h1>
        <h2>{accountInfo.email}</h2>
        <button onClick={logout}>Log out <BiLogOut /></button>
        </Layout>
    )
}
