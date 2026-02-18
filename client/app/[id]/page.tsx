"use client";
import { useParams } from "next/navigation";
import AnswerBox from "@/component/AnswerBox";
import PromptBox from "@/component/PromptBox";

export default function Page() {
    const params = useParams();
    const id = Number(params?.id) || 1;

    return (
        <>
            <PromptBox initialLevel={id} key={id} />
            <AnswerBox response={null} onClose={() => { }} />
        </>
    );
}   