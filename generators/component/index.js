'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');


module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('package', {
      required: false,
      defaults: false,
      desc: 'Create a component package'
    });
    this.argument('component', {
      type: String,
      required: true,
      desc: 'Creates a component at the path specified'
    });
    this.argument('path', {
      type: String,
      required: false,
      desc: 'Sub path inside components directory where component will be created',
      defaults: ''
    });

    this.cName = _.capitalize(_.camelCase(this.component));
    this.cPath = path.join(process.cwd(), 'src', 'components', this.path, (this.options.package ? this.cName : ''));

    this.log(`Creating component ${this.cPath}/${this.cName}`);
  },

  writing: function () {
    //noinspection FallThroughInSwitchStatementJS
    switch (this.options.package) {
      case true:
        // Create => package.json
        this.fs.copyTpl(
          this.templatePath('package.json.ejs'),
          this.destinationPath(path.join(this.cPath, 'package.json')),
          {
            cName: this.cName
          }
        );
      default:
        // Create => Component.js
        this.fs.copyTpl(
          this.templatePath('Component.js.ejs'),
          this.destinationPath(path.join(this.cPath, this.cName + '.js')),
          {
            cName: this.cName
          }
        );
    }
  }
});
