import HLayout from "components/h_layout";
import Layout from "components/layout";
import { RegisterCompany } from "components/register_company";
import { RegisterRepresentative } from "components/register_representative";
import RoundContainer from "components/round_container";
import VLayout from "components/v_layout";
import { AccountInfoContext } from "context";
import { basePrefix } from "net_utils";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import styles from './account.module.scss';
import Link from "next/link";

export default function Profile() {
    const [accountInfo, updateAccountInfo] = useContext(AccountInfoContext);
    const router = useRouter();

    useEffect(()=>{(async() => {
        if (accountInfo !== null) return;
        if (await updateAccountInfo() === null) {
            setTimeout(()=>{
                router.push('/login');
            }, 0);
        };
    })()}, []);

    const logout = async () => {
        let res = await fetch(basePrefix('/api/auth/logout.php'));
        if (!res.ok) {
            console.error(await res.text());
        }
        await updateAccountInfo();
        router.push('/');
    }

    if (accountInfo == null) return <Layout><></></Layout>

    return (
        <Layout>
        <VLayout>
            <RoundContainer>
                <VLayout>
                    <h1>{accountInfo.firstName} {accountInfo.lastName}</h1>
                    <h2>{accountInfo.email}</h2>
                    <button onClick={logout} className={styles.button}>Log out <BiLogOut /></button>
                </VLayout>
            </RoundContainer>
            <HLayout>
                <RegisterCompany />
                <RegisterRepresentative />
            </HLayout>
            <RoundContainer>
                <Link href="/representative">Representative</Link>
            </RoundContainer>
        </VLayout>
        </Layout>
    )
}
