import { Link } from "react-router";

export default function Index() {
    return (
        <div>
            <p>Hello, world!</p>
            <Link to="login">Login</Link>
        </div>
    )
}
