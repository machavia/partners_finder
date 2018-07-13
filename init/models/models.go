package models

type Configuration struct {
	Services struct {
		Browser      string
		Organization string
	}
}

type Companies[] Company

type Company struct {
	ID        int    `json:"id"`
	CompanyID int    `json:"company_id"`
	OwnerID   int    `json:"owner_id"`
	Name      string `json:"name"`
	SiteWeb   string `json:"site_web"`
	Technos   string `json:"technos"`
}

type Domain []string