process.env.NODE_ENV = 'test';
var app = require('../../app');
var Browser = require('zombie');
var http = require('http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var models = require('../../server/models')

describe('booking page', function() {

  beforeEach(function (done) {
        models.Booking.sync({force: true})
            .then(function () {
                done();
            });
    });

  before(function() {
    this.server = http.createServer(app).listen(3000);
    this.browser = new Browser({ site: 'http://localhost:3000' });
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
      .pressButton('Submit', done);
  });

  before(function(done) {
    this.browser.clickLink('tester', done);
  });

  before(function(done) {
    this.browser.clickLink('Book', done);
  });

  before(function(done) {
    this.browser
    .fill('bookFrom', '2017-10-01')
    .fill('bookTill', '2017-10-02')
    .pressButton('Submit', done);
  });

  it('shows a booking confirmation', function() {
    this.browser.assert.success();
    expect(this.browser.text('body')).to.include('2017-10-01')
    expect(this.browser.text('body')).to.include('2017-10-02')
  });

  after(function() {
    this.server.close();
  });
});
