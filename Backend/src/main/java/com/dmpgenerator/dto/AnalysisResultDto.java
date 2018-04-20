package com.dmpgenerator.dto;

public class AnalysisResultDto {
    private String mimeType;
    private String byteOrder;
    private String compressionScheme;
    private String colorSpace;
    private String stripOffsets;
    private String size;

    public AnalysisResultDto() {
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getByteOrder() {
        return byteOrder;
    }

    public void setByteOrder(String byteOrder) {
        this.byteOrder = byteOrder;
    }

    public String getCompressionScheme() {
        return compressionScheme;
    }

    public void setCompressionScheme(String compressionScheme) {
        this.compressionScheme = compressionScheme;
    }

    public String getColorSpace() {
        return colorSpace;
    }

    public void setColorSpace(String colorSpace) {
        this.colorSpace = colorSpace;
    }

    public String getStripOffsets() {
        return stripOffsets;
    }

    public void setStripOffsets(String stripOffsets) {
        this.stripOffsets = stripOffsets;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    @Override
    public String toString() {
        return "AnalysisResultDto{" +
                "mimeType='" + mimeType + '\'' +
                ", byteOrder='" + byteOrder + '\'' +
                ", compressionScheme='" + compressionScheme + '\'' +
                ", colorSpace='" + colorSpace + '\'' +
                ", stripOffsets='" + stripOffsets + '\'' +
                ", size='" + size + '\'' +
                '}';
    }
}
