package com.inc.fcr.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.javalin.http.Context;

import java.io.InputStream;

public class VersionController {

    private static final String VERSION;

    static {
        String v = "unknown";
        try (InputStream is = VersionController.class.getResourceAsStream("/version.json")) {
            if (is != null) {
                JsonNode node = new ObjectMapper().readTree(is);
                v = node.get("version").asText();
            }
        } catch (Exception ignored) {}
        VERSION = v;
    }

    public static void getVersion(Context ctx) {
        ctx.json(java.util.Map.of("version", VERSION));
    }

    public static String version() {
        return VERSION;
    }
}
