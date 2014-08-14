'use strict';

var express = require('express');
var controller = require('./user.controller');
var authentication = loquire.components('authentication');
var authorization = loquire.components('authorization');

var router = express.Router();

router.post('/', controller.create);
router.get('/me', authentication.isAuthenticated, controller.me);
router.get('/:id', authentication.isAuthenticated, controller.show);
router.put('/:id/password', authentication.isAuthenticated, authorization.isSelf, controller.changePassword);
router.delete('/:id', authentication.isAuthenticated, authorization.isSelf, controller.destroy);

module.exports = router;
