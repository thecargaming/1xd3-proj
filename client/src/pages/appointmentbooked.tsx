import { createPostParameters, basePrefix } from 'net_utils';
import React, {useEffect,useState,useContext} from 'react';
import Layout from "components/layout";
import styles from '../css/Style.module.css';
import { useRouter } from "next/router";
import { AccountInfoContext } from "context";


export default function AppointmentLookup(){

        type DataInfo = {
            full_name: string;
            date: string;
            start_time: string;
            end_time: string;
        };

        // Redirects if user not registered
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


        // Ajax queries to see all the appointments booked under the user
          
        const [data, setData] = useState<DataInfo[]>([]);
    
        useEffect(() => {
                fetch(basePrefix('/api/booking/appointmentbooked.php'))
                .then(res => res.json())
                .then(data => {
                    setData(data);
                })
            
            }, []);
        

    return (
        <Layout>
            <h1>Appointments</h1>

            {data.length > 0 ? (
                data.map((person, index) => (
                    <div className={styles.eachone} key={index}>
                        <div className={styles.header}>
                            <h1>{person.full_name}</h1>
                        </div>

                        <div className={styles.body}>
                            <p>Date: {person.date}</p>
                            <p>Time: {person.start_time} - {person.end_time}</p>
                        </div>

                    </div>
                ))
                ) : ( <p>No appointments found</p> )}


        </Layout>




        
    )
}