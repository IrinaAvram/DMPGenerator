package com.dmpgenerator.controller;

import com.dmpgenerator.dto.AnalysisResultDto;
import com.dmpgenerator.dto.PersonSearchResultsDTO;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.PersonType;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.TuviennaType;
import com.dmpgenerator.service.DMPService;
import edu.harvard.hul.ois.jhove.*;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/dmp")
@CrossOrigin(origins = "*")
public class DMPController {

    private final com.dmpgenerator.service.DMPService DMPService;

    @Autowired
    public DMPController(DMPService DMPService) {
        this.DMPService = DMPService;
    }

    @RequestMapping(value="getBasicInfo/{name}", method = RequestMethod.GET)
    public List<PersonSearchResultsDTO> findByPartOfName(@PathVariable String name) {
        return DMPService.findOnTiss(name);
    }

    @RequestMapping(value="getDetailedInfo/{id}", method = RequestMethod.GET)
    public TuviennaType getDetailedInfo(@PathVariable int id) throws JAXBException {
        return DMPService.getDetailedInfoFromTiss(id);
    }

    @RequestMapping(value="analizeData", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public AnalysisResultDto importQuestion(@RequestPart("uploadedFile") MultipartFile multipart) throws Exception {
        System.out.println("Post method of uploaded Questions ");
        System.out.println("Uploaded file Name : " + multipart.getOriginalFilename());
        int[] date = new int[3];
        String[] path = new String[1];

        File inputFile = convert(multipart);
        path[0] = inputFile.getAbsolutePath();
        System.out.println("Input: " + path[0]);

        String NAME = new String( "Jhove" );
        String RELEASE = new String( "1.5" );
        int[] DATE = new int[] { 2009, 12, 19 };
        String USAGE = new String( "no usage" );
        String RIGHTS = new String( "LGPL v2.1" );
        App app = new App( NAME, RELEASE, DATE, USAGE, RIGHTS );

        JhoveBase je = new JhoveBase();
        je.setLogLevel("ERROR");

        String configFile = JhoveBase.getConfigFileFromProperties();
        String saxClass = JhoveBase.getSaxClassFromProperties();

        je.init(configFile, saxClass);

        File outputFile = File.createTempFile(inputFile.getName(), ".tmp");

        Module module = null;
        String tmp = multipart.getOriginalFilename().toLowerCase();
        if(tmp.endsWith(".jpg") || tmp.endsWith(".jpeg"))
        {
            module = je.getModule("JPEG-hul");
        }
        else if(tmp.endsWith(".tif") || tmp.endsWith(".tiff"))
        {
            module = je.getModule("TIFF-hul");
        }
        else if(tmp.endsWith(".gif"))
        {
            module = je.getModule("GIF-hul");
        }
        else if(tmp.endsWith(".pdf"))
        {
            module = je.getModule("PDF-hul");
        }
        else if(tmp.endsWith(".jpeg2000"))
        {
            module = je.getModule("JPEG2000-hul");
        }

        OutputHandler handler = je.getHandler("XML");
        je.dispatch(app, module, handler, handler, outputFile.getPath(), path);
        System.out.println("Output: "+ outputFile.getPath());

        DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = domFactory.newDocumentBuilder();
        Document document = builder.parse(outputFile);

        DOMSource src = new DOMSource(document);

        Node node = src.getNode();

        XPathFactory xpFactory = XPathFactory.newInstance();
        XPath xp = xpFactory.newXPath();

        AnalysisResultDto analysisResultDto = new AnalysisResultDto();

        analysisResultDto.setSize(xp.evaluate("/jhove/repInfo/size/text()", node));
        analysisResultDto.setMimeType(xp.evaluate("/jhove/repInfo/mimeType/text()", node));
        analysisResultDto.setFormat(xp.evaluate("/jhove/repInfo/format/text()", node));
        analysisResultDto.setModule(xp.evaluate("/jhove/repInfo/sigmatch/module/text()", node));
        analysisResultDto.setStatus(xp.evaluate("/jhove/repInfo/status/text()", node));
        String pattern = "yyyy-MM-dd'T'HH:mm:ss";
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        Date date1 = sdf.parse(xp.evaluate("/jhove/repInfo/lastModified/text()", node));
        analysisResultDto.setLastModified(date1);

        return analysisResultDto;
    }

    public File convert(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

}