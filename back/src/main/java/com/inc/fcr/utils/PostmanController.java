package com.inc.fcr.utils;

import io.javalin.http.Context;

/**
 * Serves a Postman Collection v2.1 JSON at GET /postman.
 *
 * <p>The collection includes all API routes with correct HTTP methods,
 * request body schemas, query parameters, and header configuration.
 * Import the response JSON directly into Postman.</p>
 */
public class PostmanController {

    private static final String BASE_URL = "{{baseUrl}}";

    public static void getCollection(Context ctx) {
        ctx.contentType("application/json");
        ctx.result(buildCollection());
    }

    private static String buildCollection() {
        return """
        {
          "info": {
            "name": "FCR Inc API",
            "description": "Auto-generated Postman collection for the FCR Inc car rental API.\\n\\nSet the `baseUrl` variable to your server (e.g. http://localhost:8080).\\nSet the `apiKey` variable to your X-API-Key value.\\nSet the `authToken` variable to a Bearer session token.",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
          },
          "variable": [
            { "key": "baseUrl", "value": "http://localhost:8080" },
            { "key": "apiKey",  "value": "" },
            { "key": "authToken", "value": "" }
          ],
          "auth": {
            "type": "apikey",
            "apikey": [
              { "key": "key",   "value": "X-API-Key", "type": "string" },
              { "key": "value", "value": "{{apiKey}}", "type": "string" },
              { "key": "in",    "value": "header",     "type": "string" }
            ]
          },
          "item": [
            """
            + authFolder() + ",\n"
            + crudFolder("Accounts", "accounts", "{{acctId}}", accountBody()) + ",\n"
            + crudFolder("Cars", "cars", "{{carVin}}", carBody()) + ",\n"
            + carExtras() + ",\n"
            + crudFolder("Reservations", "reservations", "{{reservationId}}", reservationBody()) + ",\n"
            + crudFolder("Users", "users", "{{userId}}", userBody()) + ",\n"
            + crudFolder("Payments", "payments", "{{paymentId}}", paymentBody()) + ",\n"
            + crudFolder("Reviews", "reviews", "{{reviewId}}", reviewBody()) + ",\n"
            + stripeFolder() + ",\n"
            + enumsFolder() + ",\n"
            + postmanSelfFolder()
            + """

          ]
        }
        """;
    }

    // ---- Auth folder ----

    private static String authFolder() {
        return folder("Auth",
            request("Validate Credentials", "GET", "auth/validate",
                null, "Validates a Bearer session token. Pass Authorization: Bearer {{authToken}} header.", null) + ",\n"
            + request("Register", "POST", "auth/register",
                registerBody(), "Create a new account. Optionally include user fields.", null) + ",\n"
            + request("Confirm Email", "GET", "auth/confirm/{{confirmToken}}",
                null, "Confirm email with the token from the registration email.", null) + ",\n"
            + request("Send Login Link", "POST", "auth/send-link",
                jsonBody("{\\n  \\\"email\\\": \\\"user@example.com\\\"\\n}"),
                "Send a magic login link to the given email.", null) + ",\n"
            + request("Account Exists", "GET", "auth/account-exists",
                null, "Check if an account exists (200 or 404).",
                queryParam("email", "user@example.com", "Email address to check"))
        );
    }

    // ---- CRUD folder helper ----

    private static String crudFolder(String name, String path, String idVar, String body) {
        String singular = name.replaceAll("s$", "");
        String entityParams = entityQueryParams(name);
        return folder(name,
            request("Get All " + name, "GET", path,
                null, "List/search " + path + ".",
                commonQueryParams() + (entityParams.isEmpty() ? "" : ",\n" + entityParams)) + ",\n"
            + request("Get One " + singular, "GET", path + "/" + idVar,
                null, "Get a single " + singular.toLowerCase() + " by ID.", null) + ",\n"
            + request("Create " + singular, "POST", path,
                body, "Create a new " + singular.toLowerCase() + ".", null) + ",\n"
            + request("Update " + singular, "PATCH", path + "/" + idVar,
                body, "Update fields on an existing " + singular.toLowerCase() + ". Send only the fields you want to change.", null) + ",\n"
            + request("Delete " + singular, "DELETE", path + "/" + idVar,
                null, "Delete a " + singular.toLowerCase() + " by ID.", null)
        );
    }

