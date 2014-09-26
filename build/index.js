var fs = require("fs"),
	entities = require("./raw.json");

var by_entity = {},
	by_code = {};

entities.forEach(function(entity) {
	var codes = entity.codes.map(function(c) {
		return parseInt(c, 16);
	});

	if (!codes.length) return;
	by_entity[entity.entity] = codes[0];

	codes.forEach(function(c) {
		by_code[c] = entity.entity;
	});
});

fs.writeFileSync("./entities.json", JSON.stringify({ entity: by_entity, code: by_code }), "utf-8");