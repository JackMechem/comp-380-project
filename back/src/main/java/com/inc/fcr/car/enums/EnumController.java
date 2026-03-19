package com.inc.fcr.car.enums;

// some of these are needed and some not!!!
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inc.fcr.car.enums.*;

import com.inc.fcr.errorHandling.*;
import io.javalin.http.Context;
import io.javalin.openapi.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.*;
import java.util.Map;

public class EnumController {

    //FIXING
    public static void getAllEnums(Context ctx) {
        try {
            ctx.json(Map.of(
            "BodyType", BodyType.values(),
            "Drivetrain", Drivetrain.values(),
            "EngineLayout", EngineLayout.values(),
            "FuelType", FuelType.values(),
            "RoofType", RoofType.values(),
            "TransmissionType", TransmissionType.values(),
            "VehicleClass", VehicleClass.values()
            ));
        } catch (Exception e) {
            // do something with this? -- like this?
            if (e instanceof ValidationException) enumNotFound(ctx);
            else serverError(ctx, e);
        }
    }

    //FIXING
    public static void getEnum(Context ctx) {
        try {
            String select = ctx.pathParam("enum");
            switch(select) {
                case "BodyType":
                    ctx.json(BodyType.values());
                    break;
                case "Drivetrain":
                    ctx.json(Drivetrain.values());
                    break;
                case "EngineLayout":
                    ctx.json(EngineLayout.values());
                    break;
                case "FuelType":
                    ctx.json(FuelType.values());
                    break;
                case "RoofType":
                    ctx.json(RoofType.values());
                    break;
                case "TransmissionType":
                    ctx.json(TransmissionType.values());
                    break;
                case "VehicleClass":
                    ctx.json(VehicleClass.values());
                    break;
            }
        } catch (Exception e) {
            // do something with this? -- like this?
            if (e instanceof ValidationException) enumNotFound(ctx);
            else serverError(ctx, e);
        }
    }


    // Helper methods
    private static void enumNotFound(Context ctx) {
        ctx.status(404).json(new ApiErrorResponse(404, "Enum Not Found", null, null));
    }

    private static void serverError(Context ctx, Exception e) {
        ctx.status(500).json(new ApiErrorResponse(500, "Server Error", "" + e, stackTraceString(e)));
    }

    private static String stackTraceString(Exception e) {
        StringWriter stack = new StringWriter();
        e.printStackTrace(new PrintWriter(stack));
        return stack.toString();
    }

}
