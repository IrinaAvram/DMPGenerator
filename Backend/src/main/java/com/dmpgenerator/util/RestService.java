package com.dmpgenerator.util;

import com.dmpgenerator.dto.PersonSearchDTO;
import com.dmpgenerator.dto.PersonSearchResultsDTO;
import com.dmpgenerator.dto.RepositoryDto;
import com.dmpgenerator.dto.generated.https.tiss_tuwien_ac_at.api.schemas.person.v21.TuviennaType;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class RestService {

    private static String API_ENDPOINT = "https://tiss.tuwien.ac.at/api/person/v21";


    public static List<PersonSearchResultsDTO> searchPerson(String name, int limit)  {
        URL url = null;
        try {
            url = new URL(ApiEndpoint.ROOT.url()+ApiEndpoint.PERSON.url()+name+ApiEndpoint.LIMIT.url()+limit);
            System.out.println(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            con.setRequestMethod("GET");
        } catch (ProtocolException e) {
            e.printStackTrace();
        }

        BufferedReader in = null;
        try {
            in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        String inputLine;
        StringBuffer content = new StringBuffer();
        try {
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(content.toString());
        Gson gson = new GsonBuilder().create();
        PersonSearchDTO basicInfoDto = gson.fromJson(content.toString(), PersonSearchDTO.class);
        return basicInfoDto.getResults();
    }

    public static List<RepositoryDto> getRepoList(String country, String types) throws ParserConfigurationException, IOException, SAXException {
        URL url = null;
        try {
            url = new URL(ApiEndpoint.DOAR.url()+country+ApiEndpoint.DOARPARAMS1.url()+types + ApiEndpoint.DOARPARAMS2.url());
            System.out.println(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            con.setRequestMethod("GET");
        } catch (ProtocolException e) {
            e.printStackTrace();
        }

        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(con.getInputStream());

        //optional, but recommended
        //read this - http://stackoverflow.com/questions/13786607/normalization-in-dom-parsing-with-java-how-does-it-work
        doc.getDocumentElement().normalize();

        System.out.println("Root element :" + doc.getDocumentElement().getNodeName());

        NodeList nList = doc.getElementsByTagName("repository");
        List<RepositoryDto> repositoryDtoList = new ArrayList<>();
        for (int temp = 0; temp < nList.getLength(); temp++) {

            Node nNode = nList.item(temp);

            if (nNode.getNodeType() == Node.ELEMENT_NODE) {

                Element eElement = (Element) nNode;

                RepositoryDto repositoryDto = new RepositoryDto();
                repositoryDto.setId(Integer.parseInt(eElement.getAttribute("rID")));
                repositoryDto.setName( eElement.getElementsByTagName("rName").item(0).getTextContent());
                repositoryDto.setrUrl(eElement.getElementsByTagName("rUrl").item(0).getTextContent());
                repositoryDto.setrOaiBaseUrl(eElement.getElementsByTagName("rOaiBaseUrl").item(0).getTextContent());
                repositoryDtoList.add(repositoryDto);
                if(repositoryDtoList.size() >= 3) {
                    return repositoryDtoList;
                }
            }
        }
        return repositoryDtoList;
    }

    public static TuviennaType getDetailedInfo(int id) throws JAXBException {
        URL url = null;
        try {
            url = new URL(ApiEndpoint.ROOT.url() + ApiEndpoint.PERSONID.url() + id);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            con.setRequestMethod("GET");
        } catch (ProtocolException e) {
            e.printStackTrace();
        }

        BufferedReader in = null;
        try {
            in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        String inputLine;
        StringBuffer content = new StringBuffer();
        try {
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println();
        System.out.println();

        System.out.println(content.toString());

        TuviennaType personDetails = unmarshal(content.toString());
        return personDetails;
    }

    public static TuviennaType unmarshal(String xml) throws JAXBException {
        JAXBContext jaxbContext = JAXBContext.newInstance(TuviennaType.class);
        Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();

        StringReader reader = new StringReader(xml);
        TuviennaType personType = (TuviennaType) jaxbUnmarshaller.unmarshal(reader);

        return personType;
    }

}
