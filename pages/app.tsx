import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import Container from "../components/Container";
import Heading from "../components/Heading";
import QjButton from "../components/QjButton";
import Label from "../components/Label";
import Button from "../components/Button";
import Badge from "../components/Badge";
import useSWR, {SWRResponse} from "swr";
import fetcher from "../utils/fetcher";
import {DatedObj, QuestionObjGraph} from "../utils/types";
import {format} from "date-fns";
import Skeleton from "react-loading-skeleton";
import SEO from "../components/SEO";

export default function AppPage() {
    const {data: questions, error: questionsError}: SWRResponse<{ data: DatedObj<QuestionObjGraph>[] }, any> = useSWR("/api/question", fetcher);

    return (
        <div className="w-full bg-qj-pale-yellow" style={{minHeight: "100vh"}}>
            <SEO title="Questions"/>
            <hr className="opacity-0"/>
            <Container className="bg-white py-8 rounded-2xl shadow-md mt-24 max-w-6xl" padding={8}>
                <div className="flex items-center">
                    <Heading>Questions</Heading>
                    <QjButton className="ml-auto" href="/q/new" color="yellow">+ New Question</QjButton>
                </div>
                <div className="grid mt-8 mb-4 items-center" style={{gridTemplateColumns: "1fr 6rem 6rem 12rem"}}>
                    <Label>Question</Label>
                    <Label>Tags</Label>
                    <Label>Notes</Label>
                    <Label>Created</Label>
                    <hr className="col-span-4 my-2"/>
                    {(questions && questions.data) ? questions.data.length ? questions.data.map(d => (
                        <>
                            <div className="my-2">
                                <Button href={`/q/${d._id}`} className="text-lg border-b">{d.question}</Button>
                            </div>
                            <div className="flex items-center">
                                {d.tags.map(tag => (
                                    <Badge>{tag}</Badge >
                                ))}
                            </div>
                            <p className="text-lg opacity-40">{d.notesArr.length ? d.notesArr[0].numNotes : 0}</p>
                            <p className="text-lg opacity-20">{format(new Date(d.createdAt), "MMM d, yyyy")}</p>
                        </>
                    )) : <p>No questions</p> : <Skeleton/>}
                </div>
            </Container>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session || !session.userId) return {redirect: {permanent: false, destination: "/auth/signin"}};
    return {props: {}};
}