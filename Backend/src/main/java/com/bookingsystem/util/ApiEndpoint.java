package com.bookingsystem.util;

public enum ApiEndpoint {
    ROOT("https://tiss.tuwien.ac.at/api/person/v21/"),
    PERSON("psuche?q="),
    LIMIT("&max_treffer="),
    AFRINIC("whois.afrinic.net"),
    LACNIC("whois.lacnic.net"),
    JPNIC("whois.nic.ad.jp"),
    KRNIC("whois.nic.or.kr"),
    CNNIC("ipwhois.cnnic.cn"),
    UNKNOWN("");

    private String url;

    ApiEndpoint(String url) {
        this.url = url;
    }

    public String url() {
        return url;
    }
}
