import Layout from "components/layout";
import RoundContainer from "components/round_container";
import VLayout from "components/v_layout";
import { AccountInfoContext } from "context";
import { basePrefix, createPostParameters } from "net_utils";
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
    const [accountInfo, updateAccountInfo] = useContext(AccountInfoContext);
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [availability, setAvailability] = useState<Availability[]>([]);
    const selectedCompanyElement = createRef<HTMLSelectElement>();

    const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

    const insertStart = createRef<HTMLInputElement>();
    const insertEnd = createRef<HTMLInputElement>();
    const insertDayOfWeek = createRef<HTMLSelectElement>();
    const insertSubmit = createRef<HTMLButtonElement>();
    const isInsertValid = (): boolean => {
        if (!(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).test(insertStart.current?.value || "")) {
            if (insertSubmit.current) insertSubmit.current.disabled = true;
            return false;
        }
        if (!(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).test(insertEnd.current?.value || "")) {
            if (insertSubmit.current) insertSubmit.current.disabled = true;
            return false;
        }
        if (insertSubmit.current) insertSubmit.current.disabled = false;
        return true;
    }
    const insertAvailability = async () => {
        if (!isInsertValid()) return;
        let start = `${insertStart.current?.value}:00`;
        let end = `${insertEnd.current?.value}:00`;
        let day_of_week: number = parseInt(insertDayOfWeek.current?.value || "0");
        let res = await fetch(basePrefix('/api/representative/set_availability.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                start_time: start,
                end_time: end,
                representative_id: selectedCompany?.representative_id,
                day_of_week: day_of_week,
            })
        });
        if (!res.ok) console.error(await res.json());
        await updateAvailability();
    };

    const deleteAvailabilityIdentifier = createRef<HTMLSelectElement>();
    const deleteAvailability = async () => {
        let res = await fetch(basePrefix('/api/representative/delete_availability.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                availability_id: deleteAvailabilityIdentifier.current?.value
            })
        });
        if (!res.ok) console.error(await res.json());
        await updateAvailability();
    }

    useEffect(()=>{(async() => {
        if (accountInfo !== null) return;
        if (await updateAccountInfo() === null) {
            setTimeout(()=>{
                router.push('/login');
            }, 0);
        };
    })()}, []);

    useEffect(()=>{(async()=>{
        if (accountInfo === null) return;

        let res = await fetch(basePrefix('/api/representative/get_representing.php'));
        if (!res.ok) {console.log(await res.json()); return;}
        let fetchedCompanies =await res.json();
        setCompanies(fetchedCompanies);
        if (fetchedCompanies.length) {
            setSelectedCompany(fetchedCompanies[0]);
            if (selectedCompanyElement.current)
                selectedCompanyElement.current.value = "0";
        }
        await updateAvailability();

    })()}, [accountInfo])

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
                                <div className={styles.form}>
                                    <h1>Insert availability slot</h1>
                                    <div className={styles.field}>
                                        <p>start</p>
                                        <input type="time" ref={insertStart} onInput={isInsertValid} />
                                    </div>
                                    <div className={styles.field}>
                                        <p>end</p>
                                        <input type="time" ref={insertEnd} onInput={isInsertValid} />
                                    </div>
                                    <div className={styles.field}>
                                        <p>Day of week</p>
                                        <select ref={insertDayOfWeek} onInput={isInsertValid} >
                                            {[...Array(7).keys()].map((i) => (
                                                <option value={i}>{DAYS_OF_WEEK[i]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={insertAvailability} ref={insertSubmit}>Insert</button>
                                </div>
                            </RoundContainer>
                            <RoundContainer>
                                <div className={styles.form}>
                                    <h1>Delete availability</h1>
                                    {availability.filter((i) => i.company_name === selectedCompany.company_name).length > 0 ? (
                                        <>
                                        <select ref={deleteAvailabilityIdentifier}>
                                            {availability.filter((i) => i.company_name === selectedCompany.company_name)
                                                .map((i) => (
                                                <option value={i.id}>{DAYS_OF_WEEK[i.day_of_week]} {i.start_time.toLocaleTimeString()} - {i.end_time.toLocaleTimeString()}</option>
                                            ))}
                                        </select>
                                        <button onClick={deleteAvailability}>Delete</button>
                                        </>
                                    ) : (
                                        <p>No availability slots exists for the currently selected company.</p>
                                    )}
                                </div>
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
