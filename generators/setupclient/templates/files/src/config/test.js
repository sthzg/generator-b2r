'use strict';

import { assign } from 'lodash';
import baseConfig from './base';


let config = {
  buildDir: 'build-tmp',
  appEnv: 'test'
};

export default Object.freeze(assign(baseConfig, config));
