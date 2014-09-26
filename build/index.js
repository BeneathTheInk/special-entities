var fs = require("fs"),
	entities = require("./raw.json");

var by_name = {};

entities.forEach(function(entity) {
	var codes = entity.codes.map(function(c) {
		return parseInt(c, 16);
	});

	if (!codes.length) return;
	by_name[entity.entity] = codes[0];
});

fs.writeFileSync("./entities.json", JSON.stringify(by_name), "utf-8");