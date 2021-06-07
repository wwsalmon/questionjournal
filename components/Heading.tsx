import {ReactNode} from "react";

export default function Heading({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <h1 className={"text-2xl font-medium " + (className || "")}>
            {children}
        </h1>
    );
}