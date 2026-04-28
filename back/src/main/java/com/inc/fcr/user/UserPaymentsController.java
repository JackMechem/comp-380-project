package com.inc.fcr.user;

import com.inc.fcr.database.PagesWrapper;
import com.inc.fcr.payment.Payment;
import com.inc.fcr.utils.HibernateUtil;
import io.javalin.http.Context;
import org.hibernate.Session;

import java.util.List;

public class UserPaymentsController {

    /**
     * Handles {@code GET /users/{id}/payments}.
     *
     * <p>Returns a paginated list of all payments associated with the given user,
     * joined through the reservations table.</p>
     */
    public static void getByUser(Context ctx) {
        long userId = Long.parseLong(ctx.pathParam("id"));
        int page     = Math.max(1, Integer.parseInt(ctx.queryParamAsClass("page",     String.class).getOrDefault("1")));
        int pageSize = Math.max(1, Integer.parseInt(ctx.queryParamAsClass("pageSize", String.class).getOrDefault("10")));
        int offset   = (page - 1) * pageSize;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            String hql      = "SELECT DISTINCT p FROM Payment p JOIN p.reservations r WHERE r.user.userId = :userId";
            String countHql = "SELECT COUNT(DISTINCT p) FROM Payment p JOIN p.reservations r WHERE r.user.userId = :userId";

            long totalItems = session.createQuery(countHql, Long.class).setParameter("userId", userId).getSingleResult();
            int  totalPages = (int) Math.ceil((double) totalItems / pageSize);

            List<Payment> payments = session.createQuery(hql, Payment.class)
                    .setParameter("userId", userId)
                    .setFirstResult(offset)
                    .setMaxResults(pageSize)
                    .getResultList();

            ctx.json(new PagesWrapper(payments, page, totalPages, totalItems));
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
