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
    res.render('index', { sentences: generate(2) });
  });
  app.get('/cam', validate, function(req, res){
    res.render('cam', { sentences: generate(2) });
  });
  app.get('/sentencia', validate, function(req, res){
    res.json({ sentences: generate(2) });
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
  "{{ a_noun }} is an old space of contemplation",
  "{{ a_noun }} is indeed great",
  "{{ noun }} is indeed great",
  "browsed the {{ an_adjective }} material",
  "to promote the {{ adjective }} study" ,
  "to promote the {{ a_noun }}",
  "{{ adjective }} {{ a_noun }} to be convenient",
  "{{ adjective }} understanding of modern art",
  "{{ adjective }} understanding of modern {{ noun }}",
  "already approached {{ a_noun }}",
  "works of {{ an_adjective }} restoration",
  "works of restoration of {{ a_noun }} ",
  "are conceived as mere {{ noun }}",
  "are conceived as {{ adjective }} spectacle",
  "are conceived as {{ an_adjective }} spectacle",
  "retake the {{ adjective }} notion",
  "retake the {{ adjective }} {{ a_noun }}",
  "take on the job of writing a {{ an_adjective }} text",
  "take on the job of writing a {{ an_adjective }} {{ noun }}",
  "reproduce some of your {{ an_adjective }} work",
  "be associated to a {{ an_adjective }} soccer team",
  "keep eyes and ears opened to every {{ adjective }} beep related to our subject",
  "keep eyes and {{ noun }} opened to every beep related to our subject",
  "keep {{ noun }} and ears opened to every beep related to our subject",
  "keep eyes and ears opened to every {{ noun }} related to our subject",
  "keep {{ noun }} and {{ a_noun }} opened to every {{ a_noun }} related to our {{ a_noun }}",
  "decide that Catalonia was too {{ adjective }} and probably not too comercial",
  "decide that Catalonia was too particular and probably not too {{ adjective }}",
  "paint an image on {{ noun }}",
  "paint a {{ noun }} on plexiglass",
  "paint a {{ adjective }} {{ noun }} on plexiglass",
  "paint an image on {{ adjective }} {{ noun }}",
  "the possibility of showing your {{ noun }}",
  "the possibility of showing your {{ adjective }} {{ a_noun }}",
  "appreciate your {{ adjective }} interest",
  "appreciate your {{ adjective }} {{ a_noun }}",
  "have fallen into the {{ an_adjective }} routine",
  "take this {{ a_noun }} as a form of blackmail",
  "claims against the tyranny of contemporary {{ a_noun }}",
  "claims against the tyranny of {{ an_adjective }} mediation",
  "{{ a_noun }} claims against the tyranny of contemporary mediation",
  "claims against the tyranny of {{ adjective }} {{ noun }}",
  "did not succeed in making satisfactory {{ a_noun }}",
  "did not succeed in making {{ an_adjective }} {{ noun }}"
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