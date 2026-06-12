# Abadis Lookup — Firefox Extension

A Firefox extension that lets you instantly look up Persian definitions from [Abadis.ir](https://abadis.ir) by double-clicking any English word on any webpage.

## Demo

Double-click any word → a small **آ** icon appears → click it → see Persian definitions from the *پیشنهاد کاربران* (user suggestions) section, with author names and like/dislike counts.

## Features

- Double-click any word to trigger lookup
- Non-intrusive: shows a small icon first, full popup only on click
- Draggable popup — move it anywhere on the page
- Shows author name, definition, and 👍 / 👎 votes for each suggestion
- Direct link to the full Abadis page
- Dark theme UI
- Press `Esc` or click outside to dismiss

## Installation

### Temporary (for testing)
1. Open Firefox → `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json`

### Permanent
1. Zip all files → rename to `abadis-lookup.xpi`
2. Submit to [addons.mozilla.org](https://addons.mozilla.org/developers/) as **unlisted**
3. Mozilla signs it automatically → download and install

## How It Works

1. `content.js` listens for `dblclick`, shows a floating آ chip, and sends the word to the background script
2. `background.js` fetches `https://abadis.ir/entofa/[word]/`, parses `div.cmt` elements (each holding author `f`, likes `l`, dislikes `d`, and definition text)
3. A styled popup renders the results inline on the page

## Tech

- Pure JavaScript (no dependencies)
- Firefox WebExtensions API (`manifest_version: 2`)
- CSS animations & drag-and-drop

## Author

Amirhossein Mohtashami
