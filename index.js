
var data = require("./entities.json");

var hex_value_regex = /^0x([a-z0-9]+)$/i,
	entity_regex = /&[a-z0-9#]+;?/ig,
	hex_entity_regex = /^&#x?([a-f0-9]+);?$/i,
	spec_entity_regex = /^&([a-z0-9]+);?$/i;

var exports =
module.exports = {
	data: data,

	// converts all entities to specific format
	convertEntities: function(str, format) {
		if (format == null) format = "html";
		return str.replace(entity_regex, function(entity, index) {
			return exports.format(entity, format);
		});
	},

	format: function(s, format) {
		var code = exports.getCharCode(s);
		if (code === false) return null;

		switch(format) {
			// only hex entities
			case "xml":
			case "hex":
				return exports.toHTMLEntity(code);

			// first special, then hex
			case "html":
				return exports.toHTMLEntity(data.code[code] || code);

			// only special entities
			case "special":
				entity = data.code[code];
				return entity != null ? exports.toHTMLEntity(entity) : null;

			// utf-8 character
			case "char":
			case "character":
			case "utf-8":
				return String.fromCharCode(code);

			case "code":
			case "dec":
			case "decimal":
				return code;
		}

		return null;
	},

	getCharCode: function(s) {
		var m, code;

		if (typeof s === "string") {
			if (s === "") return false;

			// regular char
			if (s.length === 1) return s.charCodeAt(0);

			// special entity
			if (m = spec_entity_regex.exec(s)) {
				code = data.entity[m[1]];
				return code != null ? code : false;
			}

			// hex entity
			if (m = hex_entity_regex.exec(s)) {
				return parseInt(m[1], 16);
			}

			// hex value
			if (m = hex_value_regex.exec(s)) {
				return parseInt(m[1], 16);
			}
		}

		if (typeof s === "number") return s;

		return false;
	},

	toHTMLEntity: function(n) {
		return "&" + (typeof n === "number" ? "#" + n.toString(16) : n) + ";";
	}
}