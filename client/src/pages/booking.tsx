import { createPostParameters, basePrefix } from 'net_utils';
import React, {useEffect, useState} from 'react';
import { createRef } from "react";
import Layout from "components/layout";


export default function Booking() {
    const chosen = createRef<HTMLSelectElement>();    
    const date = createRef<HTMLInputElement>();
    const company_chosen = createRef<HTMLSelectElement>();    

    type nameInfo = {
        name: string;
    }

    type DataInfo = {
        full_name: string;
        start_time: string;
        end_time: string;
      };

    type companyInfo = {
        name: string;
      }
      
      
    const [companyData, setCompanyData] = useState<companyInfo[]>([]);

    useEffect(() => {
        fetch(basePrefix('/api/booking/companies.php'))
        .then(res => res.json())
        .then(data => {
            setCompanyData(data);
        })
    
    }, []);


    const [data, setData] = useState<DataInfo[]>([]);
    const [nameData, setName] = useState<nameInfo[]>([]);

    
    const representativeInfo = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const companyName = e.target.value;
    
        const res = await fetch(basePrefix('/api/booking/names.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                company: companyName
            }).toString()

        });


        if(res.ok){
            const data = await res.json();
            setName(data);

            if (chosen.current) {    
                chosen.current.disabled = false;
              
            }   
          
        }
            
    }

    const checkAvailability = async (e: any) => {
        e.preventDefault();
      
        const res = await fetch(basePrefix('/api/booking/date.php'), {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: createPostParameters({
            chosen: chosen.current?.value,
            date: date.current?.value
          }).toString()
        });
        
      
        if (res.ok) {
          const data = await res.json(); 
          setData(data);
        }

        
      };
      
  return (
    <Layout>
        <div>
            <h1>Booking</h1>

            <form id="checking" onSubmitCapture={checkAvailability}>

                <select ref={company_chosen} onChange={representativeInfo}>
                        <option value="" disabled selected>Select a company</option>
                        {companyData.map((company, index) => (
                                <option key={index} value={company.name}>
                                    {company.name}
                                </option>
                            ))}
                    </select>


                <select ref={chosen} disabled>
                    {nameData.map((person, index) => (
                            <option key={index} value={person.name}>
                                {person.name}
                            </option>
                        ))}
                </select>

                <label htmlFor="booking-date">Date:</label>
                <input type="date" ref={date} name="booking-date"></input>
                <button type="submit" id="submit">Submit</button>

            </form>

            <ul>
                {data.map((person, index) => (
                    <li key={index}>
                        <p>{person.full_name}</p>
                        <p>{person.start_time}</p>
                        <p>{person.end_time}</p>
                    </li>
                ))}

            </ul>

        
        </div>
    </Layout>
  )
}

