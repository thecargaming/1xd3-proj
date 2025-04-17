import { createPostParameters, basePrefix } from 'net_utils';
import { createRef } from "react";
import Layout from "components/layout";


export default function Booking() {
    
    const phone = createRef<HTMLInputElement>();
    const company = createRef<HTMLInputElement>();
    const email = createRef<HTMLInputElement>();
    const start_date = createRef<HTMLInputElement>();
    const end_date = createRef<HTMLInputElement>();


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

    const checkAvailability = async (e: any) => {
        e.preventDefault();
      
        const res = await fetch(basePrefix('/api/booking/date.php'), {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: createPostParameters({
            start_date: start_date.current?.value,
            end_date: end_date.current?.value
          })
        });
      
        if (res.ok) {
          const data = await res.json(); 
          console.log("Available bookings:", data);
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
                <label htmlFor="booking-date">Start Date:</label>
                <input type="date" ref={start_date} name="booking-date"></input>
                <label htmlFor="booking-date">End Date:</label>
                <input type="date" ref={end_date} name="booking-date"></input>

                <button type="submit" id="submit">Submit</button>

            </form>   


            <h2>Available Times:</h2>
            <button onClick={checkAvailability}>Check Avalibility</button>

        </div>
    </Layout>

    

// Note: echo doesn't work, need to figure out react table type
  )
}

