package com.example.roommanagement.service.impl;

import com.example.roommanagement.dto.request.customer.BaseCustomerDTO;
import com.example.roommanagement.dto.request.customer.CreateCustomerDTO;
import com.example.roommanagement.dto.request.customer.FindAllCustomerDTO;
import com.example.roommanagement.dto.request.customer.UpdateCustomerDTO;
import com.example.roommanagement.entity.Customer;
import com.example.roommanagement.infrastructure.constant.Constrants;
import com.example.roommanagement.infrastructure.error.BusinessException;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.repository.CustomerRepository;
import com.example.roommanagement.service.CustomerService;
import com.example.roommanagement.util.Generate;
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private Generate generate;

    @Override
    public CreateCustomerDTO create(CreateCustomerDTO createCustomerDTO) {
        if (customerRepository.existsByEmail(createCustomerDTO.getEmail())) {
          throw new BusinessException( Constrants.EMAIL_EXISTS);
        }
        if (customerRepository.existsByNumberPhone(createCustomerDTO.getNumberPhone())) {
           throw new BusinessException( Constrants.NUMBER_PHONE_EXISTS);
        }
        if (customerRepository.existsByCccd(createCustomerDTO.getCccd())) {
            throw new BusinessException(Constrants.CCCD_EXISTS);
        }
        Customer customer = Customer.builder()
                .name(createCustomerDTO.getName())
                .email(createCustomerDTO.getEmail())
                .numberPhone(createCustomerDTO.getNumberPhone())
                .cccd(createCustomerDTO.getCccd())
                .code(generate.generateCodeCustomer())
                .gender(createCustomerDTO.getGender())
                .dateOfBirth(createCustomerDTO.getDateOfBirth())
                .build();
        customerRepository.save(customer);
        return createCustomerDTO;
    }

    @Override
    public UpdateCustomerDTO update(String id, UpdateCustomerDTO updateCustomerDTO) {

        Optional<Customer> customer = customerRepository.findById(id);

        if (!customer.isPresent()) {
          throw new BusinessException(Constrants.NOT_FOUND);
        }
        Customer customer1 = customer.get();
        if (!customer1.getEmail().equals(updateCustomerDTO.getEmail())) {
            if (customerRepository.existsByEmail(updateCustomerDTO.getEmail())) {
                throw new BusinessException(Constrants.EMAIL_EXISTS);
            }
        }
        if (!customer1.getNumberPhone().equals(updateCustomerDTO.getNumberPhone())) {
            if (customerRepository.existsByNumberPhone(updateCustomerDTO.getNumberPhone())) {
                throw new BusinessException( Constrants.NUMBER_PHONE_EXISTS);
            }
        }
        if (!customer1.getCccd().equals(updateCustomerDTO.getCccd())) {
            if (customerRepository.existsByCccd(updateCustomerDTO.getCccd())) {
                throw new BusinessException( Constrants.CCCD_EXISTS);
            }

        }
        customer1.setName(updateCustomerDTO.getName());
        customer1.setEmail(updateCustomerDTO.getEmail());
        customer1.setNumberPhone(updateCustomerDTO.getNumberPhone());
        customer1.setGender(updateCustomerDTO.getGender());
        customer1.setDateOfBirth(updateCustomerDTO.getDateOfBirth());
        customer1.setCccd(updateCustomerDTO.getCccd());
        customerRepository.save(customer1);
        return updateCustomerDTO;
    }

    @Override
    public List<FindAllCustomerDTO> findAll() {
        return customerRepository.findAllCustomers();
    }

    @Override
    public FindAllCustomerDTO getOneByEmail(String email) {
        if (email == null || email.isEmpty()) {
            throw new BusinessException( Constrants.FIND_EMAIL_NULL);
        }
        FindAllCustomerDTO respon = customerRepository.getOneByEmail(email);
        if (respon == null) {
            throw new BusinessException( Constrants.NOT_FOUND);
        }
       return respon;
    }

    @Override
    public FindAllCustomerDTO getOneByNumberPhone(String phone) {
        if (phone == null || phone.isEmpty()) {
            throw new BusinessException(Constrants.FIND_NULL);
        }
        FindAllCustomerDTO respon = customerRepository.getOneByNumberPhone(phone);
        if (respon == null) {
            throw new BusinessException(Constrants.NOT_FOUND);
        }
        return respon;
    }

    @Override
    public BaseCustomerDTO detail(String id) {
        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new RuntimeException(Constrants.NOT_FOUND)
        );
        BaseCustomerDTO respon = new BaseCustomerDTO(
                customer.getId() ,
                customer.getCode() ,
                customer.getName() ,
                customer.getEmail() ,
                customer.getNumberPhone() ,
                customer.getGender() ,
                customer.getCccd() ,
                customer.getDateOfBirth()
        );
        return respon;
    }


}
