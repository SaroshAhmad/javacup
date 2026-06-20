package dev.javacup.backend.roadmap;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadmapTopicRepository extends JpaRepository<RoadmapTopic, Integer> {

    List<RoadmapTopic> findByStageIdOrderByOrderIndexAsc(Integer stageId);

    List<RoadmapTopic> findAllByOrderByStageIdAscOrderIndexAsc();
}
