package com.dmpgenerator.service;

import com.dmpgenerator.dto.PersonSearchResultsDTO;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.PersonType;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.TuviennaType;

import javax.xml.bind.JAXBException;
import java.util.List;

public interface DMPService {

    List<PersonSearchResultsDTO> findOnTiss(String name);

    TuviennaType getDetailedInfoFromTiss(int id) throws JAXBException;
}