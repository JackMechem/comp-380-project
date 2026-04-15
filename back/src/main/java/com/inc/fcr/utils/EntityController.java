package com.inc.fcr.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;

/**
 * Utility class providing reflective helpers for entity objects.
 */
public class EntityController {

    /**
     * Copies all non-static fields from {@code src} into {@code dest} using reflection.
     *
     * <p>Used by entity constructors that load an existing record from the database
     * and need to populate the current instance (e.g., {@code new Car(vin)}).</p>
     *
     * @param src  the source object to copy fields from
     * @param dest the destination object to copy fields into
     * @throws IllegalAccessException if a field cannot be accessed reflectively
     */
    public static void copyFields(Object src, Object dest) throws IllegalAccessException {
        for (Field field : src.getClass().getDeclaredFields()) {
            int modifiers = field.getModifiers(); // ignore static vars
            if (Modifier.isStatic(modifiers) /*|| Modifier.isFinal(modifiers)*/) continue;

            field.setAccessible(true); // override access modifier
            field.set(dest, field.get(src));
        }
    }
}