    // ---- Car extras (makes) ----

    private static String carExtras() {
        return folder("Car Makes",
            request("Get Distinct Makes", "GET", "cars/makes", null, "Returns a list of distinct car makes.", null)
        );
    }

    // ---- Stripe folder ----

    private static String stripeFolder() {
        return folder("Stripe",
            request("Find or Create User", "POST", "stripe/user",
                jsonBody("{\\n  \\\"email\\\": \\\"user@example.com\\\"\\n}"),
                "Find or create a Stripe-linked user by email.", null) + ",\n"
            + request("Create Checkout Session", "POST", "stripe/checkout",
                jsonBody("{\\n  \\\"reservationId\\\": 1,\\n  \\\"successUrl\\\": \\\"https://example.com/success\\\",\\n  \\\"cancelUrl\\\": \\\"https://example.com/cancel\\\"\\n}"),
                "Create a hosted Stripe Checkout session.", null) + ",\n"
            + request("Create Payment Intent", "POST", "stripe/payment-intent",
                jsonBody("{\\n  \\\"reservationId\\\": 1\\n}"),
                "Create a Stripe PaymentIntent.", null) + ",\n"
            + request("Webhook", "POST", "stripe/webhook",
                jsonBody("{}"), "Handle Stripe payment webhook events.", null)
        );
    }

    // ---- Enums folder ----

    private static String enumsFolder() {
        return folder("Enums",
            request("Get All Enums", "GET", "enums", null, "Returns all enum metadata for UI dropdowns.", null) + ",\n"
            + request("Get Specific Enum", "GET", "enums/{{enumName}}", null,
                "Returns values for a specific enum. Examples: TransmissionType, Drivetrain, FuelType, BodyType, RoofType, EngineLayout, VehicleClass, CarStatus, AccountRole, PaymentType", null)
        );
    }

    // ---- Postman self-reference ----

    private static String postmanSelfFolder() {
        return folder("Meta",
            request("Get Postman Collection", "GET", "postman", null,
                "Returns this Postman collection JSON. Import it into Postman.", null)
        );
    }

    // ---- Request body templates ----

    private static String registerBody() {
        return jsonBody("{\\n"
            + "  \\\"name\\\": \\\"John Doe\\\",\\n"
            + "  \\\"email\\\": \\\"john@example.com\\\",\\n"
            + "  \\\"role\\\": \\\"CUSTOMER\\\",\\n"
            + "  \\\"firstName\\\": \\\"John\\\",\\n"
            + "  \\\"lastName\\\": \\\"Doe\\\",\\n"
            + "  \\\"phoneNumber\\\": \\\"555-123-4567\\\",\\n"
            + "  \\\"address\\\": {\\n"
            + "    \\\"buildingNumber\\\": \\\"123\\\",\\n"
            + "    \\\"streetName\\\": \\\"Main St\\\",\\n"
            + "    \\\"city\\\": \\\"Springfield\\\",\\n"
            + "    \\\"state\\\": \\\"IL\\\",\\n"
            + "    \\\"zipCode\\\": \\\"62704\\\"\\n"
            + "  },\\n"
            + "  \\\"driversLicense\\\": {\\n"
            + "    \\\"driversLicense\\\": \\\"D1234567\\\",\\n"
            + "    \\\"state\\\": \\\"IL\\\",\\n"
            + "    \\\"expirationDate\\\": 1893456000,\\n"
            + "    \\\"dateOfBirth\\\": 631152000\\n"
            + "  }\\n"
            + "}");
    }

    private static String accountBody() {
        return jsonBody("{\\n"
            + "  \\\"name\\\": \\\"John Doe\\\",\\n"
            + "  \\\"email\\\": \\\"john@example.com\\\",\\n"
            + "  \\\"role\\\": \\\"CUSTOMER | STAFF | ADMIN\\\",\\n"
            + "  \\\"user\\\": 1,\\n"
            + "  \\\"bookmarkedCars\\\": [\\\"VIN1\\\", \\\"VIN2\\\"]\\n"
            + "}");
    }

