import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import Container from "../../components/Container";
import BackButton from "../../components/BackButton";
import Heading from "../../components/Heading";
import dbConnect from "../../utils/dbConnect";
import {QuestionModel} from "../../models/question";
import {DatedObj, NoteObj, QuestionObj} from "../../utils/types";
import cleanForJSON from "../../utils/cleanForJSON";
import Label from "../../components/Label";
import {format} from "date-fns";
import QjButton from "../../components/QjButton";
import {useState} from "react";
import useSWR, {SWRResponse} from "swr";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import Modal from "../../components/Modal";
import SpinnerButton from "../../components/SpinnerButton";
import Linkify from "react-linkify";
import SEO from "../../components/SEO";
import Button from "../../components/Button";
import Skeleton from "react-loading-skeleton";
import MoreMenu from "../../components/MoreMenu";
import MoreMenuItem from "../../components/MoreMenuItem";
import NoteItem from "../../components/NoteItem";

export default function QuestionPage({question}: { question: DatedObj<QuestionObj> }) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [body, setBody] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    const {data, error}: SWRResponse<{ data: DatedObj<NoteObj>[] }, any> = useSWR(`/api/note?questionId=${question._id}&iter=${iter}`, fetcher);

    function onSubmit() {
        setIsLoading(true);

        axios.post("/api/note", {
            questionId: question._id,
            body: body,
        }).then(() => {
            setIsLoading(false);
            setModalOpen(false);
            setIter(iter + 1);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    return (
        <div className="w-full bg-qj-pale-red" style={{minHeight: "100vh"}}>
            <SEO/>
            <hr className="opacity-0"/>
            <Container className="bg-white py-8 rounded-2xl shadow-md mt-24" padding={8} width="4xl">
                <BackButton href="/app"/>
                <Heading>{question.question}</Heading>
                <div className="flex items-center my-6">
                    <Label>Created</Label>
                    <p className="ml-4">{format(new Date(question.createdAt), "MMM d, yyyy")}</p>
                </div>
                <hr/>
                <div className="flex items-center my-6">
                    <h3 className="font-bold">Notes</h3>
                    <QjButton onClick={() => setModalOpen(true)} className="ml-auto">+ New note</QjButton>
                </div>
                <div
                    className={(data && data.data && data.data.length) ? "grid gap-y-8" : ""}
                    style={{gridTemplateColumns: "8rem 1fr 2rem"}}
                >
                    {(data && data.data) ? data.data.length ? data.data
                        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
                        .map(note => (
                            <NoteItem note={note} key={note._id} iter={iter} setIter={setIter}/>
                        )
                    ) : (
                        <p>No notes</p>
                    ) : (
                        <Skeleton count={2}/>
                    )}
                </div>
            </Container>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session || !session.userId) return {redirect: {permanent: false, destination: "/auth/signin"}};

    try {
        await dbConnect();

        const thisQuestion = await QuestionModel.findById(context.query.questionId);

        if (!thisQuestion) return {notFound: true};

        return {props: {question: cleanForJSON(thisQuestion)}};
    } catch (e) {
        return {notFound: true};
    }
}