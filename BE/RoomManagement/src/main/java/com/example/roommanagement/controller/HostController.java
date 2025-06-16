package com.example.roommanagement.controller;

import com.example.roommanagement.dto.request.host.BaseHostDTO;
import com.example.roommanagement.dto.request.host.CreateHostDTO;
import com.example.roommanagement.dto.request.host.FindAllHostDTO;
import com.example.roommanagement.dto.request.host.UpdateHostDTO;
import com.example.roommanagement.infrastructure.error.Reponse;
import com.example.roommanagement.service.HostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/host")
public class HostController {
    @Autowired
    private HostService hostService;

    @GetMapping("/getAll")
    public ResponseEntity<List<FindAllHostDTO>> getAll() {
        List<FindAllHostDTO> list = hostService.findAllHosts();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<CreateHostDTO> create(@RequestBody CreateHostDTO createHostDTO) {
        CreateHostDTO dto = hostService.create(createHostDTO);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<UpdateHostDTO> update(@PathVariable String id, @RequestBody UpdateHostDTO updateHostDTO) {
        UpdateHostDTO response = hostService.update(id, updateHostDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<BaseHostDTO> getDetail(@PathVariable String id) {
        BaseHostDTO dto = hostService.detail(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/getOneEmail")
    public ResponseEntity<Reponse<FindAllHostDTO>> getOneEmail(@RequestParam String email) {
        Reponse<FindAllHostDTO> response = hostService.getOneEmail(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/getOnePhone")
    public ResponseEntity<Reponse<FindAllHostDTO>> getOnePhone(@RequestParam String numberPhone) {
        Reponse<FindAllHostDTO> reponse = hostService.getOneNumberPhone(numberPhone);
        return new ResponseEntity<>(reponse, HttpStatus.OK);
    }
}
