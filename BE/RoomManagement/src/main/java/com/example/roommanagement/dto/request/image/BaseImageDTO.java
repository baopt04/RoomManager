package com.example.roommanagement.dto.request.image;

import com.example.roommanagement.entity.Contract;
import com.example.roommanagement.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class BaseImageDTO {
    private String name;
    private Room room;
    private Contract contract;
}
