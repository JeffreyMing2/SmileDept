package com.mxs.smiledept.repository;

import com.mxs.smiledept.model.entity.Member;
import com.mxs.smiledept.model.enums.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(Long userId);
    List<Member> findByDepartmentId(Long departmentId);
    List<Member> findByStatus(MemberStatus status);
    
    @Query("SELECT m FROM Member m JOIN FETCH m.user u JOIN FETCH m.department d JOIN FETCH m.position p WHERE m.status = ?1")
    List<Member> findByStatusWithDetails(MemberStatus status);
} 