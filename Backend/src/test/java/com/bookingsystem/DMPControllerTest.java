package com.bookingsystem;

import com.dmpgenerator.dto.BasicInfoDto;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@RunWith(SpringRunner.class)
@SpringBootTest
public class DMPControllerTest {

    @Autowired
    private MockMvc mockMvc;
    private Gson gson;


    @Test
    public void testGetBasicInfo() throws Exception {


        gson = new GsonBuilder().create();
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/dmp/getBasicInfo/Max Mustermann").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String resp = result.getResponse().getContentAsString();
        BasicInfoDto basicInfoDto = gson.fromJson(resp, BasicInfoDto.class);
    }



}