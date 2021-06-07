import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import Container from "../components/Container";
import Heading from "../components/Heading";
import QjButton from "../components/QjButton";
import Label from "../components/Label";
import Button from "../components/Button";
import Badge from "../components/Badge";

export default function AppPage() {
    const testData = [{
        question: "How does being an immigrant affect one's relationship with their childhood?",
        archived: false,
        tags: ["life"],
        userId: "asdfasdf",
        createdAt: "Feb 22, 2021"
    }];

    return (
        <div className="w-full bg-qj-pale-yellow" style={{minHeight: "100vh"}}>
            <hr className="opacity-0"/>
            <Container className="bg-white py-8 rounded-2xl shadow-md mt-24 max-w-6xl" padding={8}>
                <div className="flex items-center">
                    <Heading>Questions</Heading>
                    <QjButton className="ml-auto" onClick={() => null} color="yellow">+ New Question</QjButton>
                </div>
                <div className="grid mt-8 mb-4 items-center" style={{gridTemplateColumns: "1fr 6rem 6rem 12rem"}}>
                    <Label>Question</Label>
                    <Label>Tag</Label>
                    <Label>Notes</Label>
                    <Label>Created</Label>
                    <hr className="col-span-4 my-2"/>
                    {testData.map(d => (
                        <>
                            <div className="my-2">
                                <Button href="/app" className="text-lg border-b">{d.question}</Button>
                            </div>
                            <div className="flex items-center">
                                {d.tags.map(tag => (
                                    <Badge>{tag}</Badge >
                                ))}
                            </div>
                            <p className="text-lg opacity-40">2</p>
                            <p className="text-lg opacity-20">{d.createdAt}</p>
                        </>
                    ))}
                </div>
            </Container>
        </div>
    );
}

const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session || !session.userId) return {redirect: {permanent: false, destination: "/auth/signin"}};
    return {props: {}};
}