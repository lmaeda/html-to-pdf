#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var htmlPdf = require('html-pdf-chrome');

program
  .option(
    '-i, --input <path>',
    'Input path from where to read the json. Defaults to stdin',
  )
  .option(
    '-o, --output <path>',
    'Output of the resulting HTML. Example: -o snyk.html. Defaults to stdout',
  )
  .parse(process.argv);

let source;
let output;


if (program.input) {
  // input source
  source = program.input; // grab the next item
  if (typeof source === 'boolean') {
    source = undefined;
  }
}
if (program.output) {
  // output destination
  output = program.output; // grab the next item
  if (typeof output === 'boolean') {
    output = undefined;
  }
}


let html = fs.readFileSync(source, 'utf8');
let options = { format: 'portrait',
                chromeFlags: [
                  '--disable-gpu',
                  '--headless',
                  '--hide-scrollbars',
                  '--disable-dev-shm-usage'
                ],
                completionTrigger: new htmlPdf.CompletionTrigger.Timer(60000), // milliseconds
               };

if (output) {
  try {
    htmlPdf.create(html, options).then((htmlPdf) => htmlPdf.toFile(output)).catch((err, res) => {
      if (err) return console.log(err);
      console.log(res);
    });
  } catch (err) {
    console.log(err);
  }
} else {
  console.log(output);
}
