package com.dmpgenerator.dto;

public class LicenseSelectionStatus {

    private boolean status;

    public LicenseSelectionStatus(boolean status) {
        this.status = status;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
