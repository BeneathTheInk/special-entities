var data = require("./entities.json");

var hex_value_regex = /^0x([a-z0-9]+)$/i,
	entity_regex = /&[a-z0-9#]+;?/ig,
	dec_entity_regex = /^&#([0-9]+);?$/i,
	hex_entity_regex = /^&#x([a-f0-9]+);?$/i,
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

	// converts value into utf-8 character or entity equivalent
	format: function(s, format) {
		var code = exports.getCharCode(s);
		if (code === false) return null;

		switch(format) {
			// only decimal entities
			case "xml":
			case "xhtml":
			case "dec":
			case "decimal":
				return exports.toHTMLEntity(code);

			// only hex entities
			case "hex":
				return exports.toHTMLEntity(code, "hex");

			// first special, then decimal
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

			// regular number
			case "code":
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

			// decimal entity
			if (m = dec_entity_regex.exec(s)) {
				return parseInt(m[1], 10);
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

	toHTMLEntity: function(n, format) {
		return "&" + (
			typeof n === "number" ?
			"#" + (format === "hex" ? "x" : "") +
			n.toString(format === "hex" ? 16 : 10) : n
		) + ";";
	}
}