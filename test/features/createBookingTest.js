process.env.NODE_ENV = 'test';
var app = require('../../app');
var Browser = require('zombie');
var http = require('http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var models = require('../../server/models')

describe('making a booking', function() {

  before(function (done) {
        models.Booking.sync({force: true})
            .then(function () {
                done();
            });
  });
  before(function (done) {
        models.User.sync({force: true})
            .then(function () {
                done();
            });
  });
  before(function (done) {
        models.Listing.sync({force: true})
            .then(function () {
                done();
            });
  });

  before(function() {
    this.server = http.createServer(app).listen(3000);
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });

  before(function(done) {
    this.browser.visit('/users/new', done);
  });
  before(function(done) {
    this.browser
    .fill('first_name',    'Dave')
    .fill('last_name', 'Davis')
    .fill('email', 'dave@dave.org')
    .fill('password', 'goodpassword')
    .pressButton('Sign up').then(done)
  });

  before(function(done) {
    this.browser.visit('/listings/new', done);
  });

  before(function(done) {
    this.browser
      .fill('name',    'tester')
      .fill('description', 'it is a very nice space')
      .fill('price', 20)
      .fill('listFrom', '2017-10-01')
      .fill('listTill', '2017-10-02')
      .pressButton('Submit').then(done);
  });

  before(function(done) {
    this.browser.visit('/users/new', done);
  });
  before(function(done) {
    this.browser
    .fill('first_name',    'John')
    .fill('last_name', 'Davis')
    .fill('email', 'john@dave.org')
    .fill('password', 'otherpassword')
    .pressButton('Sign up').then(done)
  });

  before(function(done) {
    this.browser.visit('/listings/1/booking', done);
  });

  before(function(done) {
    this.browser
    .fill('bookFrom', '2017-10-11')
    .fill('bookTill', '2017-10-13')
    .pressButton('Submit').then(done);
  });

  it('shows a booking confirmation', function() {
    this.browser.assert.success();
    expect(this.browser.text('body')).to.include('2017-10-11');
    expect(this.browser.text('body')).to.include('2017-10-13');
  });

  after(function() {
    this.server.close();
  });
});
