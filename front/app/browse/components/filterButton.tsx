"use client";
import { useEffect } from "react";
import { VscSettings } from "react-icons/vsc";
import { useSidebarStore } from "@/stores/sidebarStore";
import { CarEnums } from "@/app/types/CarEnums";
import styles from "./browseBar.module.css";

interface FilterButtonProps {
    enums: CarEnums;
    makes: string[];
}

const FilterButton = ({ enums, makes }: FilterButtonProps) => {
    const { toggleFilter, registerEnums, registerMakes } = useSidebarStore();

    useEffect(() => {
        registerEnums(enums);
        registerMakes(makes);
    }, [enums, makes]);

    return (
        <button onClick={toggleFilter} className={styles.filterBtn}>
            <VscSettings />
        </button>
    );
};

export default FilterButton;
