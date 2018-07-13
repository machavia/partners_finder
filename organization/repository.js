'use strict'
const config = require('./config.json');
const Pipedrive = require('pipedrive');
const pipedrive = new Pipedrive.Client(config.pipedrive_toke, { strictMode: true });

class Organisation {

	constructor() {
		this.fields = {};
		this.customFields = {};
	}

	/**
	 * Getting all the Organisations from Pipedrive
	 * @returns {Promise<any>}
	 */
	getAll() {
		return new Promise((resolve, reject) => {
			//we want to make sure we have the fields already pulled
			this.getFields().then( useless => {

				//but we going to need only the custom field
				let fields = this.customFields;

				//getting all the organisations
				pipedrive.Organizations.getAll({ limit: 500 }, (err, elements) => {
					if( err ) {
						reject(err)
						return false
					}

					//for each organisation we want to rename the custom fields with "readable" name
					elements.forEach( element => {
						for (var [key, name] of Object.entries(fields)){
							if( element[key] !== undefined ) element[name] = element[key]
						}
					});

					resolve( elements )
				})
			});
		})
	}

	update( id, data ) {
		return new Promise(function(resolve, reject) {
			this.getFields().then( fields => {

				let updateData = {};
				for (var [key, value] of Object.entries(data)){
					if( fields[key] === undefined ) {
						reject( "Field " + key + " does not exist" );
						return false;
					}

					updateData[fields[key]['key']] = value;

				}

				console.log( updateData );

				pipedrive.Organizations.update( id, updateData, error => {
					console.log( error );
					if( error ) reject( { message : error });
					else resolve( 'Organisation ' + id + ' updated');
				});

			});
		}.bind( this ));
	}

	/**
	 * Get list of Organisation fields
	 * @returns {Promise<any>}
	 */
	getFields() {
		return new Promise(function(resolve, reject) {

			//in case we already know organisation fields
			if( Object.keys(this.fields).length > 0 ) {
				resolve( this.fields );
				return true;
			}

			//else we need to get them from the API
			pipedrive.OrganizationFields.getAll({}, function(err, elements) {
				if( err ) {
					reject( err );
					return false;
				}


				let fields = {};
				let customFields = {};
				for (var i = 0; i < elements.length; i++) {

					let name = elements[i].key;
					let type = 'regular'

					//in case the field is a custom one, we want to use the name instead of the field key
					if( elements[i].key.length == 40 ) {
						name = elements[i].name.toLowerCase()
						name = name.replace( ' ', '_' );
						type = 'custom'

						this.customFields[elements[i].key] = name

					}


					fields[name] = {'key' : elements[i].key, 'type' : type }
				}
				this.fields = fields;
				resolve(fields);
			}.bind( this ))

		}.bind( this ));
	}
}

module.exports = Organisation