'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NAMESPACE = 'emoji-mart';

var _JSON = JSON;

var isLocalStorageSupported = typeof window !== 'undefined' && 'localStorage' in window;

function update(state) {
  for (var key in state) {
    var value = state[key];
    set(key, value);
  }
}

function set(key, value) {
  if (!isLocalStorageSupported) return;
  try {
    window.localStorage[NAMESPACE + '.' + key] = _JSON.stringify(value);
  } catch (e) {}
}

function get(key) {
  if (!isLocalStorageSupported) return;
  try {
    var value = window.localStorage[NAMESPACE + '.' + key];
  } catch (e) {
    return;
  }

  if (value) {
    return JSON.parse(value);
  }
}

function setNamespace(namespace) {
  NAMESPACE = namespace;
}

exports.default = { update: update, set: set, get: get, setNamespace: setNamespace };