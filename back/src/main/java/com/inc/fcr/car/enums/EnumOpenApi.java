package com.inc.fcr.car.enums;

import com.inc.fcr.errorHandling.ApiErrorResponse;
import io.javalin.http.Context;
import io.javalin.openapi.*;

public class EnumOpenApi {
    @OpenApi(
        path = "/enums",
        methods = HttpMethod.GET,
        summary = "Get all enums",
        operationId = "getAllEnums",
        tags = {"enums"},
        responses = {
                @OpenApiResponse(status = "200", content = {@OpenApiContent(from = EnumController.class)}),
                @OpenApiResponse(status = "400", content = {@OpenApiContent(from = ApiErrorResponse.class)}),
                @OpenApiResponse(status = "500", content = {@OpenApiContent(from = ApiErrorResponse.class)})
        }
    )
    public static void getAllEnums(Context ctx) {}

    @OpenApi(
        path = "/enums/{enum}",
        methods = HttpMethod.GET,
        summary = "Get an enum",
        operationId = "getEnum",
        tags = {"enums"},
        pathParams = {
            @OpenApiParam(name = "enum", type = String.class, description = "Enum Type")
        },
        responses = {
            @OpenApiResponse(status = "200", content = {@OpenApiContent(from = EnumController.class)}),
            @OpenApiResponse(status = "400", content = {@OpenApiContent(from = ApiErrorResponse.class)}),
            @OpenApiResponse(status = "404", content = {@OpenApiContent(from = ApiErrorResponse.class)}),
            @OpenApiResponse(status = "500", content = {@OpenApiContent(from = ApiErrorResponse.class)})
        }
    )
    public static void getEnum(Context ctx) {}
}
