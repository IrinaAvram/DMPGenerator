package com.dmpgenerator.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PersonSearchDTO {


    private String searchterm;
    private Integer totalResults;
    private List<PersonSearchResultsDTO> results = null;
    private String suchLink;
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    public String getSearchterm() {
        return searchterm;
    }

    public void setSearchterm(String searchterm) {
        this.searchterm = searchterm;
    }

    public Integer getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(Integer totalResults) {
        this.totalResults = totalResults;
    }

    public List<PersonSearchResultsDTO> getResults() {
        return results;
    }

    public void setResults(List<PersonSearchResultsDTO> results) {
        this.results = results;
    }

    public String getSuchLink() {
        return suchLink;
    }

    public void setSuchLink(String suchLink) {
        this.suchLink = suchLink;
    }

    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }


}
