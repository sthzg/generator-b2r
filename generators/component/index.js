'use strict';

var generators = require('yeoman-generator');


module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    console.log('I am constructing...');

    //// Next, add your custom code
    //this.option('coffee'); // This method adds support for a `--coffee` flag
  }
});
