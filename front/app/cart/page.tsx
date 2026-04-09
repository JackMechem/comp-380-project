import BrowseHeader from "../components/headers/browseHeader";
import TitleText from "../components/text/titleText";
import CartContents from "./componenets/cartContents";

const CartPage = () => {
	return (
		<div>
			<BrowseHeader white={false} />
			<div className="w-full flex items-center flex-col gap-[20px] pt-[50px] pb-[100px]">
				<TitleText>Car Cart</TitleText>
				<CartContents />
			</div>
		</div>
	);
};

export default CartPage;
