package com.inc.fcr.car;

import com.inc.fcr.utils.HibernateUtil;
import io.javalin.http.Context;
import org.hibernate.HibernateException;
import org.hibernate.Session;

import java.util.List;

import static com.inc.fcr.errorHandling.ApiErrors.databaseError;
import static com.inc.fcr.errorHandling.ApiErrors.serverError;

/**
 * HTTP handler for the {@code GET /cars/makes} endpoint.
 *
 * <p>Returns a de-duplicated list of all car makes currently in the database,
 * useful for populating filter dropdowns in the frontend.</p>
 */
public class CarMakeController {

    /**
     * Handles {@code GET /cars/makes}.
     *
     * <p>Executes a native {@code SELECT DISTINCT make FROM cars} query and
     * returns the result as a JSON array of strings.</p>
     *
     * @param ctx the Javalin request context; the response body is set to a JSON string array
     */
    public static void getDistinctMakes(Context ctx) {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            List<String> makes = session.createNativeQuery("SELECT DISTINCT make FROM cars", String.class).getResultList();
            ctx.json(makes);
        } catch (Exception e) {
            if (e instanceof HibernateException) databaseError(ctx, e);
            else serverError(ctx, e);
        }
    }
}
