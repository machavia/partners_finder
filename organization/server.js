const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const helmet = require('helmet')
const api = require('./routes')
const port = 3000

const start = (port) => {
	return new Promise((resolve, reject) => {
		/*
		if (!options.repo) {
			reject(new Error('The server must be started with a connected repository'))
		}
		if (!options.port) {
			reject(new Error('The server must be started with an available port'))
		}*/

		const app = express()
		app.use(bodyParser.json())
		app.use(morgan('dev'))
		app.use(helmet())
		app.use((err, req, res, next) => {
			reject(new Error('Something went wrong!, err:' + err))
			res.status(500).send('Something went wrong!')
		})

		api(app )

		const server = app.listen(port, () => resolve(server))
	})
}



start(port).then(() => { console.log( "server started on port " + port );})