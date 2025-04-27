import Layout from "components/layout";
import Link from "next/link";
import HLayout from 'components/h_layout';
import RoundContainer from 'components/round_container';
import VLayout from 'components/v_layout';
import styles from './aboutus.module.scss'
import Image from 'next/image';

// Name:    Ahyan Khan
// Student Number: 400591095
// Date:    2025-04-26
//
// Purpose:
//      About us page for developers


export default function aboutus() {
    return (
        <Layout>
            <p className={styles.title}>Our Developers</p>
            <p className={styles.nontitle}>Our developers are well-experienced people who are dedicated to fitting your needs, they have beautifully created this website to ensure everyone
                satisfaction.
            </p>
            <HLayout>
                <RoundContainer>
                    <VLayout>
                        <p>Ahyan Khan</p>

                        <p>A seasoned developer with a palate for creating highly efficient applications. Learns things on a daily basis</p>

                        <p>Well-versed in creating ideas and solutions to get there.</p>
                        <p>He enjoys learning about coding and it's various ideas and playing video games.</p>

                    </VLayout>
                </RoundContainer>

                <RoundContainer>
                    <VLayout>
                        <p>Patrick Chen</p>


                        <p>Well versed within the epitomes of technology, enjoys learning and doing things on a daily basis.</p>

                        <p>Highly experienced devloper designed at making the lives of other developers easier and to make a smooth clients
                            process.
                        </p>

                        <p>He enjoys coding and playing games and also tinkering with his projects</p>


                    </VLayout>
                </RoundContainer>

                <RoundContainer>
                    <VLayout>
                        <p>Shuhan Zhang</p>

                        <p>Loves book-reading, is very outdoors. </p>

                        <p>He enjoys making things look nice visually and aesthetically</p>

                    </VLayout>
                </RoundContainer>


            </HLayout>
        </Layout>
    )
}

