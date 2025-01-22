package com.mxs.smiledept.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "departments")
@EqualsAndHashCode(callSuper = true)
public class Department extends BaseEntity {
    @Column(nullable = false)
    private String name;
    
    private String description;
} 