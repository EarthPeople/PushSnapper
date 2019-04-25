# 📸 PushSnapper
It's an URL to image service!

When developing websites we like to get a visual history of the development of the site. This is why we created PushSnapper.

The concept of PushSnapper is simple: everytime we publish a new version of the site, PushSnapper takes a snapshot of that site. The snapshot is saved to a folder on our server and can be easily accessed (together with previous snapshots) whenever review is needed.

## Usage
To start the PushSnapper service use the following command:

```
$ node server.js
```

This will give you an URL which you can use to generate snapshot of the provided URL, like so:

```
localhost:8189?url=earthpeople.se
```

The main purpose of PushSnapper is to generate a snapshot of your web project every time you push your commits. This will give you a visual timeline of your project process.

A common pratice is to use [git hooks](https://github.com/git-hooks/git-hooks/wiki/Get-Started) to trigger the snapshot generation.

### Options

Along with the URL you want to take a snapshot of, you may also define other things such as width and height like so:

```
localhost:8189?url=earthpeople.se&width=800&height=600
```

|Option|Default|Description|
|------|-------|-----------|
| url | None | URL of the side you want to take a snapshot of |
| width | 1024 | Width of the viewport used to take the snapshot |
| height | 768 | Height of the viewport used to take the snapshot |
| wait | 0 | Number of seconds to wait before the snapshot is made |
| basicAuthUser | None |Basic auth username (provided that your site require authentication) |
| basicAuthPass | None |Basic auth password (provided that your site require authentication) |


## Installation

Navigate to your PushSnapper directory and install the required packages:

```
$ npm install
```

That's it!


## Under the hood

PushSnapper utilize the headless chrome node API called [Puppeteer](https://github.com/GoogleChrome/puppeteer).