    private static String carBody() {
        return jsonBody("{\\n"
            + "  \\\"vin\\\": \\\"1HGBH41JXMN109186\\\",\\n"
            + "  \\\"make\\\": \\\"Honda\\\",\\n"
            + "  \\\"model\\\": \\\"Accord\\\",\\n"
            + "  \\\"modelYear\\\": 2024,\\n"
            + "  \\\"description\\\": \\\"A reliable sedan\\\",\\n"
            + "  \\\"cylinders\\\": 4,\\n"
            + "  \\\"gears\\\": 6,\\n"
            + "  \\\"horsepower\\\": 192,\\n"
            + "  \\\"torque\\\": 192,\\n"
            + "  \\\"seats\\\": 5,\\n"
            + "  \\\"pricePerDay\\\": 59.99,\\n"
            + "  \\\"mpg\\\": 33.0,\\n"
            + "  \\\"features\\\": [\\\"Bluetooth\\\", \\\"Backup Camera\\\"],\\n"
            + "  \\\"images\\\": [\\\"https://example.com/car.jpg\\\"],\\n"
            + "  \\\"transmission\\\": \\\"AUTOMATIC | MANUAL\\\",\\n"
            + "  \\\"drivetrain\\\": \\\"FWD | RWD | AWD\\\",\\n"
            + "  \\\"engineLayout\\\": \\\"V | INLINE | FLAT | SINGLE_MOTOR | DUAL_MOTOR\\\",\\n"
            + "  \\\"fuel\\\": \\\"GASOLINE | DIESEL | ELECTRIC | HYBRID\\\",\\n"
            + "  \\\"bodyType\\\": \\\"SEDAN | SUV | TRUCK | CONVERTIBLE | HATCHBACK | FULL_SIZE | COMPACT | WAGON | ELECTRIC | COUPE\\\",\\n"
            + "  \\\"roofType\\\": \\\"SOFTTOP | HARDTOP | TARGA | SLICKTOP | SUNROOF | PANORAMIC\\\",\\n"
            + "  \\\"vehicleClass\\\": \\\"ECONOMY | LUXURY | PERFORMANCE | OFFROAD | FULL_SIZE | ELECTRIC\\\",\\n"
            + "  \\\"carStatus\\\": \\\"AVAILABLE | DISABLED | ARCHIVED | LOANED | SERVICE\\\"\\n"
            + "}");
    }

    private static String reservationBody() {
        return jsonBody("{\\n"
            + "  \\\"car\\\": \\\"1HGBH41JXMN109186\\\",\\n"
            + "  \\\"user\\\": 1,\\n"
            + "  \\\"payments\\\": [],\\n"
            + "  \\\"pickUpTime\\\": \\\"2025-06-01T10:00:00Z\\\",\\n"
            + "  \\\"dropOffTime\\\": \\\"2025-06-05T10:00:00Z\\\",\\n"
            + "  \\\"dateBooked\\\": \\\"2025-05-20T12:00:00Z\\\"\\n"
            + "}");
    }

    private static String userBody() {
        return jsonBody("{\\n"
            + "  \\\"firstName\\\": \\\"John\\\",\\n"
            + "  \\\"lastName\\\": \\\"Doe\\\",\\n"
            + "  \\\"email\\\": \\\"john@example.com\\\",\\n"
            + "  \\\"phoneNumber\\\": \\\"555-123-4567\\\",\\n"
            + "  \\\"address\\\": {\\n"
            + "    \\\"buildingNumber\\\": \\\"123\\\",\\n"
            + "    \\\"streetName\\\": \\\"Main St\\\",\\n"
            + "    \\\"city\\\": \\\"Springfield\\\",\\n"
            + "    \\\"state\\\": \\\"IL\\\",\\n"
            + "    \\\"zipCode\\\": \\\"62704\\\"\\n"
            + "  },\\n"
            + "  \\\"driversLicense\\\": {\\n"
            + "    \\\"driversLicense\\\": \\\"D1234567\\\",\\n"
            + "    \\\"state\\\": \\\"IL\\\",\\n"
            + "    \\\"expirationDate\\\": 1893456000,\\n"
            + "    \\\"dateOfBirth\\\": 631152000\\n"
            + "  },\\n"
            + "  \\\"dateCreated\\\": \\\"2025-01-01T00:00:00Z\\\"\\n"
            + "}");
    }

