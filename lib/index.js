'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.combineReducers = combineReducers;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var cached = {};
var options = {
  defaultReducerFunctionName: 'other', //name of the reducer function which used  with standart reduce using  switch/case
  useCache: true,
  strictMode: true, //TO DO call only called reducer functions and skip other. When false need set initial state store
  defaultCommonReducer: function defaultCommonReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];
    return state;
  }
  /**
   *
   *  when action type looks like reducerName.methodName will be called reducer with current name and with
   *  function methodName()
   *  when action type looks like [reducerName1,reducerName2].methodName will be called reducers with
   *  current names with functions reducerName1.methodName(), reducerName2.methodName()
   *  when action type not looks like reducerName.methodName will be called defaultMethodName from current reducer
   *
   *
   **/
};function combineReducers(reducers, opts) {
  var _options$opts = _extends({}, options, opts),
      defaultReducerFunctionName = _options$opts.defaultReducerFunctionName,
      useCache = _options$opts.useCache,
      defaultCommonReducer = _options$opts.defaultCommonReducer,
      strictMode = _options$opts.strictMode;

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var type = action.type,
        payload = _objectWithoutProperties(action, ['type']);

    var targetReducers = [];

    var _type$split = type.split('.'),
        _type$split2 = _slicedToArray(_type$split, 2),
        reducerName = _type$split2[0],
        method = _type$split2[1];

    if (!options.useCache || !cached[type]) {
      if (reducerName && method) {
        if (/^\[[^\]]*]$/g.test(reducerName)) {
          targetReducers = reducerName.substr(1).slice(0, -1).split(',').map(function (r) {
            return r.trim();
          });
        } else {
          targetReducers = [reducerName];
        }
      }
    }

    var hasChanged = false;
    var nextState = {};
    if (useCache && cached[type]) {
      var reducerKeys = Object.keys(cached[type]);
      reducerKeys.forEach(function (key) {
        var actualReducer = cached[type][key];
        var previousStateForKey = state[key];
        var nextStateForKey = actualReducer(previousStateForKey, action);
        if (typeof nextStateForKey === 'undefined') {
          delete cached[type];
          var errorMessage = getUndefinedStateErrorMessage(key, action);
          throw new Error(errorMessage);
        }
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      });
      if (hasChanged) {
        nextState = _extends({}, state, nextState);
      }
    } else {
      useCache && (cached[type] = {});
      var _reducerKeys = Object.keys(reducers);
      _reducerKeys.forEach(function (key) {
        var reducer = reducers[key];
        var previousStateForKey = state[key];
        var isReducerFunction = ~targetReducers.indexOf(key) && reducers[key] && reducers[key][method];
        var actualReducerFunc = reducers[key][isReducerFunction ? method : defaultReducerFunctionName] || defaultCommonReducer;
        useCache && (strictMode && isReducerFunction || !strictMode) && (cached[type][key] = actualReducerFunc);
        var nextStateForKey = actualReducerFunc(previousStateForKey, action);
        if (typeof nextStateForKey === 'undefined') {
          useCache && delete cached[type];
          var errorMessage = getUndefinedStateErrorMessage(reducer, action);
          throw new Error(errorMessage);
        }
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      });
    }
    return hasChanged ? nextState : state;
  };
}

/* getUndefinedStateErrorMessage copied from redux.combineReducer */
function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}