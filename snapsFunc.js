const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const readdir = util.promisify(fs.readdir);

var readDirCallback = function(err, files) {
  console.log("readDirCallback", err, files);
};

var snapsFunc = async function(request, h) {
  let snapsFolder = "./snaps";

  let snaps = await readdir(snapsFolder);

  // Only keep png files and files that contain @
  snaps = snaps.filter(name => {
    return name.includes("@") && name.endsWith(".png");
  });

  // Group by first @ = domain
  groupedSnaps = _.groupBy(snaps, name => {
    let parts = name.split("@");
    return parts[0];
  });

  return h.view("snaps", {
    groupedSnaps
  });
};

module.exports = snapsFunc;
