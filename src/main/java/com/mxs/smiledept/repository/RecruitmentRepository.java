package com.mxs.smiledept.repository;

import com.mxs.smiledept.model.entity.Recruitment;
import com.mxs.smiledept.model.enums.RecruitmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RecruitmentRepository extends JpaRepository<Recruitment, Long> {
    List<Recruitment> findByStatus(RecruitmentStatus status);
    List<Recruitment> findByDepartmentId(Long departmentId);
    
    @Query("SELECT r FROM Recruitment r JOIN FETCH r.department d JOIN FETCH r.position p WHERE r.status = ?1")
    List<Recruitment> findByStatusWithDetails(RecruitmentStatus status);
} 