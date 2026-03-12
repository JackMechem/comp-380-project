"use client";

import { useState } from "react";
import HeaderMenu from "../menus/headerMenu";
import CartButton from "./cartButton";
import DefaultProfilePhoto from "../defaultProfilePhoto";

const HeaderMenuButton = () => {
	const [menuShown, setMenuShown] = useState<boolean>(false);

	return (<>

			{menuShown && <HeaderMenu />}
		<div className="flex items-center gap-[15px] relative border border-transparent hover:border-third/50 rounded-full p-[5px] pl-[10px] hover:bg-primary-dark/50 duration-[200ms] hover:scale-[105%] cursor-pointer" onClick={() => setMenuShown(!menuShown)}>
			<CartButton />
            <DefaultProfilePhoto totalHeight={30} headSize={10} />
		</div>
    </>
	);
};

export default HeaderMenuButton;