    private static String paymentBody() {
        return jsonBody("{\\n"
            + "  \\\"paymentId\\\": \\\"cs_test_abc123\\\",\\n"
            + "  \\\"totalAmount\\\": 299.95,\\n"
            + "  \\\"amountPaid\\\": 299.95,\\n"
            + "  \\\"date\\\": \\\"2025-05-20T12:00:00Z\\\",\\n"
            + "  \\\"paymentType\\\": \\\"CREDIT | CASH | DEBIT | CHECK | SERVICE | INVOICE\\\",\\n"
            + "  \\\"reservations\\\": [1]\\n"
            + "}");
    }

    private static String reviewBody() {
        return jsonBody("{\\n"
            + "  \\\"user\\\": 1,\\n"
            + "  \\\"car\\\": \\\"1HGBH41JXMN109186\\\",\\n"
            + "  \\\"title\\\": \\\"Great car!\\\",\\n"
            + "  \\\"bodyOfText\\\": \\\"Had an amazing experience.\\\",\\n"
            + "  \\\"stars\\\": 5,\\n"
            + "  \\\"rentalDuration\\\": 4,\\n"
            + "  \\\"publishedDate\\\": \\\"2025-05-25T12:00:00Z\\\"\\n"
            + "}");
    }

    // ---- Query param helpers ----

    /** Single query param entry (disabled by default so Postman shows but doesn't send) */
    private static String queryParam(String key, String value, String description) {
        return queryParam(key, value, description, true);
    }

    private static String queryParam(String key, String value, String description, boolean disabled) {
        return """
                        { "key": "%s", "value": "%s", "description": "%s", "disabled": %s }""".formatted(
                key, value, description, disabled);
    }

    /** Common query params shared by all Get All endpoints */
    private static String commonQueryParams() {
        return queryParam("page", "1", "Page number (default 1)") + ",\n"
            + queryParam("pageSize", "10", "Results per page (default 10)") + ",\n"
            + queryParam("sortBy", "", "Field name to sort by") + ",\n"
            + queryParam("sortDir", "asc", "Sort direction: asc or desc") + ",\n"
            + queryParam("search", "", "Full-text search across searchable fields") + ",\n"
            + queryParam("select", "", "Comma-separated list of fields to return") + ",\n"
            + queryParam("parseFullObjects", "false", "Return nested objects instead of just IDs");
    }

