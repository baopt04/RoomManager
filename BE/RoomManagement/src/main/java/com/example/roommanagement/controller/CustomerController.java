package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.customer.CreateCustomerDTO;
import com.example.roommanagement.dto.request.customer.FindAllCustomerDTO;
import com.example.roommanagement.dto.request.customer.UpdateCustomerDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;
    @GetMapping("/getAllCustomer")
    public ResponseEntity<List<FindAllCustomerDTO>> getAll() {
        List<FindAllCustomerDTO> list = customerService.findAll();
    return new ResponseEntity<>(list, HttpStatus.OK);
    }
    @PostMapping("/create")
    public ResponseEntity<Reponse<CreateCustomerDTO>> create(@Valid  @RequestBody CreateCustomerDTO createCustomerDTO) {
        Reponse<CreateCustomerDTO> response = customerService.create(createCustomerDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @PostMapping("/update/{id}")
    public ResponseEntity<Reponse<UpdateCustomerDTO>> update(@PathVariable String id,@Valid @RequestBody UpdateCustomerDTO updateCustomerDTO) {
        Reponse<UpdateCustomerDTO> response = customerService.update(id, updateCustomerDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/getEmail")
    public ResponseEntity<Reponse<FindAllCustomerDTO>> getEmail(@RequestParam String email) {
        Reponse<FindAllCustomerDTO> reponse = customerService.getOneByEmail(email);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
    @GetMapping("/getNumberPhone")
    public ResponseEntity<Reponse<FindAllCustomerDTO>> getNumberPhone(@RequestParam String numberPhone) {
        Reponse<FindAllCustomerDTO> reponse = customerService.getOneByNumberPhone(numberPhone);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
}
