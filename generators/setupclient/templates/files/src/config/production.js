'use strict';

import { assign } from 'lodash';
import baseConfig from './base';


let config = {
  buildDir: 'build',
  appEnv: 'production'
};

export default Object.freeze(assign(baseConfig, config));
