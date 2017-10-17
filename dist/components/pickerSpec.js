'use strict';

var _extends2 = require('../polyfills/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _testUtils = require('react-dom/test-utils');

var _testUtils2 = _interopRequireDefault(_testUtils);

var _picker = require('./picker');

var _picker2 = _interopRequireDefault(_picker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var click = _testUtils2.default.Simulate.click;
var renderIntoDocument = _testUtils2.default.renderIntoDocument;
var scryRenderedComponentsWithType = _testUtils2.default.scryRenderedComponentsWithType;
var findRenderedComponentWithType = _testUtils2.default.findRenderedComponentWithType;


describe('Picker', function () {
  var subject = void 0;

  it('works', function () {
    subject = render();
    expect(subject).toBeDefined();
  });

  describe('categories', function () {
    it('shows 10 by default', function () {
      subject = render();
      expect(subject.categories.length).toEqual(10);
    });

    it('will not show some based upon our filter', function () {
      subject = render({ emojisToShowFilter: function emojisToShowFilter(unified) {
          return false;
        } });
      expect(subject.categories.length).toEqual(2);
    });
  });

  function render() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var defaultProps = {};
    return renderIntoDocument(_react2.default.createElement(_picker2.default, (0, _extends3.default)({}, defaultProps, props)));
  }
});