import FilterButton from "./filterButton";
import ActiveFilters from "./activeFilters";
import SortButtons from "./sortButtons";
import { getAllEnums } from "@/app/lib/EnumApi";
import { CarEnums } from "@/app/types/CarEnums";
import { getAllMakes } from "@/app/lib/CarApi";
import styles from "./browseBar.module.css";

const FilterBar = async () => {
    const [enums, makes]: [CarEnums, string[]] = await Promise.all([getAllEnums(), getAllMakes()]);

	return (
		<div className={styles.filterBar}>
            <ActiveFilters className="self-center h-full" />
			<div className={styles.filterBarRight}>
                <SortButtons />
				<FilterButton enums={enums} makes={makes} />
			</div>
		</div>
	);
};

export default FilterBar;
