import {useSession} from "next-auth/client";
import Button from "./Button";
import {useRouter} from "next/router";
import QjButton from "./QjButton";

export default function Navbar() {
    const [session, loading] = useSession();
    const router = useRouter();

    return (
        <div className="h-20 flex items-center px-4 sm:px-10 fixed top-0 left-0 right-0">
            <p className="uppercase font-black text-xl text-black">Question Journal</p>
            <div className="ml-auto">
                {(session && router.route !== "/") ? (
                    <img
                        src={session.user.image}
                        alt={`Profile picture of ${session.user.name}`}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="flex items-center">
                        <Button href="/auth/signin" className="mr-4">Sign in</Button>
                        <QjButton href="#waitlist">Sign up for waitlist</QjButton>
                    </div>
                )}
            </div>
        </div>
    );
}