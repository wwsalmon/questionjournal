import {NextSeo} from "next-seo";
import {useRouter} from "next/router";

export default function SEO({
                                  title = "Question Journal: Answer your biggest questions",
                                  description = "Question Journal lets you document your questions and notes about them over time, centering curiosity in your learning.",
                                  imgUrl = null,
                                  authorUsername = null,
                                  publishedDate = null,
                                  noindex = false,
                              }: { title?: string, description?: string, imgUrl?: string, authorUsername?: string, publishedDate?: string, noindex?: boolean }) {
    const router = useRouter();
    const fullTitle = title + (router.asPath === "/" ? "" : " | Question Journal");

    let openGraph = {
        title: fullTitle,
        description: description,
        url: "https://questionjournal.vercel.app" + router.asPath,
        images: imgUrl ? [
            { url: imgUrl }
        ] : [
            // { url: "https://questionjournal.vercel.app/defaultImage.png" }
        ],
    };

    let twitter = {
        site: "@your-at",
        cardType: imgUrl ? "summary_large_image" : "summary",
    };

    return (
        <NextSeo
            title={fullTitle}
            description={description}
            openGraph={openGraph}
            twitter={twitter}
            noindex={noindex}
        />
    );
}