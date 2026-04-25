package com.inc.fcr.reservation;

import io.javalin.http.Context;

public class StatsController {

    public static void getRevenue(Context ctx) {
        /*
            We get with a controllable granularity ('select' & 'group by') of  daily, monthly, yearly
                (others you may have to calculate frontend/java unless I can work out a way to do it in SQL)
            We have a 'where' filter range for the payment dates to get
            Results return in order (we prob still need to specify which date it lines up with in the return, huh?)
            All car filters should still be supported ideally
            index the date columns for efficient access
         */
        // TODO
    }
}
