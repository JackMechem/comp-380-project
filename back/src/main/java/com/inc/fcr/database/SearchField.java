package com.inc.fcr.database;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * Marks an entity field as searchable via the {@code search} query parameter.
 *
 * <p>Fields annotated with {@code @SearchField} are included in the full-text
 * {@code CONCAT_WS} + {@code REGEXP_LIKE} search clause built by
 * {@link ParsedQueryParams}. Supported on string-type fields only.</p>
 *
 * <p>Retention is {@link RetentionPolicy#RUNTIME} so the annotation can be
 * discovered reflectively during query parameter parsing.</p>
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface SearchField {
}
