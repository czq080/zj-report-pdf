#!/usr/bin/env node

const _ = require("lodash");
const cli = require("commander");
const fileUrl = require("file-url");
const fs = require("fs");
const isUrl = require("is-url");
const puppeteer = require("puppeteer");
const path = require("path");
const os = require("os");
const csv = require("csv");

const {
  parse
} = require("querystring");

cli
  .version("1.2.0")
  .option("-p, --path <path>", "The file path to save the PDF to.")
  .option(
    "-s, --scale [scale]",
    "Scale of the webpage rendering.",
    parseFloat,
    1
  )
  .option("-dhf, --displayHeaderFooter", "Display header and footer.", false)
  .option(
    "-ht, --headerTemplate [template]",
    "HTML template for the print header."
  )
  .option(
    "-pb, --printBackground [bool]",
    "Print background graphics.",
    true
  )
  .option(
    "-ft, --footerTemplate [template]",
    "HTML template for the print footer."
  )
  .option("-l, --landscape", "Paper orientation.", false)
  .option(
    "-pr, --pageRanges <range>",
    "Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages."
  )
  .option(
    "-f, --format [format]",
    "Paper format. If set, takes priority over width or height options. Defaults to 'Letter'."
  )
  .option(
    "-w, --width [width]",
    "Paper width, accepts values labeled with units."
  )
  .option(
    "-h, --height [height]",
    "Paper height, accepts values labeled with units."
  )
  .option(
    "-mt, --marginTop [margin]",
    "Top margin, accepts values labeled with units."
  )
  .option(
    "-mr, --marginRight [margin]",
    "Right margin, accepts values labeled with units."
  )
  .option(
    "-mb, --marginBottom [margin]",
    "Bottom margin, accepts values labeled with units."
  )
  .option(
    "-ml, --marginLeft [margin]",
    "Left margin, accepts values labeled with units."
  )
  .option("-d, --debug", "Output Puppeteer PDF options")
  .option(
    "-wu, --waitUntil [choice]",
    "waitUntil accepts choices load, domcontentloaded, networkidle0, networkidle2. Defaults to 'networkidle2'.",
    "networkidle2"
  )
  .option(
    "-csv, --csv [csv]",
    "waitUntil accepts choices load, domcontentloaded, networkidle0, networkidle2. Defaults to 'networkidle2'."
  )
  .action(function (required, optional) {
    // TODO: Implement required arguments validation
  })
  .parse(process.argv);

(async () => {
  let options = {};

  // Loop through options
  _.each(cli.options, function (option) {
    const optionName = option.name();
    if (!_.isNil(cli[optionName]) && !["version"].includes(optionName)) {
      const optionValue = cli[optionName];

      if (_.startsWith(optionName, "margin")) {
        // Margins need to be combined into an object
        _.set(
          options,
          ["margin", optionName.replace("margin", "").toLowerCase()],
          optionValue
        );
      } else {
        _.set(options, optionName, optionValue);
      }
    }
  });

  // Check if we need to read header or footer templates from files
  _.each(["headerTemplate", "footerTemplate"], function (template) {
    if (_.get(options, template, "").startsWith("file://")) {
      options[template] = fs.readFileSync(
        options[template].replace("file://", ""),
        "utf-8"
      );
    }
  });

  //read csv
  let csvFilePath = options['csv'];
  // var cs = path.join(csvFilePath, '..' ,'dataArray.csv');
  var cs = path.join('dataArray.csv');
  var ws = fs.createWriteStream(cs)
  var tabReg = new RegExp("\t", 'g')
  var i = 0;
  fs.createReadStream(csvFilePath, {
    encoding: "utf16le"
  }).pipe(csv.parse({
    delimiter: "\t",
    encoding: "utf-8",
    // skip_lines_with_empty_values: true,
    // skip_lines_with_error: true,
    relax_column_count: true,
    ltrim: true,
    rtrim: true,
    bom: true}))
    // Transform each value into uppercase
    .pipe(csv.transform(function (record) {
      return record.map(function (data) {
        return data
      });
    }))
    // Convert the object into a stream
    .pipe(csv.stringify({
      quote: true,
      quoted_empty: true
    }))
    // Print the CSV stream to stdout
    .pipe(ws)

  // let chromePath = path.join(".local-chromium", "chrome.exe");
  // const browser = await puppeteer.launch({
  //   executablePath: chromePath,
  //   headless: true,
  //   ignoreDefaultArgs: ['--disable-extensions'],
  //   args: ["--no-sandbox", "disable-setuid-sandbox", "--disable-web-security",
  //     '--disable-features=IsolateOrigins,site-per-process'
  //   ]
  // });
  // const page = await browser.newPage();

  // // Get URL / file path from first argument
  // const location = _.first(cli.args);
  // await page.goto(isUrl(location) ? location : fileUrl(location), {
  //   waitUntil: _.get(options, "waitUntil", "networkidle2")
  // });
  // // Output options if in debug mode
  // if (cli.debug) {
  //   console.log(options);
  // }
  // await page.pdf(options);

  // await browser.close();
})();