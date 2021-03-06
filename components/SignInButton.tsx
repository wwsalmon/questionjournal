import Button from "./Button";
import {FaGoogle} from "react-icons/fa";
import {signIn} from "next-auth/client";
import QjButton from "./QjButton";

export default function SignInButton() {
    return (
        <QjButton onClick={() => signIn("google")}>
            <div className="flex items-center">
                <FaGoogle/><span className="ml-2">Sign in</span>
            </div>
        </QjButton>
    );
}