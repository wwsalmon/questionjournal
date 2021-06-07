import React, {Dispatch, SetStateAction, useState} from 'react';
import {DatedObj, NoteObj} from "../utils/types";
import axios from "axios";
import Label from "./Label";
import {format} from "date-fns";
import MoreMenu from "./MoreMenu";
import MoreMenuItem from "./MoreMenuItem";
import Linkify from "react-linkify";
import Modal from "./Modal";
import SpinnerButton from "./SpinnerButton";
import Button from "./Button";
import Heading from "./Heading";

export default function NoteItem({note, iter, setIter}: { note: DatedObj<NoteObj>, iter: number, setIter: Dispatch<SetStateAction<number>>}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [body, setBody] = useState<string>(note.body);

    function onEdit() {
        setIsLoading(true);

        axios.post("/api/note", {
            id: note._id,
            body: body,
        }).then(() => {
            setIsLoading(false);
            setIter(iter + 1);
            setEditOpen(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e);
        });
    }

    function onDelete() {
        setIsDeleteLoading(true);

        axios.delete("/api/note", {
            data: {
                id: note._id,
            },
        }).then(() => {
            setIsDeleteLoading(false);
            setIter(iter + 1);
            setDeleteOpen(false);
        }).catch(e => {
            setIsDeleteLoading(false);
            console.log(e);
        });
    }

    return (
        <>
            <Label>{format(new Date(note.createdAt), "MMM d, yyyy")}</Label>
            <p className="text-lg content"><Linkify>{note.body}</Linkify></p>
            <MoreMenu>
                <MoreMenuItem text={"Edit"} onClick={() => setEditOpen(true)}/>
                <MoreMenuItem text={"Delete"} onClick={() => setDeleteOpen(true)}/>
            </MoreMenu>
            <Modal isOpen={editOpen} setIsOpen={setEditOpen}>
                <Heading className="my-4">Edit note</Heading>
                <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    className="w-full border p-2 mb-4 text-lg"
                    rows={5}
                />
                <div className="flex items-center">
                    <SpinnerButton
                        isLoading={isLoading}
                        color="red"
                        onClick={onEdit}
                        disabled={!body || body === note.body}
                    >Save</SpinnerButton>
                    <Button onClick={() => setEditOpen(false)} className="ml-4">Cancel</Button>
                </div>
            </Modal>
            <Modal isOpen={deleteOpen} setIsOpen={setDeleteOpen}>
                <p className="mb-4">Are you sure you want to delete this note?</p>
                <div className="flex items-center">
                    <SpinnerButton
                        isLoading={isDeleteLoading}
                        color="red"
                        onClick={onDelete}
                    >Delete</SpinnerButton>
                    <Button onClick={() => setDeleteOpen(false)} className="ml-4">Cancel</Button>
                </div>
            </Modal>
        </>
    );
}