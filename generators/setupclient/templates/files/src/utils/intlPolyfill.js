'use strict';

export default function polyfillIntl() {
  var areIntlLocalesSupported = require('intl-locales-supported');
  var localesMyAppSupports = ['de-AT', 'de-DE', 'en-US'];  // TODO should be configurable through npm config

  if (global.Intl) {
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
      var IntlPolyfill    = require('intl');
      Intl.NumberFormat   = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    global.Intl = require('intl');
    require('intl/locale-data/jsonp/de.js');
    require('intl/locale-data/jsonp/en.js');
  }
}
