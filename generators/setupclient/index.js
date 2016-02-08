'use strict';

var generators = require('yeoman-generator');


// Generator
// –––

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false,
      desc: 'Specify an app name for the project'
    });

    this.option('isComposed', {
      type: Boolean,
      required: false,
      default: false,
      hide: true
    });

    this.appName = this.appName || 'demo';
  },

  prompting: function () {
    var done = this.async();
    if (this.options.isComposed) this.log('\nSetting up ReactJS application');
    this.prompt([{
      type    : 'input',
      name    : 'appName',
      message : 'App name',
      default : this.appName
    }, {
      type    : 'input',
      name    : 'appDesc',
      message : 'Description',
      default : 'Not now...'
    }, {
      type    : 'input',
      name    : 'author',
      message : 'Author'
    }], function (answers) {
      this.appName = answers.appName;
      this.appDesc = answers.appDesc;
      this.author = answers.author;

      done();
    }.bind(this));
  },

  writing: function () {
    // => copy static files
    this.fs.copy(
      this.templatePath('files/**'),
      this.destinationPath('client'),
      { globOptions: { dot: true } }
    );
    // => package.json
    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('client/package.json'), {
        project: {
          appName: this.appName,
          appDesc: this.appDesc,
          author: this.author
        }
      }
    );
    // => .npmrc
    this.fs.copyTpl(
      this.templatePath('.npmrc.ejs'),
      this.destinationPath('client/.npmrc'), {
        project: { appName: this.appName } }
    );
  }
});
