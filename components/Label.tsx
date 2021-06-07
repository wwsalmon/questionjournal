import React, {ReactNode} from 'react';

export default function Label({children, className}: { children: ReactNode, className?: string }) {
    return (
        <p className={"opacity-40 " + (className || "")}>{children}</p>
    );
}