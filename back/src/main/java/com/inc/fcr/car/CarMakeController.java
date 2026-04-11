package com.inc.fcr.car;

import com.inc.fcr.utils.HibernateUtil;
import io.javalin.http.Context;
import org.hibernate.HibernateException;
import org.hibernate.Session;

import java.util.List;

import static com.inc.fcr.errorHandling.ApiErrors.databaseError;
import static com.inc.fcr.errorHandling.ApiErrors.serverError;

public class CarMakeController {

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
