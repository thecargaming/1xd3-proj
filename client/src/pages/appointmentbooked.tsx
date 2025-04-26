import { createPostParameters, basePrefix } from 'net_utils';
import React, {useEffect,useState} from 'react';
import Layout from "components/layout";
import styles from './Style.module.css'


export default function AppointmentLookup(){

        type DataInfo = {
            full_name: string;
            start_time: string;
            end_time: string;
        };
          
        const [data, setData] = useState<DataInfo[]>([]);
    
        useEffect(() => {
                fetch(basePrefix('/api/booking/appointmentbooked.php'))
                .then(res => res.json())
                .then(data => {
                    setData(data);
                })
            
            }, []);
        

    // temp keep email for onsubmit cap
    // apply .length to rest
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
                            <p>Time: {person.start_time} - {person.end_time}</p>
                        </div>

                    </div>
                ))
                ) : ( <p>No appointments found</p> )}


        </Layout>




        
    )
}