    /** Entity-specific filter query params */
    private static String entityQueryParams(String entityName) {
        return switch (entityName) {
            case "Cars" ->
                queryParam("make", "", "Filter by make (exact match, comma-separated for OR)") + ",\n"
                + queryParam("model", "", "Filter by model") + ",\n"
                + queryParam("minModelYear", "", "Minimum model year") + ",\n"
                + queryParam("maxModelYear", "", "Maximum model year") + ",\n"
                + queryParam("minPricePerDay", "", "Minimum price per day") + ",\n"
                + queryParam("maxPricePerDay", "", "Maximum price per day") + ",\n"
                + queryParam("minHorsepower", "", "Minimum horsepower") + ",\n"
                + queryParam("maxHorsepower", "", "Maximum horsepower") + ",\n"
                + queryParam("minSeats", "", "Minimum seats") + ",\n"
                + queryParam("maxSeats", "", "Maximum seats") + ",\n"
                + queryParam("minMpg", "", "Minimum MPG") + ",\n"
                + queryParam("maxMpg", "", "Maximum MPG") + ",\n"
                + queryParam("transmission", "", "AUTOMATIC, MANUAL") + ",\n"
                + queryParam("drivetrain", "", "FWD, RWD, AWD") + ",\n"
                + queryParam("engineLayout", "", "V, INLINE, FLAT, SINGLE_MOTOR, DUAL_MOTOR") + ",\n"
                + queryParam("fuel", "", "GASOLINE, DIESEL, ELECTRIC, HYBRID") + ",\n"
                + queryParam("bodyType", "", "SEDAN, SUV, TRUCK, CONVERTIBLE, HATCHBACK, FULL_SIZE, COMPACT, WAGON, ELECTRIC, COUPE") + ",\n"
                + queryParam("roofType", "", "SOFTTOP, HARDTOP, TARGA, SLICKTOP, SUNROOF, PANORAMIC") + ",\n"
                + queryParam("vehicleClass", "", "ECONOMY, LUXURY, PERFORMANCE, OFFROAD, FULL_SIZE, ELECTRIC") + ",\n"
                + queryParam("carStatus", "", "AVAILABLE, DISABLED, ARCHIVED, LOANED, SERVICE");
            case "Accounts" ->
                queryParam("name", "", "Filter by name") + ",\n"
                + queryParam("email", "", "Filter by email") + ",\n"
                + queryParam("role", "", "CUSTOMER, STAFF, ADMIN");
            case "Users" ->
                queryParam("firstName", "", "Filter by first name") + ",\n"
                + queryParam("lastName", "", "Filter by last name") + ",\n"
                + queryParam("email", "", "Filter by email");
            case "Reservations" ->
                queryParam("minPickUpTime", "", "Min pick-up time (ISO 8601)") + ",\n"
                + queryParam("maxPickUpTime", "", "Max pick-up time (ISO 8601)") + ",\n"
                + queryParam("minDropOffTime", "", "Min drop-off time (ISO 8601)") + ",\n"
                + queryParam("maxDropOffTime", "", "Max drop-off time (ISO 8601)");
            case "Payments" ->
                queryParam("paymentType", "", "CREDIT, CASH, DEBIT, CHECK, SERVICE, INVOICE") + ",\n"
                + queryParam("minTotalAmount", "", "Minimum total amount") + ",\n"
                + queryParam("maxTotalAmount", "", "Maximum total amount");
            case "Reviews" ->
                queryParam("minStars", "", "Minimum star rating") + ",\n"
                + queryParam("maxStars", "", "Maximum star rating");
            default -> "";
        };
    }

    // ---- JSON builders ----

    private static String folder(String name, String items) {
        return """
            {
              "name": "%s",
              "item": [
                %s
              ]
            }""".formatted(name, items);
    }

    private static String request(String name, String method, String path, String body, String description, String queryParams) {
        String bodyBlock = "";
        if (body != null) {
            bodyBlock = """
                ,
                    "body": %s""".formatted(body);
        }

        String headerBlock = """
            [
                      { "key": "Content-Type", "value": "application/json" },
                      { "key": "Authorization", "value": "Bearer {{authToken}}" }
                    ]""";

        String queryBlock = "";
        if (queryParams != null && !queryParams.isEmpty()) {
            queryBlock = """
                ,
                      "query": [
                %s
                      ]""".formatted(queryParams);
        }

        return """
                {
                  "name": "%s",
                  "request": {
                    "method": "%s",
                    "header": %s,
                    "url": {
                      "raw": "%s/%s",
                      "host": ["%s"],
                      "path": [%s]%s
                    },
                    "description": "%s"%s
                  }
                }""".formatted(
                name,
                method,
                headerBlock,
                BASE_URL, path,
                BASE_URL,
                pathToArray(path),
                queryBlock,
                description != null ? description : "",
                bodyBlock
        );
    }

    private static String jsonBody(String raw) {
        return """
            {
                      "mode": "raw",
                      "raw": "%s",
                      "options": { "raw": { "language": "json" } }
                    }""".formatted(raw);
    }

    private static String pathToArray(String path) {
        String[] parts = path.split("/");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append("\"").append(parts[i]).append("\"");
        }
        return sb.toString();
    }
}
