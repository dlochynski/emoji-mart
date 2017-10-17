'use strict';

var _emojiIndex = require('./emoji-index');

var _emojiIndex2 = _interopRequireDefault(_emojiIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('#emojiIndex', function () {
  describe('search', function () {
    it('should work', function () {
      expect(_emojiIndex2.default.search('pineapple')).toEqual([{
        id: 'pineapple',
        name: 'Pineapple',
        colons: ':pineapple:',
        emoticons: [],
        unified: '1f34d',
        skin: null,
        native: '🍍'
      }]);
    });

    it('should filter only emojis we care about, exclude pineapple', function () {
      var emojisToShowFilter = function emojisToShowFilter(unified) {
        return unified !== '1F34D';
      };
      expect(_emojiIndex2.default.search('apple', { emojisToShowFilter: emojisToShowFilter }).map(function (obj) {
        return obj.id;
      })).not.toContain('pineapple');
    });

    it('can include/exclude categories', function () {
      expect(_emojiIndex2.default.search('flag', { include: ['people'] })).toEqual([]);
    });

    it('can search for thinking_face', function () {
      expect(_emojiIndex2.default.search('thinking_fac').map(function (x) {
        return x.id;
      })).toEqual(['thinking_face']);
    });

    it('can search for woman-facepalming', function () {
      expect(_emojiIndex2.default.search('woman-facep').map(function (x) {
        return x.id;
      })).toEqual(['woman-facepalming']);
    });
  });
});