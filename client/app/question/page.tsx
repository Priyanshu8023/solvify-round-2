"use client";
import AnswerBox from "@/component/AnswerBox";
import PromptBox from "@/component/PromptBox";

export default function Page() {
    return (
        <>
            <PromptBox />
            <AnswerBox response={null} onClose={() => { }} />
        </>
    );
}   