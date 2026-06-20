package dev.javacup.backend.roadmap;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadmapTopicRepository extends JpaRepository<RoadmapTopic, Integer> {

    // Admin views — all topics regardless of publish state.
    List<RoadmapTopic> findByStageIdOrderByOrderIndexAsc(Integer stageId);

    List<RoadmapTopic> findAllByOrderByStageIdAscOrderIndexAsc();

    // Public views — only published topics.
    List<RoadmapTopic> findByPublishedTrueOrderByStageIdAscOrderIndexAsc();
}
