import { createPostParameters, basePrefix } from 'net_utils';
import React, {useState} from 'react';
import { createRef } from "react";
import Layout from "components/layout";

export default function AppointmentLookup(){

    const email = createRef<HTMLInputElement>();

        type DataInfo = {
            representative: string;
            start_time: string;
            end_time: string;
        };
          
        const [data, setData] = useState<DataInfo[]>([]);
    

    const lookup = async (event:any) => {
        event.preventDefault();

        const res = await fetch(basePrefix('/api/booking/appointmentbooked.php'), {

          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: createPostParameters({
            email: email.current?.value
          }).toString()
        });


        if (res.ok){
            const data = await res.json();
            setData(data);

        }

    }

    // temp keep email for onsubmit cap
    return (
        <Layout>
            <h1>Appointment Lookup</h1>

            <p>Please enter your email address for lookup.</p>


            <form onSubmitCapture={lookup}>
                <input type="email" ref={email} placeholder='email'></input>

            </form>

            <ul>
                {data.map((person, index) => (
                    <li key={index}>
                        <p>{person.representative}</p>
                        <p>{person.start_time}</p>
                        <p>{person.end_time}</p>
                    </li>
                ))}
            </ul>





        </Layout>




        
    )
}