#Iconerator [![Build Status](https://secure.travis-ci.org/alexanderscott/iconerator.png)](http://travis-ci.org/alexanderscott/iconerator)
Automatically generate all app market icons from a single image (iOS + Android + Web).

[![NPM](https://nodei.co/npm/iconerator.png?downloads=true)](https://nodei.co/npm/iconerator/)


##Installation
First download and install GraphicsMagick or ImageMagick. In Mac OS X, you can simply use Homebrew and do:

`brew install imagemagick graphicsmagick`


Then install iconerator via npm with:

`npm install -g iconerator`


##Usage
`iconerator [options] <img file ...> <optional output path ...>`


  
####Options:

    -h, --help      output usage information
    -V, --version   output the version number
    --only-ios      Only generate iOS icons
    --only-android  Only generate Android icons
    --only-iphone   Only generate iPhone icons
    --only-ipad     Only generate iPad icons
    --only-web      Only generate Web icons
    
    
##Configuration
A list of the icon sizes and resolutions to be generated is externalized inside of `./lib/config.js`.  This can be safely updated to include custom icon sizes.

The full list of default icon sizes (in pixels) is:

### iOS
*  29x29 (iOS - Settings icon - iPad 2 & iPad mini standard res)
*  40x40 (iOS - Spotlight search results - iPad 2 & iPad mini standard res)
*  58x58 (iOS - Settings icon - iPhone, iPod, iPad & iPad mini high res)
*  60x60 (iOS - Tab bar icon)
*  76x76 (iOS - App icon - iPad 2 & iPad mini standard res)
*  80x80 (iOS - Spotlight search results - iPhone, iPod, iPad & iPad mini high res)
*  87x87 (iOS - Settings icon - iPhone 6 Plus)
*  120x120 (iOS - App icon - iPhone, iPod high res)
*  152x152 (iOS - App icon - iPad & iPad mini high res)
*  167x167 (iOS - iPad Pro)
*  180x180 (iOS - App icon - iPhone 6 Plus)
*  512x512 (iOS - Newsstand cover)
*  1024x1024 (iOS - Newsstand cover)

### Android
*  36x36 (Android - LDPI)
*  48x48 (Android - MDPI)
*  72x72 (Android - HDPI)
*  96x96 (Android - XHDPI)
*  144x144 (Android - XXHDPI)
*  192x192 (Android - XXXHDPI)
*  512x512 (Android - Google Play icon)
    

### Web
* 16x16 (Web - favicon)
* 32x32 (Web - favicon)
* 48x48 (Web - favicon)
* 64x64 (Web - favicon)


##License

MIT License

Copyright (c) 2013-2014 Alex Ehrnschwender (http://alexehrnschwender.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.