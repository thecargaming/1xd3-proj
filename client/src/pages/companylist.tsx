import { useState, useEffect, createRef } from "react";
import Layout from "components/layout";
import RoundContainer from "components/round_container";
import VLayout from "components/v_layout";
import styles from './representative.module.scss';
import HLayout from "components/h_layout";


type Company = {
    name: string;
    address?: string;
    phone?: string;
};

export default function CompanyList() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [onlyMyCompanies, setOnlyMyCompanies] = useState<boolean>(false);

    const inputRef = createRef<HTMLInputElement>();

    const fetchCompanies = async (term: string = "", ownOnly: boolean = false) => {
        let url = ownOnly
            ? `/api/representative/search_representing.php?company=${encodeURIComponent(term)}`
            : `/api/company/search.php?company=${encodeURIComponent(term)}`;

        const res = await fetch(url);
        if (!res.ok) {
            setCompanies([]);
            setFilteredCompanies([]);
            setNotFound(true);
            return;
        }
        const data = await res.json();
        const companiesArray = Object.values(data) as Company[];
        setCompanies(companiesArray);
        setFilteredCompanies(companiesArray);
        setNotFound(companiesArray.length === 0);
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSearch = async () => {
        const term = inputRef.current?.value || "";
        setSearchTerm(term);
        await fetchCompanies(term, onlyMyCompanies);
    };

    const handleToggle = async () => {
        setOnlyMyCompanies(!onlyMyCompanies);

        const term = inputRef.current?.value || "";
        await fetchCompanies(term, !onlyMyCompanies);
    };

    return (
        <Layout>
            <VLayout>
                <HLayout>
                    <RoundContainer>
                        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <h1>Search Companies</h1>
                            <div className={styles.field}>
                                <input ref={inputRef} placeholder="Search by company name..." />
                                <input type="submit" value="Search" />
                            </div>
                            <div className={styles.field} style={{ marginTop: '10px' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={onlyMyCompanies}
                                        onChange={handleToggle}
                                        style={{ marginRight: '5px' }}
                                    />
                                    Show only my companies
                                </label>
                            </div>
                        </form>
                    </RoundContainer>
                </HLayout>
                <HLayout>
                    <RoundContainer>
                        <h1>Company List</h1>
                        {notFound ? (
                            <p>No company found.</p>
                        ) : (
                            <ul style={{ listStyleType: "none", padding: 0 }}>
                                {filteredCompanies.map((company, index) => (
                                    <li key={index} style={{
                                        backgroundColor: searchTerm && company.name.toLowerCase().includes(searchTerm.toLowerCase())
                                            ? '#ffff99' : 'transparent', padding: "10px", marginBottom: "5px"
                                    }}>
                                        <strong>{company.name}</strong><br/>
                                        {company.address && <>Address: {company.address}<br/></>}
                                        {company.phone && <>Phone: {company.phone}</>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </RoundContainer>
                </HLayout>
            </VLayout>
        </Layout>
    );
}
