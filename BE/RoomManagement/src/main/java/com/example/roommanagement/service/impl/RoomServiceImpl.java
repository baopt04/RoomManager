package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.contract.ImageUploadDTO;
import com.example.roommanagement.dto.request.image.FindAllImageProjection;
import com.example.roommanagement.dto.request.room.*;
import com.example.roommanagement.entity.*;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.example.roommanagement.infrastructure.constant.StatusRoom;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.*;
import com.example.roommanagement.service.RoomService;
import com.example.roommanagement.util.Generate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {
    @Override
    public List<FindAllRoomDTO> findAllRooms() {
        return roomRepository.findRoom();
    }

    @Override
    public CreateRoomDTO createRoom(CreateRoomDTO createRoomDTO) {
        if (roomRepository.existsByName(createRoomDTO.getName())) {
            throw new BusinessException(Constrants.NAME_EXISTS);
        }

        Customer customer = null;

        if (createRoomDTO.getCustomerId() != null) {
            customer = customerRepository.findById(createRoomDTO.getCustomerId())
                    .orElseThrow(() -> new BusinessException(Constrants.CUSTOMER_FOUND));
        }

        HouseForRent houseForRent = houseForRentRepository.findById(createRoomDTO.getHouseForRentId()).orElseThrow(
                () -> new BusinessException(Constrants.HOUSE_FOR_RENT_FOUND)
        );

        Room room = Room.builder()
                .code(generate.generateCodeRoom())
                .name(createRoomDTO.getName())
                .price(createRoomDTO.getPrice())
                .acreage(createRoomDTO.getAcreage())
                .peopleMax(createRoomDTO.getPeopleMax())
                .decription(createRoomDTO.getDecription())
                .type(createRoomDTO.getType())
                .status(createRoomDTO.getStatus())
                .houseForRent(houseForRent)
                .customer(customer)
                .build();
        roomRepository.save(room);
        if (createRoomDTO.getImages() != null && !createRoomDTO.getImages().isEmpty()) {
            List<ImageUploadDTO> imageUploadDTOS = createRoomDTO.getImages().stream().map(file -> {
                try {
                    return new ImageUploadDTO(file.getOriginalFilename(), file.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
            }).collect(Collectors.toList());

            asyncImageService.uploadImagesRoom(imageUploadDTOS, room);
        }
        return createRoomDTO;
    }

    @Override
    public UpdateRoomDTO updateRoom(String id, UpdateRoomDTO updateRoomDTO) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        Optional<Contract> optionalContract = contractRepository.findTopByRoomIdOrderByLastModifiedDateDesc(id);
        if (!optionalRoom.isPresent()) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        if (!optionalRoom.get().getName().equals(updateRoomDTO.getName())) {
            if (roomRepository.existsByName(updateRoomDTO.getName())) {
                throw new BusinessException(Constrants.NAME_EXISTS);
            }
        }
        if (optionalContract.isPresent()) {
            StatusContract statusContract = optionalContract.get().getStatus();
            if (statusContract == StatusContract.DUNG_KINH_DOANH) {
                throw new BusinessException(Constrants.CONTRACT_ROOM_STATUS);
            }
        }

        Customer customer = customerRepository.findById(updateRoomDTO.getCustomerId()).orElseThrow(
                () -> new BusinessException(Constrants.CUSTOMER_FOUND)
        );
        HouseForRent houseForRent = houseForRentRepository.findById(updateRoomDTO.getHouseForRentId()).orElseThrow(
                () -> new BusinessException(Constrants.HOUSE_FOR_RENT_FOUND)
        );
        StatusRoom statusRoom = updateRoomDTO.getStatus();
        if (statusRoom == StatusRoom.DANG_CHO_THUE) {
            statusRoom = StatusRoom.DANG_CHO_THUE;
        }else if (statusRoom == StatusRoom.TRONG) {
            statusRoom = StatusRoom.TRONG;
        }else {
            statusRoom = StatusRoom.DUNG_KINH_DOANH;
        }

        Room room = optionalRoom.get();
        room.setName(updateRoomDTO.getName());
        room.setPrice(updateRoomDTO.getPrice());
        room.setAcreage(updateRoomDTO.getAcreage());
        room.setPeopleMax(updateRoomDTO.getPeopleMax());
        room.setDecription(updateRoomDTO.getDecription());
        room.setType(updateRoomDTO.getType());
        room.setStatus(statusRoom);
        room.setHouseForRent(houseForRent);
        room.setCustomer(customer);
        roomRepository.save(room);

        List<Image> oldImages = imageRepository.findByRoomId(id);
        if (updateRoomDTO.getImages() != null && !updateRoomDTO.getImages().isEmpty()) {
            // updload file mới (kèm theo ảnh cũ cần giu )
            if (updateRoomDTO.getImages() != null && !updateRoomDTO.getImages().isEmpty()) {
                List<String> keepUrls = updateRoomDTO.getImageUrls();
                // Drop image no list
                List<Image> delete = oldImages.stream()
                        .filter(images -> !keepUrls.contains(images.getName()))
                        .collect(Collectors.toList());
                if (!delete.isEmpty()) {
                    System.out.println("Delete old image" + delete.size());
                    imageRepository.deleteAll(delete);
                }
            }else {
                // if no imageUrls -> delete all iamge old
                imageRepository.deleteAll(oldImages);
            }
             // uplaod image new
            List<ImageUploadDTO> imageUploadDTOS = updateRoomDTO.getImages().stream().map(file -> {
                try {
                    return new ImageUploadDTO(file.getOriginalFilename(), file.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
            }).collect(Collectors.toList());

            asyncImageService.updateImagesForUpdateRoom(imageUploadDTOS, room);

        } // only have imgaeUrls(No image new )
        else if (updateRoomDTO.getImageUrls() != null) {
            System.out.println("update imageUrl");
            List<String> keepUrls = updateRoomDTO.getImageUrls();
            //Delete image No list
            List<Image> delete = oldImages.stream()
                    .filter(images -> !keepUrls.contains(images.getName()))
                    .collect(Collectors.toList());
            if (!delete.isEmpty()) {
                imageRepository.deleteAll(delete);
            }
             // add image new for url
            List<String> imageNew = oldImages.stream()
                    .map(Image::getName)
                    .collect(Collectors.toList());
            List<Image> add = keepUrls.stream()
                    .filter(url -> !imageNew.contains(url))
                    .map(url -> Image.builder()
                            .name(url)
                            .room(room)
                            .build())
                    .collect(Collectors.toList());
            if (!add.isEmpty()) {
                imageRepository.saveAll(add);
            }
        }
        // No image -> remove all
        else {
            if (!oldImages.isEmpty()) {
                imageRepository.deleteAll(oldImages);
            }
        }

        return updateRoomDTO;
    }

    @Override
    public FindAllRoomDTO findCustomerAndHouseForRent(String customer, String houseForRent) {
        if (customer == null && customer.isEmpty() || houseForRent == null && houseForRent.isEmpty()) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        FindAllRoomDTO find = roomRepository.getCustomerAndHouseForRent(customer, houseForRent);
        if (find == null) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        return find;
    }

    @Override
    public BaseRoomDTO detailRoom(String id) {
        Optional<Room> room = roomRepository.findById(id);
        if (!room.isPresent()) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        BaseRoomDTO baseRoomDTO = new BaseRoomDTO();
        baseRoomDTO.setCode(room.get().getCode());
        baseRoomDTO.setName(room.get().getName());
        baseRoomDTO.setSlug(room.get().getSlug());
        baseRoomDTO.setPrice(room.get().getPrice());
        baseRoomDTO.setAcreage(room.get().getAcreage());
        baseRoomDTO.setPeopleMax(room.get().getPeopleMax());
        baseRoomDTO.setDecription(room.get().getDecription());
        baseRoomDTO.setType(room.get().getType());
        baseRoomDTO.setStatus(room.get().getStatus());
        baseRoomDTO.setCustomerId(
                room.get().getCustomer() != null ? room.get().getCustomer().getId() : null
        );

        baseRoomDTO.setHouseForRentId(
                room.get().getHouseForRent() != null ? room.get().getHouseForRent().getId() : null
        );

        return baseRoomDTO;
    }

    @Override
    public List<FindAllRoomProjection> findAllRoomNoPayment(Integer mother, Integer year) {
        return roomRepository.findRoomsWithoutBillInMonthAndYear(mother, year);
    }

    @Override
    public RoomDetailProjection findTotalPriceRoom(String id) {
        return roomRepository.findTotalPriceRoomDetailById(id);
    }

    @Override
    public List<FindAllImageProjection> findAllImagesForRoom(String id) {
        return imageRepository.findByRoomIdImage(id);

    }

    @Override
    public List<FindAllRoomDTO> findAllHouseForRentAndCustomer(String idHouseForRent , String idCustomer) {
        return roomRepository.findAllRoomsByHouseForRentAndCustomer(idHouseForRent, idCustomer);
    }

    @Override
    public List<FindAllRoomHistoryProjection> findAllRoomHistory(String idRoom) {
        return roomHistoryRepository.findAllRoomHistoryProjection(idRoom);
    }

    @Override
    public List<RoomStatusCountProjection> getAllStatusRoom() {
        return roomRepository.getAllStatusRoom();
    }

    @Override
    public List<FindAllRoomDTO> findAllRoomByCustomer(String idCustomer) {
        return roomRepository.findByCustomer_Id(idCustomer);
    }


    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private Generate generate;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private AsyncImageService asyncImageService;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private HouseForRentRepository houseForRentRepository;
    @Autowired
    private RoomHistoryRepository roomHistoryRepository;
    @Autowired
    private ContractRepository contractRepository;
}
