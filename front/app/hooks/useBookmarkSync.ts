"use client";

import { useEffect, useRef } from "react";
import { useUserDashboardStore } from "@/stores/userDashboardStore";
import { fetchBookmarks } from "@/stores/bookmarkStore";

/**
 * Fetches bookmarks from the API when the user is authenticated.
 * Place this once in a layout-level component (e.g. HeaderMenu).
 */
export function useBookmarkSync() {
    const { isAuthenticated, accountId } = useUserDashboardStore();
    const fetched = useRef(false);

    useEffect(() => {
        if (isAuthenticated && accountId && !fetched.current) {
            fetched.current = true;
            fetchBookmarks(accountId);
        }
        if (!isAuthenticated) {
            fetched.current = false;
        }
    }, [isAuthenticated, accountId]);
}
