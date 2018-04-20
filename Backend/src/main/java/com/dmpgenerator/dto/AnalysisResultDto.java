package com.dmpgenerator.dto;

import java.time.LocalDateTime;
import java.util.Date;

public class AnalysisResultDto {
    private String mimeType;
    private String size;
    private Date lastModified;
    private String format;
    private String status;
    private String module;

    public AnalysisResultDto() {
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    @Override
    public String toString() {
        return "AnalysisResultDto{" +
                "mimeType='" + mimeType + '\'' +
                ", size='" + size + '\'' +
                ", lastModified=" + lastModified +
                ", format='" + format + '\'' +
                ", status='" + status + '\'' +
                ", module='" + module + '\'' +
                '}';
    }
}
