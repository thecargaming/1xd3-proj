import React from "react";
import NavBar from "./navbar";

import styles from './layout.module.scss';

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>
        <NavBar />
        <div className={styles.layout}>
            {children}
        </div>
        </>
    )
}
