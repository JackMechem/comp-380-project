import { FaCar, FaFastForward, FaRing, FaTruck, FaTruckPickup } from "react-icons/fa";
import { FaDiamond, FaGears } from "react-icons/fa6";
import { GiCutDiamond, GiDiamondRing } from "react-icons/gi";
import { IoSpeedometer } from "react-icons/io5";

const LandingPageFilterButtons = () => {
	return (
		<div className="flex w-fit gap-[20px] self-center">
            <div className="flex items-center justify-center gap-[10px] bg-accent rounded-full px-[20px] py-[6px] text-primary font-[500]">
                <FaCar />
                Featured
            </div>
            <div className="flex items-center justify-center gap-[10px] rounded-full px-[20px] py-[6px] text-foreground font-[500]">
                <FaTruckPickup />
                Pickup Trucks
            </div>
            <div className="flex items-center justify-center gap-[10px] rounded-full px-[20px] py-[6px] text-foreground font-[500]">
                <IoSpeedometer />
                Sport
            </div>
            <div className="flex items-center justify-center gap-[10px] rounded-full px-[20px] py-[6px] text-foreground font-[500]">
                <GiCutDiamond />
                Luxury
            </div>
		</div>
	);
};

export default LandingPageFilterButtons;
