var wrapVueWebComponent = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var camelizeRE = /-(\w)/g;
  var camelize = function camelize(str) {
    return str.replace(camelizeRE, function (_, c) {
      return c ? c.toUpperCase() : '';
    });
  };
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = function hyphenate(str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
  };
  function getInitialProps(propsList) {
    var res = {};
    propsList.forEach(function (key) {
      res[key] = undefined;
    });
    return res;
  }
  function injectHook(options, key, hook) {
    options[key] = [].concat(options[key] || []);
    options[key].unshift(hook);
  }
  function callHooks(vm, hook) {
    if (vm) {
      var hooks = vm.$options[hook] || [];
      hooks.forEach(function (hook) {
        hook.call(vm);
      });
    }
  }
  function createCustomEvent(name, args) {
    return new CustomEvent(name, {
      bubbles: false,
      cancelable: false,
      detail: args
    });
  }

  var isBoolean = function isBoolean(val) {
    return /function Boolean/.test(String(val));
  };

  var isNumber = function isNumber(val) {
    return /function Number/.test(String(val));
  };

  function convertAttributeValue(value, name) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        type = _ref.type;

    if (isBoolean(type)) {
      if (value === 'true' || value === 'false') {
        return value === 'true';
      }

      if (value === '' || value === name) {
        return true;
      }

      return value != null;
    } else if (isNumber(type)) {
      var parsed = parseFloat(value, 10);
      return isNaN(parsed) ? value : parsed;
    } else {
      return value;
    }
  }
  function toVNodes(h, children) {
    var res = [];

    for (var i = 0, l = children.length; i < l; i++) {
      res.push(toVNode(h, children[i]));
    }

    return res;
  }

  function toVNode(h, node) {
    if (node.nodeType === 3) {
      return node.data.trim() ? node.data : null;
    } else if (node.nodeType === 1) {
      var data = {
        attrs: getAttributes(node),
        domProps: {
          innerHTML: node.innerHTML
        }
      };

      if (data.attrs.slot) {
        data.slot = data.attrs.slot;
        delete data.attrs.slot;
      }

      return h(node.tagName, data);
    } else {
      return null;
    }
  }

  function getAttributes(node) {
    var res = {};

    for (var i = 0, l = node.attributes.length; i < l; i++) {
      var attr = node.attributes[i];
      res[attr.nodeName] = attr.nodeValue;
    }

    return res;
  }

  function wrap(Vue, Component) {
    var additionalOtions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var isAsync = typeof Component === 'function' && !Component.cid;
    var _additionalOtions$use = additionalOtions.useShadowDOM,
        useShadowDOM = _additionalOtions$use === void 0 ? true : _additionalOtions$use;
    var _additionalOtions$plu = additionalOtions.plugins,
        plugins = _additionalOtions$plu === void 0 ? {} : _additionalOtions$plu;
    var isInitialized = false;
    var hyphenatedPropsList;
    var camelizedPropsList;
    var camelizedPropsMap;

    function initialize(Component) {
      if (isInitialized) return;
      var options = typeof Component === 'function' ? Component.options : Component; // extract props info

      var propsList = Array.isArray(options.props) ? options.props : Object.keys(options.props || {});
      hyphenatedPropsList = propsList.map(hyphenate);
      camelizedPropsList = propsList.map(camelize);
      var originalPropsAsObject = Array.isArray(options.props) ? {} : options.props || {};
      camelizedPropsMap = camelizedPropsList.reduce(function (map, key, i) {
        map[key] = originalPropsAsObject[propsList[i]];
        return map;
      }, {}); // proxy $emit to native DOM events

      injectHook(options, 'beforeCreate', function () {
        var _this = this;

        var emit = this.$emit;

        this.$emit = function (name) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          _this.$root.$options.customElement.dispatchEvent(createCustomEvent(name, args));

          return emit.call.apply(emit, [_this, name].concat(args));
        };
      });
      injectHook(options, 'created', function () {
        var _this2 = this;

        // sync default props values to wrapper on created
        camelizedPropsList.forEach(function (key) {
          _this2.$root.props[key] = _this2[key];
        });
      }); // Thron Component, on mounted use defIsReady promise:

      injectHook(options, 'mounted', function () {
        var _this3 = this;

        // sync default props values to wrapper on created
        this.defIsReady.promise.then(function () {
          return _this3.$root.resolvedPromise(_this3.api);
        });
      }); // proxy props as Element properties

      camelizedPropsList.forEach(function (key) {
        Object.defineProperty(CustomElement.prototype, key, {
          get: function get() {
            return this._wrapper.props[key];
          },
          set: function set(newVal) {
            this._wrapper.props[key] = newVal;
          },
          enumerable: false,
          configurable: true
        });
      });
      isInitialized = true;
    }

    function syncAttribute(el, key) {
      var camelized = camelize(key);
      var value = el.hasAttribute(key) ? el.getAttribute(key) : undefined;
      el._wrapper.props[camelized] = convertAttributeValue(value, key, camelizedPropsMap[camelized]);
    }

    var CustomElement =
    /*#__PURE__*/
    function (_HTMLElement) {
      _inherits(CustomElement, _HTMLElement);

      function CustomElement() {
        var _this4;

        _classCallCheck(this, CustomElement);

        var self = _this4 = _possibleConstructorReturn(this, _getPrototypeOf(CustomElement).call(this));

        var resolvedPromise = null;
        _this4.ready = new Promise(function (r) {
          resolvedPromise = r;
        });
        if (useShadowDOM) self.attachShadow({
          mode: 'open'
        });
        var wrapperItem = {
          name: 'shadow-root',
          customElement: self,
          shadowRoot: self.shadowRoot,
          data: function data() {
            return {
              props: {},
              slotChildren: []
            };
          },
          render: function render(h) {
            return h(Component, {
              ref: 'inner',
              props: this.props
            }, this.slotChildren);
          }
        };
        var wrapper = self._wrapper = new Vue(Object.assign(wrapperItem, plugins)); // Pass resolvedPromise to $root:

        wrapper.resolvedPromise = resolvedPromise; // Use MutationObserver to react to future attribute & slot content change

        var observer = new MutationObserver(function (mutations) {
          var hasChildrenChange = false;

          for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];

            if (isInitialized && m.type === 'attributes' && m.target === self) {
              syncAttribute(self, m.attributeName);
            } else {
              hasChildrenChange = true;
            }
          }

          if (hasChildrenChange) {
            wrapper.slotChildren = Object.freeze(toVNodes(wrapper.$createElement, self.childNodes));
          }
        });
        observer.observe(self, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true
        });
        return _this4;
      }

      _createClass(CustomElement, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          var _this5 = this;

          var wrapper = this._wrapper;

          if (!wrapper._isMounted) {
            // initialize attributes
            var syncInitialAttributes = function syncInitialAttributes() {
              wrapper.props = getInitialProps(camelizedPropsList);
              hyphenatedPropsList.forEach(function (key) {
                syncAttribute(_this5, key);
              });
            };

            if (isInitialized) {
              syncInitialAttributes();
            } else {
              // async & unresolved
              Component().then(function (resolved) {
                if (resolved.__esModule || resolved[Symbol.toStringTag] === 'Module') {
                  resolved = resolved.default;
                }

                initialize(resolved);
                syncInitialAttributes();
              });
            } // initialize children


            wrapper.slotChildren = Object.freeze(toVNodes(wrapper.$createElement, this.childNodes));
            wrapper.$mount();

            if (useShadowDOM) {
              this.shadowRoot.appendChild(wrapper.$el);
            } else {
              this.appendChild(wrapper.$el);
            }
          } else {
            callHooks(this.vueComponent, 'activated');
          }
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          callHooks(this.vueComponent, 'deactivated');
        }
      }, {
        key: "vueComponent",
        get: function get() {
          return this._wrapper.$refs.inner;
        }
      }]);

      return CustomElement;
    }(_wrapNativeSuper(HTMLElement));

    if (!isAsync) {
      initialize(Component);
    }

    return CustomElement;
  }

  return wrap;

}());
