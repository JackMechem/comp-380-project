package com.inc.fcr.database;

import java.beans.Transient;
import java.lang.reflect.Field;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.inc.fcr.car.Car;
import com.inc.fcr.car.enums.*;
import com.inc.fcr.errorHandling.QueryParamException;

public class ParsedQueryParams {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private static final Map<String, String> FIELD_MAP;
    static {
        Map<String, String> map = new LinkedHashMap<>();
        for (Field field : Car.class.getDeclaredFields()) {
            if (java.lang.reflect.Modifier.isStatic(field.getModifiers()))
                continue;
            if (field.isAnnotationPresent(Transient.class))
                continue;
            map.put(field.getName().toLowerCase(), field.getName());
        }
        FIELD_MAP = Collections.unmodifiableMap(map);
    }

    private static final Map<String, Function<String, Object>> FILTER_PARSERS = Map.of(
            "transmission", v -> TransmissionType.valueOf(v.toUpperCase()),
            "drivetrain", v -> Drivetrain.valueOf(v.toUpperCase()),
            "engineLayout", v -> EngineLayout.valueOf(v.toUpperCase()),
            "fuel", v -> FuelType.valueOf(v.toUpperCase()),
            "bodyType", v -> BodyType.valueOf(v.toUpperCase()),
            "roofType", v -> RoofType.valueOf(v.toUpperCase()),
            "vehicleClass", v -> VehicleClass.valueOf(v.toUpperCase()));

    private List<String> selectFields = null;
    private Map<String, String> filterFields = null;
    private SortStyle sortDir = SortStyle.ASCENDING;
    private String sortBy = "make";
    private int page = 1;
    private int pageSize = DEFAULT_PAGE_SIZE;

    public ParsedQueryParams(Map<String, List<String>> queryParams) throws QueryParamException {
        for (Map.Entry<String, List<String>> entry : queryParams.entrySet()) {
            String key = entry.getKey().trim().toLowerCase();
            String val = entry.getValue().getFirst().trim();
            switch (key) {
                case "select" -> parseSelect(entry.getValue());
                case "sortby" -> {
                    if (FIELD_MAP.containsKey(val.toLowerCase()))
                        sortBy = FIELD_MAP.get(val.toLowerCase());
                }
                case "sortdir" -> sortDir = val.equalsIgnoreCase("desc") ? SortStyle.DESCENDING : SortStyle.ASCENDING;
                case "page" -> page = Math.max(1, Integer.parseInt(val));
                case "pagesize" -> pageSize = Integer.parseInt(val) < 1 ? DEFAULT_PAGE_SIZE : Integer.parseInt(val);
                default -> {
                    if (FIELD_MAP.containsKey(key))
                        parseFilter(key, val);
                }
            }
        }
    }

    private void parseSelect(List<String> values) throws QueryParamException {
        if (values.isEmpty())
            throw new QueryParamException(
                    "Valid fields for 'select': " + String.join(", ", FIELD_MAP.keySet()));
        if (selectFields == null)
            selectFields = new ArrayList<>();
        for (String val : values) {
            for (String field : val.split(",")) {
                String mapped = FIELD_MAP.get(field.trim().toLowerCase());
                if (mapped != null && !selectFields.contains(mapped))
                    selectFields.add(mapped);
            }
        }
    }

    private void parseFilter(String key, String val) {
        if (filterFields == null)
            filterFields = new LinkedHashMap<>();
        filterFields.put(FIELD_MAP.get(key), val);
    }

    public String getSelectClause() {
        return selectFields.stream()
                .map(f -> "c." + f)
                .collect(Collectors.joining(", "));
    }

    public String getFilterClause() {
        StringBuilder sb = new StringBuilder(" WHERE 1=1");
        if (filterFields == null)
            return sb.toString();
        for (Map.Entry<String, String> entry : filterFields.entrySet()) {
            String field = entry.getKey(), value = entry.getValue();
            sb.append(" AND c.").append(field).append(" = ");
            if (FILTER_PARSERS.containsKey(field))
                sb.append(FILTER_PARSERS.get(field).apply(value));
            else
                sb.append("'").append(value).append("'");
        }
        return sb.toString();
    }

    public String getSortClause() {
        return " ORDER BY c." + sortBy + (sortDir == SortStyle.DESCENDING ? " DESC" : " ASC");
    }

    public List<String> getSelectFields() {
        return selectFields;
    }

    public Map<String, String> getFilterFields() {
        return filterFields;
    }

    public SortStyle getSortDir() {
        return sortDir;
    }

    public String getSortBy() {
        return sortBy;
    }

    public int getPage() {
        return page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setVinFilter(String vin) {
        if (filterFields == null)
            filterFields = new LinkedHashMap<>();
        filterFields.put("vin", vin);
    }

    public void printParams() {
        System.out.println("selectFields: " + selectFields);
        System.out.println("filterFields: " + filterFields);
        System.out.println("sortDir:      " + sortDir);
        System.out.println("sortBy:       " + sortBy);
        System.out.println("page:         " + page);
        System.out.println("pageSize:     " + pageSize);
    }
}
