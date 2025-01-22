package com.mxs.smiledept.repository;

import com.mxs.smiledept.model.entity.Punishment;
import com.mxs.smiledept.model.enums.PunishmentStatus;
import com.mxs.smiledept.model.enums.PunishmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PunishmentRepository extends JpaRepository<Punishment, Long> {
    List<Punishment> findByUserId(Long userId);
    List<Punishment> findByType(PunishmentType type);
    List<Punishment> findByStatus(PunishmentStatus status);
    
    @Query("SELECT p FROM Punishment p JOIN FETCH p.user u WHERE p.type = ?1 AND p.status = ?2")
    List<Punishment> findByTypeAndStatusWithUser(PunishmentType type, PunishmentStatus status);
    
    @Query("SELECT COUNT(p) FROM Punishment p WHERE p.user.id = ?1 AND p.status = 'ACTIVE'")
    long countActiveByUserId(Long userId);
} 