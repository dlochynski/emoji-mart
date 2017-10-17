'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('../polyfills/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectGetPrototypeOf = require('../polyfills/objectGetPrototypeOf');

var _objectGetPrototypeOf2 = _interopRequireDefault(_objectGetPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('../polyfills/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('../polyfills/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('../polyfills/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

require('../vendor/raf-polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _data = require('../data');

var _data2 = _interopRequireDefault(_data);

var _store = require('../utils/store');

var _store2 = _interopRequireDefault(_store);

var _frequently = require('../utils/frequently');

var _frequently2 = _interopRequireDefault(_frequently);

var _utils = require('../utils');

var _ = require('.');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RECENT_CATEGORY = { name: 'Recent', emojis: null };
var SEARCH_CATEGORY = { name: 'Search', emojis: null, anchor: false };
var CUSTOM_CATEGORY = { name: 'Custom', emojis: [] };

var I18N = {
  search: 'Search',
  notfound: 'No Emoji Found',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
    custom: 'Custom'
  }
};

var Picker = function (_React$PureComponent) {
  (0, _inherits3.default)(Picker, _React$PureComponent);

  function Picker(props) {
    (0, _classCallCheck3.default)(this, Picker);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Picker.__proto__ || (0, _objectGetPrototypeOf2.default)(Picker)).call(this, props));

    _this.i18n = (0, _utils.deepMerge)(I18N, props.i18n);
    _this.state = {
      skin: _store2.default.get('skin') || props.skin,
      firstRender: true
    };

    _this.categories = [];
    var allCategories = [].concat(_data2.default.categories);

    if (props.custom.length > 0) {
      CUSTOM_CATEGORY.emojis = props.custom.map(function (emoji) {
        return (0, _extends3.default)({}, emoji, {
          // `<Category />` expects emoji to have an `id`.
          id: emoji.short_names[0],
          custom: true
        });
      });

      allCategories.push(CUSTOM_CATEGORY);
    }

    _this.hideRecent = true;

    if (props.include != undefined) {
      allCategories.sort(function (a, b) {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();

        if (props.include.indexOf(aName) > props.include.indexOf(bName)) {
          return 1;
        }

        return 0;
      });
    }

    for (var categoryIndex = 0; categoryIndex < allCategories.length; categoryIndex++) {
      var category = allCategories[categoryIndex];
      var isIncluded = props.include && props.include.length ? props.include.indexOf(category.name.toLowerCase()) > -1 : true;
      var isExcluded = props.exclude && props.exclude.length ? props.exclude.indexOf(category.name.toLowerCase()) > -1 : false;
      if (!isIncluded || isExcluded) {
        continue;
      }

      if (props.emojisToShowFilter) {
        var newEmojis = [];

        var emojis = category.emojis;

        for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
          var emoji = emojis[emojiIndex];
          if (props.emojisToShowFilter(_data2.default.emojis[emoji] || emoji)) {
            newEmojis.push(emoji);
          }
        }

        if (newEmojis.length) {
          var newCategory = {
            emojis: newEmojis,
            name: category.name
          };

          _this.categories.push(newCategory);
        }
      } else {
        _this.categories.push(category);
      }
    }

    var includeRecent = props.include && props.include.length ? props.include.indexOf('recent') > -1 : true;
    var excludeRecent = props.exclude && props.exclude.length ? props.exclude.indexOf('recent') > -1 : false;
    if (includeRecent && !excludeRecent) {
      _this.hideRecent = false;
      _this.categories.unshift(RECENT_CATEGORY);
    }

    if (_this.categories[0]) {
      _this.categories[0].first = true;
    }

    _this.categories.unshift(SEARCH_CATEGORY);

    _this.setAnchorsRef = _this.setAnchorsRef.bind(_this);
    _this.handleAnchorClick = _this.handleAnchorClick.bind(_this);
    _this.setSearchRef = _this.setSearchRef.bind(_this);
    _this.handleSearch = _this.handleSearch.bind(_this);
    _this.setScrollRef = _this.setScrollRef.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    _this.handleScrollPaint = _this.handleScrollPaint.bind(_this);
    _this.handleEmojiOver = _this.handleEmojiOver.bind(_this);
    _this.handleEmojiLeave = _this.handleEmojiLeave.bind(_this);
    _this.handleEmojiClick = _this.handleEmojiClick.bind(_this);
    _this.setPreviewRef = _this.setPreviewRef.bind(_this);
    _this.handleSkinChange = _this.handleSkinChange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Picker, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.skin && !_store2.default.get('skin')) {
        this.setState({ skin: props.skin });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.firstRender) {
        this.testStickyPosition();
        this.firstRenderTimeout = setTimeout(function () {
          _this2.setState({ firstRender: false });
        }, 60);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateCategoriesSize();
      this.handleScroll();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      SEARCH_CATEGORY.emojis = null;

      clearTimeout(this.leaveTimeout);
      clearTimeout(this.firstRenderTimeout);
    }
  }, {
    key: 'testStickyPosition',
    value: function testStickyPosition() {
      var stickyTestElement = document.createElement('div');

      var prefixes = ['', '-webkit-', '-ms-', '-moz-', '-o-'];

      prefixes.forEach(function (prefix) {
        return stickyTestElement.style.position = prefix + 'sticky';
      });

      this.hasStickyPosition = !!stickyTestElement.style.position.length;
    }
  }, {
    key: 'handleEmojiOver',
    value: function handleEmojiOver(emoji) {
      var preview = this.preview;

      if (!preview) {
        return;
      }

      // Use Array.prototype.find() when it is more widely supported.
      var emojiData = CUSTOM_CATEGORY.emojis.filter(function (customEmoji) {
        return customEmoji.id === emoji.id;
      })[0];
      for (var key in emojiData) {
        if (emojiData.hasOwnProperty(key)) {
          emoji[key] = emojiData[key];
        }
      }

      preview.setState({ emoji: emoji });
      clearTimeout(this.leaveTimeout);
    }
  }, {
    key: 'handleEmojiLeave',
    value: function handleEmojiLeave(emoji) {
      var preview = this.preview;

      if (!preview) {
        return;
      }

      this.leaveTimeout = setTimeout(function () {
        preview.setState({ emoji: null });
      }, 16);
    }
  }, {
    key: 'handleEmojiClick',
    value: function handleEmojiClick(emoji, e) {
      var _this3 = this;

      this.props.onClick(emoji, e);
      if (!this.hideRecent) _frequently2.default.add(emoji);

      var component = this.categoryRefs['category-1'];
      if (component) {
        var maxMargin = component.maxMargin;
        component.forceUpdate();

        window.requestAnimationFrame(function () {
          if (!_this3.scroll) return;
          component.memoizeSize();
          if (maxMargin == component.maxMargin) return;

          _this3.updateCategoriesSize();
          _this3.handleScrollPaint();

          if (SEARCH_CATEGORY.emojis) {
            component.updateDisplay('none');
          }
        });
      }
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      if (!this.waitingForPaint) {
        this.waitingForPaint = true;
        window.requestAnimationFrame(this.handleScrollPaint);
      }
    }
  }, {
    key: 'handleScrollPaint',
    value: function handleScrollPaint() {
      this.waitingForPaint = false;

      if (!this.scroll) {
        return;
      }

      var activeCategory = null;

      if (SEARCH_CATEGORY.emojis) {
        activeCategory = SEARCH_CATEGORY;
      } else {
        var target = this.scroll,
            scrollTop = target.scrollTop,
            scrollingDown = scrollTop > (this.scrollTop || 0),
            minTop = 0;

        for (var i = 0, l = this.categories.length; i < l; i++) {
          var ii = scrollingDown ? this.categories.length - 1 - i : i,
              category = this.categories[ii],
              component = this.categoryRefs['category-' + ii];

          if (component) {
            var active = component.handleScroll(scrollTop);

            if (!minTop || component.top < minTop) {
              if (component.top > 0) {
                minTop = component.top;
              }
            }

            if (active && !activeCategory) {
              activeCategory = category;
            }
          }
        }

        if (scrollTop < minTop) {
          activeCategory = this.categories.filter(function (category) {
            return !(category.anchor === false);
          })[0];
        } else if (scrollTop + this.clientHeight >= this.scrollHeight) {
          activeCategory = this.categories[this.categories.length - 1];
        }
      }

      if (activeCategory) {
        var anchors = this.anchors;
        var _activeCategory = activeCategory;
        var categoryName = _activeCategory.name;


        if (anchors.state.selected != categoryName) {
          anchors.setState({ selected: categoryName });
        }
      }

      this.scrollTop = scrollTop;
    }
  }, {
    key: 'handleSearch',
    value: function handleSearch(emojis) {
      SEARCH_CATEGORY.emojis = emojis;

      for (var i = 0, l = this.categories.length; i < l; i++) {
        var component = this.categoryRefs['category-' + i];

        if (component && component.props.name != 'Search') {
          var display = emojis ? 'none' : 'inherit';
          component.updateDisplay(display);
        }
      }

      this.forceUpdate();
      this.scroll.scrollTop = 0;
      this.handleScroll();
    }
  }, {
    key: 'handleAnchorClick',
    value: function handleAnchorClick(category, i) {
      var component = this.categoryRefs['category-' + i];
      var scroll = this.scroll;
      var anchors = this.anchors;
      var scrollToComponent = null;

      scrollToComponent = function scrollToComponent() {
        if (component) {
          var top = component.top;


          if (category.first) {
            top = 0;
          } else {
            top += 1;
          }

          scroll.scrollTop = top;
        }
      };

      if (SEARCH_CATEGORY.emojis) {
        this.handleSearch(null);
        this.search.clear();

        window.requestAnimationFrame(scrollToComponent);
      } else {
        scrollToComponent();
      }
    }
  }, {
    key: 'handleSkinChange',
    value: function handleSkinChange(skin) {
      var newState = { skin: skin };

      this.setState(newState);
      _store2.default.update(newState);
    }
  }, {
    key: 'updateCategoriesSize',
    value: function updateCategoriesSize() {
      for (var i = 0, l = this.categories.length; i < l; i++) {
        var component = this.categoryRefs['category-' + i];
        if (component) component.memoizeSize();
      }

      if (this.scroll) {
        var target = this.scroll;
        this.scrollHeight = target.scrollHeight;
        this.clientHeight = target.clientHeight;
      }
    }
  }, {
    key: 'getCategories',
    value: function getCategories() {
      return this.state.firstRender ? this.categories.slice(0, 3) : this.categories;
    }
  }, {
    key: 'setAnchorsRef',
    value: function setAnchorsRef(c) {
      this.anchors = c;
    }
  }, {
    key: 'setSearchRef',
    value: function setSearchRef(c) {
      this.search = c;
    }
  }, {
    key: 'setPreviewRef',
    value: function setPreviewRef(c) {
      this.preview = c;
    }
  }, {
    key: 'setScrollRef',
    value: function setScrollRef(c) {
      this.scroll = c;
    }
  }, {
    key: 'setCategoryRef',
    value: function setCategoryRef(name, c) {
      if (!this.categoryRefs) {
        this.categoryRefs = {};
      }

      this.categoryRefs[name] = c;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props;
      var perLine = _props.perLine;
      var emojiSize = _props.emojiSize;
      var set = _props.set;
      var sheetSize = _props.sheetSize;
      var style = _props.style;
      var title = _props.title;
      var emoji = _props.emoji;
      var color = _props.color;
      var native = _props.native;
      var backgroundImageFn = _props.backgroundImageFn;
      var emojisToShowFilter = _props.emojisToShowFilter;
      var showPreview = _props.showPreview;
      var emojiTooltip = _props.emojiTooltip;
      var include = _props.include;
      var exclude = _props.exclude;
      var autoFocus = _props.autoFocus;
      var skin = this.state.skin;
      var width = perLine * (emojiSize + 12) + 12 + 2 + (0, _utils.measureScrollbar)();

      return _react2.default.createElement(
        'div',
        { style: (0, _extends3.default)({ width: width }, style), className: 'emoji-mart' },
        _react2.default.createElement(
          'div',
          { className: 'emoji-mart-bar' },
          _react2.default.createElement(_.Anchors, {
            ref: this.setAnchorsRef,
            i18n: this.i18n,
            color: color,
            categories: this.categories,
            onAnchorClick: this.handleAnchorClick
          })
        ),
        _react2.default.createElement(_.Search, {
          ref: this.setSearchRef,
          onSearch: this.handleSearch,
          i18n: this.i18n,
          emojisToShowFilter: emojisToShowFilter,
          include: include,
          exclude: exclude,
          custom: CUSTOM_CATEGORY.emojis,
          autoFocus: autoFocus
        }),
        _react2.default.createElement(
          'div',
          {
            ref: this.setScrollRef,
            className: 'emoji-mart-scroll',
            onScroll: this.handleScroll
          },
          this.getCategories().map(function (category, i) {
            return _react2.default.createElement(_.Category, {
              ref: _this4.setCategoryRef.bind(_this4, 'category-' + i),
              key: category.name,
              name: category.name,
              emojis: category.emojis,
              perLine: perLine,
              native: native,
              hasStickyPosition: _this4.hasStickyPosition,
              i18n: _this4.i18n,
              custom: category.name == 'Recent' ? CUSTOM_CATEGORY.emojis : undefined,
              emojiProps: {
                native: native,
                skin: skin,
                size: emojiSize,
                set: set,
                sheetSize: sheetSize,
                forceSize: native,
                tooltip: emojiTooltip,
                backgroundImageFn: backgroundImageFn,
                onOver: _this4.handleEmojiOver,
                onLeave: _this4.handleEmojiLeave,
                onClick: _this4.handleEmojiClick
              }
            });
          })
        ),
        showPreview && _react2.default.createElement(
          'div',
          { className: 'emoji-mart-bar' },
          _react2.default.createElement(_.Preview, {
            ref: this.setPreviewRef,
            title: title,
            emoji: emoji,
            emojiProps: {
              native: native,
              size: 38,
              skin: skin,
              set: set,
              sheetSize: sheetSize,
              backgroundImageFn: backgroundImageFn
            },
            skinsProps: {
              skin: skin,
              onChange: this.handleSkinChange
            }
          })
        )
      );
    }
  }]);
  return Picker;
}(_react2.default.PureComponent);

exports.default = Picker;


Picker.defaultProps = {
  onClick: function onClick() {},
  emojiSize: 24,
  perLine: 9,
  i18n: {},
  style: {},
  title: 'Emoji Mart™',
  emoji: 'department_store',
  color: '#ae65c5',
  set: _.Emoji.defaultProps.set,
  skin: _.Emoji.defaultProps.skin,
  native: _.Emoji.defaultProps.native,
  sheetSize: _.Emoji.defaultProps.sheetSize,
  backgroundImageFn: _.Emoji.defaultProps.backgroundImageFn,
  emojisToShowFilter: null,
  showPreview: true,
  emojiTooltip: _.Emoji.defaultProps.tooltip,
  autoFocus: false,
  custom: []
};