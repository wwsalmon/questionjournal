import QjButton from "../components/QjButton";
import axios from "axios";
import {useState} from "react";
import SEO from "../components/SEO";

interface WaitlistAPIRes {
    data: {
        current_priority: number,
        referral_link: string,
        registered_email: string,
        total_referrals: number,
        total_waiters_currently: number,
        user_id: string,
    }
}

export default function Home() {
    const [email, setEmail] = useState<string>("");
    const [submitted, setSubmitted] = useState<WaitlistAPIRes>(null);
    const [error, setError] = useState<any>(null);

    return (
        <>
            <SEO/>
            <div className="w-full pt-32 pb-56 bg-qj-yellow text-center px-4 sm:px-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-black max-w-2xl mx-auto">A notetaking app that helps you answer your biggest questions</h1>
                <p className="sm:text-xl my-8 max-w-2xl mx-auto">Question Journal lets you document your questions and notes about them over time, centering curiosity in your learning.</p>
                <div className="flex my-8" id="waitlist">
                    {submitted ? (
                        <p className="text-center max-w-4xl mx-auto p-4 rounded-md bg-qj-pale-yellow">
                            You are in <strong>position {submitted && submitted.data.current_priority}</strong>.
                            Get your friends to sign up with this link to move up in the list: <code>{submitted && submitted.data.referral_link}</code>
                        </p>
                    ) : (
                        <QjButton href="/auth/welcome" className="mx-auto">Give your curiosity superpowers</QjButton>
                    )}
                </div>
            </div>
            <img src="/hero.svg" alt="Screenshot of Question Journal" className="w-full max-w-4xl mx-auto -mt-48 px-4 sm:px-10"/>
            <p className="my-32 text-xl leading-relaxed max-w-2xl px-4 mx-auto" style={{color: "#71717A"}}>
                In the past few years, I've found <a className="underline" href="https://postulate.us/@samsonzhang/p/2021-03-12-How-to-Have-Original-Thoughts%3A-3fXWPXwup49YMJF6ZLPHQy">asking "bad questions"</a> to be one of my most meaningful sources of learning and exploration. I've kept a Notion table full of questions, with notes added over time.
                <br/><br/>
                I've since moved off of Notion, but wanted to continue my question-asking habits and have a well-built system to support it. I think there's a lot of potential to question-centric notetaking, too, extending beyond Notion's capabilities. Thus, for my own sake and as a platform for experimentation, Question Journal was born.
                <br/><br/>
                If you value learning and curiosity, I'd encourage you to try out Question Journal too, or simply keep a list of questions in your preferred app. It'll do you wonders.
                <br/><br/>
                Question Journal is still in development. It's a simple project, but not a priority of mine to build, so it may take a while 😅 Sign up for the waitlist above to be notified when it's ready, or <a className="underline" href="https://twitter.com/wwsalmon">follow me on Twitter</a> for updates!
            </p>
        </>
    )
}