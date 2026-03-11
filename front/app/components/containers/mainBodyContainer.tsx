import { ReactNode } from "react";

const MainBodyContainer = ({ children, className }: { children: ReactNode, className?: string }) => {
	return (
		<div className={"xl:mx-[100px] lg:mx-[50px] mx-[10px] pb-[100px] " + className}>
			{children}
		</div>
	);
};

export default MainBodyContainer;
