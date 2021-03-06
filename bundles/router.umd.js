/**
 * @license AngularJS v0.0.0-PLACEHOLDER
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs/add/operator/map'), require('rxjs/add/operator/mergeMap'), require('rxjs/add/operator/mergeAll'), require('rxjs/add/operator/every'), require('rxjs/add/observable/from'), require('rxjs/Observable'), require('rxjs/Subject'), require('rxjs/observable/of'), require('rxjs/BehaviorSubject'), require('rxjs/add/operator/toPromise'), require('rxjs/observable/forkJoin'), require('rxjs/observable/fromPromise'), require('@angular/platform-browser')) :
        typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', 'rxjs/add/operator/map', 'rxjs/add/operator/mergeMap', 'rxjs/add/operator/mergeAll', 'rxjs/add/operator/every', 'rxjs/add/observable/from', 'rxjs/Observable', 'rxjs/Subject', 'rxjs/observable/of', 'rxjs/BehaviorSubject', 'rxjs/add/operator/toPromise', 'rxjs/observable/forkJoin', 'rxjs/observable/fromPromise', '@angular/platform-browser'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}), global.ng.common, global.ng.core, global.rxjs_add_operator_map, global.rxjs_add_operator_mergeMap, global.rxjs_add_operator_mergeAll, global.rxjs_add_operator_every, global.rxjs_add_observable_from, global.Rx, global.Rx, global.rxjs_observable_of, global.Rx, global.rxjs_add_operator_toPromise, global.rxjs_observable_forkJoin, global.rxjs_observable_fromPromise, global.ng.platformBrowser));
}(this, function (exports, _angular_common, _angular_core, rxjs_add_operator_map, rxjs_add_operator_mergeMap, rxjs_add_operator_mergeAll, rxjs_add_operator_every, rxjs_add_observable_from, rxjs_Observable, rxjs_Subject, rxjs_observable_of, rxjs_BehaviorSubject, rxjs_add_operator_toPromise, rxjs_observable_forkJoin, rxjs_observable_fromPromise, _angular_platformBrowser) {
    'use strict';
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Name of the primary outlet.
     * @type {string}
     */
    var PRIMARY_OUTLET = 'PRIMARY_OUTLET';
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function shallowEqual(a, b) {
        var k1 = Object.keys(a);
        var k2 = Object.keys(b);
        if (k1.length != k2.length) {
            return false;
        }
        var key;
        for (var i = 0; i < k1.length; i++) {
            key = k1[i];
            if (a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    }
    function last(a) {
        return a.length > 0 ? a[a.length - 1] : null;
    }
    function merge(m1, m2) {
        var m = {};
        for (var attr in m1) {
            if (m1.hasOwnProperty(attr)) {
                m[attr] = m1[attr];
            }
        }
        for (var attr in m2) {
            if (m2.hasOwnProperty(attr)) {
                m[attr] = m2[attr];
            }
        }
        return m;
    }
    function forEach(map, callback) {
        for (var prop in map) {
            if (map.hasOwnProperty(prop)) {
                callback(map[prop], prop);
            }
        }
    }
    function createEmptyUrlTree() {
        return new UrlTree(new UrlSegment([], {}), {}, null);
    }
    function containsTree(container, containee, exact) {
        if (exact) {
            return equalSegments(container.root, containee.root);
        }
        else {
            return containsSegment(container.root, containee.root);
        }
    }
    function equalSegments(container, containee) {
        if (!equalPath(container.pathsWithParams, containee.pathsWithParams))
            return false;
        if (Object.keys(container.children).length !== Object.keys(containee.children).length)
            return false;
        for (var c in containee.children) {
            if (!container.children[c])
                return false;
            if (!equalSegments(container.children[c], containee.children[c]))
                return false;
        }
        return true;
    }
    function containsSegment(container, containee) {
        return containsSegmentHelper(container, containee, containee.pathsWithParams);
    }
    function containsSegmentHelper(container, containee, containeePaths) {
        if (container.pathsWithParams.length > containeePaths.length) {
            var current = container.pathsWithParams.slice(0, containeePaths.length);
            if (!equalPath(current, containeePaths))
                return false;
            if (Object.keys(containee.children).length > 0)
                return false;
            return true;
        }
        else if (container.pathsWithParams.length === containeePaths.length) {
            if (!equalPath(container.pathsWithParams, containeePaths))
                return false;
            for (var c in containee.children) {
                if (!container.children[c])
                    return false;
                if (!containsSegment(container.children[c], containee.children[c]))
                    return false;
            }
            return true;
        }
        else {
            var current = containeePaths.slice(0, container.pathsWithParams.length);
            var next = containeePaths.slice(container.pathsWithParams.length);
            if (!equalPath(container.pathsWithParams, current))
                return false;
            return containsSegmentHelper(container.children[PRIMARY_OUTLET], containee, next);
        }
    }
    /**
     * A URL in the tree form.
     */
    var UrlTree = (function () {
        /**
         * @internal
         */
        function UrlTree(root, queryParams, fragment) {
            this.root = root;
            this.queryParams = queryParams;
            this.fragment = fragment;
        }
        UrlTree.prototype.toString = function () { return new DefaultUrlSerializer().serialize(this); };
        return UrlTree;
    }());
    var UrlSegment = (function () {
        function UrlSegment(pathsWithParams, children) {
            var _this = this;
            this.pathsWithParams = pathsWithParams;
            this.children = children;
            this.parent = null;
            forEach(children, function (v, k) { return v.parent = _this; });
        }
        UrlSegment.prototype.hasChildren = function () { return Object.keys(this.children).length > 0; };
        UrlSegment.prototype.toString = function () { return serializePaths(this); };
        return UrlSegment;
    }());
    var UrlPathWithParams = (function () {
        function UrlPathWithParams(path, parameters) {
            this.path = path;
            this.parameters = parameters;
        }
        UrlPathWithParams.prototype.toString = function () { return serializePath(this); };
        return UrlPathWithParams;
    }());
    function equalPath(a, b) {
        if (a.length !== b.length)
            return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i].path !== b[i].path)
                return false;
        }
        return true;
    }
    function mapChildren(segment, fn) {
        var newChildren = {};
        forEach(segment.children, function (child, childOutlet) {
            if (childOutlet === PRIMARY_OUTLET) {
                newChildren[childOutlet] = fn(child, childOutlet);
            }
        });
        forEach(segment.children, function (child, childOutlet) {
            if (childOutlet !== PRIMARY_OUTLET) {
                newChildren[childOutlet] = fn(child, childOutlet);
            }
        });
        return newChildren;
    }
    function mapChildrenIntoArray(segment, fn) {
        var res = [];
        forEach(segment.children, function (child, childOutlet) {
            if (childOutlet === PRIMARY_OUTLET) {
                res = res.concat(fn(child, childOutlet));
            }
        });
        forEach(segment.children, function (child, childOutlet) {
            if (childOutlet !== PRIMARY_OUTLET) {
                res = res.concat(fn(child, childOutlet));
            }
        });
        return res;
    }
    /**
     * Defines a way to serialize/deserialize a url tree.
     */
    var UrlSerializer = (function () {
        function UrlSerializer() {
        }
        return UrlSerializer;
    }());
    /**
     * A default implementation of the serialization.
     */
    var DefaultUrlSerializer = (function () {
        function DefaultUrlSerializer() {
        }
        DefaultUrlSerializer.prototype.parse = function (url) {
            var p = new UrlParser(url);
            return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
        };
        DefaultUrlSerializer.prototype.serialize = function (tree) {
            var segment = "/" + serializeSegment(tree.root, true);
            var query = serializeQueryParams(tree.queryParams);
            var fragment = tree.fragment !== null ? "#" + tree.fragment : '';
            return "" + segment + query + fragment;
        };
        return DefaultUrlSerializer;
    }());
    function serializePaths(segment) {
        return segment.pathsWithParams.map(function (p) { return serializePath(p); }).join('/');
    }
    function serializeSegment(segment, root) {
        if (segment.children[PRIMARY_OUTLET] && root) {
            var primary = serializeSegment(segment.children[PRIMARY_OUTLET], false);
            var children_1 = [];
            forEach(segment.children, function (v, k) {
                if (k !== PRIMARY_OUTLET) {
                    children_1.push(k + ":" + serializeSegment(v, false));
                }
            });
            if (children_1.length > 0) {
                return primary + "(" + children_1.join('//') + ")";
            }
            else {
                return "" + primary;
            }
        }
        else if (segment.hasChildren() && !root) {
            var children = mapChildrenIntoArray(segment, function (v, k) {
                if (k === PRIMARY_OUTLET) {
                    return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
                }
                else {
                    return [(k + ":" + serializeSegment(v, false))];
                }
            });
            return serializePaths(segment) + "/(" + children.join('//') + ")";
        }
        else {
            return serializePaths(segment);
        }
    }
    function serializePath(path) {
        return "" + path.path + serializeParams(path.parameters);
    }
    function serializeParams(params) {
        return pairs(params).map(function (p) { return (";" + p.first + "=" + p.second); }).join('');
    }
    function serializeQueryParams(params) {
        var strs = pairs(params).map(function (p) { return (p.first + "=" + p.second); });
        return strs.length > 0 ? "?" + strs.join("&") : '';
    }
    var Pair = (function () {
        function Pair(first, second) {
            this.first = first;
            this.second = second;
        }
        return Pair;
    }());
    function pairs(obj) {
        var res = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                res.push(new Pair(prop, obj[prop]));
            }
        }
        return res;
    }
    var SEGMENT_RE = /^[^\/\(\)\?;=&#]+/;
    function matchPathWithParams(str) {
        SEGMENT_RE.lastIndex = 0;
        var match = SEGMENT_RE.exec(str);
        return match ? match[0] : '';
    }
    var QUERY_PARAM_RE = /^[^=\?&#]+/;
    function matchQueryParams(str) {
        QUERY_PARAM_RE.lastIndex = 0;
        var match = SEGMENT_RE.exec(str);
        return match ? match[0] : '';
    }
    var QUERY_PARAM_VALUE_RE = /^[^\?&#]+/;
    function matchUrlQueryParamValue(str) {
        QUERY_PARAM_VALUE_RE.lastIndex = 0;
        var match = QUERY_PARAM_VALUE_RE.exec(str);
        return match ? match[0] : '';
    }
    var UrlParser = (function () {
        function UrlParser(remaining) {
            this.remaining = remaining;
        }
        UrlParser.prototype.peekStartsWith = function (str) { return this.remaining.startsWith(str); };
        UrlParser.prototype.capture = function (str) {
            if (!this.remaining.startsWith(str)) {
                throw new Error("Expected \"" + str + "\".");
            }
            this.remaining = this.remaining.substring(str.length);
        };
        UrlParser.prototype.parseRootSegment = function () {
            if (this.remaining === '' || this.remaining === '/') {
                return new UrlSegment([], {});
            }
            else {
                return new UrlSegment([], this.parseSegmentChildren());
            }
        };
        UrlParser.prototype.parseSegmentChildren = function () {
            if (this.remaining.length == 0) {
                return {};
            }
            if (this.peekStartsWith('/')) {
                this.capture('/');
            }
            var paths = [this.parsePathWithParams()];
            while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
                this.capture('/');
                paths.push(this.parsePathWithParams());
            }
            var children = {};
            if (this.peekStartsWith('/(')) {
                this.capture('/');
                children = this.parseParens(true);
            }
            var res = {};
            if (this.peekStartsWith('(')) {
                res = this.parseParens(false);
            }
            res[PRIMARY_OUTLET] = new UrlSegment(paths, children);
            return res;
        };
        UrlParser.prototype.parsePathWithParams = function () {
            var path = matchPathWithParams(this.remaining);
            this.capture(path);
            var matrixParams = {};
            if (this.peekStartsWith(';')) {
                matrixParams = this.parseMatrixParams();
            }
            return new UrlPathWithParams(path, matrixParams);
        };
        UrlParser.prototype.parseQueryParams = function () {
            var params = {};
            if (this.peekStartsWith('?')) {
                this.capture('?');
                this.parseQueryParam(params);
                while (this.remaining.length > 0 && this.peekStartsWith('&')) {
                    this.capture('&');
                    this.parseQueryParam(params);
                }
            }
            return params;
        };
        UrlParser.prototype.parseFragment = function () {
            if (this.peekStartsWith('#')) {
                return this.remaining.substring(1);
            }
            else {
                return null;
            }
        };
        UrlParser.prototype.parseMatrixParams = function () {
            var params = {};
            while (this.remaining.length > 0 && this.peekStartsWith(';')) {
                this.capture(';');
                this.parseParam(params);
            }
            return params;
        };
        UrlParser.prototype.parseParam = function (params) {
            var key = matchPathWithParams(this.remaining);
            if (!key) {
                return;
            }
            this.capture(key);
            var value = 'true';
            if (this.peekStartsWith('=')) {
                this.capture('=');
                var valueMatch = matchPathWithParams(this.remaining);
                if (valueMatch) {
                    value = valueMatch;
                    this.capture(value);
                }
            }
            params[key] = value;
        };
        UrlParser.prototype.parseQueryParam = function (params) {
            var key = matchQueryParams(this.remaining);
            if (!key) {
                return;
            }
            this.capture(key);
            var value = 'true';
            if (this.peekStartsWith('=')) {
                this.capture('=');
                var valueMatch = matchUrlQueryParamValue(this.remaining);
                if (valueMatch) {
                    value = valueMatch;
                    this.capture(value);
                }
            }
            params[key] = value;
        };
        UrlParser.prototype.parseParens = function (allowPrimary) {
            var segments = {};
            this.capture('(');
            while (!this.peekStartsWith(')') && this.remaining.length > 0) {
                var path = matchPathWithParams(this.remaining);
                var outletName = void 0;
                if (path.indexOf(':') > -1) {
                    outletName = path.substr(0, path.indexOf(':'));
                    this.capture(outletName);
                    this.capture(':');
                }
                else if (allowPrimary) {
                    outletName = PRIMARY_OUTLET;
                }
                var children = this.parseSegmentChildren();
                segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] :
                    new UrlSegment([], children);
                if (this.peekStartsWith('//')) {
                    this.capture('//');
                }
            }
            this.capture(')');
            return segments;
        };
        return UrlParser;
    }());
    var NoMatch = (function () {
        function NoMatch(segment) {
            if (segment === void 0) { segment = null; }
            this.segment = segment;
        }
        return NoMatch;
    }());
    var GlobalRedirect = (function () {
        function GlobalRedirect(paths) {
            this.paths = paths;
        }
        return GlobalRedirect;
    }());
    function applyRedirects(urlTree, config) {
        try {
            return createUrlTree(urlTree, expandSegment(config, urlTree.root, PRIMARY_OUTLET));
        }
        catch (e) {
            if (e instanceof GlobalRedirect) {
                return createUrlTree(urlTree, new UrlSegment([], (_a = {}, _a[PRIMARY_OUTLET] = new UrlSegment(e.paths, {}), _a)));
            }
            else if (e instanceof NoMatch) {
                return new rxjs_Observable.Observable(function (obs) { return obs.error(new Error("Cannot match any routes: '" + e.segment + "'")); });
            }
            else {
                return new rxjs_Observable.Observable(function (obs) { return obs.error(e); });
            }
        }
        var _a;
    }
    function createUrlTree(urlTree, root) {
        return rxjs_observable_of.of(new UrlTree(root, urlTree.queryParams, urlTree.fragment));
    }
    function expandSegment(routes, segment, outlet) {
        if (segment.pathsWithParams.length === 0 && segment.hasChildren()) {
            return new UrlSegment([], expandSegmentChildren(routes, segment));
        }
        else {
            return expandPathsWithParams(segment, routes, segment.pathsWithParams, outlet, true);
        }
    }
    function expandSegmentChildren(routes, segment) {
        return mapChildren(segment, function (child, childOutlet) { return expandSegment(routes, child, childOutlet); });
    }
    function expandPathsWithParams(segment, routes, paths, outlet, allowRedirects) {
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var r = routes_1[_i];
            try {
                return expandPathsWithParamsAgainstRoute(segment, routes, r, paths, outlet, allowRedirects);
            }
            catch (e) {
                if (!(e instanceof NoMatch))
                    throw e;
            }
        }
        throw new NoMatch(segment);
    }
    function expandPathsWithParamsAgainstRoute(segment, routes, route, paths, outlet, allowRedirects) {
        if ((route.outlet ? route.outlet : PRIMARY_OUTLET) !== outlet)
            throw new NoMatch();
        if (route.redirectTo && !allowRedirects)
            throw new NoMatch();
        if (route.redirectTo) {
            return expandPathsWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet);
        }
        else {
            return matchPathsWithParamsAgainstRoute(segment, route, paths);
        }
    }
    function expandPathsWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet) {
        if (route.path === '**') {
            return expandWildCardWithParamsAgainstRouteUsingRedirect(route);
        }
        else {
            return expandRegularPathWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet);
        }
    }
    function expandWildCardWithParamsAgainstRouteUsingRedirect(route) {
        var newPaths = applyRedirectCommands([], route.redirectTo, {});
        if (route.redirectTo.startsWith('/')) {
            throw new GlobalRedirect(newPaths);
        }
        else {
            return new UrlSegment(newPaths, {});
        }
    }
    function expandRegularPathWithParamsAgainstRouteUsingRedirect(segment, routes, route, paths, outlet) {
        var _a = match(segment, route, paths), consumedPaths = _a.consumedPaths, lastChild = _a.lastChild, positionalParamSegments = _a.positionalParamSegments;
        var newPaths = applyRedirectCommands(consumedPaths, route.redirectTo, positionalParamSegments);
        if (route.redirectTo.startsWith('/')) {
            throw new GlobalRedirect(newPaths);
        }
        else {
            return expandPathsWithParams(segment, routes, newPaths.concat(paths.slice(lastChild)), outlet, false);
        }
    }
    function matchPathsWithParamsAgainstRoute(segment, route, paths) {
        if (route.path === '**') {
            return new UrlSegment(paths, {});
        }
        else {
            var _a = match(segment, route, paths), consumedPaths = _a.consumedPaths, lastChild = _a.lastChild;
            var childConfig = route.children ? route.children : [];
            var slicedPath = paths.slice(lastChild);
            if (childConfig.length === 0 && slicedPath.length === 0) {
                return new UrlSegment(consumedPaths, {});
            }
            else if (slicedPath.length === 0 && segment.hasChildren()) {
                var children = expandSegmentChildren(childConfig, segment);
                return new UrlSegment(consumedPaths, children);
            }
            else {
                var cs = expandPathsWithParams(segment, childConfig, slicedPath, PRIMARY_OUTLET, true);
                return new UrlSegment(consumedPaths.concat(cs.pathsWithParams), cs.children);
            }
        }
    }
    function match(segment, route, paths) {
        if (route.path === '') {
            if (route.terminal && (segment.hasChildren() || paths.length > 0)) {
                throw new NoMatch();
            }
            else {
                return { consumedPaths: [], lastChild: 0, positionalParamSegments: {} };
            }
        }
        var path = route.path;
        var parts = path.split('/');
        var positionalParamSegments = {};
        var consumedPaths = [];
        var currentIndex = 0;
        for (var i = 0; i < parts.length; ++i) {
            if (currentIndex >= paths.length)
                throw new NoMatch();
            var current = paths[currentIndex];
            var p = parts[i];
            var isPosParam = p.startsWith(':');
            if (!isPosParam && p !== current.path)
                throw new NoMatch();
            if (isPosParam) {
                positionalParamSegments[p.substring(1)] = current;
            }
            consumedPaths.push(current);
            currentIndex++;
        }
        if (route.terminal && (segment.hasChildren() || currentIndex < paths.length)) {
            throw new NoMatch();
        }
        return { consumedPaths: consumedPaths, lastChild: currentIndex, positionalParamSegments: positionalParamSegments };
    }
    function applyRedirectCommands(paths, redirectTo, posParams) {
        if (redirectTo.startsWith('/')) {
            var parts = redirectTo.substring(1).split('/');
            return createPaths(redirectTo, parts, paths, posParams);
        }
        else {
            var parts = redirectTo.split('/');
            return createPaths(redirectTo, parts, paths, posParams);
        }
    }
    function createPaths(redirectTo, parts, segments, posParams) {
        return parts.map(function (p) { return p.startsWith(':') ? findPosParam(p, posParams, redirectTo) :
            findOrCreatePath(p, segments); });
    }
    function findPosParam(part, posParams, redirectTo) {
        var paramName = part.substring(1);
        var pos = posParams[paramName];
        if (!pos)
            throw new Error("Cannot redirect to '" + redirectTo + "'. Cannot find '" + part + "'.");
        return pos;
    }
    function findOrCreatePath(part, paths) {
        var matchingIndex = paths.findIndex(function (s) { return s.path === part; });
        if (matchingIndex > -1) {
            var r = paths[matchingIndex];
            paths.splice(matchingIndex);
            return r;
        }
        else {
            return new UrlPathWithParams(part, {});
        }
    }
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function validateConfig(config) {
        config.forEach(validateNode);
    }
    function validateNode(route) {
        if (!!route.redirectTo && !!route.children) {
            throw new Error("Invalid configuration of route '" + route.path + "': redirectTo and children cannot be used together");
        }
        if (!!route.redirectTo && !!route.component) {
            throw new Error("Invalid configuration of route '" + route.path + "': redirectTo and component cannot be used together");
        }
        if (route.redirectTo === undefined && !route.component && !route.children) {
            throw new Error("Invalid configuration of route '" + route.path + "': component, redirectTo, children must be provided");
        }
        if (route.path === undefined) {
            throw new Error("Invalid route configuration: routes must have path specified");
        }
        if (route.path.startsWith('/')) {
            throw new Error("Invalid route configuration of route '" + route.path + "': path cannot start with a slash");
        }
    }
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var Tree = (function () {
        function Tree(root) {
            this._root = root;
        }
        Object.defineProperty(Tree.prototype, "root", {
            get: function () { return this._root.value; },
            enumerable: true,
            configurable: true
        });
        Tree.prototype.parent = function (t) {
            var p = this.pathFromRoot(t);
            return p.length > 1 ? p[p.length - 2] : null;
        };
        Tree.prototype.children = function (t) {
            var n = findNode(t, this._root);
            return n ? n.children.map(function (t) { return t.value; }) : [];
        };
        Tree.prototype.firstChild = function (t) {
            var n = findNode(t, this._root);
            return n && n.children.length > 0 ? n.children[0].value : null;
        };
        Tree.prototype.siblings = function (t) {
            var p = findPath(t, this._root, []);
            if (p.length < 2)
                return [];
            var c = p[p.length - 2].children.map(function (c) { return c.value; });
            return c.filter(function (cc) { return cc !== t; });
        };
        Tree.prototype.pathFromRoot = function (t) { return findPath(t, this._root, []).map(function (s) { return s.value; }); };
        Tree.prototype.contains = function (tree) { return contains(this._root, tree._root); };
        return Tree;
    }());
    function findNode(expected, c) {
        if (expected === c.value)
            return c;
        for (var _i = 0, _a = c.children; _i < _a.length; _i++) {
            var cc = _a[_i];
            var r = findNode(expected, cc);
            if (r)
                return r;
        }
        return null;
    }
    function findPath(expected, c, collected) {
        collected.push(c);
        if (expected === c.value)
            return collected;
        for (var _i = 0, _a = c.children; _i < _a.length; _i++) {
            var cc = _a[_i];
            var cloned = collected.slice(0);
            var r = findPath(expected, cc, cloned);
            if (r)
                return r;
        }
        return [];
    }
    function contains(tree, subtree) {
        if (tree.value !== subtree.value)
            return false;
        var _loop_1 = function(subtreeNode) {
            var s = tree.children.filter(function (child) { return child.value === subtreeNode.value; });
            if (s.length === 0)
                return { value: false };
            if (!contains(s[0], subtreeNode))
                return { value: false };
        };
        for (var _i = 0, _a = subtree.children; _i < _a.length; _i++) {
            var subtreeNode = _a[_i];
            var state_1 = _loop_1(subtreeNode);
            if (typeof state_1 === "object") return state_1.value;
        }
        return true;
    }
    var TreeNode = (function () {
        function TreeNode(value, children) {
            this.value = value;
            this.children = children;
        }
        TreeNode.prototype.toString = function () { return "TreeNode(" + this.value + ")"; };
        return TreeNode;
    }());
    /**
     * The state of the router.
     *
     * ### Usage
     *
     * ```
     * class MyComponent {
     *   constructor(router: Router) {
     *     const state = router.routerState;
     *     const id: Observable<string> = state.firstChild(state.root).params.map(p => p.id);
     *     const isDebug: Observable<string> = state.queryParams.map(q => q.debug);
     *   }
     * }
     * ```
     */
    var RouterState = (function (_super) {
        __extends(RouterState, _super);
        /**
         * @internal
         */
        function RouterState(root, queryParams, fragment, snapshot) {
            _super.call(this, root);
            this.queryParams = queryParams;
            this.fragment = fragment;
            this.snapshot = snapshot;
        }
        RouterState.prototype.toString = function () { return this.snapshot.toString(); };
        return RouterState;
    }(Tree));
    function createEmptyState(urlTree, rootComponent) {
        var snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
        var emptyUrl = new rxjs_BehaviorSubject.BehaviorSubject([new UrlPathWithParams('', {})]);
        var emptyParams = new rxjs_BehaviorSubject.BehaviorSubject({});
        var emptyQueryParams = new rxjs_BehaviorSubject.BehaviorSubject({});
        var fragment = new rxjs_BehaviorSubject.BehaviorSubject('');
        var activated = new ActivatedRoute(emptyUrl, emptyParams, PRIMARY_OUTLET, rootComponent, snapshot.root);
        activated.snapshot = snapshot.root;
        return new RouterState(new TreeNode(activated, []), emptyQueryParams, fragment, snapshot);
    }
    function createEmptyStateSnapshot(urlTree, rootComponent) {
        var emptyParams = {};
        var emptyQueryParams = {};
        var fragment = '';
        var activated = new ActivatedRouteSnapshot([], emptyParams, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1);
        return new RouterStateSnapshot('', new TreeNode(activated, []), emptyQueryParams, fragment);
    }
    /**
     * Contains the information about a component loaded in an outlet. The information is provided
     * through
     * the params and urlSegments observables.
     *
     * ### Usage
     *
     * ```
     * class MyComponent {
     *   constructor(route: ActivatedRoute) {
     *     const id: Observable<string> = route.params.map(p => p.id);
     *   }
     * }
     * ```
     */
    var ActivatedRoute = (function () {
        /**
         * @internal
         */
        function ActivatedRoute(url, params, outlet, component, futureSnapshot) {
            this.url = url;
            this.params = params;
            this.outlet = outlet;
            this.component = component;
            this._futureSnapshot = futureSnapshot;
        }
        ActivatedRoute.prototype.toString = function () {
            return this.snapshot ? this.snapshot.toString() : "Future(" + this._futureSnapshot + ")";
        };
        return ActivatedRoute;
    }());
    /**
     * Contains the information about a component loaded in an outlet at a particular moment in time.
     *
     * ### Usage
     *
     * ```
     * class MyComponent {
     *   constructor(route: ActivatedRoute) {
     *     const id: string = route.snapshot.params.id;
     *   }
     * }
     * ```
     */
    var ActivatedRouteSnapshot = (function () {
        /**
         * @internal
         */
        function ActivatedRouteSnapshot(url, params, outlet, component, routeConfig, urlSegment, lastPathIndex) {
            this.url = url;
            this.params = params;
            this.outlet = outlet;
            this.component = component;
            this._routeConfig = routeConfig;
            this._urlSegment = urlSegment;
            this._lastPathIndex = lastPathIndex;
        }
        ActivatedRouteSnapshot.prototype.toString = function () {
            var url = this.url.map(function (s) { return s.toString(); }).join('/');
            var matched = this._routeConfig ? this._routeConfig.path : '';
            return "Route(url:'" + url + "', path:'" + matched + "')";
        };
        return ActivatedRouteSnapshot;
    }());
    /**
     * The state of the router at a particular moment in time.
     *
     * ### Usage
     *
     * ```
     * class MyComponent {
     *   constructor(router: Router) {
     *     const snapshot = router.routerState.snapshot;
     *   }
     * }
     * ```
     */
    var RouterStateSnapshot = (function (_super) {
        __extends(RouterStateSnapshot, _super);
        /**
         * @internal
         */
        function RouterStateSnapshot(url, root, queryParams, fragment) {
            _super.call(this, root);
            this.url = url;
            this.queryParams = queryParams;
            this.fragment = fragment;
        }
        RouterStateSnapshot.prototype.toString = function () { return serializeNode(this._root); };
        return RouterStateSnapshot;
    }(Tree));
    function serializeNode(node) {
        var c = node.children.length > 0 ? " { " + node.children.map(serializeNode).join(", ") + " } " : '';
        return "" + node.value + c;
    }
    /**
     * The expectation is that the activate route is created with the right set of parameters.
     * So we push new values into the observables only when they are not the initial values.
     * And we detect that by checking if the snapshot field is set.
     */
    function advanceActivatedRoute(route) {
        if (route.snapshot && !shallowEqual(route.snapshot.params, route._futureSnapshot.params)) {
            route.snapshot = route._futureSnapshot;
            route.url.next(route.snapshot.url);
            route.params.next(route.snapshot.params);
        }
        else {
            route.snapshot = route._futureSnapshot;
        }
    }
    function createRouterState(curr, prevState) {
        var root = createNode(curr._root, prevState ? prevState._root : undefined);
        var queryParams = prevState ? prevState.queryParams : new rxjs_BehaviorSubject.BehaviorSubject(curr.queryParams);
        var fragment = prevState ? prevState.fragment : new rxjs_BehaviorSubject.BehaviorSubject(curr.fragment);
        return new RouterState(root, queryParams, fragment, curr);
    }
    function createNode(curr, prevState) {
        if (prevState && equalRouteSnapshots(prevState.value.snapshot, curr.value)) {
            var value = prevState.value;
            value._futureSnapshot = curr.value;
            var children = createOrReuseChildren(curr, prevState);
            return new TreeNode(value, children);
        }
        else {
            var value = createActivatedRoute(curr.value);
            var children = curr.children.map(function (c) { return createNode(c); });
            return new TreeNode(value, children);
        }
    }
    function createOrReuseChildren(curr, prevState) {
        return curr.children.map(function (child) {
            var index = prevState.children.findIndex(function (p) { return equalRouteSnapshots(p.value.snapshot, child.value); });
            if (index >= 0) {
                return createNode(child, prevState.children[index]);
            }
            else {
                return createNode(child);
            }
        });
    }
    function createActivatedRoute(c) {
        return new ActivatedRoute(new rxjs_BehaviorSubject.BehaviorSubject(c.url), new rxjs_BehaviorSubject.BehaviorSubject(c.params), c.outlet, c.component, c);
    }
    function equalRouteSnapshots(a, b) {
        return a._routeConfig === b._routeConfig;
    }
    function createUrlTree$1(route, urlTree, commands, queryParams, fragment) {
        if (commands.length === 0) {
            return tree(urlTree.root, urlTree.root, urlTree, queryParams, fragment);
        }
        var normalizedCommands = normalizeCommands(commands);
        if (navigateToRoot(normalizedCommands)) {
            return tree(urlTree.root, new UrlSegment([], {}), urlTree, queryParams, fragment);
        }
        var startingPosition = findStartingPosition(normalizedCommands, urlTree, route);
        var segment = startingPosition.processChildren ?
            updateSegmentChildren(startingPosition.segment, startingPosition.index, normalizedCommands.commands) :
            updateSegment(startingPosition.segment, startingPosition.index, normalizedCommands.commands);
        return tree(startingPosition.segment, segment, urlTree, queryParams, fragment);
    }
    function tree(oldSegment, newSegment, urlTree, queryParams, fragment) {
        var q = queryParams ? stringify(queryParams) : urlTree.queryParams;
        var f = fragment ? fragment : urlTree.fragment;
        if (urlTree.root === oldSegment) {
            return new UrlTree(newSegment, q, f);
        }
        else {
            return new UrlTree(replaceSegment(urlTree.root, oldSegment, newSegment), q, f);
        }
    }
    function replaceSegment(current, oldSegment, newSegment) {
        var children = {};
        forEach(current.children, function (c, outletName) {
            if (c === oldSegment) {
                children[outletName] = newSegment;
            }
            else {
                children[outletName] = replaceSegment(c, oldSegment, newSegment);
            }
        });
        return new UrlSegment(current.pathsWithParams, children);
    }
    function navigateToRoot(normalizedChange) {
        return normalizedChange.isAbsolute && normalizedChange.commands.length === 1 &&
            normalizedChange.commands[0] == '/';
    }
    var NormalizedNavigationCommands = (function () {
        function NormalizedNavigationCommands(isAbsolute, numberOfDoubleDots, commands) {
            this.isAbsolute = isAbsolute;
            this.numberOfDoubleDots = numberOfDoubleDots;
            this.commands = commands;
        }
        return NormalizedNavigationCommands;
    }());
    function normalizeCommands(commands) {
        if ((typeof commands[0] === 'string') && commands.length === 1 && commands[0] == '/') {
            return new NormalizedNavigationCommands(true, 0, commands);
        }
        var numberOfDoubleDots = 0;
        var isAbsolute = false;
        var res = [];
        for (var i = 0; i < commands.length; ++i) {
            var c = commands[i];
            if (!(typeof c === 'string')) {
                res.push(c);
                continue;
            }
            var parts = c.split('/');
            for (var j = 0; j < parts.length; ++j) {
                var cc = parts[j];
                // first exp is treated in a special way
                if (i == 0) {
                    if (j == 0 && cc == '.') {
                    }
                    else if (j == 0 && cc == '') {
                        isAbsolute = true;
                    }
                    else if (cc == '..') {
                        numberOfDoubleDots++;
                    }
                    else if (cc != '') {
                        res.push(cc);
                    }
                }
                else {
                    if (cc != '') {
                        res.push(cc);
                    }
                }
            }
        }
        return new NormalizedNavigationCommands(isAbsolute, numberOfDoubleDots, res);
    }
    var Position = (function () {
        function Position(segment, processChildren, index) {
            this.segment = segment;
            this.processChildren = processChildren;
            this.index = index;
        }
        return Position;
    }());
    function findStartingPosition(normalizedChange, urlTree, route) {
        if (normalizedChange.isAbsolute) {
            return new Position(urlTree.root, true, 0);
        }
        else if (route.snapshot._lastPathIndex === -1) {
            return new Position(route.snapshot._urlSegment, true, 0);
        }
        else if (route.snapshot._lastPathIndex + 1 - normalizedChange.numberOfDoubleDots >= 0) {
            return new Position(route.snapshot._urlSegment, false, route.snapshot._lastPathIndex + 1 - normalizedChange.numberOfDoubleDots);
        }
        else {
            throw new Error('Invalid number of \'../\'');
        }
    }
    function getPath(command) {
        if (!(typeof command === 'string'))
            return command.toString();
        var parts = command.toString().split(':');
        return parts.length > 1 ? parts[1] : command;
    }
    function getOutlet$1(commands) {
        if (!(typeof commands[0] === 'string'))
            return PRIMARY_OUTLET;
        var parts = commands[0].toString().split(':');
        return parts.length > 1 ? parts[0] : PRIMARY_OUTLET;
    }
    function updateSegment(segment, startIndex, commands) {
        if (!segment) {
            segment = new UrlSegment([], {});
        }
        if (segment.pathsWithParams.length === 0 && segment.hasChildren()) {
            return updateSegmentChildren(segment, startIndex, commands);
        }
        var m = prefixedWith(segment, startIndex, commands);
        var slicedCommands = commands.slice(m.lastIndex);
        if (m.match && slicedCommands.length === 0) {
            return new UrlSegment(segment.pathsWithParams, {});
        }
        else if (m.match && !segment.hasChildren()) {
            return createNewSegment(segment, startIndex, commands);
        }
        else if (m.match) {
            return updateSegmentChildren(segment, 0, slicedCommands);
        }
        else {
            return createNewSegment(segment, startIndex, commands);
        }
    }
    function updateSegmentChildren(segment, startIndex, commands) {
        if (commands.length === 0) {
            return new UrlSegment(segment.pathsWithParams, {});
        }
        else {
            var outlet_1 = getOutlet$1(commands);
            var children_2 = {};
            children_2[outlet_1] = updateSegment(segment.children[outlet_1], startIndex, commands);
            forEach(segment.children, function (child, childOutlet) {
                if (childOutlet !== outlet_1) {
                    children_2[childOutlet] = child;
                }
            });
            return new UrlSegment(segment.pathsWithParams, children_2);
        }
    }
    function prefixedWith(segment, startIndex, commands) {
        var currentCommandIndex = 0;
        var currentPathIndex = startIndex;
        var noMatch = { match: false, lastIndex: 0 };
        while (currentPathIndex < segment.pathsWithParams.length) {
            if (currentCommandIndex >= commands.length)
                return noMatch;
            var path = segment.pathsWithParams[currentPathIndex];
            var curr = getPath(commands[currentCommandIndex]);
            var next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
            if (curr && next && (typeof next === 'object')) {
                if (!compare(curr, next, path))
                    return noMatch;
                currentCommandIndex += 2;
            }
            else {
                if (!compare(curr, {}, path))
                    return noMatch;
                currentCommandIndex++;
            }
            currentPathIndex++;
        }
        return { match: true, lastIndex: currentCommandIndex };
    }
    function createNewSegment(segment, startIndex, commands) {
        var paths = segment.pathsWithParams.slice(0, startIndex);
        var i = 0;
        while (i < commands.length) {
            // if we start with an object literal, we need to reuse the path part from the segment
            if (i === 0 && (typeof commands[0] === 'object')) {
                var p = segment.pathsWithParams[startIndex];
                paths.push(new UrlPathWithParams(p.path, commands[0]));
                i++;
                continue;
            }
            var curr = getPath(commands[i]);
            var next = (i < commands.length - 1) ? commands[i + 1] : null;
            if (curr && next && (typeof next === 'object')) {
                paths.push(new UrlPathWithParams(curr, stringify(next)));
                i += 2;
            }
            else {
                paths.push(new UrlPathWithParams(curr, {}));
                i++;
            }
        }
        return new UrlSegment(paths, {});
    }
    function stringify(params) {
        var res = {};
        forEach(params, function (v, k) { return res[k] = "" + v; });
        return res;
    }
    function compare(path, params, pathWithParams) {
        return path == pathWithParams.path && shallowEqual(params, pathWithParams.parameters);
    }
    var NoMatch$1 = (function () {
        function NoMatch$1(segment) {
            if (segment === void 0) { segment = null; }
            this.segment = segment;
        }
        return NoMatch$1;
    }());
    function recognize(rootComponentType, config, urlTree, url) {
        try {
            var children = processSegment(config, urlTree.root, {}, PRIMARY_OUTLET);
            var root = new ActivatedRouteSnapshot([], {}, PRIMARY_OUTLET, rootComponentType, null, urlTree.root, -1);
            var rootNode = new TreeNode(root, children);
            return rxjs_observable_of.of(new RouterStateSnapshot(url, rootNode, urlTree.queryParams, urlTree.fragment));
        }
        catch (e) {
            if (e instanceof NoMatch$1) {
                return new rxjs_Observable.Observable(function (obs) { return obs.error(new Error("Cannot match any routes: '" + e.segment + "'")); });
            }
            else {
                return new rxjs_Observable.Observable(function (obs) { return obs.error(e); });
            }
        }
    }
    function processSegment(config, segment, extraParams, outlet) {
        if (segment.pathsWithParams.length === 0 && segment.hasChildren()) {
            return processSegmentChildren(config, segment, extraParams);
        }
        else {
            return [processPathsWithParams(config, segment, 0, segment.pathsWithParams, extraParams, outlet)];
        }
    }
    function processSegmentChildren(config, segment, extraParams) {
        var children = mapChildrenIntoArray(segment, function (child, childOutlet) { return processSegment(config, child, extraParams, childOutlet); });
        checkOutletNameUniqueness(children);
        sortActivatedRouteSnapshots(children);
        return children;
    }
    function sortActivatedRouteSnapshots(nodes) {
        nodes.sort(function (a, b) {
            if (a.value.outlet === PRIMARY_OUTLET)
                return -1;
            if (b.value.outlet === PRIMARY_OUTLET)
                return 1;
            return a.value.outlet.localeCompare(b.value.outlet);
        });
    }
    function processPathsWithParams(config, segment, pathIndex, paths, extraParams, outlet) {
        for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
            var r = config_1[_i];
            try {
                return processPathsWithParamsAgainstRoute(r, segment, pathIndex, paths, extraParams, outlet);
            }
            catch (e) {
                if (!(e instanceof NoMatch$1))
                    throw e;
            }
        }
        throw new NoMatch$1(segment);
    }
    function processPathsWithParamsAgainstRoute(route, segment, pathIndex, paths, parentExtraParams, outlet) {
        if (route.redirectTo)
            throw new NoMatch$1();
        if ((route.outlet ? route.outlet : PRIMARY_OUTLET) !== outlet)
            throw new NoMatch$1();
        if (route.path === '**') {
            var params = paths.length > 0 ? last(paths).parameters : {};
            var snapshot_1 = new ActivatedRouteSnapshot(paths, merge(parentExtraParams, params), outlet, route.component, route, segment, -1);
            return new TreeNode(snapshot_1, []);
        }
        var _a = match$1(segment, route, paths, parentExtraParams), consumedPaths = _a.consumedPaths, parameters = _a.parameters, extraParams = _a.extraParams, lastChild = _a.lastChild;
        var snapshot = new ActivatedRouteSnapshot(consumedPaths, parameters, outlet, route.component, route, segment, pathIndex + lastChild - 1);
        var slicedPath = paths.slice(lastChild);
        var childConfig = route.children ? route.children : [];
        if (childConfig.length === 0 && slicedPath.length === 0) {
            return new TreeNode(snapshot, []);
        }
        else if (slicedPath.length === 0 && segment.hasChildren()) {
            var children = processSegmentChildren(childConfig, segment, extraParams);
            return new TreeNode(snapshot, children);
        }
        else {
            var child = processPathsWithParams(childConfig, segment, pathIndex + lastChild, slicedPath, extraParams, PRIMARY_OUTLET);
            return new TreeNode(snapshot, [child]);
        }
    }
    function match$1(segment, route, paths, parentExtraParams) {
        if (route.path === '') {
            if (route.terminal && (segment.hasChildren() || paths.length > 0)) {
                throw new NoMatch$1();
            }
            else {
                return { consumedPaths: [], lastChild: 0, parameters: {}, extraParams: {} };
            }
        }
        var path = route.path;
        var parts = path.split('/');
        var posParameters = {};
        var consumedPaths = [];
        var currentIndex = 0;
        for (var i = 0; i < parts.length; ++i) {
            if (currentIndex >= paths.length)
                throw new NoMatch$1();
            var current = paths[currentIndex];
            var p = parts[i];
            var isPosParam = p.startsWith(':');
            if (!isPosParam && p !== current.path)
                throw new NoMatch$1();
            if (isPosParam) {
                posParameters[p.substring(1)] = current.path;
            }
            consumedPaths.push(current);
            currentIndex++;
        }
        if (route.terminal && (segment.hasChildren() || currentIndex < paths.length)) {
            throw new NoMatch$1();
        }
        var parameters = merge(parentExtraParams, merge(posParameters, consumedPaths[consumedPaths.length - 1].parameters));
        var extraParams = route.component ? {} : parameters;
        return { consumedPaths: consumedPaths, lastChild: currentIndex, parameters: parameters, extraParams: extraParams };
    }
    function checkOutletNameUniqueness(nodes) {
        var names = {};
        nodes.forEach(function (n) {
            var routeWithSameOutletName = names[n.value.outlet];
            if (routeWithSameOutletName) {
                var p = routeWithSameOutletName.url.map(function (s) { return s.toString(); }).join('/');
                var c = n.value.url.map(function (s) { return s.toString(); }).join('/');
                throw new Error("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
            }
            names[n.value.outlet] = n.value;
        });
    }
    function resolve(resolver, state) {
        return resolveNode(resolver, state._root).map(function (_) { return state; });
    }
    function resolveNode(resolver, node) {
        if (node.children.length === 0) {
            return rxjs_observable_fromPromise.fromPromise(resolveComponent(resolver, node.value).then(function (factory) {
                node.value._resolvedComponentFactory = factory;
                return node.value;
            }));
        }
        else {
            var c = node.children.map(function (c) { return resolveNode(resolver, c).toPromise(); });
            return rxjs_observable_forkJoin.forkJoin(c).map(function (_) { return resolveComponent(resolver, node.value).then(function (factory) {
                node.value._resolvedComponentFactory = factory;
                return node.value;
            }); });
        }
    }
    function resolveComponent(resolver, snapshot) {
        if (snapshot.component && snapshot._routeConfig) {
            return resolver.resolveComponent(snapshot.component);
        }
        else {
            return Promise.resolve(null);
        }
    }
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var RouterOutletMap = (function () {
        function RouterOutletMap() {
            /** @internal */
            this._outlets = {};
        }
        RouterOutletMap.prototype.registerOutlet = function (name, outlet) { this._outlets[name] = outlet; };
        return RouterOutletMap;
    }());
    /**
     * An event triggered when a navigation starts
     */
    var NavigationStart = (function () {
        function NavigationStart(id, url) {
            this.id = id;
            this.url = url;
        }
        NavigationStart.prototype.toString = function () { return "NavigationStart(id: " + this.id + ", url: '" + this.url + "')"; };
        return NavigationStart;
    }());
    /**
     * An event triggered when a navigation ends successfully
     */
    var NavigationEnd = (function () {
        function NavigationEnd(id, url, urlAfterRedirects) {
            this.id = id;
            this.url = url;
            this.urlAfterRedirects = urlAfterRedirects;
        }
        NavigationEnd.prototype.toString = function () {
            return "NavigationEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "')";
        };
        return NavigationEnd;
    }());
    /**
     * An event triggered when a navigation is canceled
     */
    var NavigationCancel = (function () {
        function NavigationCancel(id, url) {
            this.id = id;
            this.url = url;
        }
        NavigationCancel.prototype.toString = function () { return "NavigationCancel(id: " + this.id + ", url: '" + this.url + "')"; };
        return NavigationCancel;
    }());
    /**
     * An event triggered when a navigation fails due to unexpected error
     */
    var NavigationError = (function () {
        function NavigationError(id, url, error) {
            this.id = id;
            this.url = url;
            this.error = error;
        }
        NavigationError.prototype.toString = function () {
            return "NavigationError(id: " + this.id + ", url: '" + this.url + "', error: " + this.error + ")";
        };
        return NavigationError;
    }());
    /**
     * An event triggered when routes are recognized
     */
    var RoutesRecognized = (function () {
        function RoutesRecognized(id, url, urlAfterRedirects, state) {
            this.id = id;
            this.url = url;
            this.urlAfterRedirects = urlAfterRedirects;
            this.state = state;
        }
        RoutesRecognized.prototype.toString = function () {
            return "RoutesRecognized(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
        };
        return RoutesRecognized;
    }());
    /**
     * The `Router` is responsible for mapping URLs to components.
     */
    var Router = (function () {
        /**
         * @internal
         */
        function Router(rootComponentType, resolver, urlSerializer, outletMap, location, injector, config) {
            this.rootComponentType = rootComponentType;
            this.resolver = resolver;
            this.urlSerializer = urlSerializer;
            this.outletMap = outletMap;
            this.location = location;
            this.injector = injector;
            this.navigationId = 0;
            this.resetConfig(config);
            this.routerEvents = new rxjs_Subject.Subject();
            this.currentUrlTree = createEmptyUrlTree();
            this.currentRouterState = createEmptyState(this.currentUrlTree, this.rootComponentType);
        }
        /**
         * @internal
         */
        Router.prototype.initialNavigation = function () {
            this.setUpLocationChangeListener();
            this.navigateByUrl(this.location.path());
        };
        Object.defineProperty(Router.prototype, "routerState", {
            /**
             * Returns the current route state.
             */
            get: function () { return this.currentRouterState; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "url", {
            /**
             * Returns the current url.
             */
            get: function () { return this.serializeUrl(this.currentUrlTree); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "events", {
            /**
             * Returns an observable of route events
             */
            get: function () { return this.routerEvents; },
            enumerable: true,
            configurable: true
        });
        /**
         * Resets the configuration used for navigation and generating links.
         *
         * ### Usage
         *
         * ```
         * router.resetConfig([
         *  { path: 'team/:id', component: TeamCmp, children: [
         *    { path: 'simple', component: SimpleCmp },
         *    { path: 'user/:name', component: UserCmp }
         *  ] }
         * ]);
         * ```
         */
        Router.prototype.resetConfig = function (config) {
            validateConfig(config);
            this.config = config;
        };
        /**
         * @internal
         */
        Router.prototype.dispose = function () { this.locationSubscription.unsubscribe(); };
        /**
         * Applies an array of commands to the current url tree and creates
         * a new url tree.
         *
         * When given an activate route, applies the given commands starting from the route.
         * When not given a route, applies the given command starting from the root.
         *
         * ### Usage
         *
         * ```
         * // create /team/33/user/11
         * router.createUrlTree(['/team', 33, 'user', 11]);
         *
         * // create /team/33;expand=true/user/11
         * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
         *
         * // you can collapse static fragments like this
         * router.createUrlTree(['/team/33/user', userId]);
         *
         * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
         *
         * // navigate to /team/33/user/11/details
         * router.createUrlTree(['details'], {relativeTo: route});
         *
         * // navigate to /team/33/user/22
         * router.createUrlTree(['../22'], {relativeTo: route});
         *
         * // navigate to /team/44/user/22
         * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
         * ```
         */
        Router.prototype.createUrlTree = function (commands, _a) {
            var _b = _a === void 0 ? {} : _a, relativeTo = _b.relativeTo, queryParams = _b.queryParams, fragment = _b.fragment;
            var a = relativeTo ? relativeTo : this.routerState.root;
            return createUrlTree$1(a, this.currentUrlTree, commands, queryParams, fragment);
        };
        /**
         * Navigate based on the provided url. This navigation is always absolute.
         *
         * Returns a promise that:
         * - is resolved with 'true' when navigation succeeds
         * - is resolved with 'false' when navigation fails
         * - is rejected when an error happens
         *
         * ### Usage
         *
         * ```
         * router.navigateByUrl("/team/33/user/11");
         * ```
         */
        Router.prototype.navigateByUrl = function (url) {
            if (url instanceof UrlTree) {
                return this.scheduleNavigation(url, false);
            }
            else {
                var urlTree = this.urlSerializer.parse(url);
                return this.scheduleNavigation(urlTree, false);
            }
        };
        /**
         * Navigate based on the provided array of commands and a starting point.
         * If no starting route is provided, the navigation is absolute.
         *
         * Returns a promise that:
         * - is resolved with 'true' when navigation succeeds
         * - is resolved with 'false' when navigation fails
         * - is rejected when an error happens
         *
         * ### Usage
         *
         * ```
         * router.navigate(['team', 33, 'team', '11], {relativeTo: route});
         * ```
         */
        Router.prototype.navigate = function (commands, extras) {
            if (extras === void 0) { extras = {}; }
            return this.scheduleNavigation(this.createUrlTree(commands, extras), false);
        };
        /**
         * Serializes a {@link UrlTree} into a string.
         */
        Router.prototype.serializeUrl = function (url) { return this.urlSerializer.serialize(url); };
        /**
         * Parse a string into a {@link UrlTree}.
         */
        Router.prototype.parseUrl = function (url) { return this.urlSerializer.parse(url); };
        Router.prototype.scheduleNavigation = function (url, preventPushState) {
            var _this = this;
            var id = ++this.navigationId;
            this.routerEvents.next(new NavigationStart(id, this.serializeUrl(url)));
            return Promise.resolve().then(function (_) { return _this.runNavigate(url, preventPushState, id); });
        };
        Router.prototype.setUpLocationChangeListener = function () {
            var _this = this;
            this.locationSubscription = this.location.subscribe(function (change) {
                return _this.scheduleNavigation(_this.urlSerializer.parse(change['url']), change['pop']);
            });
        };
        Router.prototype.runNavigate = function (url, preventPushState, id) {
            var _this = this;
            if (id !== this.navigationId) {
                this.location.go(this.urlSerializer.serialize(this.currentUrlTree));
                this.routerEvents.next(new NavigationCancel(id, this.serializeUrl(url)));
                return Promise.resolve(false);
            }
            return new Promise(function (resolvePromise, rejectPromise) {
                var updatedUrl;
                var state;
                applyRedirects(url, _this.config)
                    .mergeMap(function (u) {
                    updatedUrl = u;
                    return recognize(_this.rootComponentType, _this.config, updatedUrl, _this.serializeUrl(updatedUrl));
                })
                    .mergeMap(function (newRouterStateSnapshot) {
                    _this.routerEvents.next(new RoutesRecognized(id, _this.serializeUrl(url), _this.serializeUrl(updatedUrl), newRouterStateSnapshot));
                    return resolve(_this.resolver, newRouterStateSnapshot);
                })
                    .map(function (routerStateSnapshot) {
                    return createRouterState(routerStateSnapshot, _this.currentRouterState);
                })
                    .map(function (newState) {
                    state = newState;
                })
                    .mergeMap(function (_) {
                    return new GuardChecks(state.snapshot, _this.currentRouterState.snapshot, _this.injector)
                        .check(_this.outletMap);
                })
                    .forEach(function (shouldActivate) {
                    if (!shouldActivate || id !== _this.navigationId) {
                        _this.routerEvents.next(new NavigationCancel(id, _this.serializeUrl(url)));
                        return Promise.resolve(false);
                    }
                    new ActivateRoutes(state, _this.currentRouterState).activate(_this.outletMap);
                    _this.currentUrlTree = updatedUrl;
                    _this.currentRouterState = state;
                    if (!preventPushState) {
                        var path = _this.urlSerializer.serialize(updatedUrl);
                        if (_this.location.isCurrentPathEqualTo(path)) {
                            _this.location.replaceState(path);
                        }
                        else {
                            _this.location.go(path);
                        }
                    }
                    return Promise.resolve(true);
                })
                    .then(function () {
                    _this.routerEvents.next(new NavigationEnd(id, _this.serializeUrl(url), _this.serializeUrl(updatedUrl)));
                    resolvePromise(true);
                }, function (e) {
                    _this.routerEvents.next(new NavigationError(id, _this.serializeUrl(url), e));
                    rejectPromise(e);
                });
            });
        };
        return Router;
    }());
    var CanActivate = (function () {
        function CanActivate(route) {
            this.route = route;
        }
        return CanActivate;
    }());
    var CanDeactivate = (function () {
        function CanDeactivate(component, route) {
            this.component = component;
            this.route = route;
        }
        return CanDeactivate;
    }());
    var GuardChecks = (function () {
        function GuardChecks(future, curr, injector) {
            this.future = future;
            this.curr = curr;
            this.injector = injector;
            this.checks = [];
        }
        GuardChecks.prototype.check = function (parentOutletMap) {
            var _this = this;
            var futureRoot = this.future._root;
            var currRoot = this.curr ? this.curr._root : null;
            this.traverseChildRoutes(futureRoot, currRoot, parentOutletMap);
            if (this.checks.length === 0)
                return rxjs_observable_of.of(true);
            return rxjs_Observable.Observable.from(this.checks)
                .map(function (s) {
                if (s instanceof CanActivate) {
                    return _this.runCanActivate(s.route);
                }
                else if (s instanceof CanDeactivate) {
                    return _this.runCanDeactivate(s.component, s.route);
                }
                else {
                    throw new Error('Cannot be reached');
                }
            })
                .mergeAll()
                .every(function (result) { return result === true; });
        };
        GuardChecks.prototype.traverseChildRoutes = function (futureNode, currNode, outletMap) {
            var _this = this;
            var prevChildren = nodeChildrenAsMap(currNode);
            futureNode.children.forEach(function (c) {
                _this.traverseRoutes(c, prevChildren[c.value.outlet], outletMap);
                delete prevChildren[c.value.outlet];
            });
            forEach(prevChildren, function (v, k) { return _this.deactivateOutletAndItChildren(v, outletMap._outlets[k]); });
        };
        GuardChecks.prototype.traverseRoutes = function (futureNode, currNode, parentOutletMap) {
            var future = futureNode.value;
            var curr = currNode ? currNode.value : null;
            var outlet = parentOutletMap ? parentOutletMap._outlets[futureNode.value.outlet] : null;
            // reusing the node
            if (curr && future._routeConfig === curr._routeConfig) {
                if (!shallowEqual(future.params, curr.params)) {
                    this.checks.push(new CanDeactivate(outlet.component, curr), new CanActivate(future));
                }
                // If we have a component, we need to go through an outlet.
                if (future.component) {
                    this.traverseChildRoutes(futureNode, currNode, outlet ? outlet.outletMap : null);
                }
                else {
                    this.traverseChildRoutes(futureNode, currNode, parentOutletMap);
                }
            }
            else {
                if (curr) {
                    // if we had a normal route, we need to deactivate only that outlet.
                    if (curr.component) {
                        this.deactivateOutletAndItChildren(curr, outlet);
                    }
                    else {
                        this.deactivateOutletMap(parentOutletMap);
                    }
                }
                this.checks.push(new CanActivate(future));
                // If we have a component, we need to go through an outlet.
                if (future.component) {
                    this.traverseChildRoutes(futureNode, null, outlet ? outlet.outletMap : null);
                }
                else {
                    this.traverseChildRoutes(futureNode, null, parentOutletMap);
                }
            }
        };
        GuardChecks.prototype.deactivateOutletAndItChildren = function (route, outlet) {
            if (outlet && outlet.isActivated) {
                this.deactivateOutletMap(outlet.outletMap);
                this.checks.push(new CanDeactivate(outlet.component, route));
            }
        };
        GuardChecks.prototype.deactivateOutletMap = function (outletMap) {
            var _this = this;
            forEach(outletMap._outlets, function (v) {
                if (v.isActivated) {
                    _this.deactivateOutletAndItChildren(v.activatedRoute.snapshot, v);
                }
            });
        };
        GuardChecks.prototype.runCanActivate = function (future) {
            var _this = this;
            var canActivate = future._routeConfig ? future._routeConfig.canActivate : null;
            if (!canActivate || canActivate.length === 0)
                return rxjs_observable_of.of(true);
            return rxjs_Observable.Observable.from(canActivate)
                .map(function (c) {
                var guard = _this.injector.get(c);
                if (guard.canActivate) {
                    return wrapIntoObservable(guard.canActivate(future, _this.future));
                }
                else {
                    return wrapIntoObservable(guard(future, _this.future));
                }
            })
                .mergeAll()
                .every(function (result) { return result === true; });
        };
        GuardChecks.prototype.runCanDeactivate = function (component, curr) {
            var _this = this;
            var canDeactivate = curr._routeConfig ? curr._routeConfig.canDeactivate : null;
            if (!canDeactivate || canDeactivate.length === 0)
                return rxjs_observable_of.of(true);
            return rxjs_Observable.Observable.from(canDeactivate)
                .map(function (c) {
                var guard = _this.injector.get(c);
                if (guard.canDeactivate) {
                    return wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr));
                }
                else {
                    return wrapIntoObservable(guard(component, curr, _this.curr));
                }
            })
                .mergeAll()
                .every(function (result) { return result === true; });
        };
        return GuardChecks;
    }());
    function wrapIntoObservable(value) {
        if (value instanceof rxjs_Observable.Observable) {
            return value;
        }
        else {
            return rxjs_observable_of.of(value);
        }
    }
    var ActivateRoutes = (function () {
        function ActivateRoutes(futureState, currState) {
            this.futureState = futureState;
            this.currState = currState;
        }
        ActivateRoutes.prototype.activate = function (parentOutletMap) {
            var futureRoot = this.futureState._root;
            var currRoot = this.currState ? this.currState._root : null;
            pushQueryParamsAndFragment(this.futureState);
            this.activateChildRoutes(futureRoot, currRoot, parentOutletMap);
        };
        ActivateRoutes.prototype.activateChildRoutes = function (futureNode, currNode, outletMap) {
            var _this = this;
            var prevChildren = nodeChildrenAsMap(currNode);
            futureNode.children.forEach(function (c) {
                _this.activateRoutes(c, prevChildren[c.value.outlet], outletMap);
                delete prevChildren[c.value.outlet];
            });
            forEach(prevChildren, function (v, k) { return _this.deactivateOutletAndItChildren(outletMap._outlets[k]); });
        };
        ActivateRoutes.prototype.activateRoutes = function (futureNode, currNode, parentOutletMap) {
            var future = futureNode.value;
            var curr = currNode ? currNode.value : null;
            // reusing the node
            if (future === curr) {
                // advance the route to push the parameters
                advanceActivatedRoute(future);
                // If we have a normal route, we need to go through an outlet.
                if (future.component) {
                    var outlet = getOutlet(parentOutletMap, futureNode.value);
                    this.activateChildRoutes(futureNode, currNode, outlet.outletMap);
                }
                else {
                    this.activateChildRoutes(futureNode, currNode, parentOutletMap);
                }
            }
            else {
                if (curr) {
                    // if we had a normal route, we need to deactivate only that outlet.
                    if (curr.component) {
                        var outlet = getOutlet(parentOutletMap, futureNode.value);
                        this.deactivateOutletAndItChildren(outlet);
                    }
                    else {
                        this.deactivateOutletMap(parentOutletMap);
                    }
                }
                // if we have a normal route, we need to advance the route
                // and place the component into the outlet. After that recurse.
                if (future.component) {
                    advanceActivatedRoute(future);
                    var outlet = getOutlet(parentOutletMap, futureNode.value);
                    var outletMap = new RouterOutletMap();
                    this.placeComponentIntoOutlet(outletMap, future, outlet);
                    this.activateChildRoutes(futureNode, null, outletMap);
                }
                else {
                    advanceActivatedRoute(future);
                    this.activateChildRoutes(futureNode, null, parentOutletMap);
                }
            }
        };
        ActivateRoutes.prototype.placeComponentIntoOutlet = function (outletMap, future, outlet) {
            var resolved = _angular_core.ReflectiveInjector.resolve([
                { provide: ActivatedRoute, useValue: future },
                { provide: RouterOutletMap, useValue: outletMap }
            ]);
            outlet.activate(future._futureSnapshot._resolvedComponentFactory, future, resolved, outletMap);
        };
        ActivateRoutes.prototype.deactivateOutletAndItChildren = function (outlet) {
            if (outlet && outlet.isActivated) {
                this.deactivateOutletMap(outlet.outletMap);
                outlet.deactivate();
            }
        };
        ActivateRoutes.prototype.deactivateOutletMap = function (outletMap) {
            var _this = this;
            forEach(outletMap._outlets, function (v) { return _this.deactivateOutletAndItChildren(v); });
        };
        return ActivateRoutes;
    }());
    function pushQueryParamsAndFragment(state) {
        if (!shallowEqual(state.snapshot.queryParams, state.queryParams.value)) {
            state.queryParams.next(state.snapshot.queryParams);
        }
        if (state.snapshot.fragment !== state.fragment.value) {
            state.fragment.next(state.snapshot.fragment);
        }
    }
    function nodeChildrenAsMap(node) {
        return node ? node.children.reduce(function (m, c) {
            m[c.value.outlet] = c;
            return m;
        }, {}) : {};
    }
    function getOutlet(outletMap, route) {
        var outlet = outletMap._outlets[route.outlet];
        if (!outlet) {
            var componentName = route.component.name;
            if (route.outlet === PRIMARY_OUTLET) {
                throw new Error("Cannot find primary outlet to load '" + componentName + "'");
            }
            else {
                throw new Error("Cannot find the outlet " + route.outlet + " to load '" + componentName + "'");
            }
        }
        return outlet;
    }
    var RouterLink = (function () {
        /**
         * @internal
         */
        function RouterLink(router, route, locationStrategy) {
            this.router = router;
            this.route = route;
            this.locationStrategy = locationStrategy;
            this.commands = [];
        }
        Object.defineProperty(RouterLink.prototype, "routerLink", {
            set: function (data) {
                if (Array.isArray(data)) {
                    this.commands = data;
                }
                else {
                    this.commands = [data];
                }
            },
            enumerable: true,
            configurable: true
        });
        RouterLink.prototype.ngOnChanges = function (changes) { this.updateTargetUrlAndHref(); };
        RouterLink.prototype.onClick = function (button, ctrlKey, metaKey) {
            if (button !== 0 || ctrlKey || metaKey) {
                return true;
            }
            if (typeof this.target === 'string' && this.target != '_self') {
                return true;
            }
            this.router.navigateByUrl(this.urlTree);
            return false;
        };
        RouterLink.prototype.updateTargetUrlAndHref = function () {
            this.urlTree = this.router.createUrlTree(this.commands, { relativeTo: this.route, queryParams: this.queryParams, fragment: this.fragment });
            if (this.urlTree) {
                this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
            }
        };
        return RouterLink;
    }());
    /** @nocollapse */
    RouterLink.decorators = [
        { type: _angular_core.Directive, args: [{ selector: '[routerLink]' },] },
    ];
    /** @nocollapse */
    RouterLink.ctorParameters = [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: _angular_common.LocationStrategy, },
    ];
    /** @nocollapse */
    RouterLink.propDecorators = {
        'target': [{ type: _angular_core.Input },],
        'queryParams': [{ type: _angular_core.Input },],
        'fragment': [{ type: _angular_core.Input },],
        'href': [{ type: _angular_core.HostBinding },],
        'routerLink': [{ type: _angular_core.Input },],
        'onClick': [{ type: _angular_core.HostListener, args: ['click', ['$event.button', '$event.ctrlKey', '$event.metaKey'],] },],
    };
    var RouterLinkActive = (function () {
        /**
         * @internal
         */
        function RouterLinkActive(router, element, renderer) {
            var _this = this;
            this.router = router;
            this.element = element;
            this.renderer = renderer;
            this.classes = [];
            this.routerLinkActiveOptions = { exact: true };
            this.subscription = router.events.subscribe(function (s) {
                if (s instanceof NavigationEnd) {
                    _this.update();
                }
            });
        }
        RouterLinkActive.prototype.ngAfterContentInit = function () {
            var _this = this;
            this.links.changes.subscribe(function (s) { return _this.update(); });
            this.update();
        };
        Object.defineProperty(RouterLinkActive.prototype, "routerLinkActive", {
            set: function (data) {
                if (Array.isArray(data)) {
                    this.classes = data;
                }
                else {
                    this.classes = data.split(' ');
                }
            },
            enumerable: true,
            configurable: true
        });
        RouterLinkActive.prototype.ngOnChanges = function (changes) { this.update(); };
        RouterLinkActive.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
        RouterLinkActive.prototype.update = function () {
            var _this = this;
            if (!this.links || this.links.length === 0)
                return;
            var currentUrlTree = this.router.parseUrl(this.router.url);
            var isActive = this.links.reduce(function (res, link) { return res || containsTree(currentUrlTree, link.urlTree, _this.routerLinkActiveOptions.exact); }, false);
            this.classes.forEach(function (c) { return _this.renderer.setElementClass(_this.element.nativeElement, c, isActive); });
        };
        return RouterLinkActive;
    }());
    /** @nocollapse */
    RouterLinkActive.decorators = [
        { type: _angular_core.Directive, args: [{ selector: '[routerLinkActive]' },] },
    ];
    /** @nocollapse */
    RouterLinkActive.ctorParameters = [
        { type: Router, },
        { type: _angular_core.ElementRef, },
        { type: _angular_core.Renderer, },
    ];
    /** @nocollapse */
    RouterLinkActive.propDecorators = {
        'links': [{ type: _angular_core.ContentChildren, args: [RouterLink,] },],
        'routerLinkActiveOptions': [{ type: _angular_core.Input },],
        'routerLinkActive': [{ type: _angular_core.Input },],
    };
    var RouterOutlet = (function () {
        /**
         * @internal
         */
        function RouterOutlet(parentOutletMap, location, name) {
            this.location = location;
            parentOutletMap.registerOutlet(name ? name : PRIMARY_OUTLET, this);
        }
        Object.defineProperty(RouterOutlet.prototype, "isActivated", {
            get: function () { return !!this.activated; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RouterOutlet.prototype, "component", {
            get: function () {
                if (!this.activated)
                    throw new Error('Outlet is not activated');
                return this.activated.instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RouterOutlet.prototype, "activatedRoute", {
            get: function () {
                if (!this.activated)
                    throw new Error('Outlet is not activated');
                return this._activatedRoute;
            },
            enumerable: true,
            configurable: true
        });
        RouterOutlet.prototype.deactivate = function () {
            if (this.activated) {
                this.activated.destroy();
                this.activated = null;
            }
        };
        RouterOutlet.prototype.activate = function (factory, activatedRoute, providers, outletMap) {
            this.outletMap = outletMap;
            this._activatedRoute = activatedRoute;
            var inj = _angular_core.ReflectiveInjector.fromResolvedProviders(providers, this.location.parentInjector);
            this.activated = this.location.createComponent(factory, this.location.length, inj, []);
        };
        return RouterOutlet;
    }());
    /** @nocollapse */
    RouterOutlet.decorators = [
        { type: _angular_core.Directive, args: [{ selector: 'router-outlet' },] },
    ];
    /** @nocollapse */
    RouterOutlet.ctorParameters = [
        { type: RouterOutletMap, },
        { type: _angular_core.ViewContainerRef, },
        { type: undefined, decorators: [{ type: _angular_core.Attribute, args: ['name',] },] },
    ];
    var ROUTER_CONFIG = new _angular_core.OpaqueToken('ROUTER_CONFIG');
    var ROUTER_OPTIONS = new _angular_core.OpaqueToken('ROUTER_OPTIONS');
    function setupRouter(ref, resolver, urlSerializer, outletMap, location, injector, config, opts) {
        if (ref.componentTypes.length == 0) {
            throw new Error('Bootstrap at least one component before injecting Router.');
        }
        var componentType = ref.componentTypes[0];
        var r = new Router(componentType, resolver, urlSerializer, outletMap, location, injector, config);
        ref.registerDisposeListener(function () { return r.dispose(); });
        if (opts.enableTracing) {
            r.events.subscribe(function (e) {
                console.group("Router Event: " + e.constructor.name);
                console.log(e.toString());
                console.log(e);
                console.groupEnd();
            });
        }
        return r;
    }
    function setupRouterInitializer(injector) {
        // https://github.com/angular/angular/issues/9101
        // Delay the router instantiation to avoid circular dependency (ApplicationRef ->
        // APP_INITIALIZER -> Router)
        setTimeout(function () {
            var appRef = injector.get(_angular_core.ApplicationRef);
            if (appRef.componentTypes.length == 0) {
                appRef.registerBootstrapListener(function () { injector.get(Router).initialNavigation(); });
            }
            else {
                injector.get(Router).initialNavigation();
            }
        }, 0);
        return function () { return null; };
    }
    /**
     * A list of {@link Provider}s. To use the router, you must add this to your application.
     *
     * ### Example
     *
     * ```
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * class AppCmp {
     *   // ...
     * }
     *
     * const router = [
     *   {path: '/home', component: Home}
     * ];
     *
     * bootstrap(AppCmp, [provideRouter(router)]);
     * ```
     */
    function provideRouter$1(_config, _opts) {
        return [
            { provide: ROUTER_CONFIG, useValue: _config }, { provide: ROUTER_OPTIONS, useValue: _opts },
            _angular_common.Location, { provide: _angular_common.LocationStrategy, useClass: _angular_common.PathLocationStrategy },
            { provide: UrlSerializer, useClass: DefaultUrlSerializer },
            {
                provide: Router,
                useFactory: setupRouter,
                deps: [
                    _angular_core.ApplicationRef, _angular_core.ComponentResolver, UrlSerializer, RouterOutletMap, _angular_common.Location, _angular_core.Injector,
                    ROUTER_CONFIG, ROUTER_OPTIONS
                ]
            },
            RouterOutletMap,
            { provide: ActivatedRoute, useFactory: function (r) { return r.routerState.root; }, deps: [Router] },
            // Trigger initial navigation
            { provide: _angular_core.APP_INITIALIZER, multi: true, useFactory: setupRouterInitializer, deps: [_angular_core.Injector] }
        ];
    }
    /**
     * A list of {@link Provider}s. To use the router, you must add this to your application.
     *
     * ### Example
     *
     * ```
     * @Component({directives: [ROUTER_DIRECTIVES]})
     * class AppCmp {
     *   // ...
     * }
     *
     * const router = [
     *   {path: '/home', component: Home}
     * ];
     *
     * bootstrap(AppCmp, [provideRouter(router)]);
     * ```
     */
    function provideRouter(config, opts) {
        if (opts === void 0) { opts = {}; }
        return [
            { provide: _angular_common.PlatformLocation, useClass: _angular_platformBrowser.BrowserPlatformLocation }
        ].concat(provideRouter$1(config, opts));
    }
    var ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkActive];
    exports.ROUTER_DIRECTIVES = ROUTER_DIRECTIVES;
    exports.NavigationCancel = NavigationCancel;
    exports.NavigationEnd = NavigationEnd;
    exports.NavigationError = NavigationError;
    exports.NavigationStart = NavigationStart;
    exports.Router = Router;
    exports.RoutesRecognized = RoutesRecognized;
    exports.RouterOutletMap = RouterOutletMap;
    exports.provideRouter = provideRouter;
    exports.ActivatedRoute = ActivatedRoute;
    exports.ActivatedRouteSnapshot = ActivatedRouteSnapshot;
    exports.RouterState = RouterState;
    exports.RouterStateSnapshot = RouterStateSnapshot;
    exports.PRIMARY_OUTLET = PRIMARY_OUTLET;
    exports.DefaultUrlSerializer = DefaultUrlSerializer;
    exports.UrlPathWithParams = UrlPathWithParams;
    exports.UrlSerializer = UrlSerializer;
    exports.UrlTree = UrlTree;
}));
