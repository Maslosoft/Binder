/* (The MIT License)
 *
 * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the 'Software'), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included with all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Original WeakMap implementation by Gozala @ https://gist.github.com/1269991
// Updated and bugfixed by Raynos @ https://gist.github.com/1638059
// Expanded by Benvie @ https://github.com/Benvie/harmony-collections

void function(global, undefined_, undefined){
  var getProps = Object.getOwnPropertyNames,
      defProp  = Object.defineProperty,
      toSource = Function.prototype.toString,
      create   = Object.create,
      hasOwn   = Object.prototype.hasOwnProperty,
      funcName = /^\n?function\s?(\w*)?_?\(/;


  function define(object, key, value){
    if (typeof key === 'function') {
      value = key;
      key = nameOf(value).replace(/_$/, '');
    }
    return defProp(object, key, { configurable: true, writable: true, value: value });
  }

  function nameOf(func){
    return typeof func !== 'function'
          ? '' : 'name' in func
          ? func.name : toSource.call(func).match(funcName)[1];
  }

  // ############
  // ### Data ###
  // ############

  var Data = (function(){
    var dataDesc = { value: { writable: true, value: undefined } },
        datalock = 'return function(k){if(k===s)return l}',
        uids     = create(null),

        createUID = function(){
          var key = Math.random().toString(36).slice(2);
          return key in uids ? createUID() : uids[key] = key;
        },

        globalID = createUID(),

        storage = function(obj){
          if (hasOwn.call(obj, globalID))
            return obj[globalID];

          if (!Object.isExtensible(obj))
            throw new TypeError("Object must be extensible");

          var store = create(null);
          defProp(obj, globalID, { value: store });
          return store;
        };

    // common per-object storage area made visible by patching getOwnPropertyNames'
    define(Object, function getOwnPropertyNames(obj){
      var props = getProps(obj);
      if (hasOwn.call(obj, globalID))
        props.splice(props.indexOf(globalID), 1);
      return props;
    });

    function Data(){
      var puid = createUID(),
          secret = {};

      this.unlock = function(obj){
        var store = storage(obj);
        if (hasOwn.call(store, puid))
          return store[puid](secret);

        var data = create(null, dataDesc);
        defProp(store, puid, {
          value: new Function('s', 'l', datalock)(secret, data)
        });
        return data;
      }
    }

    define(Data.prototype, function get(o){ return this.unlock(o).value });
    define(Data.prototype, function set(o, v){ this.unlock(o).value = v });

    return Data;
  }());


  var WM = (function(data){
    var validate = function(key){
      if (key == null || typeof key !== 'object' && typeof key !== 'function')
        throw new TypeError("Invalid WeakMap key");
    }

    var wrap = function(collection, value){
      var store = data.unlock(collection);
      if (store.value)
        throw new TypeError("Object is already a WeakMap");
      store.value = value;
    }

    var unwrap = function(collection){
      var storage = data.unlock(collection).value;
      if (!storage)
        throw new TypeError("WeakMap is not generic");
      return storage;
    }

    var initialize = function(weakmap, iterable){
      if (iterable !== null && typeof iterable === 'object' && typeof iterable.forEach === 'function') {
        iterable.forEach(function(item, i){
          if (item instanceof Array && item.length === 2)
            set.call(weakmap, iterable[i][0], iterable[i][1]);
        });
      }
    }


    function WeakMap(iterable){
      if (this === global || this == null || this === WeakMap.prototype)
        return new WeakMap(iterable);

      wrap(this, new Data);
      initialize(this, iterable);
    }

    function get(key){
      validate(key);
      var value = unwrap(this).get(key);
      return value === undefined_ ? undefined : value;
    }

    function set(key, value){
      validate(key);
      // store a token for explicit undefined so that "has" works correctly
      unwrap(this).set(key, value === undefined ? undefined_ : value);
    }

    function has(key){
      validate(key);
      return unwrap(this).get(key) !== undefined;
    }

    function delete_(key){
      validate(key);
      var data = unwrap(this),
          had = data.get(key) !== undefined;
      data.set(key, undefined);
      return had;
    }

    function toString(){
      unwrap(this);
      return '[object WeakMap]';
    }

    try {
      var src = ('return '+delete_).replace('e_', '\\u0065'),
          del = new Function('unwrap', 'validate', src)(unwrap, validate);
    } catch (e) {
      var del = delete_;
    }

    var src = (''+Object).split('Object');
    var stringifier = function toString(){
      return src[0] + nameOf(this) + src[1];
    };

    define(stringifier, stringifier);

    var prep = { __proto__: [] } instanceof Array
      ? function(f){ f.__proto__ = stringifier }
      : function(f){ define(f, stringifier) };

    prep(WeakMap);

    [toString, get, set, has, del].forEach(function(method){
      define(WeakMap.prototype, method);
      prep(method);
    });

    return WeakMap;
  }(new Data));

  var defaultCreator = Object.create
    ? function(){ return Object.create(null) }
    : function(){ return {} };

  function createStorage(creator){
    var weakmap = new WM;
    creator || (creator = defaultCreator);

    function storage(object, value){
      if (value || arguments.length === 2) {
        weakmap.set(object, value);
      } else {
        value = weakmap.get(object);
        if (value === undefined) {
          value = creator(object);
          weakmap.set(object, value);
        }
      }
      return value;
    }

    return storage;
  }


  if (typeof module !== 'undefined') {
    module.exports = WM;
  } else if (typeof exports !== 'undefined') {
    exports.WeakMap = WM;
  } else if (!('WeakMap' in global)) {
    global.WeakMap = WM;
  }

  WM.createStorage = createStorage;
  if (global.WeakMap)
    global.WeakMap.createStorage = createStorage;
}((0, eval)('this'));
;
/*!
 * Knockout JavaScript library v3.5.1
 * (c) The Knockout.js team - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function(){
var DEBUG=true;
(function(undefined){
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        jQueryInstance = window["jQuery"],
        JSON = window["JSON"];

    if (!jQueryInstance && typeof jQuery !== "undefined") {
        jQueryInstance = jQuery;
    }
(function(factory) {
    // Support three module loading scenarios
    if (typeof define === 'function' && define['amd']) {
        // [1] AMD anonymous module
        define(['exports', 'require'], factory);
    } else if (typeof exports === 'object' && typeof module === 'object') {
        // [2] CommonJS/Node.js
        factory(module['exports'] || exports);  // module.exports is for Node.js
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports, amdRequire){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
    // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
ko.version = "3.5.1";

ko.exportSymbol('version', ko.version);
// For any options that may affect various areas of Knockout and aren't directly associated with data binding.
ko.options = {
    'deferUpdates': false,
    'useOnlyNativeEvents': false,
    'foreachHidesDestroyed': false
};

//ko.exportSymbol('options', ko.options);   // 'options' isn't minified
ko.utils = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function objectForEach(obj, action) {
        for (var prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
                action(prop, obj[prop]);
            }
        }
    }

    function extend(target, source) {
        if (source) {
            for(var prop in source) {
                if(hasOwnProperty.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    function setPrototypeOf(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }

    var canSetPrototype = ({ __proto__: [] } instanceof Array);
    var canUseSymbols = !DEBUG && typeof Symbol === 'function';

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    objectForEach(knownEvents, function(eventType, knownEventsForType) {
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    });
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
    // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
    // If there is a future need to detect specific versions of IE10+, we will amend this.
    var ieVersion = document && (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        ) {}
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    // For details on the pattern for changing node classes
    // see: https://github.com/knockout/knockout/issues/1597
    var cssClassNameRegex = /\S+/g;

    var jQueryEventAttachName;

    function toggleDomNodeCssClass(node, classNames, shouldHaveClass) {
        var addOrRemoveFn;
        if (classNames) {
            if (typeof node.classList === 'object') {
                addOrRemoveFn = node.classList[shouldHaveClass ? 'add' : 'remove'];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    addOrRemoveFn.call(node.classList, className);
                });
            } else if (typeof node.className['baseVal'] === 'string') {
                // SVG tag .classNames is an SVGAnimatedString instance
                toggleObjectClassPropertyString(node.className, 'baseVal', classNames, shouldHaveClass);
            } else {
                // node.className ought to be a string.
                toggleObjectClassPropertyString(node, 'className', classNames, shouldHaveClass);
            }
        }
    }

    function toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass) {
        // obj/prop is either a node/'className' or a SVGAnimatedString/'baseVal'.
        var currentClassNames = obj[prop].match(cssClassNameRegex) || [];
        ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
            ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
        });
        obj[prop] = currentClassNames.join(" ");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action, actionOwner) {
            for (var i = 0, j = array.length; i < j; i++) {
                action.call(actionOwner, array[i], i, array);
            }
        },

        arrayIndexOf: typeof Array.prototype.indexOf == "function"
            ? function (array, item) {
                return Array.prototype.indexOf.call(array, item);
            }
            : function (array, item) {
                for (var i = 0, j = array.length; i < j; i++) {
                    if (array[i] === item)
                        return i;
                }
                return -1;
            },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++) {
                if (predicate.call(predicateOwner, array[i], i, array))
                    return array[i];
            }
            return undefined;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index > 0) {
                array.splice(index, 1);
            }
            else if (index === 0) {
                array.shift();
            }
        },

        arrayGetDistinctValues: function (array) {
            var result = [];
            if (array) {
                ko.utils.arrayForEach(array, function(item) {
                    if (ko.utils.arrayIndexOf(result, item) < 0)
                        result.push(item);
                });
            }
            return result;
        },

        arrayMap: function (array, mapping, mappingOwner) {
            var result = [];
            if (array) {
                for (var i = 0, j = array.length; i < j; i++)
                    result.push(mapping.call(mappingOwner, array[i], i));
            }
            return result;
        },

        arrayFilter: function (array, predicate, predicateOwner) {
            var result = [];
            if (array) {
                for (var i = 0, j = array.length; i < j; i++)
                    if (predicate.call(predicateOwner, array[i], i))
                        result.push(array[i]);
            }
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        addOrRemoveItem: function(array, value, included) {
            var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
            if (existingEntryIndex < 0) {
                if (included)
                    array.push(value);
            } else {
                if (!included)
                    array.splice(existingEntryIndex, 1);
            }
        },

        canSetPrototype: canSetPrototype,

        extend: extend,

        setPrototypeOf: setPrototypeOf,

        setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,

        objectForEach: objectForEach,

        objectMap: function(source, mapping, mappingOwner) {
            if (!source)
                return source;
            var target = {};
            for (var prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    target[prop] = mapping.call(mappingOwner, source[prop], prop, source);
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);
            var templateDocument = (nodesArray[0] && nodesArray[0].ownerDocument) || document;

            var container = templateDocument.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                container.appendChild(ko.cleanNode(nodesArray[i]));
            }
            return container;
        },

        cloneNodes: function (nodesArray, shouldCleanNodes) {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {
            // Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
            // them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
            // new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
            // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
            // So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
            //
            // Rules:
            //   [A] Any leading nodes that have been removed should be ignored
            //       These most likely correspond to memoization nodes that were already removed during binding
            //       See https://github.com/knockout/knockout/pull/440
            //   [B] Any trailing nodes that have been remove should be ignored
            //       This prevents the code here from adding unrelated nodes to the array while processing rule [C]
            //       See https://github.com/knockout/knockout/pull/1903
            //   [C] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
            //       and include any nodes that have been inserted among the previous collection

            if (continuousNodeArray.length) {
                // The parent node can be a virtual element; so get the real parent node
                parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

                // Rule [A]
                while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
                    continuousNodeArray.splice(0, 1);

                // Rule [B]
                while (continuousNodeArray.length > 1 && continuousNodeArray[continuousNodeArray.length - 1].parentNode !== parentNode)
                    continuousNodeArray.length--;

                // Rule [C]
                if (continuousNodeArray.length > 1) {
                    var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
                    // Replace with the actual new continuous node set
                    continuousNodeArray.length = 0;
                    while (current !== last) {
                        continuousNodeArray.push(current);
                        current = current.nextSibling;
                    }
                    continuousNodeArray.push(last);
                }
            }
            return continuousNodeArray;
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (ieVersion < 7)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (node === containedByNode)
                return true;
            if (node.nodeType === 11)
                return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
            if (containedByNode.contains)
                return containedByNode.contains(node.nodeType !== 1 ? node.parentNode : node);
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node && node != containedByNode) {
                node = node.parentNode;
            }
            return !!node;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
        },

        anyDomNodeIsAttachedToDocument: function(nodes) {
            return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        catchFunctionErrors: function (delegate) {
            return ko['onError'] ? function () {
                try {
                    return delegate.apply(this, arguments);
                } catch (e) {
                    ko['onError'] && ko['onError'](e);
                    throw e;
                }
            } : delegate;
        },

        setTimeout: function (handler, timeout) {
            return setTimeout(ko.utils.catchFunctionErrors(handler), timeout);
        },

        deferError: function (error) {
            setTimeout(function () {
                ko['onError'] && ko['onError'](error);
                throw error;
            }, 0);
        },

        registerEventHandler: function (element, eventType, handler) {
            var wrappedHandler = ko.utils.catchFunctionErrors(handler);

            var mustUseAttachEvent = eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!ko.options['useOnlyNativeEvents'] && !mustUseAttachEvent && jQueryInstance) {
                if (!jQueryEventAttachName) {
                    jQueryEventAttachName = (typeof jQueryInstance(element)['on'] == 'function') ? 'on' : 'bind';
                }
                jQueryInstance(element)[jQueryEventAttachName](eventType, wrappedHandler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, wrappedHandler, false);
            else if (typeof element.attachEvent != "undefined") {
                var attachEventHandler = function (event) { wrappedHandler.call(element, event); },
                    attachEventName = "on" + eventType;
                element.attachEvent(attachEventName, attachEventHandler);

                // IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
                // so to avoid leaks, we have to remove them manually. See bug #856
                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    element.detachEvent(attachEventName, attachEventHandler);
                });
            } else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            // For click events on checkboxes and radio buttons, jQuery toggles the element checked state *after* the
            // event handler runs instead of *before*. (This was fixed in 1.9 for checkboxes but not for radio buttons.)
            // IE doesn't change the checked state when you trigger the click event using "fireEvent".
            // In both cases, we'll use the click method instead.
            var useClickWorkaround = isClickOnCheckableElement(element, eventType);

            if (!ko.options['useOnlyNativeEvents'] && jQueryInstance && !useClickWorkaround) {
                jQueryInstance(element)['trigger'](eventType);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (useClickWorkaround && element.click) {
                element.click();
            } else if (typeof element.fireEvent != "undefined") {
                element.fireEvent("on" + eventType);
            } else {
                throw new Error("Browser doesn't support triggering events");
            }
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        peekObservable: function (value) {
            return ko.isObservable(value) ? value.peek() : value;
        },

        toggleDomNodeCssClass: toggleDomNodeCssClass,

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            // We need there to be exactly one child: a text node.
            // If there are no children, more than one, or if it's not a text node,
            // we'll clear everything and create a single text node.
            var innerTextNode = ko.virtualElements.firstChild(element);
            if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
            } else {
                innerTextNode.data = value;
            }

            ko.utils.forceRefresh(element);
        },

        setElementName: function(element, name) {
            element.name = name;

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ieVersion <= 7) {
                try {
                    var escapedName = element.name.replace(/[&<>'"]/g, function(r){ return "&#" + r.charCodeAt(0) + ";"; });
                    element.mergeAttributes(document.createElement("<input name='" + escapedName + "'/>"), false);
                }
                catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
            }
        },

        forceRefresh: function(node) {
            // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
            if (ieVersion >= 9) {
                // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                var elem = node.nodeType == 1 ? node : node.parentNode;
                if (elem.style)
                    elem.style.zoom = elem.style.zoom;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            // Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
            if (ieVersion) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        createSymbolOrString: function(identifier) {
            return canUseSymbols ? Symbol(identifier) : identifier;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (JSON && JSON.parse) // Use native parsing where available
                        return JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if (!JSON || !JSON.stringify)
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                // Since 'data' this is a model object, we include all properties including those inherited from its prototype
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            objectForEach(params, function(key, value) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
}());

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.cloneNodes', ko.utils.cloneNodes);
ko.exportSymbol('utils.createSymbolOrString', ko.utils.createSymbolOrString);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.objectMap', ko.utils.objectMap);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('utils.setTextContent', ko.utils.setTextContent);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this;
        if (arguments.length === 1) {
            return function () {
                return originalFunction.apply(object, arguments);
            };
        } else {
            var partialArgs = Array.prototype.slice.call(arguments, 1);
            return function () {
                var args = partialArgs.slice(0);
                args.push.apply(args, arguments);
                return originalFunction.apply(object, args);
            };
        }
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};

    var getDataForNode, clear;
    if (!ko.utils.ieVersion) {
        // We considered using WeakMap, but it has a problem in IE 11 and Edge that prevents using
        // it cross-window, so instead we just store the data directly on the node.
        // See https://github.com/knockout/knockout/issues/2141
        getDataForNode = function (node, createIfNotFound) {
            var dataForNode = node[dataStoreKeyExpandoPropertyName];
            if (!dataForNode && createIfNotFound) {
                dataForNode = node[dataStoreKeyExpandoPropertyName] = {};
            }
            return dataForNode;
        };
        clear = function (node) {
            if (node[dataStoreKeyExpandoPropertyName]) {
                delete node[dataStoreKeyExpandoPropertyName];
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        };
    } else {
        // Old IE versions have memory issues if you store objects on the node, so we use a
        // separate data storage and link to it from the node using a string key.
        getDataForNode = function (node, createIfNotFound) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
            if (!hasExistingDataStore) {
                if (!createIfNotFound)
                    return undefined;
                dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                dataStore[dataStoreKey] = {};
            }
            return dataStore[dataStoreKey];
        };
        clear = function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        };
    }

    return {
        get: function (node, key) {
            var dataForNode = getDataForNode(node, false);
            return dataForNode && dataForNode[key];
        },
        set: function (node, key, value) {
            // Make sure we don't actually create a new domData key if we are actually deleting a value
            var dataForNode = getDataForNode(node, value !== undefined /* createIfNotFound */);
            dataForNode && (dataForNode[key] = value);
        },
        getOrSet: function (node, key, value) {
            var dataForNode = getDataForNode(node, true /* createIfNotFound */);
            return dataForNode[key] || (dataForNode[key] = value);
        },
        clear: clear,

        nextKey: function () {
            return (uniqueId++) + dataStoreKeyExpandoPropertyName;
        }
    };
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = ko.utils.domData.nextKey();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Erase the DOM data
        ko.utils.domData.clear(node);

        // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
        ko.utils.domNodeDisposal["cleanExternalData"](node);

        // Clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType]) {
            cleanNodesInList(node.childNodes, true/*onlyComments*/);
        }
    }

    function cleanNodesInList(nodeList, onlyComments) {
        var cleanedNodes = [], lastCleanedNode;
        for (var i = 0; i < nodeList.length; i++) {
            if (!onlyComments || nodeList[i].nodeType === 8) {
                cleanSingleNode(cleanedNodes[cleanedNodes.length] = lastCleanedNode = nodeList[i]);
                if (nodeList[i] !== lastCleanedNode) {
                    while (i-- && ko.utils.arrayIndexOf(cleanedNodes, nodeList[i]) == -1) {}
                }
            }
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            ko.dependencyDetection.ignore(function () {
                // First clean this node, where applicable
                if (cleanableNodeTypes[node.nodeType]) {
                    cleanSingleNode(node);

                    // ... then its descendants, where applicable
                    if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                        cleanNodesInList(node.getElementsByTagName("*"));
                    }
                }
            });

            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        },

        "cleanExternalData" : function (node) {
            // Special support for jQuery here because it's so commonly used.
            // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
            // so notify it to tear down any resources associated with the node & descendants here.
            if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                jQueryInstance['cleanData']([node]);
        }
    };
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var none = [0, "", ""],
        table = [1, "<table>", "</table>"],
        tbody = [2, "<table><tbody>", "</tbody></table>"],
        tr = [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        select = [1, "<select multiple='multiple'>", "</select>"],
        lookup = {
            'thead': table,
            'tbody': table,
            'tfoot': table,
            'tr': tbody,
            'td': tr,
            'th': tr,
            'option': select,
            'optgroup': select
        },

        // This is needed for old IE if you're *not* using either jQuery or innerShiv. Doesn't affect other cases.
        mayRequireCreateElementHack = ko.utils.ieVersion <= 8;

    function getWrap(tags) {
        var m = tags.match(/^(?:<!--.*?-->\s*?)*?<([a-z]+)[\s>]/);
        return (m && lookup[m[1]]) || none;
    }

    function simpleHtmlParse(html, documentContext) {
        documentContext || (documentContext = document);
        var windowContext = documentContext['parentWindow'] || documentContext['defaultView'] || window;

        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = documentContext.createElement("div"),
            wrap = getWrap(tags),
            depth = wrap[0];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof windowContext['innerShiv'] == "function") {
            // Note that innerShiv is deprecated in favour of html5shiv. We should consider adding
            // support for html5shiv (except if no explicit support is needed, e.g., if html5shiv
            // somehow shims the native APIs so it just works anyway)
            div.appendChild(windowContext['innerShiv'](markup));
        } else {
            if (mayRequireCreateElementHack) {
                // The document.createElement('my-element') trick to enable custom elements in IE6-8
                // only works if we assign innerHTML on an element associated with that document.
                documentContext.body.appendChild(div);
            }

            div.innerHTML = markup;

            if (mayRequireCreateElementHack) {
                div.parentNode.removeChild(div);
            }
        }

        // Move to the right depth
        while (depth--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html, documentContext) {
        // jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
        if (jQueryInstance['parseHTML']) {
            return jQueryInstance['parseHTML'](html, documentContext) || []; // Ensure we always return an array and never null
        } else {
            // For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
            var elems = jQueryInstance['clean']([html], documentContext);

            // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
            // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
            // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
            if (elems && elems[0]) {
                // Find the top-most parent element that's a direct child of a document fragment
                var elem = elems[0];
                while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                    elem = elem.parentNode;
                // ... then detach it
                if (elem.parentNode)
                    elem.parentNode.removeChild(elem);
            }

            return elems;
        }
    }

    ko.utils.parseHtmlFragment = function(html, documentContext) {
        return jQueryInstance ?
            jQueryHtmlParse(html, documentContext) :   // As below, benefit from jQuery's optimisations where possible
            simpleHtmlParse(html, documentContext);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.parseHtmlForTemplateNodes = function(html, documentContext) {
        var nodes = ko.utils.parseHtmlFragment(html, documentContext);
        return (nodes.length && nodes[0].parentElement) || ko.utils.moveCleanedNodesToContainerElement(nodes);
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (jQueryInstance) {
                jQueryInstance(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html, node.ownerDocument);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.tasks = (function () {
    var scheduler,
        taskQueue = [],
        taskQueueLength = 0,
        nextHandle = 1,
        nextIndexToProcess = 0;

    if (window['MutationObserver']) {
        // Chrome 27+, Firefox 14+, IE 11+, Opera 15+, Safari 6.1+
        // From https://github.com/petkaantonov/bluebird * Copyright (c) 2014 Petka Antonov * License: MIT
        scheduler = (function (callback) {
            var div = document.createElement("div");
            new MutationObserver(callback).observe(div, {attributes: true});
            return function () { div.classList.toggle("foo"); };
        })(scheduledProcess);
    } else if (document && "onreadystatechange" in document.createElement("script")) {
        // IE 6-10
        // From https://github.com/YuzuJS/setImmediate * Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola * License: MIT
        scheduler = function (callback) {
            var script = document.createElement("script");
            script.onreadystatechange = function () {
                script.onreadystatechange = null;
                document.documentElement.removeChild(script);
                script = null;
                callback();
            };
            document.documentElement.appendChild(script);
        };
    } else {
        scheduler = function (callback) {
            setTimeout(callback, 0);
        };
    }

    function processTasks() {
        if (taskQueueLength) {
            // Each mark represents the end of a logical group of tasks and the number of these groups is
            // limited to prevent unchecked recursion.
            var mark = taskQueueLength, countMarks = 0;

            // nextIndexToProcess keeps track of where we are in the queue; processTasks can be called recursively without issue
            for (var task; nextIndexToProcess < taskQueueLength; ) {
                if (task = taskQueue[nextIndexToProcess++]) {
                    if (nextIndexToProcess > mark) {
                        if (++countMarks >= 5000) {
                            nextIndexToProcess = taskQueueLength;   // skip all tasks remaining in the queue since any of them could be causing the recursion
                            ko.utils.deferError(Error("'Too much recursion' after processing " + countMarks + " task groups."));
                            break;
                        }
                        mark = taskQueueLength;
                    }
                    try {
                        task();
                    } catch (ex) {
                        ko.utils.deferError(ex);
                    }
                }
            }
        }
    }

    function scheduledProcess() {
        processTasks();

        // Reset the queue
        nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
    }

    function scheduleTaskProcessing() {
        ko.tasks['scheduler'](scheduledProcess);
    }

    var tasks = {
        'scheduler': scheduler,     // Allow overriding the scheduler

        schedule: function (func) {
            if (!taskQueueLength) {
                scheduleTaskProcessing();
            }

            taskQueue[taskQueueLength++] = func;
            return nextHandle++;
        },

        cancel: function (handle) {
            var index = handle - (nextHandle - taskQueueLength);
            if (index >= nextIndexToProcess && index < taskQueueLength) {
                taskQueue[index] = null;
            }
        },

        // For testing only: reset the queue and return the previous queue length
        'resetForTesting': function () {
            var length = taskQueueLength - nextIndexToProcess;
            nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
            return length;
        },

        runEarly: processTasks
    };

    return tasks;
})();

ko.exportSymbol('tasks', ko.tasks);
ko.exportSymbol('tasks.schedule', ko.tasks.schedule);
//ko.exportSymbol('tasks.cancel', ko.tasks.cancel);  "cancel" isn't minified
ko.exportSymbol('tasks.runEarly', ko.tasks.runEarly);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = ko.utils.setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'rateLimit': function(target, options) {
        var timeout, method, limitFunction;

        if (typeof options == 'number') {
            timeout = options;
        } else {
            timeout = options['timeout'];
            method = options['method'];
        }

        // rateLimit supersedes deferred updates
        target._deferUpdates = false;

        limitFunction = typeof method == 'function' ? method : method == 'notifyWhenChangesStop' ?  debounce : throttle;
        target.limit(function(callback) {
            return limitFunction(callback, timeout, options);
        });
    },

    'deferred': function(target, options) {
        if (options !== true) {
            throw new Error('The \'deferred\' extender only accepts the value \'true\', because it is not supported to turn deferral off once enabled.')
        }

        if (!target._deferUpdates) {
            target._deferUpdates = true;
            target.limit(function (callback) {
                var handle,
                    ignoreUpdates = false;
                return function () {
                    if (!ignoreUpdates) {
                        ko.tasks.cancel(handle);
                        handle = ko.tasks.schedule(callback);

                        try {
                            ignoreUpdates = true;
                            target['notifySubscribers'](undefined, 'dirty');
                        } finally {
                            ignoreUpdates = false;
                        }
                    }
                };
            });
        }
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always" ?
            null :  // null equalityComparer means to always notify
            valuesArePrimitiveAndEqual;
    }
};

var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
function valuesArePrimitiveAndEqual(a, b) {
    var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
    return oldValueIsPrimitive ? (a === b) : false;
}

function throttle(callback, timeout) {
    var timeoutInstance;
    return function () {
        if (!timeoutInstance) {
            timeoutInstance = ko.utils.setTimeout(function () {
                timeoutInstance = undefined;
                callback();
            }, timeout);
        }
    };
}

function debounce(callback, timeout) {
    var timeoutInstance;
    return function () {
        clearTimeout(timeoutInstance);
        timeoutInstance = ko.utils.setTimeout(callback, timeout);
    };
}

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        ko.utils.objectForEach(requestedExtenders, function(key, value) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, value) || target;
            }
        });
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this._target = target;
    this._callback = callback;
    this._disposeCallback = disposeCallback;
    this._isDisposed = false;
    this._node = null;
    this._domNodeDisposalCallback = null;
    ko.exportProperty(this, 'dispose', this.dispose);
    ko.exportProperty(this, 'disposeWhenNodeIsRemoved', this.disposeWhenNodeIsRemoved);
};
ko.subscription.prototype.dispose = function () {
    var self = this;
    if (!self._isDisposed) {
        if (self._domNodeDisposalCallback) {
            ko.utils.domNodeDisposal.removeDisposeCallback(self._node, self._domNodeDisposalCallback);
        }
        self._isDisposed = true;
        self._disposeCallback();

        self._target = self._callback = self._disposeCallback = self._node = self._domNodeDisposalCallback = null;
    }
};
ko.subscription.prototype.disposeWhenNodeIsRemoved = function (node) {
    this._node = node;
    ko.utils.domNodeDisposal.addDisposeCallback(node, this._domNodeDisposalCallback = this.dispose.bind(this));
};

ko.subscribable = function () {
    ko.utils.setPrototypeOfOrExtend(this, ko_subscribable_fn);
    ko_subscribable_fn.init(this);
}

var defaultEvent = "change";

// Moved out of "limit" to avoid the extra closure
function limitNotifySubscribers(value, event) {
    if (!event || event === defaultEvent) {
        this._limitChange(value);
    } else if (event === 'beforeChange') {
        this._limitBeforeChange(value);
    } else {
        this._origNotifySubscribers(value, event);
    }
}

var ko_subscribable_fn = {
    init: function(instance) {
        instance._subscriptions = { "change": [] };
        instance._versionNumber = 1;
    },

    subscribe: function (callback, callbackTarget, event) {
        var self = this;

        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(self, boundCallback, function () {
            ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
            if (self.afterSubscriptionRemove)
                self.afterSubscriptionRemove(event);
        });

        if (self.beforeSubscriptionAdd)
            self.beforeSubscriptionAdd(event);

        if (!self._subscriptions[event])
            self._subscriptions[event] = [];
        self._subscriptions[event].push(subscription);

        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (event === defaultEvent) {
            this.updateVersion();
        }
        if (this.hasSubscriptionsForEvent(event)) {
            var subs = event === defaultEvent && this._changeSubscriptions || this._subscriptions[event].slice(0);
            try {
                ko.dependencyDetection.begin(); // Begin suppressing dependency detection (by setting the top frame to undefined)
                for (var i = 0, subscription; subscription = subs[i]; ++i) {
                    // In case a subscription was disposed during the arrayForEach cycle, check
                    // for isDisposed on each subscription before invoking its callback
                    if (!subscription._isDisposed)
                        subscription._callback(valueToNotify);
                }
            } finally {
                ko.dependencyDetection.end(); // End suppressing dependency detection
            }
        }
    },

    getVersion: function () {
        return this._versionNumber;
    },

    hasChanged: function (versionToCheck) {
        return this.getVersion() !== versionToCheck;
    },

    updateVersion: function () {
        ++this._versionNumber;
    },

    limit: function(limitFunction) {
        var self = this, selfIsObservable = ko.isObservable(self),
            ignoreBeforeChange, notifyNextChange, previousValue, pendingValue, didUpdate,
            beforeChange = 'beforeChange';

        if (!self._origNotifySubscribers) {
            self._origNotifySubscribers = self["notifySubscribers"];
            self["notifySubscribers"] = limitNotifySubscribers;
        }

        var finish = limitFunction(function() {
            self._notificationIsPending = false;

            // If an observable provided a reference to itself, access it to get the latest value.
            // This allows computed observables to delay calculating their value until needed.
            if (selfIsObservable && pendingValue === self) {
                pendingValue = self._evalIfChanged ? self._evalIfChanged() : self();
            }
            var shouldNotify = notifyNextChange || (didUpdate && self.isDifferent(previousValue, pendingValue));

            didUpdate = notifyNextChange = ignoreBeforeChange = false;

            if (shouldNotify) {
                self._origNotifySubscribers(previousValue = pendingValue);
            }
        });

        self._limitChange = function(value, isDirty) {
            if (!isDirty || !self._notificationIsPending) {
                didUpdate = !isDirty;
            }
            self._changeSubscriptions = self._subscriptions[defaultEvent].slice(0);
            self._notificationIsPending = ignoreBeforeChange = true;
            pendingValue = value;
            finish();
        };
        self._limitBeforeChange = function(value) {
            if (!ignoreBeforeChange) {
                previousValue = value;
                self._origNotifySubscribers(value, beforeChange);
            }
        };
        self._recordUpdate = function() {
            didUpdate = true;
        };
        self._notifyNextChangeIfValueIsDifferent = function() {
            if (self.isDifferent(previousValue, self.peek(true /*evaluate*/))) {
                notifyNextChange = true;
            }
        };
    },

    hasSubscriptionsForEvent: function(event) {
        return this._subscriptions[event] && this._subscriptions[event].length;
    },

    getSubscriptionsCount: function (event) {
        if (event) {
            return this._subscriptions[event] && this._subscriptions[event].length || 0;
        } else {
            var total = 0;
            ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
                if (eventName !== 'dirty')
                    total += subscriptions.length;
            });
            return total;
        }
    },

    isDifferent: function(oldValue, newValue) {
        return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
    },

    toString: function() {
      return '[object Object]'
    },

    extend: applyExtenders
};

ko.exportProperty(ko_subscribable_fn, 'init', ko_subscribable_fn.init);
ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);

// For browsers that support proto assignment, we overwrite the prototype of each
// observable instance. Since observables are functions, we need Function.prototype
// to still be in the prototype chain.
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
}

ko.subscribable['fn'] = ko_subscribable_fn;


ko.isSubscribable = function (instance) {
    return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.computedContext = ko.dependencyDetection = (function () {
    var outerFrames = [],
        currentFrame,
        lastId = 0;

    // Return a unique ID that can be assigned to an observable for dependency tracking.
    // Theoretically, you could eventually overflow the number storage size, resulting
    // in duplicate IDs. But in JavaScript, the largest exact integral value is 2^53
    // or 9,007,199,254,740,992. If you created 1,000,000 IDs per second, it would
    // take over 285 years to reach that number.
    // Reference http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html
    function getId() {
        return ++lastId;
    }

    function begin(options) {
        outerFrames.push(currentFrame);
        currentFrame = options;
    }

    function end() {
        currentFrame = outerFrames.pop();
    }

    return {
        begin: begin,

        end: end,

        registerDependency: function (subscribable) {
            if (currentFrame) {
                if (!ko.isSubscribable(subscribable))
                    throw new Error("Only subscribable things can act as dependencies");
                currentFrame.callback.call(currentFrame.callbackTarget, subscribable, subscribable._id || (subscribable._id = getId()));
            }
        },

        ignore: function (callback, callbackTarget, callbackArgs) {
            try {
                begin();
                return callback.apply(callbackTarget, callbackArgs || []);
            } finally {
                end();
            }
        },

        getDependenciesCount: function () {
            if (currentFrame)
                return currentFrame.computed.getDependenciesCount();
        },

        getDependencies: function () {
            if (currentFrame)
                return currentFrame.computed.getDependencies();
        },

        isInitial: function() {
            if (currentFrame)
                return currentFrame.isInitial;
        },

        computed: function() {
            if (currentFrame)
                return currentFrame.computed;
        }
    };
})();

ko.exportSymbol('computedContext', ko.computedContext);
ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
ko.exportSymbol('computedContext.getDependencies', ko.computedContext.getDependencies);
ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);
ko.exportSymbol('computedContext.registerDependency', ko.computedContext.registerDependency);

ko.exportSymbol('ignoreDependencies', ko.ignoreDependencies = ko.dependencyDetection.ignore);
var observableLatestValue = ko.utils.createSymbolOrString('_latestValue');

ko.observable = function (initialValue) {
    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if (observable.isDifferent(observable[observableLatestValue], arguments[0])) {
                observable.valueWillMutate();
                observable[observableLatestValue] = arguments[0];
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return observable[observableLatestValue];
        }
    }

    observable[observableLatestValue] = initialValue;

    // Inherit from 'subscribable'
    if (!ko.utils.canSetPrototype) {
        // 'subscribable' won't be on the prototype chain unless we put it there directly
        ko.utils.extend(observable, ko.subscribable['fn']);
    }
    ko.subscribable['fn'].init(observable);

    // Inherit from 'observable'
    ko.utils.setPrototypeOfOrExtend(observable, observableFn);

    if (ko.options['deferUpdates']) {
        ko.extenders['deferred'](observable, true);
    }

    return observable;
}

// Define prototype for observables
var observableFn = {
    'equalityComparer': valuesArePrimitiveAndEqual,
    peek: function() { return this[observableLatestValue]; },
    valueHasMutated: function () {
        this['notifySubscribers'](this[observableLatestValue], 'spectate');
        this['notifySubscribers'](this[observableLatestValue]);
    },
    valueWillMutate: function () { this['notifySubscribers'](this[observableLatestValue], 'beforeChange'); }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(observableFn, ko.subscribable['fn']);
}

var protoProperty = ko.observable.protoProperty = '__ko_proto__';
observableFn[protoProperty] = ko.observable;

ko.isObservable = function (instance) {
    var proto = typeof instance == 'function' && instance[protoProperty];
    if (proto && proto !== observableFn[protoProperty] && proto !== ko.computed['fn'][protoProperty]) {
        throw Error("Invalid object that looks like an observable; possibly from another Knockout instance");
    }
    return !!proto;
};

ko.isWriteableObservable = function (instance) {
    return (typeof instance == 'function' && (
        (instance[protoProperty] === observableFn[protoProperty]) ||  // Observable
        (instance[protoProperty] === ko.computed['fn'][protoProperty] && instance.hasWriteFunction)));   // Writable computed observable
};

ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
ko.exportSymbol('observable.fn', observableFn);
ko.exportProperty(observableFn, 'peek', observableFn.peek);
ko.exportProperty(observableFn, 'valueHasMutated', observableFn.valueHasMutated);
ko.exportProperty(observableFn, 'valueWillMutate', observableFn.valueWillMutate);
ko.observableArray = function (initialValues) {
    initialValues = initialValues || [];

    if (typeof initialValues != 'object' || !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
    return result.extend({'trackArrayChanges':true});
};

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                if (underlyingArray[i] !== value) {
                    throw Error("Array modified during remove; cannot remove item");
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this.peek();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                value["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this.peek()[index] = newItem;
            this.valueHasMutated();
        }
    },

    'sorted': function (compareFunction) {
        var arrayCopy = this().slice(0);
        return compareFunction ? arrayCopy.sort(compareFunction) : arrayCopy.sort();
    },

    'reversed': function () {
        return this().slice(0).reverse();
    }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observableArray constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
}

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        // The native sort and reverse methods return a reference to the array, but it makes more sense to return the observable array instead.
        return methodCallResult === underlyingArray ? this : methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

ko.isObservableArray = function (instance) {
    return ko.isObservable(instance)
        && typeof instance["remove"] == "function"
        && typeof instance["push"] == "function";
};

ko.exportSymbol('observableArray', ko.observableArray);
ko.exportSymbol('isObservableArray', ko.isObservableArray);
var arrayChangeEventName = 'arrayChange';
ko.extenders['trackArrayChanges'] = function(target, options) {
    // Use the provided options--each call to trackArrayChanges overwrites the previously set options
    target.compareArrayOptions = {};
    if (options && typeof options == "object") {
        ko.utils.extend(target.compareArrayOptions, options);
    }
    target.compareArrayOptions['sparse'] = true;

    // Only modify the target observable once
    if (target.cacheDiffForKnownOperation) {
        return;
    }
    var trackingChanges = false,
        cachedDiff = null,
        changeSubscription,
        spectateSubscription,
        pendingChanges = 0,
        previousContents,
        underlyingBeforeSubscriptionAddFunction = target.beforeSubscriptionAdd,
        underlyingAfterSubscriptionRemoveFunction = target.afterSubscriptionRemove;

    // Watch "subscribe" calls, and for array change events, ensure change tracking is enabled
    target.beforeSubscriptionAdd = function (event) {
        if (underlyingBeforeSubscriptionAddFunction) {
            underlyingBeforeSubscriptionAddFunction.call(target, event);
        }
        if (event === arrayChangeEventName) {
            trackChanges();
        }
    };
    // Watch "dispose" calls, and for array change events, ensure change tracking is disabled when all are disposed
    target.afterSubscriptionRemove = function (event) {
        if (underlyingAfterSubscriptionRemoveFunction) {
            underlyingAfterSubscriptionRemoveFunction.call(target, event);
        }
        if (event === arrayChangeEventName && !target.hasSubscriptionsForEvent(arrayChangeEventName)) {
            if (changeSubscription) {
                changeSubscription.dispose();
            }
            if (spectateSubscription) {
                spectateSubscription.dispose();
            }
            spectateSubscription = changeSubscription = null;
            trackingChanges = false;
            previousContents = undefined;
        }
    };

    function trackChanges() {
        if (trackingChanges) {
            // Whenever there's a new subscription and there are pending notifications, make sure all previous
            // subscriptions are notified of the change so that all subscriptions are in sync.
            notifyChanges();
            return;
        }

        trackingChanges = true;

        // Track how many times the array actually changed value
        spectateSubscription = target.subscribe(function () {
            ++pendingChanges;
        }, null, "spectate");

        // Each time the array changes value, capture a clone so that on the next
        // change it's possible to produce a diff
        previousContents = [].concat(target.peek() || []);
        cachedDiff = null;
        changeSubscription = target.subscribe(notifyChanges);

        function notifyChanges() {
            if (pendingChanges) {
                // Make a copy of the current contents and ensure it's an array
                var currentContents = [].concat(target.peek() || []), changes;

                // Compute the diff and issue notifications, but only if someone is listening
                if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                    changes = getChanges(previousContents, currentContents);
                }

                // Eliminate references to the old, removed items, so they can be GCed
                previousContents = currentContents;
                cachedDiff = null;
                pendingChanges = 0;

                if (changes && changes.length) {
                    target['notifySubscribers'](changes, arrayChangeEventName);
                }
            }
        }
    }

    function getChanges(previousContents, currentContents) {
        // We try to re-use cached diffs.
        // The scenarios where pendingChanges > 1 are when using rate limiting or deferred updates,
        // which without this check would not be compatible with arrayChange notifications. Normally,
        // notifications are issued immediately so we wouldn't be queueing up more than one.
        if (!cachedDiff || pendingChanges > 1) {
            cachedDiff = ko.utils.compareArrays(previousContents, currentContents, target.compareArrayOptions);
        }

        return cachedDiff;
    }

    target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
        // Only run if we're currently tracking changes for this observable array
        // and there aren't any pending deferred notifications.
        if (!trackingChanges || pendingChanges) {
            return;
        }
        var diff = [],
            arrayLength = rawArray.length,
            argsLength = args.length,
            offset = 0;

        function pushDiff(status, value, index) {
            return diff[diff.length] = { 'status': status, 'value': value, 'index': index };
        }
        switch (operationName) {
            case 'push':
                offset = arrayLength;
            case 'unshift':
                for (var index = 0; index < argsLength; index++) {
                    pushDiff('added', args[index], offset + index);
                }
                break;

            case 'pop':
                offset = arrayLength - 1;
            case 'shift':
                if (arrayLength) {
                    pushDiff('deleted', rawArray[offset], offset);
                }
                break;

            case 'splice':
                // Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                    endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                    endAddIndex = startIndex + argsLength - 2,
                    endIndex = Math.max(endDeleteIndex, endAddIndex),
                    additions = [], deletions = [];
                for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                    if (index < endDeleteIndex)
                        deletions.push(pushDiff('deleted', rawArray[index], index));
                    if (index < endAddIndex)
                        additions.push(pushDiff('added', args[argsIndex], index));
                }
                ko.utils.findMovesInArrayComparison(deletions, additions);
                break;

            default:
                return;
        }
        cachedDiff = diff;
    };
};
var computedState = ko.utils.createSymbolOrString('_state');

ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    if (typeof evaluatorFunctionOrOptions === "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = evaluatorFunctionOrOptions;
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (evaluatorFunctionOrOptions) {
            options["read"] = evaluatorFunctionOrOptions;
        }
    }
    if (typeof options["read"] != "function")
        throw Error("Pass a function that returns the value of the ko.computed");

    var writeFunction = options["write"];
    var state = {
        latestValue: undefined,
        isStale: true,
        isDirty: true,
        isBeingEvaluated: false,
        suppressDisposalUntilDisposeWhenReturnsFalse: false,
        isDisposed: false,
        pure: false,
        isSleeping: false,
        readFunction: options["read"],
        evaluatorFunctionTarget: evaluatorFunctionTarget || options["owner"],
        disposeWhenNodeIsRemoved: options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
        disposeWhen: options["disposeWhen"] || options.disposeWhen,
        domNodeDisposalCallback: null,
        dependencyTracking: {},
        dependenciesCount: 0,
        evaluationTimeoutInstance: null
    };

    function computedObservable() {
        if (arguments.length > 0) {
            if (typeof writeFunction === "function") {
                // Writing a value
                writeFunction.apply(state.evaluatorFunctionTarget, arguments);
            } else {
                throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
            }
            return this; // Permits chained assignments
        } else {
            // Reading the value
            if (!state.isDisposed) {
                ko.dependencyDetection.registerDependency(computedObservable);
            }
            if (state.isDirty || (state.isSleeping && computedObservable.haveDependenciesChanged())) {
                computedObservable.evaluateImmediate();
            }
            return state.latestValue;
        }
    }

    computedObservable[computedState] = state;
    computedObservable.hasWriteFunction = typeof writeFunction === "function";

    // Inherit from 'subscribable'
    if (!ko.utils.canSetPrototype) {
        // 'subscribable' won't be on the prototype chain unless we put it there directly
        ko.utils.extend(computedObservable, ko.subscribable['fn']);
    }
    ko.subscribable['fn'].init(computedObservable);

    // Inherit from 'computed'
    ko.utils.setPrototypeOfOrExtend(computedObservable, computedFn);

    if (options['pure']) {
        state.pure = true;
        state.isSleeping = true;     // Starts off sleeping; will awake on the first subscription
        ko.utils.extend(computedObservable, pureComputedOverrides);
    } else if (options['deferEvaluation']) {
        ko.utils.extend(computedObservable, deferEvaluationOverrides);
    }

    if (ko.options['deferUpdates']) {
        ko.extenders['deferred'](computedObservable, true);
    }

    if (DEBUG) {
        // #1731 - Aid debugging by exposing the computed's options
        computedObservable["_options"] = options;
    }

    if (state.disposeWhenNodeIsRemoved) {
        // Since this computed is associated with a DOM node, and we don't want to dispose the computed
        // until the DOM node is *removed* from the document (as opposed to never having been in the document),
        // we'll prevent disposal until "disposeWhen" first returns false.
        state.suppressDisposalUntilDisposeWhenReturnsFalse = true;

        // disposeWhenNodeIsRemoved: true can be used to opt into the "only dispose after first false result"
        // behaviour even if there's no specific node to watch. In that case, clear the option so we don't try
        // to watch for a non-node's disposal. This technique is intended for KO's internal use only and shouldn't
        // be documented or used by application code, as it's likely to change in a future version of KO.
        if (!state.disposeWhenNodeIsRemoved.nodeType) {
            state.disposeWhenNodeIsRemoved = null;
        }
    }

    // Evaluate, unless sleeping or deferEvaluation is true
    if (!state.isSleeping && !options['deferEvaluation']) {
        computedObservable.evaluateImmediate();
    }

    // Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
    // removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
    if (state.disposeWhenNodeIsRemoved && computedObservable.isActive()) {
        ko.utils.domNodeDisposal.addDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback = function () {
            computedObservable.dispose();
        });
    }

    return computedObservable;
};

// Utility function that disposes a given dependencyTracking entry
function computedDisposeDependencyCallback(id, entryToDispose) {
    if (entryToDispose !== null && entryToDispose.dispose) {
        entryToDispose.dispose();
    }
}

// This function gets called each time a dependency is detected while evaluating a computed.
// It's factored out as a shared function to avoid creating unnecessary function instances during evaluation.
function computedBeginDependencyDetectionCallback(subscribable, id) {
    var computedObservable = this.computedObservable,
        state = computedObservable[computedState];
    if (!state.isDisposed) {
        if (this.disposalCount && this.disposalCandidates[id]) {
            // Don't want to dispose this subscription, as it's still being used
            computedObservable.addDependencyTracking(id, subscribable, this.disposalCandidates[id]);
            this.disposalCandidates[id] = null; // No need to actually delete the property - disposalCandidates is a transient object anyway
            --this.disposalCount;
        } else if (!state.dependencyTracking[id]) {
            // Brand new subscription - add it
            computedObservable.addDependencyTracking(id, subscribable, state.isSleeping ? { _target: subscribable } : computedObservable.subscribeToDependency(subscribable));
        }
        // If the observable we've accessed has a pending notification, ensure we get notified of the actual final value (bypass equality checks)
        if (subscribable._notificationIsPending) {
            subscribable._notifyNextChangeIfValueIsDifferent();
        }
    }
}

var computedFn = {
    "equalityComparer": valuesArePrimitiveAndEqual,
    getDependenciesCount: function () {
        return this[computedState].dependenciesCount;
    },
    getDependencies: function () {
        var dependencyTracking = this[computedState].dependencyTracking, dependentObservables = [];

        ko.utils.objectForEach(dependencyTracking, function (id, dependency) {
            dependentObservables[dependency._order] = dependency._target;
        });

        return dependentObservables;
    },
    hasAncestorDependency: function (obs) {
        if (!this[computedState].dependenciesCount) {
            return false;
        }
        var dependencies = this.getDependencies();
        if (ko.utils.arrayIndexOf(dependencies, obs) !== -1) {
            return true;
        }
        return !!ko.utils.arrayFirst(dependencies, function (dep) {
            return dep.hasAncestorDependency && dep.hasAncestorDependency(obs);
        });
    },
    addDependencyTracking: function (id, target, trackingObj) {
        if (this[computedState].pure && target === this) {
            throw Error("A 'pure' computed must not be called recursively");
        }

        this[computedState].dependencyTracking[id] = trackingObj;
        trackingObj._order = this[computedState].dependenciesCount++;
        trackingObj._version = target.getVersion();
    },
    haveDependenciesChanged: function () {
        var id, dependency, dependencyTracking = this[computedState].dependencyTracking;
        for (id in dependencyTracking) {
            if (Object.prototype.hasOwnProperty.call(dependencyTracking, id)) {
                dependency = dependencyTracking[id];
                if ((this._evalDelayed && dependency._target._notificationIsPending) || dependency._target.hasChanged(dependency._version)) {
                    return true;
                }
            }
        }
    },
    markDirty: function () {
        // Process "dirty" events if we can handle delayed notifications
        if (this._evalDelayed && !this[computedState].isBeingEvaluated) {
            this._evalDelayed(false /*isChange*/);
        }
    },
    isActive: function () {
        var state = this[computedState];
        return state.isDirty || state.dependenciesCount > 0;
    },
    respondToChange: function () {
        // Ignore "change" events if we've already scheduled a delayed notification
        if (!this._notificationIsPending) {
            this.evaluatePossiblyAsync();
        } else if (this[computedState].isDirty) {
            this[computedState].isStale = true;
        }
    },
    subscribeToDependency: function (target) {
        if (target._deferUpdates) {
            var dirtySub = target.subscribe(this.markDirty, this, 'dirty'),
                changeSub = target.subscribe(this.respondToChange, this);
            return {
                _target: target,
                dispose: function () {
                    dirtySub.dispose();
                    changeSub.dispose();
                }
            };
        } else {
            return target.subscribe(this.evaluatePossiblyAsync, this);
        }
    },
    evaluatePossiblyAsync: function () {
        var computedObservable = this,
            throttleEvaluationTimeout = computedObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(this[computedState].evaluationTimeoutInstance);
            this[computedState].evaluationTimeoutInstance = ko.utils.setTimeout(function () {
                computedObservable.evaluateImmediate(true /*notifyChange*/);
            }, throttleEvaluationTimeout);
        } else if (computedObservable._evalDelayed) {
            computedObservable._evalDelayed(true /*isChange*/);
        } else {
            computedObservable.evaluateImmediate(true /*notifyChange*/);
        }
    },
    evaluateImmediate: function (notifyChange) {
        var computedObservable = this,
            state = computedObservable[computedState],
            disposeWhen = state.disposeWhen,
            changed = false;

        if (state.isBeingEvaluated) {
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Do not evaluate (and possibly capture new dependencies) if disposed
        if (state.isDisposed) {
            return;
        }

        if (state.disposeWhenNodeIsRemoved && !ko.utils.domNodeIsAttachedToDocument(state.disposeWhenNodeIsRemoved) || disposeWhen && disposeWhen()) {
            // See comment above about suppressDisposalUntilDisposeWhenReturnsFalse
            if (!state.suppressDisposalUntilDisposeWhenReturnsFalse) {
                computedObservable.dispose();
                return;
            }
        } else {
            // It just did return false, so we can stop suppressing now
            state.suppressDisposalUntilDisposeWhenReturnsFalse = false;
        }

        state.isBeingEvaluated = true;
        try {
            changed = this.evaluateImmediate_CallReadWithDependencyDetection(notifyChange);
        } finally {
            state.isBeingEvaluated = false;
        }

        return changed;
    },
    evaluateImmediate_CallReadWithDependencyDetection: function (notifyChange) {
        // This function is really just part of the evaluateImmediate logic. You would never call it from anywhere else.
        // Factoring it out into a separate function means it can be independent of the try/catch block in evaluateImmediate,
        // which contributes to saving about 40% off the CPU overhead of computed evaluation (on V8 at least).

        var computedObservable = this,
            state = computedObservable[computedState],
            changed = false;

        // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
        // Then, during evaluation, we cross off any that are in fact still being used.
        var isInitial = state.pure ? undefined : !state.dependenciesCount,   // If we're evaluating when there are no previous dependencies, it must be the first time
            dependencyDetectionContext = {
                computedObservable: computedObservable,
                disposalCandidates: state.dependencyTracking,
                disposalCount: state.dependenciesCount
            };

        ko.dependencyDetection.begin({
            callbackTarget: dependencyDetectionContext,
            callback: computedBeginDependencyDetectionCallback,
            computed: computedObservable,
            isInitial: isInitial
        });

        state.dependencyTracking = {};
        state.dependenciesCount = 0;

        var newValue = this.evaluateImmediate_CallReadThenEndDependencyDetection(state, dependencyDetectionContext);

        if (!state.dependenciesCount) {
            computedObservable.dispose();
            changed = true; // When evaluation causes a disposal, make sure all dependent computeds get notified so they'll see the new state
        } else {
            changed = computedObservable.isDifferent(state.latestValue, newValue);
        }

        if (changed) {
            if (!state.isSleeping) {
                computedObservable["notifySubscribers"](state.latestValue, "beforeChange");
            } else {
                computedObservable.updateVersion();
            }

            state.latestValue = newValue;
            if (DEBUG) computedObservable._latestValue = newValue;

            computedObservable["notifySubscribers"](state.latestValue, "spectate");

            if (!state.isSleeping && notifyChange) {
                computedObservable["notifySubscribers"](state.latestValue);
            }
            if (computedObservable._recordUpdate) {
                computedObservable._recordUpdate();
            }
        }

        if (isInitial) {
            computedObservable["notifySubscribers"](state.latestValue, "awake");
        }

        return changed;
    },
    evaluateImmediate_CallReadThenEndDependencyDetection: function (state, dependencyDetectionContext) {
        // This function is really part of the evaluateImmediate_CallReadWithDependencyDetection logic.
        // You'd never call it from anywhere else. Factoring it out means that evaluateImmediate_CallReadWithDependencyDetection
        // can be independent of try/finally blocks, which contributes to saving about 40% off the CPU
        // overhead of computed evaluation (on V8 at least).

        try {
            var readFunction = state.readFunction;
            return state.evaluatorFunctionTarget ? readFunction.call(state.evaluatorFunctionTarget) : readFunction();
        } finally {
            ko.dependencyDetection.end();

            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
            if (dependencyDetectionContext.disposalCount && !state.isSleeping) {
                ko.utils.objectForEach(dependencyDetectionContext.disposalCandidates, computedDisposeDependencyCallback);
            }

            state.isStale = state.isDirty = false;
        }
    },
    peek: function (evaluate) {
        // By default, peek won't re-evaluate, except while the computed is sleeping or to get the initial value when "deferEvaluation" is set.
        // Pass in true to evaluate if needed.
        var state = this[computedState];
        if ((state.isDirty && (evaluate || !state.dependenciesCount)) || (state.isSleeping && this.haveDependenciesChanged())) {
            this.evaluateImmediate();
        }
        return state.latestValue;
    },
    limit: function (limitFunction) {
        // Override the limit function with one that delays evaluation as well
        ko.subscribable['fn'].limit.call(this, limitFunction);
        this._evalIfChanged = function () {
            if (!this[computedState].isSleeping) {
                if (this[computedState].isStale) {
                    this.evaluateImmediate();
                } else {
                    this[computedState].isDirty = false;
                }
            }
            return this[computedState].latestValue;
        };
        this._evalDelayed = function (isChange) {
            this._limitBeforeChange(this[computedState].latestValue);

            // Mark as dirty
            this[computedState].isDirty = true;
            if (isChange) {
                this[computedState].isStale = true;
            }

            // Pass the observable to the "limit" code, which will evaluate it when
            // it's time to do the notification.
            this._limitChange(this, !isChange /* isDirty */);
        };
    },
    dispose: function () {
        var state = this[computedState];
        if (!state.isSleeping && state.dependencyTracking) {
            ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                if (dependency.dispose)
                    dependency.dispose();
            });
        }
        if (state.disposeWhenNodeIsRemoved && state.domNodeDisposalCallback) {
            ko.utils.domNodeDisposal.removeDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback);
        }
        state.dependencyTracking = undefined;
        state.dependenciesCount = 0;
        state.isDisposed = true;
        state.isStale = false;
        state.isDirty = false;
        state.isSleeping = false;
        state.disposeWhenNodeIsRemoved = undefined;
        state.disposeWhen = undefined;
        state.readFunction = undefined;
        if (!this.hasWriteFunction) {
            state.evaluatorFunctionTarget = undefined;
        }
    }
};

var pureComputedOverrides = {
    beforeSubscriptionAdd: function (event) {
        // If asleep, wake up the computed by subscribing to any dependencies.
        var computedObservable = this,
            state = computedObservable[computedState];
        if (!state.isDisposed && state.isSleeping && event == 'change') {
            state.isSleeping = false;
            if (state.isStale || computedObservable.haveDependenciesChanged()) {
                state.dependencyTracking = null;
                state.dependenciesCount = 0;
                if (computedObservable.evaluateImmediate()) {
                    computedObservable.updateVersion();
                }
            } else {
                // First put the dependencies in order
                var dependenciesOrder = [];
                ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                    dependenciesOrder[dependency._order] = id;
                });
                // Next, subscribe to each one
                ko.utils.arrayForEach(dependenciesOrder, function (id, order) {
                    var dependency = state.dependencyTracking[id],
                        subscription = computedObservable.subscribeToDependency(dependency._target);
                    subscription._order = order;
                    subscription._version = dependency._version;
                    state.dependencyTracking[id] = subscription;
                });
                // Waking dependencies may have triggered effects
                if (computedObservable.haveDependenciesChanged()) {
                    if (computedObservable.evaluateImmediate()) {
                        computedObservable.updateVersion();
                    }
                }
            }

            if (!state.isDisposed) {     // test since evaluating could trigger disposal
                computedObservable["notifySubscribers"](state.latestValue, "awake");
            }
        }
    },
    afterSubscriptionRemove: function (event) {
        var state = this[computedState];
        if (!state.isDisposed && event == 'change' && !this.hasSubscriptionsForEvent('change')) {
            ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                if (dependency.dispose) {
                    state.dependencyTracking[id] = {
                        _target: dependency._target,
                        _order: dependency._order,
                        _version: dependency._version
                    };
                    dependency.dispose();
                }
            });
            state.isSleeping = true;
            this["notifySubscribers"](undefined, "asleep");
        }
    },
    getVersion: function () {
        // Because a pure computed is not automatically updated while it is sleeping, we can't
        // simply return the version number. Instead, we check if any of the dependencies have
        // changed and conditionally re-evaluate the computed observable.
        var state = this[computedState];
        if (state.isSleeping && (state.isStale || this.haveDependenciesChanged())) {
            this.evaluateImmediate();
        }
        return ko.subscribable['fn'].getVersion.call(this);
    }
};

var deferEvaluationOverrides = {
    beforeSubscriptionAdd: function (event) {
        // This will force a computed with deferEvaluation to evaluate when the first subscription is registered.
        if (event == 'change' || event == 'beforeChange') {
            this.peek();
        }
    }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.computed constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(computedFn, ko.subscribable['fn']);
}

// Set the proto values for ko.computed
var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
computedFn[protoProp] = ko.computed;

ko.isComputed = function (instance) {
    return (typeof instance == 'function' && instance[protoProp] === computedFn[protoProp]);
};

ko.isPureComputed = function (instance) {
    return ko.isComputed(instance) && instance[computedState] && instance[computedState].pure;
};

ko.exportSymbol('computed', ko.computed);
ko.exportSymbol('dependentObservable', ko.computed);    // export ko.dependentObservable for backwards compatibility (1.x)
ko.exportSymbol('isComputed', ko.isComputed);
ko.exportSymbol('isPureComputed', ko.isPureComputed);
ko.exportSymbol('computed.fn', computedFn);
ko.exportProperty(computedFn, 'peek', computedFn.peek);
ko.exportProperty(computedFn, 'dispose', computedFn.dispose);
ko.exportProperty(computedFn, 'isActive', computedFn.isActive);
ko.exportProperty(computedFn, 'getDependenciesCount', computedFn.getDependenciesCount);
ko.exportProperty(computedFn, 'getDependencies', computedFn.getDependencies);

ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
    if (typeof evaluatorFunctionOrOptions === 'function') {
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, {'pure':true});
    } else {
        evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);   // make a copy of the parameter object
        evaluatorFunctionOrOptions['pure'] = true;
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
    }
}
ko.exportSymbol('pureComputed', ko.pureComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathological case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof RegExp)) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject) {
                visitorCallback(propertyName);
            }
        }
    };

    function objectLookup() {
        this.keys = [];
        this.values = [];
    };

    objectLookup.prototype = {
        constructor: objectLookup,
        save: function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            if (existingIndex >= 0)
                this.values[existingIndex] = value;
            else {
                this.keys.push(key);
                this.values.push(value);
            }
        },
        get: function(key) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
        }
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
ko.when = function(predicate, callback, context) {
    function kowhen (resolve) {
        var observable = ko.pureComputed(predicate, context).extend({notify:'always'});
        var subscription = observable.subscribe(function(value) {
            if (value) {
                subscription.dispose();
                resolve(value);
            }
        });
        // In case the initial value is true, process it right away
        observable['notifySubscribers'](observable.peek());

        return subscription;
    }
    if (typeof Promise === "function" && !callback) {
        return new Promise(kowhen);
    } else {
        return kowhen(callback.bind(context));
    }
};

ko.exportSymbol('when', ko.when);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7
                        ? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
                        : element.value;
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value, allowUnset) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (typeof value === "string") {
                        ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                        if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                            delete element[hasDomDataExpandoProperty];
                        }
                        element.value = value;
                    }
                    else {
                        // Store arbitrary object using DomData
                        ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                        element[hasDomDataExpandoProperty] = true;

                        // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                        element.value = typeof value === "number" ? value : "";
                    }
                    break;
                case 'select':
                    if (value === "" || value === null)       // A blank string or null value will select the caption
                        value = undefined;
                    var selection = -1;
                    for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                        optionValue = ko.selectExtensions.readValue(element.options[i]);
                        // Include special check to handle selecting a caption with a blank string value
                        if (optionValue == value || (optionValue === "" && value === undefined)) {
                            selection = i;
                            break;
                        }
                    }
                    if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
                        element.selectedIndex = selection;
                        if (ko.utils.ieVersion === 6) {
                            // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                            // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                            // to apply the value as well.
                            ko.utils.setTimeout(function () {
                                element.selectedIndex = selection;
                            }, 0);
                        }
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
    var javaScriptReservedWords = ["true", "false", "null", "undefined"];

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
    var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

    function getWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
            return false;
        var match = expression.match(javaScriptAssignmentTarget);
        return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
    }

    // The following regular expressions will be used to split an object-literal string into tokens

    var specials = ',"\'`{}()/:[\\]',    // These characters have special meaning to the parser and must not appear in the middle of a token, except as part of a string.
        // Create the actual regular expression by or-ing the following regex strings. The order is important.
        bindingToken = RegExp([
            // These match strings, either with double quotes, single quotes, or backticks
            '"(?:\\\\.|[^"])*"',
            "'(?:\\\\.|[^'])*'",
            "`(?:\\\\.|[^`])*`",
            // Match C style comments
            "/\\*(?:[^*]|\\*+[^*/])*\\*+/",
            // Match C++ style comments
            "//.*\n",
            // Match a regular expression (text enclosed by slashes), but will also match sets of divisions
            // as a regular expression (this is handled by the parsing loop below).
            '/(?:\\\\.|[^/])+/\w*',
            // Match text (at least two characters) that does not contain any of the above special characters,
            // although some of the special characters are allowed to start it (all but the colon and comma).
            // The text can contain spaces, but leading or trailing spaces are skipped.
            '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
            // Match any non-space character not matched already. This will match colons and commas, since they're
            // not matched by "everyThingElse", but will also match any other single character that wasn't already
            // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
            '[^\\s]'
        ].join('|'), 'g'),

        // Match end of previous token to determine whether a slash is a division or regex.
        divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
        keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

    function parseObjectLiteral(objectLiteralString) {
        // Trim leading and trailing spaces from the string
        var str = ko.utils.stringTrim(objectLiteralString);

        // Trim braces '{' surrounding the whole object literal
        if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

        // Add a newline to correctly match a C++ style comment at the end of the string and
        // add a comma so that we don't need a separate code block to deal with the last item
        str += "\n,";

        // Split into tokens
        var result = [], toks = str.match(bindingToken), key, values = [], depth = 0;

        if (toks.length > 1) {
            for (var i = 0, tok; tok = toks[i]; ++i) {
                var c = tok.charCodeAt(0);
                // A comma signals the end of a key/value pair if depth is zero
                if (c === 44) { // ","
                    if (depth <= 0) {
                        result.push((key && values.length) ? {key: key, value: values.join('')} : {'unknown': key || values.join('')});
                        key = depth = 0;
                        values = [];
                        continue;
                    }
                // Simply skip the colon that separates the name and value
                } else if (c === 58) { // ":"
                    if (!depth && !key && values.length === 1) {
                        key = values.pop();
                        continue;
                    }
                // Comments: skip them
                } else if (c === 47 && tok.length > 1 && (tok.charCodeAt(1) === 47 || tok.charCodeAt(1) === 42)) {  // "//" or "/*"
                    continue;
                // A set of slashes is initially matched as a regular expression, but could be division
                } else if (c === 47 && i && tok.length > 1) {  // "/"
                    // Look at the end of the previous token to determine if the slash is actually division
                    var match = toks[i-1].match(divisionLookBehind);
                    if (match && !keywordRegexLookBehind[match[0]]) {
                        // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                        str = str.substr(str.indexOf(tok) + 1);
                        toks = str.match(bindingToken);
                        i = -1;
                        // Continue with just the slash
                        tok = '/';
                    }
                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                    ++depth;
                } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                    --depth;
                // The key will be the first token; if it's a string, trim the quotes
                } else if (!key && !values.length && (c === 34 || c === 39)) { // '"', "'"
                    tok = tok.slice(1, -1);
                }
                values.push(tok);
            }
            if (depth > 0) {
                throw Error("Unbalanced parentheses, braces, or brackets");
            }
        }
        return result;
    }

    // Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
    var twoWayBindings = {};

    function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
        bindingOptions = bindingOptions || {};

        function processKeyValue(key, val) {
            var writableVal;
            function callPreprocessHook(obj) {
                return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
            }
            if (!bindingParams) {
                if (!callPreprocessHook(ko['getBindingHandler'](key)))
                    return;

                if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                    // For two-way bindings, provide a write method in case the value
                    // isn't a writable observable.
                    var writeKey = typeof twoWayBindings[key] == 'string' ? twoWayBindings[key] : key;
                    propertyAccessorResultStrings.push("'" + writeKey + "':function(_z){" + writableVal + "=_z}");
                }
            }
            // Values are wrapped in a function so that each value can be accessed independently
            if (makeValueAccessors) {
                val = 'function(){return ' + val + ' }';
            }
            resultStrings.push("'" + key + "':" + val);
        }

        var resultStrings = [],
            propertyAccessorResultStrings = [],
            makeValueAccessors = bindingOptions['valueAccessors'],
            bindingParams = bindingOptions['bindingParams'],
            keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
                parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

        ko.utils.arrayForEach(keyValueArray, function(keyValue) {
            processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
        });

        if (propertyAccessorResultStrings.length)
            processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");

        return resultStrings.join(",");
    }

    return {
        bindingRewriteValidators: [],

        twoWayBindings: twoWayBindings,

        parseObjectLiteral: parseObjectLiteral,

        preProcessBindings: preProcessBindings,

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (keyValueArray[i]['key'] == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindings:         An object with a get method to retrieve bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
            if (!property || !ko.isObservable(property)) {
                var propWriters = allBindings.get('_ko_property_writers');
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function isUnmatchedEndComment(node) {
        return isEndComment(node) && !(ko.utils.domData.get(node, matchedEndCommentDataKey));
    }

    var matchedEndCommentDataKey = "__ko_matchedEndComment__"

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                ko.utils.domData.set(currentNode, matchedEndCommentDataKey, true);
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            var insertBeforeNode;

            if (isStartComment(containerNode)) {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                insertBeforeNode = containerNode.nextSibling;
                containerNode = containerNode.parentNode;
            } else {
                insertBeforeNode = containerNode.firstChild;
            }

            if (!insertBeforeNode) {
                containerNode.appendChild(nodeToPrepend);
            } else if (nodeToPrepend !== insertBeforeNode) {       // IE will sometimes crash if you try to insert a node before itself
                containerNode.insertBefore(nodeToPrepend, insertBeforeNode);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!insertAfterNode) {
                ko.virtualElements.prepend(containerNode, nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                var insertBeforeNode = insertAfterNode.nextSibling;

                if (isStartComment(containerNode)) {
                    containerNode = containerNode.parentNode;
                }

                if (!insertBeforeNode) {
                    containerNode.appendChild(nodeToInsert);
                } else if (nodeToInsert !== insertBeforeNode) {       // IE will sometimes crash if you try to insert a node before itself
                    containerNode.insertBefore(nodeToInsert, insertBeforeNode);
                }
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node)) {
                if (node.firstChild && isEndComment(node.firstChild)) {
                    throw new Error("Found invalid end comment, as the first child of " + node);
                }
                return node.firstChild;
            } else if (!node.nextSibling || isEndComment(node.nextSibling)) {
                return null;
            } else {
                return node.nextSibling;
            }
        },

        nextSibling: function(node) {
            if (isStartComment(node)) {
                node = getMatchingEndComment(node);
            }

            if (node.nextSibling && isEndComment(node.nextSibling)) {
                if (isUnmatchedEndComment(node.nextSibling)) {
                    throw Error("Found end comment without a matching opening comment, as child of " + node);
                } else {
                    return null;
                }
            } else {
                return node.nextSibling;
            }
        },

        hasBindingValue: isStartComment,

        virtualNodeBindingValue: function(node) {
            var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: // Element
                    return node.getAttribute(defaultBindingAttributeName) != null
                        || ko.components['getComponentNameForNode'](node);
                case 8: // Comment node
                    return ko.virtualElements.hasBindingValue(node);
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ false);
        },

        'getBindingAccessors': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ true);
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext, node, options) {
            try {
                var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                return bindingFunction(bindingContext, node);
            } catch (ex) {
                ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                throw ex;
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
        var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
    }

    function createBindingsStringEvaluator(bindingsString, options) {
        // Build the source for a function that evaluates "expression"
        // For each scope variable, add an extra level of "with" nesting
        // Example result: with(sc1) { with(sc0) { return (expression) } }
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
            functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
        return new Function("$context", "$element", functionBody);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    // Hide or don't minify context properties, see https://github.com/knockout/knockout/issues/2294
    var contextSubscribable = ko.utils.createSymbolOrString('_subscribable');
    var contextAncestorBindingInfo = ko.utils.createSymbolOrString('_ancestorBindingInfo');
    var contextDataDependency = ko.utils.createSymbolOrString('_dataDependency');

    ko.bindingHandlers = {};

    // The following element types will not be recursed into during binding.
    var bindingDoesNotRecurseIntoElementTypes = {
        // Don't want bindings that operate on text nodes to mutate <script> and <textarea> contents,
        // because it's unexpected and a potential XSS issue.
        // Also bindings should not operate on <template> elements since this breaks in Internet Explorer
        // and because such elements' contents are always intended to be bound in a different context
        // from where they appear in the document.
        'script': true,
        'textarea': true,
        'template': true
    };

    // Use an overridable method for retrieving binding handlers so that plugins may support dynamically created handlers
    ko['getBindingHandler'] = function(bindingKey) {
        return ko.bindingHandlers[bindingKey];
    };

    var inheritParentVm = {};

    // The ko.bindingContext constructor is only called directly to create the root context. For child
    // contexts, use bindingContext.createChildContext or bindingContext.extend.
    ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback, options) {

        // The binding context object includes static properties for the current, parent, and root view models.
        // If a view model is actually stored in an observable, the corresponding binding context object, and
        // any child contexts, must be updated when the view model is changed.
        function updateContext() {
            // Most of the time, the context will directly get a view model object, but if a function is given,
            // we call the function to retrieve the view model. If the function accesses any observables or returns
            // an observable, the dependency is tracked, and those observables can later cause the binding
            // context to be updated.
            var dataItemOrObservable = isFunc ? realDataItemOrAccessor() : realDataItemOrAccessor,
                dataItem = ko.utils.unwrapObservable(dataItemOrObservable);

            if (parentContext) {
                // Copy $root and any custom properties from the parent context
                ko.utils.extend(self, parentContext);

                // Copy Symbol properties
                if (contextAncestorBindingInfo in parentContext) {
                    self[contextAncestorBindingInfo] = parentContext[contextAncestorBindingInfo];
                }
            } else {
                self['$parents'] = [];
                self['$root'] = dataItem;

                // Export 'ko' in the binding context so it will be available in bindings and templates
                // even if 'ko' isn't exported as a global, such as when using an AMD loader.
                // See https://github.com/SteveSanderson/knockout/issues/490
                self['ko'] = ko;
            }

            self[contextSubscribable] = subscribable;

            if (shouldInheritData) {
                dataItem = self['$data'];
            } else {
                self['$rawData'] = dataItemOrObservable;
                self['$data'] = dataItem;
            }

            if (dataItemAlias)
                self[dataItemAlias] = dataItem;

            // The extendCallback function is provided when creating a child context or extending a context.
            // It handles the specific actions needed to finish setting up the binding context. Actions in this
            // function could also add dependencies to this binding context.
            if (extendCallback)
                extendCallback(self, parentContext, dataItem);

            // When a "parent" context is given and we don't already have a dependency on its context, register a dependency on it.
            // Thus whenever the parent context is updated, this context will also be updated.
            if (parentContext && parentContext[contextSubscribable] && !ko.computedContext.computed().hasAncestorDependency(parentContext[contextSubscribable])) {
                parentContext[contextSubscribable]();
            }

            if (dataDependency) {
                self[contextDataDependency] = dataDependency;
            }

            return self['$data'];
        }

        var self = this,
            shouldInheritData = dataItemOrAccessor === inheritParentVm,
            realDataItemOrAccessor = shouldInheritData ? undefined : dataItemOrAccessor,
            isFunc = typeof(realDataItemOrAccessor) == "function" && !ko.isObservable(realDataItemOrAccessor),
            nodes,
            subscribable,
            dataDependency = options && options['dataDependency'];

        if (options && options['exportDependencies']) {
            // The "exportDependencies" option means that the calling code will track any dependencies and re-create
            // the binding context when they change.
            updateContext();
        } else {
            subscribable = ko.pureComputed(updateContext);
            subscribable.peek();

            // At this point, the binding context has been initialized, and the "subscribable" computed observable is
            // subscribed to any observables that were accessed in the process. If there is nothing to track, the
            // computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
            // the context object.
            if (subscribable.isActive()) {
                // Always notify because even if the model ($data) hasn't changed, other context properties might have changed
                subscribable['equalityComparer'] = null;
            } else {
                self[contextSubscribable] = undefined;
            }
        }
    }

    // Extend the binding context hierarchy with a new view model object. If the parent context is watching
    // any observables, the new child context will automatically get a dependency on the parent context.
    // But this does not mean that the $data value of the child context will also get updated. If the child
    // view model also depends on the parent view model, you must provide a function that returns the correct
    // view model on each update.
    ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback, options) {
        if (!options && dataItemAlias && typeof dataItemAlias == "object") {
            options = dataItemAlias;
            dataItemAlias = options['as'];
            extendCallback = options['extend'];
        }

        if (dataItemAlias && options && options['noChildContext']) {
            var isFunc = typeof(dataItemOrAccessor) == "function" && !ko.isObservable(dataItemOrAccessor);
            return new ko.bindingContext(inheritParentVm, this, null, function (self) {
                if (extendCallback)
                    extendCallback(self);
                self[dataItemAlias] = isFunc ? dataItemOrAccessor() : dataItemOrAccessor;
            }, options);
        }

        return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function (self, parentContext) {
            // Extend the context hierarchy by setting the appropriate pointers
            self['$parentContext'] = parentContext;
            self['$parent'] = parentContext['$data'];
            self['$parents'] = (parentContext['$parents'] || []).slice(0);
            self['$parents'].unshift(self['$parent']);
            if (extendCallback)
                extendCallback(self);
        }, options);
    };

    // Extend the binding context with new custom properties. This doesn't change the context hierarchy.
    // Similarly to "child" contexts, provide a function here to make sure that the correct values are set
    // when an observable view model is updated.
    ko.bindingContext.prototype['extend'] = function(properties, options) {
        return new ko.bindingContext(inheritParentVm, this, null, function(self, parentContext) {
            ko.utils.extend(self, typeof(properties) == "function" ? properties(self) : properties);
        }, options);
    };

    var boundElementDomDataKey = ko.utils.domData.nextKey();

    function asyncContextDispose(node) {
        var bindingInfo = ko.utils.domData.get(node, boundElementDomDataKey),
            asyncContext = bindingInfo && bindingInfo.asyncContext;
        if (asyncContext) {
            bindingInfo.asyncContext = null;
            asyncContext.notifyAncestor();
        }
    }
    function AsyncCompleteContext(node, bindingInfo, ancestorBindingInfo) {
        this.node = node;
        this.bindingInfo = bindingInfo;
        this.asyncDescendants = [];
        this.childrenComplete = false;

        if (!bindingInfo.asyncContext) {
            ko.utils.domNodeDisposal.addDisposeCallback(node, asyncContextDispose);
        }

        if (ancestorBindingInfo && ancestorBindingInfo.asyncContext) {
            ancestorBindingInfo.asyncContext.asyncDescendants.push(node);
            this.ancestorBindingInfo = ancestorBindingInfo;
        }
    }
    AsyncCompleteContext.prototype.notifyAncestor = function () {
        if (this.ancestorBindingInfo && this.ancestorBindingInfo.asyncContext) {
            this.ancestorBindingInfo.asyncContext.descendantComplete(this.node);
        }
    };
    AsyncCompleteContext.prototype.descendantComplete = function (node) {
        ko.utils.arrayRemoveItem(this.asyncDescendants, node);
        if (!this.asyncDescendants.length && this.childrenComplete) {
            this.completeChildren();
        }
    };
    AsyncCompleteContext.prototype.completeChildren = function () {
        this.childrenComplete = true;
        if (this.bindingInfo.asyncContext && !this.asyncDescendants.length) {
            this.bindingInfo.asyncContext = null;
            ko.utils.domNodeDisposal.removeDisposeCallback(this.node, asyncContextDispose);
            ko.bindingEvent.notify(this.node, ko.bindingEvent.descendantsComplete);
            this.notifyAncestor();
        }
    };

    ko.bindingEvent = {
        childrenComplete: "childrenComplete",
        descendantsComplete : "descendantsComplete",

        subscribe: function (node, event, callback, context, options) {
            var bindingInfo = ko.utils.domData.getOrSet(node, boundElementDomDataKey, {});
            if (!bindingInfo.eventSubscribable) {
                bindingInfo.eventSubscribable = new ko.subscribable;
            }
            if (options && options['notifyImmediately'] && bindingInfo.notifiedEvents[event]) {
                ko.dependencyDetection.ignore(callback, context, [node]);
            }
            return bindingInfo.eventSubscribable.subscribe(callback, context, event);
        },

        notify: function (node, event) {
            var bindingInfo = ko.utils.domData.get(node, boundElementDomDataKey);
            if (bindingInfo) {
                bindingInfo.notifiedEvents[event] = true;
                if (bindingInfo.eventSubscribable) {
                    bindingInfo.eventSubscribable['notifySubscribers'](node, event);
                }
                if (event == ko.bindingEvent.childrenComplete) {
                    if (bindingInfo.asyncContext) {
                        bindingInfo.asyncContext.completeChildren();
                    } else if (bindingInfo.asyncContext === undefined && bindingInfo.eventSubscribable && bindingInfo.eventSubscribable.hasSubscriptionsForEvent(ko.bindingEvent.descendantsComplete)) {
                        // It's currently an error to register a descendantsComplete handler for a node that was never registered as completing asynchronously.
                        // That's because without the asyncContext, we don't have a way to know that all descendants have completed.
                        throw new Error("descendantsComplete event not supported for bindings on this node");
                    }
                }
            }
        },

        startPossiblyAsyncContentBinding: function (node, bindingContext) {
            var bindingInfo = ko.utils.domData.getOrSet(node, boundElementDomDataKey, {});

            if (!bindingInfo.asyncContext) {
                bindingInfo.asyncContext = new AsyncCompleteContext(node, bindingInfo, bindingContext[contextAncestorBindingInfo]);
            }

            // If the provided context was already extended with this node's binding info, just return the extended context
            if (bindingContext[contextAncestorBindingInfo] == bindingInfo) {
                return bindingContext;
            }

            return bindingContext['extend'](function (ctx) {
                ctx[contextAncestorBindingInfo] = bindingInfo;
            });
        }
    };

    // Returns the valueAccessor function for a binding value
    function makeValueAccessor(value) {
        return function() {
            return value;
        };
    }

    // Returns the value of a valueAccessor function
    function evaluateValueAccessor(valueAccessor) {
        return valueAccessor();
    }

    // Given a function that returns bindings, create and return a new object that contains
    // binding value-accessors functions. Each accessor function calls the original function
    // so that it always gets the latest value and all dependencies are captured. This is used
    // by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
    function makeAccessorsFromFunction(callback) {
        return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
            return function() {
                return callback()[key];
            };
        });
    }

    // Given a bindings function or object, create and return a new object that contains
    // binding value-accessors functions. This is used by ko.applyBindingsToNode.
    function makeBindingAccessors(bindings, context, node) {
        if (typeof bindings === 'function') {
            return makeAccessorsFromFunction(bindings.bind(null, context, node));
        } else {
            return ko.utils.objectMap(bindings, makeValueAccessor);
        }
    }

    // This function is used if the binding provider doesn't include a getBindingAccessors function.
    // It must be called with 'this' set to the provider instance.
    function getBindingsAndMakeAccessors(node, context) {
        return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
    }

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal(bindingContext, elementOrVirtualElement) {
        var nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);

        if (nextInQueue) {
            var currentChild,
                provider = ko.bindingProvider['instance'],
                preprocessNode = provider['preprocessNode'];

            // Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
            // possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
            // implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
            // trigger insertion of <template> contents at that point in the document.
            if (preprocessNode) {
                while (currentChild = nextInQueue) {
                    nextInQueue = ko.virtualElements.nextSibling(currentChild);
                    preprocessNode.call(provider, currentChild);
                }
                // Reset nextInQueue for the next loop
                nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
            }

            while (currentChild = nextInQueue) {
                // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
                nextInQueue = ko.virtualElements.nextSibling(currentChild);
                applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild);
            }
        }
        ko.bindingEvent.notify(elementOrVirtualElement, ko.bindingEvent.childrenComplete);
    }

    function applyBindingsToNodeAndDescendantsInternal(bindingContext, nodeVerified) {
        var bindingContextForDescendants = bindingContext;

        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding info for the node (all element nodes)
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var shouldApplyBindings = isElement || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);
        if (shouldApplyBindings)
            bindingContextForDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext)['bindingContextForDescendants'];

        if (bindingContextForDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
            applyBindingsToDescendantsInternal(bindingContextForDescendants, nodeVerified);
        }
    }

    function topologicalSortBindings(bindings) {
        // Depth-first sort
        var result = [],                // The list of key/handler pairs that we will return
            bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
            cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
        ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
            if (!bindingsConsidered[bindingKey]) {
                var binding = ko['getBindingHandler'](bindingKey);
                if (binding) {
                    // First add dependencies (if any) of the current binding
                    if (binding['after']) {
                        cyclicDependencyStack.push(bindingKey);
                        ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
                            if (bindings[bindingDependencyKey]) {
                                if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                                    throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                                } else {
                                    pushBinding(bindingDependencyKey);
                                }
                            }
                        });
                        cyclicDependencyStack.length--;
                    }
                    // Next add the current binding
                    result.push({ key: bindingKey, handler: binding });
                }
                bindingsConsidered[bindingKey] = true;
            }
        });

        return result;
    }

    function applyBindingsToNodeInternal(node, sourceBindings, bindingContext) {
        var bindingInfo = ko.utils.domData.getOrSet(node, boundElementDomDataKey, {});

        // Prevent multiple applyBindings calls for the same node, except when a binding value is specified
        var alreadyBound = bindingInfo.alreadyBound;
        if (!sourceBindings) {
            if (alreadyBound) {
                throw Error("You cannot apply bindings multiple times to the same element.");
            }
            bindingInfo.alreadyBound = true;
        }
        if (!alreadyBound) {
            bindingInfo.context = bindingContext;
        }
        if (!bindingInfo.notifiedEvents) {
            bindingInfo.notifiedEvents = {};
        }

        // Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
        var bindings;
        if (sourceBindings && typeof sourceBindings !== 'function') {
            bindings = sourceBindings;
        } else {
            var provider = ko.bindingProvider['instance'],
                getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

            // Get the binding from the provider within a computed observable so that we can update the bindings whenever
            // the binding context is updated or if the binding provider accesses observables.
            var bindingsUpdater = ko.dependentObservable(
                function() {
                    bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                    // Register a dependency on the binding context to support observable view models.
                    if (bindings) {
                        if (bindingContext[contextSubscribable]) {
                            bindingContext[contextSubscribable]();
                        }
                        if (bindingContext[contextDataDependency]) {
                            bindingContext[contextDataDependency]();
                        }
                    }
                    return bindings;
                },
                null, { disposeWhenNodeIsRemoved: node }
            );

            if (!bindings || !bindingsUpdater.isActive())
                bindingsUpdater = null;
        }

        var contextToExtend = bindingContext;
        var bindingHandlerThatControlsDescendantBindings;
        if (bindings) {
            // Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
            // context update), just return the value accessor from the binding. Otherwise, return a function that always gets
            // the latest binding value and registers a dependency on the binding updater.
            var getValueAccessor = bindingsUpdater
                ? function(bindingKey) {
                    return function() {
                        return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                    };
                } : function(bindingKey) {
                    return bindings[bindingKey];
                };

            // Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
            function allBindings() {
                return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
            }
            // The following is the 3.x allBindings API
            allBindings['get'] = function(key) {
                return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
            };
            allBindings['has'] = function(key) {
                return key in bindings;
            };

            if (ko.bindingEvent.childrenComplete in bindings) {
                ko.bindingEvent.subscribe(node, ko.bindingEvent.childrenComplete, function () {
                    var callback = evaluateValueAccessor(bindings[ko.bindingEvent.childrenComplete]);
                    if (callback) {
                        var nodes = ko.virtualElements.childNodes(node);
                        if (nodes.length) {
                            callback(nodes, ko.dataFor(nodes[0]));
                        }
                    }
                });
            }

            if (ko.bindingEvent.descendantsComplete in bindings) {
                contextToExtend = ko.bindingEvent.startPossiblyAsyncContentBinding(node, bindingContext);
                ko.bindingEvent.subscribe(node, ko.bindingEvent.descendantsComplete, function () {
                    var callback = evaluateValueAccessor(bindings[ko.bindingEvent.descendantsComplete]);
                    if (callback && ko.virtualElements.firstChild(node)) {
                        callback(node);
                    }
                });
            }

            // First put the bindings into the right order
            var orderedBindings = topologicalSortBindings(bindings);

            // Go through the sorted bindings, calling init and update for each
            ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
                // Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
                // so bindingKeyAndHandler.handler will always be nonnull.
                var handlerInitFn = bindingKeyAndHandler.handler["init"],
                    handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                    bindingKey = bindingKeyAndHandler.key;

                if (node.nodeType === 8) {
                    validateThatBindingIsAllowedForVirtualElements(bindingKey);
                }

                try {
                    // Run init, ignoring any dependencies
                    if (typeof handlerInitFn == "function") {
                        ko.dependencyDetection.ignore(function() {
                            var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, contextToExtend['$data'], contextToExtend);

                            // If this binding handler claims to control descendant bindings, make a note of this
                            if (initResult && initResult['controlsDescendantBindings']) {
                                if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                    throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                bindingHandlerThatControlsDescendantBindings = bindingKey;
                            }
                        });
                    }

                    // Run update in its own computed wrapper
                    if (typeof handlerUpdateFn == "function") {
                        ko.dependentObservable(
                            function() {
                                handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, contextToExtend['$data'], contextToExtend);
                            },
                            null,
                            { disposeWhenNodeIsRemoved: node }
                        );
                    }
                } catch (ex) {
                    ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                    throw ex;
                }
            });
        }

        var shouldBindDescendants = bindingHandlerThatControlsDescendantBindings === undefined;
        return {
            'shouldBindDescendants': shouldBindDescendants,
            'bindingContextForDescendants': shouldBindDescendants && contextToExtend
        };
    };

    ko.storedBindingContextForNode = function (node) {
        var bindingInfo = ko.utils.domData.get(node, boundElementDomDataKey);
        return bindingInfo && bindingInfo.context;
    }

    function getBindingContext(viewModelOrBindingContext, extendContextCallback) {
        return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
            ? viewModelOrBindingContext
            : new ko.bindingContext(viewModelOrBindingContext, undefined, undefined, extendContextCallback);
    }

    ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext));
    };

    ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
        var context = getBindingContext(viewModelOrBindingContext);
        return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
    };

    ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode);
    };

    ko.applyBindings = function (viewModelOrBindingContext, rootNode, extendContextCallback) {
        // If jQuery is loaded after Knockout, we won't initially have access to it. So save it here.
        if (!jQueryInstance && window['jQuery']) {
            jQueryInstance = window['jQuery'];
        }

        if (arguments.length < 2) {
            rootNode = document.body;
            if (!rootNode) {
                throw Error("ko.applyBindings: could not find document.body; has the document been loaded?");
            }
        } else if (!rootNode || (rootNode.nodeType !== 1 && rootNode.nodeType !== 8)) {
            throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        }

        applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext, extendContextCallback), rootNode);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        if (node && (node.nodeType === 1 || node.nodeType === 8)) {
            return ko.storedBindingContextForNode(node);
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('bindingEvent', ko.bindingEvent);
    ko.exportSymbol('bindingEvent.subscribe', ko.bindingEvent.subscribe);
    ko.exportSymbol('bindingEvent.startPossiblyAsyncContentBinding', ko.bindingEvent.startPossiblyAsyncContentBinding);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
(function(undefined) {
    var loadingSubscribablesCache = {}, // Tracks component loads that are currently in flight
        loadedDefinitionsCache = {};    // Tracks component loads that have already completed

    ko.components = {
        get: function(componentName, callback) {
            var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
            if (cachedDefinition) {
                // It's already loaded and cached. Reuse the same definition object.
                // Note that for API consistency, even cache hits complete asynchronously by default.
                // You can bypass this by putting synchronous:true on your component config.
                if (cachedDefinition.isSynchronousComponent) {
                    ko.dependencyDetection.ignore(function() { // See comment in loaderRegistryBehaviors.js for reasoning
                        callback(cachedDefinition.definition);
                    });
                } else {
                    ko.tasks.schedule(function() { callback(cachedDefinition.definition); });
                }
            } else {
                // Join the loading process that is already underway, or start a new one.
                loadComponentAndNotify(componentName, callback);
            }
        },

        clearCachedDefinition: function(componentName) {
            delete loadedDefinitionsCache[componentName];
        },

        _getFirstResultFromLoaders: getFirstResultFromLoaders
    };

    function getObjectOwnProperty(obj, propName) {
        return Object.prototype.hasOwnProperty.call(obj, propName) ? obj[propName] : undefined;
    }

    function loadComponentAndNotify(componentName, callback) {
        var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
            completedAsync;
        if (!subscribable) {
            // It's not started loading yet. Start loading, and when it's done, move it to loadedDefinitionsCache.
            subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
            subscribable.subscribe(callback);

            beginLoadingComponent(componentName, function(definition, config) {
                var isSynchronousComponent = !!(config && config['synchronous']);
                loadedDefinitionsCache[componentName] = { definition: definition, isSynchronousComponent: isSynchronousComponent };
                delete loadingSubscribablesCache[componentName];

                // For API consistency, all loads complete asynchronously. However we want to avoid
                // adding an extra task schedule if it's unnecessary (i.e., the completion is already
                // async).
                //
                // You can bypass the 'always asynchronous' feature by putting the synchronous:true
                // flag on your component configuration when you register it.
                if (completedAsync || isSynchronousComponent) {
                    // Note that notifySubscribers ignores any dependencies read within the callback.
                    // See comment in loaderRegistryBehaviors.js for reasoning
                    subscribable['notifySubscribers'](definition);
                } else {
                    ko.tasks.schedule(function() {
                        subscribable['notifySubscribers'](definition);
                    });
                }
            });
            completedAsync = true;
        } else {
            subscribable.subscribe(callback);
        }
    }

    function beginLoadingComponent(componentName, callback) {
        getFirstResultFromLoaders('getConfig', [componentName], function(config) {
            if (config) {
                // We have a config, so now load its definition
                getFirstResultFromLoaders('loadComponent', [componentName, config], function(definition) {
                    callback(definition, config);
                });
            } else {
                // The component has no config - it's unknown to all the loaders.
                // Note that this is not an error (e.g., a module loading error) - that would abort the
                // process and this callback would not run. For this callback to run, all loaders must
                // have confirmed they don't know about this component.
                callback(null, null);
            }
        });
    }

    function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
        // On the first call in the stack, start with the full set of loaders
        if (!candidateLoaders) {
            candidateLoaders = ko.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
        }

        // Try the next candidate
        var currentCandidateLoader = candidateLoaders.shift();
        if (currentCandidateLoader) {
            var methodInstance = currentCandidateLoader[methodName];
            if (methodInstance) {
                var wasAborted = false,
                    synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
                        if (wasAborted) {
                            callback(null);
                        } else if (result !== null) {
                            // This candidate returned a value. Use it.
                            callback(result);
                        } else {
                            // Try the next candidate
                            getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                        }
                    }));

                // Currently, loaders may not return anything synchronously. This leaves open the possibility
                // that we'll extend the API to support synchronous return values in the future. It won't be
                // a breaking change, because currently no loader is allowed to return anything except undefined.
                if (synchronousReturnValue !== undefined) {
                    wasAborted = true;

                    // Method to suppress exceptions will remain undocumented. This is only to keep
                    // KO's specs running tidily, since we can observe the loading got aborted without
                    // having exceptions cluttering up the console too.
                    if (!currentCandidateLoader['suppressLoaderExceptions']) {
                        throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                    }
                }
            } else {
                // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
                getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
            }
        } else {
            // No candidates returned a value
            callback(null);
        }
    }

    // Reference the loaders via string name so it's possible for developers
    // to replace the whole array by assigning to ko.components.loaders
    ko.components['loaders'] = [];

    ko.exportSymbol('components', ko.components);
    ko.exportSymbol('components.get', ko.components.get);
    ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
})();
(function(undefined) {

    // The default loader is responsible for two things:
    // 1. Maintaining the default in-memory registry of component configuration objects
    //    (i.e., the thing you're writing to when you call ko.components.register(someName, ...))
    // 2. Answering requests for components by fetching configuration objects
    //    from that default in-memory registry and resolving them into standard
    //    component definition objects (of the form { createViewModel: ..., template: ... })
    // Custom loaders may override either of these facilities, i.e.,
    // 1. To supply configuration objects from some other source (e.g., conventions)
    // 2. Or, to resolve configuration objects by loading viewmodels/templates via arbitrary logic.

    var defaultConfigRegistry = {};

    ko.components.register = function(componentName, config) {
        if (!config) {
            throw new Error('Invalid configuration for ' + componentName);
        }

        if (ko.components.isRegistered(componentName)) {
            throw new Error('Component ' + componentName + ' is already registered');
        }

        defaultConfigRegistry[componentName] = config;
    };

    ko.components.isRegistered = function(componentName) {
        return Object.prototype.hasOwnProperty.call(defaultConfigRegistry, componentName);
    };

    ko.components.unregister = function(componentName) {
        delete defaultConfigRegistry[componentName];
        ko.components.clearCachedDefinition(componentName);
    };

    ko.components.defaultLoader = {
        'getConfig': function(componentName, callback) {
            var result = ko.components.isRegistered(componentName)
                ? defaultConfigRegistry[componentName]
                : null;
            callback(result);
        },

        'loadComponent': function(componentName, config, callback) {
            var errorCallback = makeErrorCallback(componentName);
            possiblyGetConfigFromAmd(errorCallback, config, function(loadedConfig) {
                resolveConfig(componentName, errorCallback, loadedConfig, callback);
            });
        },

        'loadTemplate': function(componentName, templateConfig, callback) {
            resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
        },

        'loadViewModel': function(componentName, viewModelConfig, callback) {
            resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
        }
    };

    var createViewModelKey = 'createViewModel';

    // Takes a config object of the form { template: ..., viewModel: ... }, and asynchronously convert it
    // into the standard component definition format:
    //    { template: <ArrayOfDomNodes>, createViewModel: function(params, componentInfo) { ... } }.
    // Since both template and viewModel may need to be resolved asynchronously, both tasks are performed
    // in parallel, and the results joined when both are ready. We don't depend on any promises infrastructure,
    // so this is implemented manually below.
    function resolveConfig(componentName, errorCallback, config, callback) {
        var result = {},
            makeCallBackWhenZero = 2,
            tryIssueCallback = function() {
                if (--makeCallBackWhenZero === 0) {
                    callback(result);
                }
            },
            templateConfig = config['template'],
            viewModelConfig = config['viewModel'];

        if (templateConfig) {
            possiblyGetConfigFromAmd(errorCallback, templateConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
                    result['template'] = resolvedTemplate;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }

        if (viewModelConfig) {
            possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
                    result[createViewModelKey] = resolvedViewModel;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }
    }

    function resolveTemplate(errorCallback, templateConfig, callback) {
        if (typeof templateConfig === 'string') {
            // Markup - parse it
            callback(ko.utils.parseHtmlFragment(templateConfig));
        } else if (templateConfig instanceof Array) {
            // Assume already an array of DOM nodes - pass through unchanged
            callback(templateConfig);
        } else if (isDocumentFragment(templateConfig)) {
            // Document fragment - use its child nodes
            callback(ko.utils.makeArray(templateConfig.childNodes));
        } else if (templateConfig['element']) {
            var element = templateConfig['element'];
            if (isDomElement(element)) {
                // Element instance - copy its child nodes
                callback(cloneNodesFromTemplateSourceElement(element));
            } else if (typeof element === 'string') {
                // Element ID - find it, then copy its child nodes
                var elemInstance = document.getElementById(element);
                if (elemInstance) {
                    callback(cloneNodesFromTemplateSourceElement(elemInstance));
                } else {
                    errorCallback('Cannot find element with ID ' + element);
                }
            } else {
                errorCallback('Unknown element type: ' + element);
            }
        } else {
            errorCallback('Unknown template value: ' + templateConfig);
        }
    }

    function resolveViewModel(errorCallback, viewModelConfig, callback) {
        if (typeof viewModelConfig === 'function') {
            // Constructor - convert to standard factory function format
            // By design, this does *not* supply componentInfo to the constructor, as the intent is that
            // componentInfo contains non-viewmodel data (e.g., the component's element) that should only
            // be used in factory functions, not viewmodel constructors.
            callback(function (params /*, componentInfo */) {
                return new viewModelConfig(params);
            });
        } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
            // Already a factory function - use it as-is
            callback(viewModelConfig[createViewModelKey]);
        } else if ('instance' in viewModelConfig) {
            // Fixed object instance - promote to createViewModel format for API consistency
            var fixedInstance = viewModelConfig['instance'];
            callback(function (params, componentInfo) {
                return fixedInstance;
            });
        } else if ('viewModel' in viewModelConfig) {
            // Resolved AMD module whose value is of the form { viewModel: ... }
            resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
        } else {
            errorCallback('Unknown viewModel value: ' + viewModelConfig);
        }
    }

    function cloneNodesFromTemplateSourceElement(elemInstance) {
        switch (ko.utils.tagNameLower(elemInstance)) {
            case 'script':
                return ko.utils.parseHtmlFragment(elemInstance.text);
            case 'textarea':
                return ko.utils.parseHtmlFragment(elemInstance.value);
            case 'template':
                // For browsers with proper <template> element support (i.e., where the .content property
                // gives a document fragment), use that document fragment.
                if (isDocumentFragment(elemInstance.content)) {
                    return ko.utils.cloneNodes(elemInstance.content.childNodes);
                }
        }

        // Regular elements such as <div>, and <template> elements on old browsers that don't really
        // understand <template> and just treat it as a regular container
        return ko.utils.cloneNodes(elemInstance.childNodes);
    }

    function isDomElement(obj) {
        if (window['HTMLElement']) {
            return obj instanceof HTMLElement;
        } else {
            return obj && obj.tagName && obj.nodeType === 1;
        }
    }

    function isDocumentFragment(obj) {
        if (window['DocumentFragment']) {
            return obj instanceof DocumentFragment;
        } else {
            return obj && obj.nodeType === 11;
        }
    }

    function possiblyGetConfigFromAmd(errorCallback, config, callback) {
        if (typeof config['require'] === 'string') {
            // The config is the value of an AMD module
            if (amdRequire || window['require']) {
                (amdRequire || window['require'])([config['require']], function (module) {
                    if (module && typeof module === 'object' && module.__esModule && module.default) {
                        module = module.default;
                    }
                    callback(module);
                });
            } else {
                errorCallback('Uses require, but no AMD loader is present');
            }
        } else {
            callback(config);
        }
    }

    function makeErrorCallback(componentName) {
        return function (message) {
            throw new Error('Component \'' + componentName + '\': ' + message);
        };
    }

    ko.exportSymbol('components.register', ko.components.register);
    ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
    ko.exportSymbol('components.unregister', ko.components.unregister);

    // Expose the default loader so that developers can directly ask it for configuration
    // or to resolve configuration
    ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);

    // By default, the default loader is the only registered component loader
    ko.components['loaders'].push(ko.components.defaultLoader);

    // Privately expose the underlying config registry for use in old-IE shim
    ko.components._allRegisteredComponents = defaultConfigRegistry;
})();
(function (undefined) {
    // Overridable API for determining which component name applies to a given node. By overriding this,
    // you can for example map specific tagNames to components that are not preregistered.
    ko.components['getComponentNameForNode'] = function(node) {
        var tagNameLower = ko.utils.tagNameLower(node);
        if (ko.components.isRegistered(tagNameLower)) {
            // Try to determine that this node can be considered a *custom* element; see https://github.com/knockout/knockout/issues/1603
            if (tagNameLower.indexOf('-') != -1 || ('' + node) == "[object HTMLUnknownElement]" || (ko.utils.ieVersion <= 8 && node.tagName === tagNameLower)) {
                return tagNameLower;
            }
        }
    };

    ko.components.addBindingsForCustomElement = function(allBindings, node, bindingContext, valueAccessors) {
        // Determine if it's really a custom element matching a component
        if (node.nodeType === 1) {
            var componentName = ko.components['getComponentNameForNode'](node);
            if (componentName) {
                // It does represent a component, so add a component binding for it
                allBindings = allBindings || {};

                if (allBindings['component']) {
                    // Avoid silently overwriting some other 'component' binding that may already be on the element
                    throw new Error('Cannot use the "component" binding on a custom element matching a component');
                }

                var componentBindingValue = { 'name': componentName, 'params': getComponentParamsFromCustomElement(node, bindingContext) };

                allBindings['component'] = valueAccessors
                    ? function() { return componentBindingValue; }
                    : componentBindingValue;
            }
        }

        return allBindings;
    }

    var nativeBindingProviderInstance = new ko.bindingProvider();

    function getComponentParamsFromCustomElement(elem, bindingContext) {
        var paramsAttribute = elem.getAttribute('params');

        if (paramsAttribute) {
            var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true }),
                rawParamComputedValues = ko.utils.objectMap(params, function(paramValue, paramName) {
                    return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                }),
                result = ko.utils.objectMap(rawParamComputedValues, function(paramValueComputed, paramName) {
                    var paramValue = paramValueComputed.peek();
                    // Does the evaluation of the parameter value unwrap any observables?
                    if (!paramValueComputed.isActive()) {
                        // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
                        // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
                        return paramValue;
                    } else {
                        // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
                        // level of observability, and any inner (resulting model value) level of observability.
                        // This means the component doesn't have to worry about multiple unwrapping. If the value is a
                        // writable observable, the computed will also be writable and pass the value on to the observable.
                        return ko.computed({
                            'read': function() {
                                return ko.utils.unwrapObservable(paramValueComputed());
                            },
                            'write': ko.isWriteableObservable(paramValue) && function(value) {
                                paramValueComputed()(value);
                            },
                            disposeWhenNodeIsRemoved: elem
                        });
                    }
                });

            // Give access to the raw computeds, as long as that wouldn't overwrite any custom param also called '$raw'
            // This is in case the developer wants to react to outer (binding) observability separately from inner
            // (model value) observability, or in case the model value observable has subobservables.
            if (!Object.prototype.hasOwnProperty.call(result, '$raw')) {
                result['$raw'] = rawParamComputedValues;
            }

            return result;
        } else {
            // For consistency, absence of a "params" attribute is treated the same as the presence of
            // any empty one. Otherwise component viewmodels need special code to check whether or not
            // 'params' or 'params.$raw' is null/undefined before reading subproperties, which is annoying.
            return { '$raw': {} };
        }
    }

    // --------------------------------------------------------------------------------
    // Compatibility code for older (pre-HTML5) IE browsers

    if (ko.utils.ieVersion < 9) {
        // Whenever you preregister a component, enable it as a custom element in the current document
        ko.components['register'] = (function(originalFunction) {
            return function(componentName) {
                document.createElement(componentName); // Allows IE<9 to parse markup containing the custom element
                return originalFunction.apply(this, arguments);
            }
        })(ko.components['register']);

        // Whenever you create a document fragment, enable all preregistered component names as custom elements
        // This is needed to make innerShiv/jQuery HTML parsing correctly handle the custom elements
        document.createDocumentFragment = (function(originalFunction) {
            return function() {
                var newDocFrag = originalFunction(),
                    allComponents = ko.components._allRegisteredComponents;
                for (var componentName in allComponents) {
                    if (Object.prototype.hasOwnProperty.call(allComponents, componentName)) {
                        newDocFrag.createElement(componentName);
                    }
                }
                return newDocFrag;
            };
        })(document.createDocumentFragment);
    }
})();(function(undefined) {
    var componentLoadingOperationUniqueId = 0;

    ko.bindingHandlers['component'] = {
        'init': function(element, valueAccessor, ignored1, ignored2, bindingContext) {
            var currentViewModel,
                currentLoadingOperationId,
                afterRenderSub,
                disposeAssociatedComponentViewModel = function () {
                    var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                    if (typeof currentViewModelDispose === 'function') {
                        currentViewModelDispose.call(currentViewModel);
                    }
                    if (afterRenderSub) {
                        afterRenderSub.dispose();
                    }
                    afterRenderSub = null;
                    currentViewModel = null;
                    // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                    currentLoadingOperationId = null;
                },
                originalChildNodes = ko.utils.makeArray(ko.virtualElements.childNodes(element));

            ko.virtualElements.emptyNode(element);
            ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

            ko.computed(function () {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    componentName, componentParams;

                if (typeof value === 'string') {
                    componentName = value;
                } else {
                    componentName = ko.utils.unwrapObservable(value['name']);
                    componentParams = ko.utils.unwrapObservable(value['params']);
                }

                if (!componentName) {
                    throw new Error('No component name specified');
                }

                var asyncContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);

                var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                ko.components.get(componentName, function(componentDefinition) {
                    // If this is not the current load operation for this element, ignore it.
                    if (currentLoadingOperationId !== loadingOperationId) {
                        return;
                    }

                    // Clean up previous state
                    disposeAssociatedComponentViewModel();

                    // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                    if (!componentDefinition) {
                        throw new Error('Unknown component \'' + componentName + '\'');
                    }
                    cloneTemplateIntoElement(componentName, componentDefinition, element);

                    var componentInfo = {
                        'element': element,
                        'templateNodes': originalChildNodes
                    };

                    var componentViewModel = createViewModel(componentDefinition, componentParams, componentInfo),
                        childBindingContext = asyncContext['createChildContext'](componentViewModel, {
                            'extend': function(ctx) {
                                ctx['$component'] = componentViewModel;
                                ctx['$componentTemplateNodes'] = originalChildNodes;
                            }
                        });

                    if (componentViewModel && componentViewModel['koDescendantsComplete']) {
                        afterRenderSub = ko.bindingEvent.subscribe(element, ko.bindingEvent.descendantsComplete, componentViewModel['koDescendantsComplete'], componentViewModel);
                    }

                    currentViewModel = componentViewModel;
                    ko.applyBindingsToDescendants(childBindingContext, element);
                });
            }, null, { disposeWhenNodeIsRemoved: element });

            return { 'controlsDescendantBindings': true };
        }
    };

    ko.virtualElements.allowedBindings['component'] = true;

    function cloneTemplateIntoElement(componentName, componentDefinition, element) {
        var template = componentDefinition['template'];
        if (!template) {
            throw new Error('Component \'' + componentName + '\' has no template');
        }

        var clonedNodesArray = ko.utils.cloneNodes(template);
        ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    }

    function createViewModel(componentDefinition, componentParams, componentInfo) {
        var componentViewModelFactory = componentDefinition['createViewModel'];
        return componentViewModelFactory
            ? componentViewModelFactory.call(componentDefinition, componentParams, componentInfo)
            : componentParams; // Template-only component
    }

})();
var attrHtmlToJavaScriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        ko.utils.objectForEach(value, function(attrName, attrValue) {
            attrValue = ko.utils.unwrapObservable(attrValue);

            // Find the namespace of this attribute, if any.
            var prefixLen = attrName.indexOf(':');
            var namespace = "lookupNamespaceURI" in element && prefixLen > 0 && element.lookupNamespaceURI(attrName.substr(0, prefixLen));

            // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
            // when someProp is a "no value"-like value (strictly null, false, or undefined)
            // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
            var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
            if (toRemove) {
                namespace ? element.removeAttributeNS(namespace, attrName) : element.removeAttribute(attrName);
            } else {
                attrValue = attrValue.toString();
            }

            // In IE <= 7 and IE8 Quirks Mode, you have to use the JavaScript property name instead of the
            // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
            // but instead of figuring out the mode, we'll just set the attribute through the JavaScript
            // property for IE <= 8.
            if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavaScriptMap) {
                attrName = attrHtmlToJavaScriptMap[attrName];
                if (toRemove)
                    element.removeAttribute(attrName);
                else
                    element[attrName] = attrValue;
            } else if (!toRemove) {
                namespace ? element.setAttributeNS(namespace, attrName, attrValue) : element.setAttribute(attrName, attrValue);
            }

            // Treat "name" specially - although you can think of it as an attribute, it also needs
            // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
            // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
            // entirely, and there's no strong reason to allow for such casing in HTML.
            if (attrName === "name") {
                ko.utils.setElementName(element, toRemove ? "" : attrValue);
            }
        });
    }
};
(function() {

ko.bindingHandlers['checked'] = {
    'after': ['value', 'attr'],
    'init': function (element, valueAccessor, allBindings) {
        var checkedValue = ko.pureComputed(function() {
            // Treat "value" like "checkedValue" when it is included with "checked" binding
            if (allBindings['has']('checkedValue')) {
                return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
            } else if (useElementValue) {
                if (allBindings['has']('value')) {
                    return ko.utils.unwrapObservable(allBindings.get('value'));
                } else {
                    return element.value;
                }
            }
        });

        function updateModel() {
            // This updates the model value from the view value.
            // It runs in response to DOM events (click) and changes in checkedValue.
            var isChecked = element.checked,
                elemValue = checkedValue();

            // When we're first setting up this computed, don't change any model state.
            if (ko.computedContext.isInitial()) {
                return;
            }

            // We can ignore unchecked radio buttons, because some other radio
            // button will be checked, and that one can take care of updating state.
            // Also ignore value changes to an already unchecked checkbox.
            if (!isChecked && (isRadio || ko.computedContext.getDependenciesCount())) {
                return;
            }

            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
            if (valueIsArray) {
                var writableValue = rawValueIsNonArrayObservable ? modelValue.peek() : modelValue,
                    saveOldValue = oldElemValue;
                oldElemValue = elemValue;

                if (saveOldValue !== elemValue) {
                    // When we're responding to the checkedValue changing, and the element is
                    // currently checked, replace the old elem value with the new elem value
                    // in the model array.
                    if (isChecked) {
                        ko.utils.addOrRemoveItem(writableValue, elemValue, true);
                        ko.utils.addOrRemoveItem(writableValue, saveOldValue, false);
                    }
                } else {
                    // When we're responding to the user having checked/unchecked a checkbox,
                    // add/remove the element value to the model array.
                    ko.utils.addOrRemoveItem(writableValue, elemValue, isChecked);
                }

                if (rawValueIsNonArrayObservable && ko.isWriteableObservable(modelValue)) {
                    modelValue(writableValue);
                }
            } else {
                if (isCheckbox) {
                    if (elemValue === undefined) {
                        elemValue = isChecked;
                    } else if (!isChecked) {
                        elemValue = undefined;
                    }
                }
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
            }
        };

        function updateView() {
            // This updates the view value from the model value.
            // It runs in response to changes in the bound (checked) value.
            var modelValue = ko.utils.unwrapObservable(valueAccessor()),
                elemValue = checkedValue();

            if (valueIsArray) {
                // When a checkbox is bound to an array, being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(modelValue, elemValue) >= 0;
                oldElemValue = elemValue;
            } else if (isCheckbox && elemValue === undefined) {
                // When a checkbox is bound to any other value (not an array) and "checkedValue" is not defined,
                // being checked represents the value being trueish
                element.checked = !!modelValue;
            } else {
                // Otherwise, being checked means that the checkbox or radio button's value corresponds to the model value
                element.checked = (checkedValue() === modelValue);
            }
        };

        var isCheckbox = element.type == "checkbox",
            isRadio = element.type == "radio";

        // Only bind to check boxes and radio buttons
        if (!isCheckbox && !isRadio) {
            return;
        }

        var rawValue = valueAccessor(),
            valueIsArray = isCheckbox && (ko.utils.unwrapObservable(rawValue) instanceof Array),
            rawValueIsNonArrayObservable = !(valueIsArray && rawValue.push && rawValue.splice),
            useElementValue = isRadio || valueIsArray,
            oldElemValue = valueIsArray ? checkedValue() : undefined;

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if (isRadio && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });

        // Set up two computeds to update the binding:

        // The first responds to changes in the checkedValue value and to element clicks
        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
        ko.utils.registerEventHandler(element, "click", updateModel);

        // The second responds to changes in the model value (the one associated with the checked binding)
        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });

        rawValue = undefined;
    }
};
ko.expressionRewriting.twoWayBindings['checked'] = true;

ko.bindingHandlers['checkedValue'] = {
    'update': function (element, valueAccessor) {
        element.value = ko.utils.unwrapObservable(valueAccessor());
    }
};

})();var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['class'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.stringTrim(ko.utils.unwrapObservable(valueAccessor()));
        ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
        element[classesWrittenByBindingKey] = value;
        ko.utils.toggleDomNodeCssClass(element, value, true);
    }
};

ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value !== null && typeof value == "object") {
            ko.utils.objectForEach(value, function(className, shouldHaveClass) {
                shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            });
        } else {
            ko.bindingHandlers['class']['update'](element, valueAccessor);
        }
    }
};
ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
function makeEventHandlerShortcut(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
        }
    }
}

ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var eventsToHandle = valueAccessor() || {};
        ko.utils.objectForEach(eventsToHandle, function(eventName) {
            if (typeof eventName == "string") {
                ko.utils.registerEventHandler(element, eventName, function (event) {
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[eventName];
                    if (!handlerFunction)
                        return;

                    try {
                        // Take all the event args, and prefix with the viewmodel
                        var argsForHandler = ko.utils.makeArray(arguments);
                        viewModel = bindingContext['$data'];
                        argsForHandler.unshift(viewModel);
                        handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                    } finally {
                        if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        }
                    }

                    var bubble = allBindings.get(eventName + 'Bubble') !== false;
                    if (!bubble) {
                        event.cancelBubble = true;
                        if (event.stopPropagation)
                            event.stopPropagation();
                    }
                });
            }
        });
    }
};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'noChildContext': unwrappedValue['noChildContext'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    }
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
var hasfocusLastValue = '__ko_hasfocusLastValue';
ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindings) {
        var handleElementFocusChange = function(isFocused) {
            // Where possible, ignore which event was raised and determine focus state using activeElement,
            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
            // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
            // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
            // from calling 'blur()' on the element when it loses focus.
            // Discussion at https://github.com/SteveSanderson/knockout/pull/352
            element[hasfocusUpdatingProperty] = true;
            var ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                var active;
                try {
                    active = ownerDoc.activeElement;
                } catch(e) {
                    // IE9 throws if you access activeElement during page load (see issue #703)
                    active = ownerDoc.body;
                }
                isFocused = (active === element);
            }
            var modelValue = valueAccessor();
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

            //cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
            element[hasfocusLastValue] = isFocused;
            element[hasfocusUpdatingProperty] = false;
        };
        var handleElementFocusIn = handleElementFocusChange.bind(null, true);
        var handleElementFocusOut = handleElementFocusChange.bind(null, false);

        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE

        // Assume element is not focused (prevents "blur" being called initially)
        element[hasfocusLastValue] = false;
    },
    'update': function(element, valueAccessor) {
        var value = !!ko.utils.unwrapObservable(valueAccessor());

        if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
            value ? element.focus() : element.blur();

            // In IE, the blur method doesn't always cause the element to lose focus (for example, if the window is not in focus).
            // Setting focus to the body element does seem to be reliable in IE, but should only be used if we know that the current
            // element was focused already.
            if (!value && element[hasfocusLastValue]) {
                element.ownerDocument.body.focus();
            }

            // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
            ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]);
        }
    }
};
ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
ko.expressionRewriting.twoWayBindings['hasFocus'] = 'hasfocus';
ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        // setHtml will unwrap the value if needed
        ko.utils.setHtml(element, valueAccessor());
    }
};
(function () {

// Makes a binding like with or if
function makeWithIfBinding(bindingKey, isWith, isNot) {
    ko.bindingHandlers[bindingKey] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var didDisplayOnLastUpdate, savedNodes, contextOptions = {}, completeOnRender, needAsyncContext, renderOnEveryChange;

            if (isWith) {
                var as = allBindings.get('as'), noChildContext = allBindings.get('noChildContext');
                renderOnEveryChange = !(as && noChildContext);
                contextOptions = { 'as': as, 'noChildContext': noChildContext, 'exportDependencies': renderOnEveryChange };
            }

            completeOnRender = allBindings.get("completeOn") == "render";
            needAsyncContext = completeOnRender || allBindings['has'](ko.bindingEvent.descendantsComplete);

            ko.computed(function() {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    shouldDisplay = !isNot !== !value, // equivalent to isNot ? !value : !!value,
                    isInitial = !savedNodes,
                    childContext;

                if (!renderOnEveryChange && shouldDisplay === didDisplayOnLastUpdate) {
                    return;
                }

                if (needAsyncContext) {
                    bindingContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);
                }

                if (shouldDisplay) {
                    if (!isWith || renderOnEveryChange) {
                        contextOptions['dataDependency'] = ko.computedContext.computed();
                    }

                    if (isWith) {
                        childContext = bindingContext['createChildContext'](typeof value == "function" ? value : valueAccessor, contextOptions);
                    } else if (ko.computedContext.getDependenciesCount()) {
                        childContext = bindingContext['extend'](null, contextOptions);
                    } else {
                        childContext = bindingContext;
                    }
                }

                // Save a copy of the inner nodes on the initial update, but only if we have dependencies.
                if (isInitial && ko.computedContext.getDependenciesCount()) {
                    savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                }

                if (shouldDisplay) {
                    if (!isInitial) {
                        ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                    }

                    ko.applyBindingsToDescendants(childContext, element);
                } else {
                    ko.virtualElements.emptyNode(element);

                    if (!completeOnRender) {
                        ko.bindingEvent.notify(element, ko.bindingEvent.childrenComplete);
                    }
                }

                didDisplayOnLastUpdate = shouldDisplay;

            }, null, { disposeWhenNodeIsRemoved: element });

            return { 'controlsDescendantBindings': true };
        }
    };
    ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings[bindingKey] = true;
}

// Construct the actual binding handlers
makeWithIfBinding('if');
makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
makeWithIfBinding('with', true /* isWith */);

})();ko.bindingHandlers['let'] = {
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // Make a modified binding context, with extra properties, and apply it to descendant elements
        var innerContext = bindingContext['extend'](valueAccessor);
        ko.applyBindingsToDescendants(innerContext, element);

        return { 'controlsDescendantBindings': true };
    }
};
ko.virtualElements.allowedBindings['let'] = true;
var captionPlaceholder = {};
ko.bindingHandlers['options'] = {
    'init': function(element) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        // Remove all existing <option>s.
        while (element.length > 0) {
            element.remove(0);
        }

        // Ensures that the binding processor doesn't try to bind the options
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor, allBindings) {
        function selectedOptions() {
            return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
        }

        var selectWasPreviouslyEmpty = element.length == 0,
            multiple = element.multiple,
            previousScrollTop = (!selectWasPreviouslyEmpty && multiple) ? element.scrollTop : null,
            unwrappedArray = ko.utils.unwrapObservable(valueAccessor()),
            valueAllowUnset = allBindings.get('valueAllowUnset') && allBindings['has']('value'),
            includeDestroyed = allBindings.get('optionsIncludeDestroyed'),
            arrayToDomNodeChildrenOptions = {},
            captionValue,
            filteredArray,
            previousSelectedValues = [];

        if (!valueAllowUnset) {
            if (multiple) {
                previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
            } else if (element.selectedIndex >= 0) {
                previousSelectedValues.push(ko.selectExtensions.readValue(element.options[element.selectedIndex]));
            }
        }

        if (unwrappedArray) {
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // If caption is included, add it to the array
            if (allBindings['has']('optionsCaption')) {
                captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                // If caption value is null or undefined, don't show a caption
                if (captionValue !== null && captionValue !== undefined) {
                    filteredArray.unshift(captionPlaceholder);
                }
            }
        } else {
            // If a falsy value is provided (e.g. null), we'll simply empty the select element
        }

        function applyToObject(object, predicate, defaultValue) {
            var predicateType = typeof predicate;
            if (predicateType == "function")    // Given a function; run it against the data value
                return predicate(object);
            else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                return object[predicate];
            else                                // Given no optionsText arg; use the data value itself
                return defaultValue;
        }

        // The following functions can run at two different times:
        // The first is when the whole array is being updated directly from this binding handler.
        // The second is when an observable value for a specific array entry is updated.
        // oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
        var itemUpdate = false;
        function optionForArrayItem(arrayEntry, index, oldOptions) {
            if (oldOptions.length) {
                previousSelectedValues = !valueAllowUnset && oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
                itemUpdate = true;
            }
            var option = element.ownerDocument.createElement("option");
            if (arrayEntry === captionPlaceholder) {
                ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                ko.selectExtensions.writeValue(option, undefined);
            } else {
                // Apply a value to the option element
                var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                // Apply some text to the option element
                var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                ko.utils.setTextContent(option, optionText);
            }
            return [option];
        }

        // By using a beforeRemove callback, we delay the removal until after new items are added. This fixes a selection
        // problem in IE<=8 and Firefox. See https://github.com/knockout/knockout/issues/1208
        arrayToDomNodeChildrenOptions['beforeRemove'] =
            function (option) {
                element.removeChild(option);
            };

        function setSelectionCallback(arrayEntry, newOptions) {
            if (itemUpdate && valueAllowUnset) {
                // The model value is authoritative, so make sure its value is the one selected
                ko.bindingEvent.notify(element, ko.bindingEvent.childrenComplete);
            } else if (previousSelectedValues.length) {
                // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
                // That's why we first added them without selection. Now it's time to set the selection.
                var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

                // If this option was changed from being selected during a single-item update, notify the change
                if (itemUpdate && !isSelected) {
                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                }
            }
        }

        var callback = setSelectionCallback;
        if (allBindings['has']('optionsAfterRender') && typeof allBindings.get('optionsAfterRender') == "function") {
            callback = function(arrayEntry, newOptions) {
                setSelectionCallback(arrayEntry, newOptions);
                ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
            }
        }

        ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);

        if (!valueAllowUnset) {
            // Determine if the selection has changed as a result of updating the options list
            var selectionChanged;
            if (multiple) {
                // For a multiple-select box, compare the new selection count to the previous one
                // But if nothing was selected before, the selection can't have changed
                selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
            } else {
                // For a single-select box, compare the current value to the previous value
                // But if nothing was selected before or nothing is selected now, just look for a change in selection
                selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
                    ? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
                    : (previousSelectedValues.length || element.selectedIndex >= 0);
            }

            // Ensure consistency between model value and selected option.
            // If the dropdown was changed so that selection is no longer the same,
            // notify the value or selectedOptions binding.
            if (selectionChanged) {
                ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
            }
        }

        if (valueAllowUnset || ko.computedContext.isInitial()) {
            ko.bindingEvent.notify(element, ko.bindingEvent.childrenComplete);
        }

        // Workaround for IE bug
        ko.utils.ensureSelectElementIsRenderedCorrectly(element);

        if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
            element.scrollTop = previousScrollTop;
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
ko.bindingHandlers['selectedOptions'] = {
    'init': function (element, valueAccessor, allBindings) {
        function updateFromView() {
            var value = valueAccessor(), valueToWrite = [];
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                if (node.selected)
                    valueToWrite.push(ko.selectExtensions.readValue(node));
            });
            ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
        }

        function updateFromModel() {
            var newValue = ko.utils.unwrapObservable(valueAccessor()),
                previousScrollTop = element.scrollTop;

            if (newValue && typeof newValue.length == "number") {
                ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                    var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                    if (node.selected != isSelected) {      // This check prevents flashing of the select element in IE
                        ko.utils.setOptionNodeSelectionState(node, isSelected);
                    }
                });
            }

            element.scrollTop = previousScrollTop;
        }

        if (ko.utils.tagNameLower(element) != "select") {
            throw new Error("selectedOptions binding applies only to SELECT elements");
        }

        var updateFromModelComputed;
        ko.bindingEvent.subscribe(element, ko.bindingEvent.childrenComplete, function () {
            if (!updateFromModelComputed) {
                ko.utils.registerEventHandler(element, "change", updateFromView);
                updateFromModelComputed = ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
            } else {
                updateFromView();
            }
        }, null, { 'notifyImmediately': true });
    },
    'update': function() {} // Keep for backwards compatibility with code that may have wrapped binding
};
ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        ko.utils.objectForEach(value, function(styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            if (jQueryInstance) {
                jQueryInstance(element)['css'](styleName, styleValue);
            } else if (/^--/.test(styleName)) {
                // Is styleName a custom CSS property?
                element.style.setProperty(styleName, styleValue);
            } else {
                styleName = styleName.replace(/-(\w)/g, function (all, letter) {
                    return letter.toUpperCase();
                });

                var previousStyle = element.style[styleName];
                element.style[styleName] = styleValue;

                if (styleValue !== previousStyle && element.style[styleName] == previousStyle && !isNaN(styleValue)) {
                    element.style[styleName] = styleValue + "px";
                }
            }
        });
    }
};
ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(bindingContext['$data'], element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};
ko.bindingHandlers['text'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
        // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};
ko.virtualElements.allowedBindings['text'] = true;
(function () {

if (window && window.navigator) {
    var parseVersion = function (matches) {
        if (matches) {
            return parseFloat(matches[1]);
        }
    };

    // Detect various browser versions because some old versions don't fully support the 'input' event
    var userAgent = window.navigator.userAgent,
        operaVersion, chromeVersion, safariVersion, firefoxVersion, ieVersion, edgeVersion;

    (operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()))
        || (edgeVersion = parseVersion(userAgent.match(/Edge\/([^ ]+)$/)))
        || (chromeVersion = parseVersion(userAgent.match(/Chrome\/([^ ]+)/)))
        || (safariVersion = parseVersion(userAgent.match(/Version\/([^ ]+) Safari/)))
        || (firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]+)/)))
        || (ieVersion = ko.utils.ieVersion || parseVersion(userAgent.match(/MSIE ([^ ]+)/)))      // Detects up to IE 10
        || (ieVersion = parseVersion(userAgent.match(/rv:([^ )]+)/)));      // Detects IE 11
}

// IE 8 and 9 have bugs that prevent the normal events from firing when the value changes.
// But it does fire the 'selectionchange' event on many of those, presumably because the
// cursor is moving and that counts as the selection changing. The 'selectionchange' event is
// fired at the document level only and doesn't directly indicate which element changed. We
// set up just one event handler for the document and use 'activeElement' to determine which
// element was changed.
if (ieVersion >= 8 && ieVersion < 10) {
    var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
        selectionChangeHandlerName = ko.utils.domData.nextKey();
    var selectionChangeHandler = function(event) {
        var target = this.activeElement,
            handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
        if (handler) {
            handler(event);
        }
    };
    var registerForSelectionChangeEvent = function (element, handler) {
        var ownerDoc = element.ownerDocument;
        if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
            ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
            ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
        }
        ko.utils.domData.set(element, selectionChangeHandlerName, handler);
    };
}

ko.bindingHandlers['textInput'] = {
    'init': function (element, valueAccessor, allBindings) {

        var previousElementValue = element.value,
            timeoutHandle,
            elementValueBeforeEvent;

        var updateModel = function (event) {
            clearTimeout(timeoutHandle);
            elementValueBeforeEvent = timeoutHandle = undefined;

            var elementValue = element.value;
            if (previousElementValue !== elementValue) {
                // Provide a way for tests to know exactly which event was processed
                if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                previousElementValue = elementValue;
                ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
            }
        };

        var deferUpdateModel = function (event) {
            if (!timeoutHandle) {
                // The elementValueBeforeEvent variable is set *only* during the brief gap between an
                // event firing and the updateModel function running. This allows us to ignore model
                // updates that are from the previous state of the element, usually due to techniques
                // such as rateLimit. Such updates, if not ignored, can cause keystrokes to be lost.
                elementValueBeforeEvent = element.value;
                var handler = DEBUG ? updateModel.bind(element, {type: event.type}) : updateModel;
                timeoutHandle = ko.utils.setTimeout(handler, 4);
            }
        };

        // IE9 will mess up the DOM if you handle events synchronously which results in DOM changes (such as other bindings);
        // so we'll make sure all updates are asynchronous
        var ieUpdateModel = ko.utils.ieVersion == 9 ? deferUpdateModel : updateModel,
            ourUpdate = false;

        var updateView = function () {
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (modelValue === null || modelValue === undefined) {
                modelValue = '';
            }

            if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                ko.utils.setTimeout(updateView, 4);
                return;
            }

            // Update the element only if the element and model are different. On some browsers, updating the value
            // will move the cursor to the end of the input, which would be bad while the user is typing.
            if (element.value !== modelValue) {
                ourUpdate = true;  // Make sure we ignore events (propertychange) that result from updating the value
                element.value = modelValue;
                ourUpdate = false;
                previousElementValue = element.value; // In case the browser changes the value (see #2281)
            }
        };

        var onEvent = function (event, handler) {
            ko.utils.registerEventHandler(element, event, handler);
        };

        if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
            // Provide a way for tests to specify exactly which events are bound
            ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function(eventName) {
                if (eventName.slice(0,5) == 'after') {
                    onEvent(eventName.slice(5), deferUpdateModel);
                } else {
                    onEvent(eventName, updateModel);
                }
            });
        } else {
            if (ieVersion) {
                // All versions (including 11) of Internet Explorer have a bug that they don't generate an input or propertychange event when ESC is pressed
                onEvent('keypress', updateModel);
            }
            if (ieVersion < 11) {
                // Internet Explorer <= 8 doesn't support the 'input' event, but does include 'propertychange' that fires whenever
                // any property of an element changes. Unlike 'input', it also fires if a property is changed from JavaScript code,
                // but that's an acceptable compromise for this binding. IE 9 and 10 support 'input', but since they don't always
                // fire it when using autocomplete, we'll use 'propertychange' for them also.
                onEvent('propertychange', function(event) {
                    if (!ourUpdate && event.propertyName === 'value') {
                        ieUpdateModel(event);
                    }
                });
            }
            if (ieVersion == 8) {
                // IE 8 has a bug where it fails to fire 'propertychange' on the first update following a value change from
                // JavaScript code. It also doesn't fire if you clear the entire value. To fix this, we bind to the following
                // events too.
                onEvent('keyup', updateModel);      // A single keystoke
                onEvent('keydown', updateModel);    // The first character when a key is held down
            }
            if (registerForSelectionChangeEvent) {
                // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
                // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
                // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
                // can detect all of those except dragging text out of the field, for which we use 'dragend'.
                // These are also needed in IE8 because of the bug described above.
                registerForSelectionChangeEvent(element, ieUpdateModel);  // 'selectionchange' covers cut, paste, drop, delete, etc.
                onEvent('dragend', deferUpdateModel);
            }

            if (!ieVersion || ieVersion >= 9) {
                // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
                // through the user interface.
                onEvent('input', ieUpdateModel);
            }

            if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
                // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
                onEvent('keydown', deferUpdateModel);
                onEvent('paste', deferUpdateModel);
                onEvent('cut', deferUpdateModel);
            } else if (operaVersion < 11) {
                // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
                // We can try to catch some of those using 'keydown'.
                onEvent('keydown', deferUpdateModel);
            } else if (firefoxVersion < 4.0) {
                // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                onEvent('DOMAutoComplete', updateModel);

                // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
                onEvent('dragdrop', updateModel);       // <3.5
                onEvent('drop', updateModel);           // 3.5
            } else if (edgeVersion && element.type === "number") {
                // Microsoft Edge doesn't fire 'input' or 'change' events for number inputs when
                // the value is changed via the up / down arrow keys
                onEvent('keydown', deferUpdateModel);
            }
        }

        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
        onEvent('change', updateModel);

        // To deal with browsers that don't notify any kind of event for some changes (IE, Safari, etc.)
        onEvent('blur', updateModel);

        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['textInput'] = true;

// textinput is an alias for textInput
ko.bindingHandlers['textinput'] = {
    // preprocess is the only way to set up a full alias
    'preprocess': function (value, name, addBinding) {
        addBinding('textInput', value);
    }
};

})();ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
            ko.utils.setElementName(element, name);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['using'] = {
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var options;

        if (allBindings['has']('as')) {
            options = { 'as': allBindings.get('as'), 'noChildContext': allBindings.get('noChildContext') };
        }

        var innerContext = bindingContext['createChildContext'](valueAccessor, options);
        ko.applyBindingsToDescendants(innerContext, element);

        return { 'controlsDescendantBindings': true };
    }
};
ko.virtualElements.allowedBindings['using'] = true;
ko.bindingHandlers['value'] = {
    'init': function (element, valueAccessor, allBindings) {
        var tagName = ko.utils.tagNameLower(element),
            isInputElement = tagName == "input";

        // If the value binding is placed on a radio/checkbox, then just pass through to checkedValue and quit
        if (isInputElement && (element.type == "checkbox" || element.type == "radio")) {
            ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
            return;
        }

        var eventsToCatch = [];
        var requestedEventsToCatch = allBindings.get("valueUpdate");
        var propertyChangedFired = false;
        var elementValueBeforeEvent = null;

        if (requestedEventsToCatch) {
            // Allow both individual event names, and arrays of event names
            if (typeof requestedEventsToCatch == "string") {
                eventsToCatch = [requestedEventsToCatch];
            } else {
                eventsToCatch = ko.utils.arrayGetDistinctValues(requestedEventsToCatch);
            }
            ko.utils.arrayRemoveItem(eventsToCatch, "change");  // We'll subscribe to "change" events later
        }

        var valueUpdateHandler = function() {
            elementValueBeforeEvent = null;
            propertyChangedFired = false;
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && isInputElement && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "focus", function () { propertyChangedFired = false });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() {
                    // The elementValueBeforeEvent variable is non-null *only* during the brief gap between
                    // a keyX event firing and the valueUpdateHandler running, which is scheduled to happen
                    // at the earliest asynchronous opportunity. We store this temporary information so that
                    // if, between keyX and valueUpdateHandler, the underlying model value changes separately,
                    // we can overwrite that model value change with the value the user just typed. Otherwise,
                    // techniques like rateLimit can trigger model changes at critical moments that will
                    // override the user's inputs, causing keystrokes to be lost.
                    elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                    ko.utils.setTimeout(valueUpdateHandler, 0);
                };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });

        var updateFromModel;

        if (isInputElement && element.type == "file") {
            // For file input elements, can only write the empty string
            updateFromModel = function () {
                var newValue = ko.utils.unwrapObservable(valueAccessor());
                if (newValue === null || newValue === undefined || newValue === "") {
                    element.value = "";
                } else {
                    ko.dependencyDetection.ignore(valueUpdateHandler);  // reset the model to match the element
                }
            }
        } else {
            updateFromModel = function () {
                var newValue = ko.utils.unwrapObservable(valueAccessor());
                var elementValue = ko.selectExtensions.readValue(element);

                if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                    ko.utils.setTimeout(updateFromModel, 0);
                    return;
                }

                var valueHasChanged = newValue !== elementValue;

                if (valueHasChanged || elementValue === undefined) {
                    if (tagName === "select") {
                        var allowUnset = allBindings.get('valueAllowUnset');
                        ko.selectExtensions.writeValue(element, newValue, allowUnset);
                        if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                            // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                            // because you're not allowed to have a model value that disagrees with a visible UI selection.
                            ko.dependencyDetection.ignore(valueUpdateHandler);
                        }
                    } else {
                        ko.selectExtensions.writeValue(element, newValue);
                    }
                }
            };
        }

        if (tagName === "select") {
            var updateFromModelComputed;
            ko.bindingEvent.subscribe(element, ko.bindingEvent.childrenComplete, function () {
                if (!updateFromModelComputed) {
                    ko.utils.registerEventHandler(element, "change", valueUpdateHandler);
                    updateFromModelComputed = ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
                } else if (allBindings.get('valueAllowUnset')) {
                    updateFromModel();
                } else {
                    valueUpdateHandler();
                }
            }, null, { 'notifyImmediately': true });
        } else {
            ko.utils.registerEventHandler(element, "change", valueUpdateHandler);
            ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
        }
    },
    'update': function() {} // Keep for backwards compatibility with code that may have wrapped value binding
};
ko.expressionRewriting.twoWayBindings['value'] = true;
ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
};

ko.bindingHandlers['hidden'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['visible']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            // - templateDocument is the document object of the template
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options, templateDocument);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;
    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.expressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (Object.prototype.hasOwnProperty.call(allValidators, key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
        var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript =
            "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                var nodeToBind = domNode.nextSibling;
                if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                    ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                }
            });
        }
    }
})();


// Exported only because it has to be referenced by string lookup from within rewritten template
ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    // template types
    var templateScript = 1,
        templateTextArea = 2,
        templateTemplate = 3,
        templateElement = 4;

    ko.templateSources.domElement = function(element) {
        this.domElement = element;

        if (element) {
            var tagNameLower = ko.utils.tagNameLower(element);
            this.templateType =
                tagNameLower === "script" ? templateScript :
                tagNameLower === "textarea" ? templateTextArea :
                    // For browsers with proper <template> element support, where the .content property gives a document fragment
                tagNameLower == "template" && element.content && element.content.nodeType === 11 ? templateTemplate :
                templateElement;
        }
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var elemContentsProperty = this.templateType === templateScript ? "text"
                                 : this.templateType === templateTextArea ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
        } else {
            ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
        }
    };

    var templatesDomDataKey = ko.utils.domData.nextKey();
    function getTemplateDomData(element) {
        return ko.utils.domData.get(element, templatesDomDataKey) || {};
    }
    function setTemplateDomData(element, data) {
        ko.utils.domData.set(element, templatesDomDataKey, data);
    }

    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        var element = this.domElement;
        if (arguments.length == 0) {
            var templateData = getTemplateDomData(element),
                nodes = templateData.containerData || (
                    this.templateType === templateTemplate ? element.content :
                    this.templateType === templateElement ? element :
                    undefined);
            if (!nodes || templateData.alwaysCheckText) {
                // If the template is associated with an element that stores the template as text,
                // parse and cache the nodes whenever there's new text content available. This allows
                // the user to update the template content by updating the text of template node.
                var text = this['text']();
                if (text && text !== templateData.textData) {
                    nodes = ko.utils.parseHtmlForTemplateNodes(text, element.ownerDocument);
                    setTemplateDomData(element, {containerData: nodes, textData: text, alwaysCheckText: true});
                }
            }
            return nodes;
        } else {
            var valueToWrite = arguments[0];
            if (this.templateType !== undefined) {
                this['text']("");   // clear the text from the node
            }
            setTemplateDomData(element, {containerData: valueToWrite});
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = getTemplateDomData(this.domElement);
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            setTemplateDomData(this.domElement, {textData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            action(node, nextInQueue);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0],
                lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                parentNode = firstNode.parentNode,
                provider = ko.bindingProvider['instance'],
                preprocessNode = provider['preprocessNode'];

            if (preprocessNode) {
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
                    var nodePreviousSibling = node.previousSibling;
                    var newNodes = preprocessNode.call(provider, node);
                    if (newNodes) {
                        if (node === firstNode)
                            firstNode = newNodes[0] || nextNodeInRange;
                        if (node === lastNode)
                            lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                    }
                });

                // Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
                // We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
                // first node needs to be in the array).
                continuousNodeArray.length = 0;
                if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
                    return;
                }
                if (firstNode === lastNode) {
                    continuousNodeArray.push(firstNode);
                } else {
                    continuousNodeArray.push(firstNode, lastNode);
                    ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                }
            }

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });

            // Make sure any changes done by applyBindings or unmemoize are reflected in the array
            ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = (firstTargetNode || template || {}).ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender']) {
                ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext[options['as'] || '$data']]);
            }
            if (renderMode == "replaceChildren") {
                ko.bindingEvent.notify(targetNodeOrNodeArray, ko.bindingEvent.childrenComplete);
            }
        }

        return renderedNodesArray;
    }

    function resolveTemplateName(template, data, context) {
        // The template can be specified as:
        if (ko.isObservable(template)) {
            // 1. An observable, with string value
            return template();
        } else if (typeof template === 'function') {
            // 2. A function of (data, context) returning a string
            return template(data, context);
        } else {
            // 3. A string
            return template;
        }
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(dataOrBindingContext, null, null, null, { "exportDependencies": true });

                    var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                        renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);

                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext, asName = options['as'];

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            arrayItemContext = parentBindingContext['createChildContext'](arrayValue, {
                'as': asName,
                'noChildContext': options['noChildContext'],
                'extend': function(context) {
                    context['$index'] = index;
                    if (asName) {
                        context[asName + "Index"] = index;
                    }
                }
            });

            var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
            return executeTemplate(targetNode, "ignoreTargetNode", templateName, arrayItemContext, options);
        };

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);

            // release the "cache" variable, so that it can be collected by
            // the GC when its value isn't used from within the bindings anymore.
            arrayItemContext = null;
        };

        var setDomNodeChildrenFromArrayMapping = function (newArray, changeList) {
            // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
            // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
            ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, newArray, executeTemplateForArrayItem, options, activateBindingsCallback, changeList]);
            ko.bindingEvent.notify(targetNode, ko.bindingEvent.childrenComplete);
        };

        var shouldHideDestroyed = (options['includeDestroyed'] === false) || (ko.options['foreachHidesDestroyed'] && !options['includeDestroyed']);

        if (!shouldHideDestroyed && !options['beforeRemove'] && ko.isObservableArray(arrayOrObservableArray)) {
            setDomNodeChildrenFromArrayMapping(arrayOrObservableArray.peek());

            var subscription = arrayOrObservableArray.subscribe(function (changeList) {
                setDomNodeChildrenFromArrayMapping(arrayOrObservableArray(), changeList);
            }, null, "arrayChange");
            subscription.disposeWhenNodeIsRemoved(targetNode);

            return subscription;
        } else {
            return ko.dependentObservable(function () {
                var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
                if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                    unwrappedArray = [unwrappedArray];

                if (shouldHideDestroyed) {
                    // Filter out any entries marked as destroyed
                    unwrappedArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                        return item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
                    });
                }
                setDomNodeChildrenFromArrayMapping(unwrappedArray);

            }, null, { disposeWhenNodeIsRemoved: targetNode });
        }
    };

    var templateComputedDomDataKey = ko.utils.domData.nextKey();
    function disposeOldComputedAndStoreNewOne(element, newComputed) {
        var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
        if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
            oldComputed.dispose();
        ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && (!newComputed.isActive || newComputed.isActive())) ? newComputed : undefined);
    }

    var cleanContainerDomDataKey = ko.utils.domData.nextKey();
    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if (typeof bindingValue == "string" || 'name' in bindingValue) {
                // It's a named template - clear the element
                ko.virtualElements.emptyNode(element);
            } else if ('nodes' in bindingValue) {
                // We've been given an array of DOM nodes. Save them as the template source.
                // There is no known use case for the node array being an observable array (if the output
                // varies, put that behavior *into* your template - that's what templates are for), and
                // the implementation would be a mess, so assert that it's not observable.
                var nodes = bindingValue['nodes'] || [];
                if (ko.isObservable(nodes)) {
                    throw new Error('The "nodes" option must be a plain, non-observable array.');
                }

                // If the nodes are already attached to a KO-generated container, we reuse that container without moving the
                // elements to a new one (we check only the first node, as the nodes are always moved together)
                var container = nodes[0] && nodes[0].parentNode;
                if (!container || !ko.utils.domData.get(container, cleanContainerDomDataKey)) {
                    container = ko.utils.moveCleanedNodesToContainerElement(nodes);
                    ko.utils.domData.set(container, cleanContainerDomDataKey, true);
                }

                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            } else {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = ko.virtualElements.childNodes(element);
                if (templateNodes.length > 0) {
                    var container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                    new ko.templateSources.anonymousTemplate(element)['nodes'](container);
                } else {
                    throw new Error("Anonymous template defined, but no template content was provided");
                }
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                options = ko.utils.unwrapObservable(value),
                shouldDisplay = true,
                templateComputed = null,
                template;

            if (typeof options == "string") {
                template = value;
                options = {};
            } else {
                template = 'name' in options ? options['name'] : element;

                // Support "if"/"ifnot" conditions
                if ('if' in options)
                    shouldDisplay = ko.utils.unwrapObservable(options['if']);
                if (shouldDisplay && 'ifnot' in options)
                    shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

                // Don't show anything if an empty name is given (see #2446)
                if (shouldDisplay && !template) {
                    shouldDisplay = false;
                }
            }

            if ('foreach' in options) {
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && options['foreach']) || [];
                templateComputed = ko.renderTemplateForEach(template, dataArray, options, element, bindingContext);
            } else if (!shouldDisplay) {
                ko.virtualElements.emptyNode(element);
            } else {
                // Render once for this single data point (or use the viewModel if no data was provided)
                var innerBindingContext = bindingContext;
                if ('data' in options) {
                    innerBindingContext = bindingContext['createChildContext'](options['data'], {
                        'as': options['as'],
                        'noChildContext': options['noChildContext'],
                        'exportDependencies': true
                    });
                }
                templateComputed = ko.renderTemplate(template, innerBindingContext, options, element);
            }

            // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
            disposeOldComputedAndStoreNewOne(element, templateComputed);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);
// Go through the items that have been added and deleted and try to find matches between them.
ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
    if (left.length && right.length) {
        var failedCompares, l, r, leftItem, rightItem;
        for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
            for (r = 0; rightItem = right[r]; ++r) {
                if (leftItem['value'] === rightItem['value']) {
                    leftItem['moved'] = rightItem['index'];
                    rightItem['moved'] = leftItem['index'];
                    right.splice(r, 1);         // This item is marked as moved; so remove it from right list
                    failedCompares = r = 0;     // Reset failed compares count because we're checking for consecutive failures
                    break;
                }
            }
            failedCompares += r;
        }
    }
};

ko.utils.compareArrays = (function () {
    var statusNotInOld = 'added', statusNotInNew = 'deleted';

    // Simple calculation based on Levenshtein distance.
    function compareArrays(oldArray, newArray, options) {
        // For backward compatibility, if the third arg is actually a bool, interpret
        // it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
        options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
        oldArray = oldArray || [];
        newArray = newArray || [];

        if (oldArray.length < newArray.length)
            return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
        else
            return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
    }

    function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
        var myMin = Math.min,
            myMax = Math.max,
            editDistanceMatrix = [],
            smlIndex, smlIndexMax = smlArray.length,
            bigIndex, bigIndexMax = bigArray.length,
            compareRange = (bigIndexMax - smlIndexMax) || 1,
            maxDistance = smlIndexMax + bigIndexMax + 1,
            thisRow, lastRow,
            bigIndexMaxForRow, bigIndexMinForRow;

        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push(thisRow = []);
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex)
                    thisRow[bigIndex] = smlIndex + 1;
                else if (!smlIndex)  // Top row - transform empty array into new array via additions
                    thisRow[bigIndex] = bigIndex + 1;
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                    thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                else {
                    var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }

        var editScript = [], meMinusOne, notInSml = [], notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
                notInSml.push(editScript[editScript.length] = {     // added
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex });
            } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                notInBig.push(editScript[editScript.length] = {     // deleted
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex });
            } else {
                --bigIndex;
                --smlIndex;
                if (!options['sparse']) {
                    editScript.push({
                        'status': "retained",
                        'value': bigArray[bigIndex] });
                }
            }
        }

        // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
        // smlIndexMax keeps the time complexity of this algorithm linear.
        ko.utils.findMovesInArrayComparison(notInBig, notInSml, !options['dontLimitMoves'] && smlIndexMax * 10);

        return editScript.reverse();
    }

    return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.length = 0;
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
        return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
    }

    var lastMappingResultDomDataKey = ko.utils.domData.nextKey(),
        deletedItemDummyValue = ko.utils.domData.nextKey();

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes, editScript) {
        array = array || [];
        if (typeof array.length == "undefined") // Coerce single value into array
            array = [array];

        options = options || {};
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey);
        var isFirstExecution = !lastMappingResult;

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var currentArrayIndex = 0;

        var nodesToDelete = [];
        var itemsToMoveFirstIndexes = [];
        var itemsForBeforeRemoveCallbacks = [];
        var itemsForMoveCallbacks = [];
        var itemsForAfterAddCallbacks = [];
        var mapData;
        var countWaitingForRemove = 0;

        function itemAdded(value) {
            mapData = { arrayEntry: value, indexObservable: ko.observable(currentArrayIndex++) };
            newMappingResult.push(mapData);
            if (!isFirstExecution) {
                itemsForAfterAddCallbacks.push(mapData);
            }
        }

        function itemMovedOrRetained(oldPosition) {
            mapData = lastMappingResult[oldPosition];
            if (currentArrayIndex !== mapData.indexObservable.peek())
                itemsForMoveCallbacks.push(mapData);
            // Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
            mapData.indexObservable(currentArrayIndex++);
            ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
            newMappingResult.push(mapData);
        }

        function callCallback(callback, items) {
            if (callback) {
                for (var i = 0, n = items.length; i < n; i++) {
                    ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
                        callback(node, i, items[i].arrayEntry);
                    });
                }
            }
        }

        if (isFirstExecution) {
            ko.utils.arrayForEach(array, itemAdded);
        } else {
            if (!editScript || (lastMappingResult && lastMappingResult['_countWaitingForRemove'])) {
                // Compare the provided array against the previous one
                var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; }),
                    compareOptions = {
                        'dontLimitMoves': options['dontLimitMoves'],
                        'sparse': true
                    };
                editScript = ko.utils.compareArrays(lastArray, array, compareOptions);
            }

            for (var i = 0, editScriptItem, movedIndex, itemIndex; editScriptItem = editScript[i]; i++) {
                movedIndex = editScriptItem['moved'];
                itemIndex = editScriptItem['index'];
                switch (editScriptItem['status']) {
                    case "deleted":
                        while (lastMappingResultIndex < itemIndex) {
                            itemMovedOrRetained(lastMappingResultIndex++);
                        }
                        if (movedIndex === undefined) {
                            mapData = lastMappingResult[lastMappingResultIndex];

                            // Stop tracking changes to the mapping for these nodes
                            if (mapData.dependentObservable) {
                                mapData.dependentObservable.dispose();
                                mapData.dependentObservable = undefined;
                            }

                            // Queue these nodes for later removal
                            if (ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode).length) {
                                if (options['beforeRemove']) {
                                    newMappingResult.push(mapData);
                                    countWaitingForRemove++;
                                    if (mapData.arrayEntry === deletedItemDummyValue) {
                                        mapData = null;
                                    } else {
                                        itemsForBeforeRemoveCallbacks.push(mapData);
                                    }
                                }
                                if (mapData) {
                                    nodesToDelete.push.apply(nodesToDelete, mapData.mappedNodes);
                                }
                            }
                        }
                        lastMappingResultIndex++;
                        break;

                    case "added":
                        while (currentArrayIndex < itemIndex) {
                            itemMovedOrRetained(lastMappingResultIndex++);
                        }
                        if (movedIndex !== undefined) {
                            itemsToMoveFirstIndexes.push(newMappingResult.length);
                            itemMovedOrRetained(movedIndex);
                        } else {
                            itemAdded(editScriptItem['value']);
                        }
                        break;
                }
            }

            while (currentArrayIndex < array.length) {
                itemMovedOrRetained(lastMappingResultIndex++);
            }

            // Record that the current view may still contain deleted items
            // because it means we won't be able to use a provided editScript.
            newMappingResult['_countWaitingForRemove'] = countWaitingForRemove;
        }

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);

        // Call beforeMove first before any changes have been made to the DOM
        callCallback(options['beforeMove'], itemsForMoveCallbacks);

        // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
        ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

        var i, j, lastNode, nodeToInsert, mappedNodes, activeElement;

        // Since most browsers remove the focus from an element when it's moved to another location,
        // save the focused element and try to restore it later.
        try {
            activeElement = domNode.ownerDocument.activeElement;
        } catch(e) {
            // IE9 throws if you access activeElement during page load (see issue #703)
        }

        // Try to reduce overall moved nodes by first moving the ones that were marked as moved by the edit script
        if (itemsToMoveFirstIndexes.length) {
            while ((i = itemsToMoveFirstIndexes.shift()) != undefined) {
                mapData = newMappingResult[i];
                for (lastNode = undefined; i; ) {
                    if ((mappedNodes = newMappingResult[--i].mappedNodes) && mappedNodes.length) {
                        lastNode = mappedNodes[mappedNodes.length-1];
                        break;
                    }
                }
                for (j = 0; nodeToInsert = mapData.mappedNodes[j]; lastNode = nodeToInsert, j++) {
                    ko.virtualElements.insertAfter(domNode, nodeToInsert, lastNode);
                }
            }
        }

        // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
        for (i = 0; mapData = newMappingResult[i]; i++) {
            // Get nodes for newly added items
            if (!mapData.mappedNodes)
                ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

            // Put nodes in the right place if they aren't there already
            for (j = 0; nodeToInsert = mapData.mappedNodes[j]; lastNode = nodeToInsert, j++) {
                ko.virtualElements.insertAfter(domNode, nodeToInsert, lastNode);
            }

            // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
            if (!mapData.initialized && callbackAfterAddingNodes) {
                callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                mapData.initialized = true;
                lastNode = mapData.mappedNodes[mapData.mappedNodes.length - 1];     // get the last node again since it may have been changed by a preprocessor
            }
        }

        // Restore the focused element if it had lost focus
        if (activeElement && domNode.ownerDocument.activeElement != activeElement) {
            activeElement.focus();
        }

        // If there's a beforeRemove callback, call it after reordering.
        // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
        // some sort of animation, which is why we first reorder the nodes that will be removed. If the
        // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
        // Perhaps we'll make that change in the future if this scenario becomes more common.
        callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

        // Replace the stored values of deleted items with a dummy value. This provides two benefits: it marks this item
        // as already "removed" so we won't call beforeRemove for it again, and it ensures that the item won't match up
        // with an actual item in the array and appear as "retained" or "moved".
        for (i = 0; i < itemsForBeforeRemoveCallbacks.length; ++i) {
            itemsForBeforeRemoveCallbacks[i].arrayEntry = deletedItemDummyValue;
        }

        // Finally call afterMove and afterAdd callbacks
        callCallback(options['afterMove'], itemsForMoveCallbacks);
        callCallback(options['afterAdd'], itemsForAfterAddCallbacks);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText, templateDocument);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if (!jQueryInstance || !(jQueryInstance['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options, templateDocument) {
            templateDocument = templateDocument || document;
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQueryInstance['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](templateDocument.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQueryInstance['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
        };

        if (jQueryTmplVersion > 0) {
            jQueryInstance['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQueryInstance['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
    ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
}));
}());
})();
;
/*!
 * Knockout ES5 plugin - https://github.com/SteveSanderson/knockout-es5
 * Copyright (c) Steve Sanderson
 * MIT license
 */

(function(global, undefined) {
  'use strict';

  var ko;

  // Model tracking
  // --------------
  //
  // This is the central feature of Knockout-ES5. We augment model objects by converting properties
  // into ES5 getter/setter pairs that read/write an underlying Knockout observable. This means you can
  // use plain JavaScript syntax to read/write the property while still getting the full benefits of
  // Knockout's automatic dependency detection and notification triggering.
  //
  // For comparison, here's Knockout ES3-compatible syntax:
  //
  //     var firstNameLength = myModel.user().firstName().length; // Read
  //     myModel.user().firstName('Bert'); // Write
  //
  // ... versus Knockout-ES5 syntax:
  //
  //     var firstNameLength = myModel.user.firstName.length; // Read
  //     myModel.user.firstName = 'Bert'; // Write

  // `ko.track(model)` converts each property on the given model object into a getter/setter pair that
  // wraps a Knockout observable. Optionally specify an array of property names to wrap; otherwise we
  // wrap all properties. If any of the properties are already observables, we replace them with
  // ES5 getter/setter pairs that wrap your original observable instances. In the case of readonly
  // ko.computed properties, we simply do not define a setter (so attempted writes will be ignored,
  // which is how ES5 readonly properties normally behave).
  //
  // By design, this does *not* recursively walk child object properties, because making literally
  // everything everywhere independently observable is usually unhelpful. When you do want to track
  // child object properties independently, define your own class for those child objects and put
  // a separate ko.track call into its constructor --- this gives you far more control.
  /**
   * @param {object} obj
   * @param {object|array.<string>} propertyNamesOrSettings
   * @param {boolean} propertyNamesOrSettings.deep Use deep track.
   * @param {array.<string>} propertyNamesOrSettings.fields Array of property names to wrap.
   * todo: @param {array.<string>} propertyNamesOrSettings.exclude Array of exclude property names to wrap.
   * todo: @param {function(string, *):boolean} propertyNamesOrSettings.filter Function to filter property 
   *   names to wrap. A function that takes ... params
   * @return {object}
   */
  function track(obj, propertyNamesOrSettings) {
    if (!obj || typeof obj !== 'object') {
      throw new Error('When calling ko.track, you must pass an object as the first parameter.');
    }

    var propertyNames;

    if ( isPlainObject(propertyNamesOrSettings) ) {
      // defaults
      propertyNamesOrSettings.deep = propertyNamesOrSettings.deep || false;
      propertyNamesOrSettings.fields = propertyNamesOrSettings.fields || Object.getOwnPropertyNames(obj);
      propertyNamesOrSettings.lazy = propertyNamesOrSettings.lazy || false;

      wrap(obj, propertyNamesOrSettings.fields, propertyNamesOrSettings);
    } else {
      propertyNames = propertyNamesOrSettings || Object.getOwnPropertyNames(obj);
      wrap(obj, propertyNames, {});
    }

    return obj;
  }

  // fix for ie
  var rFunctionName = /^function\s*([^\s(]+)/;
  function getFunctionName( ctor ){
    if (ctor.name) {
      return ctor.name;
    }
    return (ctor.toString().trim().match( rFunctionName ) || [])[1];
  }

  function canTrack(obj) {
    return obj && typeof obj === 'object' && getFunctionName(obj.constructor) === 'Object';
  }

  function createPropertyDescriptor(originalValue, prop, map) {
    var isObservable = ko.isObservable(originalValue);
    var isArray = !isObservable && Array.isArray(originalValue);
    var observable = isObservable ? originalValue
        : isArray ? ko.observableArray(originalValue)
        : ko.observable(originalValue);

    map[prop] = function () { return observable; };

    // add check in case the object is already an observable array
    if (isArray || (isObservable && 'push' in observable)) {
      notifyWhenPresentOrFutureArrayValuesMutate(ko, observable);
    }

    return {
      configurable: true,
      enumerable: true,
      get: observable,
      set: ko.isWriteableObservable(observable) ? observable : undefined
    };
  }

  function createLazyPropertyDescriptor(originalValue, prop, map) {
    if (ko.isObservable(originalValue)) {
      // no need to be lazy if we already have an observable
      return createPropertyDescriptor(originalValue, prop, map);
    }

    var observable;

    function getOrCreateObservable(value, writing) {
      if (observable) {
        return writing ? observable(value) : observable;
      }

      if (Array.isArray(value)) {
        observable = ko.observableArray(value);
        notifyWhenPresentOrFutureArrayValuesMutate(ko, observable);
        return observable;
      }

      return (observable = ko.observable(value));
    }

    map[prop] = function () { return getOrCreateObservable(originalValue); };
    return {
      configurable: true,
      enumerable: true,
      get: function () { return getOrCreateObservable(originalValue)(); },
      set: function (value) { getOrCreateObservable(value, true); }
    };
  }

  function wrap(obj, props, options) {
    if (!props.length) {
      return;
    }

    var allObservablesForObject = getAllObservablesForObject(obj, true);
    var descriptors = {};

    props.forEach(function (prop) {
      // Skip properties that are already tracked
      if (prop in allObservablesForObject) {
        return;
      }

      // Skip properties where descriptor can't be redefined
      if (Object.getOwnPropertyDescriptor(obj, prop).configurable === false){
        return;
      }

      var originalValue = obj[prop];
      descriptors[prop] = (options.lazy ? createLazyPropertyDescriptor : createPropertyDescriptor)
        (originalValue, prop, allObservablesForObject);

      if (options.deep && canTrack(originalValue)) {
        wrap(originalValue, Object.keys(originalValue), options);
      }
    });

    Object.defineProperties(obj, descriptors);
  }

  function isPlainObject( obj ){
    return !!obj && typeof obj === 'object' && obj.constructor === Object;
  }

  // Lazily created by `getAllObservablesForObject` below. Has to be created lazily because the
  // WeakMap factory isn't available until the module has finished loading (may be async).
  var objectToObservableMap;

  // Gets or creates the hidden internal key-value collection of observables corresponding to
  // properties on the model object.
  function getAllObservablesForObject(obj, createIfNotDefined) {
    if (!objectToObservableMap) {
      objectToObservableMap = weakMapFactory();
    }

    var result = objectToObservableMap.get(obj);
    if (!result && createIfNotDefined) {
      result = {};
      objectToObservableMap.set(obj, result);
    }
    return result;
  }

  // Removes the internal references to observables mapped to the specified properties
  // or the entire object reference if no properties are passed in. This allows the
  // observables to be replaced and tracked again.
  function untrack(obj, propertyNames) {
    if (!objectToObservableMap) {
      return;
    }

    if (arguments.length === 1) {
      objectToObservableMap['delete'](obj);
    } else {
      var allObservablesForObject = getAllObservablesForObject(obj, false);
      if (allObservablesForObject) {
        propertyNames.forEach(function(propertyName) {
          delete allObservablesForObject[propertyName];
        });
      }
    }
  }

  // Computed properties
  // -------------------
  //
  // The preceding code is already sufficient to upgrade ko.computed model properties to ES5
  // getter/setter pairs (or in the case of readonly ko.computed properties, just a getter).
  // These then behave like a regular property with a getter function, except they are smarter:
  // your evaluator is only invoked when one of its dependencies changes. The result is cached
  // and used for all evaluations until the next time a dependency changes).
  //
  // However, instead of forcing developers to declare a ko.computed property explicitly, it's
  // nice to offer a utility function that declares a computed getter directly.

  // Implements `ko.defineProperty`
  function defineComputedProperty(obj, propertyName, evaluatorOrOptions) {
    var ko = this,
      computedOptions = { owner: obj, deferEvaluation: true };

    if (typeof evaluatorOrOptions === 'function') {
      computedOptions.read = evaluatorOrOptions;
    } else {
      if ('value' in evaluatorOrOptions) {
        throw new Error('For ko.defineProperty, you must not specify a "value" for the property. ' +
                        'You must provide a "get" function.');
      }

      if (typeof evaluatorOrOptions.get !== 'function') {
        throw new Error('For ko.defineProperty, the third parameter must be either an evaluator function, ' +
                        'or an options object containing a function called "get".');
      }

      computedOptions.read = evaluatorOrOptions.get;
      computedOptions.write = evaluatorOrOptions.set;
    }

    obj[propertyName] = ko.computed(computedOptions);
    track.call(ko, obj, [propertyName]);
    return obj;
  }

  // Array handling
  // --------------
  //
  // Arrays are special, because unlike other property types, they have standard mutator functions
  // (`push`/`pop`/`splice`/etc.) and it's desirable to trigger a change notification whenever one of
  // those mutator functions is invoked.
  //
  // Traditionally, Knockout handles this by putting special versions of `push`/`pop`/etc. on observable
  // arrays that mutate the underlying array and then trigger a notification. That approach doesn't
  // work for Knockout-ES5 because properties now return the underlying arrays, so the mutator runs
  // in the context of the underlying array, not any particular observable:
  //
  //     // Operates on the underlying array value
  //     myModel.someCollection.push('New value');
  //
  // To solve this, Knockout-ES5 detects array values, and modifies them as follows:
  //  1. Associates a hidden subscribable with each array instance that it encounters
  //  2. Intercepts standard mutators (`push`/`pop`/etc.) and makes them trigger the subscribable
  // Then, for model properties whose values are arrays, the property's underlying observable
  // subscribes to the array subscribable, so it can trigger a change notification after mutation.

  // Given an observable that underlies a model property, watch for any array value that might
  // be assigned as the property value, and hook into its change events
  function notifyWhenPresentOrFutureArrayValuesMutate(ko, observable) {
    var watchingArraySubscription = null;
    ko.computed(function () {
      // Unsubscribe to any earlier array instance
      if (watchingArraySubscription) {
        watchingArraySubscription.dispose();
        watchingArraySubscription = null;
      }

      // Subscribe to the new array instance
      var newArrayInstance = observable();
      if (newArrayInstance instanceof Array) {
        watchingArraySubscription = startWatchingArrayInstance(ko, observable, newArrayInstance);
      }
    });
  }

  // Listens for array mutations, and when they happen, cause the observable to fire notifications.
  // This is used to make model properties of type array fire notifications when the array changes.
  // Returns a subscribable that can later be disposed.
  function startWatchingArrayInstance(ko, observable, arrayInstance) {
    var subscribable = getSubscribableForArray(ko, arrayInstance);
    return subscribable.subscribe(observable);
  }

  // Lazily created by `getSubscribableForArray` below. Has to be created lazily because the
  // WeakMap factory isn't available until the module has finished loading (may be async).
  var arraySubscribablesMap;

  // Gets or creates a subscribable that fires after each array mutation
  function getSubscribableForArray(ko, arrayInstance) {
    if (!arraySubscribablesMap) {
      arraySubscribablesMap = weakMapFactory();
    }

    var subscribable = arraySubscribablesMap.get(arrayInstance);
    if (!subscribable) {
      subscribable = new ko.subscribable();
      arraySubscribablesMap.set(arrayInstance, subscribable);

      var notificationPauseSignal = {};
      wrapStandardArrayMutators(arrayInstance, subscribable, notificationPauseSignal);
      addKnockoutArrayMutators(ko, arrayInstance, subscribable, notificationPauseSignal);
    }

    return subscribable;
  }

  // After each array mutation, fires a notification on the given subscribable
  function wrapStandardArrayMutators(arrayInstance, subscribable, notificationPauseSignal) {
    ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(fnName) {
      var origMutator = arrayInstance[fnName];
      arrayInstance[fnName] = function() {
        var result = origMutator.apply(this, arguments);
        if (notificationPauseSignal.pause !== true) {
          subscribable.notifySubscribers(this);
        }
        return result;
      };
    });
  }

  // Adds Knockout's additional array mutation functions to the array
  function addKnockoutArrayMutators(ko, arrayInstance, subscribable, notificationPauseSignal) {
    ['remove', 'removeAll', 'destroy', 'destroyAll', 'replace'].forEach(function(fnName) {
      // Make it a non-enumerable property for consistency with standard Array functions
      Object.defineProperty(arrayInstance, fnName, {
        enumerable: false,
        value: function() {
          var result;

          // These additional array mutators are built using the underlying push/pop/etc.
          // mutators, which are wrapped to trigger notifications. But we don't want to
          // trigger multiple notifications, so pause the push/pop/etc. wrappers and
          // delivery only one notification at the end of the process.
          notificationPauseSignal.pause = true;
          try {
            // Creates a temporary observableArray that can perform the operation.
            result = ko.observableArray.fn[fnName].apply(ko.observableArray(arrayInstance), arguments);
          }
          finally {
            notificationPauseSignal.pause = false;
          }
          subscribable.notifySubscribers(arrayInstance);
          return result;
        }
      });
    });
  }

  // Static utility functions
  // ------------------------
  //
  // Since Knockout-ES5 sets up properties that return values, not observables, you can't
  // trivially subscribe to the underlying observables (e.g., `someProperty.subscribe(...)`),
  // or tell them that object values have mutated, etc. To handle this, we set up some
  // extra utility functions that can return or work with the underlying observables.

  // Returns the underlying observable associated with a model property (or `null` if the
  // model or property doesn't exist, or isn't associated with an observable). This means
  // you can subscribe to the property, e.g.:
  //
  //     ko.getObservable(model, 'propertyName')
  //       .subscribe(function(newValue) { ... });
  function getObservable(obj, propertyName) {
    if (!obj || typeof obj !== 'object') {
      return null;
    }

    var allObservablesForObject = getAllObservablesForObject(obj, false);
    if (allObservablesForObject && propertyName in allObservablesForObject) {
      return allObservablesForObject[propertyName]();
    }

    return null;
  }
  
  // Returns a boolean indicating whether the property on the object has an underlying
  // observables. This does the check in a way not to create an observable if the
  // object was created with lazily created observables
  function isTracked(obj, propertyName) {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    
    var allObservablesForObject = getAllObservablesForObject(obj, false);
    return !!allObservablesForObject && propertyName in allObservablesForObject;
  }

  // Causes a property's associated observable to fire a change notification. Useful when
  // the property value is a complex object and you've modified a child property.
  function valueHasMutated(obj, propertyName) {
    var observable = getObservable(obj, propertyName);

    if (observable) {
      observable.valueHasMutated();
    }
  }

  // Module initialisation
  // ---------------------
  //
  // When this script is first evaluated, it works out what kind of module loading scenario
  // it is in (Node.js or a browser `<script>` tag), stashes a reference to its dependencies
  // (currently that's just the WeakMap shim), and then finally attaches itself to whichever
  // instance of Knockout.js it can find.

  // A function that returns a new ES6-compatible WeakMap instance (using ES5 shim if needed).
  // Instantiated by prepareExports, accounting for which module loader is being used.
  var weakMapFactory;

  // Extends a Knockout instance with Knockout-ES5 functionality
  function attachToKo(ko) {
    ko.track = track;
    ko.untrack = untrack;
    ko.getObservable = getObservable;
    ko.valueHasMutated = valueHasMutated;
    ko.defineProperty = defineComputedProperty;

    // todo: test it, maybe added it to ko. directly
    ko.es5 = {
      getAllObservablesForObject: getAllObservablesForObject,
      notifyWhenPresentOrFutureArrayValuesMutate: notifyWhenPresentOrFutureArrayValuesMutate,
      isTracked: isTracked
    };

    // Custom Binding Provider
    // -------------------
    //
    // To ensure that when using this plugin any custom bindings are provided with the observable
    // rather than only the value of the property, a custom binding provider supplies bindings with
    // actual observable values. The built in bindings use Knockout's internal `_ko_property_writers`
    // feature to be able to write back to the property, but custom bindings may not be able to use
    // that, especially if they use an options object.

    function CustomBindingProvider(providerToWrap) {
       this.bindingCache = {};
       this._providerToWrap = providerToWrap;
       this._nativeBindingProvider = new ko.bindingProvider();
    }

    CustomBindingProvider.prototype.nodeHasBindings = function() {
       return this._providerToWrap.nodeHasBindings.apply(this._providerToWrap, arguments);
    };

    CustomBindingProvider.prototype.getBindingAccessors = function(node, bindingContext) {
       var bindingsString = this._nativeBindingProvider.getBindingsString(node, bindingContext);
       return bindingsString ? this.parseBindingsString(bindingsString, bindingContext, node, {'valueAccessors':true}) : null;
    };

    CustomBindingProvider.prototype.parseBindingsString = function(bindingsString, bindingContext, node, options) {
       try {
          var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
          return bindingFunction(bindingContext, node);
       } catch (ex) {
          ex.message = 'Unable to parse bindings.\nBindings value: ' + bindingsString + '\nMessage: ' + ex.message;
          throw ex;
       }
    };

    function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
       bindingOptions = bindingOptions || {};

       function processKeyValue(key, val) {
         // Handle arrays if value starts with bracket
         if(val.match(/^\[/)){
           // This is required or will throw errors
           resultStrings.push(key + ':ko.observableArray(' + val + ')');
         }else{
           resultStrings.push(key + ':ko.getObservable($data,"' + val + '")||' + val);
         }

       }

       var resultStrings = [],
          keyValueArray = typeof bindingsStringOrKeyValueArray === 'string' ?
            ko.expressionRewriting.parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

       keyValueArray.forEach(function(keyValue) {
          processKeyValue(keyValue.key || keyValue.unknown, keyValue.value);
       });
       return ko.expressionRewriting.preProcessBindings(resultStrings.join(','), bindingOptions);
    }

    function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
       var cacheKey = bindingsString + (options && options.valueAccessors || '');
       return cache[cacheKey] || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
    }

    function createBindingsStringEvaluator(bindingsString, options) {
       var rewrittenBindings = preProcessBindings(bindingsString, options),
          functionBody = 'with($context){with($data||{}){return{' + rewrittenBindings + '}}}';
        /* jshint -W054 */
       return new Function('$context', '$element', functionBody);
    }

    ko.es5BindingProvider = CustomBindingProvider;

    ko.bindingProvider.instance = new CustomBindingProvider(ko.bindingProvider.instance);
  }

  // Determines which module loading scenario we're in, grabs dependencies, and attaches to KO
  function prepareExports() {
    if (typeof exports === 'object' && typeof module === 'object') {
      // Node.js case - load KO and WeakMap modules synchronously
      ko = require('knockout');
      var WM = require('../lib/weakmap');
      attachToKo(ko);
      weakMapFactory = function() { return new WM(); };
      module.exports = ko;
    } else if (typeof define === 'function' && define.amd) {
      define(['knockout'], function(koModule) {
        ko = koModule;
        attachToKo(koModule);
        weakMapFactory = function() { return new global.WeakMap(); };
        return koModule;
      });
    } else if ('ko' in global) {
      // Non-module case - attach to the global instance, and assume a global WeakMap constructor
      ko = global.ko;
      attachToKo(global.ko);
      weakMapFactory = function() { return new global.WeakMap(); };
    }
  }

  prepareExports();

})(this);
;
// knockout-sortable 1.2.0 | (c) 2019 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
;(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["knockout", "jquery", "jquery-ui/ui/widgets/sortable", "jquery-ui/ui/widgets/draggable", "jquery-ui/ui/widgets/droppable"], factory);
    } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS module
        var ko = require("knockout"),
            jQuery = require("jquery");
        require("jquery-ui/ui/widgets/sortable");
        require("jquery-ui/ui/widgets/draggable");
        require("jquery-ui/ui/widgets/droppable");
        factory(ko, jQuery);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, window.jQuery);
    }
})(function(ko, $) {
    var ITEMKEY = "ko_sortItem",
        INDEXKEY = "ko_sourceIndex",
        LISTKEY = "ko_sortList",
        PARENTKEY = "ko_parentList",
        DRAGKEY = "ko_dragItem",
        unwrap = ko.utils.unwrapObservable,
        dataGet = ko.utils.domData.get,
        dataSet = ko.utils.domData.set,
        version = $.ui && $.ui.version,
        //1.8.24 included a fix for how events were triggered in nested sortables. indexOf checks will fail if version starts with that value (0 vs. -1)
        hasNestedSortableFix = version && version.indexOf("1.6.") && version.indexOf("1.7.") && (version.indexOf("1.8.") || version === "1.8.24");

    //internal afterRender that adds meta-data to children
    var addMetaDataAfterRender = function(elements, data) {
        ko.utils.arrayForEach(elements, function(element) {
            if (element.nodeType === 1) {
                dataSet(element, ITEMKEY, data);
                dataSet(element, PARENTKEY, dataGet(element.parentNode, LISTKEY));
            }
        });
    };

    //prepare the proper options for the template binding
    var prepareTemplateOptions = function(valueAccessor, dataName) {
        var result = {},
            options = {},
            actualAfterRender;

        //build our options to pass to the template engine
        if (ko.utils.peekObservable(valueAccessor()).data) {
            options = unwrap(valueAccessor() || {});
            result[dataName] = options.data;
            if (options.hasOwnProperty("template")) {
                result.name = options.template;
            }
        } else {
            result[dataName] = valueAccessor();
        }

        ko.utils.arrayForEach(["afterAdd", "afterRender", "as", "beforeRemove", "includeDestroyed", "templateEngine", "templateOptions", "nodes"], function (option) {
            if (options.hasOwnProperty(option)) {
                result[option] = options[option];
            } else if (ko.bindingHandlers.sortable.hasOwnProperty(option)) {
                result[option] = ko.bindingHandlers.sortable[option];
            }
        });

        //use an afterRender function to add meta-data
        if (dataName === "foreach") {
            if (result.afterRender) {
                //wrap the existing function, if it was passed
                actualAfterRender = result.afterRender;
                result.afterRender = function(element, data) {
                    addMetaDataAfterRender.call(data, element, data);
                    actualAfterRender.call(data, element, data);
                };
            } else {
                result.afterRender = addMetaDataAfterRender;
            }
        }

        //return options to pass to the template binding
        return result;
    };

    var updateIndexFromDestroyedItems = function(index, items) {
        var unwrapped = unwrap(items);

        if (unwrapped) {
            for (var i = 0; i <= index; i++) {
                //add one for every destroyed item we find before the targetIndex in the target array
                if (unwrapped[i] && unwrap(unwrapped[i]._destroy)) {
                    index++;
                }
            }
        }

        return index;
    };

    //remove problematic leading/trailing whitespace from templates
    var stripTemplateWhitespace = function(element, name) {
        var templateSource,
            templateElement;

        //process named templates
        if (name) {
            templateElement = document.getElementById(name);
            if (templateElement) {
                templateSource = new ko.templateSources.domElement(templateElement);
                templateSource.text($.trim(templateSource.text()));
            }
        }
        else {
            //remove leading/trailing non-elements from anonymous templates
            $(element).contents().each(function() {
                if (this && this.nodeType !== 1) {
                    element.removeChild(this);
                }
            });
        }
    };

    //connect items with observableArrays
    ko.bindingHandlers.sortable = {
        init: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var $element = $(element),
                value = unwrap(valueAccessor()) || {},
                templateOptions = prepareTemplateOptions(valueAccessor, "foreach"),
                sortable = {},
                startActual, updateActual;

            stripTemplateWhitespace(element, templateOptions.name);

            //build a new object that has the global options with overrides from the binding
            $.extend(true, sortable, ko.bindingHandlers.sortable);
            if (value.options && sortable.options) {
                ko.utils.extend(sortable.options, value.options);
                delete value.options;
            }
            ko.utils.extend(sortable, value);

            //if allowDrop is an observable or a function, then execute it in a computed observable
            if (sortable.connectClass && (ko.isObservable(sortable.allowDrop) || typeof sortable.allowDrop == "function")) {
                ko.computed({
                    read: function() {
                        var value = unwrap(sortable.allowDrop),
                            shouldAdd = typeof value == "function" ? value.call(this, templateOptions.foreach) : value;
                        ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, shouldAdd);
                    },
                    disposeWhenNodeIsRemoved: element
                }, this);
            } else {
                ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, sortable.allowDrop);
            }

            //wrap the template binding
            ko.bindingHandlers.template.init(element, function() { return templateOptions; }, allBindingsAccessor, data, context);

            //keep a reference to start/update functions that might have been passed in
            startActual = sortable.options.start;
            updateActual = sortable.options.update;

            //ensure draggable table row cells maintain their width while dragging (unless a helper is provided)
            if ( !sortable.options.helper ) {
                sortable.options.helper = function(e, ui) {
                    if (ui.is("tr")) {
                        ui.children().each(function() {
                            $(this).width($(this).width());
                        });
                    }
                    return ui;
                };
            }

            //initialize sortable binding after template binding has rendered in update function
            var createTimeout = setTimeout(function() {
                var dragItem;
                var originalReceive = sortable.options.receive;

                $element.sortable(ko.utils.extend(sortable.options, {
                    start: function(event, ui) {
                        //track original index
                        var el = ui.item[0];
                        dataSet(el, INDEXKEY, ko.utils.arrayIndexOf(ui.item.parent().children(), el));

                        //make sure that fields have a chance to update model
                        ui.item.find("input:focus").change();
                        if (startActual) {
                            startActual.apply(this, arguments);
                        }
                    },
                    receive: function(event, ui) {
                        //optionally apply an existing receive handler
                        if (typeof originalReceive === "function") {
                            originalReceive.call(this, event, ui);
                        }

                        dragItem = dataGet(ui.item[0], DRAGKEY);
                        if (dragItem) {
                            //copy the model item, if a clone option is provided
                            if (dragItem.clone) {
                                dragItem = dragItem.clone();
                            }

                            //configure a handler to potentially manipulate item before drop
                            if (sortable.dragged) {
                                dragItem = sortable.dragged.call(this, dragItem, event, ui) || dragItem;
                            }
                        }
                    },
                    update: function(event, ui) {
                        var sourceParent, targetParent, sourceIndex, targetIndex, arg,
                            el = ui.item[0],
                            parentEl = ui.item.parent()[0],
                            item = dataGet(el, ITEMKEY) || dragItem;

                        if (!item) {
                            $(el).remove();
                        }
                        dragItem = null;

                        //make sure that moves only run once, as update fires on multiple containers
                        if (item && (this === parentEl) || (!hasNestedSortableFix && $.contains(this, parentEl))) {
                            //identify parents
                            sourceParent = dataGet(el, PARENTKEY);
                            sourceIndex = dataGet(el, INDEXKEY);
                            targetParent = dataGet(el.parentNode, LISTKEY);
                            targetIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), el);

                            //take destroyed items into consideration
                            if (!templateOptions.includeDestroyed) {
                                sourceIndex = updateIndexFromDestroyedItems(sourceIndex, sourceParent);
                                targetIndex = updateIndexFromDestroyedItems(targetIndex, targetParent);
                            }

                            //build up args for the callbacks
                            if (sortable.beforeMove || sortable.afterMove) {
                                arg = {
                                    item: item,
                                    sourceParent: sourceParent,
                                    sourceParentNode: sourceParent && ui.sender || el.parentNode,
                                    sourceIndex: sourceIndex,
                                    targetParent: targetParent,
                                    targetIndex: targetIndex,
                                    cancelDrop: false
                                };

                                //execute the configured callback prior to actually moving items
                                if (sortable.beforeMove) {
                                    sortable.beforeMove.call(this, arg, event, ui);
                                }
                            }

                            //call cancel on the correct list, so KO can take care of DOM manipulation
                            if (sourceParent) {
                                $(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
                            }
                            //for a draggable item just remove the element
                            else {
                                $(el).remove();
                            }

                            //if beforeMove told us to cancel, then we are done
                            if (arg && arg.cancelDrop) {
                                return;
                            }

                            //if the strategy option is unset or false, employ the order strategy involving removal and insertion of items
                            if (!sortable.hasOwnProperty("strategyMove") || sortable.strategyMove === false) {
                                //do the actual move
                                if (targetIndex >= 0) {
                                    if (sourceParent) {
                                        sourceParent.splice(sourceIndex, 1);

                                        //if using deferred updates plugin, force updates
                                        if (ko.processAllDeferredBindingUpdates) {
                                            ko.processAllDeferredBindingUpdates();
                                        }

                                        //if using deferred updates on knockout 3.4, force updates
                                        if (ko.options && ko.options.deferUpdates) {
                                            ko.tasks.runEarly();
                                        }
                                    }

                                    targetParent.splice(targetIndex, 0, item);
                                }

                                //rendering is handled by manipulating the observableArray; ignore dropped element
                                dataSet(el, ITEMKEY, null);
                            }
                            else { //employ the strategy of moving items
                                if (targetIndex >= 0) {
                                    if (sourceParent) {
                                        if (sourceParent !== targetParent) {
                                            // moving from one list to another

                                            sourceParent.splice(sourceIndex, 1);
                                            targetParent.splice(targetIndex, 0, item);

                                            //rendering is handled by manipulating the observableArray; ignore dropped element
                                            dataSet(el, ITEMKEY, null);
                                            ui.item.remove();
                                        }
                                        else {
                                            // moving within same list
                                            var underlyingList = unwrap(sourceParent);

                                            // notify 'beforeChange' subscribers
                                            if (sourceParent.valueWillMutate) {
                                                sourceParent.valueWillMutate();
                                            }

                                            // move from source index ...
                                            underlyingList.splice(sourceIndex, 1);
                                            // ... to target index
                                            underlyingList.splice(targetIndex, 0, item);

                                            // notify subscribers
                                            if (sourceParent.valueHasMutated) {
                                                sourceParent.valueHasMutated();
                                            }
                                        }
                                    }
                                    else {
                                        // drop new element from outside
                                        targetParent.splice(targetIndex, 0, item);

                                        //rendering is handled by manipulating the observableArray; ignore dropped element
                                        dataSet(el, ITEMKEY, null);
                                        ui.item.remove();
                                    }
                                }
                            }

                            //if using deferred updates plugin, force updates
                            if (ko.processAllDeferredBindingUpdates) {
                                ko.processAllDeferredBindingUpdates();
                            }

                            //allow binding to accept a function to execute after moving the item
                            if (sortable.afterMove) {
                                sortable.afterMove.call(this, arg, event, ui);
                            }
                        }

                        if (updateActual) {
                            updateActual.apply(this, arguments);
                        }
                    },
                    connectWith: sortable.connectClass ? "." + sortable.connectClass : false
                }));

                //handle enabling/disabling sorting
                if (sortable.isEnabled !== undefined) {
                    ko.computed({
                        read: function() {
                            $element.sortable(unwrap(sortable.isEnabled) ? "enable" : "disable");
                        },
                        disposeWhenNodeIsRemoved: element
                    });
                }
            }, 0);

            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                //only call destroy if sortable has been created
                if ($element.data("ui-sortable") || $element.data("sortable")) {
                    $element.sortable("destroy");
                }

                ko.utils.toggleDomNodeCssClass(element, sortable.connectClass, false);

                //do not create the sortable if the element has been removed from DOM
                clearTimeout(createTimeout);
            });

            return { 'controlsDescendantBindings': true };
        },
        update: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var templateOptions = prepareTemplateOptions(valueAccessor, "foreach");

            //attach meta-data
            dataSet(element, LISTKEY, templateOptions.foreach);

            //call template binding's update with correct options
            ko.bindingHandlers.template.update(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
        },
        connectClass: 'ko_container',
        allowDrop: true,
        afterMove: null,
        beforeMove: null,
        options: {}
    };

    //create a draggable that is appropriate for dropping into a sortable
    ko.bindingHandlers.draggable = {
        init: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var value = unwrap(valueAccessor()) || {},
                options = value.options || {},
                draggableOptions = ko.utils.extend({}, ko.bindingHandlers.draggable.options),
                templateOptions = prepareTemplateOptions(valueAccessor, "data"),
                connectClass = value.connectClass || ko.bindingHandlers.draggable.connectClass,
                isEnabled = value.isEnabled !== undefined ? value.isEnabled : ko.bindingHandlers.draggable.isEnabled;

            value = "data" in value ? value.data : value;

            //set meta-data
            dataSet(element, DRAGKEY, value);

            //override global options with override options passed in
            ko.utils.extend(draggableOptions, options);

            //setup connection to a sortable
            draggableOptions.connectToSortable = connectClass ? "." + connectClass : false;

            //initialize draggable
            $(element).draggable(draggableOptions);

            //handle enabling/disabling sorting
            if (isEnabled !== undefined) {
                ko.computed({
                    read: function() {
                        $(element).draggable(unwrap(isEnabled) ? "enable" : "disable");
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }

            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).draggable("destroy");
            });

            return ko.bindingHandlers.template.init(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
        },
        update: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var templateOptions = prepareTemplateOptions(valueAccessor, "data");

            return ko.bindingHandlers.template.update(element, function() { return templateOptions; }, allBindingsAccessor, data, context);
        },
        connectClass: ko.bindingHandlers.sortable.connectClass,
        options: {
            helper: "clone"
        }
    };

    // Simple Droppable Implementation
    // binding that updates (function or observable)
    ko.bindingHandlers.droppable = {
        init: function(element, valueAccessor, allBindingsAccessor, data, context) {
            var value = unwrap(valueAccessor()) || {},
                options = value.options || {},
                droppableOptions = ko.utils.extend({}, ko.bindingHandlers.droppable.options),
                isEnabled = value.isEnabled !== undefined ? value.isEnabled : ko.bindingHandlers.droppable.isEnabled;

            //override global options with override options passed in
            ko.utils.extend(droppableOptions, options);

            //get reference to drop method
            value = "data" in value ? value.data : valueAccessor();

            //set drop method
            droppableOptions.drop = function(event, ui) {
                var droppedItem = dataGet(ui.draggable[0], DRAGKEY) || dataGet(ui.draggable[0], ITEMKEY);
                value(droppedItem);
            };

            //initialize droppable
            $(element).droppable(droppableOptions);

            //handle enabling/disabling droppable
            if (isEnabled !== undefined) {
                ko.computed({
                    read: function() {
                        $(element).droppable(unwrap(isEnabled) ? "enable": "disable");
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }

            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).droppable("destroy");
            });
        },
        options: {
            accept: "*"
        }
    };
});
;
/**
 * @license Knockout.Punches
 * Enhanced binding syntaxes for Knockout 3+
 * (c) Michael Best
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Version 0.5.1
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['knockout'], factory);
    } else if (typeof module === "object") {
        // CommonJS module
        var ko = require("knockout");
        factory(ko);
    } else {
        // Browser globals
        factory(window.ko);
    }
}(function(ko) {

// Add a preprocess function to a binding handler.
function addBindingPreprocessor(bindingKeyOrHandler, preprocessFn) {
    return chainPreprocessor(getOrCreateHandler(bindingKeyOrHandler), 'preprocess', preprocessFn);
}

// These utility functions are separated out because they're also used by
// preprocessBindingProperty

// Get the binding handler or create a new, empty one
function getOrCreateHandler(bindingKeyOrHandler) {
    return typeof bindingKeyOrHandler === 'object' ? bindingKeyOrHandler :
        (ko.getBindingHandler(bindingKeyOrHandler) || (ko.bindingHandlers[bindingKeyOrHandler] = {}));
}
// Add a preprocess function
function chainPreprocessor(obj, prop, fn) {
    if (obj[prop]) {
        // If the handler already has a preprocess function, chain the new
        // one after the existing one. If the previous function in the chain
        // returns a falsy value (to remove the binding), the chain ends. This
        // method allows each function to modify and return the binding value.
        var previousFn = obj[prop];
        obj[prop] = function(value, binding, addBinding) {
            value = previousFn.call(this, value, binding, addBinding);
            if (value)
                return fn.call(this, value, binding, addBinding);
        };
    } else {
        obj[prop] = fn;
    }
    return obj;
}

// Add a preprocessNode function to the binding provider. If a
// function already exists, chain the new one after it. This calls
// each function in the chain until one modifies the node. This
// method allows only one function to modify the node.
function addNodePreprocessor(preprocessFn) {
    var provider = ko.bindingProvider.instance;
    if (provider.preprocessNode) {
        var previousPreprocessFn = provider.preprocessNode;
        provider.preprocessNode = function(node) {
            var newNodes = previousPreprocessFn.call(this, node);
            if (!newNodes)
                newNodes = preprocessFn.call(this, node);
            return newNodes;
        };
    } else {
        provider.preprocessNode = preprocessFn;
    }
}

function addBindingHandlerCreator(matchRegex, callbackFn) {
    var oldGetHandler = ko.getBindingHandler;
    ko.getBindingHandler = function(bindingKey) {
        var match;
        return oldGetHandler(bindingKey) || ((match = bindingKey.match(matchRegex)) && callbackFn(match, bindingKey));
    };
}

// Create shortcuts to commonly used ko functions
var ko_unwrap = ko.unwrap;

// Create "punches" object and export utility functions
var ko_punches = ko.punches = {
    utils: {
        addBindingPreprocessor: addBindingPreprocessor,
        addNodePreprocessor: addNodePreprocessor,
        addBindingHandlerCreator: addBindingHandlerCreator,

        // previous names retained for backwards compitibility
        setBindingPreprocessor: addBindingPreprocessor,
        setNodePreprocessor: addNodePreprocessor
    }
};

ko_punches.enableAll = function () {
    // Enable interpolation markup
    enableInterpolationMarkup();
    enableAttributeInterpolationMarkup();

    // Enable auto-namspacing of attr, css, event, and style
    enableAutoNamespacedSyntax('attr');
    enableAutoNamespacedSyntax('css');
    enableAutoNamespacedSyntax('event');
    enableAutoNamespacedSyntax('style');

    // Make sure that Knockout knows to bind checked after attr.value (see #40)
    ko.bindingHandlers.checked.after.push('attr.value');

    // Enable filter syntax for text, html, and attr
    enableTextFilter('text');
    enableTextFilter('html');
    addDefaultNamespacedBindingPreprocessor('attr', filterPreprocessor);

    // Enable wrapped callbacks for click, submit, event, optionsAfterRender, and template options
    enableWrappedCallback('click');
    enableWrappedCallback('submit');
    enableWrappedCallback('optionsAfterRender');
    addDefaultNamespacedBindingPreprocessor('event', wrappedCallbackPreprocessor);
    addBindingPropertyPreprocessor('template', 'beforeRemove', wrappedCallbackPreprocessor);
    addBindingPropertyPreprocessor('template', 'afterAdd', wrappedCallbackPreprocessor);
    addBindingPropertyPreprocessor('template', 'afterRender', wrappedCallbackPreprocessor);
};
// Convert input in the form of `expression | filter1 | filter2:arg1:arg2` to a function call format
// with filters accessed as ko.filters.filter1, etc.
function filterPreprocessor(input) {
    // Check if the input contains any | characters; if not, just return
    if (input.indexOf('|') === -1)
        return input;

    // Split the input into tokens, in which | and : are individual tokens, quoted strings are ignored, and all tokens are space-trimmed
    var tokens = input.match(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\|\||[|:]|[^\s|:"'][^|:"']*[^\s|:"']|[^\s|:"']/g);
    if (tokens && tokens.length > 1) {
        // Append a line so that we don't need a separate code block to deal with the last item
        tokens.push('|');
        input = tokens[0];
        var lastToken, token, inFilters = false, nextIsFilter = false;
        for (var i = 1, token; token = tokens[i]; ++i) {
            if (token === '|') {
                if (inFilters) {
                    if (lastToken === ':')
                        input += "undefined";
                    input += ')';
                }
                nextIsFilter = true;
                inFilters = true;
            } else {
                if (nextIsFilter) {
                    input = "ko.filters['" + token + "'](" + input;
                } else if (inFilters && token === ':') {
                    if (lastToken === ':')
                        input += "undefined";
                    input += ",";
                } else {
                    input += token;
                }
                nextIsFilter = false;
            }
            lastToken = token;
        }
    }
    return input;
}

// Set the filter preprocessor for a specific binding
function enableTextFilter(bindingKeyOrHandler) {
    addBindingPreprocessor(bindingKeyOrHandler, filterPreprocessor);
}

var filters = {};

// Convert value to uppercase
filters.uppercase = function(value) {
    return String.prototype.toUpperCase.call(ko_unwrap(value));
};

// Convert value to lowercase
filters.lowercase = function(value) {
    return String.prototype.toLowerCase.call(ko_unwrap(value));
};

// Return default value if the input value is empty or null
filters['default'] = function (value, defaultValue) {
    value = ko_unwrap(value);
    if (typeof value === "function") {
        return value;
    }
    if (typeof value === "string") {
        return trim(value) === '' ? defaultValue : value;
    }
    return value == null || value.length == 0 ? defaultValue : value;
};

// Return the value with the search string replaced with the replacement string
filters.replace = function(value, search, replace) {
    return String.prototype.replace.call(ko_unwrap(value), search, replace);
};

filters.fit = function(value, length, replacement, trimWhere) {
    value = ko_unwrap(value);
    if (length && ('' + value).length > length) {
        replacement = '' + (replacement || '...');
        length = length - replacement.length;
        value = '' + value;
        switch (trimWhere) {
            case 'left':
                return replacement + value.slice(-length);
            case 'middle':
                var leftLen = Math.ceil(length / 2);
                return value.substr(0, leftLen) + replacement + value.slice(leftLen-length);
            default:
                return value.substr(0, length) + replacement;
        }
    } else {
        return value;
    }
};

// Convert a model object to JSON
filters.json = function(rootObject, space, replacer) {     // replacer and space are optional
    return ko.toJSON(rootObject, replacer, space);
};

// Format a number using the browser's toLocaleString
filters.number = function(value) {
    return (+ko_unwrap(value)).toLocaleString();
};

// Export the filters object for general access
ko.filters = filters;

// Export the preprocessor functions
ko_punches.textFilter = {
    preprocessor: filterPreprocessor,
    enableForBinding: enableTextFilter
};
// Support dynamically-created, namespaced bindings. The binding key syntax is
// "namespace.binding". Within a certain namespace, we can dynamically create the
// handler for any binding. This is particularly useful for bindings that work
// the same way, but just set a different named value, such as for element
// attributes or CSS classes.
var namespacedBindingMatch = /([^\.]+)\.(.+)/, namespaceDivider = '.';
addBindingHandlerCreator(namespacedBindingMatch, function (match, bindingKey) {
    var namespace = match[1],
        namespaceHandler = ko.bindingHandlers[namespace];
    if (namespaceHandler) {
        var bindingName = match[2],
            handlerFn = namespaceHandler.getNamespacedHandler || defaultGetNamespacedHandler,
            handler = handlerFn.call(namespaceHandler, bindingName, namespace, bindingKey);
        ko.bindingHandlers[bindingKey] = handler;
        return handler;
    }
});

// Knockout's built-in bindings "attr", "event", "css" and "style" include the idea of
// namespaces, representing it using a single binding that takes an object map of names
// to values. This default handler translates a binding of "namespacedName: value"
// to "namespace: {name: value}" to automatically support those built-in bindings.
function defaultGetNamespacedHandler(name, namespace, namespacedName) {
    var handler = ko.utils.extend({}, this);
    function setHandlerFunction(funcName) {
        if (handler[funcName]) {
            handler[funcName] = function(element, valueAccessor) {
                function subValueAccessor() {
                    var result = {};
                    result[name] = valueAccessor();
                    return result;
                }
                var args = Array.prototype.slice.call(arguments, 0);
                args[1] = subValueAccessor;
                return ko.bindingHandlers[namespace][funcName].apply(this, args);
            };
        }
    }
    // Set new init and update functions that wrap the originals
    setHandlerFunction('init');
    setHandlerFunction('update');
    // Clear any preprocess function since preprocessing of the new binding would need to be different
    if (handler.preprocess)
        handler.preprocess = null;
    if (ko.virtualElements.allowedBindings[namespace])
        ko.virtualElements.allowedBindings[namespacedName] = true;
    return handler;
}

// Adds a preprocess function for every generated namespace.x binding. This can
// be called multiple times for the same binding, and the preprocess functions will
// be chained. If the binding has a custom getNamespacedHandler method, make sure that
// it's set before this function is used.
function addDefaultNamespacedBindingPreprocessor(namespace, preprocessFn) {
    var handler = ko.getBindingHandler(namespace);
    if (handler) {
        var previousHandlerFn = handler.getNamespacedHandler || defaultGetNamespacedHandler;
        handler.getNamespacedHandler = function() {
            return addBindingPreprocessor(previousHandlerFn.apply(this, arguments), preprocessFn);
        };
    }
}

function autoNamespacedPreprocessor(value, binding, addBinding) {
    if (value.charAt(0) !== "{")
        return value;

    // Handle two-level binding specified as "binding: {key: value}" by parsing inner
    // object and converting to "binding.key: value"
    var subBindings = ko.expressionRewriting.parseObjectLiteral(value);
    ko.utils.arrayForEach(subBindings, function(keyValue) {
        addBinding(binding + namespaceDivider + keyValue.key, keyValue.value);
    });
}

// Set the namespaced preprocessor for a specific binding
function enableAutoNamespacedSyntax(bindingKeyOrHandler) {
    addBindingPreprocessor(bindingKeyOrHandler, autoNamespacedPreprocessor);
}

// Export the preprocessor functions
ko_punches.namespacedBinding = {
    defaultGetHandler: defaultGetNamespacedHandler,
    setDefaultBindingPreprocessor: addDefaultNamespacedBindingPreprocessor,    // for backwards compat.
    addDefaultBindingPreprocessor: addDefaultNamespacedBindingPreprocessor,
    preprocessor: autoNamespacedPreprocessor,
    enableForBinding: enableAutoNamespacedSyntax
};
// Wrap a callback function in an anonymous function so that it is called with the appropriate
// "this" value.
function wrappedCallbackPreprocessor(val) {
    // Matches either an isolated identifier or something ending with a property accessor
    if (/^([$_a-z][$\w]*|.+(\.\s*[$_a-z][$\w]*|\[.+\]))$/i.test(val)) {
        return 'function(_x,_y,_z){return(' + val + ')(_x,_y,_z);}';
    } else {
        return val;
    }
}

// Set the wrappedCallback preprocessor for a specific binding
function enableWrappedCallback(bindingKeyOrHandler) {
    addBindingPreprocessor(bindingKeyOrHandler, wrappedCallbackPreprocessor);
}

// Export the preprocessor functions
ko_punches.wrappedCallback = {
    preprocessor: wrappedCallbackPreprocessor,
    enableForBinding: enableWrappedCallback
};
// Attach a preprocess function to a specific property of a binding. This allows you to
// preprocess binding "options" using the same preprocess functions that work for bindings.
function addBindingPropertyPreprocessor(bindingKeyOrHandler, property, preprocessFn) {
    var handler = getOrCreateHandler(bindingKeyOrHandler);
    if (!handler._propertyPreprocessors) {
        // Initialize the binding preprocessor
        chainPreprocessor(handler, 'preprocess', propertyPreprocessor);
        handler._propertyPreprocessors = {};
    }
    // Add the property preprocess function
    chainPreprocessor(handler._propertyPreprocessors, property, preprocessFn);
}

// In order to preprocess a binding property, we have to preprocess the binding itself.
// This preprocess function splits up the binding value and runs each property's preprocess
// function if it's set.
function propertyPreprocessor(value, binding, addBinding) {
    if (value.charAt(0) !== "{")
        return value;

    var subBindings = ko.expressionRewriting.parseObjectLiteral(value),
        resultStrings = [],
        propertyPreprocessors = this._propertyPreprocessors || {};
    ko.utils.arrayForEach(subBindings, function(keyValue) {
        var prop = keyValue.key, propVal = keyValue.value;
        if (propertyPreprocessors[prop]) {
            propVal = propertyPreprocessors[prop](propVal, prop, addBinding);
        }
        if (propVal) {
            resultStrings.push("'" + prop + "':" + propVal);
        }
    });
    return "{" + resultStrings.join(",") + "}";
}

// Export the preprocessor functions
ko_punches.preprocessBindingProperty = {
    setPreprocessor: addBindingPropertyPreprocessor,     // for backwards compat.
    addPreprocessor: addBindingPropertyPreprocessor
};
// Wrap an expression in an anonymous function so that it is called when the event happens
function makeExpressionCallbackPreprocessor(args) {
    return function expressionCallbackPreprocessor(val) {
        return 'function('+args+'){return(' + val + ');}';
    };
}

var eventExpressionPreprocessor = makeExpressionCallbackPreprocessor("$data,$event");

// Set the expressionCallback preprocessor for a specific binding
function enableExpressionCallback(bindingKeyOrHandler, args) {
    var args = Array.prototype.slice.call(arguments, 1).join();
    addBindingPreprocessor(bindingKeyOrHandler, makeExpressionCallbackPreprocessor(args));
}

// Export the preprocessor functions
ko_punches.expressionCallback = {
    makePreprocessor: makeExpressionCallbackPreprocessor,
    eventPreprocessor: eventExpressionPreprocessor,
    enableForBinding: enableExpressionCallback
};

// Create an "on" namespace for events to use the expression method
ko.bindingHandlers.on = {
    getNamespacedHandler: function(eventName) {
        var handler = ko.getBindingHandler('event' + namespaceDivider + eventName);
        return addBindingPreprocessor(handler, eventExpressionPreprocessor);
    }
};
// Performance comparison at http://jsperf.com/markup-interpolation-comparison
function parseInterpolationMarkup(textToParse, outerTextCallback, expressionCallback) {
    function innerParse(text) {
        var innerMatch = text.match(/^([\s\S]*)}}([\s\S]*?)\{\{([\s\S]*)$/);
        if (innerMatch) {
            innerParse(innerMatch[1]);
            outerTextCallback(innerMatch[2]);
            expressionCallback(innerMatch[3]);
        } else {
            expressionCallback(text);
        }
    }
    var outerMatch = textToParse.match(/^([\s\S]*?)\{\{([\s\S]*)}}([\s\S]*)$/);
    if (outerMatch) {
        outerTextCallback(outerMatch[1]);
        innerParse(outerMatch[2]);
        outerTextCallback(outerMatch[3]);
    }
}

function trim(string) {
    return string == null ? '' :
        string.trim ?
            string.trim() :
            string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
}

function interpolationMarkupPreprocessor(node) {
    // only needs to work with text nodes
    if (node.nodeType === 3 && node.nodeValue && node.nodeValue.indexOf('{{') !== -1 && (node.parentNode || {}).nodeName != "TEXTAREA") {
        var nodes = [];
        function addTextNode(text) {
            if (text)
                nodes.push(document.createTextNode(text));
        }
        function wrapExpr(expressionText) {
            if (expressionText)
                nodes.push.apply(nodes, ko_punches_interpolationMarkup.wrapExpression(expressionText, node));
        }
        parseInterpolationMarkup(node.nodeValue, addTextNode, wrapExpr)

        if (nodes.length) {
            if (node.parentNode) {
                for (var i = 0, n = nodes.length, parent = node.parentNode; i < n; ++i) {
                    parent.insertBefore(nodes[i], node);
                }
                parent.removeChild(node);
            }
            return nodes;
        }
    }
}

if (!ko.virtualElements.allowedBindings.html) {
    // Virtual html binding
    // SO Question: http://stackoverflow.com/a/15348139
    var overridden = ko.bindingHandlers.html.update;
    ko.bindingHandlers.html.update = function (element, valueAccessor) {
        if (element.nodeType === 8) {
            var html = ko_unwrap(valueAccessor());
            if (html != null) {
                var parsedNodes = ko.utils.parseHtmlFragment('' + html);
                ko.virtualElements.setDomNodeChildren(element, parsedNodes);
            } else {
                ko.virtualElements.emptyNode(element);
            }
        } else {
            overridden(element, valueAccessor);
        }
    };
    ko.virtualElements.allowedBindings.html = true;
}

function wrapExpression(expressionText, node) {
    var ownerDocument = node ? node.ownerDocument : document,
        closeComment = true,
        binding,
        expressionText = trim(expressionText),
        firstChar = expressionText[0],
        lastChar = expressionText[expressionText.length - 1],
        result = [],
        matches;

    if (firstChar === '#') {
        if (lastChar === '/') {
            binding = expressionText.slice(1, -1);
        } else {
            binding = expressionText.slice(1);
            closeComment = false;
        }
        if (matches = binding.match(/^([^,"'{}()\/:[\]\s]+)\s+([^\s:].*)/)) {
            binding = matches[1] + ':' + matches[2];
        }
    } else if (firstChar === '/') {
        // replace only with a closing comment
    } else if (firstChar === '{' && lastChar === '}') {
        binding = "html:" + trim(expressionText.slice(1, -1));
    } else {
        binding = "text:" + trim(expressionText);
    }

    if (binding)
        result.push(ownerDocument.createComment("ko " + binding));
    if (closeComment)
        result.push(ownerDocument.createComment("/ko"));
    return result;
};

function enableInterpolationMarkup() {
    addNodePreprocessor(interpolationMarkupPreprocessor);
}

// Export the preprocessor functions
var ko_punches_interpolationMarkup = ko_punches.interpolationMarkup = {
    preprocessor: interpolationMarkupPreprocessor,
    enable: enableInterpolationMarkup,
    wrapExpression: wrapExpression
};


var dataBind = 'data-bind';
function attributeInterpolationMarkerPreprocessor(node) {
    if (node.nodeType === 1 && node.attributes.length) {
        var dataBindAttribute = node.getAttribute(dataBind);
        for (var attrs = ko.utils.arrayPushAll([], node.attributes), n = attrs.length, i = 0; i < n; ++i) {
            var attr = attrs[i];
            if (attr.specified && attr.name != dataBind && attr.value.indexOf('{{') !== -1) {
                var parts = [], attrValue = '';
                function addText(text) {
                    if (text)
                        parts.push('"' + text.replace(/"/g, '\\"') + '"');
                }
                function addExpr(expressionText) {
                    if (expressionText) {
                        attrValue = expressionText;
                        parts.push('ko.unwrap(' + expressionText + ')');
                    }
                }
                parseInterpolationMarkup(attr.value, addText, addExpr);

                if (parts.length > 1) {
                    attrValue = '""+' + parts.join('+');
                }

                if (attrValue) {
                    var attrName = attr.name.toLowerCase();
                    var attrBinding = ko_punches_attributeInterpolationMarkup.attributeBinding(attrName, attrValue, node) || attributeBinding(attrName, attrValue, node);
                    if (!dataBindAttribute) {
                        dataBindAttribute = attrBinding
                    } else {
                        dataBindAttribute += ',' + attrBinding;
                    }
                    node.setAttribute(dataBind, dataBindAttribute);
                    // Using removeAttribute instead of removeAttributeNode because IE clears the
                    // class if you use removeAttributeNode to remove the id.
                    node.removeAttribute(attr.name);
                }
            }
        }
    }
}

function attributeBinding(name, value, node) {
    if (ko.getBindingHandler(name)) {
        return name + ':' + value;
    } else {
        return 'attr.' + name + ':' + value;
    }
}

function enableAttributeInterpolationMarkup() {
    addNodePreprocessor(attributeInterpolationMarkerPreprocessor);
}

var ko_punches_attributeInterpolationMarkup = ko_punches.attributeInterpolationMarkup = {
    preprocessor: attributeInterpolationMarkerPreprocessor,
    enable: enableAttributeInterpolationMarkup,
    attributeBinding: attributeBinding
};

    return ko_punches;
}));
;
(function() {
  var objectKeys;

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  if (!this.Maslosoft.Sugar) {
    this.Maslosoft.Sugar = {};
  }

  if (Object.keys) {
    objectKeys = Object.keys;
  } else {
    objectKeys = (function() {
      'use strict';
      var dontEnums, dontEnumsLength, hasDontEnumBug, hasOwnProperty;
      hasOwnProperty = Object.prototype.hasOwnProperty;
      hasDontEnumBug = !{
        toString: null
      }.propertyIsEnumerable('toString');
      dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
      dontEnumsLength = dontEnums.length;
      return function(obj) {
        var i, prop, result;
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }
        result = [];
        prop = void 0;
        i = void 0;
        for (prop in obj) {
          prop = prop;
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
        if (hasDontEnumBug) {
          i = 0;
          while (i < dontEnumsLength) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
            i++;
          }
        }
        return result;
      };
    })();
  }

  this.Maslosoft.Sugar.abstract = function() {
    throw new Error('This method is abstract');
  };

  this.Maslosoft.Sugar.implement = function(parent, interfaceClass) {
    var check;
    check = function() {
      var index, name, ref, results;
      ref = objectKeys(interfaceClass.prototype);
      results = [];
      for (index in ref) {
        name = ref[index];
        if (typeof interfaceClass.prototype[name] === 'function') {
          if (typeof parent.prototype[name] !== 'function') {
            throw new Error("Class " + parent.name + " implementing " + interfaceClass.name + " must have " + name + " method");
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    return setTimeout(check, 0);
  };

  this.Maslosoft.Sugar.mixin = function(parent, trait) {
    var index, name, parentName, ref, results;
    parentName = parent.name;
    ref = objectKeys(trait.prototype);
    results = [];
    for (index in ref) {
      name = ref[index];
      results.push(parent.prototype[name] = trait.prototype[name]);
    }
    return results;
  };

}).call(this);

//# sourceMappingURL=sugar.js.map

(function() {
  var abstract, implement, isArray, isFunction, mixin, parseQueryString,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  mixin = Maslosoft.Sugar.mixin;

  implement = Maslosoft.Sugar.implement;

  abstract = Maslosoft.Sugar.abstract;

  parseQueryString = function(queryString) {
    var i, part, query, result;
    query = queryString.split('&');
    result = {};
    i = 0;
    while (i < query.length) {
      part = query[i].split('=', 2);
      if (part.length === 1) {
        result[part[0]] = '';
      } else {
        result[part[0]] = decodeURIComponent(part[1].replace(/\+/g, ' '));
      }
      ++i;
    }
    return result;
  };

  isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  isArray = function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  this.Maslosoft.Playlist = (function() {
    var frameTemplate;

    Playlist.idCounter = 0;

    frameTemplate = '<iframe src="" frameborder="" webkitAllowFullScreen mozallowfullscreen allowFullScreen scrolling="no" allowtransparency="true"></iframe>';

    Playlist.prototype.id = '';

    Playlist.prototype.frameId = '';

    Playlist.prototype.element = null;

    Playlist.prototype.links = null;

    Playlist.prototype.adapters = [];

    Playlist.prototype.msg = null;

    Playlist.prototype.extractor = null;

    function Playlist(element, options) {
      if (options == null) {
        options = null;
      }
      this.options = new Maslosoft.Playlist.Options(options);
      this.adapters = this.options.adapters;
      this.extractor = new this.options.extractor;
      this.element = jQuery(element);
      if (this.element.id) {
        this.id = this.element.id;
      } else {
        this.id = 'maslosoftPlaylist' + Playlist.idCounter++;
        this.element.prop('id', this.id);
      }
      this.frameId = this.id + "Frame";
      this.build();
      this.msg = new Maslosoft.Playlist.Helpers.Messenger(this.frame);
    }

    Playlist.prototype.build = function() {
      var ad, adapter, currentLink, first, initScroller, j, k, len, len1, link, linkElement, links, playlistHolder, playlistWrapper, ref, src;
      links = this.extractor.getData(this.element);
      this.element.html("<div class='maslosoft-video-embed-wrapper'> <div class='maslosoft-video-embed-container'> " + frameTemplate + " </div> </div>");
      this.playlist = jQuery('<div class="maslosoft-video-playlist" />');
      this.frame = this.element.find('iframe');
      this.frame.prop('id', this.frameId);
      first = true;
      for (j = 0, len = links.length; j < len; j++) {
        link = links[j];
        ref = this.adapters;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          adapter = ref[k];
          if (adapter.match(link.url)) {
            ad = new adapter;
            ad.setUrl(link.url);
            ad.setTitle(link.title);
            linkElement = this.createLink(ad);
            if (first) {
              currentLink = linkElement;
              this.current = ad;
              src = ad.getSrc(this.frame);
              if (src) {
                this.frame.prop('src', src);
              }
              this.frame.one('load', (function(_this) {
                return function(e) {
                  return ad.onEnd(_this.frame, function() {
                    return _this.next(currentLink);
                  });
                };
              })(this));
              linkElement.addClass('active');
              first = false;
            }
          }
        }
      }
      playlistWrapper = jQuery('<div class="maslosoft-video-playlist-wrapper"></div>');
      playlistHolder = jQuery('<div class="maslosoft-video-playlist-holder"></div>');
      playlistHolder.append(this.playlist);
      playlistWrapper.append(playlistHolder);
      this.element.append(playlistWrapper);
      this.links = this.playlist.find('a');
      if (this.links.length === 1) {
        this.element.find('.maslosoft-video-playlist-wrapper').remove();
        this.element.find('.maslosoft-video-embed-wrapper').css('width', '100%');
      }
      if (typeof jQuery.fn.tooltip === 'function') {
        jQuery("#" + this.id).tooltip({
          selector: 'a',
          placement: 'left',
          container: 'body'
        });
      }
      initScroller = (function(_this) {
        return function(e) {
          return new Maslosoft.Playlist.Helpers.Scroller(_this.element, _this.playlist);
        };
      })(this);
      this.frame.on('load', initScroller);
      jQuery(window).on('resize', initScroller);
      initScroller();
      return true;
    };

    Playlist.prototype.next = function(link) {
      var index, j, l, len, ref;
      link = link[0];
      ref = this.links;
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        l = ref[index];
        if (link.id === l.id) {
          break;
        }
      }
      index++;
      if (!this.links[index]) {
        console.log('No more videos');
        this.links.removeClass('active playing');
        if (this.links.get(0)) {
          jQuery(this.links.get(0)).addClass('active');
        }
        return;
      }
      link = this.links[index];
      return link.click();
    };

    Playlist.prototype.createLink = function(adapter) {
      var caption, link, thumbCallback;
      caption = jQuery('<div class="caption"/>');
      caption.html(adapter.getTitle());
      link = jQuery('<a />');
      link.attr('id', adapter.linkId);
      link.attr('title', adapter.getTitle());
      link.attr('href', adapter.getUrl());
      link.attr('rel', 'tooltip');
      link.attr('data-placement', 'left');
      link.attr('data-html', true);
      thumbCallback = function(src) {
        link.css('background-image', "url('" + src + "')");
        return link.attr('title', adapter.getTitle());
      };
      adapter.setThumb(thumbCallback);
      link.html('<i></i>');
      link.on('mouseout', (function(_this) {
        return function(e) {
          if (typeof jQuery.fn.tooltip === 'function') {
            return link.tooltip('hide');
          }
        };
      })(this));
      link.on('click', (function(_this) {
        return function(e) {
          var endCb, loaded, src;
          e.preventDefault();
          console.log('Playing next link...');
          if (typeof jQuery.fn.tooltip === 'function') {
            link.tooltip('hide');
          }
          loaded = true;
          if (adapter !== _this.current) {
            _this.current = adapter;
            loaded = false;
            src = adapter.getSrc(_this.frame);
            if (src) {
              _this.frame.prop('src', src);
            }
          }
          _this.links.removeClass('active playing');
          endCb = function() {
            return _this.next(link);
          };
          if (!loaded) {
            _this.frame.one('load', function(e) {
              adapter.play(_this.frame);
              adapter.onEnd(_this.frame, endCb);
              if (adapter.isPlaying()) {
                return link.addClass('active playing');
              }
            });
          }
          if (loaded) {
            if (adapter.isPlaying()) {
              link.addClass('active');
              adapter.pause(_this.frame);
            } else {
              link.addClass('active playing');
              adapter.play(_this.frame);
              adapter.onEnd(_this.frame, function() {
                return _this.next(link);
              });
            }
          }
          link.addClass('active');
          if (adapter.isPlaying()) {
            return link.addClass('playing');
          } else {
            return link.removeClass('playing');
          }
        };
      })(this));
      this.playlist.append(link);
      return link;
    };

    return Playlist;

  })();

  this.Maslosoft.Playlist.Options = (function() {
    Options.prototype.adapters = [];

    Options.prototype.extractor = null;

    function Options(options) {
      var j, len, name, option;
      if (options == null) {
        options = [];
      }
      this.adapters = new Array;
      for (name = j = 0, len = options.length; j < len; name = ++j) {
        option = options[name];
        this[name] = option;
      }
      if (!this.adapters.length) {
        this.adapters = [Maslosoft.Playlist.Adapters.YouTube, Maslosoft.Playlist.Adapters.Vimeo, Maslosoft.Playlist.Adapters.Dailymotion];
      }
      if (!this.extractor) {
        this.extractor = Maslosoft.Playlist.Extractors.LinkExtractor;
      }
    }

    return Options;

  })();

  if (!this.Maslosoft.Playlist.Adapters) {
    this.Maslosoft.Playlist.Adapters = {};
  }

  this.Maslosoft.Playlist.Adapters.Abstract = (function() {
    var title;

    Abstract.idCounter = 0;

    Abstract.initialized = {};

    Abstract.prototype.id = '';

    Abstract.prototype.linkId = '';

    Abstract.prototype.url = '';

    Abstract.prototype.frame = null;

    Abstract.prototype.playing = false;

    title = '';

    function Abstract() {
      var id;
      Abstract.idCounter++;
      this.linkId = "maslosoft-playlist-link-" + Abstract.idCounter;
      id = this.constructor.name;
      if (!Abstract.initialized[id]) {
        Maslosoft.Playlist.Adapters[id].once();
        Abstract.initialized[id] = true;
      }
    }

    Abstract.match = function(url) {};

    Abstract.parseEventData = function(rawData) {
      return JSON.parse(rawData);
    };

    Abstract.once = function(playlist) {};

    Abstract.prototype.setUrl = function(url1) {
      this.url = url1;
    };

    Abstract.prototype.getUrl = function() {
      return this.url;
    };

    Abstract.prototype.setTitle = function(title) {
      return this.title = title;
    };

    Abstract.prototype.getTitle = function() {
      return this.title;
    };

    Abstract.prototype.setThumb = function(thumbCallback) {};

    Abstract.prototype.getSrc = function(frame1) {
      this.frame = frame1;
    };

    Abstract.prototype.isPlaying = function() {
      return this.playing;
    };

    Abstract.prototype.onEnd = function(frame1, event) {
      this.frame = frame1;
    };

    Abstract.prototype.play = function(frame1) {
      this.frame = frame1;
    };

    Abstract.prototype.stop = function(frame1) {
      this.frame = frame1;
    };

    Abstract.prototype.pause = function(frame1) {
      this.frame = frame1;
    };

    return Abstract;

  })();

  if (!this.Maslosoft.Playlist.Adapters) {
    this.Maslosoft.Playlist.Adapters = {};
  }

  this.Maslosoft.Playlist.DailymotionOld = (function(superClass) {
    var apiready, init, ready;

    extend(DailymotionOld, superClass);

    function DailymotionOld() {
      this.setOnEndCallback = bind(this.setOnEndCallback, this);
      this.getSrc = bind(this.getSrc, this);
      return DailymotionOld.__super__.constructor.apply(this, arguments);
    }

    ready = false;

    apiready = false;

    init = jQuery.noop;

    DailymotionOld.prototype.endCallback = null;

    DailymotionOld.match = function(url) {
      return url.match('dailymotion');
    };

    DailymotionOld.once = function() {
      var script, tag;
      script = document.createElement('script');
      script.async = true;
      script.src = 'https://api.dmcdn.net/all.js';
      tag = document.getElementsByTagName('script')[0];
      tag.parentNode.insertBefore(script, tag);
      return window.dmAsyncInit = function() {
        DM.init();
        init();
        return ready = true;
      };
    };

    DailymotionOld.prototype.setUrl = function(url1) {
      var part;
      this.url = url1;
      part = this.url.replace(/.+?\//g, '');
      return this.id = part.replace(/_.+/g, '');
    };

    DailymotionOld.prototype.getSrc = function(frame1) {
      var frameId, params, src;
      this.frame = frame1;
      frameId = this.frame.get(0).id;
      init = (function(_this) {
        return function() {
          var config, player;
          config = {
            video: _this.id,
            params: {
              api: 'postMessage',
              autoplay: ready,
              origin: document.location.protocol + "//" + document.location.hostname,
              id: frameId,
              'endscreen-enable': 0,
              'webkit-playsinline': 1,
              html: 1
            }
          };
          player = DM.player(_this.frame.get(0), config);
          player.addEventListener('apiready', function() {
            console.log('DM API ready');
            apiready = true;
            return _this.playing = ready;
          });
          return player.addEventListener('end', function() {
            console.log('On video end...');
            console.log(_this.endCallback);
            return _this.endCallback();
          });
        };
      })(this);
      if (ready) {
        init();
        return false;
      } else {
        params = ['endscreen-enable=0', 'api=postMessage', 'autoplay=1', "id=" + frameId, "origin=" + document.location.protocol + "//" + document.location.hostname];
        src = ("https://www.dailymotion.com/embed/video/" + this.id + "?") + params.join('&');
        return src;
      }
    };

    DailymotionOld.prototype.setThumb = function(thumbCallback) {
      var url;
      url = "//www.dailymotion.com/thumbnail/video/" + this.id;
      return thumbCallback(url);
    };

    DailymotionOld.prototype.play = function(frame1) {
      this.frame = frame1;
      this.call('play');
      return this.playing = true;
    };

    DailymotionOld.prototype.stop = function(frame1) {
      this.frame = frame1;
      this.call('pause');
      return this.playing = false;
    };

    DailymotionOld.prototype.pause = function(frame1) {
      this.frame = frame1;
      this.call('pause');
      return this.playing = false;
    };

    DailymotionOld.prototype.setOnEndCallback = function(frame1, callback) {
      var e;
      this.frame = frame1;
      try {
        this.endCallback = callback;
        return console.log("Setting callback...");
      } catch (_error) {
        e = _error;
        console.log("Could not set callback...");
        return console.log(e);
      }
    };

    DailymotionOld.prototype.call = function(func, args) {
      var toCall;
      if (args == null) {
        args = [];
      }
      toCall = (function(_this) {
        return function() {
          var data, frameId, iframe, result;
          if (!ready) {
            console.log('Not loaded');
            return;
          }
          if (!apiready) {
            console.log('api not ready, skipping');
            return;
          }
          console.log("Call DM " + func);
          frameId = _this.frame.get(0).id;
          iframe = document.getElementById(frameId);
          data = {
            command: func,
            parameters: args
          };
          return result = iframe.contentWindow.postMessage(JSON.stringify(data), "*");
        };
      })(this);
      return toCall();
    };

    return DailymotionOld;

  })(this.Maslosoft.Playlist.Adapters.Abstract);

  if (!this.Maslosoft.Playlist.Adapters) {
    this.Maslosoft.Playlist.Adapters = {};
  }

  this.Maslosoft.Playlist.Adapters.Dailymotion = (function(superClass) {
    var apiready, init, ready;

    extend(Dailymotion, superClass);

    function Dailymotion() {
      this.onEnd = bind(this.onEnd, this);
      this.getSrc = bind(this.getSrc, this);
      return Dailymotion.__super__.constructor.apply(this, arguments);
    }

    ready = false;

    apiready = false;

    init = jQuery.noop;

    Dailymotion.prototype.endCallback = null;

    Dailymotion.match = function(url) {
      return url.match('dailymotion');
    };

    Dailymotion.parseEventData = function(rawData) {
      return parseQueryString(rawData);
    };

    Dailymotion.once = function() {};

    Dailymotion.prototype.setUrl = function(url1) {
      var part;
      this.url = url1;
      part = this.url.replace(/.+?\//g, '');
      return this.id = part.replace(/_.+/g, '');
    };

    Dailymotion.prototype.getSrc = function(frame1) {
      var frameId, params, src;
      this.frame = frame1;
      frameId = this.frame.get(0).id;
      params = ['endscreen-enable=0', 'api=postMessage', 'autoplay=0', "id=" + frameId, "origin=" + document.location.protocol + "//" + document.location.hostname];
      src = ("https://www.dailymotion.com/embed/video/" + this.id + "?") + params.join('&');
      return src;
    };

    Dailymotion.prototype.setThumb = function(thumbCallback) {
      var url;
      url = "//www.dailymotion.com/thumbnail/video/" + this.id;
      return thumbCallback(url);
    };

    Dailymotion.prototype.play = function(frame1) {
      this.frame = frame1;
      this.call('play');
      return this.playing = true;
    };

    Dailymotion.prototype.stop = function(frame1) {
      this.frame = frame1;
      this.call('pause');
      return this.playing = false;
    };

    Dailymotion.prototype.pause = function(frame1) {
      this.frame = frame1;
      this.call('pause');
      return this.playing = false;
    };

    Dailymotion.prototype.onEnd = function(frame1, callback) {
      var name, onMsg;
      this.frame = frame1;
      onMsg = function(e, data) {
        console.log("onEnd Dailymotion");
        return callback();
      };
      name = "message.maslosoft.playlist.dailymotion.end";
      return this.frame.on(name, onMsg);
    };

    Dailymotion.prototype.call = function(func, args) {
      var toCall;
      if (args == null) {
        args = [];
      }
      toCall = (function(_this) {
        return function() {
          var data, frameId, iframe, result;
          console.log("Call DM " + func);
          frameId = _this.frame.get(0).id;
          iframe = document.getElementById(frameId);
          data = {
            command: func,
            parameters: args
          };
          return result = iframe.contentWindow.postMessage(JSON.stringify(data), "*");
        };
      })(this);
      return toCall();
    };

    return Dailymotion;

  })(this.Maslosoft.Playlist.Adapters.Abstract);

  if (!this.Maslosoft.Playlist.Adapters) {
    this.Maslosoft.Playlist.Adapters = {};
  }

  this.Maslosoft.Playlist.Adapters.Vimeo = (function(superClass) {
    extend(Vimeo, superClass);

    function Vimeo() {
      return Vimeo.__super__.constructor.apply(this, arguments);
    }

    Vimeo.match = function(url) {
      return url.match('vimeo');
    };

    Vimeo.once = function() {
      var script;
      if (typeof Froogaloop !== 'undefined') {
        return;
      }
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//f.vimeocdn.com/js/froogaloop2.min.js";
      return jQuery('head').append(script);
    };

    Vimeo.prototype.setUrl = function(url1) {
      this.url = url1;
      this.id = this.url.replace(/.+\//, '');
      return this.id = this.id.replace(/\?.+/, '');
    };

    Vimeo.prototype.getSrc = function(frame1) {
      var frameId, params, src;
      this.frame = frame1;
      frameId = this.frame.get(0).id;
      params = ['api=1', "player_id=" + frameId];
      src = ("//player.vimeo.com/video/" + this.id + "?") + params.join('&');
      return src;
    };

    Vimeo.prototype.setThumb = function(thumbCallback) {
      return $.ajax({
        type: 'GET',
        url: '//vimeo.com/api/v2/video/' + this.id + '.json',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: (function(_this) {
          return function(data) {
            if (!_this.title) {
              _this.setTitle(data[0].title);
            }
            return thumbCallback(data[0].thumbnail_large);
          };
        })(this)
      });
    };

    Vimeo.prototype.play = function(frame1) {
      this.frame = frame1;
      this.call('play');
      return this.playing = true;
    };

    Vimeo.prototype.stop = function(frame1) {
      this.frame = frame1;
      this.call('unload');
      return this.playing = false;
    };

    Vimeo.prototype.pause = function(frame1) {
      this.frame = frame1;
      this.call('pause');
      return this.playing = false;
    };

    Vimeo.prototype.onEnd = function(frame1, callback) {
      var e, player;
      this.frame = frame1;
      try {
        player = Froogaloop(this.frame.get(0));
        try {
          player.addEvent('ready', (function(_this) {
            return function() {
              return player.addEvent('finish', callback);
            };
          })(this));
        } catch (_error) {
          e = _error;
        }
        try {
          return player.addEvent('finish', callback);
        } catch (_error) {
          e = _error;
        }
      } catch (_error) {
        e = _error;
      }
    };

    Vimeo.prototype.call = function(func, args) {
      var toCall;
      if (args == null) {
        args = [];
      }
      toCall = (function(_this) {
        return function() {
          var data, frameId, iframe, result;
          console.log("Call " + func);
          frameId = _this.frame.get(0).id;
          iframe = document.getElementById(frameId);
          data = {
            "method": func,
            "value": args
          };
          return result = iframe.contentWindow.postMessage(JSON.stringify(data), "*");
        };
      })(this);
      setTimeout(toCall, 0);
      return setTimeout(toCall, 500);
    };

    return Vimeo;

  })(this.Maslosoft.Playlist.Adapters.Abstract);

  if (!this.Maslosoft.Playlist.Adapters) {
    this.Maslosoft.Playlist.Adapters = {};
  }

  this.Maslosoft.Playlist.Adapters.YouTube = (function(superClass) {
    extend(YouTube, superClass);

    function YouTube() {
      this.onEnd = bind(this.onEnd, this);
      return YouTube.__super__.constructor.apply(this, arguments);
    }

    YouTube.match = function(url) {
      return url.match('youtube');
    };

    YouTube.once = function() {
      var script;
      if (typeof YT !== 'undefined') {
        return;
      }
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://www.youtube.com/player_api";
      return jQuery('head').append(script);
    };

    YouTube.prototype.setUrl = function(url1) {
      this.url = url1;
      return this.id = this.url.replace(/.+?v=/, '');
    };

    YouTube.prototype.setThumb = function(thumbCallback) {
      return thumbCallback("//img.youtube.com/vi/" + this.id + "/0.jpg");
    };

    YouTube.prototype.getSrc = function(frame1) {
      var params, src;
      this.frame = frame1;
      params = ['enablejsapi=1', 'rel=0', 'controls=2', 'modestbranding=1', "origin=" + document.location.protocol + "//" + document.location.hostname];
      src = ("//www.youtube.com/embed/" + this.id + "?") + params.join('&');
      console.log(src);
      return src;
    };

    YouTube.prototype.play = function(frame1) {
      this.frame = frame1;
      this.call('playVideo');
      return this.playing = true;
    };

    YouTube.prototype.stop = function(frame1) {
      this.frame = frame1;
      this.call('stopVideo');
      return this.playing = false;
    };

    YouTube.prototype.pause = function(frame1) {
      this.frame = frame1;
      this.call('pauseVideo');
      return this.playing = false;
    };

    YouTube.prototype.onEnd = function(frame1, callback) {
      var infoDelivery, name, onStateChange, player;
      this.frame = frame1;
      player = new YT.Player(this.frame.get(0).id, {
        height: '390',
        width: '640',
        videoId: this.id,
        events: {
          'onStateChange': jQuery.noop
        }
      });
      onStateChange = function(e, data) {
        if (data.info === 0) {
          return callback();
        }
      };
      name = "message.maslosoft.playlist.youtube.onStateChange";
      this.frame.on(name, onStateChange);
      infoDelivery = (function(_this) {
        return function(e, data) {
          if (data.info.currentTime === data.info.duration) {
            return _this.playing = false;
          }
        };
      })(this);
      name = "message.maslosoft.playlist.youtube.infoDelivery";
      return this.frame.on(name, infoDelivery);
    };

    YouTube.prototype.call = function(func, args) {
      var toCall;
      if (args == null) {
        args = [];
      }
      toCall = (function(_this) {
        return function() {
          var data, frameId, iframe, result;
          frameId = _this.frame.get(0).id;
          iframe = document.getElementById(frameId);
          data = {
            "event": "command",
            "func": func,
            "args": args,
            "id": frameId
          };
          return result = iframe.contentWindow.postMessage(JSON.stringify(data), "*");
        };
      })(this);
      setTimeout(toCall, 0);
      return setTimeout(toCall, 500);
    };

    return YouTube;

  })(this.Maslosoft.Playlist.Adapters.Abstract);

  if (!this.Maslosoft.Playlist.Data) {
    this.Maslosoft.Playlist.Data = {};
  }

  this.Maslosoft.Playlist.Data.Video = (function() {
    function Video(options) {
      var j, len, name, option;
      if (options == null) {
        options = [];
      }
      for (name = j = 0, len = options.length; j < len; name = ++j) {
        option = options[name];
        this[name] = option;
      }
    }

    Video.prototype.title = '';

    Video.prototype.url = '';

    return Video;

  })();

  if (!this.Maslosoft.Playlist.Extractors) {
    this.Maslosoft.Playlist.Extractors = {};
  }

  this.Maslosoft.Playlist.Extractors.Abstract = (function() {
    function Abstract() {}

    Abstract.prototype.getData = function(element) {};

    return Abstract;

  })();

  if (!this.Maslosoft.Playlist.Extractors) {
    this.Maslosoft.Playlist.Extractors = {};
  }

  this.Maslosoft.Playlist.Extractors.LinkExtractor = (function() {
    function LinkExtractor() {}

    LinkExtractor.prototype.getData = function(element) {
      var d, data, j, len, link, ref;
      data = [];
      ref = element.find('a');
      for (j = 0, len = ref.length; j < len; j++) {
        link = ref[j];
        d = new Maslosoft.Playlist.Data.Video;
        d.url = link.href;
        d.title = link.innerHTML;
        data.push(d);
      }
      return data;
    };

    return LinkExtractor;

  })();

  if (!this.Maslosoft.Playlist.Helpers) {
    this.Maslosoft.Playlist.Helpers = {};
  }

  Maslosoft.Playlist.Helpers.Messenger = (function() {
    Messenger.prototype.frame = null;

    Messenger.prototype.element = null;

    function Messenger(frame1) {
      this.frame = frame1;
      this.onMessage = bind(this.onMessage, this);
      this.element = this.frame.get(0);
      if (window.addEventListener) {
        window.addEventListener('message', this.onMessage, false);
      } else {
        window.attachEvent('onmessage', this.onMessage);
      }
    }

    Messenger.prototype.onMessage = function(event) {
      var adapter, data, name, ns, parsedData, ref;
      if (this.frame.get(0).contentWindow !== event.source) {
        return;
      }
      ref = Maslosoft.Playlist.Adapters;
      for (name in ref) {
        adapter = ref[name];
        if (adapter.match(event.origin)) {
          parsedData = adapter.parseEventData(event.data);
          data = [parsedData];
          ns = "message.maslosoft.playlist." + (name.toLowerCase());
          ns = ns + "." + parsedData.event;
          console.log(ns);
          this.frame.trigger(ns, data);
          return;
        }
      }
    };

    return Messenger;

  })();

  if (!this.Maslosoft.Playlist.Helpers) {
    this.Maslosoft.Playlist.Helpers = {};
  }

  this.Maslosoft.Playlist.Helpers.Scroller = (function() {
    Scroller.holder = null;

    Scroller.playlist = null;

    function Scroller(element, playlist1) {
      var applyHeight;
      this.playlist = playlist1;
      applyHeight = (function(_this) {
        return function() {
          var container, frame, height, list;
          frame = element.find('.maslosoft-video-embed-container iframe');
          _this.holder = _this.playlist.parent();
          _this.holder.height(frame.height());
          list = element.find('.maslosoft-video-playlist');
          height = list.height();
          list.css({
            'height': height + "px"
          });
          container = element.find('.maslosoft-video-playlist-holder');
          return Maslosoft.Ps.initialize(container.get(0));
        };
      })(this);
      setTimeout(applyHeight, 0);
    }

    return Scroller;

  })();

}).call(this);

//# sourceMappingURL=playlist-standalone.js.map

/* perfect-scrollbar v0.6.14 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ps = require('../main');

if (typeof define === 'function' && define.amd) {
  // AMD
  define(ps);
} else {
  // Add to a global object.
  Maslosoft.PerfectScrollbar = ps;
  if (typeof Maslosoft.Ps === 'undefined') {
    Maslosoft.Ps = ps;
  }
}

},{"../main":7}],2:[function(require,module,exports){
'use strict';

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};

},{}],3:[function(require,module,exports){
'use strict';

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;

},{}],4:[function(require,module,exports){
'use strict';

var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;

},{}],5:[function(require,module,exports){
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],6:[function(require,module,exports){
'use strict';

var cls = require('./class');
var dom = require('./dom');

var toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
  if (!obj) {
    return null;
  } else if (obj.constructor === Array) {
    return obj.map(clone);
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = clone(original);
  for (var key in source) {
    result[key] = clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return dom.matches(el, "input,[contenteditable]") ||
         dom.matches(el, "select,[contenteditable]") ||
         dom.matches(el, "textarea,[contenteditable]") ||
         dom.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return toInt(dom.css(element, 'width')) +
         toInt(dom.css(element, 'paddingLeft')) +
         toInt(dom.css(element, 'paddingRight')) +
         toInt(dom.css(element, 'borderLeftWidth')) +
         toInt(dom.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

},{"./class":2,"./dom":3}],7:[function(require,module,exports){
'use strict';

var destroy = require('./plugin/destroy');
var initialize = require('./plugin/initialize');
var update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":9,"./plugin/initialize":17,"./plugin/update":21}],8:[function(require,module,exports){
'use strict';

module.exports = {
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
  theme: 'default'
};

},{}],9:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  dom.remove(i.scrollbarX);
  dom.remove(i.scrollbarY);
  dom.remove(i.scrollbarXRail);
  dom.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18}],10:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function (e) { e.stopPropagation(); };

  i.event.bind(i.scrollbarY, 'click', stopPropagation);
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var positionTop = e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    updateScroll(element, 'top', element.scrollTop + direction * i.containerHeight);
    updateGeometry(element);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'click', stopPropagation);
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var positionLeft = e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    updateScroll(element, 'left', element.scrollLeft + direction * i.containerWidth);
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};

},{"../instances":18,"../update-geometry":19,"../update-scroll":20}],11:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = _.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = _.toInt(dom.css(i.scrollbarX, 'left')) * i.railXRatio;
    _.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = _.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = _.toInt(dom.css(i.scrollbarY, 'top')) * i.railYRatio;
    _.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

},{"../../lib/dom":3,"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],12:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if ((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) {
      return;
    }

    var focused = dom.matches(i.scrollbarX, ':focus') ||
                  dom.matches(i.scrollbarY, ':focus');

    if (!hovered && !focused) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (_.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      if (e.metaKey) {
        deltaX = -i.contentWidth;
      } else if (e.altKey) {
        deltaX = -i.containerWidth;
      } else {
        deltaX = -30;
      }
      break;
    case 38: // up
      if (e.metaKey) {
        deltaY = i.contentHeight;
      } else if (e.altKey) {
        deltaY = i.containerHeight;
      } else {
        deltaY = 30;
      }
      break;
    case 39: // right
      if (e.metaKey) {
        deltaX = i.contentWidth;
      } else if (e.altKey) {
        deltaX = i.containerWidth;
      } else {
        deltaX = 30;
      }
      break;
    case 40: // down
      if (e.metaKey) {
        deltaY = -i.contentHeight;
      } else if (e.altKey) {
        deltaY = -i.containerHeight;
      } else {
        deltaY = -30;
      }
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    updateScroll(element, 'top', element.scrollTop - deltaY);
    updateScroll(element, 'left', element.scrollLeft + deltaX);
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};

},{"../../lib/dom":3,"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],13:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    var child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover');
    if (child) {
      if (!window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
        // if not scrollable
        return false;
      }

      var maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};

},{"../instances":18,"../update-geometry":19,"../update-scroll":20}],14:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":18,"../update-geometry":19}],15:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    _.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'keyup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        _.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        _.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        _.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        _.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],16:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll(element, 'top', element.scrollTop - differenceY);
    updateScroll(element, 'left', element.scrollLeft - differenceX);

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inLocalTouch && i.settings.swipePropagation) {
      touchStart(e);
    }
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = (new Date()).getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  }

  if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element) {
  if (!_.env.supportsTouch && !_.env.supportsIePointer) {
    return;
  }

  var i = instances.get(element);
  bindTouchHandler(element, i, _.env.supportsTouch, _.env.supportsIePointer);
};

},{"../../lib/helper":6,"../instances":18,"../update-geometry":19,"../update-scroll":20}],17:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');

// Handlers
var handlers = {
  'click-rail': require('./handler/click-rail'),
  'drag-scrollbar': require('./handler/drag-scrollbar'),
  'keyboard': require('./handler/keyboard'),
  'wheel': require('./handler/mouse-wheel'),
  'touch': require('./handler/touch'),
  'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);
};

},{"../lib/class":2,"../lib/helper":6,"./handler/click-rail":10,"./handler/drag-scrollbar":11,"./handler/keyboard":12,"./handler/mouse-wheel":13,"./handler/native-scroll":14,"./handler/selection":15,"./handler/touch":16,"./instances":18,"./update-geometry":19}],18:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var defaultSettings = require('./default-setting');
var dom = require('../lib/dom');
var EventManager = require('../lib/event-manager');
var guid = require('../lib/guid');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = _.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = dom.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  function focus() {
    cls.add(element, 'ps-focus');
  }

  function blur() {
    cls.remove(element, 'ps-focus');
  }

  i.scrollbarXRail = dom.appendTo(dom.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = dom.appendTo(dom.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarX, 'focus', focus);
  i.event.bind(i.scrollbarX, 'blur', blur);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _.toInt(dom.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _.toInt(dom.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = _.toInt(dom.css(i.scrollbarXRail, 'borderLeftWidth')) + _.toInt(dom.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  dom.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = dom.appendTo(dom.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = dom.appendTo(dom.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarY, 'focus', focus);
  i.event.bind(i.scrollbarY, 'blur', blur);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _.toInt(dom.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _.toInt(dom.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = _.toInt(dom.css(i.scrollbarYRail, 'borderTopWidth')) + _.toInt(dom.css(i.scrollbarYRail, 'borderBottomWidth'));
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));
  dom.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};

},{"../lib/class":2,"../lib/dom":3,"../lib/event-manager":4,"../lib/guid":5,"../lib/helper":6,"./default-setting":8}],19:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateScroll = require('./update-scroll');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom.css(i.scrollbarYRail, yRailOffset);

  dom.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  dom.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    cls.add(element, 'ps-active-x');
  } else {
    cls.remove(element, 'ps-active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls.add(element, 'ps-active-y');
  } else {
    cls.remove(element, 'ps-active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }
};

},{"../lib/class":2,"../lib/dom":3,"../lib/helper":6,"./instances":18,"./update-scroll":20}],20:[function(require,module,exports){
'use strict';

var instances = require('./instances');

var lastTop;
var lastLeft;

var createDOMEvent = function (name) {
  var event = document.createEvent("Event");
  event.initEvent(name, true, true);
  return event;
};

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-y-reach-start'));
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-x-reach-start'));
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(createDOMEvent('ps-y-reach-end'));
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(createDOMEvent('ps-x-reach-end'));
  }

  if (!lastTop) {
    lastTop = element.scrollTop;
  }

  if (!lastLeft) {
    lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-up'));
  }

  if (axis === 'top' && value > lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-down'));
  }

  if (axis === 'left' && value < lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-left'));
  }

  if (axis === 'left' && value > lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-right'));
  }

  if (axis === 'top') {
    element.scrollTop = lastTop = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-y'));
  }

  if (axis === 'left') {
    element.scrollLeft = lastLeft = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-x'));
  }

};

},{"./instances":18}],21:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');
var updateScroll = require('./update-scroll');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom.css(i.scrollbarXRail, 'display', 'none');
  dom.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  dom.css(i.scrollbarXRail, 'display', '');
  dom.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":3,"../lib/helper":6,"./instances":18,"./update-geometry":19,"./update-scroll":20}]},{},[1]);
;
(function() {
  "use strict";
  /*
   * Number.prototype.format(n, x, s, c)
   * @see http://stackoverflow.com/a/14428340/5444623
   * @param float   number: number to format
   * @param integer n: length of decimal
   * @param integer x: length of whole part
   * @param mixed   s: sections delimiter
   * @param mixed   c: decimal delimiter
   */
  var ModelProxyHandler, PluginsManager, TreeDnd, TreeDrag, TreeEvents, TreeNodeCache, TreeNodeFinder, TreeNodeRenderer, ValidationManager, assert, ensureAttribute, entityMap, equals, error, escapeHtml, escapeRegExp, initMap, isPlainObject, lcfirst, log, numberFormat, preload, preloadedImages, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref3, ref30, ref31, ref32, ref33, ref34, ref35, ref36, ref37, ref38, ref39, ref4, ref40, ref41, ref42, ref43, ref44, ref45, ref5, ref6, ref7, ref8, ref9, setRefByName, stringToColour, ucfirst, warn,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

  assert = function(expr) {
    if (!console) {
      return;
    }
    return console.assert.apply(console, arguments);
  };

  log = function(expr) {
    if (!console) {
      return;
    }
    return console.log.apply(console, arguments);
  };

  warn = function(expr, element = null) {
    if (!console) {
      return;
    }
    return console.warn.apply(console, arguments);
  };

  error = function(expr, element = null) {
    if (!console) {
      return;
    }
    return console.error.apply(console, arguments);
  };

  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  isPlainObject = function(obj) {
    return !!obj && typeof obj === 'object' && obj.constructor === Object;
  };

  if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var dontEnums, dontEnumsLength, hasDontEnumBug, hasOwnProperty;
      hasOwnProperty = Object.prototype.hasOwnProperty;
      hasDontEnumBug = !{
        toString: null
      }.propertyIsEnumerable('toString');
      dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
      dontEnumsLength = dontEnums.length;
      return function(obj) {
        var i, prop, result;
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }
        result = [];
        prop = void 0;
        i = void 0;
        for (prop in obj) {
          prop = prop;
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
        if (hasDontEnumBug) {
          i = 0;
          while (i < dontEnumsLength) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
            i++;
          }
        }
        return result;
      };
    })();
  }

  setRefByName = function(name, value, context = window) {
    var args, func, i, j, len, n, ns;
    args = Array.prototype.slice.call(arguments, 2);
    ns = name.split(".");
    func = context;
    for (i = j = 0, len = ns.length; j < len; i = ++j) {
      n = ns[i];
      console.log(i);
      if (i === ns.length - 1) {
        console.log(n);
        func[n] = value;
      }
      func = func[n];
    }
    return func;
  };

  escapeRegExp = function(str) {
    // $& means the whole matched string
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  escapeHtml = function(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function(s) {
      return entityMap[s];
    });
  };

  
  // Compare objects for equallness.

  // Example:
  // equals({x: 2}, {x: 2}); // Returns true

  // Optionally skip properties (recursively) to compare:
  // equals({x: 2, y: false}, {x: 2, y: true}, ['y']); // Returns true
  // equals({y: false, x: 2, z: {x: 1, y: 1}}, {x: 2, y: true, z: {x: 1, y: 2}}, ['y']); // Returns true

  // @link https://stackoverflow.com/a/6713782/5444623

  equals = function(x, y, skip = []) {
    var doSkip, p;
    doSkip = function(property) {
      return skip.indexOf(property) !== -1;
    };
    // if both x and y are null or undefined and exactly the same
    if (x === y) {
      return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    if (x.constructor !== y.constructor) {
      return false;
    }
    for (p in x) {
      if (doSkip(p)) {
        continue;
      }
      if (!x.hasOwnProperty(p)) {
        continue;
      }
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      // if they have the same strict value or identity then they are equal
      if (x[p] === y[p]) {
        continue;
      }
      // Numbers, Strings, Functions, Booleans must be strictly equal
      if (typeof x[p] !== 'object') {
        return false;
      }
      if (!equals(x[p], y[p], skip)) {
        return false;
      }
    }
    for (p in y) {
      if (doSkip(p)) {
        continue;
      }
      p = p;
      // allows x[ p ] to be set to undefined
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  };

  
  // Generate CSS hex color based on input string

  stringToColour = function(str) {
    var colour, hash, i, value;
    hash = 0;
    i = 0;
    i = 0;
    while (i < str.length) {
      hash = str.charCodeAt(i) + (hash << 5) - hash;
      i++;
    }
    colour = '#';
    i = 0;
    while (i < 3) {
      value = hash >> i * 8 & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
      i++;
    }
    return colour;
  };

  preloadedImages = {};

  
  // Preload image of element
  // @param element DomElement

  preload = function(element, src) {
    var image;
    if (preloadedImages[src]) {
      element.attr("src", src);
      return;
    }
    image = new Image();
    image.src = src;
    return image.onload = function() {
      image = null;
      preloadedImages[src] = true;
      return element.attr("src", src);
    };
  };

  ensureAttribute = function(element, attribute) {
    var attr;
    if (!element.hasAttribute(attribute)) {
      attr = document.createAttribute(attribute);
      attr.value = '';
      element.setAttributeNode(attr);
      element.setAttribute(attribute, '');
      return jQuery(element).attr(attribute, '');
    }
  };

  numberFormat = function(number, n = 2, x = 3, s = ' ', c = ',') {
    var num, re;
    re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
    num = number.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  };

  lcfirst = function(str) {
    return str = str.substring(0, 1).toLocaleLowerCase() + str.substring(1);
  };

  ucfirst = function(str) {
    return str = str.substring(0, 1).toLocaleUpperCase() + str.substring(1);
  };

  "use strict";

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  if (!this.Maslosoft.Ko) {
    this.Maslosoft.Ko = {};
  }

  if (!this.Maslosoft.Ko.Balin) {
    this.Maslosoft.Ko.Balin = {};
  }

  if (!this.Maslosoft.Binder) {
    this.Maslosoft.Binder = {};
  }

  if (!this.Maslosoft.Binder.Helpers) {
    this.Maslosoft.Binder.Helpers = {};
  }

  if (!this.Maslosoft.Binder.Widgets) {
    this.Maslosoft.Binder.Widgets = {};
  }

  
  // Extra utils

  // Debounce function
  // @link https://john-dugan.com/javascript-debounce/

  this.Maslosoft.Ko.debounce = function(func, wait, immediate) {
    var timeout;
    timeout = void 0;
    return function() {
      var args, callNow, context, later;
      context = this;
      args = arguments;
      later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait || 200);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  
  // Register binding handler
  // @param string name
  // @params Maslosoft.Binder.Base handler

  this.Maslosoft.Binder.register = function(name, handler) {
    var name2;
    name2 = false;
    if (name.match(/[A-Z]/)) {
      name2 = name.toLowerCase();
    }
    // Assign two way. Not sure if necessary in current ko
    if (handler.writable) {
      if (ko.expressionRewriting && ko.expressionRewriting.twoWayBindings) {
        ko.expressionRewriting.twoWayBindings[name] = true;
        if (name2) {
          ko.expressionRewriting.twoWayBindings[name2] = true;
        }
      }
    }
    ko.bindingHandlers[name] = handler;
    // Lower-case version of binding handler for punches
    if (name2) {
      return ko.bindingHandlers[name2] = handler;
    }
  };

  //Reassign options
  //ko.bindingHandlers[name].options = JSON.parse(JSON.stringify(handler.options))

  // Register default set of binding handlers, or part of default set

  this.Maslosoft.Binder.registerDefaults = function(handlers = null) {
    var config, index, results, results1, value;
    // In alphabetical order
    config = {
      acl: Maslosoft.Binder.Acl,
      active: Maslosoft.Binder.Active,
      action: Maslosoft.Binder.WidgetAction,
      activity: Maslosoft.Binder.WidgetActivity,
      asset: Maslosoft.Binder.Asset,
      cssClasses: Maslosoft.Binder.CssClasses,
      cssColumnSizes: Maslosoft.Binder.CssColumnSizes,
      cssColumns: Maslosoft.Binder.CssColumns,
      data: Maslosoft.Binder.Data,
      dateFormatter: Maslosoft.Binder.DateFormatter,
      datePicker: Maslosoft.Binder.DatePicker,
      datePickerPickaDate: Maslosoft.Binder.PickaDate,
      dateTimeFormatter: Maslosoft.Binder.DateTimeFormatter,
      decimalFormatter: Maslosoft.Binder.DecimalFormatter,
      disabled: Maslosoft.Binder.Disabled,
      enumCssClassFormatter: Maslosoft.Binder.EnumCssClassFormatter,
      enumFormatter: Maslosoft.Binder.EnumFormatter,
      eval: Maslosoft.Binder.Eval,
      fancytree: Maslosoft.Binder.Fancytree,
      fileSizeFormatter: Maslosoft.Binder.FileSizeFormatter,
      googlemap: Maslosoft.Binder.GoogleMap,
      hidden: Maslosoft.Binder.Hidden,
      href: Maslosoft.Binder.Href,
      html: Maslosoft.Binder.Html,
      htmlTree: Maslosoft.Binder.HtmlTree,
      htmlValue: Maslosoft.Binder.HtmlValue,
      icon: Maslosoft.Binder.Icon,
      id: Maslosoft.Binder.Id,
      log: Maslosoft.Binder.Log,
      model: Maslosoft.Binder.DataModel,
      placeholder: Maslosoft.Binder.Placeholder,
      ref: Maslosoft.Binder.Widget,
      src: Maslosoft.Binder.Src,
      tags: Maslosoft.Binder.Tags,
      text: Maslosoft.Binder.Text,
      textToBg: Maslosoft.Binder.TextToBg,
      textValue: Maslosoft.Binder.TextValue,
      textValueHlJs: Maslosoft.Binder.TextValueHLJS,
      timeAgoFormatter: Maslosoft.Binder.TimeAgoFormatter,
      timeFormatter: Maslosoft.Binder.TimeFormatter,
      timePicker: Maslosoft.Binder.TimePicker,
      tooltip: Maslosoft.Binder.Tooltip,
      treegrid: Maslosoft.Binder.TreeGrid,
      treegridnode: Maslosoft.Binder.TreeGridNode,
      selected: Maslosoft.Binder.Selected,
      select2: Maslosoft.Binder.Select2,
      validator: Maslosoft.Binder.Validator,
      videoPlaylist: Maslosoft.Binder.VideoPlaylist,
      videoThumb: Maslosoft.Binder.VideoThumb,
      widget: Maslosoft.Binder.Widget
    };
    if (handlers !== null) {
      results = [];
      for (index in handlers) {
        value = handlers[index];
        results.push(Maslosoft.Binder.register(value, new config[value]()));
      }
      return results;
    } else {
      results1 = [];
      for (index in config) {
        value = config[index];
        results1.push(Maslosoft.Binder.register(index, new value()));
      }
      return results1;
    }
  };

  
  // Register default set of event handlers, or part of default set

  this.Maslosoft.Binder.registerEvents = function(handlers = null) {
    var config, index, results, results1, value;
    config = {'dblclick': 'dblclick', 'mousedown': 'mousedown', 'mouseup': 'mouseup', 'mouseover': 'mouseover', 'mouseout': 'mouseout'};
    if (handlers !== null) {
      results = [];
      for (index in handlers) {
        value = handlers[index];
        results.push(Maslosoft.Binder.makeEventHandlerShortcut(value));
      }
      return results;
    } else {
      results1 = [];
      for (index in config) {
        value = config[index];
        results1.push(Maslosoft.Binder.makeEventHandlerShortcut(value));
      }
      return results1;
    }
  };

  this.Maslosoft.Binder.makeEventHandlerShortcut = function(eventName) {
    ko.bindingHandlers[eventName] = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var newValueAccessor;
        newValueAccessor = function() {
          var result;
          result = {};
          result[eventName] = valueAccessor();
          return result;
        };
        return ko.bindingHandlers["event"]["init"].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
      }
    };
  };

  
  // Base class for Maslosoft binding handlers

  this.Maslosoft.Binder.Base = (function() {
    class Base {
      // Class constructor
      // @param options @Maslosoft.Binder.Options

      constructor(options = {}) {
        var name, value;
        
        // Get value from model

        this.getValue = this.getValue.bind(this);
        //	Set ref to current object, not prototype
        this.options = {};
        for (name in options) {
          value = options[name];
          this.options[name] = value;
        }
      }

      getValue(valueAccessor, defaults = '') {
        var value;
        if (typeof valueAccessor === 'function') {
          value = ko.unwrap(valueAccessor());
        } else {
          value = ko.unwrap(valueAccessor);
        }
        if (this.options.valueField) {
          if (this.options.ec5) {
            value = value[this.options.valueField];
          } else {
            value = value[this.options.valueField]();
          }
        }
        
        // Only use defaults when undefined
        if (typeof value === 'undefined') {
          return defaults;
        }
        return value;
      }

    };

    
    // Whenever to register binding handler as writable
    // @var boolean

    Base.prototype.writable = true;

    
    // @var @Maslosoft.Binder.Options

    Base.prototype.options = {};

    return Base;

  }).call(this);

  this.Maslosoft.Binder.Options = (function() {
    class Options {
      constructor(values = {}) {
        var index, value;
        for (index in values) {
          value = values[index];
          this[index] = value;
        }
        if (this.ec5 === null) {
          this.ec5 = !!ko.track;
        }
        if (this.afterUpdate === null) {
          this.afterUpdate = function(element, value) {};
        }
      }

    };

    // Set this if need to access complex date objects
    // @var string

    Options.prototype.valueField = null;

    // Whenever to use ko ecmascript 5 plugin
    // Will autodetect if not set
    // @var boolean

    Options.prototype.ec5 = null;

    Options.prototype.afterUpdate = null;

    return Options;

  }).call(this);

  
  // Configuration class for css bindings

  this.Maslosoft.Binder.CssOptions = (function() {
    class CssOptions extends this.Maslosoft.Binder.Options {};

    CssOptions.prototype.className = 'active';

    return CssOptions;

  }).call(this);

  
  // Configuration class for date bindings

  this.Maslosoft.Binder.DateOptions = (function() {
    class DateOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    DateOptions.prototype.lang = 'en';

    // Date source format
    // @var string

    DateOptions.prototype.sourceFormat = 'unix';

    // Date display format
    // @var string

    DateOptions.prototype.displayFormat = 'YYYY-MM-DD';

    return DateOptions;

  }).call(this);

  
  // Configuration class for datetime bindings

  this.Maslosoft.Binder.DateTimeOptions = (function() {
    class DateTimeOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    DateTimeOptions.prototype.lang = 'en';

    // DateTime source format
    // @var string

    DateTimeOptions.prototype.sourceFormat = 'unix';

    // DateTime display format
    // @var string

    DateTimeOptions.prototype.displayFormat = 'YYYY-MM-DD hh:mm';

    return DateTimeOptions;

  }).call(this);

  
  // Configuration class for time bindings

  this.Maslosoft.Binder.TimeAgoOptions = (function() {
    class TimeAgoOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    TimeAgoOptions.prototype.lang = 'en';

    // Time source format
    // @var string

    TimeAgoOptions.prototype.sourceFormat = 'unix';

    // Time display format
    // @var string

    TimeAgoOptions.prototype.displayFormat = 'hh:mm';

    return TimeAgoOptions;

  }).call(this);

  
  // Configuration class for time bindings

  this.Maslosoft.Binder.TimeOptions = (function() {
    class TimeOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    TimeOptions.prototype.lang = 'en';

    // Time source format
    // @var string

    TimeOptions.prototype.sourceFormat = 'unix';

    // Time display format
    // @var string

    TimeOptions.prototype.displayFormat = 'hh:mm';

    return TimeOptions;

  }).call(this);

  
  // Configuration class for css bindings

  this.Maslosoft.Binder.ValidatorOptions = (function() {
    class ValidatorOptions extends this.Maslosoft.Binder.Options {};

    
    // Field for class name
    // @var string

    ValidatorOptions.prototype.classField = '_class';

    
    // CSS selector to find parent element
    // @var string

    ValidatorOptions.prototype.parentSelector = '.form-group';

    
    // Failed validation class name.
    // This class will be added to input if validation fails.
    // @var string

    ValidatorOptions.prototype.inputError = 'error';

    
    // Failed validation parent class name.
    // This class will be added to parent of input if validation fails.
    // @var string

    ValidatorOptions.prototype.parentError = 'has-error';

    
    // Warning validation class name.
    // This class will be added to input if validation has warnings.
    // @var string

    ValidatorOptions.prototype.inputWarning = 'warning';

    
    // Warning validation parent class name.
    // This class will be added to parent of input if validation has warnings.
    // @var string

    ValidatorOptions.prototype.parentWarning = 'has-warning';

    
    // Succeed validation class name.
    // This class will be added to input if validation succeds.
    // @var string

    ValidatorOptions.prototype.inputSuccess = 'success';

    
    // Succeed validation parent class name.
    // This class will be added to parent of input if validation succeds.
    // @var string

    ValidatorOptions.prototype.parentSuccess = 'has-success';

    
    // Selector for error messages. Will scope from input parent.
    // @var string

    ValidatorOptions.prototype.errorMessages = '.error-messages';

    
    // Selector for warning messages. Will scope from input parent.
    // @var string

    ValidatorOptions.prototype.warningMessages = '.warning-messages';

    return ValidatorOptions;

  }).call(this);

  this.Maslosoft.Binder.BaseValidator = (function() {
    class BaseValidator {
      constructor(config) {
        var index, value;
        this.reset();
        for (index in config) {
          value = config[index];
          this[index] = null;
          this[index] = value;
        }
      }

      reset() {
        // Dereference/reset
        this.messages = new Array();
        this.rawMessages = new Object();
        this.warningMessages = new Array();
        return this.rawWarningMessages = new Object();
      }

      isValid() {
        throw new Error('Validator must implement `isValid` method');
      }

      getErrors() {
        return this.messages;
      }

      getWarnings() {
        return this.warningMessages;
      }

      
      // Add error message with optional substitution params.

      // Simple example:
      // ```coffee
      // @addError('My error message')
      //	```

      // Automatic substitution with label example:
      // ```coffee
      // @addError('Attribute {attribute} message')
      //	```

      // Will add error message: 'Attribute My attribute message'

      // Substitution with params example:
      // ```coffee
      // @addError('Attribute {name} message', {name: 'John'})
      //	```

      // Will add error message: 'Attribute John message'

      addError(errorMessage, params) {
        var name, rawMessage, ref1, ref2, value;
        // Raw is required for uniquness, see method end
        rawMessage = errorMessage;
        // Apply atribute label first
        errorMessage = errorMessage.replace("{attribute}", this.label);
        ref1 = this;
        // Apply from current validator
        for (name in ref1) {
          value = ref1[name];
          errorMessage = errorMessage.replace(`{${name}}`, value);
        }
// Apply from params
        for (name in params) {
          value = params[name];
          errorMessage = errorMessage.replace(`{${name}}`, value);
        }
        ref2 = this.model;
        // Finally try to apply from model
        for (name in ref2) {
          value = ref2[name];
          errorMessage = errorMessage.replace(`{${name}}`, value);
        }
        // Ensure uniquness
        if (!this.rawMessages[rawMessage]) {
          this.messages.push(errorMessage);
          return this.rawMessages[rawMessage] = true;
        }
      }

      
      // Add warning message with optional substitution params.

      // Simple example:
      // ```coffee
      // @addWarning('My error message')
      //	```

      // Automatic substitution with label example:
      // ```coffee
      // @addWarning('Attribute {attribute} message')
      //	```

      // Will add warning message: 'Attribute My attribute message'

      // Substitution with params example:
      // ```coffee
      // @addWarning('Attribute {name} message', {name: 'John'})
      //	```

      // Will add warning message: 'Attribute John message'

      addWarning(warningMessage, params) {
        var name, rawMessage, ref1, ref2, value;
        // Raw is required for uniquness, see method end
        rawMessage = warningMessage;
        // Apply atribute label first
        warningMessage = warningMessage.replace("{attribute}", this.label);
        ref1 = this;
        // Apply from current validator
        for (name in ref1) {
          value = ref1[name];
          warningMessage = warningMessage.replace(`{${name}}`, value);
        }
// Apply from params
        for (name in params) {
          value = params[name];
          warningMessage = warningMessage.replace(`{${name}}`, value);
        }
        ref2 = this.model;
        // Finally try to apply from model
        for (name in ref2) {
          value = ref2[name];
          warningMessage = warningMessage.replace(`{${name}}`, value);
        }
        // Ensure uniquness
        if (!this.rawWarningMessages[rawMessage]) {
          this.warningMessages.push(warningMessage);
          return this.rawWarningMessages[rawMessage] = true;
        }
      }

    };

    BaseValidator.prototype.label = '';

    BaseValidator.prototype.model = null;

    BaseValidator.prototype.messages = [];

    BaseValidator.prototype.rawMessages = [];

    BaseValidator.prototype.warningMessages = [];

    BaseValidator.prototype.rawWarningMessages = [];

    return BaseValidator;

  }).call(this);

  
  // CSS class binding
  // This adds class from options if value is true

  ref1 = this.Maslosoft.Binder.CssClass = (function() {
    class CssClass extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.update = this.update.bind(this);
      }

      update(element, valueAccessor) {
        var value;
        boundMethodCheck(this, ref1);
        value = this.getValue(valueAccessor);
        if (!!value) {
          ko.utils.toggleDomNodeCssClass(element, this.options.className, true);
        } else {
          ko.utils.toggleDomNodeCssClass(element, this.options.className, false);
        }
      }

    };

    CssClass.prototype.writable = false;

    return CssClass;

  }).call(this);

  
  // CSS class binding
  // This adds class from options if value is true

  ref2 = this.Maslosoft.Binder.CssColumnsBase = (function() {
    class CssColumnsBase extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.applyColumns = this.applyColumns.bind(this);
      }

      applyColumns(element, sizes, config) {
        var name, newClasses, re, reName, size;
        boundMethodCheck(this, ref2);
        newClasses = [];
        for (size in config) {
          name = config[size];
          // Remove previously set classes
          reName = name.replace('{num}', '\\d');
          name = name.replace('{num}', '');
          re = new RegExp(`(?:^|\\s)${reName}+(?!\\S)`, 'g');
          element.className = element.className.replace(re, '');
          newClasses.push(name + sizes[size]);
        }
        jQuery(element).addClass(newClasses.join(' '));
      }

    };

    CssColumnsBase.prototype.writable = false;

    return CssColumnsBase;

  }).call(this);

  
  // Moment formatter class

  ref3 = this.Maslosoft.Binder.MomentFormatter = class MomentFormatter extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      boundMethodCheck(this, ref3);
      moment.locale(this.options.lang);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value;
      boundMethodCheck(this, ref3);
      value = this.getValue(valueAccessor);
      if (!value) {
        element.innerHTML = '';
        return;
      }
      element.innerHTML = moment[this.options.sourceFormat](value).format(this.options.displayFormat);
    }

  };

  
  // Base class for date/time pickers

  this.Maslosoft.Binder.Picker = class Picker extends this.Maslosoft.Binder.Base {};

  
  // Base class for video related bindings

  ref4 = this.Maslosoft.Binder.Video = (function() {
    var adapters, options;

    class Video extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        
        // Check is supported video url
        // @param url string
        // @return false|object

        this.isVideoUrl = this.isVideoUrl.bind(this);
        
        // Will set image src attribute to video thumbnail,
        // or element background-image style if it's not image
        // @param url string
        // @param element DomElement

        this.setThumb = this.setThumb.bind(this);
      }

      isVideoUrl(url) {
        var adapter, j, len;
        boundMethodCheck(this, ref4);
        for (j = 0, len = adapters.length; j < len; j++) {
          adapter = adapters[j];
          if (adapter.match(url)) {
            return adapter;
          }
        }
        return false;
      }

      setThumb(url, element) {
        var ad, adapter, thumbCallback;
        boundMethodCheck(this, ref4);
        if (adapter = this.isVideoUrl(url)) {
          thumbCallback = function(src) {
            if (element.tagName.toLowerCase() === 'img') {
              return element.src = src;
            } else {
              return jQuery(element).css('background-image', `url('${src}')`);
            }
          };
          console.log(url);
          // Init adapter
          ad = new adapter();
          ad.setUrl(url);
          return ad.setThumb(thumbCallback);
        }
      }

    };

    options = null;

    adapters = null;

    jQuery(document).ready(function() {
      // Initalize thumbnails adapters
      options = new Maslosoft.Playlist.Options();
      // Set adapters from options
      return adapters = options.adapters;
    });

    return Video;

  }).call(this);

  ref5 = this.Maslosoft.Binder.WidgetUrl = class WidgetUrl extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.createUrl = this.createUrl.bind(this);
      this.setRel = this.setRel.bind(this);
    }

    getData(element, valueAccessor, allBindings, bindingName) {
      var bindingParams, data, src;
      src = this.getValue(valueAccessor);
      data = {};
      data.id = allBindings.get('widgetId') || src.id;
      if (allBindings.get('widget')) {
        data.id = allBindings.get('widget').id;
      }
      data[bindingName] = allBindings.get(bindingName) || src[bindingName];
      // Need to check for undefined here,
      // as params might be `0` or `` or `false`
      bindingParams = allBindings.get('params');
      if (typeof bindingParams === void 0) {
        data.params = src.params;
      } else {
        data.params = bindingParams;
      }
      data.params = this.getValue(data.params);
      if (typeof src === 'string') {
        data[bindingName] = src;
      }
      return data;
    }

    createUrl(widgetId, action, params, terminator) {
      var args, href, name, value;
      boundMethodCheck(this, ref5);
      args = [];
      if (typeof params === 'string' || typeof params === 'number') {
        // Skip empty strings
        if (params !== "" || typeof params === 'number') {
          args.push("" + params);
        }
      } else {
        for (name in params) {
          value = params[name];
          name = encodeURIComponent("" + name);
          value = encodeURIComponent("" + value);
          args.push(`${name}:${value}`);
        }
      }
      href = `${terminator}${widgetId}.${action}`;
      if (args.length === 0) {
        return href;
      } else {
        args = args.join(',', args);
        return `${href}=${args}`;
      }
    }

    setRel(element) {
      var hasRel, isPlain, j, len, rel, relValue, rels;
      boundMethodCheck(this, ref5);
      hasRel = false;
      isPlain = false;
      rels = [];
      rel = element.getAttribute('rel');
      if (rel) {
        rels = rel.split(' ');
        for (j = 0, len = rels.length; j < len; j++) {
          relValue = rels[j];
          if (relValue === 'plain') {
            isPlain = true;
          }
          if (relValue === 'virtual') {
            hasRel = true;
          }
        }
      }
      if (!hasRel && !isPlain) {
        rels.push('virtual');
      }
      return element.setAttribute('rel', rels.join(' '));
    }

  };

  
  // Acl binding
  // This adds class from options if value is true

  ref6 = this.Maslosoft.Binder.Acl = (function() {
    var allow;

    class Acl extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init() {
        boundMethodCheck(this, ref6);
        if (!Maslosoft.Binder.Acl.allow) {
          throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions");
        }
        if (typeof Maslosoft.Binder.Acl.allow !== 'function') {
          throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions");
        }
      }

      update(element, valueAccessor) {
        var acl, value;
        boundMethodCheck(this, ref6);
        acl = this.getValue(valueAccessor);
        value = Maslosoft.Binder.Acl.allow(acl);
        // Forward to visible
        return ko.bindingHandlers.visible.update(element, function() {
          return value;
        });
      }

    };

    allow = null;

    return Acl;

  }).call(this);

  
  // Disabled binding
  // This adds class from options if value is true

  this.Maslosoft.Binder.Active = class Active extends this.Maslosoft.Binder.CssClass {
    constructor(options) {
      super(new Maslosoft.Binder.CssOptions({
        className: 'active'
      }));
    }

  };

  
  // Asset binding handler

  ref7 = this.Maslosoft.Binder.Asset = class Asset extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var $element, date, extra, height, model, proportional, sec, src, url, width;
      boundMethodCheck(this, ref7);
      $element = $(element);
      // Get dimensions defined by other bindings
      width = allBindings.get('w' || allBindings.get('width' || null));
      height = allBindings.get('h' || allBindings.get('height' || null));
      // Get proportional flag if set
      proportional = allBindings.get('p' || allBindings.get('proportional' || null));
      model = this.getValue(valueAccessor);
      extra = this.getValue(allBindings);
      // Try to get timestamp
      if (model.updateDate) {
        date = model.updateDate;
        if (typeof date === 'number') {
          sec = date;
        }
        if (typeof date.sec === 'number') {
          sec = date.sec;
        }
      }
      url = model.url;
      // Create new url including width, height and if it should cropped proportionally
      src = [];
      // Add base url of asset
      src.push(url);
      // Add width
      if (width) {
        src.push(`w/${width}`);
      }
      // Add height
      if (height) {
        src.push(`h/${height}`);
      }
      // Crop to provided dimensions if not proportional
      if (proportional === false) {
        src.push("p/0");
      }
      // Add timestamp
      if (sec) {
        src.push(sec);
      }
      // Join parts of url
      src = src.join('/');
      if ($element.attr("src") !== src) {
        if (extra.preloader) {
          $element.attr('src', extra.preloader);
        }
        // Preload image
        preload($element, src);
      }
    }

  };

  
  // Enum css class handler

  ref8 = this.Maslosoft.Binder.CssClasses = class CssClasses extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.getClassList = this.getClassList.bind(this);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    getClassList(valueAccessor) {
      var classList, classes;
      boundMethodCheck(this, ref8);
      classes = this.getValue(valueAccessor);
      if (typeof classes === 'undefined') {
        return '';
      }
      if (classes === null) {
        return '';
      }
      if (typeof classes === 'string') {
        classList = classes;
      } else {
        classList = classes.join(' ');
      }
      return classList.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    init(element, valueAccessor) {
      var initialClasses;
      boundMethodCheck(this, ref8);
      initialClasses = this.getClassList(valueAccessor);
      return element.setAttribute('data-css-classes', initialClasses);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var classesToAdd, toRemove;
      boundMethodCheck(this, ref8);
      toRemove = element.getAttribute('data-css-classes');
      ko.utils.toggleDomNodeCssClass(element, toRemove, false);
      classesToAdd = this.getClassList(valueAccessor);
      if (classesToAdd) {
        ko.utils.toggleDomNodeCssClass(element, classesToAdd, true);
      }
      return element.setAttribute('data-css-classes', classesToAdd);
    }

  };

  
  // Enum css class handler

  ref9 = this.Maslosoft.Binder.CssColumns = (function() {
    class CssColumns extends this.Maslosoft.Binder.CssColumnsBase {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor) {
        boundMethodCheck(this, ref9);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var cols, columns, name, ref10, size, sizes, value;
        boundMethodCheck(this, ref9);
        columns = this.getValue(valueAccessor);
        sizes = {};
        ref10 = CssColumns.columns;
        for (size in ref10) {
          name = ref10[size];
          value = parseInt(columns[size]);
          cols = parseInt(12 / value);
          sizes[size] = cols;
        }
        return this.applyColumns(element, sizes, CssColumns.columns);
      }

    };

    CssColumns.columns = {
      'xs': 'col-xs-{num}',
      'sm': 'col-sm-{num}',
      'md': 'col-md-{num}',
      'lg': 'col-lg-{num}'
    };

    return CssColumns;

  }).call(this);

  
  // Enum css class handler

  ref10 = this.Maslosoft.Binder.CssColumnSizes = (function() {
    class CssColumnSizes extends this.Maslosoft.Binder.CssColumnsBase {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor) {
        boundMethodCheck(this, ref10);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var sizes;
        boundMethodCheck(this, ref10);
        sizes = this.getValue(valueAccessor);
        return this.applyColumns(element, sizes, CssColumnSizes.columns);
      }

    };

    CssColumnSizes.columns = {
      'xs': 'col-xs-{num}',
      'sm': 'col-sm-{num}',
      'md': 'col-md-{num}',
      'lg': 'col-lg-{num}'
    };

    return CssColumnSizes;

  }).call(this);

  
  // Data binding handler

  this.Maslosoft.Binder.Data = class Data extends this.Maslosoft.Binder.Base {
    getNamespacedHandler(binding) {
      return {
        update: (element, valueAccessor) => {
          var ref11, value;
          value = this.getValue(valueAccessor);
          if ((ref11 = typeof value) !== 'string' && ref11 !== 'number') {
            value = JSON.stringify(value);
          }
          return element.setAttribute('data-' + binding, value);
        }
      };
    }

  };

  
  // Model binding handler
  // This is to bind selected model properties to data-model field

  ref11 = this.Maslosoft.Binder.DataModel = class DataModel extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var field, fields, j, len, model, modelStub, results;
      boundMethodCheck(this, ref11);
      
      // Setup binding
      model = this.getValue(valueAccessor);
      fields = allBindings.get("fields") || null;
      // Bind all fields if not set `fields` binding
      if (fields === null) {
        this.bindModel(element, model);
        return;
      }
      // Bind only selected fields
      modelStub = {};
      results = [];
      for (j = 0, len = fields.length; j < len; j++) {
        field = fields[j];
        // Filter out undefined model fields
        if (typeof model[field] === 'undefined') {
          warn(`Model field \`${field}\` is undefined on element:`, element);
        } else {
          modelStub[field] = model[field];
        }
        results.push(this.bindModel(element, modelStub));
      }
      return results;
    }

    bindModel(element, model) {
      var modelString, ref12;
      // Do not stringify scalars
      if ((ref12 = typeof value) !== 'string' && ref12 !== 'number') {
        modelString = JSON.stringify(model);
      }
      return element.setAttribute('data-model', modelString);
    }

  };

  
  // Date formatter

  this.Maslosoft.Binder.DateFormatter = class DateFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.DateOptions(options));
    }

  };

  /*
  Date picker
  */
  ref12 = this.Maslosoft.Binder.DatePicker = class DatePicker extends this.Maslosoft.Binder.Picker {
    constructor(options) {
      super(new Maslosoft.Binder.DateOptions(options));
      this.updateModel = this.updateModel.bind(this);
      
      // Get display value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getDisplayValue = this.getDisplayValue.bind(this);
      
      // Get model value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getModelValue = this.getModelValue.bind(this);
      
      // Initialize datepicker

      this.init = this.init.bind(this);
      
      // Update input after model change

      this.update = this.update.bind(this);
    }

    getData(valueAccessor) {
      var value;
      if (!valueAccessor) {
        return '';
      }
      // Verbose syntax, at least {data: data}
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return value.data;
      }
      return value;
    }

    getOptions(allBindingsAccessor) {
      var config, name, options, value;
      options = {
        lang: this.options.lang,
        sourceFormat: this.options.sourceFormat,
        displayFormat: this.options.displayFormat,
        // Format of pickadate is not compatible of this of moment
        format: this.options.displayFormat.toLowerCase(),
        forceParse: false,
        todayHighlight: true,
        showOnFocus: false
      };
      config = allBindingsAccessor.get('dateOptions') || [];
      
      // Only in long notation set options
      if (config) {
        for (name in config) {
          value = config[name];
          // Skip data
          if (name === 'data') {
            continue;
          }
          // Skip template
          if (name === 'template') {
            continue;
          }
          // Special treatment for display format
          if (name === 'format') {
            options.displayFormat = value.toUpperCase();
          }
          options[name] = value;
        }
      }
      return options;
    }

    updateModel(element, valueAccessor, allBindings) {
      var accessor, elementValue, modelValue, options;
      boundMethodCheck(this, ref12);
      options = this.getOptions(allBindings);
      modelValue = this.getData(valueAccessor);
      elementValue = this.getModelValue(element.value, options);
      accessor = valueAccessor();
      // Update only if changed
      if (modelValue !== elementValue) {
        if (accessor && accessor.data) {
          return ko.expressionRewriting.writeValueToProperty(ko.unwrap(valueAccessor()).data, allBindings, 'datePicker.data', elementValue);
        } else {
          return ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue);
        }
      }
    }

    getDisplayValue(value, options) {
      var inputValue;
      boundMethodCheck(this, ref12);
      //console.log value
      if (!value) {
        return '';
      }
      if (value && value.length === 0) {
        return '';
      }
      if (options.sourceFormat === 'unix') {
        inputValue = moment.unix(value).format(options.displayFormat);
      } else {
        inputValue = moment(value, options.sourceFormat).format(options.displayFormat);
      }
      return inputValue;
    }

    getModelValue(value, options) {
      var modelValue;
      boundMethodCheck(this, ref12);
      if (!value) {
        return null;
      }
      if (options.sourceFormat === 'unix') {
        modelValue = moment(value, options.displayFormat).unix();
      } else {
        modelValue = moment(value, options.displayFormat).format(options.sourceFormat);
      }
      return modelValue;
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      var addon, input, isOpen, onChange, onChangeValue, options, template, trigger, value;
      boundMethodCheck(this, ref12);
      options = this.getOptions(allBindingsAccessor);
      value = this.getDisplayValue(this.getData(valueAccessor), options);
      //console.log value
      if (!value) {
        element.value = '';
      } else {
        element.value = value;
      }
      input = jQuery(element);
      if (options.template) {
        template = options.template;
      } else {
        template = `<div class="input-group-addon">
	<a class="picker-trigger-link" style="cursor: pointer;">
		<i class="glyphicon glyphicon-calendar"></i>
	</a>
</div>`;
      }
      addon = jQuery(template);
      addon.insertBefore(input);
      trigger = addon.find('a.picker-trigger-link');
      input.datepicker(options);
      // Trigger only when value has changed, but do not update
      // picker, ie someone is typing-in date
      onChangeValue = (e) => {
        value = input.datepicker('getDate');
        //console.log value, element.value
        if (value) {
          this.updateModel(element, valueAccessor, allBindingsAccessor);
        }
        //console.log 'Changing model... onChangeValue'
        return false;
      };
      // When date is changed and change is confirmed
      onChange = (e) => {
        var parsedDate;
        parsedDate = Date.parse(element.value);
        if (parsedDate && !e.isTrigger) {
          element.value = this.getDisplayValue(Math.round(parsedDate.getTime() / 1000), options);
          this.updateModel(element, valueAccessor, allBindingsAccessor);
          input.datepicker('update');
          return true;
        }
        return false;
      };
      // Don't trigger picker change date, as date need to be parsed by datejs
      input.on('changeDate', (e) => {
        onChangeValue(e);
        return true;
      });
      // Here is actual date change handling
      input.on('change', onChange);
      input.on('blur', onChange);
      // Handle opened state
      isOpen = false;
      input.on('show', (e) => {
        return isOpen = true;
      });
      input.on('hide', (e) => {
        return isOpen = false;
      });
      // Need mousedown or will no hide on second click
      trigger.on('mousedown', function(e) {
        if (isOpen) {
          input.datepicker('hide');
        } else {
          input.datepicker('show');
        }
        e.stopPropagation();
        e.preventDefault();
      });
    }

    update(element, valueAccessor, allBindingsAccessor) {
      var options, val, value;
      boundMethodCheck(this, ref12);
      val = valueAccessor();
      if (val && val.data) {
        ko.utils.setTextContent(element, val.data);
      } else {
        ko.utils.setTextContent(element, val);
      }
      options = this.getOptions(allBindingsAccessor);
      value = this.getDisplayValue(this.getData(valueAccessor), options);
      if (element.value !== value) {
        return element.value = value;
      }
    }

  };

  /*
  One-way date/time formatter
  */
  this.Maslosoft.Binder.DateTimeFormatter = class DateTimeFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.DateTimeOptions(options));
    }

  };

  
  // One-way decimal formatter

  ref13 = this.Maslosoft.Binder.DecimalFormatter = (function() {
    class DecimalFormatter extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindingsAccessor, viewModel) {
        boundMethodCheck(this, ref13);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var bound, config, formatted, j, len, name, names, value;
        boundMethodCheck(this, ref13);
        value = this.getValue(valueAccessor) || 0;
        value = parseFloat(value);
        config = {};
        names = ['precision', 'decimalSeparator', 'thousandSeparator', 'suffix', 'prefix'];
        for (j = 0, len = names.length; j < len; j++) {
          name = names[j];
          // Set global value
          config[name] = this[name];
          
          // Try to set value from bindings
          bound = allBindingsAccessor.get(name);
          if (typeof bound !== 'undefined') {
            config[name] = this.getValue(bound);
          }
        }
        formatted = numberFormat(value, config.precision, 3, config.thousandSeparator, config.decimalSeparator);
        return element.innerHTML = config.prefix + formatted + config.suffix;
      }

    };

    DecimalFormatter.prototype.precision = 2;

    DecimalFormatter.prototype.decimalSeparator = ',';

    DecimalFormatter.prototype.thousandSeparator = ' ';

    DecimalFormatter.prototype.suffix = '';

    DecimalFormatter.prototype.prefix = '';

    return DecimalFormatter;

  }).call(this);

  
  // Disabled binding
  // This adds class from options if value is true

  this.Maslosoft.Binder.Disabled = class Disabled extends this.Maslosoft.Binder.CssClass {
    constructor(options) {
      super(new Maslosoft.Binder.CssOptions({
        className: 'disabled'
      }));
    }

  };

  
  // Enum css class handler

  ref14 = this.Maslosoft.Binder.EnumCssClassFormatter = class EnumCssClassFormatter extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var config, j, len, name, re, ref15;
      boundMethodCheck(this, ref14);
      config = this.getValue(valueAccessor);
      ref15 = config.values;
      
      // Remove previously set classes
      for (j = 0, len = ref15.length; j < len; j++) {
        name = ref15[j];
        re = new RegExp(`(?:^|\\s)${name}(?!\\S)`, 'g');
        element.className = element.className.replace(re, '');
      }
      element.className += ' ' + config.values[config.data];
    }

  };

  
  // Enum binding handler

  ref15 = this.Maslosoft.Binder.EnumFormatter = class EnumFormatter extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var config;
      boundMethodCheck(this, ref15);
      config = this.getValue(valueAccessor);
      if (typeof config.values[config.data] !== 'undefined') {
        element.innerHTML = config.values[config.data];
      } else {
        element.innerHTML = config.data;
      }
    }

  };

  
  // Eval binding handler

  ref16 = this.Maslosoft.Binder.Eval = class Eval extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor) {
      var allowBindings;
      boundMethodCheck(this, ref16);
      // Let bindings proceed as normal *only if* my value is false
      allowBindings = this.getValue(valueAccessor);
      console.log(allowBindings);
      return {
        controlsDescendantBindings: !allowBindings
      };
    }

    update(element, valueAccessor) {
      var allowBindings;
      boundMethodCheck(this, ref16);
      // Let bindings proceed as normal *only if* my value is false
      allowBindings = this.getValue(valueAccessor);
      console.log(allowBindings);
      return {
        controlsDescendantBindings: !allowBindings
      };
    }

  };

  
  // Fancytree binding
  // TODO Allow sytaxes:
  // data-bind="fancytree: data"
  // data-bind="fancytree: {data: data}"
  // data-bind="fancytree: {data: data, options: <fancyTree-options>, autoExpand: true|false}"
  // TODO When using two or more trees from same data, only first one works properly

  ref17 = this.Maslosoft.Binder.Fancytree = (function() {
    class Fancytree extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.handle = this.handle.bind(this);
        this.update = this.update.bind(this);
      }

      getData(valueAccessor) {
        var value;
        // Verbose syntax, at least {data: data}
        value = this.getValue(valueAccessor) || [];
        if (value.data) {
          return value.data;
        }
        return value;
      }

      init(element, valueAccessor, allBindingsAccessor, context) {
        var dnd, drag, events, folderIcon, nodeIcon, nodeRenderer, options, renderer, tree, treeEvents;
        boundMethodCheck(this, ref17);
        tree = this.getData(valueAccessor);
        // Tree options
        options = valueAccessor().options || {};
        events = this.getValue(valueAccessor).on || false;
        // Effects makes updates flickering, disable
        options.toggleEffect = false;
        options.source = tree.children;
        options.extensions = [];
        // Events
        treeEvents = new TreeEvents(tree, events, options);
        // Accessors for dnd and draggable
        dnd = valueAccessor().dnd || false;
        drag = valueAccessor().drag || false;
        if (dnd && drag) {
          throw new Error('Cannot use both `dnd` and `drag`');
        }
        // DND
        if (dnd) {
          options.autoScroll = false;
          options.extensions.push('dnd');
          options.dnd = new TreeDnd(tree, element, treeEvents);
        }
        
        // Draggable only
        if (drag) {
          options.autoScroll = false;
          options.extensions.push('dnd');
          options.dnd = new TreeDrag(tree, element);
        }
        // Node icon and renderer
        nodeIcon = valueAccessor().nodeIcon || false;
        folderIcon = valueAccessor().folderIcon || false;
        nodeRenderer = valueAccessor().nodeRenderer || false;
        
        // Folder icon option
        if (folderIcon && !nodeIcon) {
          warn("Option `folderIcon` require also `nodeIcon` or it will not work at all");
        }
        if (nodeIcon || nodeRenderer) {
          // Disable tree icon, as custom renderer will be used
          if (nodeIcon) {
            options.icon = false;
          }
          
          // Create internal renderer instance
          renderer = new TreeNodeRenderer(tree, options, nodeIcon, folderIcon);
          
          // Custom title renderer
          if (nodeRenderer) {
            renderer.setRenderer(new nodeRenderer(tree, options));
          }
          options.renderNode = renderer.render;
        }
        return jQuery(element).fancytree(options);
      }

      handle(element, valueAccessor, allBindingsAccessor) {
        var config, handler;
        boundMethodCheck(this, ref17);
        config = this.getValue(valueAccessor);
        element = jQuery(element);
        handler = () => {
          if (!element.find('.ui-fancytree').length) {
            return;
          }
          element.fancytree('option', 'source', this.getData(valueAccessor).children);
          // Autoexpand handling
          if (config.autoExpand) {
            element.fancytree('getRootNode').visit(function(node) {
              return node.setExpanded(true);
            });
          }
          return element.focus();
        };
        // Put rendering to end of queue to ensure bindings are evaluated
        return setTimeout(handler, 0);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        boundMethodCheck(this, ref17);
        return this.handle(element, valueAccessor, allBindingsAccessor);
      }

    };

    Fancytree.prototype.tree = null;

    Fancytree.prototype.element = null;

    return Fancytree;

  }).call(this);

  
  // One-way file size formatter

  ref18 = this.Maslosoft.Binder.FileSizeFormatter = (function() {
    class FileSizeFormatter extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindingsAccessor, viewModel) {
        boundMethodCheck(this, ref18);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var binary, decimal, format, step, value;
        boundMethodCheck(this, ref18);
        value = this.getValue(valueAccessor) || 0;
        
        // TODO This should also be configurable via at binding

        binary = this.binary;
        decimal = !this.binary;
        if (binary) {
          step = 1024;
        }
        if (decimal) {
          step = 1000;
        }
        format = (bytes) => {
          var i, units;
          bytes = parseInt(bytes);
          if (bytes < step) {
            return bytes + ' B';
          }
          i = -1;
          if (binary) {
            units = this.units.binary;
          }
          if (decimal) {
            units = this.units.decimal;
          }
          while (true) {
            bytes = bytes / step;
            i++;
            if (!(bytes > step)) {
              break;
            }
          }
          if (units[i]) {
            return Math.max(bytes, 0.1).toFixed(1) + ' ' + units[i];
          } else {
            return Math.max(bytes, 0.1).toFixed(1) + ` ~*${i * step} * ${step} B`;
          }
        };
        return element.innerHTML = format(value);
      }

    };

    FileSizeFormatter.prototype.units = {
      binary: ["kiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
      decimal: ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    };

    FileSizeFormatter.prototype.binary = true;

    return FileSizeFormatter;

  }).call(this);

  
  // GMap3 binding
  // TODO Allow syntax:
  // data-bind="googleMap: config"
  // TODO When using two or more trees from same data, only first one works properly

  ref19 = this.Maslosoft.Binder.GoogleMap = class GoogleMap extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
      this.apply = this.apply.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      boundMethodCheck(this, ref19);
      return this.apply(element, this.getValue(valueAccessor));
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      boundMethodCheck(this, ref19);
      return this.apply(element, this.getValue(valueAccessor));
    }

    apply(element, cfg) {
      var latLng, map, mapOptions, markerCfg;
      boundMethodCheck(this, ref19);
      console.log(element, cfg);
      latLng = new google.maps.LatLng(cfg.lat, cfg.lng);
      mapOptions = {
        zoom: cfg.zoom,
        center: latLng,
        mapTypeId: cfg.type
      };
      map = new google.maps.Map(element, mapOptions);
      if (cfg.markers) {
        markerCfg = {
          position: latLng,
          map: map
        };
        return new google.maps.Marker(markerCfg);
      }
    }

  };

  
  // Hidden binding handler, opposite to visible

  ref20 = this.Maslosoft.Binder.Hidden = class Hidden extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      var value;
      boundMethodCheck(this, ref20);
      value = !this.getValue(valueAccessor);
      return ko.bindingHandlers.visible.update(element, function() {
        return value;
      });
    }

  };

  
  // Href binding handler

  ref21 = this.Maslosoft.Binder.Href = (function() {
    var bustLinks;

    class Href extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindingsAccessor) {
        var href, stopPropagation;
        boundMethodCheck(this, ref21);
        href = this.getValue(valueAccessor);
        // Add href attribute if binding have some value
        if (!element.href && href) {
          ensureAttribute(element, 'href');
        }
        bustLinks(element);
        // Stop propagation handling
        stopPropagation = allBindingsAccessor.get('stopPropagation') || false;
        if (stopPropagation) {
          return ko.utils.registerEventHandler(element, "click", function(e) {
            return e.stopPropagation();
          });
        }
      }

      update(element, valueAccessor, allBindings) {
        var href, target;
        boundMethodCheck(this, ref21);
        bustLinks(element);
        href = this.getValue(valueAccessor);
        if (href) {
          target = allBindings.get('target') || '';
          // Ensure attribute
          ensureAttribute(element, 'href');
          ensureAttribute(element, 'target');
          if (element.getAttribute('href') !== href) {
            element.setAttribute('href', href);
          }
          if (element.getAttribute('target') !== target) {
            return element.setAttribute('target', target);
          }
        } else {
          // Remove attribute if empty
          return element.removeAttribute('href');
        }
      }

    };

    bustLinks = function(element) {
      var defer;
      // Skip on non anchor elements
      if (element.tagName.toLowerCase() !== 'a') {
        return;
      }
      defer = function() {
        var $il, innerLink, j, len, ref22, results;
        ref22 = jQuery(element).find('a');
        results = [];
        for (j = 0, len = ref22.length; j < len; j++) {
          innerLink = ref22[j];
          $il = jQuery(innerLink);
          results.push($il.replaceWith($il.contents()));
        }
        return results;
      };
      return setTimeout(defer, 0);
    };

    return Href;

  }).call(this);

  
  // HTML improved binding handler

  ref22 = this.Maslosoft.Binder.Html = class Html extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      return {
        'controlsDescendantBindings': true
      };
    }

    update(element, valueAccessor, allBindings, context) {
      var configuration, pm, value;
      boundMethodCheck(this, ref22);
      // setHtml will unwrap the value if needed
      value = this.getValue(valueAccessor);
      configuration = this.getValue(allBindings).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
      value = pm.getElementValue(element, value);
      return ko.utils.setHtml(element, value);
    }

  };

  
  // Html tree binding

  // This simpy builds a nested ul>li struct

  // data-bind="htmlTree: data"

  ref23 = this.Maslosoft.Binder.HtmlTree = class HtmlTree extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    static drawNode(data) {
      var child, childWrapper, j, len, node, ref24, title;
      // wrapper = document.createElement 'ul'
      title = document.createElement('li');
      title.innerHTML = data.title;
      // wrapper.appendChild title
      if (data.children && data.children.length > 0) {
        childWrapper = document.createElement('ul');
        ref24 = data.children;
        for (j = 0, len = ref24.length; j < len; j++) {
          node = ref24[j];
          child = HtmlTree.drawNode(node);
          childWrapper.appendChild(child);
        }
        title.appendChild(childWrapper);
      }
      return title;
    }

    getData(valueAccessor) {
      var value;
      // Verbose syntax, at least {data: data}
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return this.getValue(value.data) || [];
      }
      return value;
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var data, handler;
      boundMethodCheck(this, ref23);
      data = this.getValue(valueAccessor);
      warn("HtmlTree is experimental, do not use");
      handler = () => {
        var nodes;
        nodes = HtmlTree.drawNode(data);
        element.innerHTML = '';
        return element.appendChild(nodes);
      };
      // Put rendering to end of queue to ensure bindings are evaluated
      return setTimeout(handler, 0);
    }

  };

  
  // Html value binding
  // WARNING This MUST have parent context, or will not work

  ref24 = this.Maslosoft.Binder.HtmlValue = (function() {
    var idCounter;

    class HtmlValue extends this.Maslosoft.Binder.Base {
      constructor(options = {}) {
        super(options);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        if (ko.bindingHandlers.sortable && ko.bindingHandlers.sortable.options) {
          // Allow `contenteditable` to get focus
          ko.bindingHandlers.sortable.options.cancel = ':input,button,[contenteditable]';
        }
      }

      
      // Get value of element, this can be overridden, see TextValue for example.
      // Will return inner html of element.

      // @param jQuery element
      // @return string

      getElementValue(element) {
        return element.innerHTML;
      }

      
      // Set value of element, this can be overridden, see TextValue for example
      // Value param should be valid html.

      // @param jQuery element
      // @param string

      setElementValue(element, value) {
        return element.innerHTML = value;
      }

      init(element, valueAccessor, allBindingsAccessor) {
        var configuration, deferHandler, dispose, handler, pm;
        boundMethodCheck(this, ref24);
        element.setAttribute('contenteditable', true);
        
        // Generate some id if not set, see notes below why
        if (!element.id) {
          element.id = `maslosoft-binder-htmlvalue-${idCounter++}`;
        }
        configuration = this.getValue(allBindingsAccessor).plugins;
        pm = new PluginsManager(element);
        pm.from(configuration);
        // Handle update immediately
        handler = () => {
          var accessor, elementValue, modelValue;
          // console.log("HTML Value Update", element)
          // On some situations element might be null (sorting), ignore this case
          if (!element) {
            return;
          }
          // This is required in some scenarios, specifically when sorting htmlValue elements
          element = document.getElementById(element.id);
          if (!element) {
            return;
          }
          accessor = valueAccessor();
          modelValue = this.getValue(valueAccessor);
          elementValue = this.getElementValue(element);
          if (ko.isWriteableObservable(accessor)) {
            // Update only if changed
            elementValue = pm.getModelValue(element, elementValue);
            if (modelValue !== elementValue) {
              //console.log "Write: #{modelValue} = #{elementValue}"
              return accessor(elementValue);
            }
          }
        };
        
        // Handle update, but push update to end of queue
        deferHandler = () => {
          return setTimeout(handler, 0);
        };
        
        // NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
        jQuery(element).on("keyup, input", handler);
        // This is to allow interaction with tools which could modify content, also to work with drag and drop
        jQuery(document).on("mouseup", deferHandler);
        jQuery(document).on("changed.htmlvalue", handler);
        dispose = function(toDispose) {
          jQuery(toDispose).off("keyup, input", handler);
          jQuery(document).off("mouseup", deferHandler);
          return jQuery(document).off("changed.htmlvalue", handler);
        };
        ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
      }

      update(element, valueAccessor, allBindings) {
        var configuration, pm, value;
        boundMethodCheck(this, ref24);
        value = this.getValue(valueAccessor);
        configuration = this.getValue(allBindings).plugins;
        pm = new PluginsManager(element);
        pm.from(configuration);
        value = pm.getElementValue(element, value);
        //console.log value
        if (this.getElementValue(element) !== value) {
          this.setElementValue(element, value);
        }
      }

    };

    
    // Counter for id generator
    // @private
    // @static

    idCounter = 0;

    return HtmlValue;

  }).call(this);

  
  // Icon binding handler
  // This is to select proper icon or scaled image thumbnail

  ref25 = this.Maslosoft.Binder.Icon = class Icon extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var $element, date, defaultSize, extra, fixedSize, iconField, isImage, isSvg, matched, model, nameSuffix, regex, size, src;
      boundMethodCheck(this, ref25);
      $element = $(element);
      model = this.getValue(valueAccessor);
      extra = this.getValue(allBindings);
      iconField = allBindings.get("iconField") || 'icon';
      if (!model) {
        if (console) {
          console.warn('Binding value for `icon` binding not defined, skipping. Element:');
          console.warn(element);
          console.warn((new Error()).stack);
        }
        return;
      }
      src = model[iconField];
      isSvg = false;
      if (src.match(/\.(svg)$/)) {
        isSvg = true;
      }
      nameSuffix = '';
      if (src.match(/\.(jpg|jped|gif|png|svg)$/)) {
        matched = src.match(/[^\/]*?\.(jpg|jped|gif|png|svg)$/);
        nameSuffix = matched[0];
        src = src.replace(/[^\/]*?\.(jpg|jped|gif|png|svg)$/, "");
      }
      if (!nameSuffix && model.filename) {
        nameSuffix = model.filename;
      }
      // Get icon size
      // TODO This should be configurable with options
      if (typeof model.iconSize === 'undefined') {
        defaultSize = 16;
      } else {
        defaultSize = model.iconSize;
      }
      size = allBindings.get("iconSize") || defaultSize;
      regex = new RegExp("/" + defaultSize + "/", "g");
      // Check if it's image
      // TODO This should be configurable with options
      if (typeof model.isImage === 'undefined') {
        isImage = true;
      } else {
        isImage = model.isImage;
      }
      // This is to not add scaling params for svg's
      if (isSvg) {
        isImage = false;
      }
      // TODO This must be configurable with options
      if (isImage) {
        // Get image thumbnail
        // End with /
        if (!src.match(new RegExp("/$"))) {
          src = src + '/';
        }
        // Dimensions are set
        if (src.match(new RegExp("/w/", "g"))) {
          src = src.replace(regex, "/" + size + "/");
        } else {
          // Dimensions are not set, set it here
          src = src + `w/${size}/h/${size}/p/0/`;
        }
        
        // Add timestamp if set
        if (model.updateDate) {
          date = null;
          if (model.updateDate.sec) {
            date = model.updateDate.sec;
          } else {
            date = model.updateDate;
          }
          if (typeof date === 'number') {
            src = src + date;
          }
          if (typeof date === 'string') {
            src = src + date;
          }
        }
      } else {
        // Calculate size steps for normal icons
        fixedSize = 16;
        if (size > 16) {
          fixedSize = 32;
        }
        if (size > 32) {
          fixedSize = 48;
        }
        if (size > 48) {
          fixedSize = 512;
        }
        src = src.replace(regex, "/" + fixedSize + "/");
      }
      if (src.match(/\/$/)) {
        src = src + nameSuffix;
      } else {
        src = src + '/' + nameSuffix;
      }
      if (extra.cachebusting) {
        src = src + '?' + new Date().getTime();
      }
      // Update src only if changed
      if ($element.attr("src") !== src) {
        if (extra.preloader) {
          $element.attr('src', extra.preloader);
        }
        preload($element, src);
      }
      // Set max image dimensions
      $element.css({
        width: `${size}px`,
        height: 'auto',
        maxWidth: '100%'
      });
    }

  };

  
  // Src binding handler

  ref26 = this.Maslosoft.Binder.Id = class Id extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element) {
      boundMethodCheck(this, ref26);
      return ensureAttribute(element, 'id');
    }

    update(element, valueAccessor) {
      var id;
      boundMethodCheck(this, ref26);
      id = this.getValue(valueAccessor);
      if (element.getAttribute('id') !== id) {
        return element.setAttribute('id', id);
      }
    }

  };

  
  // Log with element reference

  ref27 = this.Maslosoft.Binder.Log = class Log extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
      this.init = this.init.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      boundMethodCheck(this, ref27);
      return console.log(this.getValue(valueAccessor), element);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      boundMethodCheck(this, ref27);
      return console.log(this.getValue(valueAccessor), element);
    }

  };

  /*
  Date picker
  NOTE: Not recommended, as Pick A Date is not maintanted
  */
  ref28 = this.Maslosoft.Binder.PickaDate = class PickaDate extends this.Maslosoft.Binder.Picker {
    constructor(options) {
      super(new Maslosoft.Binder.DateOptions(options));
      this.updateModel = this.updateModel.bind(this);
      
      // Get display value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getDisplayValue = this.getDisplayValue.bind(this);
      
      // Get model value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getModelValue = this.getModelValue.bind(this);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    updateModel(element, valueAccessor, allBindings) {
      var elementValue, modelValue, val;
      boundMethodCheck(this, ref28);
      modelValue = this.getValue(valueAccessor);
      elementValue = this.getModelValue(element.value);
      if (ko.isWriteableObservable(valueAccessor) || true) {
        // Update only if changed
        if (modelValue !== elementValue) {
          ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue);
          return val = elementValue;
        }
      } else {

      }
    }

    getDisplayValue(value) {
      var inputValue;
      boundMethodCheck(this, ref28);
      if (this.options.sourceFormat === 'unix') {
        inputValue = moment.unix(value).format(this.options.displayFormat);
      } else {
        inputValue = moment(value, this.options.sourceFormat).format(this.options.displayFormat);
      }
      return inputValue;
    }

    getModelValue(value) {
      var modelValue;
      boundMethodCheck(this, ref28);
      if (this.options.sourceFormat === 'unix') {
        modelValue = moment(value, this.options.displayFormat).unix();
      } else {
        modelValue = moment(value, this.options.displayFormat).format(this.options.sourceFormat);
      }
      return modelValue;
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      var $inputDate, events, inputValue, options, picker, pickerElement, pickerWrapper, template, textInput;
      boundMethodCheck(this, ref28);
      inputValue = this.getDisplayValue(this.getValue(valueAccessor));
      textInput = jQuery(element);
      textInput.val(inputValue);
      if (this.options.template) {
        template = this.options.template;
      } else {
        template = `<div class="input-group-addon">
	<a class="picker-trigger-link" style="cursor: pointer;">
		<i class="glyphicon glyphicon-calendar"></i>
	</a>
</div>`;
      }
      pickerWrapper = jQuery(template);
      pickerWrapper.insertAfter(textInput);
      pickerElement = pickerWrapper.find('a.picker-trigger-link');
      options = {
        // Format of pickadate is not compatible of this of moment
        format: this.options.displayFormat.toLowerCase(),
        selectMonths: true,
        selectYears: true
      };
      $inputDate = pickerElement.pickadate(options);
      picker = $inputDate.pickadate('picker');
      picker.on('set', () => {
        textInput.val(picker.get('value'));
        this.updateModel(element, valueAccessor, allBindingsAccessor);
      });
      events = {};
      // On change or other events (paste etc.)
      events.change = () => {
        var parsedDate;
        parsedDate = Date.parse(element.value);
        if (parsedDate) {
          picker.set('select', [parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()]);
          this.updateModel(element, valueAccessor, allBindingsAccessor);
        }
      };
      events.keyup = function(e) {
        if (e.which === 86 && e.ctrlKey) {
          events.change();
        }
      };
      events.mouseup = events.change;
      // Focus event of text input
      events.focus = () => {
        picker.open(false);
      };
      // Blur of text input
      events.blur = (e) => {
        // Don't hide picker when clicking picker itself
        if (e.relatedTarget) {
          return;
        }
        picker.close();
        this.updateModel(element, valueAccessor, allBindingsAccessor);
      };
      textInput.on(events);
      pickerElement.on('click', function(e) {
        var isOpen, root;
        root = jQuery(picker.$root[0]);
        // This seems to be only method
        // to discover if picker is really open
        isOpen = jQuery(root.children()[0]).height() > 0;
        if (isOpen) {
          picker.close();
        } else {
          picker.open(false);
        }
        e.stopPropagation();
        e.preventDefault();
      });
    }

    update(element, valueAccessor) {
      var value;
      boundMethodCheck(this, ref28);
      ko.utils.setTextContent(element, valueAccessor());
      value = this.getDisplayValue(this.getValue(valueAccessor));
      if (element.value !== value) {
        return element.value = value;
      }
    }

  };

  
  // Placeholder binding handler

  ref29 = this.Maslosoft.Binder.Placeholder = class Placeholder extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element) {
      boundMethodCheck(this, ref29);
      return ensureAttribute(element, 'placeholder');
    }

    update(element, valueAccessor) {
      var placeholder;
      boundMethodCheck(this, ref29);
      placeholder = this.getValue(valueAccessor);
      if (element.getAttribute('placeholder') !== placeholder) {
        // Clean up HTML
        placeholder = $("<div/>").html(placeholder).text();
        return element.setAttribute('placeholder', placeholder);
      }
    }

  };

  /*
  Select2
  */
  ref30 = this.Maslosoft.Binder.Select2 = (function() {
    var bindingName, dataBindingName, init, triggerChangeQuietly;

    class Select2 extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init() {
        var args, to;
        boundMethodCheck(this, ref30);
        args = arguments;
        to = function() {
          return init.apply(null, args);
        };
        return setTimeout(to, 0);
      }

      update(element, valueAccessor, allBindingsAccessor) {
        var copy, value;
        boundMethodCheck(this, ref30);
        return;
        value = this.getValue(valueAccessor);
        if (element.value !== value.data) {
          copy = JSON.parse(JSON.stringify(value.data));
          $(element).val(copy);
          return console.log("Update what?", element, value);
        }
      }

    };

    bindingName = 'select2';

    dataBindingName = `${bindingName}Data`;

    triggerChangeQuietly = function(element, binding) {
      var isObservable, originalEqualityComparer;
      isObservable = ko.isObservable(binding);
      originalEqualityComparer = void 0;
      if (isObservable) {
        originalEqualityComparer = binding.equalityComparer;
        binding.equalityComparer = function() {
          return true;
        };
      }
      $(element).trigger('change');
      if (isObservable) {
        binding.equalityComparer = originalEqualityComparer;
      }
    };

    init = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var allBindings, bindingValue, dataChangeHandler, ignoreChange, subscription;
      bindingValue = ko.unwrap(valueAccessor());
      allBindings = allBindingsAccessor();
      ignoreChange = false;
      dataChangeHandler = null;
      subscription = null;
      $(element).on('select2:selecting select2:unselecting', function() {
        ignoreChange = true;
      });
      $(element).on('select2:select select2:unselect', function() {
        ignoreChange = false;
      });
      if (ko.isObservable(allBindings.value)) {
        subscription = allBindings.value.subscribe(function(value) {
          if (ignoreChange) {
            return;
          }
          triggerChangeQuietly(element, this._target || this.target);
        });
      } else if (ko.isObservable(allBindings.selectedOptions)) {
        subscription = allBindings.selectedOptions.subscribe(function(value) {
          if (ignoreChange) {
            return;
          }
          triggerChangeQuietly(element, this._target || this.target);
        });
      }
      // Provide a hook for binding to the select2 "data" property; this property is read-only in select2 so not subscribing.
      if (ko.isWriteableObservable(allBindings[dataBindingName])) {
        dataChangeHandler = function() {
          if (!$(element).data('select2')) {
            return;
          }
          allBindings[dataBindingName]($(element).select2('data'));
        };
        $(element).on('change', dataChangeHandler);
      }
      // Apply select2
      $(element).select2(bindingValue);
      if (allBindings.selectedOptions) {
        $(element).val(allBindings.selectedOptions).trigger('change');
      }
      // Destroy select2 on element disposal
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(element).select2('destroy');
        if (dataChangeHandler !== null) {
          $(element).off('change', dataChangeHandler);
        }
        if (subscription !== null) {
          subscription.dispose();
        }
      });
    };

    return Select2;

  }).call(this);

  
  // Selected binding
  // This adds class from options if value is true

  this.Maslosoft.Binder.Selected = class Selected extends this.Maslosoft.Binder.CssClass {
    constructor(options) {
      super(new Maslosoft.Binder.CssOptions({
        className: 'selected'
      }));
    }

  };

  
  // Src binding handler

  ref31 = this.Maslosoft.Binder.Src = class Src extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element) {
      boundMethodCheck(this, ref31);
      return ensureAttribute(element, 'src');
    }

    update(element, valueAccessor) {
      var src;
      boundMethodCheck(this, ref31);
      src = this.getValue(valueAccessor);
      if (element.getAttribute('src') !== src) {
        return element.setAttribute('src', src);
      }
    }

  };

  /*
  Select2
  */
  ref32 = this.Maslosoft.Binder.Tags = (function() {
    var dropdownKillStyles, once;

    class Tags extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.setTags = this.setTags.bind(this);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      setTags(el, tags) {
        var index, j, len, opt, options, results, tag;
        boundMethodCheck(this, ref32);
        options = el.find('option');
        if (options.length) {
          options.remove();
        }
//		for option, index in el.find('option')

        // Add options, all as selected - as these are our tags list
        results = [];
        for (index = j = 0, len = tags.length; j < len; index = ++j) {
          tag = tags[index];
          opt = jQuery("<option selected='true'></option>");
          opt.val(tag);
          opt.text(tag);
          results.push(el.append(opt));
        }
        return results;
      }

      init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var build, config, copy, data, dropDownKill, el, handler, updateCSS, value;
        boundMethodCheck(this, ref32);
        if (element.tagName.toLowerCase() !== 'select') {
          throw new Error("Tags binding must be placed on `select` element");
        }
        if (once) {
          jQuery(dropdownKillStyles).appendTo('head');
          once = false;
        }
        data = this.getValue(valueAccessor);
        if (data.data) {
          value = data.data;
        } else {
          // Assume direct data passing
          value = data;
        }
        copy = JSON.parse(JSON.stringify(value));
        el = jQuery(element);
        el.data('tags', true);
        el.attr('multiple', true);
        this.setTags(el, copy);
        config = {
          placeholder: data.placeholder,
          tags: true,
          tokenSeparators: [',', ' ']
        };
        updateCSS = function() {
          var input;
          if (data.inputCss) {
            input = el.parent().find('.select2-search__field');
            input.addClass(data.inputCss);
            return input.attr('placeholder', data.placeholder);
          }
        };
        if (data.tagCss) {
          config.templateSelection = function(selection, element) {
            element.removeClass('select2-selection__choice');
            element.addClass(data.tagCss);
            if (selection.selected) {
              return jQuery(`<span>${selection.text}</span>`);
            } else {
              return jQuery(`<span>${selection.text}</span>`);
            }
          };
        }
        handler = () => {
          var elementValue, index, j, len, tag;
          if (value.removeAll) {
            value.removeAll();
          } else {
            value = [];
          }
          elementValue = el.val();
          if (elementValue) {
            for (index = j = 0, len = elementValue.length; j < len; index = ++j) {
              tag = elementValue[index];
              // Sometimes some comas and spaces might pop in
              tag = tag.replace(',', '').replace(' ', '').trim();
              if (!tag) {
                continue;
              }
              value.push(tag);
            }
          }
          return updateCSS();
        };
        // This prevents dropdown for tags
        dropDownKill = (e) => {
          var haveTags;
          haveTags = jQuery(e.target).data();
          if (haveTags) {
            return jQuery('body').toggleClass('kill-all-select2-dropdowns', e.type === 'select2:opening');
          }
        };
        build = () => {
          // Apply select2
          el.select2(config);
          updateCSS();
          el.on('change', handler);
          el.on('select2:select select2:unselect', handler);
          el.on('select2:opening select2:close', dropDownKill);
          // Destroy select2 on element disposal
          return ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            el.select2('destroy');
            if (handler !== null) {
              el.off('change', handler);
              return el.off('select2:select select2:unselect', handler);
            }
          });
        };
        return setTimeout(build, 0);
      }

      update(element, valueAccessor, allBindingsAccessor) {
        var copy, data, el, maybeSet, value;
        boundMethodCheck(this, ref32);
        data = this.getValue(valueAccessor);
        if (data.data) {
          value = data.data;
        } else {
          // Assume direct data passing
          value = data;
        }
        copy = JSON.parse(JSON.stringify(value));
        el = jQuery(element);
        maybeSet = () => {
          var elementTags, modelTags;
          // Not a best moment to update
          if (el.val() === null) {
            elementTags = '';
          } else {
            elementTags = el.val().join(',').replace(/(,+)/g, ',').replace(/(\s+)/g, ' ');
          }
          modelTags = value.join(',');
          if (elementTags !== modelTags) {
            return this.setTags(el, copy);
          }
        };
        return setTimeout(maybeSet, 0);
      }

    };

    dropdownKillStyles = `<style>
	body.kill-all-select2-dropdowns .select2-dropdown {
		display: none !important;
	}
	body.kill-all-select2-dropdowns .select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple
	{
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.select2-container--default.select2-container--focus .select2-selection--multiple {
		border-color: #66afe9;
		outline: 0;
		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
		box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
	}
</style>`;

    once = true;

    return Tags;

  }).call(this);

  
  // HTML improved binding handler

  ref33 = this.Maslosoft.Binder.Text = class Text extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      return {
        'controlsDescendantBindings': true
      };
    }

    update(element, valueAccessor, allBindings, context) {
      var configuration, pm, value;
      boundMethodCheck(this, ref33);
      // setHtml will unwrap the value if needed
      value = escapeHtml(this.getValue(valueAccessor));
      configuration = this.getValue(allBindings).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
      value = pm.getElementValue(element, value);
      return ko.utils.setHtml(element, value);
    }

  };

  ref34 = this.Maslosoft.Binder.TextToBg = class TextToBg extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {}

    update(element, valueAccessor, allBindings, context) {
      var value;
      boundMethodCheck(this, ref34);
      value = this.getValue(valueAccessor);
      return jQuery(element).css('background-color', stringToColour(value));
    }

  };

  
  // Html text value binding
  // WARNING This MUST have parent context, or will not work

  this.Maslosoft.Binder.TextValue = class TextValue extends this.Maslosoft.Binder.HtmlValue {
    getElementValue(element) {
      return element.textContent || element.innerText || "";
    }

    setElementValue(element, value) {
      if (typeof element.textContent !== 'undefined') {
        element.textContent = value;
      }
      if (typeof element.innerText !== 'undefined') {
        return element.innerText = value;
      }
    }

  };

  
  // Html text value binding
  // WARNING This MUST have parent context, or will not work

  this.Maslosoft.Binder.TextValueHLJS = class TextValueHLJS extends this.Maslosoft.Binder.HtmlValue {
    getElementValue(element) {
      return element.textContent || element.innerText || "";
    }

    setElementValue(element, value) {
      if (typeof element.textContent !== 'undefined') {
        element.textContent = value;
        if (hljs) {
          hljs.highlightBlock(element);
        }
      }
      if (typeof element.innerText !== 'undefined') {
        element.innerText = value;
        if (hljs) {
          return hljs.highlightBlock(element);
        }
      }
    }

  };

  ref35 = this.Maslosoft.Binder.TimeAgoFormatter = class TimeAgoFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.TimeAgoOptions(options));
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      var value;
      boundMethodCheck(this, ref35);
      value = this.getValue(valueAccessor);
      element.innerHTML = moment[this.options.sourceFormat](value).fromNow();
    }

  };

  
  // Date formatter

  this.Maslosoft.Binder.TimeFormatter = class TimeFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.TimeOptions(options));
    }

  };

  /*
  Time picker
  */
  this.Maslosoft.Binder.TimePicker = class TimePicker extends this.Maslosoft.Binder.Base {};

  
  // Tooltip binding handler

  ref36 = this.Maslosoft.Binder.Tooltip = class Tooltip extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      var title;
      boundMethodCheck(this, ref36);
      title = this.getValue(valueAccessor);
      $(element).attr("title", title);
      $(element).attr("data-original-title", title);
      $(element).attr("rel", "tooltip");
    }

  };

  
  // Tree binding handler

  ref37 = this.Maslosoft.Binder.Tree = class Tree extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      boundMethodCheck(this, ref37);
    }

  };

  ref38 = this.Maslosoft.Binder.TreeGrid = (function() {
    var makeValueAccessor;

    class TreeGrid extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var activeClass, activeClassHandler, dispose, table, value, widget;
        boundMethodCheck(this, ref38);
        value = this.getValue(valueAccessor);
        activeClass = value.activeClass;
        table = jQuery(element);
        widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView(element, valueAccessor);
        widget.init();
        if (activeClass) {
          activeClassHandler = function(e) {
            // Remove from all instances of `tr` tu support multiple
            // classes separated with space
            table.find('tr').removeClass(activeClass);
            jQuery(e.currentTarget).addClass(activeClass);
            return true;
          };
          table.on('click', 'tr', activeClassHandler);
          dispose = function(toDispose) {
            widget.dispose();
            return jQuery(toDispose).off("click", 'tr', activeClassHandler);
          };
          ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
        }
        ko.bindingHandlers['template']['init'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
        return {
          controlsDescendantBindings: true
        };
      }

      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var widget;
        boundMethodCheck(this, ref38);
        widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView(element, valueAccessor, 'update');
        return ko.bindingHandlers['template']['update'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
      }

    };

    
    // @private

    makeValueAccessor = function(element, valueAccessor, bindingContext, widget) {
      return function() {
        var data, depth, depths, modelValue, unwrapRecursive, unwrappedValue;
        modelValue = valueAccessor();
        unwrappedValue = ko.utils.peekObservable(modelValue);
        if (!unwrappedValue || typeof unwrappedValue.length === 'number') {
          return {
            'foreach': modelValue,
            'templateEngine': ko.nativeTemplateEngine.instance
          };
        }
        data = ko.observableArray([]);
        depths = ko.observableArray([]);
        depth = -1;
        unwrapRecursive = function(items) {
          var extras, hasChilds, item, j, len, results;
          depth++;
          results = [];
          for (j = 0, len = items.length; j < len; j++) {
            item = items[j];
            hasChilds = item.children && item.children.length && item.children.length > 0;
            extras = {
              depth: depth,
              hasChilds: hasChilds
            };
            item._treeGrid = ko.tracker.factory(extras);
            data.push(item);
            depths.push(depth);
            if (hasChilds) {
              unwrapRecursive(item.children);
              results.push(depth--);
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
        //			log unwrappedValue['data']
        if (unwrappedValue['data']['children']) {
          //				log('model init')
          unwrapRecursive(unwrappedValue['data']['children']);
        } else {
          //				log('array init')
          unwrapRecursive(unwrappedValue['data']);
        }
        if (bindingContext) {
          bindingContext.tree = unwrappedValue['data'];
          bindingContext.data = data;
          bindingContext.widget = widget;
        }
        // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
        ko.utils.unwrapObservable(modelValue);
        return {
          'foreach': data,
          'depths': depths,
          'as': unwrappedValue['as'],
          'includeDestroyed': unwrappedValue['includeDestroyed'],
          'afterAdd': unwrappedValue['afterAdd'],
          'beforeRemove': unwrappedValue['beforeRemove'],
          'afterRender': unwrappedValue['afterRender'],
          'beforeMove': unwrappedValue['beforeMove'],
          'afterMove': unwrappedValue['afterMove'],
          'templateEngine': ko.nativeTemplateEngine.instance
        };
      };
    };

    return TreeGrid;

  }).call(this);

  
  // This is to create "nodes" cell, this is meant to be used with TreeGrid
  // binding handler

  ref39 = this.Maslosoft.Binder.TreeGridNode = class TreeGridNode extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      boundMethodCheck(this, ref39);
    }

    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var config, data, depth, expanderIcon, expanders, extras, folderIcon, html, nodeIcon;
      boundMethodCheck(this, ref39);
      ko.utils.toggleDomNodeCssClass(element, 'tree-grid-drag-handle', true);
      html = [];
      data = this.getValue(valueAccessor);
      extras = data._treeGrid;
      config = bindingContext.widget.config;
      //console.log extras.hasChilds
      // TODO: Just accessing data.children causes havoc...
      nodeIcon = config.nodeIcon;
      folderIcon = config.folderIcon;
      expanderIcon = config.expanderIcon || "<i class='glyphicon glyphicon-triangle-bottom'></i>";
      if (folderIcon && extras.hasChilds) {
        //				console.log 'hmmm'
        nodeIcon = folderIcon;
      }
      //			console.log "#{data.title}: #{extras.depth}", extras.hasChilds
      //			console.log data
      //			console.log ko.unwrap bindingContext.$index
      depth = extras.depth;
      expanders = [];
      expanders.push(`<div class='collapsed' style='display:none;transform: rotate(-90deg);'>${expanderIcon}</div>`);
      expanders.push(`<div class='expanded' style='display:none;transform: rotate(-45deg);'>${expanderIcon}</div>`);
      html.push(`<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:${depth}em;display:inline-block;'>${expanders.join('')}</a>`);
      depth = extras.depth + 1;
      html.push(`<i class='no-expander' style='margin-left:${depth}em;display:inline-block;'></i>`);
      html.push(`<img src='${nodeIcon}' style='width: 1em;height:1em;margin-top: -.3em;display: inline-block;'/>`);
      return element.innerHTML = html.join('') + element.innerHTML;
    }

  };

  
  // Validation binding handler

  // @see ValidationManager

  ref40 = this.Maslosoft.Binder.Validator = (function() {
    var idCounter;

    class Validator extends this.Maslosoft.Binder.Base {
      constructor(options) {
        super(new Maslosoft.Binder.ValidatorOptions());
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      getElementValue(element) {
        // For inputs use value
        if (element.tagName.toLowerCase() === 'input') {
          return element.value;
        }
        // For textarea use value
        if (element.tagName.toLowerCase() === 'textarea') {
          return element.value;
        }
        // For rest use text value
        return element.textContent || element.innerText || "";
      }

      init(element, valueAccessor, allBindingsAccessor, context) {
        var classField, configuration, handler, initialVal, manager, pm, validators;
        boundMethodCheck(this, ref40);
        configuration = this.getValue(valueAccessor);
        classField = this.options.classField;
        pm = new PluginsManager(element, classField);
        validators = pm.from(configuration);
        //   TODO Maybe below code should be used to check if class is validator compatible
        //		proto = config[classField].prototype

        //		if typeof(proto.isValid) isnt 'function' or typeof(proto.getErrors) isnt 'function' or typeof(proto.reset) isnt 'function'
        //			if typeof(config[classField].prototype.constructor) is 'function'
        //				name = config[classField].prototype.constructor.name
        //			else
        //				name = config[classField].toString()

        //			error "Parameter `#{classField}` (of type #{name}) must be validator compatible class, binding defined on element:", element
        //			continue
        manager = new ValidationManager(validators, this.options);
        manager.init(element);
        // Generate some id if not set, see notes below why
        if (!element.id) {
          element.id = `Maslosoft-Ko-Binder-Validator-${idCounter++}`;
        }
        // Get initial value to evaluate only if changed
        initialVal = this.getElementValue(element);
        handler = (e) => {
          var elementValue;
          // On some situations element might be null (sorting), ignore this case
          if (!element) {
            return;
          }
          // This is required in some scenarios, specifically when sorting htmlValue elements
          element = document.getElementById(element.id);
          if (!element) {
            return;
          }
          elementValue = this.getElementValue(element);
          
          // Validate only if changed
          if (initialVal !== elementValue) {
            initialVal = elementValue;
            return manager.validate(element, elementValue);
          }
        };
        // NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
        ko.utils.registerEventHandler(element, "keyup, input", handler);
        // This is to allow interaction with tools which could modify content,
        // also to work with drag and drop
        return ko.utils.registerEventHandler(document, "mouseup", handler);
      }

      update(element, valueAccessor, allBindings) {
        boundMethodCheck(this, ref40);
      }

    };

    // Counter for id generator
    // @static
    idCounter = 0;

    return Validator;

  }).call(this);

  // NOTE: Will not trigger on value change, as it is not directly observing value.
  // Will trigger only on init

  // Video PLaylist binding handler

  ref41 = this.Maslosoft.Binder.VideoPlaylist = (function() {
    class VideoPlaylist extends this.Maslosoft.Binder.Video {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      getData(valueAccessor) {
        var value;
        // Verbose syntax, at least {data: data}
        value = this.getValue(valueAccessor) || [];
        if (value.data) {
          return value.data;
        }
        return value;
      }

      init(element, valueAccessor, allBindingsAccessor, context) {
        boundMethodCheck(this, ref41);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var data, html, j, len, options, title, titleField, url, urlField, video;
        boundMethodCheck(this, ref41);
        data = this.getData(valueAccessor);
        options = this.getValue(valueAccessor || {});
        urlField = options.urlField || 'url';
        titleField = options.urlField || 'title';
        html = [];
        for (j = 0, len = data.length; j < len; j++) {
          video = data[j];
          url = video[urlField];
          title = video[titleField];
          if (this.isVideoUrl(url)) {
            html.push(`<a href='${url}'>${title}</a>`);
          }
        }
        element.innerHTML = html.join("\n");
        if (html.length) {
          ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', true);
          return new Maslosoft.Playlist(element);
        } else {
          return ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', false);
        }
      }

    };

    VideoPlaylist.prototype.initVideos = null;

    return VideoPlaylist;

  }).call(this);

  
  // Video Playlist binding handler

  ref42 = this.Maslosoft.Binder.VideoThumb = class VideoThumb extends this.Maslosoft.Binder.Video {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      boundMethodCheck(this, ref42);
    }

    update(element, valueAccessor) {
      var url;
      boundMethodCheck(this, ref42);
      url = this.getValue(valueAccessor);
      return this.setThumb(url, element);
    }

  };

  ref43 = this.Maslosoft.Binder.Widget = class Widget extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindings, context) {
      var Error, className, name, params, ref, value, widget;
      boundMethodCheck(this, ref43);
      className = this.getValue(valueAccessor);
      ref = allBindings.get('ref');
      // Ref is string, try to create new widget and set ref
      if (typeof ref === 'string' || !ref) {
        if (typeof className !== 'function') {
          return;
        }
        if (typeof className.constructor !== 'function') {
          return;
        }
        try {
          widget = new className();
        } catch (error1) {
          Error = error1;
          return;
        }
        if (ref) {
          setRefByName(ref, widget);
        }
        if (ref) {
          ref = widget;
        }
      } else {
        //			console.log 'By ref...'
        //			console.log ref, typeof(ref)
        if (typeof ref === 'object') {
          //				console.log 'Assign ref...'
          widget = ref;
        }
      }
      params = allBindings.get('params');
      if (params) {
        for (name in params) {
          value = params[name];
          widget[name] = value;
        }
      }
      if (typeof widget.init === 'function') {
        widget.init(element);
      }
      if (typeof widget.dispose === 'function') {
        return ko.utils.domNodeDisposal.addDisposeCallback(element, widget.dispose);
      }
    }

    update(element, valueAccessor) {
      boundMethodCheck(this, ref43);
    }

  };

  ref44 = this.Maslosoft.Binder.WidgetAction = class WidgetAction extends this.Maslosoft.Binder.WidgetUrl {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var data, href;
      boundMethodCheck(this, ref44);
      data = this.getData(element, valueAccessor, allBindings, 'action');
      href = this.createUrl(data.id, data.action, data.params, '?');
      element.setAttribute('href', href);
      return this.setRel(element);
    }

  };

  ref45 = this.Maslosoft.Binder.WidgetActivity = class WidgetActivity extends this.Maslosoft.Binder.WidgetUrl {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var data, href;
      boundMethodCheck(this, ref45);
      data = this.getData(element, valueAccessor, allBindings, 'activity');
      href = this.createUrl(data.id, data.activity, data.params, '#');
      element.setAttribute('href', href);
      return this.setRel(element);
    }

  };

  PluginsManager = (function() {
    class PluginsManager {
      constructor(element1 = null, classField1 = '_class') {
        this.getElementValue = this.getElementValue.bind(this);
        this.getModelValue = this.getModelValue.bind(this);
        this.element = element1;
        this.classField = classField1;
        this.plugins = new Array();
      }

      
      // Create configured instances out of configuration
      // containing _class and optional params

      // Example configuration for one plugin:
      // ```
      // {
      // 	_class: Maslosoft.BinderDev.RegExpValidator,
      // 	pattern: '^[a-z]+$',
      // 	allowEmpty: false
      // }
      // ```

      // Example configuration for many plugins:
      // ```
      // [
      // 	{
      // 		_class: Maslosoft.BinderDev.EmailValidator,
      // 		label: 'E-mail'
      // 	},
      // 	{
      // 		_class: Maslosoft.BinderDev.RequiredValidator,
      // 		label: 'E-mail'
      // 	}
      // ]
      // ```

      // @param object
      // @return object[]

      from(configuration) {
        var cfg, classField, className, config, element, index, j, len, plugin, value;
        element = this.element;
        classField = this.classField;
        this.plugins = new Array();
        if (ko.isObservable(configuration)) {
          configuration = ko.unwrap(configuration);
        }
        if (!configuration) {
          return this.plugins;
        }
        if (configuration.constructor === Array) {
          cfg = configuration;
        } else {
          cfg = [configuration];
        }
//		console.log cfg
        for (j = 0, len = cfg.length; j < len; j++) {
          config = cfg[j];
          if (!config[classField]) {
            error(`Parameter \`${classField}\` must be defined for plugin on element:`, element);
            continue;
          }
          if (typeof config[classField] !== 'function') {
            error(`Parameter \`${classField}\` must be plugin compatible class, binding defined on element:`, element);
            continue;
          }
          // Store class name first, as it needs to be removed
          className = config[classField];
          // Remove class key, to not interrupt plugin configuration
          delete config[classField];
          // Instantiate plugin
          plugin = new className();
          for (index in config) {
            value = config[index];
            plugin[index] = null;
            plugin[index] = value;
          }
          this.plugins.push(plugin);
          return this.plugins;
        }
      }

      getElementValue(element, value) {
        var j, len, plugin, ref46;
        ref46 = this.plugins;
        for (j = 0, len = ref46.length; j < len; j++) {
          plugin = ref46[j];
          if (typeof plugin.getElementValue === 'function') {
            value = plugin.getElementValue(element, value);
          }
        }
        return value;
      }

      getModelValue(element, value) {
        var j, len, plugin, ref46;
        ref46 = this.plugins;
        for (j = 0, len = ref46.length; j < len; j++) {
          plugin = ref46[j];
          if (typeof plugin.getModelValue === 'function') {
            value = plugin.getModelValue(element, value);
          }
        }
        return value;
      }

    };

    PluginsManager.prototype.classField = '_class';

    PluginsManager.prototype.element = null;

    
    // @var object[]

    PluginsManager.prototype.plugins = null;

    return PluginsManager;

  }).call(this);

  TreeDnd = (function() {
    var t;

    class TreeDnd {
      constructor(initialTree, element, events1, options) {
        this.dragEnd = this.dragEnd.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.events = events1;
        this.draggable = {};
        this.draggable.scroll = false;
        this.tree = {};
        this.tree = initialTree;
        this.finder = new TreeNodeFinder(this.tree);
        this.el = jQuery(element);
      }

      dragStart(node, data) {
        return true;
      }

      dragEnter(node, data) {
        return true;
      }

      dragEnd(node, data) {
        log('drag end...');
        return true;
      }

      dragDrop(node, data) {
        var ctx, current, dragged, handler, hitMode, index, parent, target, targetParent;
        hitMode = data.hitMode;
        // Dragged element - either draggable or tree element
        dragged = data.draggable.element[0];
        // Event handler for drop
        this.events.drop(node, data);
        if (!data.otherNode) {
          // Drop from ourside tree
          ctx = ko.contextFor(dragged);
          // Handle drop event possible transformation of node
          current = this.events.getNode(ctx.$data);
        } else {
          // From from within tree
          parent = this.finder.find(data.otherNode.parent.data.id);
          // Find node
          // Handle drop event possible transformation of node
          current = this.events.getNode(this.finder.find(data.otherNode.data.id));
          if (!this.el.is(dragged)) {
            log('From other instance...');
            // Drop from other tree instance
            data = ko.dataFor(dragged);
            log(data);
            setTimeout(handler, 0);
          }
        }
        target = this.finder.find(node.data.id);
        targetParent = this.finder.find(node.parent.data.id);
        // console.log "Parent: #{parent.title}"
        // console.log "Current: #{current.title}"
        // console.log "Target: #{target.title}"
        // console.log "TargetParent: #{targetParent.title}"
        // console.log hitMode

        // Update view model
        // Remove current element first
        if (parent) {
          parent.children.remove(current);
        }
        this.tree.children.remove(current);
        if (targetParent) {
          targetParent.children.remove(current);
        }
        // Just push at target end
        if (hitMode === 'over') {
          // log hitMode
          // log "Target: #{target.title}"
          // log "Current: #{current.title}"
          target.children.push(current);
        }
        // Insert before target - at target parent
        if (hitMode === 'before') {
          if (targetParent) {
            // Move over some node
            index = targetParent.children.indexOf(target);
            targetParent.children.splice(index, 0, current);
          } else {
            // Move over root node
            index = this.tree.children.indexOf(target);
            this.tree.children.splice(index, 0, current);
          }
        }
        // console.log "indexOf: #{index} (before)"

        // Simply push at the end - but at targetParent
        if (hitMode === 'after') {
          if (targetParent) {
            targetParent.children.push(current);
          } else {
            this.tree.children.push(current);
          }
        }
        // NOTE: This could possibly work, but it doesn't.
        // This would update whole tree with new data. Some infinite recursion occurs.
        // @handle element, valueAccessor, allBindingsAccessor
        handler = (e) => {
          log(e);
          this.el.fancytree('option', 'source', this.tree.children);
          this.el.fancytree('getRootNode').visit(function(node) {
            return node.setExpanded(true);
          });
          this.el.focus();
          return log('update tree..', this.el);
        };
        setTimeout(handler, 0);
        // Move fancytree node separatelly
        // data.otherNode.moveTo(node, hitMode)

        // Expand node as it looks better if it is expanded after drop
        return true;
      }

    };

    // Expand helps greatly when doing dnd
    TreeDnd.prototype.autoExpandMS = 400;

    // Prevent focus on click
    // When enabled will scroll to tree control on click, not really desirable
    // Cons: breaks keyboard navigation
    TreeDnd.prototype.focusOnClick = false;

    // These two are required, or view model might loop	
    TreeDnd.prototype.preventVoidMoves = true;

    TreeDnd.prototype.preventRecursiveMoves = true;

    
    // Whole tree data
    // @var TreeItem[]

    TreeDnd.prototype.tree = null;

    
    // Node finder instance
    // @var TreeNodeFinder

    TreeDnd.prototype.finder = null;

    
    // Draggable options

    TreeDnd.prototype.draggable = null;

    
    // @var TreeEvents

    TreeDnd.prototype.events = null;

    
    // Tree html element

    TreeDnd.el = null;

    // Private
    t = function(node) { // Comment to log
      var childNode, children, j, len, ref46;
      return;
      log(`Node: ${node.title}`);
      children = [];
      if (node.children && node.children.length > 0) {
        ref46 = node.children;
        for (j = 0, len = ref46.length; j < len; j++) {
          childNode = ref46[j];
          children.push(childNode.title);
        }
        return log(`Children: ${children.join(',')}`);
      }
    };

    return TreeDnd;

  }).call(this);

  TreeDrag = (function() {
    var t;

    class TreeDrag {
      constructor(initialTree, element, events, options) {
        this.dragEnd = this.dragEnd.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.draggable = {};
        this.draggable.scroll = false;
        this.tree = {};
        this.tree = initialTree;
        this.finder = new TreeNodeFinder(this.tree);
        this.el = jQuery(element);
      }

      dragStart(node, data) {
        return true;
      }

      dragEnter(node, data) {
        return false;
      }

      dragEnd(node, data) {
        log('drag end...');
        return true;
      }

      dragDrop(node, data) {
        var ctx, current, dragged, handler, hitMode, index, parent, target, targetParent;
        return false;
        hitMode = data.hitMode;
        // Dragged element - either draggable or tree element
        dragged = data.draggable.element[0];
        if (!data.otherNode) {
          // Drop from ourside tree
          ctx = ko.contextFor(dragged);
          current = ctx.$data;
        } else {
          // From from within tree
          parent = this.finder.find(data.otherNode.parent.data.id);
          current = this.finder.find(data.otherNode.data.id);
          if (!this.el.is(dragged)) {
            log('From other instance...');
            // Drop from other tree instance
            data = ko.dataFor(dragged);
            log(data);
            setTimeout(handler, 0);
          }
        }
        target = this.finder.find(node.data.id);
        targetParent = this.finder.find(node.parent.data.id);
        // console.log "Parent: #{parent.title}"
        // console.log "Current: #{current.title}"
        // console.log "Target: #{target.title}"
        // console.log "TargetParent: #{targetParent.title}"
        // console.log hitMode

        // Update view model
        // Remove current element first
        if (parent) {
          parent.children.remove(current);
        }
        this.tree.children.remove(current);
        if (targetParent) {
          targetParent.children.remove(current);
        }
        // Just push at target end
        if (hitMode === 'over') {
          // log hitMode
          // log "Target: #{target.title}"
          // log "Current: #{current.title}"
          target.children.push(current);
        }
        // Insert before target - at target parent
        if (hitMode === 'before') {
          if (targetParent) {
            // Move over some node
            index = targetParent.children.indexOf(target);
            targetParent.children.splice(index, 0, current);
          } else {
            // Move over root node
            index = this.tree.children.indexOf(target);
            this.tree.children.splice(index, 0, current);
          }
        }
        // console.log "indexOf: #{index} (before)"

        // Simply push at the end - but at targetParent
        if (hitMode === 'after') {
          if (targetParent) {
            targetParent.children.push(current);
          } else {
            this.tree.children.push(current);
          }
        }
        // NOTE: This could possibly work, but it doesn't.
        // This would update whole tree with new data. Some infinite recursion occurs.
        // @handle element, valueAccessor, allBindingsAccessor
        handler = (e) => {
          log(e);
          this.el.fancytree('option', 'source', this.tree.children);
          this.el.fancytree('getRootNode').visit(function(node) {
            return node.setExpanded(true);
          });
          this.el.focus();
          return log('update tree..', this.el);
        };
        setTimeout(handler, 0);
        // Move fancytree node separatelly
        // data.otherNode.moveTo(node, hitMode)

        // Expand node as it looks better if it is expanded after drop
        return true;
      }

    };

    // Prevent focus on click
    // When enabled will scroll to tree control on click, not really desirable
    // Cons: breaks keyboard navigation
    TreeDrag.prototype.focusOnClick = false;

    
    // Whole tree data
    // @var TreeItem[]

    TreeDrag.prototype.tree = null;

    
    // Node finder instance
    // @var TreeNodeFinder

    TreeDrag.prototype.finder = null;

    
    // Draggable options

    TreeDrag.prototype.draggable = null;

    
    // Tree html element

    TreeDrag.el = null;

    // Private
    t = function(node) { // Comment to log
      var childNode, children, j, len, ref46;
      return;
      log(`Node: ${node.title}`);
      children = [];
      if (node.children && node.children.length > 0) {
        ref46 = node.children;
        for (j = 0, len = ref46.length; j < len; j++) {
          childNode = ref46[j];
          children.push(childNode.title);
        }
        return log(`Children: ${children.join(',')}`);
      }
    };

    return TreeDrag;

  }).call(this);

  TreeEvents = (function() {
    var doEvent, finder, stop;

    class TreeEvents {
      constructor(initialTree, events1, options1) {
        // Drop event
        this.drop = this.drop.bind(this);
        
        // Handler to possibly recreate/transform node

        this.getNode = this.getNode.bind(this);
        this.handle = this.handle.bind(this);
        this.events = events1;
        this.options = options1;
        finder = new TreeNodeFinder(initialTree);
        this.handle('click');
        this.handle('dblclick');
        this.handle('activate');
        this.handle('deactivate');
      }

      drop(node, data) {
        log("Drop...");
        log(this.events);
        if (this.events.drop) {
          this.dropEvent = new this.events.drop(node, data);
          return log(this.dropEvent);
        }
      }

      getNode(node) {
        log("Tree event drop...");
        log(this.dropEvent);
        if (this.dropEvent && this.dropEvent.getNode) {
          return this.dropEvent.getNode(node);
        } else {
          return node;
        }
      }

      handle(type) {
        if (this.events[type]) {
          return this.options[type] = (event, data) => {
            var model;
            if (doEvent(data)) {
              model = finder.find(data.node.data.id);
              this.events[type](model, data, event);
              return stop(event);
            }
          };
        }
      }

    };

    
    // Events defined by binding

    TreeEvents.prototype.events = null;

    
    // Drop event is handled differently

    TreeEvents.prototype.dropEvent = null;

    
    // Fancy tree options

    TreeEvents.prototype.options = null;

    // Private

    // Finder instance
    // @var TreeNodeFinder

    finder = null;

    // Check whether should handle event
    doEvent = function(data) {
      // For most events just do event it has no target
      if (typeof data.targetType === 'undefined') {
        return true;
      }
      // For click and double click react only on title and icon click
      if (data.targetType === 'title') {
        return true;
      }
      if (data.targetType === 'icon') {
        return true;
      }
    };

    // Stop event propagation
    stop = function(event) {
      return event.stopPropagation();
    };

    return TreeEvents;

  }).call(this);

  TreeNodeCache = (function() {
    var nodes;

    class TreeNodeCache {
      constructor() {}

      // nodes = {}
      get(id) {
        if (typeof nodes[id] === 'undefined') {
          return false;
        }
        return nodes[id];
      }

      set(id, val) {
        return nodes[id] = val;
      }

    };

    nodes = {};

    return TreeNodeCache;

  }).call(this);

  TreeNodeFinder = (function() {
    var cache, findNode, trees;

    class TreeNodeFinder {
      constructor(initialTree) {
        trees.push(initialTree);
      }

      find(id) {
        var j, len, node, tree;
        for (j = 0, len = trees.length; j < len; j++) {
          tree = trees[j];
          node = findNode(tree, id);
          if (node) {
            return node;
          }
        }
        return false;
      }

    };

    // Private
    cache = new TreeNodeCache();

    trees = [];

    findNode = function(node, id) {
      var child, found, foundNode, j, len, ref46;
      if (typeof id === 'undefined') {
        return false;
      }
      if (found = cache.get(id)) {
        return found;
      }
      if (node.id === id) {
        return node;
      }
      if (node._id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        ref46 = node.children;
        for (j = 0, len = ref46.length; j < len; j++) {
          child = ref46[j];
          foundNode = findNode(child, id);
          if (foundNode !== false) {
            cache.set(id, foundNode);
            return foundNode;
          }
        }
      }
      return false;
    };

    return TreeNodeFinder;

  }).call(this);

  TreeNodeRenderer = (function() {
    var finder;

    class TreeNodeRenderer {
      constructor(tree, options, icon1, folderIcon1) {
        this.render = this.render.bind(this);
        this.icon = icon1;
        this.folderIcon = folderIcon1;
        finder = new TreeNodeFinder(tree);
      }

      setRenderer(renderer1) {
        this.renderer = renderer1;
        if (typeof this.renderer.render !== 'function') {
          return console.error("Renderer must have function `render`");
        }
      }

      render(event, data) {
        var html, icon, index, model, node, span, val;
        node = data.node;

        // Skip event from child nodes
// If not skipped, double icons will appear on folder nodes
// TODO Investigate if there is more reliable methos for this
        for (index in data) {
          val = data[index];
          if (index === 'originalEvent') {
            return;
          }
        }
        
        // Operate only on title, not whole node html
        // This will prevent destroying expanders etc.
        span = jQuery(node.span).find("> span.fancytree-title");
        
        // Use custom render
        if (this.renderer && this.renderer.render) {
          model = finder.find(node.data.id);
          this.renderer.render(model, span);
        }
        
        // Apply icon if applicable
        if (this.icon || this.folderIcon) {
          
          // Use html here (not node.title) as it might be altered by custom renderer
          html = span.html();
          
          // Check which icon to use
          if (this.folderIcon && node.children && node.children.length) {
            icon = this.folderIcon;
          } else {
            icon = this.icon;
          }
          
          // Add icon tag just before title
          // This will ensure proper dnd for responsive icon size
          return span.html(`<i class='node-title-icon' style='background-image:url(${icon})'></i> ${html}`);
        }
      }

    };

    TreeNodeRenderer.prototype.icon = '';

    TreeNodeRenderer.prototype.folderIcon = '';

    TreeNodeRenderer.prototype.renderer = null;

    
    // Node finder instance
    // @var TreeNodeFinder
    // @private

    finder = null;

    return TreeNodeRenderer;

  }).call(this);

  ValidationManager = (function() {
    var hide, show, toggle;

    
    // Validation manager.

    // This class applies proper styles and messages to configured DOM elements.

    class ValidationManager {
      
      // Initialize validation manager

      // @param validators Maslosoft.Binder.BaseValidator[]
      // @param options Maslosoft.Binder.ValidatorOptions

      constructor(validators1, options1) {
        
        // Trigger validation and warnigs on all items

        // @param element DomElement
        // @param value mixed

        // @return bool

        this.validate = this.validate.bind(this);
        
        // Set working element. No need to call it directly, it is called by validate method.

        // @param element DomElement

        // @return ValidationManager

        this.setElement = this.setElement.bind(this);
        
        // Initialize element. This sets proper state of helper elements,
        // like error/warning messages container

        // @param element DomElement

        this.init = this.init.bind(this);
        
        // Apply validation of one validator

        // @param validator Maslosoft.Binder.BaseValidator
        // @param element DomElement
        // @param value mixed

        // @return bool

        this.validateOne = this.validateOne.bind(this);
        
        // Apply warnings of one input

        // @param validator Maslosoft.Binder.BaseValidator
        // @param element DomElement
        // @param value mixed

        // @return ValidationManager

        this.adviseOne = this.adviseOne.bind(this);
        this.validators = validators1;
        this.options = options1;
      }

      validate(element, value) {
        var j, k, len, len1, ref46, ref47, validator;
        // Set current element here, as it could be changed in some case, ie sorting
        this.setElement(element);
        ref46 = this.validators;
        // Trigger all validators
        for (j = 0, len = ref46.length; j < len; j++) {
          validator = ref46[j];
          if (!this.validateOne(validator, value)) {
            return false;
          }
        }
        ref47 = this.validators;
        // Loop again for warnings, or they would be overriden
        for (k = 0, len1 = ref47.length; k < len1; k++) {
          validator = ref47[k];
          // Ensure that validator handle warnings
          if (typeof validator.getWarnings === 'function') {
            this.adviseOne(validator, value);
          }
        }
        return true;
      }

      setElement(element1) {
        this.element = element1;
        this.parent = jQuery(this.element).parents('.form-group')[0];
        if (!this.parent) {
          return this;
        }
        this.errors = this.parent.querySelector(this.options.errorMessages);
        this.warnings = this.parent.querySelector(this.options.warningMessages);
        hide(this.errors);
        hide(this.warnings);
        return this;
      }

      init(element) {
        return this.setElement(element);
      }

      validateOne(validator, value) {
        var element, errors, isValid, messages, parent, warnings;
        // Reassign variables for local scope
        element = this.element;
        parent = this.parent;
        errors = this.errors;
        warnings = this.warnings;
        messages = new Array();
        validator.reset();
        isValid = false;
        if (validator.isValid(value)) {
          // Apply input error styles as needed
          if (this.options.inputError) {
            toggle(element, this.options.inputError, false);
          }
          if (this.options.inputSuccess) {
            toggle(element, this.options.inputSuccess, true);
          }
          // Apply parent styles as needed
          if (parent) {
            if (this.options.parentError) {
              toggle(parent, this.options.parentError, false);
            }
            if (this.options.parentSuccess) {
              toggle(parent, this.options.parentSuccess, true);
            }
          }
          // Reset error messages
          if (errors) {
            hide(errors);
            errors.innerHTML = '';
          }
          isValid = true;
        } else {
          // Errors...
          messages = validator.getErrors();
          // Apply input error styles as needed
          if (this.options.inputError) {
            toggle(element, this.options.inputError, true);
          }
          if (this.options.inputSuccess) {
            toggle(element, this.options.inputSuccess, false);
          }
          // Apply parent styles as needed
          if (parent) {
            if (this.options.parentError) {
              toggle(parent, this.options.parentError, true);
            }
            if (this.options.parentSuccess) {
              toggle(parent, this.options.parentSuccess, false);
            }
          }
          // Show error messages
          if (errors && messages) {
            show(errors);
            errors.innerHTML = messages.join('<br />');
          }
          isValid = false;
        }
        
        // Warnings part - this is required here to reset warnings

        // Reset warnings regardless of validation result
        // Remove input warning styles as needed
        if (this.options.inputWarning) {
          toggle(element, this.options.inputWarning, false);
        }
        // Remove parent styles as needed
        if (parent) {
          if (this.options.parentWarning) {
            toggle(parent, this.options.parentWarning, false);
          }
        }
        if (warnings) {
          hide(warnings);
          warnings.innerHTML = '';
        }
        return isValid;
      }

      adviseOne(validator, value) {
        var element, errors, messages, parent, warnings;
        // Reassign variables for local scope
        element = this.element;
        parent = this.parent;
        errors = this.errors;
        warnings = this.warnings;
        messages = validator.getWarnings();
        // If has warnings remove success and add warnings to any applicable element
        if (messages.length) {
          // Apply input warning styles as needed
          if (this.options.inputWarning) {
            toggle(element, this.options.inputWarning, true);
          }
          if (this.options.inputSuccess) {
            toggle(element, this.options.inputSuccess, false);
          }
          // Apply parent styles as needed
          if (parent) {
            if (this.options.parentWarning) {
              toggle(parent, this.options.parentWarning, true);
            }
            if (this.options.parentSuccess) {
              toggle(parent, this.options.parentSuccess, false);
            }
          }
          // Show warnings if any
          if (warnings) {
            show(warnings);
            warnings.innerHTML = messages.join('<br />');
          }
        }
        return this;
      }

    };

    
    // Input element
    // @var DomElement

    ValidationManager.prototype.element = null;

    
    // Parent of input element
    // @var DomElement

    ValidationManager.prototype.parent = null;

    
    // Errors container element
    // @var DomElement

    ValidationManager.prototype.errors = null;

    
    // Warnings container element
    // @var DomElement

    ValidationManager.prototype.warnings = null;

    // Private
    toggle = ko.utils.toggleDomNodeCssClass;

    hide = function(element) {
      return ko.utils.toggleDomNodeCssClass(element, 'hide', true);
    };

    show = function(element) {
      return ko.utils.toggleDomNodeCssClass(element, 'hide', false);
    };

    return ValidationManager;

  }).call(this);

  if (!this.Maslosoft.Binder.Widgets.TreeGrid) {
    this.Maslosoft.Binder.Widgets.TreeGrid = {};
  }

  Maslosoft.Binder.Widgets.TreeGrid.Dnd = (function() {
    var didDrop, dragged, draggedOver, hitMode, indicator, prevHitMode;

    class Dnd {
      constructor(grid) {
        var defer;
        
        // On drag start

        this.dragStart = this.dragStart.bind(this);
        // data = ko.dataFor e.target
        // console.log "Started #{data.title}"
        this.drag = this.drag.bind(this);
        
        // Drop if stopped dragging without dropping
        // This is required when dragging near top or bottom of container

        this.stop = this.stop.bind(this);
        
        // Drop in a normal manner, see also `stop` for edge case

        this.drop = this.drop.bind(this);
        //		setTimeout dropDelay, 50

        // Handle over state to get element to be about to be dropped
        // This is bound to dropable `over`

        this.over = this.over.bind(this);
        
        // On drag over, evaluated only if entering different element or hit mode

        this.dragOver = this.dragOver.bind(this);
        
        // Move handler for mousemove for precise position calculation
        // * Detect over which tree element is cursor and if it's more
        // on top/bottom edge or on center

        this.move = this.move.bind(this);
        
        // Reset appropriate things on drop

        this.clear = this.clear.bind(this);
        
        // Initialize drag helper

        this.dragHelper = this.dragHelper.bind(this);
        this.grid = grid;
        
        // DND must be explicitly enabled
        if (!this.grid.config.dnd) {
          return;
        }
        if (this.grid.context === 'init') {
          // handle disposal
          ko.utils.domNodeDisposal.addDisposeCallback(this.grid.element.get(0), function() {
            var e;
            try {
              if (this.grid.element) {
                this.grid.element.draggable("destroy");
                return this.grid.element.droppable("destroy");
              }
            } catch (error1) {
              e = error1;
              return console.log(e.message);
            }
          });
          this.grid.element.on('mousemove', '> tr', this.move);
        }
        if (!indicator) {
          indicator = new Maslosoft.Binder.Widgets.TreeGrid.DropIndicator(this.grid);
        }
        defer = () => {
          var draggableOptions, droppableOptions;
          draggableOptions = {
            handle: '.tree-grid-drag-handle',
            cancel: '.expander, input, *[contenteditable], .no-drag',
            revert: false,
            cursor: 'pointer',
            cursorAt: {
              top: 5,
              left: 5
            },
            start: this.dragStart,
            drag: this.drag,
            stop: this.stop,
            helper: this.dragHelper
          };
          droppableOptions = {
            tolerance: "pointer",
            drop: this.drop,
            over: this.over
          };
          this.grid.element.find('> tr').draggable(draggableOptions);
          return this.grid.element.find('> tr').droppable(droppableOptions);
        };
        setTimeout(defer, 0);
      }

      dragStart(e) {
        return dragged = e.target;
      }

      drag(e, helper) {}

      stop(e, ui) {
        if (!didDrop) {
          return this.drop(e, ui);
        }
      }

      drop(e, ui) {
        var current, dropDelay, over, overParent, parentChilds, root;
        didDrop = true;
        if (!dragged) {
          return this.clear();
        }
        if (!draggedOver) {
          return this.clear();
        }
        if (!draggedOver.get(0)) {
          return this.clear();
        }
        current = ko.dataFor(dragged);
        over = ko.dataFor(draggedOver.get(0));
        if (!this.grid.canDrop(dragged, draggedOver, hitMode)) {
          return this.clear();
        }
        this.grid.freeze();
        overParent = this.grid.getParent(over);
        root = this.grid.getRoot();
        // console.log "Drop #{current.title} over #{over.title}"
        // console.log arguments
        //		log "CURR " + current.title
        //		log "OVER " + over.title
        //		log "PRNT " + overParent.title
        //		log "HITM " + hitMode
        if (overParent.children) {
          // Model initialized
          parentChilds = overParent.children;
        } else {
          // Array initialized
          parentChilds = overParent;
        }
        dropDelay = () => {
          var index;
          this.grid.remove(current);
          if (hitMode === 'over') {
            // Most obvious case, when dragged node is directly over
            // dropped node, insert current node as it's last child
            over.children.push(current);
          }
          if (hitMode === 'before') {
            // Insert node before current node, this is case when
            // insert mark is before dragged over node
            index = parentChilds.indexOf(over);
            parentChilds.splice(index, 0, current);
          }
          if (hitMode === 'after') {
            // When node has children, then add just at beginning
            // to match visual position of dragged node
            if (over.children.length) {
              parentChilds.splice(0, 0, current);
            } else {
              // When not having children, it means that node is
              // last on the level so insert as a last node
              parentChilds.push(current);
            }
          }
          // Special case for last item. This allow adding node to top
          // level on the end of tree. Without this, it would be
          // impossible to move node to the end if last node is not top node.

          // TODO for some reason view does not update on push

          if (hitMode === 'last') {
            //				log "Delayed Drop on end of table..."
            if (root.children) {
              root.children.push(current);
            } else {
              
              // TODO Neither push or splice at end works!
              // It *does* add to view model but does not update UI!
              // However splice at beginning works properly!!!111

              //					root.splice root.length, 0, current
              root.push(current);
            }
          }
          return this.clear();
        };
        // Delay a bit to reduce flickering
        // See also TreeGridView.thaw() - this value should be lower than that in thaw
        return dropDelay();
      }

      over(e) {
        // Don't stop propagation, just detect row
        if (e.target.tagName.toLowerCase() === 'tr') {
          // Limit updates to only when dragging over different items
          if (draggedOver !== e.target) {
            draggedOver = jQuery(e.target);
            return this.dragOver(e);
          }
        }
      }

      dragOver(e) {
        if (indicator) {
          return indicator.precise.over(dragged, draggedOver, hitMode, indicator);
        }
      }

      move(e) {
        var offset, pos, rel;
        if (dragged) {
          // Dragged over itself must be handled here,
          // as it is not evaluated on `over`
          if (e.currentTarget === dragged) {
            if (!draggedOver || dragged !== draggedOver.get(0)) {
              // console.log dragged
              e.target = dragged;
              this.over(e);
            }
          }
        }
        if (draggedOver) {
          offset = draggedOver.offset();
          pos = {};
          pos.x = e.pageX - offset.left;
          pos.y = e.pageY - offset.top;
          rel = {};
          rel.x = pos.x / draggedOver.outerWidth(true);
          rel.y = pos.y / draggedOver.outerHeight(true);
          hitMode = 'over';
          if (rel.y > 0.65) {
            hitMode = 'after';
          }
          if (rel.y <= 0.25) {
            hitMode = 'before';
          }
          if (hitMode === 'after') {
            // Last elem and after - switch to last hitmode
            if (this.grid.isLast(ko.dataFor(draggedOver.get(0)))) {
              hitMode = 'last';
            }
          }
          // Rate limiting for hit mode
          if (prevHitMode !== hitMode) {
            prevHitMode = hitMode;
            e.target = draggedOver;
            return this.dragOver(e);
          }
        }
      }

      clear() {
        this.grid.thaw();
        draggedOver = null;
        dragged = null;
        hitMode = null;
        prevHitMode = null;
        didDrop = false;
        // Destroy helpers and indicators
        if (this.helper) {
          this.helper.hide();
          this.helper = null;
        }
        if (indicator) {
          return indicator.hide();
        }
      }

      dragHelper(e) {
        var cell, dropIndicator, item, tbody;
        tbody = jQuery(e.currentTarget).parent();
        cell = tbody.find('.tree-grid-drag-handle').parents('td').first();
        item = cell.clone();
        item.find('.expander .expanded').remove();
        item.find('.expander .collapsed').remove();
        item.find('.expander').remove();
        item.find('.no-expander').remove();
        dropIndicator = "<span class='drop-indicator'>&times;</span>";
        this.helper = jQuery(`<div style='white-space:nowrap;'>${dropIndicator}${item.html()}</div>`);
        this.helper.css("pointer-events", "none");
        indicator.attach(this.helper.find('.drop-indicator'));
        return this.helper;
      }

    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    Dnd.prototype.grid = null;

    
    // Drag helper

    // @var jQuery element

    Dnd.prototype.helper = null;

    
    // Drop indicator

    // @var Maslosoft.Binder.Widgets.TreeGrid.DropIndicator

    indicator = null;

    
    // Element over which currently item is dragged
    // @var jQuery element

    draggedOver = null;

    
    // Element currently dragged
    // @var HTMLElement

    dragged = null;

    
    // Hit mode
    // @var string

    hitMode = null;

    
    // Previous hit mode, this is used for rate limit of hitMode detection
    // @var string

    prevHitMode = null;

    
    // Whether drop event occured, this is required for edge cases
    // @var boolean

    didDrop = false;

    return Dnd;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.DropIndicator = (function() {
    class DropIndicator {
      constructor(grid) {
        this.grid = grid;
        this.precise = new Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator(this.grid);
      }

      attach(element1) {
        this.element = element1;
        this.element.css({
          'font-size': '1.5em'
        });
        this.element.css({
          'width': '1em'
        });
        this.element.css({
          'height': '1em'
        });
        this.element.css({
          'position': 'absolute'
        });
        // 1/2 of font size
        this.element.css({
          'left': '-.75em'
        });
        // 1/4 of font size
        return this.element.css({
          'top': '-.35em'
        });
      }

      hide() {
        this.element.hide();
        return this.precise.hide();
      }

      show() {
        this.element.show();
        return this.precise.show();
      }

      accept() {
        this.element.html('&check;');
        this.element.css({
          'color': 'green'
        });
        return this.precise.accept();
      }

      deny() {
        this.element.html('&times;');
        this.element.css({
          'color': 'red'
        });
        return this.precise.deny();
      }

    };

    
    // Precise indicator holder
    // @var Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator

    DropIndicator.precise = null;

    
    // Indicator element instance boud to draggable
    // @var jQuery element

    DropIndicator.element = null;

    return DropIndicator;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.Events = (function() {
    class Events {
      constructor(grid, context) {
        this.grid = grid;
        if (!this.grid.config.on) {
          return;
        }
      }

    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    Events.prototype.grid = null;

    return Events;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.Expanders = (function() {
    var collapse, expand, initExpand;

    class Expanders {
      constructor(grid, context) {
        this.updateExpanders = this.updateExpanders.bind(this);
        this.handler = this.handler.bind(this);
        // Cancel expander click event, as it reacts on mousedown
        // however click would propagate and call action
        this.cancelClick = this.cancelClick.bind(this);
        this.grid = grid;
        // Expanders explicitly disabled
        if (this.grid.config.expanders === false) {
          return;
        }
        // Initialize click handlers only on init
        if (this.grid.context === 'init') {
          this.grid.element.on('mousedown', '.expander', this.handler);
          this.grid.element.on('click', '.expander', this.cancelClick);
        }
        if (this.grid.context === 'update') {
          this.updateExpanders();
        }
      }

      updateExpanders() {
        var defer, one;
        one = (item, data) => {
          var hasChildren;
          hasChildren = data.children && data.children.length;
          if (hasChildren) {
            item.find('.no-expander').hide();
            item.find('.expander').show();
            if (!item.find('.expander .collapsed').is(':visible')) {
              return item.find('.expander .expanded').show();
            }
          } else {
            item.find('.expander').hide();
            return item.find('.no-expander').show();
          }
        };
        //			item.find('.debug').html data.children.length
        defer = () => {
          return this.grid.visit(one);
        };
        //		defer()
        return setTimeout(defer, 0);
      }

      handler(e) {
        var current, depth, initOne, show;
        current = ko.contextFor(e.target).$data;
        // Expanding tree node should not call action
        // @see https://github.com/Maslosoft/Binder/issues/33
        e.stopPropagation();
        e.preventDefault();
        depth = -1;
        show = false;
        log(`clicked on expander ${current.title}`);
        initOne = (item, data) => {
          var itemDepth, manuallyToggled, showChildItems;
          itemDepth = data._treeGrid.depth;
          if (data === current) {
            depth = itemDepth;
            show = initExpand(item);
            item.data('treegrid-manual-state', show);
            return;
          }
          // Not found yet, so continue
          // Current item should be left intact, so skip to next item
          if (depth === -1) {
            return;
          }
          // Found item on same depth, skip further changes
          if (itemDepth === depth) {
            depth = -1;
            return;
          }
          // toggle all one depth lower
          if (itemDepth >= depth) {
            // TODO: Below is a scratch of logic to re-expand or re-collapse
            if (false) {
              // nodes that were manually toggled.
              showChildItems = show;
              // Manually expanded/collapsed sub nodes
              // should have state restored
              manuallyToggled = item.data('treegrid-manual-state');
              if (typeof manuallyToggled !== 'undefined') {
                console.log(manuallyToggled);
                showChildItems = manuallyToggled;
              }
            }
            if (show) {
              item.show();
              return expand(item);
            } else {
              item.hide();
              return collapse(item);
            }
          }
        };
        return this.grid.visit(initOne);
      }

      cancelClick(e) {
        e.stopPropagation();
        return e.preventDefault();
      }

    };

    
    // Init expands
    // @return boolean whether is expanded

    initExpand = function(item) {
      var el, show;
      el = item.find('.expander');
      if (el.find('.expanded:visible').length) {
        el.find('.expanded').hide();
        el.find('.collapsed').show();
        show = false;
      } else {
        el.find('.collapsed').hide();
        el.find('.expanded').show();
        show = true;
      }
      return show;
    };

    
    // Expand expanders

    expand = function(item) {
      var el;
      el = item.find('.expander');
      el.find('.collapsed').hide();
      return el.find('.expanded').show();
    };

    
    // Collapse expanders

    collapse = function(item) {
      var el;
      el = item.find('.expander');
      el.find('.expanded').hide();
      return el.find('.collapsed').show();
    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    Expanders.prototype.grid = null;

    return Expanders;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator = (function() {
    var coarse, indicator, initialized, precise;

    
    // Insert indicator

    class InsertIndicator {
      constructor(grid) {
        this.grid = grid;
        if (!initialized) {
          this.create();
          initialized = true;
        }
      }

      hide() {
        return indicator.hide();
      }

      show() {
        return indicator.show();
      }

      accept() {
        return indicator.css({
          color: 'green'
        });
      }

      deny() {
        return indicator.css({
          color: 'red'
        });
      }

      
      // Place over element, with hitMode param

      over(dragged, draggedOver, hitMode = 'over', accepter) {
        var left, mid, midFactor, node, nodeMid, offset, top, widthOffset;
        this.accept();
        accepter.accept();
        if (hitMode === 'over') {
          this.precise(false);
        } else {
          this.precise(true);
        }
        if (this.grid.canDrop(dragged, draggedOver, hitMode)) {
          this.accept();
          accepter.accept();
        } else {
          this.deny();
          accepter.deny();
        }
        node = draggedOver.find('.tree-grid-drag-handle');
        widthOffset = 0;
        midFactor = 1.5;
        offset = node.offset();
        mid = indicator.outerHeight(true) / midFactor;
        if (hitMode === 'over') {
          nodeMid = node.outerHeight(true) / midFactor;
          top = offset.top + nodeMid - mid;
        }
        if (hitMode === 'before') {
          top = offset.top - mid;
        }
        if (hitMode === 'after') {
          top = offset.top + node.outerHeight(true) - mid;
        }
        left = offset.left + widthOffset;
        indicator.css({
          left: left
        });
        indicator.css({
          top: top
        });
        return this.show();
      }

      
      // Show or hide precise indicator

      precise(showPrecise = true) {
        if (showPrecise) {
          return precise.show();
        } else {
          return precise.hide();
        }
      }

      create() {
        indicator = jQuery(`<div class="tree-grid-insert-indicator" style="display:none;position:absolute;z-index: 10000;color:green;line-height: 1em;">
	<span class="tree-grid-insert-indicator-coarse" style="font-size: 1.5em;">
		&#9654;
	</span>
	<span class="tree-grid-insert-indicator-precise" style="font-size:1.4em;">
		&#11835;
	</span>
</div>`);
        indicator.appendTo('body');
        coarse = indicator.find('.tree-grid-insert-indicator-coarse');
        return precise = indicator.find('.tree-grid-insert-indicator-precise');
      }

    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    InsertIndicator.prototype.grid = null;

    
    // @private
    // @static

    initialized = false;

    
    // Indicator main wrapper
    // @var jQuery element
    // @private
    // @static

    indicator = null;

    
    // Indicator coarse item
    // @var jQuery element
    // @private
    // @static

    coarse = null;

    
    // Indicator precise item
    // @var jQuery element
    // @private
    // @static

    precise = null;

    return InsertIndicator;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.TreeGridView = (function() {
    var cellsStyles;

    class TreeGridView {
      constructor(element, valueAccessor = null, context1 = 'init') {
        var j, len, plugin, ref46;
        
        // Visit each node starting from tree root and apply callback.
        // Callback accepts two parameters:

        // * parent - contains current element parent item, might be null
        // * data - contains data attached to element

        this.visitRecursive = this.visitRecursive.bind(this);
        this.getParent = this.getParent.bind(this);
        this.getRoot = this.getRoot.bind(this);
        this.getContext = this.getContext.bind(this);
        
        // Check if parent have child

        this.have = this.have.bind(this);
        
        // Check if it is last on list of table rows

        this.isLast = this.isLast.bind(this);
        
        // Check if can actually drop on draggedOver

        this.canDrop = this.canDrop.bind(this);
        this.remove = this.remove.bind(this);
        
        // Set widths of table cells to strict values.
        // This prevents flickering table when moving nodes.

        this.freeze = this.freeze.bind(this);
        
        // Set widths of table cells back to original style, set by freeze()

        this.thaw = this.thaw.bind(this);
        //		setTimeout defer, 0
        this.getFirstCells = this.getFirstCells.bind(this);
        this.context = context1;
        this.element = jQuery(element);
        if (valueAccessor) {
          this.config = {};
          this.config = ko.unwrap(valueAccessor());
          ref46 = TreeGridView.plugins;
          for (j = 0, len = ref46.length; j < len; j++) {
            plugin = ref46[j];
            new plugin(this);
          }
        }
      }

      //			console.log data
      init() {
        jQuery(document).on('ajaxStart', this.freeze);
        return jQuery(document).on('ajaxComplete', this.thaw);
      }

      dispose() {
        jQuery(document).off('ajaxStart', this.freeze);
        return jQuery(document).off('ajaxComplete', this.thaw);
      }

      
      // Visit each node and apply callback.
      // Callback accepts two parameters:

      // * element - contains current row jQuery element
      // * data - contains data attached to element

      visit(callback) {
        var data, item, items, j, len, results;
        items = this.element.find('> tr');
        results = [];
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          data = ko.dataFor(item);
          results.push(callback(jQuery(item), data));
        }
        return results;
      }

      visitRecursive(callback, model = null) {
        var child, j, k, l, len, len1, len2, len3, m, ref46, ref47, results, results1;
        if (!model) {
          model = this.getRoot();
          callback(null, model);
          if (model.children && model.children.length) {
            ref46 = model.children;
            for (j = 0, len = ref46.length; j < len; j++) {
              child = ref46[j];
              callback(model, child);
              this.visitRecursive(callback, child);
            }
          }
          // Array node
          if (model.length) {
            results = [];
            for (k = 0, len1 = model.length; k < len1; k++) {
              child = model[k];
              callback(model, child);
              results.push(this.visitRecursive(callback, child));
            }
            return results;
          }
        } else {
          if (model.children && model.children.length) {
            ref47 = model.children;
            for (l = 0, len2 = ref47.length; l < len2; l++) {
              child = ref47[l];
              callback(model, child);
              this.visitRecursive(callback, child);
            }
          }
          // Array node
          if (model.length) {
            results1 = [];
            for (m = 0, len3 = model.length; m < len3; m++) {
              child = model[m];
              callback(model, child);
              results1.push(this.visitRecursive(callback, child));
            }
            return results1;
          }
        }
      }

      getParent(model) {
        var found, one;
        found = null;
        one = function(parent, data) {
          if (data === model) {
            return found = parent;
          }
        };
        // Don't set model here to start from root
        this.visitRecursive(one);
        return found;
      }

      getRoot() {
        var ctx;
        ctx = ko.contextFor(this.element.get(0));
        return ctx.tree;
      }

      getContext() {
        return ko.contextFor(this.element.get(0));
      }

      have(parent, child) {
        var found, one;
        found = false;
        one = function(parent, data) {
          if (data === child) {
            return found = true;
          }
        };
        // Start from parent here
        this.visitRecursive(one, parent);
        return found;
      }

      isLast(model) {
        var last, lastRow;
        lastRow = this.element.find('> tr:last()');
        last = ko.dataFor(lastRow.get(0));
        if (model === last) {
          return true;
        }
        return false;
      }

      canDrop(dragged, draggedOver, hitMode) {
        var current, over;
        current = ko.dataFor(dragged);
        over = ko.dataFor(draggedOver.get(0));
        //		log current.title
        //		log over.title

        // Allow adding to the end of table
        if (hitMode === 'last') {
          return true;
        }
        // Allow adding to the end of list
        if (hitMode === 'after') {
          return true;
        }
        // Forbid dropping on itself
        if (current === over) {
          return false;
        }
        // Forbid dropping on children of current node
        if (this.have(current, over)) {
          return false;
        }
        return true;
      }

      remove(model) {
        var one;
        one = function(parent, data) {
          if (parent) {
            // Model initialized
            if (parent.children) {
              return parent.children.remove(model);
            } else {
              // Array initialized
              return parent.remove(model);
            }
          }
        };
        // Don't set model here to start from root
        return this.visitRecursive(one);
      }

      expandAll() {}

      collapseAll() {}

      freeze() {
        var $cell, cell, cells, j, len, results;
        console.log("Freeze");
        // Reset stored width values
        cellsStyles = [];
        cells = this.getFirstCells();
        console.log(cells);
        results = [];
        for (j = 0, len = cells.length; j < len; j++) {
          cell = cells[j];
          //			log cell
          cellsStyles.push(cell.style);
          $cell = jQuery(cell);
          //			log $cell.width()
          results.push($cell.css('width', $cell.width() + 'px'));
        }
        return results;
      }

      thaw() {
        var defer;
        defer = () => {
          var cell, cells, index, j, len, results;
          console.log('thaw');
          cells = this.getFirstCells();
          results = [];
          for (index = j = 0, len = cells.length; j < len; index = ++j) {
            cell = cells[index];
            results.push(cell.style = cellsStyles[index]);
          }
          return results;
        };
        // TODO setTimeout should be avoided, investigate if should be used
        // Unfreezing takes some time...
        // This needs to be delayed a bit or flicker will still occur
        return defer();
      }

      getFirstCells() {
        var cells, table;
        table = this.element;
        if (this.element.is('tbody')) {
          table = this.element.parent();
        }
        cells = table.find('thead tr:first() th');
        if (!cells || !cells.length) {
          cells = table.find('tr:first() td');
        }
        if (!cells || !cells.length) {
          cells = table.find('tbody tr:first() td');
        }
        if (!cells || !cells.length) {
          cells = table.find('tfoot tr:first() th');
        }
        return cells;
      }

    };

    
    // Plugins for tree grid

    // NOTE: Order of plugins *might* be important, especially for built-in plugins

    // @var Object[]

    TreeGridView.plugins = [Maslosoft.Binder.Widgets.TreeGrid.Expanders, Maslosoft.Binder.Widgets.TreeGrid.Dnd, Maslosoft.Binder.Widgets.TreeGrid.Events];

    
    // TBODY element - root of tree

    // @var jQuery element

    TreeGridView.prototype.element = null;

    
    // Configuration of binding

    // @var Object

    TreeGridView.prototype.config = null;

    cellsStyles = [];

    return TreeGridView;

  }).call(this);

  this.Maslosoft.Ko.getType = function(type) {
    if (x && typeof x === 'object') {
      if (x.constructor === Date) {
        return 'date';
      }
      if (x.constructor === Array) {
        return 'array';
      }
    }
    return typeof x;
  };

  this.Maslosoft.Ko.objByName = function(name, context = window) {
    var args, func, i, j, len, n, ns, part;
    args = Array.prototype.slice.call(arguments, 2);
    ns = name.split(".");
    func = context;
    part = [];
    for (i = j = 0, len = ns.length; j < len; i = ++j) {
      n = ns[i];
      part.push(n);
      if (typeof func[n] === 'undefined') {
        throw new Error(`Name part \`${part.join('.')}\` not found while accesing ${name}`);
      }
      func = func[n];
    }
    return func;
  };

  this.Maslosoft.Ko.Track = class Track {
    constructor() {
      this.factory = this.factory.bind(this);
      this.fromJs = this.fromJs.bind(this);
    }

    factory(data) {
      var Error, className, index, j, len, model, name, ref, value;
      // Return if falsey value
      if (!data) {
        return data;
      }
      // Check if has prototype
      if (data._class && typeof data._class === 'string') {
        // Convert PHP class name to js class name
        className = data._class.replace(/\\/g, '.');
        try {
          ref = Maslosoft.Ko.objByName(className);
        } catch (error1) {
          Error = error1;
          console.warn(`Could not resolve class name \`${className}\``);
        }
        if (ref) {
          return new ref(data);
        } else {
          console.warn(`Class \`${className}\` not found, using default object`);
          console.debug(data);
        }
      }
      // Track generic object
      if (typeof data === 'object') {
        data = ko.track(data, {
          deep: true
        });
        // Check if array (different loop used here)
        if (Array.isArray(data)) {
          for (index = j = 0, len = data.length; j < len; index = ++j) {
            model = data[index];
            data[index] = this.factory(model);
          }
        } else {
          for (name in data) {
            value = data[name];
            data[name] = this.factory(value);
          }
        }
      }
      return data;
    }

    fromJs(model, jsData) {
      var name, results, value;
      results = [];
      for (name in jsData) {
        value = jsData[name];
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            model[name] = this.factory(value);
            continue;
          }
          if (model[name]) {
            results.push(this.fromJs(model[name], value));
          } else {
            results.push(model[name] = this.factory(value));
          }
        } else {
          results.push(model[name] = value);
        }
      }
      return results;
    }

  };

  ko.tracker = new this.Maslosoft.Ko.Track();

  if (!window.Proxy) {
    console.warn('Your browser does not support Proxy, will not work properly in some cases...');
    window.Proxy = class Proxy {};
  }

  ModelProxyHandler = class ModelProxyHandler {
    constructor(parent1, field1) {
      this.parent = parent1;
      this.field = field1;
    }

    set(target, name, value, receiver) {
      var after, before, changed;
      changed = false;
      // Detect value change
      if (target[name] !== value) {
        //			log "Changed: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
        changed = true;
      }
      // Detect keys change
      before = Object.keys(target).length;
      target[name] = value;
      after = Object.keys(target).length;
      if (before !== after) {
        //			log "New key: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
        changed = true;
      }
      
      // Notify change
      if (changed) {
        ko.valueHasMutated(this.parent, this.field);
      }
      return true;
    }

    deleteProperty(target, name) {
      delete target[name];
      // Notify change
      //		log "Deleted: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
      ko.valueHasMutated(this.parent, this.field);
      return true;
    }

  };

  // Map for concrete objects initializations
  if (WeakMap) {
    initMap = new WeakMap();
  } else {
    initMap = new Map();
  }

  this.Maslosoft.Binder.Model = class Model {
    constructor(data = null) {
      var initialized, name, ref46, ref47, ref48, value;
      initialized = initMap.get(this);
      ref46 = this;
      // Dereference first
      for (name in ref46) {
        value = ref46[name];
        if (isPlainObject(this[name])) {
          this[name] = {};
        }
        if (Array.isArray(this[name])) {
          this[name] = [];
        }
      }
      // Initialize new object
      if (!initialized) {
        initMap.set(this, true);
        ref47 = this;
        // Reassign here is required - when using model with values from class prototype only
        for (name in ref47) {
          value = ref47[name];
          this[name] = ko.tracker.factory(value);
          // Extra track of object properties.
          if (isPlainObject(this[name])) {
            this[name] = new Proxy(this[name], new ModelProxyHandler(this, name));
          }
        }
      }
// Apply data
      for (name in data) {
        value = data[name];
        this[name] = ko.tracker.factory(value);
      }
      ref48 = this;
      // Track plain objects always
      for (name in ref48) {
        value = ref48[name];
        if (isPlainObject(this[name])) {
          this[name] = new Proxy(this[name], new ModelProxyHandler(this, name));
        }
      }
      ko.track(this, {
        deep: true
      });
    }

  };

  // For backward compatibility
  this.Maslosoft.Ko.Balin = this.Maslosoft.Binder;

  this.Maslosoft.Ko.escapeRegExp = escapeRegExp;

  this.Maslosoft.Ko.escapeHtml = escapeHtml;

  this.Maslosoft.Ko.equals = equals;

  this.Maslosoft.Ko.stringToColour = stringToColour;

  this.Maslosoft.Ko.preload = preload;

  this.Maslosoft.Ko.numberFormat = numberFormat;

  this.Maslosoft.Ko.lcfirst = lcfirst;

  this.Maslosoft.Ko.ucfirst = ucfirst;

}).call(this);

//# sourceMappingURL=ko.binder-noinit.js.map
