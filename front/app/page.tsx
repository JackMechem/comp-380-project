import Image from "next/image";
import LandingHeader from "./components/headers/landingHeader";

const Home = () => {
	return (
		<div>
			<LandingHeader />
			<div className="w-full px-[100px]">
				<h1 className="text-center text-accent font-titillium font-bold text-[36pt] italic">
					Work in progress
				</h1>
			</div>
		</div>
	);
};

export default Home;
