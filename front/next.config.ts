import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.carsandbids.com",
				port: "",
				pathname: "/cdn-cgi/image/**",
			},
		],
	},
};

export default nextConfig;
