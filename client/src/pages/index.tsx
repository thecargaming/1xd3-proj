import Link from "next/link";

export default function Index() {
    return (
        <div>
            <p>Hello, world!</p>
            <Link href="/login">Login</Link>
        </div>
    )
}
