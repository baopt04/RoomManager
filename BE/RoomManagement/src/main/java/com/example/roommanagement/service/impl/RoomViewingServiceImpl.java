package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.roomViewing.RoomViewingRequest;
import com.example.roommanagement.dto.respon.roomViewing.RoomViewingResponse;
import com.example.roommanagement.entity.Room;
import com.example.roommanagement.entity.RoomViewing;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusRoomViewing;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.repository.RoomRepository;
import com.example.roommanagement.repository.RoomViewingRepository;
import com.example.roommanagement.service.RoomViewingService;
import com.example.roommanagement.service.TelegramService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomViewingServiceImpl implements RoomViewingService {

    private final RoomViewingRepository roomViewingRepository;
    private final RoomRepository roomRepository;
    private final TelegramService telegramService;

    @Override
    public RoomViewingResponse create(RoomViewingRequest request) {
        Room room = roomRepository.findById(request.getIdRoom())
                .orElseThrow(() -> new BusinessException(Constrants.NOT_FOUND));

        RoomViewing roomViewing = RoomViewing.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .room(room)
                .viewDate(request.getViewDate())
                .note(request.getNote())
                .status(StatusRoomViewing.MOI_DANG_KY)
                .build();
String message = formatMessage(roomViewing);
        telegramService.sendMessage(message);
        roomViewing = roomViewingRepository.save(roomViewing);
        return mapToResponse(roomViewing);
    }

    private String formatMessage(RoomViewing lich) {
        String ngayXem = "Chưa chọn";
        String gioXem = "Chưa chọn";

        if (lich.getViewDate() != null) {
            ngayXem = lich.getViewDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            gioXem  = lich.getViewDate().format(DateTimeFormatter.ofPattern("HH:mm"));
        }

        return """
        🏠 <b>KHÁCH ĐẶT LỊCH XEM PHÒNG MỚI!</b>
        ──────────────────
        👤 <b>Họ tên:</b> %s
        📞 <b>SĐT:</b> %s
        🏷️ <b>Phòng:</b> %s
        📅 <b>Ngày xem:</b> %s
        ⏰ <b>Giờ xem:</b> %s
        📝 <b>Ghi chú:</b> %s
        ──────────────────
        ⚡ Vui lòng liên hệ lại sớm!
        """.formatted(
                lich.getName(),
                lich.getPhone(),
                lich.getRoom() != null ? lich.getRoom().getName() : "Chưa chọn",
                ngayXem,
                gioXem,
                lich.getNote() != null ? lich.getNote() : "Không có"
        );
    }
    @Override
    public RoomViewingResponse updateStatus(String id, StatusRoomViewing status) {
        RoomViewing roomViewing = roomViewingRepository.findById(id)
                .orElseThrow(() -> new BusinessException(Constrants.NOT_FOUND));
        
        roomViewing.setStatus(status);
        roomViewing = roomViewingRepository.save(roomViewing);
        return mapToResponse(roomViewing);
    }

    @Override
    public List<RoomViewingResponse> getAll() {
        return roomViewingRepository.findAllWithRoom()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomViewingResponse> getByStatus(StatusRoomViewing status) {
        return roomViewingRepository.findByStatusWithRoom(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RoomViewingResponse mapToResponse(RoomViewing roomViewing) {
        return RoomViewingResponse.builder()
                .id(roomViewing.getId())
                .name(roomViewing.getName())
                .phone(roomViewing.getPhone())
                .roomId(roomViewing.getRoom().getId())
                .roomName(roomViewing.getRoom().getName())
                .viewDate(roomViewing.getViewDate())
                .note(roomViewing.getNote())
                .status(roomViewing.getStatus())
                .createdAt(roomViewing.getCreateDate())
                .build();
    }
}
