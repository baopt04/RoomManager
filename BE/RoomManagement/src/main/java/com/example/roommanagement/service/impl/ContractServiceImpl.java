package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.contract.*;
import com.example.roommanagement.entity.*;
import com.example.roommanagement.infrastructure.cloudinary.UploadImageService;
import com.example.roommanagement.infrastructure.constant.*;
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
import org.springframework.transaction.annotation.Transactional;
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
    @Autowired
    private ContractHistoryRepository contractHistoryRepository;
    @Override
    public List<FindAllContractDTO> findAll() {
        return contractRepository.findAllContracts();
    }

    @Override
    @Transactional
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
        ContractHistory contractHistory = ContractHistory.builder()
                .dateStart(createContractDTO.getDateStart())
                .dateEnd(createContractDTO.getDateEnd())
                .contractDeponsit(createContractDTO.getContractDeponsit())
                .nextDueDate(createContractDTO.getNextDueDate())
                .status(createContractDTO.getStatus())
                .description(createContractDTO.getDescription())
                .history_type(StatusContractHistory.TAO)
                .room(room)
                .houseForRent(room.getHouseForRent())
                .admin(admin)
                .customer(customer)
                .contract(contract)
                .build();
        contractHistoryRepository.save(contractHistory);
       while (start.before(end)) {
           Calendar nextMonth =(Calendar) start.clone();
           nextMonth.add(Calendar.MONTH, 1);
           RoomHistory history = RoomHistory.builder()
                   .price(room.getPrice())
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
    @Transactional
    public UpdateContractDTO update(String id, UpdateContractDTO updateContractDTO) {
        Optional<Contract> contract = contractRepository.findById(id);
        Optional<ContractHistory> contractHistory = contractHistoryRepository.findByRoomId(id);
        if (contractRepository.existsByRoom_IdAndIdNot(updateContractDTO.getRoomId() , id )) {
            throw new BusinessException(Constrants.ROOM_EXISTS);
        }
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
        StatusRoom statusRoom = room.getStatus();
//        if (statusRoom == StatusRoom.DANG_CHO_THUE) {
//            throw new BusinessException(Constrants.ROOM_CONTRACT_STATUS);
//        }
        StatusContract statusContract = updateContractDTO.getStatus();
        StatusContractHistory statusContractHistory;
        if (statusContract == StatusContract.KICH_HOAT){
         statusContract = StatusContract.KICH_HOAT;
         statusContractHistory = StatusContractHistory.CAP_NHAT;
        }else if (statusContract == StatusContract.NGUNG_KICH_HOAT){
            statusContract = StatusContract.NGUNG_KICH_HOAT;
            statusContractHistory = StatusContractHistory.CAP_NHAT;
            System.out.println("Chay 2" + updateContractDTO.getStatus());
        }else {
            statusContract = StatusContract.DUNG_KINH_DOANH;
            statusContractHistory = StatusContractHistory.DUNG_KINH_DOANH;
            System.out.println("Chay 3" + updateContractDTO.getStatus());

        }

        Contract con = contract.get();
        con.setDateStart(updateContractDTO.getDateStart());
        con.setDateEnd(updateContractDTO.getDateEnd());
        con.setContractDeponsit(updateContractDTO.getContractDeponsit());
        con.setNextDueDate(updateContractDTO.getNextDueDate());
        con.setStatus(statusContract);
        System.out.println("Check status" + statusContract);
        con.setRoom(room);
        con.setHouseForRent(houseForRent);
        con.setAdmin(admin);
        con.setCustomer(customer);
        ContractHistory contractHistoryBuilder = ContractHistory.builder()
                .dateStart(updateContractDTO.getDateStart())
                .dateEnd(updateContractDTO.getDateEnd())
                .contractDeponsit(updateContractDTO.getContractDeponsit())
                .nextDueDate(updateContractDTO.getNextDueDate())
                .status(updateContractDTO.getStatus())
                .history_type(statusContractHistory)
                .description(updateContractDTO.getDescription())
                .room(room)
                .houseForRent(room.getHouseForRent())
                .admin(admin)
                .customer(customer)
                .contract(con)
                .build();

        contractRepository.save(con);
        contractHistoryRepository.save(contractHistoryBuilder);
        room.setStatus(StatusRoom.DANG_CHO_THUE);
        roomRepository.save(room);


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


