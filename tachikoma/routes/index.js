var Sentencer = require('tachikomer');
var randy = require('randy');
var Readable = require('stream').Readable;

function constrain(input, max) {
  return Math.min(input, max);
}

// this is our validation middleware to ensure that any requests stay below our limits
function validate(req, res, next) {
  if(req.params.number)     req.params.number     = constrain(req.params.number, 999);
  if(req.params.sentences)  req.params.sentences  = constrain(req.params.sentences, 50);
  if(req.params.paragraphs) req.params.paragraphs = constrain(req.params.paragraphs, 20);
  next();
}

// ----------------------------------------------------------------------
//                                ROUTES
// ----------------------------------------------------------------------

module.exports = function(app) {

  // -------------------------------------------------------------- INDEX
  app.get('/', validate, function(req, res){
    res.render('index', { sentences: generate(4) });
  });
  app.get('/sentencia', validate, function(req, res){
    res.json({ sentences: generate(4) });
  });
};

// generate sentences synchronously...
// useful for the homepage.
function generate(numberOfSentences) {
  var sentences = "";
  var i = 0;
  for(i; i < numberOfSentences; i++) {
    sentences += capitalizeFirstLetter( randomStartingPhrase() + makeSentenceFromTemplate()) + ".";
    sentences += (numberOfSentences > 1) ? " " : "";
  }
  return sentences;
}

// generate one sentence at a time
// for use in a stream.
function generateSentenceForStream(last) {
  // make a sentence. perhaps it has a starting phrase.
  var phrase = randomStartingPhrase();
  var sentence = capitalizeFirstLetter( phrase + makeSentenceFromTemplate() ) + ".";
  // add a space if it's not the last one
  sentence += ((last) ? "" : " ");
  return sentence;
}

// ----------------------------------------------------------------------
//                      TEMPLATES & CONVENIENCE F()s
// ----------------------------------------------------------------------

function makeSentenceFromTemplate() {
  return Sentencer.make( randy.choice(sentenceTemplates) );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// returns a starting phrase about a third of the time, otherwise it's empty
function randomStartingPhrase() {
  if(Math.random() < 0.33) {
    return randy.choice(phrases);
  }
  return "";
}

// style guide: no periods, no first capital letters.
var sentenceTemplates = [
  "the {{ noun }} is {{ a_noun }}",
  "{{ a_noun }} is {{ an_adjective }} {{ noun }}",
  "the first {{ adjective }} {{ noun }} is, in its own way, {{ a_noun }}",
  "their {{ noun }} was, in this moment, {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }} from the right perspective",
  "the literature would have us believe that {{ an_adjective }} {{ noun }} is not but {{ a_noun }}",
  "{{ an_adjective }} {{ noun }} is {{ a_noun }} of the mind",
  "the {{ adjective }} {{ noun }} reveals itself as {{ an_adjective }} {{ noun }} to those who look",
  "authors often misinterpret the {{ noun }} as {{ an_adjective }} {{ noun }}, when in actuality it feels more like {{ an_adjective}} {{ noun }}",
  "we can assume that any instance of {{ a_noun }} can be construed as {{ an_adjective }} {{ noun }}",
  "they were lost without the {{ adjective }} {{ noun }} that composed their {{ noun }}",
  "the {{ adjective }} {{ noun }} comes from {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} can hardly be considered {{ an_adjective }} {{ noun }} without also being {{ a_noun }}",
  "few can name {{ an_adjective }} {{ noun }} that isn't {{ an_adjective }} {{ noun }}",
  "some posit the {{ adjective }} {{ noun }} to be less than {{ adjective }}",
  "{{ a_noun }} of the {{ noun }} is assumed to be {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} sees {{ a_noun }} as {{ an_adjective }} {{ noun }}",
  "the {{ noun }} of {{ a_noun }} becomes {{ an_adjective }} {{ noun }}",
  "{{ a_noun }} is {{ a_noun }}'s {{ noun }}",
  "{{ a_noun }} is the {{ noun }} of {{ a_noun }}",
  "{{ an_adjective }} {{ noun }}'s {{ noun }} comes with it the thought that the {{ adjective }} {{ noun }} is {{ a_noun }}",
  "{{ nouns }} are {{ adjective }} {{ nouns }}",
  "{{ adjective }} {{ nouns }} show us how {{ nouns }} can be {{ nouns }}",
  "before {{ nouns }}, {{ nouns }} were only {{ nouns }}",
  "those {{ nouns }} are nothing more than {{ nouns }}",
  "some {{ adjective }} {{ nouns }} are thought of simply as {{ nouns }}",
  "one cannot separate {{ nouns }} from {{ adjective }} {{ nouns }}",
  "the {{ nouns }} could be said to resemble {{ adjective }} {{ nouns }}",
  "{{ an_adjective }} {{ noun }} without {{ nouns }} is truly a {{ noun }} of {{ adjective }} {{ nouns }}"
];

// partial phrases to start with. Capitalized.
var phrases = [
  "After reading your postcard, ",
  "Once we have received it, ",
  "Almost one year since we last spoke, ",
  "Some time to think about it ",
  "Early may",
  "Some time, ",
  "While perhaps in May ",
  "Some time after the opening in Venice ",
  "when is important for the artist ",
  "along this century ",
  "As soon as you have them determined ",
  "The last day of a splendid vacation ",
  "What we don't know for sure is whether or not ",
  "sometime in the fall ",
  "The zeitgeist contends that ",
  "In mid-september ",
  "The premiere, ",
  "The semester, ",
  "At the end of the semester ",
  "the dates of the trip ",
  "Still spring time ",
  "Half of monday, "
];