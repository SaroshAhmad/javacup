package dev.javacup.backend.roadmap;

import dev.javacup.backend.admin.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin-only roadmap topic management (F-01 content, managed in-app per the product
 * vision). Every method checks admin authorization first via AdminService; non-admins
 * receive 403. These sit under /api/v1/admin/** which SecurityConfig requires
 * authentication for (and the admin check narrows it to admins).
 *
 *  POST   /api/v1/admin/roadmap/topics            create a topic (appended to its stage)
 *  PUT    /api/v1/admin/roadmap/topics/{id}       update a topic
 *  DELETE /api/v1/admin/roadmap/topics/{id}       delete a topic
 *  PUT    /api/v1/admin/roadmap/topics/reorder    reorder topics within a stage
 */
@RestController
@RequestMapping("/api/v1/admin/roadmap/topics")
public class RoadmapAdminController {

    private final AdminService adminService;
    private final RoadmapAdminService roadmapAdminService;

    public RoadmapAdminController(AdminService adminService, RoadmapAdminService roadmapAdminService) {
        this.adminService = adminService;
        this.roadmapAdminService = roadmapAdminService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TopicResponse create(Authentication authentication, @Valid @RequestBody TopicWriteRequest request) {
        adminService.requireAdmin(authentication);
        return roadmapAdminService.create(request);
    }

    @PutMapping("/{id}")
    public TopicResponse update(Authentication authentication,
                                @PathVariable Integer id,
                                @Valid @RequestBody TopicWriteRequest request) {
        adminService.requireAdmin(authentication);
        return roadmapAdminService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Integer id) {
        adminService.requireAdmin(authentication);
        roadmapAdminService.delete(id);
    }

    @PutMapping("/reorder")
    public List<TopicResponse> reorder(Authentication authentication,
                                       @Valid @RequestBody TopicReorderRequest request) {
        adminService.requireAdmin(authentication);
        return roadmapAdminService.reorder(request);
    }
}
