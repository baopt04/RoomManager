package com.example.roommanagement.service.impl;

import com.example.roommanagement.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminDetailService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminRepository.findAdminByEmail(username).orElseThrow(()
                -> new UsernameNotFoundException("User found" + username));
    }

    @Autowired
    private AdminRepository adminRepository;

}
