package com.dmpgenerator.service.impl;

import com.dmpgenerator.dto.PersonSearchResultsDTO;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.PersonType;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.TuviennaType;
import com.dmpgenerator.service.DMPService;
import com.dmpgenerator.util.RestService;
import org.springframework.stereotype.Service;

import javax.xml.bind.JAXBException;
import java.util.List;

@Service
public class DMPServiceImpl implements DMPService {

    @Override
    public List<PersonSearchResultsDTO> findOnTiss(String name) {
        return RestService.searchPerson(name, 20);
    }

    @Override
    public TuviennaType getDetailedInfoFromTiss(int id) throws JAXBException {
        return RestService.getDetailedInfo(id);
    }

}