import type { AppProps } from "next/app";

import '../global.scss';
import { GlobalStateProvider } from "context";

export default function App({Component, pageProps}: AppProps<any>) {
    return (
        <GlobalStateProvider>
            <Component {...pageProps} />
        </GlobalStateProvider>
    )
}
