import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import Container from "../../components/Container";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import {FiArrowLeft} from "react-icons/fi";
import BackButton from "../../components/BackButton";
import {useState} from "react";
import SpinnerButton from "../../components/SpinnerButton";
import axios from "axios";
import {useRouter} from "next/router";
import SEO from "../../components/SEO";

export default function NewQuestion() {
    const router = useRouter();
    const [question, setQuestion] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/question", {
            question: question,
            tags: [],
        }).then(res => {
            router.push(`/q/${res.data.id}`);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        })
    }

    return (
        <div className="w-full bg-qj-yellow" style={{minHeight: "100vh"}}>
            <SEO title="New question"/>
            <hr className="opacity-0"/>
            <Container className="bg-white py-8 rounded-2xl shadow-md mt-24" padding={8} width="4xl">
                <BackButton href="/app"/>
                <Heading>New question</Heading>
                <input
                    type="text"
                    className="w-full border-b p-2 my-4 text-lg"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="What big question has been on your mind?"
                />
                <SpinnerButton isLoading={isLoading} disabled={!question} onClick={onSubmit} color="yellow">Save</SpinnerButton>
            </Container>
        </div>
    );
}

const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session || !session.userId) return {redirect: {permanent: false, destination: "/auth/signin"}};
    return {props: {}};
}