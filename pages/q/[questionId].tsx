import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import Container from "../../components/Container";
import BackButton from "../../components/BackButton";
import Heading from "../../components/Heading";
import dbConnect from "../../utils/dbConnect";
import {QuestionModel} from "../../models/question";
import {DatedObj, QuestionObj} from "../../utils/types";
import cleanForJSON from "../../utils/cleanForJSON";
import Label from "../../components/Label";
import {format} from "date-fns";
import QjButton from "../../components/QjButton";
import {useState} from "react";

export default function QuestionPage({question}: { question: DatedObj<QuestionObj> }) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <div className="w-full bg-qj-pale-red" style={{minHeight: "100vh"}}>
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