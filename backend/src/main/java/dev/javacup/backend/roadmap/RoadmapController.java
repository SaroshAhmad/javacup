package dev.javacup.backend.roadmap;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public roadmap API (F-01). No authentication required — the roadmap is fully public
 * (SecurityConfig allow-lists GET /api/v1/roadmap/**).
 *
 *  - GET /api/v1/roadmap                 → all stages, each with ordered topics.
 *  - GET /api/v1/roadmap/{position}      → a single stage by its order_index (1..5).
 */
@RestController
@RequestMapping("/api/v1/roadmap")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping
    public List<StageResponse> roadmap() {
        return roadmapService.fullRoadmap();
    }

    @GetMapping("/{position}")
    public StageResponse stage(@PathVariable Integer position) {
        return roadmapService.stageByOrderIndex(position);
    }
}
