package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.contract.CreateContractDTO;
import com.example.roommanagement.dto.request.contract.DetailContractDTO;
import com.example.roommanagement.dto.request.contract.FindAllContractDTO;
import com.example.roommanagement.dto.request.contract.UpdateContractDTO;
import com.example.roommanagement.dto.request.image.BaseImageDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.ImageRepository;
import com.example.roommanagement.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/contract")
public class ContractController {
    @Autowired
    private ContractService contractService;
    @Autowired
    private ImageRepository imageRepository;

    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllContractDTO>> getAll() {
        List<FindAllContractDTO> list = contractService.findAll();
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
//    @GetMapping("/images")
//    public ResponseEntity<List<BaseImageDTO>> getAllImages() {
//        List<BaseImageDTO> list = imageRepository.getAllByI();
//
//    }
}
