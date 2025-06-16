package com.example.roommanagement.dto.request.roomServiceDetail;

import com.example.roommanagement.entity.Room;
import com.example.roommanagement.entity.ServiceS;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseRoomServiceDetail {
    private ServiceS service;
    private Room room;
}
