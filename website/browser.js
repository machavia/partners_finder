const Nightmare = require('nightmare')
const urlNode = require('url');
const levenshtein = require('fast-levenshtein');

exports.searchDomain = function ( brand ) {

	const nightmare = Nightmare({ show: false })
	return new Promise((resolve, reject) => {

		let url = 'https://duckduckgo.com/?kl=fr-fr&q=' + brand.split(' ').join('+');
		console.log('Getting ' + url);

		nightmare
			.goto(url)
			.evaluate(() => document.querySelector('#r1-0 > div > h2 > a.result__a').href)
			.end()
			.then((url) => {
				let urlOb = urlNode.parse(url);
				let hostName = urlOb.hostname.match(/([^.]+)\.\w{2,3}(?:\.\w{2})?$/);
				hostName = hostName[1];
				let distance = levenshtein.get( brand.toLowerCase().replace( ' ', ''), hostName.replace( '-', '').replace('_', '-'))
				resolve( {"url":url, "distance" : distance } )
			})
			.catch(error => {
				reject( error)
			});

	});

}

exports.listTags = async function( url, tags ) {

	let tagsNotSeen = tags;
	// define a new action
	Nightmare.action(
		'onBeforeSendHeaders',
		//define the action to run inside Electron
		function(name, options, parent, win, renderer, done) {
			win.webContents.session.webRequest.onBeforeSendHeaders((details, cb) => {
				// call our event handler
				parent.call('onBeforeSendHeaders', details, res => {
					res ? cb(Object.assign({}, res)) : cb({ cancel: false })
				})
			})
			done()
		},
		function(handler, done) {
			// listen for "onBeforeSendHeaders" events
			this.child.respondTo('onBeforeSendHeaders', handler)
			done()
		}
	)

	const nightmare = Nightmare({ show: false })

	// start listening
	await nightmare.onBeforeSendHeaders((details, cb) => {
		tagsNotSeen = tagsNotSeen.filter( tag => details.url.indexOf( tag ) == -1 )
		cb({ cancel: false })
	})

	await nightmare.goto(url).refresh()
	await nightmare.end()

	let intersection = tags.filter(x => !tagsNotSeen.includes(x));

	return new Promise((resolve, reject) => {
		resolve( intersection );
	});

}