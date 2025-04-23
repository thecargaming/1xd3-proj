import { createPostParameters, basePrefix } from 'net_utils';
import React, {useState} from 'react';
import { createRef } from "react";
import Layout from "components/layout";


export default function Booking() {
    
    const phone = createRef<HTMLInputElement>();
    const company = createRef<HTMLInputElement>();
    const email = createRef<HTMLInputElement>();
    const chosen = createRef<HTMLSelectElement>();    
    const date = createRef<HTMLInputElement>();


    const handleBooking = async (event: any) => {
        event.preventDefault();
        
        let res = await fetch(basePrefix('/api/booking/booking.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                company: company.current?.value,
                phone: phone.current?.value,
                email: email.current?.value
            })
        });


    }

    type nameInfo = {
        name: string;

    }


    type DataInfo = {
        full_name: string;
        email: string;
        time: string;
      };
      
    const [data, setData] = useState<DataInfo[]>([]);
    const [nameData, setName] = useState<nameInfo[]>([]);

    fetch(basePrefix('/api/booking/names.php'))
    .then(res => res.json())
    .then(data => {
      setName(data);
    })

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

            <form id="booking" onSubmitCapture={handleBooking}>
                <label htmlFor="company">Company:</label>
                <input type="text" ref={company} placeholder='Company Name'></input>
                <label htmlFor="lastname">Email Address:</label>
                <input type="text" ref={email} placeholder='Email Address'></input>
                <label htmlFor="lastname">Phone:</label>
                <input type="tel" ref={phone} placeholder='Phone Number'></input>
                <button type="submit" id="submit">Submit</button>

            </form>   

            <form id="checking" onSubmitCapture={checkAvailability}>

                <select ref={chosen}>
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
                        <p>{person.email}</p>
                        <p>{person.time}</p>
                    </li>
                ))}

            </ul>

        
        </div>
    </Layout>
  )
}

