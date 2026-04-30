package com.example.roommanagement.dto.respon.roomViewing;

import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RoomViewingResponse {
    private String id;
    private String name;
    private String phone;
    private String roomId;
    private String roomName;
    private LocalDateTime viewDate;
    private String note;
    private StatusRoomViewing status;
    private LocalDateTime createdAt;
}
