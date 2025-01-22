package com.mxs.smiledept.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@Entity
@Table(name = "downloads")
@EqualsAndHashCode(callSuper = true)
public class Download extends BaseEntity {
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @Column(nullable = false)
    private String fileUrl;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Column(nullable = false)
    private Integer downloadCount = 0;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false, columnDefinition = "json")
    private List<UserRole> visibleTo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;
} 