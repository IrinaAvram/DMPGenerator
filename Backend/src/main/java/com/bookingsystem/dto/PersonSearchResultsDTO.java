package com.bookingsystem.dto;

import java.util.HashMap;
import java.util.Map;

public class PersonSearchResultsDTO {

    private Integer id;
    private String firstname;
    private String lastname;
    private String gender;
    private String prefixTitle;
    private Object postfixTitle;
    private String adressbuchBenutzerbild;
    private String adressbuchVisitenkarte;
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPrefixTitle() {
        return prefixTitle;
    }

    public void setPrefixTitle(String prefixTitle) {
        this.prefixTitle = prefixTitle;
    }

    public Object getPostfixTitle() {
        return postfixTitle;
    }

    public void setPostfixTitle(Object postfixTitle) {
        this.postfixTitle = postfixTitle;
    }

    public String getAdressbuchBenutzerbild() {
        return adressbuchBenutzerbild;
    }

    public void setAdressbuchBenutzerbild(String adressbuchBenutzerbild) {
        this.adressbuchBenutzerbild = adressbuchBenutzerbild;
    }

    public String getAdressbuchVisitenkarte() {
        return adressbuchVisitenkarte;
    }

    public void setAdressbuchVisitenkarte(String adressbuchVisitenkarte) {
        this.adressbuchVisitenkarte = adressbuchVisitenkarte;
    }

    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}