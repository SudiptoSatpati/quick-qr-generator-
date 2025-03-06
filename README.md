# Quick QR Code Generator

## Overview

Quick QR Code Generator is a simple Chrome extension that generates a QR code for the current webpage. This allows users to quickly share URLs with mobile devices by scanning the QR code.

## Features

- Generates a QR code for the currently active webpage.
- Customizable QR code size, color, and background.
- Supports different error correction levels.
- Dark mode support.
- No external API required – works offline.
- Simple and lightweight extension.

## Installation

1. Download or clone this repository.
2. Open **Google Chrome** and go to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in the top right corner).
4. Click on **Load Unpacked**.
5. Select the folder containing the extension files.
6. The extension is now installed and ready to use.

## Usage

1. Open any webpage in Chrome.
2. Click on the **Quick QR Code Generator** extension icon.
3. A QR code will be generated for the current URL.
4. Customize the QR code settings in the **Settings** tab.
5. Scan the QR code with your mobile device to open the link.
6. Download, copy, or share the QR code directly.

## Folder Structure

```
quick-qr-code/
│── manifest.json
│── popup.html
│── popup.js
│── settings.js
│── qrcode.min.js
│── icon.png
```

## Dependencies

- [QRCode.js](https://github.com/davidshimjs/qrcodejs) – A JavaScript library for generating QR codes.

## Troubleshooting

- If the extension doesn't load, ensure `qrcode.min.js` is inside the extension folder.
- If the QR code is not displaying, check the **Console (Ctrl + Shift + J)** for any errors.
- Try reloading the extension from `chrome://extensions/`.

## License

This project is open-source under the MIT License.
