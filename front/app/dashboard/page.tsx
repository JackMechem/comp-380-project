import { Suspense } from "react";
import { getSessionCookies } from "@/app/lib/serverAuth";
import NavHeader from "../components/headers/navHeader";
import UserSidebar from "./components/UserSidebar";
import MagicLinkPromptPage from "./components/MagicLinkPromptPage";
import DashboardContentArea from "./DashboardContentArea";
import DashboardContent from "./DashboardContent";
import panelStyles from "./components/panels.module.css";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ payment?: string }>;
}) {
    const { sessionToken, accountId, stripeUserId } = await getSessionCookies();
    const sp = await searchParams;

    if (!sessionToken) {
        return (
            <>
                <NavHeader white={false} />
                <MagicLinkPromptPage />
            </>
        );
    }

    return (
        <>
            <NavHeader white={false} />
            <UserSidebar />
            <DashboardContentArea>
                <Suspense fallback={<p className={panelStyles.loading}>Loading&hellip;</p>}>
                    <DashboardContent
                        sessionToken={sessionToken}
                        accountId={accountId}
                        stripeUserId={stripeUserId}
                        paymentSuccess={sp?.payment === "success"}
                    />
                </Suspense>
            </DashboardContentArea>
        </>
    );
}
