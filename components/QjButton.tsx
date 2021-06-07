import {ReactNode} from "react";
import Link from "next/link";

interface ButtonPropsBase {
    children: ReactNode,
    className?: string,
    color?: "red" | "yellow",
}

interface ButtonPropsLink extends ButtonPropsBase {
    href: string,
    onClick?: never,
}

interface ButtonPropsButton extends ButtonPropsBase {
    href?: never,
    onClick: () => any,
}

type ButtonProps = ButtonPropsLink | ButtonPropsButton;

export default function QjButton({onClick, href, children, className, color = "red"}: ButtonProps) {
    const classNames = "h-10 rounded-full px-3 flex items-center font-medium " + ({"red": "bg-qj-red text-white ", "yellow": "bg-qj-yellow "}[color]) + (className || "");

    return href ? (
        <Link href={href}>
            <a className={classNames}>
                {children}
            </a>
        </Link>
    ) : (
        <button onClick={onClick} className={classNames}>
            {children}
        </button>
    );
}