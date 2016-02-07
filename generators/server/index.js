'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var _ = require('lodash');


// Choices for the deps prompt
// –––

const depsChoices = [{
  name: 'Spring Boot Starter Data JPA',
  value: 'jpa'
}, {
  name: 'PostgresSQL JDBC Driver',
  value: 'postgres'
}, {
  name: 'Flyway Core',
  value: 'flyway'
}, {
  name: 'Spring Boot Actuator',
  value: 'actuator',
  disabled: 'not implemented'
}, {
  name: 'Spring Security',
  value: 'springsec',
  disabled: 'not implemented'
}];


// Utils
// –––

function asTruthTable(opts, checked) {
  return opts.reduce((truthTable, opt) => { truthTable[opt] = checked.indexOf(opt) > -1; return truthTable }, {});
}


// Generator
// –––

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false,
      desc: 'Specify an app name to default various params in the prompts'
    });

    this.appName = this.appName || 'demo';
  },

  prompting: function () {
    var done = this.async();
    this.prompt([{
      type    : 'input',
      name    : 'pkgName',
      message : 'Package name',
      default : this.appName
    }, {
      type    : 'input',
      name    : 'jarBaseName',
      message : 'Basename for JAR',
      default : this.appName
    }, {
      type    : 'checkbox',
      message : 'Select dependencies',
      name    : 'deps',
      choices : depsChoices
    }], function (answers) {
      this.pkgName = answers.pkgName;
      this.jarBaseName = answers.jarBaseName;
      this.deps = answers.deps;

      done();
    }.bind(this));
  },

  writing: function () {
    const depsAsTruthTable = asTruthTable(depsChoices.map(x => x.value), this.deps);

    // => build.gradle
    this.fs.copyTpl(
      this.templatePath('build.gradle.ejs'),
      this.destinationPath('server/build.gradle'),
      {
        project: {
          baseName: this.jarBaseName,
          deps: depsAsTruthTable
        }
      }
    );

    // => copy static files
    this.fs.copy(
      this.templatePath('files/**'),
      this.destinationPath('server')
    );

    // => application.properties
    this.fs.copyTpl(
      this.templatePath('application.properties.ejs'),
      this.destinationPath('server/src/main/resources/application.properties'),
      { project: { deps: depsAsTruthTable } }
    );

    // => application-dev.properties
    this.fs.copyTpl(
      this.templatePath('application-dev.properties.ejs'),
      this.destinationPath('server/src/main/resources/application-dev.properties'),
      {
        project: {
          pkg: this.pkgName,
          deps: depsAsTruthTable
        }
      }
    );

    // => App.scala
    this.fs.copyTpl(
      this.templatePath('App.scala.ejs'),
      this.destinationPath(`server/src/main/scala/${this.pkgName}/App.scala`),
      { project: { pkg: this.pkgName } }
    );

    // => HomeController.scala
    this.fs.copyTpl(
      this.templatePath('HomeController.scala.ejs'),
      this.destinationPath(`server/src/main/scala/${this.pkgName}/controllers/HomeController.scala`),
      { project: { pkg: this.pkgName } }
    );

    // => create empty pkg dirs where necessary
    [ this.destinationPath('server/src/main/java'),
      this.destinationPath('server/src/test/java'),
      this.destinationPath('server/src/test/scala')
    ].forEach(dir => {
      this.fs.copy(
        this.templatePath('.gitkeep'),
        `${dir}/${this.pkgName}/.gitkeep`
      );
    }, this);

    // => if flyway is in the deps create db directory and init sql
    if (this.deps.indexOf('flyway') > -1) {
      this.fs.copy(
        this.templatePath('V1__init.sql'),
        this.destinationPath('server/src/main/resources/db/migration/V1__init.sql')
      );
      this.fs.copyTpl(
        this.templatePath('FlywayConfig.scala.ejs'),
        this.destinationPath(`server/src/main/scala/${this.pkgName}/config/FlywayConfig.scala`),
        { project: { pkg: this.pkgName } }
      );
    }
  }
});
