import Image from "next/image";
import bigLogoImage from "../../media/bigLogo.svg";
import HeaderMenuButton from "../buttons/headerMenuButton";

const LandingHeader = () => {
	return (
		<div className="md:py-[20px] px-[10px] md:px-[100px] px-[20px] flex items-center justify-between">
			<Image width={200} height={400} src={bigLogoImage} alt={"Header Logo"} />

			<HeaderMenuButton />
		</div>
	);
};

export default LandingHeader;
