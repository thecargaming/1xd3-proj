import { createPostParameters, basePrefix } from 'net_utils';
import { createRef } from "react";

export default function Booking() {
    
    const phone = createRef<HTMLInputElement>();
    const company = createRef<HTMLInputElement>();
    const email = createRef<HTMLParagraphElement>();
    const date = createRef<HTMLParagraphElement>();


    const handleBooking = async (e: any) => {
        e.preventDefault();
        
        let res = await fetch(basePrefix('/api/auth/booking.php'), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: createPostParameters({
                company: company.current?.value,
                phone: phone.current?.value,
                email: email.current?.value,
                date: date.current?.value
            })
        });


    }

  return (
    <Layout>
        <div>
            <h1>Booking</h1>
        </div>

        <p>HI</p>

        <form id="booking" onSubmitCapture={handleBooking}>
            <label htmlFor="company">Company:</label>
            <input type="text" ref={company} placeholder='Company Name'></input>
            <label htmlFor="lastname">Email Address:</label>
            <input type="text" ref={email} placeholder='Email Address'></input>
            <label htmlFor="lastname">Phone:</label>
            <input type="tel" ref={phone} placeholder='Phone Number'></input>
            <label htmlFor="booking-date">Date:</label>
            <input type="date" ref={date} name="booking-date"></input>

            <button type="submit" id="submit">Submit</button>

        </form>   
    </Layout>
  )
}

