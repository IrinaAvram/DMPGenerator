package com.dmpgenerator.util;

public enum ApiEndpoint {
    ROOT("https://tiss.tuwien.ac.at/api/person/v21/"),
    PERSON("psuche?q="),
    PERSONID("id/"),
    LIMIT("&max_treffer="),
    UNKNOWN("");

    private String url;

    ApiEndpoint(String url) {
        this.url = url;
    }

    public String url() {
        return url;
    }
}
