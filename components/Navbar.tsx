import {signOut, useSession} from "next-auth/client";
import Button from "./Button";
import {useRouter} from "next/router";
import QjButton from "./QjButton";
import MoreMenu from "./MoreMenu";
import MoreMenuItem from "./MoreMenuItem";
import Link from "next/link";

export default function Navbar() {
    const [session, loading] = useSession();
    const router = useRouter();

    return (
        <div className="h-20 flex items-center px-4 sm:px-10 fixed top-0 left-0 right-0">
            <Link href={session ? "/app" : "/"}>
                <a>
                    <p className="uppercase font-black text-xl text-black">Question Journal</p>
                </a>
            </Link>
            <div className="ml-auto">
                {(session && router.route !== "/") ? (
                    <MoreMenu customButton={(
                        <img
                            src={session.user.image}
                            alt={`Profile picture of ${session.user.name}`}
                            className="w-8 h-8 rounded-full"
                        />
                    )}>
                        <MoreMenuItem text={"Sign out"} onClick={signOut}/>
                    </MoreMenu>
                ) : (
                    <div className="flex items-center">
                        <Button href="/auth/signin" className="mr-4">Sign in</Button>
                        <QjButton href="/auth/welcome">Sign up</QjButton>
                    </div>
                )}
            </div>
        </div>
    );
}