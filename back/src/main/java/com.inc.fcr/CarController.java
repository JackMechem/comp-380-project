package com.inc.fcr;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;
import io.javalin.http.Context;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.StreamSupport;


// ## API Test class (example) (nonfunctional)
public class CarController {

    // Sample CRUD methods
    public static void getAllCars(Context ctx) {
        // query params accessible via "apt/endpoint?param=value&param2=value2"
        Boolean prettyPrint = ctx.queryParamAsClass("prettyPrint", Boolean.class).getOrDefault(true);
        JsonNode cars = readJson().get("cars");
        ctx.json(prettyPrint ? cars.toPrettyString() : cars.toString());
    }
    public static void createCar(Context ctx) {
        // TODO
        // uses: ctx.bodyAsClass(AnyClassHere.class)
    }
    public static void getCar(Context ctx) {
        int images = ctx.queryParamAsClass("images", Integer.class).getOrDefault(1); // if you wanted to show X imgs
        ctx.json(findCar(ctx).toPrettyString());
    }
    public static void updateCar(Context ctx) {
        // TODO
        // uses: ctx.bodyAsClass(AnyClassHere.class)
    }
    public static void deleteCar(Context ctx) {
        // TODO
    }


    // ---- TEMP ----
    // Cars json file temp reference
    // replace with proper database class
    private static JsonNode readJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        // WARNING! Won't find file if main directly run, must maven package & execute
        try { return objectMapper.readTree(new File("src/main/resources/cars.json")); }
        catch (IOException ignored) { return MissingNode.getInstance(); }
    }
    private static JsonNode findCar(Context ctx) {
        return StreamSupport.stream(readJson().get("cars").spliterator(), false)
                .filter(node -> ctx.pathParam("id").equals(node.path("vin").asText()))
                .findFirst()
                .orElse(MissingNode.getInstance());
    }
}