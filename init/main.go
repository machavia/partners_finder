package main

import (
	"./common"
	"./models"
	"strconv"
	"fmt"
	"strings"
	"github.com/golang-collections/go-datastructures/queue"
)


func main() {

	q := queue.New(1)
	companies := common.GetOrganizations()
	for _, company := range companies {
		technos := strings.Split(company.Technos, ",")

		if contains(technos, 10) == false && contains(technos, 8) == false {
			q.Put(company)
		}
	}


	queue.ExecuteInParallel(q, func(item interface{}) {
		company := item.(models.Company )
		fmt.Println( company.Name, "->", company.SiteWeb )
		tags := common.GetTags( company.SiteWeb )

		if len(tags) == 0 {
			common.SaveTags( company, 10 )
		} else if tags[0] == "try.abtasty.com" {
			common.SaveTags( company, 8 )
		}
	})
}


func contains(s []string, e int) bool {
	for _, a := range s {
		a, _ := strconv.Atoi(a)
		if a == e {
			return true
		}
	}
	return false
}