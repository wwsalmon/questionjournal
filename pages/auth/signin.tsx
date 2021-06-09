import {GetServerSideProps} from "next";
import {getSession, signOut, useSession} from "next-auth/client";
import {useEffect} from "react";
import Link from "next/link";
import SEO from "../../components/SEO";
import SignInButton from "../../components/SignInButton";
import Container from "../../components/Container";
import Heading from "../../components/Heading";

export default function SignIn({notAllowed}: {notAllowed: boolean}) {
    const [session, loading] = useSession();

    useEffect(() => {
        if (session && notAllowed) signOut();
    }, [loading]);

    return (
        <Container className="max-w-sm mt-28" width="full">
            <SEO title="Sign in"/>
            <Heading className="mb-4">Sign in</Heading>
            {notAllowed && (
                <span>No account found for the given email. <Link href="/auth/welcome"><a className="underline">Sign up for a new account here.</a></Link></span>
            )}
            <p className="mb-4">If you already have a Question Journal account, click below to sign in.</p>
            <p>If you don't have an account, <Link href="/auth/welcome"><a className="underline">sign up here.</a></Link></p>
            <div className="mt-4">
                <SignInButton/>
            </div>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session && !session.userId) return {props: {notAllowed: true}};

    if (session && session.userId) {
        return {redirect: {permanent: false, destination: "/app",}};
    } else {
        return {props: {notAllowed: false}};
    }
};