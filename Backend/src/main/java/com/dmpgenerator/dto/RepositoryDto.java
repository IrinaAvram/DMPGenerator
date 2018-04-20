package com.dmpgenerator.dto;

public class RepositoryDto {

    private int id;
    private String name;
    private String rUrl;
    private String rOaiBaseUrl;

    public RepositoryDto() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getrUrl() {
        return rUrl;
    }

    public void setrUrl(String rUrl) {
        this.rUrl = rUrl;
    }

    public String getrOaiBaseUrl() {
        return rOaiBaseUrl;
    }

    public void setrOaiBaseUrl(String rOaiBaseUrl) {
        this.rOaiBaseUrl = rOaiBaseUrl;
    }
}
