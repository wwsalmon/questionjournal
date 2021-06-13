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
import React, {useState} from "react";
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
import {useRouter} from "next/router";
import ellipsize from "ellipsize";

export default function QuestionPage(props: { question: DatedObj<QuestionObj> }) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [body, setBody] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    const {data, error}: SWRResponse<{ data: DatedObj<NoteObj>[] }, any> = useSWR(`/api/note?questionId=${props.question._id}&iter=${iter}`, fetcher);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [question, setQuestion] = useState<DatedObj<QuestionObj>>(props.question);
    const [name, setName] = useState<string>(props.question.question);

    function onEdit() {
        setEditLoading(true);

        axios.post("/api/question", {
            id: question._id,
            question: name,
        }).then(() => {
            setEditLoading(false);
            setEditOpen(false);
            let newQuestion = {...question};
            newQuestion.question = name;
            setQuestion(newQuestion);
        }).catch(e => {
            setEditLoading(false);
            console.log(e);
        });
    }

    function onDelete() {
        setDeleteLoading(true);

        axios.delete("/api/question", {
            data: {
                id: question._id,
            },
        }).then(() => {
            router.push("/app");
        }).catch(e => {
            setDeleteLoading(false);
            console.log(e);
        });
    }

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
            <SEO title={ellipsize(question.question, 30)}/>
            <hr className="opacity-0"/>
            <Container className="bg-white py-8 rounded-2xl shadow-md mt-24" padding={8} width="4xl">
                <BackButton href="/app"/>
                <div className="flex">
                    <Heading>{question.question}</Heading>
                    <MoreMenu className="ml-auto">
                        <MoreMenuItem text="Edit" onClick={() => setEditOpen(true)}/>
                        <MoreMenuItem text="Delete" onClick={() => setDeleteOpen(true)}/>
                    </MoreMenu>
                </div>
                <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
                    <Heading className="my-4">New note</Heading>
                    <div className="grid">
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            className="w-full border p-2 mb-4 text-lg resize-none overflow-hidden"
                            rows={5}
                            style={{gridArea: "1/1/2/2"}}
                        />
                        <div
                            className="w-full border p-2 mb-4 text-lg"
                            style={{gridArea: "1/1/2/2"}}
                        >
                            {body}
                        </div>
                    </div>
                    <SpinnerButton isLoading={isLoading} color="red" onClick={onSubmit} disabled={!body}>Save</SpinnerButton>
                </Modal>
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
                    className={(data && data.data && data.data.length) ? "md:grid gap-y-8" : ""}
                    style={{gridTemplateColumns: "8rem 1fr"}}
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
                <Modal isOpen={editOpen} setIsOpen={setEditOpen}>
                    <Heading className="my-4">Edit question</Heading>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border-b p-2 my-4 text-lg"
                    />
                    <div className="flex items-center">
                        <SpinnerButton
                            isLoading={editLoading}
                            color="red"
                            onClick={onEdit}
                            disabled={!name || name === question.question}
                        >Save</SpinnerButton>
                        <Button onClick={() => setEditOpen(false)} className="ml-4">Cancel</Button>
                    </div>
                </Modal>
                <Modal isOpen={deleteOpen} setIsOpen={setDeleteOpen}>
                    <p className="mb-4">
                        Are you sure you want to delete this project and all its notes? This action cannot be undone.
                    </p>
                    <div className="flex items-center">
                        <SpinnerButton
                            isLoading={deleteLoading}
                            color="red"
                            onClick={onDelete}
                        >Delete</SpinnerButton>
                        <Button onClick={() => setDeleteOpen(false)} className="ml-4">Cancel</Button>
                    </div>
                </Modal>
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