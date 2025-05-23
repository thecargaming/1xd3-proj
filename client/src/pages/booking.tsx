import { createPostParameters, basePrefix } from 'net_utils';
import React, {useEffect,useContext, useState} from 'react';
import { createRef } from "react";
import Layout from "components/layout";
import { useRouter } from "next/router";
import { AccountInfoContext } from "context";
import styles from './booking.module.scss'
import HLayout from 'components/h_layout';
import RoundContainer from 'components/round_container';
import VLayout from 'components/v_layout';
import Link from "next/link";

// Name:    Ahyan Khan
// Student Number: 400591095
// Date:    2025-04-26
//
// Purpose:
//      Booking page where users can book a meeting



export default function Booking() {
    const chosen = createRef<HTMLSelectElement>();    
    const date = createRef<HTMLInputElement>();
    const company_chosen = createRef<HTMLSelectElement>();    

    // Defining the types 
    type nameInfo = {
        name: string;
        id: number;
    }

    type DataInfo = {
        id: number;
        full_name: string;
        start_time: string;
        end_time: string;
      };

    type ChosePerson = {
        id: number;
        full_name: string;
        date: string;
        start_time: string;
        end_time: string;
      };

    type companyInfo = {
        name: string;
      }
      
    
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


    const [companyData, setCompanyData] = useState<companyInfo[]>([]);

    // AJAX queries for a list of companies
    useEffect(() => {
        fetch(basePrefix('/api/booking/companies.php'))
        .then(res => res.json())
        .then(data => {
            setCompanyData(data);
        })
    
    }, []);


    const [data, setData] = useState<DataInfo[]>([]);
    const [nameData, setName] = useState<nameInfo[]>([]);

    
        /**
        * An ajax query that fetches all the names listed 
        * under a specific company the user chose
        * Post Parameters: company: companyname
        */
    
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

        /**
        * An ajax query that checks under 
        * the date the avaliable time slots for the user
        * Post Parameters: chosen (representative): string, date: string
        */

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

        /**
        * Another ajax query that checks under 
        * that submits all the information
        *
        */
        
      const [booked, setbooked] = useState(false);

      const bookingHandler = async (e: any) => {
        e.preventDefault();

        if(!selectedperson){
            return;
        }

        const res = await fetch(basePrefix('/api/booking/booking.php'), {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                representative: selectedperson.id,
              date: selectedperson.date,
              start_time: selectedperson.start_time,
              end_time: selectedperson.end_time,
            })
          });

          if (res.ok){
            setbooked(true);
          }




      }

    const [selectedperson, setselectedperson] = useState<ChosePerson | null>(null);

        /**
        * Basically sets the selected person and 
        * all their information so that it could be submitted
        */

    function meetingHandler(person: DataInfo) {
        setselectedperson({
            id: person.id,
            full_name: person["full_name"],
            date: date.current?.value ?? "",
            start_time: person["start_time"],
            end_time: person["end_time"]
        });
    }

    if (booked) {
        return (
          <Layout>
            <HLayout>
              <VLayout>
                <RoundContainer>
                    <div className={styles.middlehope}>
                        <h1 className={styles.text}>🎉 Appointment Booking Success 🎉</h1>
                        <p className={styles.text}>Congratulations, you have booked a meeting. The hard part is over (probably)</p>
                        <HLayout>
                            <button className={styles.button} onClick={() => router.push("/appointmentbooked")}>Your Appointments</button>
                            <button className={styles.button} onClick={() => router.push("/")}>Home</button>
                        </HLayout>
                    </div>
                </RoundContainer>
                <div>
                </div>
              </VLayout>
            </HLayout>
          </Layout>
        );
      }
    

  return (
    <Layout>
        <HLayout>
            <VLayout>
                <RoundContainer>
                    <VLayout>
                        <h1>Booking Date:</h1>
                        <form className={styles.form} onSubmitCapture={checkAvailability}>
                            <div className={styles.field}>
                                <label htmlFor="company">Company:</label>
                                <select ref={company_chosen} onChange={representativeInfo}>
                                        <option value="" disabled selected>Select a company</option>
                                        {companyData.map((company, index) => (
                                                <option key={index} value={company.name}>
                                                    {company.name}
                                                </option>
                                            ))}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="company">Name:</label>
                                <select ref={chosen} disabled>
                                    <option value="" disabled selected>Select a name</option>
                                    {nameData.map((person, index) => (
                                            <option key={index} value={person.id}>
                                                {person.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="booking-date">Date:</label>
                                <input type="date" ref={date} name="booking-date" onInput={checkAvailability}></input>
                            </div>
                        </form>
                    </VLayout>
                </RoundContainer>

                {selectedperson && (
                    <RoundContainer>
                        <VLayout>
                            <h1>Booking Details:</h1>
                            <div className={styles.field}><p>Name:</p><p>{selectedperson["full_name"]}</p></div>
                            <div className={styles.field}><p>Date:</p><p>{selectedperson["date"]}</p></div>
                            <div className={styles.field}><p>Time:</p><p>{selectedperson["start_time"]}-{selectedperson["end_time"]}</p></div>
                            <button className={styles.button} onClick={bookingHandler}>Book meeting!</button>
                        </VLayout>
                    </RoundContainer>
                )}
            </VLayout>

            <RoundContainer>
                <div className={styles.container}>
                    <VLayout>
                        {data.length > 0 ?
                            (data.map((person, index) => (
                                <div className={styles.personSelect} key={index} onClick={() => meetingHandler(person)}>
                                    <RoundContainer>
                                        <h1>{person.full_name}</h1>
                                        <div className={styles.field}><p>Time:</p><p>{person.start_time}-{person.end_time}</p></div>
                                    </RoundContainer>
                                </div>
                            ))
                            ): <p>Please select a date and company that has an avaliable time slot</p>
                        }

                    </VLayout>
                </div>
            </RoundContainer>
        </HLayout>
    </Layout>
  )
}

