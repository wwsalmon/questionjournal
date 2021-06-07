import {ReactNode} from 'react';
import Button from "./Button";
import {FiArrowLeft} from "react-icons/fi";

export default function BackButton({href, className}: { href: string, className?: string }) {
    return (
        <Button href={href}>
            <div className={"flex items-center opacity-50 hover:opacity-75 transition mb-4 " + (className || "")}>
                <FiArrowLeft/>
                <span className="ml-2">Back</span>
            </div>
        </Button>
    );
}