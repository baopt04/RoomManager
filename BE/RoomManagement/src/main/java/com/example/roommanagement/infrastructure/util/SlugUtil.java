package com.example.roommanagement.infrastructure.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SlugUtil {

    public static String toSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        // Normalize string
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("");

        // Specific Vietnamese character handling (some might remain after NFD)
        slug = slug.toLowerCase()
                .replace("đ", "d")
                .replaceAll("[^a-z0-9\\s]", "") // Remove all non-alphanumeric except whitespace
                .trim()
                .replaceAll("\\s+", "-"); // Replace whitespace with hyphens

        return slug;
    }
}
