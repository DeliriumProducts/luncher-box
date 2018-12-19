(window.webpackJsonp = window.webpackJsonp || []).push([
  [8],
  {
    490: function(t, e, n) {
      __NEXT_REGISTER_PAGE('/staffchat', function() {
        return (t.exports = n(491)), { page: t.exports.default };
      });
    },
    491: function(t, e, n) {
      'use strict';
      n.r(e),
        n.d(e, 'default', function() {
          return s;
        });
      var o = n(1),
        r = n.n(o),
        u = n(35);
      function c(t) {
        return (c =
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
      function i(t, e) {
        for (var n = 0; n < e.length; n++) {
          var o = e[n];
          (o.enumerable = o.enumerable || !1),
            (o.configurable = !0),
            'value' in o && (o.writable = !0),
            Object.defineProperty(t, o.key, o);
        }
      }
      function f(t, e) {
        return !e || ('object' !== c(e) && 'function' != typeof e)
          ? (function(t) {
              if (void 0 === t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return t;
            })(t)
          : e;
      }
      function a(t) {
        return (a = Object.setPrototypeOf
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
          displayName: 'staffchat__Container',
          componentId: 'sc-1necdc-0'
        })(['height:100%;']),
        s = (function(t) {
          function e() {
            return (
              (function(t, e) {
                if (!(t instanceof e))
                  throw new TypeError('Cannot call a class as a function');
              })(this, e),
              f(this, a(e).apply(this, arguments))
            );
          }
          var n, c, s;
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
            (c = [
              {
                key: 'render',
                value: function() {
                  return r.a.createElement(
                    l,
                    null,
                    r.a.createElement(u.a, { selectedKey: 'chat' })
                  );
                }
              }
            ]) && i(n.prototype, c),
            s && i(n, s),
            e
          );
        })();
    }
  },
  [[490, 1, 0]]
]);
