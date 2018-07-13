'use strict'
const status = require('http-status')
var repo = require( './repository')
repo = new repo();

module.exports = (app ) => {

	app.get('/organizations', (req, res, next) => {
		repo.getAll().then(result => {
			res.status(status.OK).json(result)
		}).catch(next)
	})

	app.post('/organization/:id', (req, res, next) => {
		repo.update(req.params.id, req.body ).then(result => {
			res.status(status.OK).json(result)
		}).catch(error => {
			res.status(status.NOT_ACCEPTABLE).json(error)
		})
	})


	app.get('/', (req, res, next) => {
		res.status(status.OK).json({'status':'ok'})
	})
}