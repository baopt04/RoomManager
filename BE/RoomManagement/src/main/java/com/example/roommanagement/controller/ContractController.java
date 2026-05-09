package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.contract.*;
import com.example.roommanagement.dto.request.image.BaseImageDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.ImageRepository;
import com.example.roommanagement.service.ContractHistoryService;
import com.example.roommanagement.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/admin/contract")
public class ContractController {
    @Autowired
    private ContractService contractService;
    @Autowired
    private ContractHistoryService contractHistoryService;
    @Autowired
    private ImageRepository imageRepository;

    @GetMapping("/getAll")
    public ResponseEntity<Page<FindAllContractDTO>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FindAllContractDTO> list = contractService.findAll(pageable);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateContractDTO> create(@ModelAttribute CreateContractDTO createContractDTO) {
        CreateContractDTO response = contractService.create(createContractDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UpdateContractDTO> update(@PathVariable String id, @ModelAttribute UpdateContractDTO updateContractDTO) {
        System.out.println("roomId: " + updateContractDTO.getRoomId());
        System.out.println("adminId: " + updateContractDTO.getAdminId());
        System.out.println("images: " + updateContractDTO.getImages());

        UpdateContractDTO response = contractService.update(id, updateContractDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<DetailContractDTO> detail(@PathVariable String id) {
        DetailContractDTO detailContractDTO = contractService.detail(id);
       return new ResponseEntity<>(detailContractDTO, HttpStatus.OK);
    }
    @GetMapping("/history/{id}")
    public ResponseEntity<List<ContractHistoryProjection>> getHistory(@PathVariable String id) {
        List<ContractHistoryProjection> history = contractHistoryService.getAllContractHistory(id);
        return new ResponseEntity<>(history, HttpStatus.OK);
    }

//    @GetMapping("/images")
//    public ResponseEntity<List<BaseImageDTO>> getAllImages() {
//        List<BaseImageDTO> list = imageRepository.getAllByI();
//
//    }
}
