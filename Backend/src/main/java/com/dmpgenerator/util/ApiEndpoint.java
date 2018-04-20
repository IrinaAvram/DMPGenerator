package com.dmpgenerator.util;

public enum ApiEndpoint {
    ROOT("https://tiss.tuwien.ac.at/api/person/v21/"),
    DOAR("http://www.opendoar.org/api13.php?co="),
    DOARPARAMS1("&ct="),
    DOARPARAMS2("&show=min&sort=co,rname"),
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
