import { createPostParameters, basePrefix } from 'net_utils';
import React, {useEffect, useState} from 'react';
import { createRef } from "react";
import Layout from "components/layout";
import styles from '../css/Style.module.css'

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

    type ChosePerson = {
        full_name: string;
        date: string;
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

    // also could just do that ? "" just in case

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

      const bookingHandler = async (e: any) => {
        e.preventDefault();

        if(!selectedperson){
            return;
        }

        const nameSplit = selectedperson["full_name"].split(" ");

        const res = await fetch(basePrefix('/api/booking/booking.php'), {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
              first_name: nameSplit[0],
              last_name: nameSplit[1],
              date: selectedperson["date"],
              start_time: selectedperson["start_time"],
              end_time: selectedperson["end_time"]
            }).toString()
          });

          if (res.ok){
            console.log("Properly sent.. yayy!");
          }

      }

    const [selectedperson, setselectedperson] = useState<ChosePerson | null>(null);

    function meetingHandler(person: DataInfo) {
        setselectedperson({
            full_name: person["full_name"],
            date: date.current?.value ?? "",
            start_time: person["start_time"],
            end_time: person["end_time"]
        });
    }
      
  return (
    <Layout>
        <div className={styles.main}>
            <div className={styles.form_design}>
                <h1>Booking Date:</h1>
                <form className={styles.test} onSubmitCapture={checkAvailability}>
                    <label htmlFor="company">Company:</label>
                    <select className={styles.check} ref={company_chosen} onChange={representativeInfo}>
                            <option value="" disabled selected>Select a company</option>
                            {companyData.map((company, index) => (
                                    <option key={index} value={company.name}>
                                        {company.name}
                                    </option>
                                ))}
                        </select>

                    <label htmlFor="company">Name:</label>
                    <select className={styles.check} ref={chosen} disabled>

                        <option value="" disabled selected>Select a name</option>
                        {nameData.map((person, index) => (
                                <option key={index} value={person.name}>
                                    {person.name}
                                </option>
                            ))}
                    </select>

                    <label htmlFor="booking-date">Date:</label>
                    <input type="date" className={styles.check} ref={date} name="booking-date"></input>
                    <button className={styles.submit_button} type="submit" id="submit">Check avaliability</button>


                </form>

                {selectedperson && (
                        <div className={styles.appointment_section}>
                            <h1>Booking Details:</h1>
                            <p className={styles.details}>Name: {selectedperson["full_name"]}</p>
                            <p className={styles.details}>Date: {selectedperson["date"]}</p>
                            <p className={styles.details}>Time: {selectedperson["start_time"]}-{selectedperson["end_time"]}</p>
                            <button className={styles.submit_button} onClick={bookingHandler}>Book meeting!</button>
                        </div>
                )}

            </div>

            <div className={styles.tableside}>
                <div className={styles.innertable}>
                    {data.length > 0 ?
                        (data.map((person, index) => (
                            <div className={styles.eachone} key={index} onClick={() => meetingHandler(person)}>
                                <div className={styles.header}>
                                    <h1>{person.full_name}</h1>
                                </div>

                                <div className={styles.body}>
                                    <p>Time: {person.start_time}-{person.end_time}</p>
                                </div>
                            </div>
                        ))
                        ): <p>Please select a date and company that has an avaliable time slot</p>
                    }

        



                </div>

            </div>        
        </div>
    </Layout>
  )
}

