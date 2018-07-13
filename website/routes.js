'use strict'
const status = require('http-status')
const browser = require( './browser');

module.exports = function(app) {


	app.get('/website/get_domain/:keyword', (req, res, next) => {

		browser.searchDomain( req.params.keyword ).then( result => {
			res.status(status.OK).json(result)
		}).catch(error => {
			res.status(status.NOT_ACCEPTABLE).json(error)
		})

		/*
		repo.update(req.params.id, req.body ).then(result => {
			res.status(status.OK).json(result)
		}).catch(error => {
			res.status(status.NOT_ACCEPTABLE).json(error)
		})
		*/
	})

	app.post('/website/get_tags', (req, res, next) => {

		if( req.body.url === undefined || req.body.tags === undefined ) {
			res.status(status.NOT_ACCEPTABLE).json("Missing url or tags params")
			return false;
		}

		browser.listTags(req.body.url, req.body.tags ).then(result => {
			res.status(status.OK).json(result)
		}).catch(error => {
			res.status(status.NOT_ACCEPTABLE).json(error)
		})
	});

	app.get('/website/hello', (req, res, next) => {
		res.status(status.OK).json("Hello world")
	})

}