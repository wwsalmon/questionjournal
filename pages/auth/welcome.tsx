import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SEO from "../../components/SEO";
import SignInButton from "../../components/SignInButton";
import Container from "../../components/Container";
import Heading from "../../components/Heading";
import Link from "next/link";

export default function Welcome({}: {  }) {
    return (
        <Container className="max-w-sm mt-28" width="full">
            <SEO title="Sign in"/>
            <Heading className="mb-4">Welcome to Question Journal</Heading>
            <p>Click the button below to sign in to or sign up for Question Journal with your Google account.</p>
            <div className="mt-4">
                <SignInButton/>
            </div>
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) return {redirect: {permanent: false, destination: session.userId ? "/app" : "/auth/newaccount",}};

    return {props: {}};
};
