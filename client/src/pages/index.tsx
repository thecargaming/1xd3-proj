import Layout from "components/layout";
import Link from "next/link";
import HLayout from 'components/h_layout';
import RoundContainer from 'components/round_container';
import VLayout from 'components/v_layout';
import styles from './index.module.scss'
import Image from 'next/image';

// Name:    Ahyan Khan
// Student Number: 400591095
// Date:    2025-04-26
//
// Purpose:
//      Landing page





export default function Index() {
    return (
        <Layout>
            <VLayout>
                <div className={styles.banner}>
                            <h1 className={styles.title}>Banner Image</h1>
                        </div>

                <p className={styles.title}>Welcome to the Appointment Booking Website</p>
                <p className={styles.nontitle}>We are delighted to fit your needs</p>
                <p className={styles.nontitle}>Please login/register in order to book your meeting.</p>
                    <HLayout>

                        <RoundContainer>
                            <VLayout>
                                <p>Our statement:</p>

                                <p>Scheduling, anytime, anywhere, with just a press of a button</p>
                            </VLayout>

                            </RoundContainer>

                        <RoundContainer>
                            <VLayout>
                                <p>Our commitment:</p>

                                <p>To deliver a seamless experience with managing time and clients. 
                                    
                                    Whether you are a user or a representative, this application was designed seamlessly for you.
                                </p>
                            </VLayout>
                        </RoundContainer>

                        <RoundContainer>
                                <p>Our CEO:</p>
                                <Image src="/images/ceo.jpeg" alt="CEO IMAGE" width={200} height={200}/>
                                <p>What our CEO believes in:</p>
                                <p>"To be everything is it to be nothing at all"</p>
                        </RoundContainer>

                </HLayout>

                <RoundContainer>
                    <VLayout>
                        <p>CEO Statement:</p>

                        <p>I hope that you enjoy this web application that I funded millions of dollars into (allegedly). I am an entrepeneurer who loves the outdoors
                            but also a very busy person who has many companies that people want to book meetings with. This website helps alleviate some of my issues and 
                            I hope as both a user or a company that it can help alleviate some of your issues as well.

                            I can now spend time reading, working-out, and can write my new self-help book titled "how to look like you're working while googling pictures
                            of otters."
                        </p>

                    </VLayout>

                </RoundContainer>
            </VLayout>
        </Layout>
    )
}

