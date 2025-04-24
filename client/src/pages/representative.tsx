import Layout from "components/layout";
import RoundContainer from "components/round_container";
import VLayout from "components/v_layout";
import { AccountInfoContext } from "context";
import { basePrefix } from "net_utils";
import { useRouter } from "next/router";
import { createRef, useContext, useEffect, useState } from "react";
import styles from './representative.module.scss';
import HLayout from "components/h_layout";
import { WeekCalendar } from "components/calendar";

type Company = {
    representative_id: number
    company_name: string 
}

type Availability = {
    day_of_week: number,
    start_time: Date,
    end_time: Date,
    company_name: string,
    id: number,
};

export default function Representative() {
    const [accountInfo, _] = useContext(AccountInfoContext);
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [availability, setAvailability] = useState<Availability[]>([]);
    const selectedCompanyElement = createRef<HTMLSelectElement>();

    const updateAvailability = async () => {
        let res = await fetch(basePrefix('/api/representative/get_availability.php'));
        if (!res.ok) {console.log(await res.json()); return;}
        let availability_raw: any[] = await res.json();
        setAvailability(availability_raw.map((a) => ({
            day_of_week: a.day_of_week,
            company_name: a.company_name,
            start_time: new Date(`1970-01-${4+a.day_of_week} ${a.start_time}`),
            end_time: new Date(`1970-01-${4+a.day_of_week} ${a.end_time}`),
            id: a.id,
        })));
    };

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
        await updateAvailability();
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
                    <VLayout>
                        <RoundContainer>
                            <h1>{selectedCompany.company_name}</h1>
                        </RoundContainer>
                        <HLayout>
                            <RoundContainer>
                                <h1>Insert availability slow</h1>
                            </RoundContainer>
                            <RoundContainer>
                                <h1>Delete availability slow</h1>
                            </RoundContainer>
                        </HLayout>
                        <WeekCalendar events={availability.map((a) => ({
                            begin: a.start_time,
                            end: a.end_time,
                            type: a.company_name === selectedCompany.company_name ? "representative" : "available",
                            name: a.company_name,
                            description: `Meeting id: ${a.id}`
                        }))} />
                    </VLayout>
                ) : <></>}
            </VLayout>
        </Layout>
    )
}
