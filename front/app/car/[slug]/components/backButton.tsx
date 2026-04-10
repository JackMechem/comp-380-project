"use client";

import { useRouter } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";

const BackButton = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-[4px] text-foreground/70 hover:text-accent text-[11pt] font-[500] cursor-pointer duration-150 mb-[20px] w-fit"
        >
            <BiChevronLeft className="text-[16pt]" />
            Back
        </button>
    );
};

export default BackButton;
