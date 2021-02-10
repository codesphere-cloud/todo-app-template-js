'use strict';

require('dotenv').config();

exports.API_PORT = process.env.API_PORT || 3000;
exports.DATABASE = process.env.DATABASE || ':memory:';
