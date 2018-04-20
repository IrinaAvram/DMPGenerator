package com.dmpgenerator.service.impl;

import com.dmpgenerator.dto.PersonSearchResultsDTO;
import com.dmpgenerator.dto.RepositoryDto;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.TuviennaType;
import com.dmpgenerator.service.DMPService;
import com.dmpgenerator.util.RestService;
import org.springframework.stereotype.Service;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.List;

@Service
public class DMPServiceImpl implements DMPService {

    @Override
    public List<PersonSearchResultsDTO> findOnTiss(String name) {
        return RestService.searchPerson(name, 20);
    }

    @Override
    public List<RepositoryDto> getRepoList(String country, String types) throws IOException, SAXException, ParserConfigurationException {
        return RestService.getRepoList(country, types);
    }

    @Override
    public TuviennaType getDetailedInfoFromTiss(int id) throws JAXBException {
        return RestService.getDetailedInfo(id);
    }

}