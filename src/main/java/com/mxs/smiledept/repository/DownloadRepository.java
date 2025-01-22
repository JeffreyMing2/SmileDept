package com.mxs.smiledept.repository;

import com.mxs.smiledept.model.entity.Download;
import com.mxs.smiledept.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByCategory(String category);
    
    @Query("SELECT d FROM Download d WHERE ?1 MEMBER OF d.visibleTo")
    List<Download> findByUserRole(UserRole role);
    
    @Query("SELECT d FROM Download d JOIN FETCH d.uploadedBy WHERE ?1 MEMBER OF d.visibleTo")
    List<Download> findByUserRoleWithUploader(UserRole role);
} 