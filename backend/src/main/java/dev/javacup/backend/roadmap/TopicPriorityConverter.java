package dev.javacup.backend.roadmap;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Maps the TopicPriority enum (uppercase Java convention) to the lowercase text the
 * roadmap_topics.priority column stores and CHECK-constrains ('essential' / 'important' /
 * 'optional'). Keeps idiomatic enum names in Java without violating the DB constraint.
 */
@Converter(autoApply = false)
public class TopicPriorityConverter implements AttributeConverter<TopicPriority, String> {

    @Override
    public String convertToDatabaseColumn(TopicPriority attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public TopicPriority convertToEntityAttribute(String dbValue) {
        return dbValue == null ? null : TopicPriority.valueOf(dbValue.toUpperCase());
    }
}
