'use strict';

var should = require('should'),
    Q = require('bluebird'),
    _ = require('lodash'),
    TestUtil = loquire.utils('test'),
    UserService = loquire.user('service');

describe('User Service:', function() {
  beforeEach(TestUtil.clear);

  after(TestUtil.clear);

  describe('Without any User:', function() {
    var USER_CONTENT = {
      email: 'test@test.com',
      name: 'Test User',
      description: 'Test User Description',
      has_photo: false,
      deleted: false
    };

    describe('Creating:', function() {
      it('should be able to create a user', function(done) {
        UserService
          .create({
            email: 'test@test.com',
            password: 'test',
            name: 'Test User',
            description: 'Test User Description'
          })
          .then(function(user) {
            should.exist(user);
            user.id.should.be.an.instanceOf(String).and.not.be.empty;
            user.created_at.should.be.an.instanceOf(Date);
            user.should.be.containEql(USER_CONTENT);
          })
          .shouldPass(done);
      });

      it('should not be able to create a user with an invalid email', function(done) {
        UserService
          .create({
            email: 'test',
            password: 'test',
            name: 'Test User',
            description: 'Test User Description'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('FIELD_INVALID');
            err.field.should.be.eql('email');
          });
      });

      it('should not be able to create a user with an invalid email', function(done) {
        UserService
          .create({
            email: 'test@test',
            password: 'test',
            name: 'Test User',
            description: 'Test User Description'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('FIELD_INVALID');
            err.field.should.be.eql('email');
          });
      });

      it('should not be able to create a user with an invalid email', function(done) {
        UserService
          .create({
            email: 'test@test.c',
            password: 'test',
            name: 'Test User',
            description: 'Test User Description'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('FIELD_INVALID');
            err.field.should.be.eql('email');
          });
      });

      it('should not be able to create a user without an email', function(done) {
        UserService
          .create({
            password: 'test',
            name: 'Test User',
            description: 'Test User Description'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('FIELD_REQUIRED');
            err.field.should.be.eql('email');
          });
      });

      it('should not be able to create a user without a password', function(done) {
        UserService
          .create({
            email: 'test@test.com',
            name: 'Test User',
            description: 'Test User Description'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('FIELD_REQUIRED');
            err.field.should.be.eql('password');
          });
      });

      it('should not be able to create a user without a name', function(done) {
        UserService
          .create({
            email: 'test@test.com',
            password: 'test',
            description: 'Test User Description'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('FIELD_REQUIRED');
            err.field.should.be.eql('name');
          });
      });

      it('should be able to create a user with id, but id will be ignored', function(done) {
        UserService
          .create({
            id: '000000000000000000000000',
            email: 'test@test.com',
            password: 'test',
            name: 'Test User',
            description: 'Test User Description'
          })
          .then(function(user) {
            should.exist(user);
            user.id.should.not.eql('000000000000000000000000');
          })
          .shouldPass(done);
      });

      it('should be able to create a user with photo, but photo will be ignored', function(done) {
        UserService
          .create({
            email: 'test@test.com',
            password: 'test',
            name: 'Test User',
            description: 'Test User Description',
            photo: 'photo'
          })
          .then(function(user) {
            should.exist(user);
            should.not.exist(user.photo);
          })
          .shouldPass(done);
      });
    });

    describe('Listing:', function() {
      it('should get an empty array', function(done) {
        UserService
          .list()
          .then(function(users) {
            should.exist(users);
            users.should.be.an.instanceOf(Array).and.have.lengthOf(0);
          })
          .shouldPass(done);
      });
    });
  });

  describe('With one User:', function() {
    var USER;

    beforeEach(function(done) {
      UserService
        .create({
          email: 'test@test.com',
          password: 'test',
          name: 'Test User',
          description: 'Test User Description'
        })
        .then(function(user) {
          should.exist(user);
          USER = {
            id: user.id,
            email: user.email,
            name: user.name,
            description: user.description,
            has_photo: false,
            created_at: user.created_at,
            deleted: false
          };
        })
        .shouldPass(done);
    });

    describe('Creating:', function() {
      it('should not be able to create a duplicated user', function(done) {
        UserService
          .create({
            email: 'test@test.com',
            password: 'test',
            name: 'Test User',
            description: 'Test User Description'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('USER_DUPLICATED');
            err.email.should.be.eql(USER.email);
          });
      });
    });

    describe('Preloading:', function() {
      it('should be able to preload the user', function(done) {
        UserService
          .preload(USER.id)
          .then(function(user) {
            should.exist(user);
            user.should.be.containEql(USER);
          })
          .shouldPass(done);
      });

      it('should not be able to preload a non-existing user', function(done) {
        UserService
          .preload('000000000000000000000000')
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('USER_NOT_FOUND');
            err.id.should.be.eql('000000000000000000000000');
          });
      });

      it('should not be able to preload a non-existing user', function(done) {
        UserService
          .preload('x')
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('USER_NOT_FOUND');
            err.id.should.be.eql('x');
          });
      });
    });

    describe('Reading:', function() {
      it('should be able to read the user', function(done) {
        UserService
          .preload(USER.id)
          .then(function(user) {
            return UserService.read(user);
          })
          .then(function(user) {
            should.exist(user);
            user.should.be.containEql(USER);
          })
          .shouldPass(done);
      });
    });

    describe('Authenticating:', function() {
      it('should be able to authenticate', function(done) {
        UserService
          .authenticate({
            email: 'test@test.com',
            password: 'test'
          })
          .then(function(user) {
            should.exist(user);
            user.should.be.containEql(USER);
          })
          .shouldPass(done);
      });

      it('should be able to authenticate with case insensitivity of email', function(done) {
        UserService
          .authenticate({
            email: 'Test@test.com',
            password: 'test'
          })
          .then(function(user) {
            should.exist(user);
            user.should.be.containEql(USER);
          })
          .shouldPass(done);
      });

      it('should not be able to authenticate with non-existing user', function(done) {
        UserService
          .authenticate({
            email: 'test1@test.com',
            password: 'test'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('USER_MISMATCH');
            err.email.should.be.eql('test1@test.com');
          });
      });

      it('should not be able to authenticate with wrong password', function(done) {
        UserService
          .authenticate({
            email: 'test@test.com',
            password: 'test2'
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('PASSWORD_MISMATCH');
            err.email.should.be.eql(USER.email);
          });
      });
    });

    describe('Listing:', function() {
      it('should be able to list users, actually incluing the only user', function(done) {
        UserService
          .list()
          .then(function(users) {
            should.exist(users);
            users.should.be.an.instanceOf(Array).and.have.lengthOf(1);
            users[0].should.be.containEql(USER);
          })
          .shouldPass(done);
      });
    });

    describe('Updating:', function() {
      var NEW_USER;

      beforeEach(function(done) {
        NEW_USER = {
          id: USER.id,
          email: USER.email,
          name: 'New Test User',
          description: 'New Test User Description',
          has_photo: false,
          created_at: USER.created_at,
          deleted: false
        };
        done();
      });

      it('should be able to update the user', function(done) {
        UserService
          .preload(USER.id)
          .then(function(user) {
            return UserService.update(user, {
              name: 'New Test User',
              description: 'New Test User Description'
            });
          })
          .then(function(user) {
            should.exist(user);
            user.should.be.containEql(NEW_USER);
          })
          .shouldPass(done);
      });

      it('should be able to update the user with email, but email will be ignored', function(done) {
        UserService
          .preload(USER.id)
          .then(function(user) {
            return UserService.update(user, {
              email: 'new@test.com',
              name: 'New Test User',
              description: 'New Test User Description'
            });
          })
          .then(function(user) {
            should.exist(user);
            user.should.be.containEql(NEW_USER);
          })
          .shouldPass(done);
      });

      it('should be able to update the user with created_at, but created_at will be ignored', function(done) {
        UserService
          .preload(USER.id)
          .then(function(user) {
            return UserService.update(user, {
              name: 'New Test User',
              description: 'New Test User Description',
              created_at: new Date()
            });
          })
          .then(function(user) {
            should.exist(user);
            user.should.be.containEql(NEW_USER);
          })
          .shouldPass(done);
      });
    });

    describe('Deleting:', function() {
      it('should be able to delete the user', function(done) {
        var CHECK_POINT = false;

        UserService
          .preload(USER.id)
          .then(function(user) {
            return UserService.delete(user);
          })
          .then(function() {
            CHECK_POINT = true;
            return UserService.preload(USER.id);
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('USER_NOT_FOUND');
            err.id.should.be.eql(USER.id);
            CHECK_POINT.should.be.true;
          });
      });
    });

    describe('Updating Password:', function() {
      it('should be able to update password', function(done) {
        UserService
          .preload(USER.id)
          .then(function(user) {
            return UserService.password
              .update(user, {
                old: 'test',
                new: 'new.test'
              });
          })
          .then(function() {
            return UserService
              .authenticate({
                email: 'test@test.com',
                password: 'new.test'
              });
          })
          .then(function(user) {
            should.exist(user);
            user.id.should.be.an.instanceOf(String).and.not.be.empty;
            user.created_at.should.be.an.instanceOf(Date);
            user.should.be.containEql(USER);
          })
          .shouldPass(done);
      });

      it('should not be able to update password without required field', function(done) {
        UserService
          .preload(USER.id)
          .then(function(user) {
            return UserService.password
              .update(user, {
                old: 'test'
              });
          })
          .shouldFail(done, function(err) {
            should.exist(err);
            should.exist(err.message);
            err.code.should.be.eql('FIELD_REQUIRED');
            err.field.should.be.eql('new');
          });
      });
    });
  });

  describe('With many Users:', function() {
    var USER_COUNT = 5;
    var USERS;

    beforeEach(function(done) {
      Q.map(_.range(USER_COUNT), function(index) {
        return UserService
          .create({
            email: 'test' + index + '@test.com',
            password: 'test',
            name: 'Test User ' + index,
            description: 'Test User Description'
          });
      })
      .then(function(users) {
        should.exist(users);
        users.should.be.an.instanceOf(Array).an.have.lengthOf(USER_COUNT);
        USERS = _.map(users, function(user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            description: user.description,
            has_photo: false,
            created_at: user.created_at,
            deleted: false
          };
        });
      })
      .shouldPass(done);
    });

    describe('Preloading:', function() {
      it('should be able to preload all users', function(done) {
        Q.map(_.range(USER_COUNT), function(index) {
          return UserService.preload(USERS[index].id);
        })
        .then(function(users) {
          should.exists(users);
          users.should.be.an.instanceOf(Array).an.have.lengthOf(USER_COUNT);
          _.forEach(_.range(USER_COUNT), function(index) {
            users[index].should.be.containEql(USERS[index]);
          });
        })
        .shouldPass(done);
      });
    });

    describe('Listing:', function() {
      var assertUsers = function(expected, actual) {
            actual.should.be.an.instanceOf(Array).an.have.lengthOf(expected.length);
            _.forEach(expected, function(value, index) {
              actual[index].should.be.containEql(USERS[value]);
            });
      };

      it('should be able to list all users', function(done) {
        UserService
          .list()
          .then(function(users) {
            should.exists(users);
            // 0,1,2,3,4
            var expected = _.range(USER_COUNT);
            assertUsers(expected, users);
          })
          .shouldPass(done);
      });

      it('should be able to search users with name', function(done) {
        UserService
          .list({
            name: '1'
          })
          .then(function(users) {
            should.exists(users);
            // 1
            var expected = [1];
            assertUsers(expected, users);
          })
          .shouldPass(done);
      });

      it('should be able to search users with email', function(done) {
        UserService
          .list({
            email: 'test3'
          })
          .then(function(users) {
            should.exists(users);
            // 3
            var expected = [3];
            assertUsers(expected, users);
          })
          .shouldPass(done);
      });

      it('should be able to list users with sorting', function(done) {
        UserService
          .list({
            sort: {
              by: 'email',
              desc: true
            }
          })
          .then(function(users) {
            should.exists(users);
            // 4,3,2,1,0
            var expected = _.range(USER_COUNT).reverse();
            assertUsers(expected, users);
          })
          .shouldPass(done);
      });

      it('should be able to list users with sorting', function(done) {
        UserService
          .list({
            sort: {
              by: 'created_at',
              desc: true,
              lte: USERS[2].created_at
            }
          })
          .then(function(users) {
            should.exists(users);
            // 2,1,0
            var expected = _.range(USER_COUNT).slice(0, 3).reverse();
            assertUsers(expected, users);
          })
          .shouldPass(done);
      });

      it('should be able to list users with sorting', function(done) {
        UserService
          .list({
            sort: {
              by: 'created_at',
              desc: true,
              gt: USERS[2].created_at
            }
          })
          .then(function(users) {
            should.exists(users);
            // 4,3
            var expected = _.range(USER_COUNT).slice(3).reverse();
            assertUsers(expected, users);
          })
          .shouldPass(done);
      });

      it('should be able to list users with sorting and limiting', function(done) {
        UserService
          .list({
            sort: {
              by: 'created_at',
              desc: true,
              lte: USERS[2].created_at
            },
            limit: 2
          })
          .then(function(users) {
            should.exists(users);
            // 2,1
            var expected = _.range(USER_COUNT).slice(1, 3).reverse();
            assertUsers(expected, users);
          })
          .shouldPass(done);
      });
    });
  });
});
