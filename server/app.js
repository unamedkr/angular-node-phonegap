/**
 * Main application file
 */

'use strict';

require('./loquire');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database
loquire.config('mongoose');

// Setup server
loquire.config('express');
