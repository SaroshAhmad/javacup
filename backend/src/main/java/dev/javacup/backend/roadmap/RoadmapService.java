package dev.javacup.backend.roadmap;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Assembles the PUBLIC roadmap: stages in order, each with its PUBLISHED topics in order.
 * Draft topics are never returned here — they appear only in the admin views.
 *
 * Fetches published topics and all stages in two queries, grouping in memory to avoid N+1.
 */
@Service
public class RoadmapService {

    private final RoadmapStageRepository stageRepository;
    private final RoadmapTopicRepository topicRepository;

    public RoadmapService(RoadmapStageRepository stageRepository, RoadmapTopicRepository topicRepository) {
        this.stageRepository = stageRepository;
        this.topicRepository = topicRepository;
    }

    @Transactional(readOnly = true)
    public List<StageResponse> fullRoadmap() {
        Map<Integer, List<TopicResponse>> topicsByStage = topicRepository
                .findByPublishedTrueOrderByStageIdAscOrderIndexAsc()
                .stream()
                .collect(Collectors.groupingBy(
                        RoadmapTopic::getStageId,
                        Collectors.mapping(TopicResponse::of, Collectors.toList())
                ));

        return stageRepository.findAllByOrderByOrderIndexAsc()
                .stream()
                .map(stage -> StageResponse.of(stage, topicsByStage.getOrDefault(stage.getId(), List.of())))
                .toList();
    }

    @Transactional(readOnly = true)
    public StageResponse stageByOrderIndex(Integer orderIndex) {
        RoadmapStage stage = stageRepository.findByOrderIndex(orderIndex)
                .orElseThrow(() -> new StageNotFoundException(orderIndex));
        List<TopicResponse> topics = topicRepository.findByStageIdOrderByOrderIndexAsc(stage.getId())
                .stream()
                .filter(RoadmapTopic::isPublished)
                .map(TopicResponse::of)
                .toList();
        return StageResponse.of(stage, topics);
    }
}
