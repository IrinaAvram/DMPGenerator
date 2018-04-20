package com.bookingsystem.service.impl;

import com.bookingsystem.dto.BasicInfoDto;
import com.bookingsystem.service.DMPService;
import com.bookingsystem.util.RestService;
import org.springframework.stereotype.Service;

@Service
public class DMPServiceImpl implements DMPService {

    @Override
    public BasicInfoDto findOnTiss(String name) {
        // TODO
        RestService.searchPerson(name,20);
        return new BasicInfoDto();
    }

}