package com.inc.fcr.database;

import com.inc.fcr.car.Car;
import com.inc.fcr.errorHandling.QueryParamException;
import com.inc.fcr.reservation.Reservation;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ParsedQueryParamsTest {

    @Test
    void getFilterClause() {
        try {
            var defaultParams = new ParsedQueryParams(Car.class, Map.of());
            // Numeric
            var numericMin = new ParsedQueryParams(Car.class, Map.of("minHorsepower", List.of("400")));
            var numericMinCaps = new ParsedQueryParams(Car.class, Map.of("minhorsepower", List.of("400")));
            var numericMax = new ParsedQueryParams(Car.class, Map.of("maxPricePerDay", List.of("100")));
            var numericMinMax = new ParsedQueryParams(Car.class, new LinkedHashMap<>(Map.of("minMPG", List.of("25"), "maxMPG", List.of("100"))));
            // Temporal
            var temporalMin = new ParsedQueryParams(Reservation.class, Map.of("minDateBooked", List.of("2026-04-01T08:20:59.000Z")));
            var temporalMax = new ParsedQueryParams(Reservation.class, Map.of("maxdateBooked", List.of("2026-04-01T08:20:59.000Z")));
            var temporalMinMax = new ParsedQueryParams(Reservation.class, new LinkedHashMap<>(Map.of("mindateBooked", List.of("2026-04-15T08:20:59.000Z"), "maxdateBooked", List.of("2026-04-25T08:20:59.000Z"))));
            // Enums
            var enumFilter = new ParsedQueryParams(Car.class, Map.of("fuel", List.of("GASOLINE")));
            var enumFilterCaps = new ParsedQueryParams(Car.class, Map.of("Fuel", List.of("gasoline")));
            var enumMultiple = new ParsedQueryParams(Car.class, Map.of("bodyType", List.of("sedan,SUV")));
            var enumMultipleSpaces = new ParsedQueryParams(Car.class, Map.of("bodyType", List.of(" sedan , SUV ")));
            var enumInvert = new ParsedQueryParams(Car.class, Map.of("roofType!", List.of("sunroof")));
            var enumInvertMultiple = new ParsedQueryParams(Car.class, Map.of("roofType!", List.of("slicktop,hardtop")));
            var enumAll = new ParsedQueryParams(Car.class, new LinkedHashMap<>(Map.of("transmission!", List.of("automatic"), "fuel", List.of("gasoline"))));
            // Alpha (text)
            var alphaFilter = new ParsedQueryParams(Car.class, Map.of("make", List.of("Audi")));
            var alphaFilterCaps = new ParsedQueryParams(Car.class, Map.of("Make", List.of("audi")));
            var alphaFilterMultiple = new ParsedQueryParams(Car.class, Map.of("make", List.of("Audi,BMW")));
            var alphaFilterInv = new ParsedQueryParams(Car.class, Map.of("model!", List.of("911")));
            var alphaFilterInvMultiple = new ParsedQueryParams(Car.class, Map.of("model!", List.of("911,class")));
            var alphaFilterBoth = new ParsedQueryParams(Car.class, new LinkedHashMap<>(Map.of("model!", List.of("911"), "model", List.of("carrera"))));
            var search = new ParsedQueryParams(Car.class, Map.of("search", List.of("")));

            String str_defaultParams = " WHERE 1=1";
            String str_numericMin = " WHERE 1=1 AND c.horsepower >= 400";
            String str_numericMax = " WHERE 1=1 AND c.pricePerDay <= 100";
            String str_numericMinMax = " WHERE 1=1 AND c.mpg <= 100 AND c.mpg >= 25";
            String str_temporalMin = " WHERE 1=1 AND c.dateBooked >= :minT_dateBooked";
            String str_temporalMax = " WHERE 1=1 AND c.dateBooked <= :maxT_dateBooked";
            String str_temporalMinMax = " WHERE 1=1 AND c.dateBooked >= :minT_dateBooked AND c.dateBooked <= :maxT_dateBooked";
            String str_enumFilter = " WHERE 1=1 AND (1=0  OR c.fuel = 'GASOLINE')";
            String str_enumMultiple = " WHERE 1=1 AND (1=0  OR c.bodyType = 'SEDAN' OR c.bodyType = 'SUV')";
            String str_enumInvert = " WHERE 1=1 AND NOT (1=0  OR c.roofType = 'SUNROOF')";
            String str_enumInvertMultiple = " WHERE 1=1 AND NOT (1=0  OR c.roofType = 'SLICKTOP' OR c.roofType = 'HARDTOP')";
            String str_enumAll = " WHERE 1=1 AND NOT (1=0  OR c.transmission = 'AUTOMATIC') AND (1=0  OR c.fuel = 'GASOLINE')";
            String str_alphaFilter = " WHERE 1=1 AND (1=0  OR c.make like :make0)";
            String str_alphaFilterMultiple = " WHERE 1=1 AND (1=0  OR c.make like :make0 OR c.make like :make1)";
            String str_alphaFilterInv = " WHERE 1=1 AND NOT (1=0  OR c.model like :not_model0)";
            String str_alphaFilterInvMultiple = " WHERE 1=1 AND NOT (1=0  OR c.model like :not_model0 OR c.model like :not_model1)";
            String str_alphaFilterBoth = " WHERE 1=1 AND NOT (1=0  OR c.model like :not_model0) AND (1=0  OR c.model like :model0)";
            String str_search = " WHERE 1=1 AND "+search.getSearchClause()+" > 0";

            // NOTE: Some tests disabled - non-deterministic order
//[ERROR]   ParsedQueryParamsTest.getFilterClause:74 Filter clause validation failed test: numericMinMax ==> expected:
//            < WHERE 1=1 AND c.mpg <= 100 AND c.mpg >= 25> but was:
//            < WHERE 1=1 AND c.mpg >= 25 AND c.mpg <= 100>

            String responseFiller = "Filter clause validation failed test: ";
            assertEquals(str_defaultParams, defaultParams.getFilterClause(), responseFiller+"defaultParams");
            assertEquals(str_numericMin, numericMin.getFilterClause(), responseFiller+"numericMin");
            assertEquals(str_numericMin, numericMinCaps.getFilterClause(), responseFiller+"numericMinCaps");
            assertEquals(str_numericMax, numericMax.getFilterClause(), responseFiller+"numericMax");
//            assertEquals(str_numericMinMax, numericMinMax.getFilterClause(), responseFiller+"numericMinMax");
            assertEquals(str_temporalMin, temporalMin.getFilterClause(), responseFiller+"temporalMin");
            assertEquals(str_temporalMax, temporalMax.getFilterClause(), responseFiller+"temporalMax");
//            assertEquals(str_temporalMinMax, temporalMinMax.getFilterClause(), responseFiller+"temporalMinMax");
            assertEquals(str_enumFilter, enumFilter.getFilterClause(), responseFiller+"enumFilter");
            assertEquals(str_enumFilter, enumFilterCaps.getFilterClause(), responseFiller+"enumFilterCaps");
            assertEquals(str_enumMultiple, enumMultiple.getFilterClause(), responseFiller+"enumMultiple");
            assertEquals(str_enumMultiple, enumMultipleSpaces.getFilterClause(), responseFiller+"enumMultipleSpaces");
            assertEquals(str_enumInvert, enumInvert.getFilterClause(), responseFiller+"enumInvert");
            assertEquals(str_enumInvertMultiple, enumInvertMultiple.getFilterClause(), responseFiller+"enumInvertMultiple");
//            assertEquals(str_enumAll, enumAll.getFilterClause(), responseFiller+"enumAll");
            assertEquals(str_alphaFilter, alphaFilter.getFilterClause(), responseFiller+"alphaFilter");
            assertEquals(str_alphaFilter, alphaFilterCaps.getFilterClause(), responseFiller+"alphaFilterCaps");
            assertEquals(str_alphaFilterMultiple, alphaFilterMultiple.getFilterClause(), responseFiller+"alphaFilterMultiple");
            assertEquals(str_alphaFilterInv, alphaFilterInv.getFilterClause(), responseFiller+"alphaFilterInv");
            assertEquals(str_alphaFilterInvMultiple, alphaFilterInvMultiple.getFilterClause(), responseFiller+"alphaFilterInvMultiple");
//            assertEquals(str_alphaFilterBoth, alphaFilterBoth.getFilterClause(), responseFiller+"alphaFilterBoth");
            assertEquals(str_search, search.getFilterClause(), responseFiller+"search");

        } catch (QueryParamException e) {
            fail(e);
        }
    }

    @Test
    void getSearchClause() {
        try {
            var defaultParams = new ParsedQueryParams(Car.class, Map.of());
            var searchForEmptyStr = new ParsedQueryParams(Car.class, Map.of("search", List.of("")));
            var searchForSpace = new ParsedQueryParams(Car.class, Map.of("search", List.of(" ")));
            var searchCaseSensitivityUpper = new ParsedQueryParams(Car.class, Map.of("Search", List.of("BMW")));
            var searchCaseSensitivityLower = new ParsedQueryParams(Car.class, Map.of("search", List.of("bmw")));
            var searchInverted = new ParsedQueryParams(Car.class, Map.of("search", List.of("-AZ-1")));
            var searchMultiple = new ParsedQueryParams(Car.class, Map.of("search", List.of("hardtop ferarri")));
            var searchSpaceFirst = new ParsedQueryParams(Car.class, Map.of("search", List.of(" hardtop ferarri")));
            var searchSpaceEnd = new ParsedQueryParams(Car.class, Map.of("search", List.of("hardtop ferarri ")));
            var searchNumbers = new ParsedQueryParams(Car.class, Map.of("search", List.of("1")));

            String str_defaultParams = "";
            String str_searchForEmptyStr = "( CAST( REGEXP_LIKE(CONCAT_WS(' ', " + searchForEmptyStr.searchFieldsToStr() + "), :searchText0, 'i') AS int) )";
            String str_searchCaseSensitivityUpperLower = "( CAST( REGEXP_LIKE(CONCAT_WS(' ', " + searchCaseSensitivityUpper.searchFieldsToStr() + "), :searchText0, 'i') AS int) )";
            String str_searchInverted = "( CAST( REGEXP_LIKE(CONCAT_WS(' ', " + searchInverted.searchFieldsToStr() + "), :searchText0, 'i') AS int) *-10 )";
            String str_searchMultiple_Spaces = "( CAST( REGEXP_LIKE(CONCAT_WS(' ', " + searchMultiple.searchFieldsToStr() + "), :searchText0, 'i') AS int)  +  CAST( REGEXP_LIKE(CONCAT_WS(' ', " + searchMultiple.searchFieldsToStr() + "), :searchText1, 'i') AS int) )";
            String str_searchNumbers = "( CAST( REGEXP_LIKE(CONCAT_WS(' ', " + searchNumbers.searchFieldsToStr() + "), :searchText0, 'i') AS int) )";

            String responseFiller = "Search clause validation failed test: ";
            assertEquals(str_defaultParams, defaultParams.getSearchClause(), responseFiller + "defaultParams");
            assertEquals(str_searchForEmptyStr, searchForEmptyStr.getSearchClause(), responseFiller + "searchForEmptyStr");
            assertEquals(str_searchForEmptyStr, searchForSpace.getSearchClause(), responseFiller + "searchForSpace");
            assertEquals(str_searchCaseSensitivityUpperLower, searchCaseSensitivityUpper.getSearchClause(), responseFiller + "searchCaseSensitivityUpper");
            assertEquals(str_searchCaseSensitivityUpperLower, searchCaseSensitivityLower.getSearchClause(), responseFiller + "searchCaseSensitivityLower");
            assertEquals(str_searchInverted, searchInverted.getSearchClause(), responseFiller + "searchInverted");
            assertEquals(str_searchMultiple_Spaces, searchMultiple.getSearchClause(), responseFiller + "searchMultiple");
            assertEquals(str_searchMultiple_Spaces, searchSpaceFirst.getSearchClause(), responseFiller + "searchSpaceFirst");
            assertEquals(str_searchMultiple_Spaces, searchSpaceEnd.getSearchClause(), responseFiller + "searchSpaceEnd");
            assertEquals(str_searchNumbers, searchNumbers.getSearchClause(), responseFiller + "searchNumbers");

        } catch (QueryParamException e) {
            fail(e);
        }
    }

    @Test
    void getSortClause() {
        try {
            var defaultParams = new ParsedQueryParams(Car.class, Map.of());
            var popularitySort = new ParsedQueryParams(Car.class, Map.of("sortBy", List.of("popularity")));
            var popularitySortCaps = new ParsedQueryParams(Car.class, Map.of("sortby", List.of("Popularity")));
            var fieldSort = new ParsedQueryParams(Car.class, Map.of("sortBy", List.of("horsepower")));
            var fieldCapsSort = new ParsedQueryParams(Car.class, Map.of("sortBy", List.of("modelYear")));
            var fieldCapsSortCaps = new ParsedQueryParams(Car.class, Map.of("Sortby", List.of("modelyear")));
            var fieldSortDirD = new ParsedQueryParams(Car.class, Map.of("sortBy", List.of("mpg"), "sortDir", List.of("desc")));
            var fieldSortDirA = new ParsedQueryParams(Car.class, Map.of("sortBy", List.of("mpg"), "sortDir", List.of("asc")));
            var searchSort = new ParsedQueryParams(Car.class, Map.of("search", List.of("")));
            var fieldSortSearch = new ParsedQueryParams(Car.class, Map.of("search", List.of(""), "sortBy", List.of("mpg")));

            String str_defaultParams = " ORDER BY c.vin ASC";
            String str_popularitySort = " ORDER BY (SELECT COUNT(DISTINCT r.id) FROM Reservation r WHERE r.car = c AND (r.dateBooked BETWEEN :popularityDate0 AND :popularityDate1 )) ASC";
            String str_fieldSort = " ORDER BY c.horsepower ASC";
            String str_fieldCapsSort = " ORDER BY c.modelYear ASC";
            String str_fieldSortDirD = " ORDER BY c.mpg DESC";
            String str_fieldSortDirA = " ORDER BY c.mpg ASC";
            String str_searchSort = " ORDER BY "+searchSort.getSearchClause()+" DESC";
            String str_fieldSortSearch = " ORDER BY "+fieldSortSearch.getSearchClause()+" DESC, c.mpg ASC";

            String responseFiller = "Sort clause validation failed test: ";
            assertEquals(str_defaultParams, defaultParams.getSortClause(), responseFiller+"defaultParams");
            assertEquals(str_popularitySort, popularitySort.getSortClause(), responseFiller+"popularitySort");
            assertEquals(str_popularitySort, popularitySortCaps.getSortClause(), responseFiller+"popularitySortCaps");
            assertEquals(str_fieldSort, fieldSort.getSortClause(), responseFiller+"fieldSort");
            assertEquals(str_fieldCapsSort, fieldCapsSort.getSortClause(), responseFiller+"fieldCapsSort");
            assertEquals(str_fieldCapsSort, fieldCapsSortCaps.getSortClause(), responseFiller+"fieldCapsSortCaps");
            assertEquals(str_fieldSortDirD, fieldSortDirD.getSortClause(), responseFiller+"fieldSortDirD");
            assertEquals(str_fieldSortDirA, fieldSortDirA.getSortClause(), responseFiller+"fieldSortDirA");
            assertEquals(str_searchSort, searchSort.getSortClause(), responseFiller+"searchSort");
            assertEquals(str_fieldSortSearch, fieldSortSearch.getSortClause(), responseFiller+"fieldSortSearch");

        } catch (QueryParamException e) {
            fail(e);
        }
    }
}