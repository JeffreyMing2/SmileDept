package com.mxs.smiledept.service;

import com.mxs.smiledept.model.dto.MemberDTO;
import com.mxs.smiledept.model.entity.Department;
import com.mxs.smiledept.model.entity.Member;
import com.mxs.smiledept.model.entity.Position;
import com.mxs.smiledept.model.entity.User;
import com.mxs.smiledept.model.enums.MemberStatus;
import com.mxs.smiledept.repository.DepartmentRepository;
import com.mxs.smiledept.repository.MemberRepository;
import com.mxs.smiledept.repository.PositionRepository;
import com.mxs.smiledept.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    @Transactional(readOnly = true)
    public List<MemberDTO> findActiveMembers() {
        return memberRepository.findByStatusWithDetails(MemberStatus.ACTIVE)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MemberDTO createMember(MemberDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("部门不存在"));
        
        Position position = positionRepository.findById(dto.getPositionId())
                .orElseThrow(() -> new RuntimeException("职位不存在"));

        if (memberRepository.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("该用户已是成员");
        }

        Member member = new Member();
        member.setUser(user);
        member.setDepartment(department);
        member.setPosition(position);
        member.setJoinDate(dto.getJoinDate());
        member.setStatus(MemberStatus.ACTIVE);

        member = memberRepository.save(member);
        return convertToDTO(member);
    }

    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setUserId(member.getUser().getId());
        dto.setUsername(member.getUser().getUsername());
        dto.setNickname(member.getUser().getNickname());
        dto.setDepartmentId(member.getDepartment().getId());
        dto.setDepartmentName(member.getDepartment().getName());
        dto.setPositionId(member.getPosition().getId());
        dto.setPositionName(member.getPosition().getName());
        dto.setJoinDate(member.getJoinDate());
        dto.setStatus(member.getStatus());
        return dto;
    }
} 