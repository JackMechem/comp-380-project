const DefaultProfilePhoto = ({ totalHeight, headSize }: { totalHeight: number, headSize: number }) => {
	return (
		<div className={`h-[${totalHeight}px] relative overflow-hidden aspect-square bg-third rounded-full`}>
			<div className="absolute rounded-full w-full h-full top-[65%] bg-secondary" />
			<div className={`w-[${headSize}px] aspect-square bg-secondary absolute left-[50%] top-[40%] rounded-full -translate-x-[50%] -translate-y-[50%]`} />
		</div>
	);
};

export default DefaultProfilePhoto;
