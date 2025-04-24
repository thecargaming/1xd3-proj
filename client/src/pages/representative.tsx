import Layout from "components/layout";
import RoundContainer from "components/round_container";
import VLayout from "components/v_layout";
import { AccountInfoContext } from "context";
import { basePrefix } from "net_utils";
import { useRouter } from "next/router";
import { createRef, useContext, useEffect, useState } from "react";
import styles from './representative.module.scss';
import HLayout from "components/h_layout";

type Company ={
    representative_id: number
    company_name: string 
} 

export default function Representative() {
    const [accountInfo, _] = useContext(AccountInfoContext);
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const selectedCompanyElement = createRef<HTMLSelectElement>();

    useEffect(()=>{(async() => {
        if (accountInfo == null) {
            setTimeout(()=>{
                router.push('/login');
            }, 0);
            return;
        };

        let res = await fetch(basePrefix('/api/representative/get_representing.php'));
        if (!res.ok) {console.log(await res.json()); return;}
        setCompanies(await res.json());
        if (companies.length) {
            setSelectedCompany(companies[0])
            if (selectedCompanyElement.current)
                selectedCompanyElement.current.value = "0";
        }
    })()}, []);

    const [selectedCompany, setSelectedCompany] = useState(null as Company | null);

    return (
        <Layout>
            <VLayout>
                <RoundContainer>
                    <VLayout>
                        <h1> You are representing {companies.length} companies </h1>
                        <HLayout>
                            <p>Modify</p>
                            <select className={styles.companyList} onChange={(e) => setSelectedCompany(companies[parseInt(e.target.value)])} ref={selectedCompanyElement}>
                            {[...Array(companies.length).keys()]
                                .map((i) => ({index: i, company: companies[i]}))
                                .map(({index, company}) => (
                                <option value={index}>{company.company_name}</option>
                            ))}
                            </select>
                        </HLayout>
                    </VLayout>
                </RoundContainer>
                {selectedCompany ? (
                    <RoundContainer>
                        <h1>{selectedCompany.company_name}</h1>
                    </RoundContainer>
                ) : <></>}
            </VLayout>
        </Layout>
    )
}
