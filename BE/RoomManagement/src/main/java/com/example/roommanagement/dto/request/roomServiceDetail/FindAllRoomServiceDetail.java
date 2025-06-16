package com.example.roommanagement.dto.request.roomServiceDetail;

import com.example.roommanagement.entity.Room;
import com.example.roommanagement.entity.ServiceS;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindAllRoomServiceDetail {
    private Long stt;
    private String id;
    private String service;
    private String room;
}
