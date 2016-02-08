'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');


module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  initializing: function() {
    // When setting up an application we simply compose over the client and server subgen.
    this.composeWith('b2r:setupclient', { options: { isComposed: true }});
    this.composeWith('b2r:setupserver', { options: { isComposed: true }});
  }
});
