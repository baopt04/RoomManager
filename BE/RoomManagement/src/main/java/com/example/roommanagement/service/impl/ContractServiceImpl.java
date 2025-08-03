package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.contract.*;
import com.example.roommanagement.entity.*;
import com.example.roommanagement.infrastructure.cloudinary.UploadImageService;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.constant.StatusContract;
import com.example.roommanagement.infrastructure.constant.StatusRoomHistory;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.*;
import com.example.roommanagement.service.ContractService;
import com.example.roommanagement.util.Generate;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@EnableAsync
public class ContractServiceImpl implements ContractService {
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private Generate generate;
    @Autowired
    private UploadImageService uploadImageService;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private HouseForRentRepository houseForRentRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AsyncImageService asyncImageService;
    @Autowired
    private RoomHistoryRepository roomHistoryRepository;
    @Override
    public List<FindAllContractDTO> findAll() {
        return contractRepository.findAllContracts();
    }

    @Override
    public CreateContractDTO create(CreateContractDTO createContractDTO) {
        if (contractRepository.existsByRoom_Id(createContractDTO.getRoomId())) {
            throw new BusinessException(Constrants.ROOM_EXISTS);
        }
        Room room = roomRepository.findById(createContractDTO.getRoomId())
                .orElseThrow(() -> new BusinessException(Constrants.ROOM_FOUND));
        Admin admin = adminRepository.findById(createContractDTO.getAdminId())
                .orElseThrow(() -> new BusinessException(Constrants.ADMIN_FOUND));

        Date startDate = createContractDTO.getDateStart();
        Date endDate = createContractDTO.getNextDueDate();
        Calendar start = Calendar.getInstance();
        start.setTime(startDate);
        Calendar end = Calendar.getInstance();
        end.setTime(endDate);

        Customer customer = customerRepository.findById(createContractDTO.getCustomerId()).
                orElseThrow(() -> new BusinessException(Constrants.CUSTOMER_FOUND));
        Contract contract = Contract.builder()
                .code(generate.generateCodeContract())
                .dateStart(createContractDTO.getDateStart())
                .dateEnd(createContractDTO.getDateEnd())
                .contractDeponsit(createContractDTO.getContractDeponsit())
                .nextDueDate(createContractDTO.getNextDueDate())
                .status(createContractDTO.getStatus())
                .description(createContractDTO.getDescription())
                .room(room)
                .houseForRent(room.getHouseForRent())
                .admin(admin)
                .customer(customer)
                .build();
        contractRepository.save(contract);
       while (start.before(end)) {
           Calendar nextMonth =(Calendar) start.clone();
           nextMonth.add(Calendar.MONTH, 1);
           RoomHistory history = RoomHistory.builder()
                   .price(room.getPrice()) // hoặc từ DTO
                   .startDate(start.getTime())
                   .endDate(nextMonth.getTime())
                   .room(room)
                   .customer(customer)
                   .status(StatusRoomHistory.DANG_CHO_THUE)
                   .isPaid(true)
                   .build();

           roomHistoryRepository.save(history);
           start = nextMonth;
       }
        if (createContractDTO.getImages() != null && !createContractDTO.getImages().isEmpty()) {
            List<ImageUploadDTO> imageUploadDTOS = createContractDTO.getImages().stream().map(file -> {
                try {
                    return new ImageUploadDTO(file.getOriginalFilename(), file.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
            }).collect(Collectors.toList());

            asyncImageService.uploadImages(imageUploadDTOS, contract);
        }
        return createContractDTO;
    }

    @Override
    public UpdateContractDTO update(String id, UpdateContractDTO updateContractDTO) {
        Optional<Contract> contract = contractRepository.findById(id);
        if (contractRepository.existsByRoom_Id(updateContractDTO.getRoomId())) {
            throw new BusinessException(Constrants.ROOM_EXISTS);
        }
        System.out.println("Check id " + id);
        if (!contract.isPresent()) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        Room room = roomRepository.findById(updateContractDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException(Constrants.ROOM_FOUND));
        Admin admin = adminRepository.findById(updateContractDTO.getAdminId())
                .orElseThrow(() -> new RuntimeException(Constrants.ADMIN_FOUND));
        HouseForRent houseForRent = houseForRentRepository.findById(updateContractDTO.getHouseForRentId()).
                orElseThrow(() -> new RuntimeException(Constrants.HOUSE_FOR_RENT_FOUND));
        Customer customer = customerRepository.findById(updateContractDTO.getCustomerId()).
                orElseThrow(() -> new RuntimeException(Constrants.CUSTOMER_FOUND));
        System.out.println("Check room " + updateContractDTO.getRoomId());
        System.out.println("Check house " + updateContractDTO.getHouseForRentId());
        System.out.println("Check admin " + updateContractDTO.getAdminId());
        System.out.println("Check customer " + updateContractDTO.getCustomerId());

        Contract con = contract.get();
        con.setDateStart(updateContractDTO.getDateStart());
        con.setDateEnd(updateContractDTO.getDateEnd());
        con.setContractDeponsit(updateContractDTO.getContractDeponsit());
        con.setNextDueDate(updateContractDTO.getNextDueDate());
        con.setStatus(updateContractDTO.getStatus());
        con.setRoom(room);
        con.setHouseForRent(houseForRent);
        con.setAdmin(admin);
        con.setCustomer(customer);
        contractRepository.save(con);
        List<Image> oldImages = imageRepository.findByContractId(id);

// CASE 1: Có upload file mới (có thể kèm theo ảnh cũ cần giữ)
        if (updateContractDTO.getImages() != null && !updateContractDTO.getImages().isEmpty()) {
            System.out.println("Uploading new files - mixed mode");

            // Nếu có imageUrls -> giữ lại những ảnh cũ này
            if (updateContractDTO.getImageUrls() != null && !updateContractDTO.getImageUrls().isEmpty()) {
                List<String> keepUrls = updateContractDTO.getImageUrls();
                System.out.println("Keeping old URLs: " + keepUrls);

                // Xóa ảnh cũ KHÔNG có trong danh sách giữ lại
                List<Image> toDelete = oldImages.stream()
                        .filter(img -> !keepUrls.contains(img.getName()))
                        .collect(Collectors.toList());

                if (!toDelete.isEmpty()) {
                    System.out.println("Deleting old images: " + toDelete.size());
                    imageRepository.deleteAll(toDelete);
                }
            } else {
                // Không có imageUrls -> xóa hết ảnh cũ
                System.out.println("No old URLs to keep - deleting all old images");
                imageRepository.deleteAll(oldImages);
            }

            // Upload file mới
            List<ImageUploadDTO> imageUploadDTOS = updateContractDTO.getImages().stream().map(file -> {
                try {
                    return new ImageUploadDTO(file.getOriginalFilename(), file.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read file content", e);
                }
            }).collect(Collectors.toList());

            asyncImageService.updateImagesForUpdate(imageUploadDTOS, con);
        }
// CASE 2: Chỉ có imageUrls (không có file mới)
        else if (updateContractDTO.getImageUrls() != null) {
            System.out.println("Updating only with imageUrls - selective mode");

            List<String> keepUrls = updateContractDTO.getImageUrls();
            System.out.println("URLs to keep: " + keepUrls);

            // Xóa ảnh cũ không có trong danh sách
            List<Image> toDelete = oldImages.stream()
                    .filter(img -> !keepUrls.contains(img.getName()))
                    .collect(Collectors.toList());

            if (!toDelete.isEmpty()) {
                System.out.println("Deleting images: " + toDelete.size());
                imageRepository.deleteAll(toDelete);
            }

            // Thêm ảnh mới từ URL (nếu có)
            List<String> existingNames = oldImages.stream()
                    .map(Image::getName)
                    .collect(Collectors.toList());

            List<Image> toAdd = keepUrls.stream()
                    .filter(url -> !existingNames.contains(url))
                    .map(url -> Image.builder()
                            .name(url)
                            .contract(con)
                            .room(room)
                            .build())
                    .collect(Collectors.toList());

            if (!toAdd.isEmpty()) {
                System.out.println("Adding new images: " + toAdd.size());
                imageRepository.saveAll(toAdd);
            }
        }
// CASE 3: Không có ảnh nào -> xóa hết
        else {
            System.out.println("No images provided - deleting all old images");
            if (!oldImages.isEmpty()) {
                imageRepository.deleteAll(oldImages);
            }
        }
        return updateContractDTO;
    }

    @Override
    public DetailContractDTO detail(String id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new BusinessException(Constrants.NOT_FOUND));

        List<Image> images = imageRepository.findByContractId(id);

        DetailContractDTO dto = new DetailContractDTO();
        dto.setCode(contract.getCode());
        dto.setDateStart(contract.getDateStart());
        dto.setDateEnd(contract.getDateEnd());
        dto.setContractDeponsit(contract.getContractDeponsit());
        dto.setNextDueDate(contract.getNextDueDate());
        dto.setStatus(contract.getStatus());
        dto.setDescription(contract.getDescription());
        dto.setRoomId(contract.getRoom().getId());
        dto.setHouseForRentId(contract.getHouseForRent().getId());
        dto.setAdminId(contract.getAdmin().getId());
        dto.setCustomerId(contract.getCustomer().getId());
        dto.setImageUrls(images.stream().map(Image::getName).collect(Collectors.toList()));
        return dto;
    }



}


