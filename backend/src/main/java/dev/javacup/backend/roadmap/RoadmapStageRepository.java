package dev.javacup.backend.roadmap;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoadmapStageRepository extends JpaRepository<RoadmapStage, Integer> {

    List<RoadmapStage> findAllByOrderByOrderIndexAsc();

    Optional<RoadmapStage> findByOrderIndex(Integer orderIndex);
}
