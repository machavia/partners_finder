var Nightmare = require('nightmare')

main().catch(console.error)

async function main() {
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

	const nightmare = Nightmare({ show: true })

	abTasty = false;
	// start listening
	await nightmare.onBeforeSendHeaders((details, cb) => {
		if(details.url.indexOf( 'try.abtasty.com') > -1 ) abTasty = true;
		cb({ cancel: false })
	})

	await nightmare.goto('https://www.stormize.com/')

	await nightmare.end()
}