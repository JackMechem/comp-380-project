package com.inc.fcr.reservation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inc.fcr.car.Car;
import com.inc.fcr.database.ParsedQueryParams;
import com.inc.fcr.errorHandling.QueryParamException;
import com.inc.fcr.utils.HibernateUtil;
import io.javalin.http.Context;
import org.hibernate.HibernateException;
import org.hibernate.Session;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.inc.fcr.errorHandling.ApiErrors.*;

public class StatsController {

    private static final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
    private static final List<String> timeUnits = List.of("day", "week", "month", "year");

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


    public static void getPopularity(Context ctx) {
        try {
            var ctxParams = new LinkedHashMap<>(ctx.queryParamMap());
            ctxParams.put("sortBy", List.of("popularity")); // Ensure sort by set for param parsing
            var params = new ParsedQueryParams(Car.class, ctxParams);

            // Determine GROUP BY clause (for individual car popularity, time-based popularity, or both)
            boolean groupByCar = ctx.queryParamAsClass("groupByCar", Boolean.class).getOrDefault(true);
            boolean groupByTime = ctx.queryParamAsClass("groupByTime", Boolean.class).getOrDefault(true);
            if (!groupByCar && !groupByTime) throw new QueryParamException("At least one of 'groupByCar' or 'groupByTime' must be true.");
            String groupBy = (groupByCar ? "c.vin":"") + (groupByCar && groupByTime ? ", ":"") + (groupByTime ? "timeUnit":"");

            // Determine time units to increment and group by
            String timeUnit = ctx.queryParam("timeUnit");
            if (timeUnit == null) {
                var popularityRange = (List<Instant>) params.getPotentialParams().get("popularity");
                long dayRange = ChronoUnit.DAYS.between(popularityRange.get(0), popularityRange.get(1));
                if (dayRange <= 30) timeUnit = timeUnits.get(0); // day
                else if (dayRange <= 124) timeUnit = timeUnits.get(1); // week
                else if (dayRange <= 365) timeUnit = timeUnits.get(2); // month
                else timeUnit = timeUnits.get(3); // year
            } else if (!timeUnits.contains(timeUnit.toLowerCase())) {
                throw new QueryParamException("Invalid timeUnit value. Supported values: " + timeUnits);
            }
            String dateFormat = switch (timeUnit.toLowerCase()) {
                case "day" -> "%Y-%m-%d";
                case "week" -> "%Y-%u"; // Year-Week number
                case "month" -> "%Y-%m";
                case "year" -> "%Y";
                default -> null;
            };

            String queryString = "SELECT c AS car, COUNT(r.id) AS popularity, "+timeUnit+"(r.dateBooked) AS timeUnit, DATE_FORMAT(r.dateBooked, '"+dateFormat+"') as date FROM Car c" +
                    " LEFT JOIN Reservation r ON ((r.car = c) AND (r.dateBooked BETWEEN :popularityDate0 AND :popularityDate1 ))" +
                    params.getFilterClause() + " GROUP BY "+ groupBy +" HAVING COUNT(r.id) > 0 ORDER BY popularity DESC, timeUnit DESC";

            Session session = HibernateUtil.getSessionFactory().openSession();
            List<?> rows = params.setPotentialParams(session.createQuery(queryString, Map.class)).getResultList();

            if (!params.isSelecting()) ctx.json(rows);
            else { // Filter down to selected fields
                ctx.json(rows.stream().map(row -> {
                    Map<String, Object> map = mapper.convertValue(row, Map.class);
                    Map<String, Object> carMap = (Map<String, Object>) map.get("car");
                    carMap.keySet().removeIf(k -> !params.getSelectFields().contains(k));
                    map.put("car", carMap);
                    return map;
                }).toList());
            }
            session.close();

        } catch (Exception e) {
            if (e instanceof QueryParamException) queryParamError(ctx, e);
            else if (e instanceof HibernateException) databaseError(ctx, e);
            else serverError(ctx, e);
        }
    }
}
