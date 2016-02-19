
var readability = require('readability-api');
var Entities = require('html-entities').AllHtmlEntities;

readability.configure({
	parser_token: process.env.READABILITY_API_KEY
});

var entities = new Entities();


// Get details, such as title, excerpt, author, and date published, of a URL,
// and how likely they are to be correct (confidence). Takes a callback of the
// form `function(err, details)`.
function getDetails(url, callback) {
	var parser = new readability.parser();

	parser.parse(url, function(err, parsed) {
		if (err) {
			callback(err, null);
		}
		else {
			parser.confidence(url, function(err, confidence) {
				if (err) {
					callback(err, null);
				}
				else {
					var details = {
						title: entities.decode(parsed.title),
						excerpt: entities.decode(parsed.excerpt),
						author: entities.decode(parsed.author),
						wordCount: parsed.word_count,
						date: parsed.date_published,
						confidence: confidence
					};

					callback(null, details);
				}
			});
		}
	});
} 


module.exports = {
	getDetails: getDetails
}
