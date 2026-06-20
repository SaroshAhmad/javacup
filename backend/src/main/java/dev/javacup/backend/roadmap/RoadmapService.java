package dev.javacup.backend.roadmap;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Assembles the public roadmap: stages in order, each with its topics in order.
 *
 * Fetches all stages and all topics in two queries, then groups topics under stages in
 * memory — avoiding an N+1 query per stage. The roadmap is small (5 stages, tens of
 * topics), so loading it whole is cheap and simplest for the overview endpoint.
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
                .findAllByOrderByStageIdAscOrderIndexAsc()
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
                .map(TopicResponse::of)
                .toList();
        return StageResponse.of(stage, topics);
    }
}
