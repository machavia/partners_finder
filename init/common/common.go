package common

import (
	"../models"
	"io/ioutil"
	"fmt"
	"os"
	"net/http"
	"time"
	"encoding/json"
	"bytes"
	"log"
	"strconv"
)

func GetOrganizations() models.Companies {
	config := getConfig()
	url := config.Services.Organization + "/organizations"

	httpClient := http.Client{
		Timeout: time.Second * 10, // Maximum of 2 secs
	}


	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("X-Api-Key", "XXXXXXX")

	res, getErr := httpClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	companies := models.Companies{}
	jsonErr := json.Unmarshal(body, &companies )
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	return companies
}

func GetTags( webSite string ) models.Domain {
	config := getConfig()
	url := config.Services.Browser + "/website/get_tags"
	var jsonStr = []byte(`{"url":"`+ webSite + `", "tags" : ["try.abtasty.com"] }`)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("X-Api-Key", "xxxxxx")
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("response Body:", string(body))
	domains := models.Domain{}
	jsonErr := json.Unmarshal(body, &domains )
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	return domains
}

func SaveTags( company models.Company, tagId int ) {
	fmt.Println( "Saving:", company.Name, "tagId:", tagId )

	config := getConfig()
	url := config.Services.Organization + "/organization/" + strconv.Itoa(company.ID)
	var jsonStr = []byte(`{"technos":"`+ strconv.Itoa(tagId) + `" }`)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("X-Api-Key", "xxxxxx")
	req.Header.Set("Content-Type", "application/json; charset=utf-8")


	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	//body, _ := ioutil.ReadAll(resp.Body)
	//fmt.Println("response Body:", string(body))

	if resp.StatusCode == 406 {
		panic( "Error while saving organization. " + url )
	}

}


func getConfig() models.Configuration {
	file, _ := os.Open("config.json" )
	defer file.Close()
	decoder := json.NewDecoder(file)
	configuration := models.Configuration{}
	err := decoder.Decode(&configuration)
	if err != nil {
		fmt.Println("error:", err)
	}
	return configuration
}