(window.webpackJsonp = window.webpackJsonp || []).push([
  [7],
  {
    488: function(t, e, n) {
      __NEXT_REGISTER_PAGE('/restaurantload', function() {
        return (t.exports = n(489)), { page: t.exports.default };
      });
    },
    489: function(t, e, n) {
      'use strict';
      n.r(e),
        n.d(e, 'default', function() {
          return s;
        });
      var o = n(1),
        r = n.n(o),
        u = n(35);
      function i(t) {
        return (i =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function(t) {
                return typeof t;
              }
            : function(t) {
                return t &&
                  'function' == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? 'symbol'
                  : typeof t;
              })(t);
      }
      function c(t, e) {
        for (var n = 0; n < e.length; n++) {
          var o = e[n];
          (o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            'value' in o && (o.writable = !0),
            Object.defineProperty(t, o.key, o);
        }
      }
      function a(t, e) {
        return !e || ('object' !== i(e) && 'function' != typeof e)
          ? (function(t) {
              if (void 0 === t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return t;
            })(t)
          : e;
      }
      function f(t) {
        return (f = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function(t) {
              return t.__proto__ || Object.getPrototypeOf(t);
            })(t);
      }
      function p(t, e) {
        return (p =
          Object.setPrototypeOf ||
          function(t, e) {
            return (t.__proto__ = e), t;
          })(t, e);
      }
      var l = n(17).b.div.withConfig({
          displayName: 'restaurantload__Container',
          componentId: 'sc-1k9kjmj-0'
        })(['height:100%;']),
        s = (function(t) {
          function e() {
            return (
              (function(t, e) {
                if (!(t instanceof e))
                  throw new TypeError('Cannot call a class as a function');
              })(this, e),
              a(this, f(e).apply(this, arguments))
            );
          }
          var n, i, s;
          return (
            (function(t, e) {
              if ('function' != typeof e && null !== e)
                throw new TypeError(
                  'Super expression must either be null or a function'
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: { value: t, writable: !0, configurable: !0 }
              })),
                e && p(t, e);
            })(e, o['Component']),
            (n = e),
            (i = [
              {
                key: 'render',
                value: function() {
                  return r.a.createElement(
                    l,
                    null,
                    r.a.createElement(u.a, { selectedKey: 'load' })
                  );
                }
              }
            ]) && c(n.prototype, i),
            s && c(n, s),
            e
          );
        })();
    }
  },
  [[488, 1, 0]]
]);
