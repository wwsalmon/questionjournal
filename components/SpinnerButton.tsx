import Button from "./Button";
import {ReactNode} from "react";
import QjButton from "./QjButton";

interface SpinnerButtonPropsBase {
    children: ReactNode,
    isLoading: boolean,
    className?: string,
    disabled?: boolean,
    color?: "red" | "yellow",
}

interface SpinnerButtonPropsLink extends SpinnerButtonPropsBase {
    href: string,
    onClick?: never,
}

interface SpinnerButtonPropsButton extends SpinnerButtonPropsBase {
    href?: never,
    onClick: () => any,
}

type SpinnerButtonProps = SpinnerButtonPropsLink | SpinnerButtonPropsButton;

export default function SpinnerButton({children, href, onClick, className, isLoading, disabled, color}: SpinnerButtonProps){
    return (
        <div className="relative inline-block">
            {href ? (
                <QjButton href={href} className={className} disabled={disabled || isLoading} color={color}>
                    <div className={isLoading ? "invisible" : ""}>
                        {children}
                    </div>
                </QjButton>
            ) : (
                <QjButton onClick={onClick} className={className} disabled={disabled || isLoading} color={color}>
                    <div className={isLoading ? "invisible" : ""}>
                        {children}
                    </div>
                </QjButton>
            )}
            {isLoading && <div className="spinner"/>}
        </div>
    )
}