package com.dmpgenerator.service;

import com.dmpgenerator.dto.PersonSearchResultsDTO;
import com.dmpgenerator.dto.RepositoryDto;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.TuviennaType;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.List;

public interface DMPService {

    List<PersonSearchResultsDTO> findOnTiss(String name);

    List<RepositoryDto> getRepoList(String country, String types) throws IOException, SAXException, ParserConfigurationException;

    TuviennaType getDetailedInfoFromTiss(int id) throws JAXBException;
}