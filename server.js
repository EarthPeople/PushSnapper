/**
 * 📸 PushSnapper
 *    – It's an URL to image service!
 */
"use strict";

const Hapi = require("hapi");
const Vision = require("vision");
const Inert = require("inert");
const puppeteer = require("puppeteer");
const { URL } = require("url");
const slugify = require("slugify");
const snapsFunc = require("./snapsFunc");

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a server with a host and port.
const server = Hapi.server({
  host: "0.0.0.0",
  port: process.env.PORT || 8189
});

// Add route for viewing a list of all snaps.
server.route({
  method: "GET",
  path: "/snaps",
  handler: snapsFunc
});

// Add route for overview/start.
server.route({
  method: ["GET", "POST"],
  path: "/",
  handler: async function(request, h) {
    let url = request.query.url || "";
    let basicAuthUser = request.query.basicAuthUser || null;
    let basicAuthPass = request.query.basicAuthPass || null;
    let width = request.query.width || 1024;
    let height = request.query.height || 768;
    let wait = request.query.wait || 0;
    let isValidUrl = true;
    let parsedUrl = null;
    let getResult = null;

    // Make sure URL contains http://.
    if (!url.startsWith("http")) {
      url = `http://${url}`;
    }

    try {
      parsedUrl = new URL(url);
    } catch (e) {
      isValidUrl = false;
    }

    if (isValidUrl) {
      let isoDateString = new Date().toISOString();
      let divider = "@";

      // Filename ends up to something like
      // "texttv.nu-100-640x480-2018-04-14T07:49:32.384Z.png".
      let filename = slugify(
        `${parsedUrl.hostname}${divider}${
          parsedUrl.pathname
        }${divider}${width}x${height}${divider}${isoDateString}.png`
      );

      getResult = await getPage({
        url,
        width,
        height,
        wait,
        basicAuthUser,
        basicAuthPass,
        filename
      });
    }

    return h.view("index", {
      isValidUrl,
      getResult
    });
  }
});

server.route({
  method: "GET",
  path: "/image/{imageName}",
  handler: function(request, h) {
    return h.file(`./snaps/${request.params.imageName}`);
  }
});

async function getPage({
  url = "",
  width = 1024,
  height = 768,
  basicAuthUser = null,
  basicAuthPass = null,
  filename = "snap.png",
  wait = 0
}) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  width = parseInt(width);
  height = parseInt(height);

  page.setViewport({
    width,
    height
  });

  if (basicAuthUser && basicAuthUser) {
    await page.authenticate({
      username: basicAuthUser,
      password: basicAuthPass
    });
  }

  await page.goto(url);

  if (wait) {
    await timeout(parseInt(wait));
  }

  await page.screenshot({
    path: `snaps/${filename}`
  });

  await browser.close();

  return {
    saved: true,
    filename,
    url
  };
}

// Start the server
async function start() {
  try {
    await server.register(Vision);
    await server.register(Inert);

    server.views({
      engines: {
        html: require("handlebars")
      },
      relativeTo: __dirname,
      path: "templates"
    });

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
}

start();
