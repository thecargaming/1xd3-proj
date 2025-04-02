import Layout from "components/layout";
import Link from "next/link";

export default function Index() {
    return (
        <Layout>
            <p>Hello, world!</p>
            <Link href="/login">Login</Link>
        </Layout>
    )
}
