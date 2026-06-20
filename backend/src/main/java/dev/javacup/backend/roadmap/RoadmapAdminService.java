package dev.javacup.backend.roadmap;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Admin-only roadmap topic operations: list-all (incl. drafts), create, update, delete,
 * reorder, and publish/unpublish. Authorization (requireAdmin) is enforced in the
 * controller before any of these run.
 *
 * New topics are created as DRAFT (published = false) and appended to the end of their
 * stage; the admin publishes them when ready. Reordering rewrites order_index to match the
 * supplied id order.
 */
@Service
public class RoadmapAdminService {

    private final RoadmapStageRepository stageRepository;
    private final RoadmapTopicRepository topicRepository;

    public RoadmapAdminService(RoadmapStageRepository stageRepository, RoadmapTopicRepository topicRepository) {
        this.stageRepository = stageRepository;
        this.topicRepository = topicRepository;
    }

    /** All stages with ALL their topics (drafts included) — the admin view. */
    @Transactional(readOnly = true)
    public List<StageResponse> adminRoadmap() {
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

    @Transactional
    public TopicResponse create(TopicWriteRequest request) {
        requireStage(request.stageId());

        List<RoadmapTopic> existing = topicRepository.findByStageIdOrderByOrderIndexAsc(request.stageId());
        int nextIndex = existing.isEmpty()
                ? 0
                : existing.get(existing.size() - 1).getOrderIndex() + 1;

        RoadmapTopic topic = new RoadmapTopic();
        topic.setStageId(request.stageId());
        topic.setTitle(request.title().trim());
        topic.setDescription(normalizeDescription(request.description()));
        topic.setPriority(request.priority());
        topic.setOrderIndex(nextIndex);
        topic.setPublished(false); // new topics start as drafts
        OffsetDateTime now = OffsetDateTime.now();
        topic.setCreatedAt(now);
        topic.setUpdatedAt(now);
        return TopicResponse.of(topicRepository.save(topic));
    }

    @Transactional
    public TopicResponse update(Integer topicId, TopicWriteRequest request) {
        RoadmapTopic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException(topicId));
        requireStage(request.stageId());

        topic.setStageId(request.stageId());
        topic.setTitle(request.title().trim());
        topic.setDescription(normalizeDescription(request.description()));
        topic.setPriority(request.priority());
        topic.setUpdatedAt(OffsetDateTime.now());
        return TopicResponse.of(topicRepository.save(topic));
    }

    @Transactional
    public TopicResponse setPublished(Integer topicId, boolean published) {
        RoadmapTopic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException(topicId));
        topic.setPublished(published);
        topic.setUpdatedAt(OffsetDateTime.now());
        return TopicResponse.of(topicRepository.save(topic));
    }

    @Transactional
    public void delete(Integer topicId) {
        if (!topicRepository.existsById(topicId)) {
            throw new TopicNotFoundException(topicId);
        }
        topicRepository.deleteById(topicId);
    }

    @Transactional
    public List<TopicResponse> reorder(TopicReorderRequest request) {
        requireStage(request.stageId());
        List<RoadmapTopic> stageTopics = topicRepository.findByStageIdOrderByOrderIndexAsc(request.stageId());

        if (stageTopics.size() != request.orderedTopicIds().size()
                || !stageTopics.stream().map(RoadmapTopic::getId).toList()
                        .containsAll(request.orderedTopicIds())) {
            throw new InvalidReorderException();
        }

        OffsetDateTime now = OffsetDateTime.now();
        for (int i = 0; i < request.orderedTopicIds().size(); i++) {
            Integer id = request.orderedTopicIds().get(i);
            RoadmapTopic topic = stageTopics.stream()
                    .filter(t -> t.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new TopicNotFoundException(id));
            topic.setOrderIndex(i);
            topic.setUpdatedAt(now);
        }
        topicRepository.saveAll(stageTopics);
        return topicRepository.findByStageIdOrderByOrderIndexAsc(request.stageId())
                .stream().map(TopicResponse::of).toList();
    }

    private void requireStage(Integer stageId) {
        if (!stageRepository.existsById(stageId)) {
            throw new StageNotFoundException(stageId);
        }
    }

    private static String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }
        String trimmed = description.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
