(function(){

if (!window.qx) window.qx = {};

qx.$$start = new Date();

if (!qx.$$environment) qx.$$environment = {};
var envinfo = {"qx.application":"wialon.Application","qx.debug":false,"qx.debug.databinding":false,"qx.debug.dispose":false,"qx.debug.io":false,"qx.debug.ui.queue":false,"qx.optimization.basecalls":true,"qx.optimization.comments":true,"qx.optimization.privates":true,"qx.optimization.strings":true,"qx.optimization.variables":true,"qx.optimization.variants":true,"qx.revision":"","qx.theme":"qx.theme.Modern","qx.version":"4.1"};
for (var k in envinfo) qx.$$environment[k] = envinfo[k];

if (!qx.$$libraries) qx.$$libraries = {};
var libinfo = {"__out__":{"sourceUri":"script"},"qx":{"resourceUri":"resource","sourceUri":"script","sourceViewUri":"https://github.com/qooxdoo/qooxdoo/blob/%{qxGitBranch}/framework/source/class/%{classFilePath}#L%{lineNumber}"},"wialon":{"resourceUri":"resource","sourceUri":"script"}};
for (var k in libinfo) qx.$$libraries[k] = libinfo[k];

qx.$$resources = {};
qx.$$translations = {"C":null};
qx.$$locales = {"C":null};
qx.$$packageData = {};
qx.$$g = {}

qx.$$loader = {
  parts : {"boot":[0]},
  packages : {"0":{"uris":["__out__:wialon.cbafc8d8bb3b.js"]}},
  urisBefore : [],
  cssBefore : [],
  boot : "boot",
  closureParts : {},
  bootIsInline : true,
  addNoCacheParam : false,

  decodeUris : function(compressedUris)
  {
    var libs = qx.$$libraries;
    var uris = [];
    for (var i=0; i<compressedUris.length; i++)
    {
      var uri = compressedUris[i].split(":");
      var euri;
      if (uri.length==2 && uri[0] in libs) {
        var prefix = libs[uri[0]].sourceUri;
        euri = prefix + "/" + uri[1];
      } else {
        euri = compressedUris[i];
      }
      if (qx.$$loader.addNoCacheParam) {
        euri += "?nocache=" + Math.random();
      }
      euri = euri.replace("../", "");
euri = euri.replace("source", "");
if (euri.substr(0, 1) != "/")
	euri = "/" + euri;
euri = "/wsdk" + euri;
if (typeof wialonSDKExternalUrl != "undefined")
	euri = wialonSDKExternalUrl + euri;
      uris.push(euri);
    }
    return uris;
  }
};

var readyStateValue = {"complete" : true};
if (document.documentMode && document.documentMode < 10 ||
    (typeof window.ActiveXObject !== "undefined" && !document.documentMode)) {
  readyStateValue["loaded"] = true;
}

function loadScript(uri, callback) {
  var elem = document.createElement("script");
  elem.charset = "utf-8";
  elem.src = uri;
  elem.onreadystatechange = elem.onload = function() {
    if (!this.readyState || readyStateValue[this.readyState]) {
      elem.onreadystatechange = elem.onload = null;
      if (typeof callback === "function") {
        callback();
      }
    }
  };

  if (isLoadParallel) {
    elem.async = null;
  }

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

function loadCss(uri) {
  var elem = document.createElement("link");
  elem.rel = "stylesheet";
  elem.type= "text/css";
  elem.href= uri;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

var isWebkit = /AppleWebKit\/([^ ]+)/.test(navigator.userAgent);
var isLoadParallel = 'async' in document.createElement('script');

function loadScriptList(list, callback) {
  if (list.length == 0) {
    callback();
    return;
  }

  var item;

  if (isLoadParallel) {
    while (list.length) {
      item = list.shift();
      if (list.length) {
        loadScript(item);
      } else {
        loadScript(item, callback);
      }
    }
  } else {
    item = list.shift();
    loadScript(item,  function() {
      if (isWebkit) {
        // force async, else Safari fails with a "maximum recursion depth exceeded"
        window.setTimeout(function() {
          loadScriptList(list, callback);
        }, 0);
      } else {
        loadScriptList(list, callback);
      }
    });
  }
}

var fireContentLoadedEvent = function() {
  qx.$$domReady = true;
  document.removeEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
};
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
}

qx.$$loader.importPackageData = function (dataMap, callback) {
  if (dataMap["resources"]){
    var resMap = dataMap["resources"];
    for (var k in resMap) qx.$$resources[k] = resMap[k];
  }
  if (dataMap["locales"]){
    var locMap = dataMap["locales"];
    var qxlocs = qx.$$locales;
    for (var lang in locMap){
      if (!qxlocs[lang]) qxlocs[lang] = locMap[lang];
      else
        for (var k in locMap[lang]) qxlocs[lang][k] = locMap[lang][k];
    }
  }
  if (dataMap["translations"]){
    var trMap   = dataMap["translations"];
    var qxtrans = qx.$$translations;
    for (var lang in trMap){
      if (!qxtrans[lang]) qxtrans[lang] = trMap[lang];
      else
        for (var k in trMap[lang]) qxtrans[lang][k] = trMap[lang][k];
    }
  }
  if (callback){
    callback(dataMap);
  }
}

qx.$$loader.signalStartup = function ()
{
  qx.$$loader.scriptLoaded = true;
  if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) {
    qx.event.handler.Application.onScriptLoaded();
    qx.$$loader.applicationHandlerReady = true;
  } else {
    qx.$$loader.applicationHandlerReady = false;
  }
}

// Load all stuff
qx.$$loader.init = function(){
  var l=qx.$$loader;
  if (l.cssBefore.length>0) {
    for (var i=0, m=l.cssBefore.length; i<m; i++) {
      loadCss(l.cssBefore[i]);
    }
  }
  if (l.urisBefore.length>0){
    loadScriptList(l.urisBefore, function(){
      l.initUris();
    });
  } else {
    l.initUris();
  }
}

// Load qooxdoo boot stuff
qx.$$loader.initUris = function(){
  var l=qx.$$loader;
  var bootPackageHash=l.parts[l.boot][0];
  if (l.bootIsInline){
    l.importPackageData(qx.$$packageData[bootPackageHash]);
    l.signalStartup();
  } else {
    loadScriptList(l.decodeUris(l.packages[l.parts[l.boot][0]].uris), function(){
      // Opera needs this extra time to parse the scripts
      window.setTimeout(function(){
        l.importPackageData(qx.$$packageData[bootPackageHash] || {});
        l.signalStartup();
      }, 0);
    });
  }
}
})();

qx.$$packageData['0']={"locales":{},"resources":{},"translations":{"C":{}}};

(function(){

  var b = ".prototype",c = "function",d = "Boolean",e = "Error",f = "Object.keys requires an object as argument.",g = "constructor",h = "warn",j = "default",k = "Null",m = "hasOwnProperty",n = "Undefined",o = "string",p = "Object",q = "toLocaleString",r = "error",s = "toString",t = "qx.debug",u = 'Method "qx.Bootstrap.base" cannot be used in strict mode.',v = "()",w = "RegExp",x = "String",y = "info",z = "BROKEN_IE",A = "isPrototypeOf",B = "Date",C = "",D = "qx.Bootstrap",E = "Function",F = "]",G = "Cannot call super class. Method is not derived: ",H = "Array",I = "[Class ",J = "valueOf",K = "Number",L = "Class",M = "debug",N = "ES5",O = ".",P = "propertyIsEnumerable",Q = "object";
  if(!window.qx){

    window.qx = {
    };
  };
  qx.Bootstrap = {
    genericToString : function(){

      return I + this.classname + F;
    },
    createNamespace : function(name, R){

      var U = name.split(O);
      var T = U[0];
      var parent = qx.$$namespaceRoot && qx.$$namespaceRoot[T] ? qx.$$namespaceRoot : window;
      for(var i = 0,S = U.length - 1;i < S;i++,T = U[i]){

        if(!parent[T]){

          parent = parent[T] = {
          };
        } else {

          parent = parent[T];
        };
      };
      parent[T] = R;
      return T;
    },
    setDisplayName : function(W, V, name){

      W.displayName = V + O + name + v;
    },
    setDisplayNames : function(Y, X){

      for(var name in Y){

        var ba = Y[name];
        if(ba instanceof Function){

          ba.displayName = X + O + name + v;
        };
      };
    },
    base : function(bb, bc){

      if(qx.Bootstrap.STRICT){

        throw new Error(u);
      };
      if(qx.Bootstrap.DEBUG){

        if(!qx.Bootstrap.isFunction(bb.callee.base)){

          throw new Error(G + bb.callee.displayName);
        };
      };
      if(arguments.length === 1){

        return bb.callee.base.call(this);
      } else {

        return bb.callee.base.apply(this, Array.prototype.slice.call(arguments, 1));
      };
    },
    define : function(name, bn){

      if(!bn){

        bn = {
          statics : {
          }
        };
      };
      var bj;
      var bf = null;
      qx.Bootstrap.setDisplayNames(bn.statics, name);
      if(bn.members || bn.extend){

        qx.Bootstrap.setDisplayNames(bn.members, name + b);
        bj = bn.construct || new Function;
        if(bn.extend){

          this.extendClass(bj, bj, bn.extend, name, bh);
        };
        var be = bn.statics || {
        };
        for(var i = 0,bg = qx.Bootstrap.keys(be),l = bg.length;i < l;i++){

          var bd = bg[i];
          bj[bd] = be[bd];
        };
        bf = bj.prototype;
        bf.base = qx.Bootstrap.base;
        bf.name = bf.classname = name;
        var bl = bn.members || {
        };
        var bd,bk;
        for(var i = 0,bg = qx.Bootstrap.keys(bl),l = bg.length;i < l;i++){

          bd = bg[i];
          bk = bl[bd];
          if(bk instanceof Function && bf[bd]){

            bk.base = bf[bd];
          };
          bf[bd] = bk;
        };
      } else {

        bj = bn.statics || {
        };
        if(qx.Bootstrap.$$registry && qx.Bootstrap.$$registry[name]){

          var bm = qx.Bootstrap.$$registry[name];
          if(this.keys(bj).length !== 0){

            if(bn.defer){

              bn.defer(bj, bf);
            };
            for(var bi in bj){

              bm[bi] = bj[bi];
            };
            return bm;
          };
        };
      };
      bj.$$type = L;
      if(!bj.hasOwnProperty(s)){

        bj.toString = this.genericToString;
      };
      var bh = name ? this.createNamespace(name, bj) : C;
      if(qx.Bootstrap.STRICT){

        bj.classname = name;
      } else {

        bj.name = bj.classname = name;
      };
      bj.basename = bh;
      bj.$$events = bn.events;
      if(bn.defer){

        bn.defer(bj, bf);
      };
      if(name != null){

        qx.Bootstrap.$$registry[name] = bj;
      };
      return bj;
    }
  };
  qx.Bootstrap.define(D, {
    statics : {
      LOADSTART : qx.$$start || new Date(),
      DEBUG : (function(){

        var bo = true;
        if(qx.$$environment && qx.$$environment[t] === false){

          bo = false;
        };
        return bo;
      })(),
      STRICT : (function(){

        return !this;
      })(),
      getEnvironmentSetting : function(bp){

        if(qx.$$environment){

          return qx.$$environment[bp];
        };
      },
      setEnvironmentSetting : function(bq, br){

        if(!qx.$$environment){

          qx.$$environment = {
          };
        };
        if(qx.$$environment[bq] === undefined){

          qx.$$environment[bq] = br;
        };
      },
      createNamespace : qx.Bootstrap.createNamespace,
      setRoot : function(bs){

        qx.$$namespaceRoot = bs;
      },
      base : qx.Bootstrap.base,
      define : qx.Bootstrap.define,
      setDisplayName : qx.Bootstrap.setDisplayName,
      setDisplayNames : qx.Bootstrap.setDisplayNames,
      genericToString : qx.Bootstrap.genericToString,
      extendClass : function(clazz, construct, superClass, name, basename){

        var superproto = superClass.prototype;
        var helper = new Function();
        helper.prototype = superproto;
        var proto = new helper();
        clazz.prototype = proto;
        if(qx.Bootstrap.STRICT){

          proto.classname = name;
        } else {

          proto.name = proto.classname = name;
        };
        proto.basename = basename;
        construct.base = superClass;
        clazz.superclass = superClass;
        construct.self = clazz.constructor = proto.constructor = clazz;
      },
      getByName : function(name){

        return qx.Bootstrap.$$registry[name];
      },
      $$registry : {
      },
      objectGetLength : function(bt){

        return qx.Bootstrap.keys(bt).length;
      },
      objectMergeWith : function(bv, bu, bx){

        if(bx === undefined){

          bx = true;
        };
        for(var bw in bu){

          if(bx || bv[bw] === undefined){

            bv[bw] = bu[bw];
          };
        };
        return bv;
      },
      __a : [A, m, q, s, J, P, g],
      keys : ({
        "ES5" : Object.keys,
        "BROKEN_IE" : function(by){

          if(by === null || (typeof by != Q && typeof by != c)){

            throw new TypeError(f);
          };
          var bz = [];
          var bB = Object.prototype.hasOwnProperty;
          for(var bC in by){

            if(bB.call(by, bC)){

              bz.push(bC);
            };
          };
          var bA = qx.Bootstrap.__a;
          for(var i = 0,a = bA,l = a.length;i < l;i++){

            if(bB.call(by, a[i])){

              bz.push(a[i]);
            };
          };
          return bz;
        },
        "default" : function(bD){

          if(bD === null || (typeof bD != Q && typeof bD != c)){

            throw new TypeError(f);
          };
          var bE = [];
          var bF = Object.prototype.hasOwnProperty;
          for(var bG in bD){

            if(bF.call(bD, bG)){

              bE.push(bG);
            };
          };
          return bE;
        }
      })[typeof (Object.keys) == c ? N : (function(){

        for(var bH in {
          toString : 1
        }){

          return bH;
        };
      })() !== s ? z : j],
      __b : {
        "[object String]" : x,
        "[object Array]" : H,
        "[object Object]" : p,
        "[object RegExp]" : w,
        "[object Number]" : K,
        "[object Boolean]" : d,
        "[object Date]" : B,
        "[object Function]" : E,
        "[object Error]" : e
      },
      bind : function(bJ, self, bK){

        var bI = Array.prototype.slice.call(arguments, 2, arguments.length);
        return function(){

          var bL = Array.prototype.slice.call(arguments, 0, arguments.length);
          return bJ.apply(self, bI.concat(bL));
        };
      },
      firstUp : function(bM){

        return bM.charAt(0).toUpperCase() + bM.substr(1);
      },
      firstLow : function(bN){

        return bN.charAt(0).toLowerCase() + bN.substr(1);
      },
      getClass : function(bP){

        if(bP === undefined){

          return n;
        } else if(bP === null){

          return k;
        };
        var bO = Object.prototype.toString.call(bP);
        return (qx.Bootstrap.__b[bO] || bO.slice(8, -1));
      },
      isString : function(bQ){

        return (bQ !== null && (typeof bQ === o || qx.Bootstrap.getClass(bQ) == x || bQ instanceof String || (!!bQ && !!bQ.$$isString)));
      },
      isArray : function(bR){

        return (bR !== null && (bR instanceof Array || (bR && qx.data && qx.data.IListData && qx.util.OOUtil.hasInterface(bR.constructor, qx.data.IListData)) || qx.Bootstrap.getClass(bR) == H || (!!bR && !!bR.$$isArray)));
      },
      isObject : function(bS){

        return (bS !== undefined && bS !== null && qx.Bootstrap.getClass(bS) == p);
      },
      isFunction : function(bT){

        return qx.Bootstrap.getClass(bT) == E;
      },
      $$logs : [],
      debug : function(bV, bU){

        qx.Bootstrap.$$logs.push([M, arguments]);
      },
      info : function(bX, bW){

        qx.Bootstrap.$$logs.push([y, arguments]);
      },
      warn : function(ca, bY){

        qx.Bootstrap.$$logs.push([h, arguments]);
      },
      error : function(cc, cb){

        qx.Bootstrap.$$logs.push([r, arguments]);
      },
      trace : function(cd){
      }
    }
  });
})();
(function(){

  var a = "qx.util.OOUtil";
  qx.Bootstrap.define(a, {
    statics : {
      classIsDefined : function(name){

        return qx.Bootstrap.getByName(name) !== undefined;
      },
      getPropertyDefinition : function(b, name){

        while(b){

          if(b.$$properties && b.$$properties[name]){

            return b.$$properties[name];
          };
          b = b.superclass;
        };
        return null;
      },
      hasProperty : function(c, name){

        return !!qx.util.OOUtil.getPropertyDefinition(c, name);
      },
      getEventType : function(d, name){

        var d = d.constructor;
        while(d.superclass){

          if(d.$$events && d.$$events[name] !== undefined){

            return d.$$events[name];
          };
          d = d.superclass;
        };
        return null;
      },
      supportsEvent : function(e, name){

        return !!qx.util.OOUtil.getEventType(e, name);
      },
      getByInterface : function(h, f){

        var g,i,l;
        while(h){

          if(h.$$implements){

            g = h.$$flatImplements;
            for(i = 0,l = g.length;i < l;i++){

              if(g[i] === f){

                return h;
              };
            };
          };
          h = h.superclass;
        };
        return null;
      },
      hasInterface : function(k, j){

        return !!qx.util.OOUtil.getByInterface(k, j);
      },
      getMixins : function(n){

        var m = [];
        while(n){

          if(n.$$includes){

            m.push.apply(m, n.$$flatIncludes);
          };
          n = n.superclass;
        };
        return m;
      }
    }
  });
})();
(function(){

  var a = "qx.core.Environment",b = "default",c = ' type)',d = "&",e = "qx/static/blank.html",f = "true",g = "|",h = "qx.core.Environment for a list of predefined keys.",j = "false",k = '] found, and no default ("default") given',l = ":",m = '" (',n = ' in variants [',o = ".",p = "qx.allowUrlSettings",q = 'No match for variant "',r = " is not a valid key. Please see the API-doc of ",s = "qxenv";
  qx.Bootstrap.define(a, {
    statics : {
      _checks : {
      },
      _asyncChecks : {
      },
      __c : {
      },
      _checksMap : {
      },
      _defaults : {
        "true" : true,
        "qx.allowUrlSettings" : false,
        "qx.allowUrlVariants" : false,
        "qx.debug.property.level" : 0,
        "qx.debug" : true,
        "qx.debug.ui.queue" : true,
        "qx.aspects" : false,
        "qx.dynlocale" : true,
        "qx.dyntheme" : true,
        "qx.blankpage" : e,
        "qx.debug.databinding" : false,
        "qx.debug.dispose" : false,
        "qx.optimization.basecalls" : false,
        "qx.optimization.comments" : false,
        "qx.optimization.privates" : false,
        "qx.optimization.strings" : false,
        "qx.optimization.variables" : false,
        "qx.optimization.variants" : false,
        "module.databinding" : true,
        "module.logger" : true,
        "module.property" : true,
        "module.events" : true,
        "qx.nativeScrollBars" : false,
        "qx.strict" : (function(){

          return !this;
        })()
      },
      get : function(w){

        if(this.__c[w] != undefined){

          return this.__c[w];
        };
        var y = this._checks[w];
        if(y){

          var u = y();
          this.__c[w] = u;
          return u;
        };
        var t = this._getClassNameFromEnvKey(w);
        if(t[0] != undefined){

          var x = t[0];
          var v = t[1];
          var u = x[v]();
          this.__c[w] = u;
          return u;
        };
        if(qx.Bootstrap.DEBUG){

          qx.Bootstrap.warn(w + r + h);
          qx.Bootstrap.trace(this);
        };
      },
      _getClassNameFromEnvKey : function(D){

        var F = this._checksMap;
        if(F[D] != undefined){

          var A = F[D];
          var E = A.lastIndexOf(o);
          if(E > -1){

            var C = A.slice(0, E);
            var z = A.slice(E + 1);
            var B = qx.Bootstrap.getByName(C);
            if(B != undefined){

              return [B, z];
            };
          };
        };
        return [undefined, undefined];
      },
      getAsync : function(H, K, self){

        var L = this;
        if(this.__c[H] != undefined){

          window.setTimeout(function(){

            K.call(self, L.__c[H]);
          }, 0);
          return;
        };
        var I = this._asyncChecks[H];
        if(I){

          I(function(N){

            L.__c[H] = N;
            K.call(self, N);
          });
          return;
        };
        var G = this._getClassNameFromEnvKey(H);
        if(G[0] != undefined){

          var J = G[0];
          var M = G[1];
          J[M](function(O){

            L.__c[H] = O;
            K.call(self, O);
          });
          return;
        };
        if(qx.Bootstrap.DEBUG){

          qx.Bootstrap.warn(H + r + h);
          qx.Bootstrap.trace(this);
        };
      },
      select : function(Q, P){

        return this.__d(this.get(Q), P);
      },
      selectAsync : function(S, R, self){

        this.getAsync(S, function(T){

          var U = this.__d(S, R);
          U.call(self, T);
        }, this);
      },
      __d : function(Y, X){

        var W = X[Y];
        if(X.hasOwnProperty(Y)){

          return W;
        };
        for(var ba in X){

          if(ba.indexOf(g) != -1){

            var V = ba.split(g);
            for(var i = 0;i < V.length;i++){

              if(V[i] == Y){

                return X[ba];
              };
            };
          };
        };
        if(X[b] !== undefined){

          return X[b];
        };
        if(qx.Bootstrap.DEBUG){

          throw new Error(q + Y + m + (typeof Y) + c + n + qx.Bootstrap.keys(X) + k);
        };
      },
      filter : function(bb){

        var bd = [];
        for(var bc in bb){

          if(this.get(bc)){

            bd.push(bb[bc]);
          };
        };
        return bd;
      },
      invalidateCacheKey : function(be){

        delete this.__c[be];
      },
      add : function(bg, bf){

        if(this._checks[bg] == undefined){

          if(bf instanceof Function){

            if(!this._checksMap[bg] && bf.displayName){

              this._checksMap[bg] = bf.displayName.substr(0, bf.displayName.length - 2);
            };
            this._checks[bg] = bf;
          } else {

            this._checks[bg] = this.__g(bf);
          };
        };
      },
      addAsync : function(bi, bh){

        if(this._checks[bi] == undefined){

          this._asyncChecks[bi] = bh;
        };
      },
      getChecks : function(){

        return this._checks;
      },
      getAsyncChecks : function(){

        return this._asyncChecks;
      },
      _initDefaultQxValues : function(){

        var bj = function(bl){

          return function(){

            return bl;
          };
        };
        for(var bk in this._defaults){

          this.add(bk, bj(this._defaults[bk]));
        };
      },
      __e : function(){

        if(qx && qx.$$environment){

          for(var bm in qx.$$environment){

            var bn = qx.$$environment[bm];
            this._checks[bm] = this.__g(bn);
          };
        };
      },
      __f : function(){

        if(window.document && window.document.location){

          var bo = window.document.location.search.slice(1).split(d);
          for(var i = 0;i < bo.length;i++){

            var br = bo[i].split(l);
            if(br.length != 3 || br[0] != s){

              continue;
            };
            var bp = br[1];
            var bq = decodeURIComponent(br[2]);
            if(bq == f){

              bq = true;
            } else if(bq == j){

              bq = false;
            } else if(/^(\d|\.)+$/.test(bq)){

              bq = parseFloat(bq);
            };;
            this._checks[bp] = this.__g(bq);
          };
        };
      },
      __g : function(bs){

        return qx.Bootstrap.bind(function(bt){

          return bt;
        }, null, bs);
      }
    },
    defer : function(bu){

      bu._initDefaultQxValues();
      bu.__e();
      if(bu.get(p) === true){

        bu.__f();
      };
    }
  });
})();
(function(){

  var a = "ecmascript.array.lastindexof",b = "function",c = "stack",d = "ecmascript.array.map",f = "ecmascript.date.now",g = "ecmascript.array.reduce",h = "e",i = "qx.bom.client.EcmaScript",j = "ecmascript.object.keys",k = "ecmascript.error.stacktrace",l = "ecmascript.string.trim",m = "ecmascript.array.indexof",n = "stacktrace",o = "ecmascript.error.toString",p = "[object Error]",q = "ecmascript.array.foreach",r = "ecmascript.function.bind",s = "ecmascript.array.reduceright",t = "ecmascript.array.some",u = "ecmascript.array.filter",v = "ecmascript.array.every";
  qx.Bootstrap.define(i, {
    statics : {
      getStackTrace : function(){

        var w;
        var e = new Error(h);
        w = e.stack ? c : e.stacktrace ? n : null;
        if(!w){

          try{

            throw e;
          } catch(x) {

            e = x;
          };
        };
        return e.stacktrace ? n : e.stack ? c : null;
      },
      getArrayIndexOf : function(){

        return !!Array.prototype.indexOf;
      },
      getArrayLastIndexOf : function(){

        return !!Array.prototype.lastIndexOf;
      },
      getArrayForEach : function(){

        return !!Array.prototype.forEach;
      },
      getArrayFilter : function(){

        return !!Array.prototype.filter;
      },
      getArrayMap : function(){

        return !!Array.prototype.map;
      },
      getArraySome : function(){

        return !!Array.prototype.some;
      },
      getArrayEvery : function(){

        return !!Array.prototype.every;
      },
      getArrayReduce : function(){

        return !!Array.prototype.reduce;
      },
      getArrayReduceRight : function(){

        return !!Array.prototype.reduceRight;
      },
      getErrorToString : function(){

        return typeof Error.prototype.toString == b && Error.prototype.toString() !== p;
      },
      getFunctionBind : function(){

        return typeof Function.prototype.bind === b;
      },
      getObjectKeys : function(){

        return !!Object.keys;
      },
      getDateNow : function(){

        return !!Date.now;
      },
      getStringTrim : function(){

        return typeof String.prototype.trim === b;
      }
    },
    defer : function(y){

      qx.core.Environment.add(m, y.getArrayIndexOf);
      qx.core.Environment.add(a, y.getArrayLastIndexOf);
      qx.core.Environment.add(q, y.getArrayForEach);
      qx.core.Environment.add(u, y.getArrayFilter);
      qx.core.Environment.add(d, y.getArrayMap);
      qx.core.Environment.add(t, y.getArraySome);
      qx.core.Environment.add(v, y.getArrayEvery);
      qx.core.Environment.add(g, y.getArrayReduce);
      qx.core.Environment.add(s, y.getArrayReduceRight);
      qx.core.Environment.add(f, y.getDateNow);
      qx.core.Environment.add(o, y.getErrorToString);
      qx.core.Environment.add(k, y.getStackTrace);
      qx.core.Environment.add(r, y.getFunctionBind);
      qx.core.Environment.add(j, y.getObjectKeys);
      qx.core.Environment.add(l, y.getStringTrim);
    }
  });
})();
(function(){

  var a = "function",b = "ecmascript.array.lastindexof",c = "ecmascript.array.map",d = "ecmascript.array.filter",e = "Length is 0 and no second argument given",f = "qx.lang.normalize.Array",g = "ecmascript.array.indexof",h = "First argument is not callable",j = "ecmascript.array.reduce",k = "ecmascript.array.foreach",m = "ecmascript.array.reduceright",n = "ecmascript.array.some",o = "ecmascript.array.every";
  qx.Bootstrap.define(f, {
    statics : {
      indexOf : function(p, q){

        if(q == null){

          q = 0;
        } else if(q < 0){

          q = Math.max(0, this.length + q);
        };
        for(var i = q;i < this.length;i++){

          if(this[i] === p){

            return i;
          };
        };
        return -1;
      },
      lastIndexOf : function(r, s){

        if(s == null){

          s = this.length - 1;
        } else if(s < 0){

          s = Math.max(0, this.length + s);
        };
        for(var i = s;i >= 0;i--){

          if(this[i] === r){

            return i;
          };
        };
        return -1;
      },
      forEach : function(t, u){

        var l = this.length;
        for(var i = 0;i < l;i++){

          var v = this[i];
          if(v !== undefined){

            t.call(u || window, v, i, this);
          };
        };
      },
      filter : function(z, w){

        var x = [];
        var l = this.length;
        for(var i = 0;i < l;i++){

          var y = this[i];
          if(y !== undefined){

            if(z.call(w || window, y, i, this)){

              x.push(this[i]);
            };
          };
        };
        return x;
      },
      map : function(D, A){

        var B = [];
        var l = this.length;
        for(var i = 0;i < l;i++){

          var C = this[i];
          if(C !== undefined){

            B[i] = D.call(A || window, C, i, this);
          };
        };
        return B;
      },
      some : function(E, F){

        var l = this.length;
        for(var i = 0;i < l;i++){

          var G = this[i];
          if(G !== undefined){

            if(E.call(F || window, G, i, this)){

              return true;
            };
          };
        };
        return false;
      },
      every : function(H, I){

        var l = this.length;
        for(var i = 0;i < l;i++){

          var J = this[i];
          if(J !== undefined){

            if(!H.call(I || window, J, i, this)){

              return false;
            };
          };
        };
        return true;
      },
      reduce : function(K, L){

        if(typeof K !== a){

          throw new TypeError(h);
        };
        if(L === undefined && this.length === 0){

          throw new TypeError(e);
        };
        var M = L === undefined ? this[0] : L;
        for(var i = L === undefined ? 1 : 0;i < this.length;i++){

          if(i in this){

            M = K.call(undefined, M, this[i], i, this);
          };
        };
        return M;
      },
      reduceRight : function(N, O){

        if(typeof N !== a){

          throw new TypeError(h);
        };
        if(O === undefined && this.length === 0){

          throw new TypeError(e);
        };
        var P = O === undefined ? this[this.length - 1] : O;
        for(var i = O === undefined ? this.length - 2 : this.length - 1;i >= 0;i--){

          if(i in this){

            P = N.call(undefined, P, this[i], i, this);
          };
        };
        return P;
      }
    },
    defer : function(Q){

      if(!qx.core.Environment.get(g)){

        Array.prototype.indexOf = Q.indexOf;
      };
      if(!qx.core.Environment.get(b)){

        Array.prototype.lastIndexOf = Q.lastIndexOf;
      };
      if(!qx.core.Environment.get(k)){

        Array.prototype.forEach = Q.forEach;
      };
      if(!qx.core.Environment.get(d)){

        Array.prototype.filter = Q.filter;
      };
      if(!qx.core.Environment.get(c)){

        Array.prototype.map = Q.map;
      };
      if(!qx.core.Environment.get(n)){

        Array.prototype.some = Q.some;
      };
      if(!qx.core.Environment.get(o)){

        Array.prototype.every = Q.every;
      };
      if(!qx.core.Environment.get(j)){

        Array.prototype.reduce = Q.reduce;
      };
      if(!qx.core.Environment.get(m)){

        Array.prototype.reduceRight = Q.reduceRight;
      };
    }
  });
})();
(function(){

  var a = "qx.Mixin",b = ".prototype",c = "]",d = 'Conflict between mixin "',e = "constructor",f = "Array",g = '"!',h = '" and "',j = "destruct",k = '" in property "',m = "Mixin",n = '" in member "',o = "[Mixin ";
  qx.Bootstrap.define(a, {
    statics : {
      define : function(name, q){

        if(q){

          if(q.include && !(qx.Bootstrap.getClass(q.include) === f)){

            q.include = [q.include];
          };
          {
          };
          var r = q.statics ? q.statics : {
          };
          qx.Bootstrap.setDisplayNames(r, name);
          for(var p in r){

            if(r[p] instanceof Function){

              r[p].$$mixin = r;
            };
          };
          if(q.construct){

            r.$$constructor = q.construct;
            qx.Bootstrap.setDisplayName(q.construct, name, e);
          };
          if(q.include){

            r.$$includes = q.include;
          };
          if(q.properties){

            r.$$properties = q.properties;
          };
          if(q.members){

            r.$$members = q.members;
            qx.Bootstrap.setDisplayNames(q.members, name + b);
          };
          for(var p in r.$$members){

            if(r.$$members[p] instanceof Function){

              r.$$members[p].$$mixin = r;
            };
          };
          if(q.events){

            r.$$events = q.events;
          };
          if(q.destruct){

            r.$$destructor = q.destruct;
            qx.Bootstrap.setDisplayName(q.destruct, name, j);
          };
        } else {

          var r = {
          };
        };
        r.$$type = m;
        r.name = name;
        r.toString = this.genericToString;
        r.basename = qx.Bootstrap.createNamespace(name, r);
        this.$$registry[name] = r;
        return r;
      },
      checkCompatibility : function(t){

        var u = this.flatten(t);
        var v = u.length;
        if(v < 2){

          return true;
        };
        var w = {
        };
        var x = {
        };
        var z = {
        };
        var y;
        for(var i = 0;i < v;i++){

          y = u[i];
          for(var s in y.events){

            if(z[s]){

              throw new Error(d + y.name + h + z[s] + n + s + g);
            };
            z[s] = y.name;
          };
          for(var s in y.properties){

            if(w[s]){

              throw new Error(d + y.name + h + w[s] + k + s + g);
            };
            w[s] = y.name;
          };
          for(var s in y.members){

            if(x[s]){

              throw new Error(d + y.name + h + x[s] + n + s + g);
            };
            x[s] = y.name;
          };
        };
        return true;
      },
      isCompatible : function(B, C){

        var A = qx.util.OOUtil.getMixins(C);
        A.push(B);
        return qx.Mixin.checkCompatibility(A);
      },
      getByName : function(name){

        return this.$$registry[name];
      },
      isDefined : function(name){

        return this.getByName(name) !== undefined;
      },
      getTotalNumber : function(){

        return qx.Bootstrap.objectGetLength(this.$$registry);
      },
      flatten : function(D){

        if(!D){

          return [];
        };
        var E = D.concat();
        for(var i = 0,l = D.length;i < l;i++){

          if(D[i].$$includes){

            E.push.apply(E, this.flatten(D[i].$$includes));
          };
        };
        return E;
      },
      genericToString : function(){

        return o + this.name + c;
      },
      $$registry : {
      },
      __h : null,
      __i : function(name, F){
      }
    }
  });
})();
(function(){

  var a = "&v=1",b = "",c = "wialon.item.MPoi",d = "?b=",e = "undefined",f = "string",g = "resource/upload_poi_image";
  qx.Mixin.define(c, {
    members : {
      getPoiImageUrl : function(h, i){

        if(typeof i == e || !i)i = 32;
        if(h.icon)return wialon.core.Session.getInstance().getBaseUrl() + h.icon + d + i + a;
        return b;
      },
      setPoiImage : function(k, j, l){

        if(typeof j == f)return wialon.core.Uploader.getInstance().uploadFiles([], g, {
          fileUrl : j,
          itemId : this.getId(),
          poiId : k.id
        }, l, true); else if(j === null || j === undefined)return wialon.core.Uploader.getInstance().uploadFiles([], g, {
          fileUrl : b,
          itemId : this.getId(),
          poiId : k.id
        }, l, true);;
        return wialon.core.Uploader.getInstance().uploadFiles([j], g, {
          itemId : this.getId(),
          poiId : k.id
        }, l, true);
      }
    }
  });
})();
(function(){

  var a = '',b = "ecmascript.string.trim",c = "qx.lang.normalize.String";
  qx.Bootstrap.define(c, {
    statics : {
      trim : function(){

        return this.replace(/^\s+|\s+$/g, a);
      }
    },
    defer : function(d){

      if(!qx.core.Environment.get(b)){

        String.prototype.trim = d.trim;
      };
    }
  });
})();
(function(){

  var a = "ecmascript.object.keys",b = "qx.lang.normalize.Object";
  qx.Bootstrap.define(b, {
    statics : {
      keys : qx.Bootstrap.keys
    },
    defer : function(c){

      if(!qx.core.Environment.get(a)){

        Object.keys = c.keys;
      };
    }
  });
})();
(function(){

  var a = "qx.lang.normalize.Function",b = "ecmascript.function.bind",c = "function",d = "Function.prototype.bind called on incompatible ";
  qx.Bootstrap.define(a, {
    statics : {
      bind : function(i){

        var e = Array.prototype.slice;
        var h = this;
        if(typeof h != c){

          throw new TypeError(d + h);
        };
        var f = e.call(arguments, 1);
        var g = function(){

          if(this instanceof g){

            var F = function(){
            };
            F.prototype = h.prototype;
            var self = new F;
            var j = h.apply(self, f.concat(e.call(arguments)));
            if(Object(j) === j){

              return j;
            };
            return self;
          } else {

            return h.apply(i, f.concat(e.call(arguments)));
          };
        };
        return g;
      }
    },
    defer : function(k){

      if(!qx.core.Environment.get(b)){

        Function.prototype.bind = k.bind;
      };
    }
  });
})();
(function(){

  var a = "ecmascript.error.toString",b = "qx.lang.normalize.Error",c = ": ",d = "Error",e = "";
  qx.Bootstrap.define(b, {
    statics : {
      toString : function(){

        var name = this.name || d;
        var f = this.message || e;
        if(name === e && f === e){

          return d;
        };
        if(name === e){

          return f;
        };
        if(f === e){

          return name;
        };
        return name + c + f;
      }
    },
    defer : function(g){

      if(!qx.core.Environment.get(a)){

        Error.prototype.toString = g.toString;
      };
    }
  });
})();
(function(){

  var a = "qx.lang.normalize.Date",b = "ecmascript.date.now";
  qx.Bootstrap.define(a, {
    statics : {
      now : function(){

        return +new Date();
      }
    },
    defer : function(c){

      if(!qx.core.Environment.get(b)){

        Date.now = c.now;
      };
    }
  });
})();
(function(){

  var b = '!==inherit){',c = 'qx.lang.Type.isString(value) && qx.util.ColorUtil.isValidPropertyValue(value)',d = 'value !== null && qx.theme.manager.Font.getInstance().isDynamic(value)',e = "set",f = ';',g = "resetThemed",h = 'value !== null && value.nodeType === 9 && value.documentElement',j = '===value)return value;',k = 'value !== null && value.$$type === "Mixin"',m = 'return init;',n = 'var init=this.',o = 'value !== null && value.nodeType === 1 && value.attributes',p = "var parent = this.getLayoutParent();",q = "Error in property ",r = 'var a=this._getChildren();if(a)for(var i=0,l=a.length;i<l;i++){',s = "property",t = "();",u = '.validate.call(this, value);',v = 'qx.core.Assert.assertInstance(value, Date, msg) || true',w = 'else{',x = "if (!parent) return;",y = " in method ",z = 'qx.core.Assert.assertInstance(value, Error, msg) || true',A = '=computed;',B = 'Undefined value is not allowed!',C = '(backup);',D = 'else ',E = '=true;',F = 'if(old===undefined)old=this.',G = 'if(computed===inherit){',H = 'old=computed=this.',I = "inherit",J = 'if(this.',K = 'return this.',L = 'else if(this.',M = 'Is invalid!',N = 'if(value===undefined)prop.error(this,2,"',O = '", "',P = 'var computed, old=this.',Q = 'else if(computed===undefined)',R = 'delete this.',S = "resetRuntime",T = "': ",U = " of class ",V = 'value !== null && value.nodeType !== undefined',W = '===undefined)return;',X = 'value !== null && qx.theme.manager.Decoration.getInstance().isValidPropertyValue(value)',Y = "reset",ba = "string",bb = "')){",bc = "module.events",bd = "return this.",be = 'qx.core.Assert.assertPositiveInteger(value, msg) || true',bf = 'else this.',bg = 'value=this.',bh = '","',bi = 'if(init==qx.core.Property.$$inherit)init=null;',bj = "get",bk = 'value !== null && value.$$type === "Interface"',bl = 'var inherit=prop.$$inherit;',bm = "', qx.event.type.Data, [computed, old]",bn = "var value = parent.",bo = "$$useinit_",bp = 'computed=undefined;delete this.',bq = "(value);",br = 'this.',bs = 'Requires exactly one argument!',bt = '",value);',bu = 'computed=value;',bv = '}else{',bw = "$$runtime_",bx = "setThemed",by = ';}',bz = '(value);',bA = "$$user_",bB = '!==undefined)',bC = '){',bD = 'qx.core.Assert.assertArray(value, msg) || true',bE = 'if(computed===undefined||computed===inherit){',bF = ";",bG = 'qx.core.Assert.assertPositiveNumber(value, msg) || true',bH = ".prototype",bI = "Boolean",bJ = ")}",bK = "(a[",bL = '(computed, old, "',bM = "setRuntime",bN = 'return value;',bO = "this.",bP = 'if(init==qx.core.Property.$$inherit)throw new Error("Inheritable property ',bQ = "if(reg.hasListener(this, '",bR = 'Does not allow any arguments!',bS = ')a[i].',bT = "()",bU = "var a=arguments[0] instanceof Array?arguments[0]:arguments;",bV = '.$$properties.',bW = 'value !== null && value.$$type === "Theme"',bX = 'old=this.',bY = "var reg=qx.event.Registration;",ca = "())",cb = '=value;',cc = 'return null;',cd = 'qx.core.Assert.assertObject(value, msg) || true',ce = '");',cf = 'if(old===computed)return value;',cg = 'qx.core.Assert.assertString(value, msg) || true',ch = 'if(old===undefined)old=null;',ci = 'var pa=this.getLayoutParent();if(pa)computed=pa.',cj = "if (value===undefined) value = parent.",ck = 'value !== null && value.$$type === "Class"',cl = 'qx.core.Assert.assertFunction(value, msg) || true',cm = '!==undefined&&',cn = 'var computed, old;',co = 'var backup=computed;',cp = ".",cq = '}',cr = "object",cs = "$$init_",ct = "$$theme_",cu = '!==undefined){',cv = 'if(computed===undefined)computed=null;',cw = "Unknown reason: ",cx = "init",cy = 'qx.core.Assert.assertMap(value, msg) || true',cz = "qx.aspects",cA = 'qx.core.Assert.assertNumber(value, msg) || true',cB = 'if((computed===undefined||computed===inherit)&&',cC = "reg.fireEvent(this, '",cD = 'Null value is not allowed!',cE = 'qx.core.Assert.assertInteger(value, msg) || true',cF = "value",cG = "shorthand",cH = 'computed=this.',cI = 'qx.core.Assert.assertInstance(value, RegExp, msg) || true',cJ = 'value !== null && value.type !== undefined',cK = 'value !== null && value.document',cL = "",cM = 'throw new Error("Property ',cN = "(!this.",cO = 'qx.core.Assert.assertBoolean(value, msg) || true',cP = 'if(a[i].',cQ = ' of an instance of ',cR = "toggle",cS = "refresh",cT = "$$inherit_",cU = 'var prop=qx.core.Property;',cV = "boolean",cW = " with incoming value '",cX = "a=qx.lang.Array.fromShortHand(qx.lang.Array.fromArguments(a));",cY = 'if(computed===undefined||computed==inherit)computed=null;',da = "qx.core.Property",db = "is",dc = ' is not (yet) ready!");',dd = "]);",de = 'Could not change or apply init value after constructing phase!';
  qx.Bootstrap.define(da, {
    statics : {
      __j : function(){

        if(qx.core.Environment.get(bc)){

          qx.event.type.Data;
          qx.event.dispatch.Direct;
        };
      },
      __k : {
        "Boolean" : cO,
        "String" : cg,
        "Number" : cA,
        "Integer" : cE,
        "PositiveNumber" : bG,
        "PositiveInteger" : be,
        "Error" : z,
        "RegExp" : cI,
        "Object" : cd,
        "Array" : bD,
        "Map" : cy,
        "Function" : cl,
        "Date" : v,
        "Node" : V,
        "Element" : o,
        "Document" : h,
        "Window" : cK,
        "Event" : cJ,
        "Class" : ck,
        "Mixin" : k,
        "Interface" : bk,
        "Theme" : bW,
        "Color" : c,
        "Decorator" : X,
        "Font" : d
      },
      __l : {
        "Node" : true,
        "Element" : true,
        "Document" : true,
        "Window" : true,
        "Event" : true
      },
      $$inherit : I,
      $$store : {
        runtime : {
        },
        user : {
        },
        theme : {
        },
        inherit : {
        },
        init : {
        },
        useinit : {
        }
      },
      $$method : {
        get : {
        },
        set : {
        },
        reset : {
        },
        init : {
        },
        refresh : {
        },
        setRuntime : {
        },
        resetRuntime : {
        },
        setThemed : {
        },
        resetThemed : {
        }
      },
      $$allowedKeys : {
        name : ba,
        dereference : cV,
        inheritable : cV,
        nullable : cV,
        themeable : cV,
        refine : cV,
        init : null,
        apply : ba,
        event : ba,
        check : null,
        transform : ba,
        deferredInit : cV,
        validate : null
      },
      $$allowedGroupKeys : {
        name : ba,
        group : cr,
        mode : ba,
        themeable : cV
      },
      $$inheritable : {
      },
      __m : function(dh){

        var df = this.__n(dh);
        if(!df.length){

          var dg = function(){
          };
        } else {

          dg = this.__o(df);
        };
        dh.prototype.$$refreshInheritables = dg;
      },
      __n : function(di){

        var dj = [];
        while(di){

          var dk = di.$$properties;
          if(dk){

            for(var name in this.$$inheritable){

              if(dk[name] && dk[name].inheritable){

                dj.push(name);
              };
            };
          };
          di = di.superclass;
        };
        return dj;
      },
      __o : function(inheritables){

        var inherit = this.$$store.inherit;
        var init = this.$$store.init;
        var refresh = this.$$method.refresh;
        var code = [p, x];
        for(var i = 0,l = inheritables.length;i < l;i++){

          var name = inheritables[i];
          code.push(bn, inherit[name], bF, cj, init[name], bF, bO, refresh[name], bq);
        };
        return new Function(code.join(cL));
      },
      attachRefreshInheritables : function(dl){

        dl.prototype.$$refreshInheritables = function(){

          qx.core.Property.__m(dl);
          return this.$$refreshInheritables();
        };
      },
      attachMethods : function(dn, name, dm){

        dm.group ? this.__p(dn, dm, name) : this.__q(dn, dm, name);
      },
      __p : function(clazz, config, name){

        var upname = qx.Bootstrap.firstUp(name);
        var members = clazz.prototype;
        var themeable = config.themeable === true;
        {
        };
        var setter = [];
        var resetter = [];
        if(themeable){

          var styler = [];
          var unstyler = [];
        };
        var argHandler = bU;
        setter.push(argHandler);
        if(themeable){

          styler.push(argHandler);
        };
        if(config.mode == cG){

          var shorthand = cX;
          setter.push(shorthand);
          if(themeable){

            styler.push(shorthand);
          };
        };
        for(var i = 0,a = config.group,l = a.length;i < l;i++){

          {
          };
          setter.push(bO, this.$$method.set[a[i]], bK, i, dd);
          resetter.push(bO, this.$$method.reset[a[i]], t);
          if(themeable){

            {
            };
            styler.push(bO, this.$$method.setThemed[a[i]], bK, i, dd);
            unstyler.push(bO, this.$$method.resetThemed[a[i]], t);
          };
        };
        this.$$method.set[name] = e + upname;
        members[this.$$method.set[name]] = new Function(setter.join(cL));
        this.$$method.reset[name] = Y + upname;
        members[this.$$method.reset[name]] = new Function(resetter.join(cL));
        if(themeable){

          this.$$method.setThemed[name] = bx + upname;
          members[this.$$method.setThemed[name]] = new Function(styler.join(cL));
          this.$$method.resetThemed[name] = g + upname;
          members[this.$$method.resetThemed[name]] = new Function(unstyler.join(cL));
        };
      },
      __q : function(clazz, config, name){

        var upname = qx.Bootstrap.firstUp(name);
        var members = clazz.prototype;
        {
        };
        if(config.dereference === undefined && typeof config.check === ba){

          config.dereference = this.__r(config.check);
        };
        var method = this.$$method;
        var store = this.$$store;
        store.runtime[name] = bw + name;
        store.user[name] = bA + name;
        store.theme[name] = ct + name;
        store.init[name] = cs + name;
        store.inherit[name] = cT + name;
        store.useinit[name] = bo + name;
        method.get[name] = bj + upname;
        members[method.get[name]] = function(){

          return qx.core.Property.executeOptimizedGetter(this, clazz, name, bj);
        };
        method.set[name] = e + upname;
        members[method.set[name]] = function(dp){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, e, arguments);
        };
        method.reset[name] = Y + upname;
        members[method.reset[name]] = function(){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, Y);
        };
        if(config.inheritable || config.apply || config.event || config.deferredInit){

          method.init[name] = cx + upname;
          members[method.init[name]] = function(dq){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, cx, arguments);
          };
          {
          };
        };
        if(config.inheritable){

          method.refresh[name] = cS + upname;
          members[method.refresh[name]] = function(dr){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, cS, arguments);
          };
          {
          };
        };
        method.setRuntime[name] = bM + upname;
        members[method.setRuntime[name]] = function(ds){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, bM, arguments);
        };
        method.resetRuntime[name] = S + upname;
        members[method.resetRuntime[name]] = function(){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, S);
        };
        if(config.themeable){

          method.setThemed[name] = bx + upname;
          members[method.setThemed[name]] = function(dt){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, bx, arguments);
          };
          method.resetThemed[name] = g + upname;
          members[method.resetThemed[name]] = function(){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, g);
          };
          {
          };
        };
        if(config.check === bI){

          members[cR + upname] = new Function(bd + method.set[name] + cN + method.get[name] + ca);
          members[db + upname] = new Function(bd + method.get[name] + bT);
          {
          };
        };
        {
        };
      },
      __r : function(du){

        return !!this.__l[du];
      },
      __s : {
        '0' : de,
        '1' : bs,
        '2' : B,
        '3' : bR,
        '4' : cD,
        '5' : M
      },
      error : function(dv, dB, dA, dw, dx){

        var dy = dv.constructor.classname;
        var dz = q + dA + U + dy + y + this.$$method[dw][dA] + cW + dx + T;
        throw new Error(dz + (this.__s[dB] || cw + dB));
      },
      __t : function(instance, members, name, variant, code, args){

        var store = this.$$method[variant][name];
        {

          members[store] = new Function(cF, code.join(cL));
        };
        if(qx.core.Environment.get(cz)){

          members[store] = qx.core.Aspect.wrap(instance.classname + cp + store, members[store], s);
        };
        qx.Bootstrap.setDisplayName(members[store], instance.classname + bH, store);
        if(args === undefined){

          return instance[store]();
        } else {

          return instance[store](args[0]);
        };
      },
      executeOptimizedGetter : function(dF, dE, name, dD){

        var dH = dE.$$properties[name];
        var dG = dE.prototype;
        var dC = [];
        var dI = this.$$store;
        dC.push(J, dI.runtime[name], bB);
        dC.push(K, dI.runtime[name], f);
        if(dH.inheritable){

          dC.push(L, dI.inherit[name], bB);
          dC.push(K, dI.inherit[name], f);
          dC.push(D);
        };
        dC.push(J, dI.user[name], bB);
        dC.push(K, dI.user[name], f);
        if(dH.themeable){

          dC.push(L, dI.theme[name], bB);
          dC.push(K, dI.theme[name], f);
        };
        if(dH.deferredInit && dH.init === undefined){

          dC.push(L, dI.init[name], bB);
          dC.push(K, dI.init[name], f);
        };
        dC.push(D);
        if(dH.init !== undefined){

          if(dH.inheritable){

            dC.push(n, dI.init[name], f);
            if(dH.nullable){

              dC.push(bi);
            } else if(dH.init !== undefined){

              dC.push(K, dI.init[name], f);
            } else {

              dC.push(bP, name, cQ, dE.classname, dc);
            };
            dC.push(m);
          } else {

            dC.push(K, dI.init[name], f);
          };
        } else if(dH.inheritable || dH.nullable){

          dC.push(cc);
        } else {

          dC.push(cM, name, cQ, dE.classname, dc);
        };
        return this.__t(dF, dG, name, dD, dC);
      },
      executeOptimizedSetter : function(dP, dO, name, dN, dM){

        var dR = dO.$$properties[name];
        var dQ = dO.prototype;
        var dK = [];
        var dJ = dN === e || dN === bx || dN === bM || (dN === cx && dR.init === undefined);
        var dL = dR.apply || dR.event || dR.inheritable;
        var dS = this.__u(dN, name);
        this.__v(dK, dR, name, dN, dJ);
        if(dJ){

          this.__w(dK, dO, dR, name);
        };
        if(dL){

          this.__x(dK, dJ, dS, dN);
        };
        if(dR.inheritable){

          dK.push(bl);
        };
        {
        };
        if(!dL){

          this.__z(dK, name, dN, dJ);
        } else {

          this.__A(dK, dR, name, dN, dJ);
        };
        if(dR.inheritable){

          this.__B(dK, dR, name, dN);
        } else if(dL){

          this.__C(dK, dR, name, dN);
        };
        if(dL){

          this.__D(dK, dR, name, dN);
          if(dR.inheritable && dQ._getChildren){

            this.__E(dK, name);
          };
        };
        if(dJ){

          dK.push(bN);
        };
        return this.__t(dP, dQ, name, dN, dK, dM);
      },
      __u : function(dT, name){

        if(dT === bM || dT === S){

          var dU = this.$$store.runtime[name];
        } else if(dT === bx || dT === g){

          dU = this.$$store.theme[name];
        } else if(dT === cx){

          dU = this.$$store.init[name];
        } else {

          dU = this.$$store.user[name];
        };;
        return dU;
      },
      __v : function(dX, dV, name, dY, dW){

        {

          if(!dV.nullable || dV.check || dV.inheritable){

            dX.push(cU);
          };
          if(dY === e){

            dX.push(N, name, bh, dY, bt);
          };
        };
      },
      __w : function(ea, ec, eb, name){

        if(eb.transform){

          ea.push(bg, eb.transform, bz);
        };
        if(eb.validate){

          if(typeof eb.validate === ba){

            ea.push(br, eb.validate, bz);
          } else if(eb.validate instanceof Function){

            ea.push(ec.classname, bV, name);
            ea.push(u);
          };
        };
      },
      __x : function(ee, ed, eg, ef){

        var eh = (ef === Y || ef === g || ef === S);
        if(ed){

          ee.push(J, eg, j);
        } else if(eh){

          ee.push(J, eg, W);
        };
      },
      __y : undefined,
      __z : function(ej, name, ek, ei){

        if(ek === bM){

          ej.push(br, this.$$store.runtime[name], cb);
        } else if(ek === S){

          ej.push(J, this.$$store.runtime[name], bB);
          ej.push(R, this.$$store.runtime[name], f);
        } else if(ek === e){

          ej.push(br, this.$$store.user[name], cb);
        } else if(ek === Y){

          ej.push(J, this.$$store.user[name], bB);
          ej.push(R, this.$$store.user[name], f);
        } else if(ek === bx){

          ej.push(br, this.$$store.theme[name], cb);
        } else if(ek === g){

          ej.push(J, this.$$store.theme[name], bB);
          ej.push(R, this.$$store.theme[name], f);
        } else if(ek === cx && ei){

          ej.push(br, this.$$store.init[name], cb);
        };;;;;;
      },
      __A : function(en, el, name, eo, em){

        if(el.inheritable){

          en.push(P, this.$$store.inherit[name], f);
        } else {

          en.push(cn);
        };
        en.push(J, this.$$store.runtime[name], cu);
        if(eo === bM){

          en.push(cH, this.$$store.runtime[name], cb);
        } else if(eo === S){

          en.push(R, this.$$store.runtime[name], f);
          en.push(J, this.$$store.user[name], bB);
          en.push(cH, this.$$store.user[name], f);
          en.push(L, this.$$store.theme[name], bB);
          en.push(cH, this.$$store.theme[name], f);
          en.push(L, this.$$store.init[name], cu);
          en.push(cH, this.$$store.init[name], f);
          en.push(br, this.$$store.useinit[name], E);
          en.push(cq);
        } else {

          en.push(H, this.$$store.runtime[name], f);
          if(eo === e){

            en.push(br, this.$$store.user[name], cb);
          } else if(eo === Y){

            en.push(R, this.$$store.user[name], f);
          } else if(eo === bx){

            en.push(br, this.$$store.theme[name], cb);
          } else if(eo === g){

            en.push(R, this.$$store.theme[name], f);
          } else if(eo === cx && em){

            en.push(br, this.$$store.init[name], cb);
          };;;;
        };
        en.push(cq);
        en.push(L, this.$$store.user[name], cu);
        if(eo === e){

          if(!el.inheritable){

            en.push(bX, this.$$store.user[name], f);
          };
          en.push(cH, this.$$store.user[name], cb);
        } else if(eo === Y){

          if(!el.inheritable){

            en.push(bX, this.$$store.user[name], f);
          };
          en.push(R, this.$$store.user[name], f);
          en.push(J, this.$$store.runtime[name], bB);
          en.push(cH, this.$$store.runtime[name], f);
          en.push(J, this.$$store.theme[name], bB);
          en.push(cH, this.$$store.theme[name], f);
          en.push(L, this.$$store.init[name], cu);
          en.push(cH, this.$$store.init[name], f);
          en.push(br, this.$$store.useinit[name], E);
          en.push(cq);
        } else {

          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(el.inheritable){

            en.push(cH, this.$$store.user[name], f);
          } else {

            en.push(H, this.$$store.user[name], f);
          };
          if(eo === bx){

            en.push(br, this.$$store.theme[name], cb);
          } else if(eo === g){

            en.push(R, this.$$store.theme[name], f);
          } else if(eo === cx && em){

            en.push(br, this.$$store.init[name], cb);
          };;
        };
        en.push(cq);
        if(el.themeable){

          en.push(L, this.$$store.theme[name], cu);
          if(!el.inheritable){

            en.push(bX, this.$$store.theme[name], f);
          };
          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(eo === e){

            en.push(cH, this.$$store.user[name], cb);
          } else if(eo === bx){

            en.push(cH, this.$$store.theme[name], cb);
          } else if(eo === g){

            en.push(R, this.$$store.theme[name], f);
            en.push(J, this.$$store.init[name], cu);
            en.push(cH, this.$$store.init[name], f);
            en.push(br, this.$$store.useinit[name], E);
            en.push(cq);
          } else if(eo === cx){

            if(em){

              en.push(br, this.$$store.init[name], cb);
            };
            en.push(cH, this.$$store.theme[name], f);
          } else if(eo === cS){

            en.push(cH, this.$$store.theme[name], f);
          };;;;;
          en.push(cq);
        };
        en.push(L, this.$$store.useinit[name], bC);
        if(!el.inheritable){

          en.push(bX, this.$$store.init[name], f);
        };
        if(eo === cx){

          if(em){

            en.push(cH, this.$$store.init[name], cb);
          } else {

            en.push(cH, this.$$store.init[name], f);
          };
        } else if(eo === e || eo === bM || eo === bx || eo === cS){

          en.push(R, this.$$store.useinit[name], f);
          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(eo === e){

            en.push(cH, this.$$store.user[name], cb);
          } else if(eo === bx){

            en.push(cH, this.$$store.theme[name], cb);
          } else if(eo === cS){

            en.push(cH, this.$$store.init[name], f);
          };;;
        };
        en.push(cq);
        if(eo === e || eo === bM || eo === bx || eo === cx){

          en.push(w);
          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(eo === e){

            en.push(cH, this.$$store.user[name], cb);
          } else if(eo === bx){

            en.push(cH, this.$$store.theme[name], cb);
          } else if(eo === cx){

            if(em){

              en.push(cH, this.$$store.init[name], cb);
            } else {

              en.push(cH, this.$$store.init[name], f);
            };
            en.push(br, this.$$store.useinit[name], E);
          };;;
          en.push(cq);
        };
      },
      __B : function(eq, ep, name, er){

        eq.push(bE);
        if(er === cS){

          eq.push(bu);
        } else {

          eq.push(ci, this.$$store.inherit[name], f);
        };
        eq.push(cB);
        eq.push(br, this.$$store.init[name], cm);
        eq.push(br, this.$$store.init[name], b);
        eq.push(cH, this.$$store.init[name], f);
        eq.push(br, this.$$store.useinit[name], E);
        eq.push(bv);
        eq.push(R, this.$$store.useinit[name], by);
        eq.push(cq);
        eq.push(cf);
        eq.push(G);
        eq.push(bp, this.$$store.inherit[name], f);
        eq.push(cq);
        eq.push(Q);
        eq.push(R, this.$$store.inherit[name], f);
        eq.push(bf, this.$$store.inherit[name], A);
        eq.push(co);
        if(ep.init !== undefined && er !== cx){

          eq.push(F, this.$$store.init[name], bF);
        } else {

          eq.push(ch);
        };
        eq.push(cY);
      },
      __C : function(et, es, name, eu){

        if(eu !== e && eu !== bM && eu !== bx){

          et.push(cv);
        };
        et.push(cf);
        if(es.init !== undefined && eu !== cx){

          et.push(F, this.$$store.init[name], bF);
        } else {

          et.push(ch);
        };
      },
      __D : function(ew, ev, name, ex){

        if(ev.apply){

          ew.push(br, ev.apply, bL, name, O, ex, ce);
        };
        if(ev.event){

          ew.push(bY, bQ, ev.event, bb, cC, ev.event, bm, bJ);
        };
      },
      __E : function(ey, name){

        ey.push(r);
        ey.push(cP, this.$$method.refresh[name], bS, this.$$method.refresh[name], C);
        ey.push(cq);
      }
    }
  });
})();
(function(){

  var a = "qx.data.MBinding";
  qx.Mixin.define(a, {
    construct : function(){

      this.__F = this.toHashCode();
    },
    members : {
      __F : null,
      bind : function(b, e, c, d){

        return qx.data.SingleValueBinding.bind(this, b, e, c, d);
      },
      removeBinding : function(f){

        qx.data.SingleValueBinding.removeBindingFromObject(this, f);
      },
      removeRelatedBindings : function(g){

        qx.data.SingleValueBinding.removeRelatedBindings(this, g);
      },
      removeAllBindings : function(){

        qx.data.SingleValueBinding.removeAllBindingsForObject(this);
      },
      getBindings : function(){

        return qx.data.SingleValueBinding.getAllBindingsForObject(this);
      }
    },
    destruct : function(){

      this.$$hash = this.__F;
      this.removeAllBindings();
      delete this.$$hash;
    }
  });
})();
(function(){

  var a = "qx.core.Aspect",b = "before",c = "*",d = "static";
  qx.Bootstrap.define(a, {
    statics : {
      __G : [],
      wrap : function(h, l, j){

        var m = [];
        var e = [];
        var k = this.__G;
        var g;
        for(var i = 0;i < k.length;i++){

          g = k[i];
          if((g.type == null || j == g.type || g.type == c) && (g.name == null || h.match(g.name))){

            g.pos == -1 ? m.push(g.fcn) : e.push(g.fcn);
          };
        };
        if(m.length === 0 && e.length === 0){

          return l;
        };
        var f = function(){

          for(var i = 0;i < m.length;i++){

            m[i].call(this, h, l, j, arguments);
          };
          var n = l.apply(this, arguments);
          for(var i = 0;i < e.length;i++){

            e[i].call(this, h, l, j, arguments, n);
          };
          return n;
        };
        if(j !== d){

          f.self = l.self;
          f.base = l.base;
        };
        l.wrapper = f;
        f.original = l;
        return f;
      },
      addAdvice : function(q, o, p, name){

        this.__G.push({
          fcn : q,
          pos : o === b ? -1 : 1,
          type : p,
          name : name
        });
      }
    }
  });
})();
(function(){

  var a = 'Implementation of method "',b = '"',c = "function",d = '" is not supported by Class "',e = "Boolean",f = "qx.Interface",g = 'The event "',h = '" required by interface "',j = '" is missing in class "',k = '"!',m = 'The property "',n = "Interface",o = "toggle",p = "]",q = "[Interface ",r = "is",s = "Array",t = 'Implementation of member "';
  qx.Bootstrap.define(f, {
    statics : {
      define : function(name, v){

        if(v){

          if(v.extend && !(qx.Bootstrap.getClass(v.extend) === s)){

            v.extend = [v.extend];
          };
          {
          };
          var u = v.statics ? v.statics : {
          };
          if(v.extend){

            u.$$extends = v.extend;
          };
          if(v.properties){

            u.$$properties = v.properties;
          };
          if(v.members){

            u.$$members = v.members;
          };
          if(v.events){

            u.$$events = v.events;
          };
        } else {

          var u = {
          };
        };
        u.$$type = n;
        u.name = name;
        u.toString = this.genericToString;
        u.basename = qx.Bootstrap.createNamespace(name, u);
        qx.Interface.$$registry[name] = u;
        return u;
      },
      getByName : function(name){

        return this.$$registry[name];
      },
      isDefined : function(name){

        return this.getByName(name) !== undefined;
      },
      getTotalNumber : function(){

        return qx.Bootstrap.objectGetLength(this.$$registry);
      },
      flatten : function(x){

        if(!x){

          return [];
        };
        var w = x.concat();
        for(var i = 0,l = x.length;i < l;i++){

          if(x[i].$$extends){

            w.push.apply(w, this.flatten(x[i].$$extends));
          };
        };
        return w;
      },
      __H : function(B, C, y, F, D){

        var z = y.$$members;
        if(z){

          for(var E in z){

            if(qx.Bootstrap.isFunction(z[E])){

              var H = this.__I(C, E);
              var A = H || qx.Bootstrap.isFunction(B[E]);
              if(!A){

                if(D){

                  throw new Error(a + E + j + C.classname + h + y.name + b);
                } else {

                  return false;
                };
              };
              var G = F === true && !H && !qx.util.OOUtil.hasInterface(C, y);
              if(G){

                B[E] = this.__L(y, B[E], E, z[E]);
              };
            } else {

              if(typeof B[E] === undefined){

                if(typeof B[E] !== c){

                  if(D){

                    throw new Error(t + E + j + C.classname + h + y.name + b);
                  } else {

                    return false;
                  };
                };
              };
            };
          };
        };
        if(!D){

          return true;
        };
      },
      __I : function(L, I){

        var N = I.match(/^(is|toggle|get|set|reset)(.*)$/);
        if(!N){

          return false;
        };
        var K = qx.Bootstrap.firstLow(N[2]);
        var M = qx.util.OOUtil.getPropertyDefinition(L, K);
        if(!M){

          return false;
        };
        var J = N[0] == r || N[0] == o;
        if(J){

          return qx.util.OOUtil.getPropertyDefinition(L, K).check == e;
        };
        return true;
      },
      __J : function(R, O, P){

        if(O.$$properties){

          for(var Q in O.$$properties){

            if(!qx.util.OOUtil.getPropertyDefinition(R, Q)){

              if(P){

                throw new Error(m + Q + d + R.classname + k);
              } else {

                return false;
              };
            };
          };
        };
        if(!P){

          return true;
        };
      },
      __K : function(V, S, T){

        if(S.$$events){

          for(var U in S.$$events){

            if(!qx.util.OOUtil.supportsEvent(V, U)){

              if(T){

                throw new Error(g + U + d + V.classname + k);
              } else {

                return false;
              };
            };
          };
        };
        if(!T){

          return true;
        };
      },
      assertObject : function(Y, W){

        var ba = Y.constructor;
        this.__H(Y, ba, W, false, true);
        this.__J(ba, W, true);
        this.__K(ba, W, true);
        var X = W.$$extends;
        if(X){

          for(var i = 0,l = X.length;i < l;i++){

            this.assertObject(Y, X[i]);
          };
        };
      },
      assert : function(bd, bb, be){

        this.__H(bd.prototype, bd, bb, be, true);
        this.__J(bd, bb, true);
        this.__K(bd, bb, true);
        var bc = bb.$$extends;
        if(bc){

          for(var i = 0,l = bc.length;i < l;i++){

            this.assert(bd, bc[i], be);
          };
        };
      },
      objectImplements : function(bh, bf){

        var bi = bh.constructor;
        if(!this.__H(bh, bi, bf) || !this.__J(bi, bf) || !this.__K(bi, bf)){

          return false;
        };
        var bg = bf.$$extends;
        if(bg){

          for(var i = 0,l = bg.length;i < l;i++){

            if(!this.objectImplements(bh, bg[i])){

              return false;
            };
          };
        };
        return true;
      },
      classImplements : function(bl, bj){

        if(!this.__H(bl.prototype, bl, bj) || !this.__J(bl, bj) || !this.__K(bl, bj)){

          return false;
        };
        var bk = bj.$$extends;
        if(bk){

          for(var i = 0,l = bk.length;i < l;i++){

            if(!this.has(bl, bk[i])){

              return false;
            };
          };
        };
        return true;
      },
      genericToString : function(){

        return q + this.name + p;
      },
      $$registry : {
      },
      __L : function(bo, bn, bp, bm){
      },
      __h : null,
      __i : function(name, bq){
      }
    }
  });
})();
(function(){

  var b = ".prototype",c = "$$init_",d = "constructor",e = "Property module disabled.",f = "extend",g = "module.property",h = "singleton",j = "qx.event.type.Data",k = "module.events",m = "qx.aspects",n = "toString",o = 'extend',p = "Array",q = "static",r = "",s = "Events module not enabled.",t = "qx.strict",u = "]",v = "Class",w = "qx.Class",x = '"extend" parameter is null or undefined',y = "[Class ",z = "destructor",A = "destruct",B = ".",C = "member";
  qx.Bootstrap.define(w, {
    statics : {
      __M : qx.core.Environment.get(g) ? qx.core.Property : null,
      define : function(name, G){

        if(!G){

          G = {
          };
        };
        if(G.include && !(qx.Bootstrap.getClass(G.include) === p)){

          G.include = [G.include];
        };
        if(G.implement && !(qx.Bootstrap.getClass(G.implement) === p)){

          G.implement = [G.implement];
        };
        var D = false;
        if(!G.hasOwnProperty(f) && !G.type){

          G.type = q;
          D = true;
        };
        {
        };
        var E = this.__P(name, G.type, G.extend, G.statics, G.construct, G.destruct, G.include);
        if(G.extend){

          if(G.properties){

            this.__R(E, G.properties, true);
          };
          if(G.members){

            this.__T(E, G.members, true, true, false);
          };
          if(G.events){

            this.__Q(E, G.events, true);
          };
          if(G.include){

            for(var i = 0,l = G.include.length;i < l;i++){

              this.__X(E, G.include[i], false);
            };
          };
        } else if(G.hasOwnProperty(o) && false){

          throw new Error(x);
        };
        if(G.environment){

          for(var F in G.environment){

            qx.core.Environment.add(F, G.environment[F]);
          };
        };
        if(G.implement){

          for(var i = 0,l = G.implement.length;i < l;i++){

            this.__V(E, G.implement[i]);
          };
        };
        {
        };
        if(G.defer){

          G.defer.self = E;
          G.defer(E, E.prototype, {
            add : function(name, H){

              var I = {
              };
              I[name] = H;
              qx.Class.__R(E, I, true);
            }
          });
        };
        return E;
      },
      undefine : function(name){

        delete this.$$registry[name];
        var L = name.split(B);
        var K = [window];
        for(var i = 0;i < L.length;i++){

          K.push(K[i][L[i]]);
        };
        for(var i = K.length - 1;i >= 1;i--){

          var J = K[i];
          var parent = K[i - 1];
          if(qx.Bootstrap.isFunction(J) || qx.Bootstrap.objectGetLength(J) === 0){

            delete parent[L[i - 1]];
          } else {

            break;
          };
        };
      },
      isDefined : qx.util.OOUtil.classIsDefined,
      getTotalNumber : function(){

        return qx.Bootstrap.objectGetLength(this.$$registry);
      },
      getByName : qx.Bootstrap.getByName,
      include : function(N, M){

        {
        };
        qx.Class.__X(N, M, false);
      },
      patch : function(P, O){

        {
        };
        qx.Class.__X(P, O, true);
      },
      isSubClassOf : function(R, Q){

        if(!R){

          return false;
        };
        if(R == Q){

          return true;
        };
        if(R.prototype instanceof Q){

          return true;
        };
        return false;
      },
      getPropertyDefinition : qx.util.OOUtil.getPropertyDefinition,
      getProperties : function(T){

        var S = [];
        while(T){

          if(T.$$properties){

            S.push.apply(S, Object.keys(T.$$properties));
          };
          T = T.superclass;
        };
        return S;
      },
      getByProperty : function(U, name){

        while(U){

          if(U.$$properties && U.$$properties[name]){

            return U;
          };
          U = U.superclass;
        };
        return null;
      },
      hasProperty : qx.util.OOUtil.hasProperty,
      getEventType : qx.util.OOUtil.getEventType,
      supportsEvent : qx.util.OOUtil.supportsEvent,
      hasOwnMixin : function(W, V){

        return W.$$includes && W.$$includes.indexOf(V) !== -1;
      },
      getByMixin : function(ba, Y){

        var X,i,l;
        while(ba){

          if(ba.$$includes){

            X = ba.$$flatIncludes;
            for(i = 0,l = X.length;i < l;i++){

              if(X[i] === Y){

                return ba;
              };
            };
          };
          ba = ba.superclass;
        };
        return null;
      },
      getMixins : qx.util.OOUtil.getMixins,
      hasMixin : function(bc, bb){

        return !!this.getByMixin(bc, bb);
      },
      hasOwnInterface : function(be, bd){

        return be.$$implements && be.$$implements.indexOf(bd) !== -1;
      },
      getByInterface : qx.util.OOUtil.getByInterface,
      getInterfaces : function(bg){

        var bf = [];
        while(bg){

          if(bg.$$implements){

            bf.push.apply(bf, bg.$$flatImplements);
          };
          bg = bg.superclass;
        };
        return bf;
      },
      hasInterface : qx.util.OOUtil.hasInterface,
      implementsInterface : function(bi, bh){

        var bj = bi.constructor;
        if(this.hasInterface(bj, bh)){

          return true;
        };
        if(qx.Interface.objectImplements(bi, bh)){

          return true;
        };
        if(qx.Interface.classImplements(bj, bh)){

          return true;
        };
        return false;
      },
      getInstance : function(){

        if(!this.$$instance){

          this.$$allowconstruct = true;
          this.$$instance = new this();
          delete this.$$allowconstruct;
        };
        return this.$$instance;
      },
      genericToString : function(){

        return y + this.classname + u;
      },
      $$registry : qx.Bootstrap.$$registry,
      __h : null,
      __N : null,
      __i : function(name, bk){
      },
      __O : function(bl){
      },
      __P : function(name, bv, bu, bm, bs, bq, bp){

        var br;
        if(!bu && qx.core.Environment.get(m) == false){

          br = bm || {
          };
          qx.Bootstrap.setDisplayNames(br, name);
        } else {

          br = {
          };
          if(bu){

            if(!bs){

              bs = this.__Y();
            };
            if(this.__ba(bu, bp)){

              br = this.__bb(bs, name, bv);
            } else {

              br = bs;
            };
            if(bv === h){

              br.getInstance = this.getInstance;
            };
            qx.Bootstrap.setDisplayName(bs, name, d);
          };
          if(bm){

            qx.Bootstrap.setDisplayNames(bm, name);
            var bt;
            for(var i = 0,a = Object.keys(bm),l = a.length;i < l;i++){

              bt = a[i];
              var bn = bm[bt];
              if(qx.core.Environment.get(m)){

                if(bn instanceof Function){

                  bn = qx.core.Aspect.wrap(name + B + bt, bn, q);
                };
                br[bt] = bn;
              } else {

                br[bt] = bn;
              };
            };
          };
        };
        var bo = name ? qx.Bootstrap.createNamespace(name, br) : r;
        if(qx.core.Environment.get(t)){

          br.classname = name;
        } else {

          br.name = br.classname = name;
        };
        br.basename = bo;
        br.$$type = v;
        if(bv){

          br.$$classtype = bv;
        };
        if(!br.hasOwnProperty(n)){

          br.toString = this.genericToString;
        };
        if(bu){

          qx.Bootstrap.extendClass(br, bs, bu, name, bo);
          if(bq){

            if(qx.core.Environment.get(m)){

              bq = qx.core.Aspect.wrap(name, bq, z);
            };
            br.$$destructor = bq;
            qx.Bootstrap.setDisplayName(bq, name, A);
          };
        };
        this.$$registry[name] = br;
        return br;
      },
      __Q : function(bw, bx, bz){

        {

          var by,by;
        };
        if(bw.$$events){

          for(var by in bx){

            bw.$$events[by] = bx[by];
          };
        } else {

          bw.$$events = bx;
        };
      },
      __R : function(bB, bE, bC){

        if(!qx.core.Environment.get(g)){

          throw new Error(e);
        };
        var bD;
        if(bC === undefined){

          bC = false;
        };
        var bA = bB.prototype;
        for(var name in bE){

          bD = bE[name];
          {
          };
          bD.name = name;
          if(!bD.refine){

            if(bB.$$properties === undefined){

              bB.$$properties = {
              };
            };
            bB.$$properties[name] = bD;
          };
          if(bD.init !== undefined){

            bB.prototype[c + name] = bD.init;
          };
          if(bD.event !== undefined){

            if(!qx.core.Environment.get(k)){

              throw new Error(s);
            };
            var event = {
            };
            event[bD.event] = j;
            this.__Q(bB, event, bC);
          };
          if(bD.inheritable){

            this.__M.$$inheritable[name] = true;
            if(!bA.$$refreshInheritables){

              this.__M.attachRefreshInheritables(bB);
            };
          };
          if(!bD.refine){

            this.__M.attachMethods(bB, name, bD);
          };
        };
      },
      __S : null,
      __T : function(bM, bF, bH, bJ, bL){

        var bG = bM.prototype;
        var bK,bI;
        qx.Bootstrap.setDisplayNames(bF, bM.classname + b);
        for(var i = 0,a = Object.keys(bF),l = a.length;i < l;i++){

          bK = a[i];
          bI = bF[bK];
          {
          };
          if(bJ !== false && bI instanceof Function && bI.$$type == null){

            if(bL == true){

              bI = this.__U(bI, bG[bK]);
            } else {

              if(bG[bK]){

                bI.base = bG[bK];
              };
              bI.self = bM;
            };
            if(qx.core.Environment.get(m)){

              bI = qx.core.Aspect.wrap(bM.classname + B + bK, bI, C);
            };
          };
          bG[bK] = bI;
        };
      },
      __U : function(bN, bO){

        if(bO){

          return function(){

            var bQ = bN.base;
            bN.base = bO;
            var bP = bN.apply(this, arguments);
            bN.base = bQ;
            return bP;
          };
        } else {

          return bN;
        };
      },
      __V : function(bT, bR){

        {
        };
        var bS = qx.Interface.flatten([bR]);
        if(bT.$$implements){

          bT.$$implements.push(bR);
          bT.$$flatImplements.push.apply(bT.$$flatImplements, bS);
        } else {

          bT.$$implements = [bR];
          bT.$$flatImplements = bS;
        };
      },
      __W : function(bV){

        var name = bV.classname;
        var bU = this.__bb(bV, name, bV.$$classtype);
        for(var i = 0,a = Object.keys(bV),l = a.length;i < l;i++){

          bW = a[i];
          bU[bW] = bV[bW];
        };
        bU.prototype = bV.prototype;
        var bY = bV.prototype;
        for(var i = 0,a = Object.keys(bY),l = a.length;i < l;i++){

          bW = a[i];
          var ca = bY[bW];
          if(ca && ca.self == bV){

            ca.self = bU;
          };
        };
        for(var bW in this.$$registry){

          var bX = this.$$registry[bW];
          if(!bX){

            continue;
          };
          if(bX.base == bV){

            bX.base = bU;
          };
          if(bX.superclass == bV){

            bX.superclass = bU;
          };
          if(bX.$$original){

            if(bX.$$original.base == bV){

              bX.$$original.base = bU;
            };
            if(bX.$$original.superclass == bV){

              bX.$$original.superclass = bU;
            };
          };
        };
        qx.Bootstrap.createNamespace(name, bU);
        this.$$registry[name] = bU;
        return bU;
      },
      __X : function(cg, ce, cd){

        {
        };
        if(this.hasMixin(cg, ce)){

          return;
        };
        var cb = cg.$$original;
        if(ce.$$constructor && !cb){

          cg = this.__W(cg);
        };
        var cc = qx.Mixin.flatten([ce]);
        var cf;
        for(var i = 0,l = cc.length;i < l;i++){

          cf = cc[i];
          if(cf.$$events){

            this.__Q(cg, cf.$$events, cd);
          };
          if(cf.$$properties){

            this.__R(cg, cf.$$properties, cd);
          };
          if(cf.$$members){

            this.__T(cg, cf.$$members, cd, cd, cd);
          };
        };
        if(cg.$$includes){

          cg.$$includes.push(ce);
          cg.$$flatIncludes.push.apply(cg.$$flatIncludes, cc);
        } else {

          cg.$$includes = [ce];
          cg.$$flatIncludes = cc;
        };
      },
      __Y : function(){

        function ch(){

          ch.base.apply(this, arguments);
        };
        return ch;
      },
      __ba : function(cj, ci){

        {
        };
        if(cj && cj.$$includes){

          var ck = cj.$$flatIncludes;
          for(var i = 0,l = ck.length;i < l;i++){

            if(ck[i].$$constructor){

              return true;
            };
          };
        };
        if(ci){

          var cl = qx.Mixin.flatten(ci);
          for(var i = 0,l = cl.length;i < l;i++){

            if(cl[i].$$constructor){

              return true;
            };
          };
        };
        return false;
      },
      __bb : function(cn, name, cm){

        var cp = function(){

          var cs = cp;
          {
          };
          var cq = cs.$$original.apply(this, arguments);
          if(cs.$$includes){

            var cr = cs.$$flatIncludes;
            for(var i = 0,l = cr.length;i < l;i++){

              if(cr[i].$$constructor){

                cr[i].$$constructor.apply(this, arguments);
              };
            };
          };
          {
          };
          return cq;
        };
        if(qx.core.Environment.get(m)){

          var co = qx.core.Aspect.wrap(name, cp, d);
          cp.$$original = cn;
          cp.constructor = co;
          cp = co;
        };
        cp.$$original = cn;
        cn.wrapper = cp;
        return cp;
      }
    },
    defer : function(){

      if(qx.core.Environment.get(m)){

        for(var ct in qx.Bootstrap.$$registry){

          var cu = qx.Bootstrap.$$registry[ct];
          for(var cv in cu){

            if(cu[cv] instanceof Function){

              cu[cv] = qx.core.Aspect.wrap(ct + B + cv, cu[cv], q);
            };
          };
        };
      };
    }
  });
})();
(function(){

  var a = ". Error message: ",b = "Boolean",c = ").",d = "set",f = "deepBinding",g = ") to the object '",h = "item",k = "Please use only one array at a time: ",l = "Integer",m = "reset",n = " of object ",p = "qx.data.SingleValueBinding",q = "Binding property ",r = "Failed so set value ",s = "change",t = "Binding could not be found!",u = "get",v = "^",w = " does not work.",x = "String",y = "Binding from '",z = "",A = "PositiveNumber",B = "]",C = "[",D = ".",E = "PositiveInteger",F = 'No number or \'last\' value hast been given in an array binding: ',G = "' (",H = " on ",I = "Binding does not exist!",J = "Number",K = ".[",L = "Date",M = " not possible: No event available. ",N = "last";
  qx.Class.define(p, {
    statics : {
      __bc : {
      },
      __bd : {
      },
      bind : function(R, bf, bd, T, bc){

        {
        };
        var bg = this.__bf(R, bf, bd, T, bc);
        var V = bf.split(D);
        var Q = this.__bn(V);
        var ba = [];
        var U = [];
        var W = [];
        var bb = [];
        var S = R;
        try{

          for(var i = 0;i < V.length;i++){

            if(Q[i] !== z){

              bb.push(s);
            } else {

              bb.push(this.__bg(S, V[i]));
            };
            ba[i] = S;
            if(i == V.length - 1){

              if(Q[i] !== z){

                var bi = Q[i] === N ? S.length - 1 : Q[i];
                var P = S.getItem(bi);
                this.__bm(P, bd, T, bc, R);
                W[i] = this.__bo(S, bb[i], bd, T, bc, Q[i]);
              } else {

                if(V[i] != null && S[u + qx.lang.String.firstUp(V[i])] != null){

                  var P = S[u + qx.lang.String.firstUp(V[i])]();
                  this.__bm(P, bd, T, bc, R);
                };
                W[i] = this.__bo(S, bb[i], bd, T, bc);
              };
            } else {

              var O = {
                index : i,
                propertyNames : V,
                sources : ba,
                listenerIds : W,
                arrayIndexValues : Q,
                targetObject : bd,
                targetPropertyChain : T,
                options : bc,
                listeners : U
              };
              var Y = qx.lang.Function.bind(this.__be, this, O);
              U.push(Y);
              W[i] = S.addListener(bb[i], Y);
            };
            if(S[u + qx.lang.String.firstUp(V[i])] == null){

              S = undefined;
            } else if(Q[i] !== z){

              var bi = Q[i] === N ? S.length - 1 : Q[i];
              S = S[u + qx.lang.String.firstUp(V[i])](bi);
            } else {

              S = S[u + qx.lang.String.firstUp(V[i])]();
              if(S === null && (V.length - 1) != i){

                S = undefined;
              };
            };
            if(!S){

              this.__bm(S, bd, T, bc, R);
              break;
            };
          };
        } catch(bj) {

          for(var i = 0;i < ba.length;i++){

            if(ba[i] && W[i]){

              ba[i].removeListenerById(W[i]);
            };
          };
          var X = bg.targets;
          var be = bg.listenerIds;
          for(var i = 0;i < X.length;i++){

            if(X[i] && be[i]){

              X[i].removeListenerById(be[i]);
            };
          };
          throw bj;
        };
        var bh = {
          type : f,
          listenerIds : W,
          sources : ba,
          targetListenerIds : bg.listenerIds,
          targets : bg.targets
        };
        this.__bp(bh, R, bf, bd, T);
        return bh;
      },
      __be : function(bq){

        if(bq.options && bq.options.onUpdate){

          bq.options.onUpdate(bq.sources[bq.index], bq.targetObject);
        };
        for(var j = bq.index + 1;j < bq.propertyNames.length;j++){

          var bo = bq.sources[j];
          bq.sources[j] = null;
          if(!bo){

            continue;
          };
          bo.removeListenerById(bq.listenerIds[j]);
        };
        var bo = bq.sources[bq.index];
        for(var j = bq.index + 1;j < bq.propertyNames.length;j++){

          if(bq.arrayIndexValues[j - 1] !== z){

            bo = bo[u + qx.lang.String.firstUp(bq.propertyNames[j - 1])](bq.arrayIndexValues[j - 1]);
          } else {

            bo = bo[u + qx.lang.String.firstUp(bq.propertyNames[j - 1])]();
          };
          bq.sources[j] = bo;
          if(!bo){

            if(bq.options && bq.options.converter){

              var bk = false;
              if(bq.options.ignoreConverter){

                var br = bq.propertyNames.slice(0, j).join(D);
                var bp = br.match(new RegExp(v + bq.options.ignoreConverter));
                bk = bp ? bp.length > 0 : false;
              };
              if(!bk){

                this.__bi(bq.targetObject, bq.targetPropertyChain, bq.options.converter());
              } else {

                this.__bh(bq.targetObject, bq.targetPropertyChain);
              };
            } else {

              this.__bh(bq.targetObject, bq.targetPropertyChain);
            };
            break;
          };
          if(j == bq.propertyNames.length - 1){

            if(qx.Class.implementsInterface(bo, qx.data.IListData)){

              var bs = bq.arrayIndexValues[j] === N ? bo.length - 1 : bq.arrayIndexValues[j];
              var bl = bo.getItem(bs);
              this.__bm(bl, bq.targetObject, bq.targetPropertyChain, bq.options, bq.sources[bq.index]);
              bq.listenerIds[j] = this.__bo(bo, s, bq.targetObject, bq.targetPropertyChain, bq.options, bq.arrayIndexValues[j]);
            } else {

              if(bq.propertyNames[j] != null && bo[u + qx.lang.String.firstUp(bq.propertyNames[j])] != null){

                var bl = bo[u + qx.lang.String.firstUp(bq.propertyNames[j])]();
                this.__bm(bl, bq.targetObject, bq.targetPropertyChain, bq.options, bq.sources[bq.index]);
              };
              var bm = this.__bg(bo, bq.propertyNames[j]);
              bq.listenerIds[j] = this.__bo(bo, bm, bq.targetObject, bq.targetPropertyChain, bq.options);
            };
          } else {

            if(bq.listeners[j] == null){

              var bn = qx.lang.Function.bind(this.__be, this, bq);
              bq.listeners.push(bn);
            };
            if(qx.Class.implementsInterface(bo, qx.data.IListData)){

              var bm = s;
            } else {

              var bm = this.__bg(bo, bq.propertyNames[j]);
            };
            bq.listenerIds[j] = bo.addListener(bm, bq.listeners[j]);
          };
        };
      },
      __bf : function(bu, bC, bG, by, bA){

        var bx = by.split(D);
        var bv = this.__bn(bx);
        var bF = [];
        var bE = [];
        var bz = [];
        var bD = [];
        var bw = bG;
        for(var i = 0;i < bx.length - 1;i++){

          if(bv[i] !== z){

            bD.push(s);
          } else {

            try{

              bD.push(this.__bg(bw, bx[i]));
            } catch(e) {

              break;
            };
          };
          bF[i] = bw;
          var bB = function(){

            for(var j = i + 1;j < bx.length - 1;j++){

              var bJ = bF[j];
              bF[j] = null;
              if(!bJ){

                continue;
              };
              bJ.removeListenerById(bz[j]);
            };
            var bJ = bF[i];
            for(var j = i + 1;j < bx.length - 1;j++){

              var bH = qx.lang.String.firstUp(bx[j - 1]);
              if(bv[j - 1] !== z){

                var bK = bv[j - 1] === N ? bJ.getLength() - 1 : bv[j - 1];
                bJ = bJ[u + bH](bK);
              } else {

                bJ = bJ[u + bH]();
              };
              bF[j] = bJ;
              if(bE[j] == null){

                bE.push(bB);
              };
              if(qx.Class.implementsInterface(bJ, qx.data.IListData)){

                var bI = s;
              } else {

                try{

                  var bI = qx.data.SingleValueBinding.__bg(bJ, bx[j]);
                } catch(e) {

                  break;
                };
              };
              bz[j] = bJ.addListener(bI, bE[j]);
            };
            qx.data.SingleValueBinding.updateTarget(bu, bC, bG, by, bA);
          };
          bE.push(bB);
          bz[i] = bw.addListener(bD[i], bB);
          var bt = qx.lang.String.firstUp(bx[i]);
          if(bw[u + bt] == null){

            bw = null;
          } else if(bv[i] !== z){

            bw = bw[u + bt](bv[i]);
          } else {

            bw = bw[u + bt]();
          };
          if(!bw){

            break;
          };
        };
        return {
          listenerIds : bz,
          targets : bF
        };
      },
      updateTarget : function(bL, bO, bQ, bM, bP){

        var bN = this.resolvePropertyChain(bL, bO);
        bN = qx.data.SingleValueBinding.__bq(bN, bQ, bM, bP, bL);
        this.__bi(bQ, bM, bN);
      },
      resolvePropertyChain : function(o, bR){

        var bS = this.__bk(bR);
        return this.__bl(o, bS, bS.length);
      },
      __bg : function(bU, bV){

        var bT = this.__br(bU, bV);
        if(bT == null){

          if(qx.Class.supportsEvent(bU.constructor, bV)){

            bT = bV;
          } else if(qx.Class.supportsEvent(bU.constructor, s + qx.lang.String.firstUp(bV))){

            bT = s + qx.lang.String.firstUp(bV);
          } else {

            throw new qx.core.AssertionError(q + bV + n + bU + M);
          };
        };
        return bT;
      },
      __bh : function(cb, bY){

        var ca = this.__bk(bY);
        var bX = this.__bl(cb, ca);
        if(bX != null){

          var cc = ca[ca.length - 1];
          var bW = this.__bj(cc);
          if(bW){

            this.__bi(cb, bY, null);
            return;
          };
          if(bX[m + qx.lang.String.firstUp(cc)] != undefined){

            bX[m + qx.lang.String.firstUp(cc)]();
          } else {

            bX[d + qx.lang.String.firstUp(cc)](null);
          };
        };
      },
      __bi : function(ci, cf, cg){

        var ch = this.__bk(cf);
        var ce = this.__bl(ci, ch);
        if(ce){

          var cj = ch[ch.length - 1];
          var cd = this.__bj(cj);
          if(cd){

            if(cd === N){

              cd = ce.length - 1;
            };
            ce.setItem(cd, cg);
          } else {

            ce[d + qx.lang.String.firstUp(cj)](cg);
          };
        };
      },
      __bj : function(cm){

        var ck = /^\[(\d+|last)\]$/;
        var cl = cm.match(ck);
        if(cl){

          return cl[1];
        };
        return null;
      },
      __bk : function(cn){

        return cn.replace(/\[/g, K).split(D).filter(function(co){

          return co !== z;
        });
      },
      __bl : function(cu, cp, cq){

        cq = cq || cp.length - 1;
        var cs = cu;
        for(var i = 0;i < cq;i++){

          try{

            var ct = cp[i];
            var cr = this.__bj(ct);
            if(cr){

              if(cr === N){

                cr = cs.length - 1;
              };
              cs = cs.getItem(cr);
            } else {

              cs = cs[u + qx.lang.String.firstUp(ct)]();
            };
          } catch(cv) {

            return null;
          };
        };
        return cs;
      },
      __bm : function(cA, cw, cy, cz, cx){

        cA = this.__bq(cA, cw, cy, cz, cx);
        if(cA === undefined){

          this.__bh(cw, cy);
        };
        if(cA !== undefined){

          try{

            this.__bi(cw, cy, cA);
            if(cz && cz.onUpdate){

              cz.onUpdate(cx, cw, cA);
            };
          } catch(e) {

            if(!(e instanceof qx.core.ValidationError)){

              throw e;
            };
            if(cz && cz.onSetFail){

              cz.onSetFail(e);
            } else {

              qx.log.Logger.warn(r + cA + H + cw + a + e);
            };
          };
        };
      },
      __bn : function(cB){

        var cC = [];
        for(var i = 0;i < cB.length;i++){

          var name = cB[i];
          if(qx.lang.String.endsWith(name, B)){

            var cD = name.substring(name.indexOf(C) + 1, name.indexOf(B));
            if(name.indexOf(B) != name.length - 1){

              throw new Error(k + name + w);
            };
            if(cD !== N){

              if(cD == z || isNaN(parseInt(cD, 10))){

                throw new Error(F + name + w);
              };
            };
            if(name.indexOf(C) != 0){

              cB[i] = name.substring(0, name.indexOf(C));
              cC[i] = z;
              cC[i + 1] = cD;
              cB.splice(i + 1, 0, h);
              i++;
            } else {

              cC[i] = cD;
              cB.splice(i, 1, h);
            };
          } else {

            cC[i] = z;
          };
        };
        return cC;
      },
      __bo : function(cE, cH, cM, cK, cI, cG){

        {

          var cF;
        };
        var cJ = function(cP, e){

          if(cP !== z){

            if(cP === N){

              cP = cE.length - 1;
            };
            var cQ = cE.getItem(cP);
            if(cQ === undefined){

              qx.data.SingleValueBinding.__bh(cM, cK);
            };
            var cO = e.getData().start;
            var cN = e.getData().end;
            if(cP < cO || cP > cN){

              return;
            };
          } else {

            var cQ = e.getData();
          };
          {
          };
          cQ = qx.data.SingleValueBinding.__bq(cQ, cM, cK, cI, cE);
          {
          };
          try{

            if(cQ !== undefined){

              qx.data.SingleValueBinding.__bi(cM, cK, cQ);
            } else {

              qx.data.SingleValueBinding.__bh(cM, cK);
            };
            if(cI && cI.onUpdate){

              cI.onUpdate(cE, cM, cQ);
            };
          } catch(cR) {

            if(!(cR instanceof qx.core.ValidationError)){

              throw cR;
            };
            if(cI && cI.onSetFail){

              cI.onSetFail(cR);
            } else {

              qx.log.Logger.warn(r + cQ + H + cM + a + cR);
            };
          };
        };
        if(!cG){

          cG = z;
        };
        cJ = qx.lang.Function.bind(cJ, cE, cG);
        var cL = cE.addListener(cH, cJ);
        return cL;
      },
      __bp : function(cX, cS, cV, cY, cW){

        var cT;
        cT = cS.toHashCode();
        if(this.__bc[cT] === undefined){

          this.__bc[cT] = [];
        };
        var cU = [cX, cS, cV, cY, cW];
        this.__bc[cT].push(cU);
        cT = cY.toHashCode();
        if(this.__bd[cT] === undefined){

          this.__bd[cT] = [];
        };
        this.__bd[cT].push(cU);
      },
      __bq : function(dd, dj, dc, df, da){

        if(df && df.converter){

          var dg;
          if(dj.getModel){

            dg = dj.getModel();
          };
          return df.converter(dd, dg, da, dj);
        } else {

          var de = this.__bk(dc);
          var db = this.__bl(dj, de);
          var dk = dc.substring(dc.lastIndexOf(D) + 1, dc.length);
          if(db == null){

            return dd;
          };
          var dh = qx.Class.getPropertyDefinition(db.constructor, dk);
          var di = dh == null ? z : dh.check;
          return this.__bs(dd, di);
        };
      },
      __br : function(dl, dn){

        var dm = qx.Class.getPropertyDefinition(dl.constructor, dn);
        if(dm == null){

          return null;
        };
        return dm.event;
      },
      __bs : function(dr, dq){

        var dp = qx.lang.Type.getClass(dr);
        if((dp == J || dp == x) && (dq == l || dq == E)){

          dr = parseInt(dr, 10);
        };
        if((dp == b || dp == J || dp == L) && dq == x){

          dr = dr + z;
        };
        if((dp == J || dp == x) && (dq == J || dq == A)){

          dr = parseFloat(dr);
        };
        return dr;
      },
      removeBindingFromObject : function(ds, dw){

        if(dw.type == f){

          for(var i = 0;i < dw.sources.length;i++){

            if(dw.sources[i]){

              dw.sources[i].removeListenerById(dw.listenerIds[i]);
            };
          };
          for(var i = 0;i < dw.targets.length;i++){

            if(dw.targets[i]){

              dw.targets[i].removeListenerById(dw.targetListenerIds[i]);
            };
          };
        } else {

          ds.removeListenerById(dw);
        };
        var dv = this.getAllBindingsForObject(ds);
        if(dv != undefined){

          for(var i = 0;i < dv.length;i++){

            if(dv[i][0] == dw){

              var dt = dv[i][3];
              if(this.__bd[dt.toHashCode()]){

                qx.lang.Array.remove(this.__bd[dt.toHashCode()], dv[i]);
              };
              var du = dv[i][1];
              if(this.__bc[du.toHashCode()]){

                qx.lang.Array.remove(this.__bc[du.toHashCode()], dv[i]);
              };
              return;
            };
          };
        };
        throw new Error(t);
      },
      removeAllBindingsForObject : function(dy){

        {
        };
        var dx = this.getAllBindingsForObject(dy);
        if(dx != undefined){

          for(var i = dx.length - 1;i >= 0;i--){

            this.removeBindingFromObject(dy, dx[i][0]);
          };
        };
      },
      removeRelatedBindings : function(dA, dB){

        {
        };
        var dD = this.getAllBindingsForObject(dA);
        if(dD != undefined){

          for(var i = dD.length - 1;i >= 0;i--){

            var dC = dD[i][1];
            var dz = dD[i][3];
            if(dC === dB || dz === dB){

              this.removeBindingFromObject(dA, dD[i][0]);
            };
          };
        };
      },
      getAllBindingsForObject : function(dF){

        var dG = dF.toHashCode();
        if(this.__bc[dG] === undefined){

          this.__bc[dG] = [];
        };
        var dH = this.__bc[dG];
        var dE = this.__bd[dG] ? this.__bd[dG] : [];
        return qx.lang.Array.unique(dH.concat(dE));
      },
      removeAllBindings : function(){

        for(var dJ in this.__bc){

          var dI = qx.core.ObjectRegistry.fromHashCode(dJ);
          if(dI == null){

            delete this.__bc[dJ];
            continue;
          };
          this.removeAllBindingsForObject(dI);
        };
        this.__bc = {
        };
      },
      getAllBindings : function(){

        return this.__bc;
      },
      showBindingInLog : function(dL, dN){

        var dM;
        for(var i = 0;i < this.__bc[dL.toHashCode()].length;i++){

          if(this.__bc[dL.toHashCode()][i][0] == dN){

            dM = this.__bc[dL.toHashCode()][i];
            break;
          };
        };
        if(dM === undefined){

          var dK = I;
        } else {

          var dK = y + dM[1] + G + dM[2] + g + dM[3] + G + dM[4] + c;
        };
        qx.log.Logger.debug(dK);
      },
      showAllBindingsInLog : function(){

        for(var dP in this.__bc){

          var dO = qx.core.ObjectRegistry.fromHashCode(dP);
          for(var i = 0;i < this.__bc[dP].length;i++){

            this.showBindingInLog(dO, this.__bc[dP][i][0]);
          };
        };
      }
    }
  });
})();
(function(){

  var a = "qx.util.RingBuffer";
  qx.Bootstrap.define(a, {
    extend : Object,
    construct : function(b){

      this.setMaxEntries(b || 50);
    },
    members : {
      __bt : 0,
      __bu : 0,
      __bv : false,
      __bw : 0,
      __bx : null,
      __by : null,
      setMaxEntries : function(c){

        this.__by = c;
        this.clear();
      },
      getMaxEntries : function(){

        return this.__by;
      },
      addEntry : function(d){

        this.__bx[this.__bt] = d;
        this.__bt = this.__bz(this.__bt, 1);
        var e = this.getMaxEntries();
        if(this.__bu < e){

          this.__bu++;
        };
        if(this.__bv && (this.__bw < e)){

          this.__bw++;
        };
      },
      mark : function(){

        this.__bv = true;
        this.__bw = 0;
      },
      clearMark : function(){

        this.__bv = false;
      },
      getAllEntries : function(){

        return this.getEntries(this.getMaxEntries(), false);
      },
      getEntries : function(f, j){

        if(f > this.__bu){

          f = this.__bu;
        };
        if(j && this.__bv && (f > this.__bw)){

          f = this.__bw;
        };
        if(f > 0){

          var h = this.__bz(this.__bt, -1);
          var g = this.__bz(h, -f + 1);
          var i;
          if(g <= h){

            i = this.__bx.slice(g, h + 1);
          } else {

            i = this.__bx.slice(g, this.__bu).concat(this.__bx.slice(0, h + 1));
          };
        } else {

          i = [];
        };
        return i;
      },
      clear : function(){

        this.__bx = new Array(this.getMaxEntries());
        this.__bu = 0;
        this.__bw = 0;
        this.__bt = 0;
      },
      __bz : function(n, l){

        var k = this.getMaxEntries();
        var m = (n + l) % k;
        if(m < 0){

          m += k;
        };
        return m;
      }
    }
  });
})();
(function(){

  var a = "qx.log.appender.RingBuffer";
  qx.Bootstrap.define(a, {
    extend : qx.util.RingBuffer,
    construct : function(b){

      this.setMaxMessages(b || 50);
    },
    members : {
      setMaxMessages : function(c){

        this.setMaxEntries(c);
      },
      getMaxMessages : function(){

        return this.getMaxEntries();
      },
      process : function(d){

        this.addEntry(d);
      },
      getAllLogEvents : function(){

        return this.getAllEntries();
      },
      retrieveLogEvents : function(e, f){

        return this.getEntries(e, f);
      },
      clearHistory : function(){

        this.clear();
      }
    }
  });
})();
(function(){

  var a = "qx.lang.Type",b = "Error",c = "RegExp",d = "Date",e = "Number",f = "Boolean";
  qx.Bootstrap.define(a, {
    statics : {
      getClass : qx.Bootstrap.getClass,
      isString : qx.Bootstrap.isString,
      isArray : qx.Bootstrap.isArray,
      isObject : qx.Bootstrap.isObject,
      isFunction : qx.Bootstrap.isFunction,
      isRegExp : function(g){

        return this.getClass(g) == c;
      },
      isNumber : function(h){

        return (h !== null && (this.getClass(h) == e || h instanceof Number));
      },
      isBoolean : function(i){

        return (i !== null && (this.getClass(i) == f || i instanceof Boolean));
      },
      isDate : function(j){

        return (j !== null && (this.getClass(j) == d || j instanceof Date));
      },
      isError : function(k){

        return (k !== null && (this.getClass(k) == b || k instanceof Error));
      }
    }
  });
})();
(function(){

  var a = "mshtml",b = "engine.name",c = "[object Array]",d = "qx.lang.Array",e = "Cannot clean-up map entry doneObjects[",f = "]",g = "qx",h = "number",j = "][",k = "string";
  qx.Bootstrap.define(d, {
    statics : {
      cast : function(m, o, p){

        if(m.constructor === o){

          return m;
        };
        if(qx.data && qx.data.IListData){

          if(qx.Class && qx.Class.hasInterface(m, qx.data.IListData)){

            var m = m.toArray();
          };
        };
        var n = new o;
        if((qx.core.Environment.get(b) == a)){

          if(m.item){

            for(var i = p || 0,l = m.length;i < l;i++){

              n.push(m[i]);
            };
            return n;
          };
        };
        if(Object.prototype.toString.call(m) === c && p == null){

          n.push.apply(n, m);
        } else {

          n.push.apply(n, Array.prototype.slice.call(m, p || 0));
        };
        return n;
      },
      fromArguments : function(q, r){

        return Array.prototype.slice.call(q, r || 0);
      },
      fromCollection : function(t){

        if((qx.core.Environment.get(b) == a)){

          if(t.item){

            var s = [];
            for(var i = 0,l = t.length;i < l;i++){

              s[i] = t[i];
            };
            return s;
          };
        };
        return Array.prototype.slice.call(t, 0);
      },
      fromShortHand : function(u){

        var w = u.length;
        var v = qx.lang.Array.clone(u);
        switch(w){case 1:
        v[1] = v[2] = v[3] = v[0];
        break;case 2:
        v[2] = v[0];case 3:
        v[3] = v[1];};
        return v;
      },
      clone : function(x){

        return x.concat();
      },
      insertAt : function(y, z, i){

        y.splice(i, 0, z);
        return y;
      },
      insertBefore : function(A, C, B){

        var i = A.indexOf(B);
        if(i == -1){

          A.push(C);
        } else {

          A.splice(i, 0, C);
        };
        return A;
      },
      insertAfter : function(D, F, E){

        var i = D.indexOf(E);
        if(i == -1 || i == (D.length - 1)){

          D.push(F);
        } else {

          D.splice(i + 1, 0, F);
        };
        return D;
      },
      removeAt : function(G, i){

        return G.splice(i, 1)[0];
      },
      removeAll : function(H){

        H.length = 0;
        return this;
      },
      append : function(J, I){

        {
        };
        Array.prototype.push.apply(J, I);
        return J;
      },
      exclude : function(M, L){

        {
        };
        for(var i = 0,N = L.length,K;i < N;i++){

          K = M.indexOf(L[i]);
          if(K != -1){

            M.splice(K, 1);
          };
        };
        return M;
      },
      remove : function(O, P){

        var i = O.indexOf(P);
        if(i != -1){

          O.splice(i, 1);
          return P;
        };
      },
      contains : function(Q, R){

        return Q.indexOf(R) !== -1;
      },
      equals : function(T, S){

        var length = T.length;
        if(length !== S.length){

          return false;
        };
        for(var i = 0;i < length;i++){

          if(T[i] !== S[i]){

            return false;
          };
        };
        return true;
      },
      sum : function(U){

        var V = 0;
        for(var i = 0,l = U.length;i < l;i++){

          if(U[i] != undefined){

            V += U[i];
          };
        };
        return V;
      },
      max : function(W){

        {
        };
        var i,Y = W.length,X = W[0];
        for(i = 1;i < Y;i++){

          if(W[i] > X){

            X = W[i];
          };
        };
        return X === undefined ? null : X;
      },
      min : function(ba){

        {
        };
        var i,bc = ba.length,bb = ba[0];
        for(i = 1;i < bc;i++){

          if(ba[i] < bb){

            bb = ba[i];
          };
        };
        return bb === undefined ? null : bb;
      },
      unique : function(bf){

        var bp = [],be = {
        },bi = {
        },bk = {
        };
        var bj,bd = 0;
        var bn = g + Date.now();
        var bg = false,bl = false,bo = false;
        for(var i = 0,bm = bf.length;i < bm;i++){

          bj = bf[i];
          if(bj === null){

            if(!bg){

              bg = true;
              bp.push(bj);
            };
          } else if(bj === undefined){
          } else if(bj === false){

            if(!bl){

              bl = true;
              bp.push(bj);
            };
          } else if(bj === true){

            if(!bo){

              bo = true;
              bp.push(bj);
            };
          } else if(typeof bj === k){

            if(!be[bj]){

              be[bj] = 1;
              bp.push(bj);
            };
          } else if(typeof bj === h){

            if(!bi[bj]){

              bi[bj] = 1;
              bp.push(bj);
            };
          } else {

            var bh = bj[bn];
            if(bh == null){

              bh = bj[bn] = bd++;
            };
            if(!bk[bh]){

              bk[bh] = bj;
              bp.push(bj);
            };
          };;;;;
        };
        for(var bh in bk){

          try{

            delete bk[bh][bn];
          } catch(bq) {

            try{

              bk[bh][bn] = null;
            } catch(br) {

              throw new Error(e + bh + j + bn + f);
            };
          };
        };
        return bp;
      },
      range : function(bu, stop, bv){

        if(arguments.length <= 1){

          stop = bu || 0;
          bu = 0;
        };
        bv = arguments[2] || 1;
        var length = Math.max(Math.ceil((stop - bu) / bv), 0);
        var bs = 0;
        var bt = Array(length);
        while(bs < length){

          bt[bs++] = bu;
          bu += bv;
        };
        return bt;
      }
    }
  });
})();
(function(){

  var a = " != ",b = "qx.core.Object",c = "Expected value to be an array but found ",d = "' (rgb(",f = ") was fired.",g = "Expected value to be an integer >= 0 but found ",h = "' to be not equal with '",j = "' to '",k = "Expected object '",m = "Called assertTrue with '",n = "Expected value to be a map but found ",o = "The function did not raise an exception!",p = "Expected value to be undefined but found ",q = "Expected value to be a DOM element but found  '",r = "Expected value to be a regular expression but found ",s = "' to implement the interface '",t = "Expected value to be null but found ",u = "Invalid argument 'type'",v = "Called assert with 'false'",w = "Assertion error! ",x = "'",y = "null",z = "' but found '",A = "'undefined'",B = ",",C = "' must must be a key of the map '",D = "Expected '",E = "The String '",F = "Expected value to be a string but found ",G = "Event (",H = "Expected value to be the CSS color '",I = "!",J = "Expected value not to be undefined but found undefined!",K = "qx.util.ColorUtil",L = ": ",M = "The raised exception does not have the expected type! ",N = ") not fired.",O = "'!",P = "qx.core.Assert",Q = "",R = "Expected value to be typeof object but found ",S = "' but found ",T = "' (identical) but found '",U = "' must have any of the values defined in the array '",V = "Expected value to be a number but found ",W = "Called assertFalse with '",X = "qx.ui.core.Widget",Y = "]",bJ = "Expected value to be a qooxdoo object but found ",bK = "' arguments.",bL = "Expected value '%1' to be in the range '%2'..'%3'!",bF = "Array[",bG = "' does not match the regular expression '",bH = "' to be not identical with '",bI = "Expected [",bP = "' arguments but found '",bQ = "', which cannot be converted to a CSS color!",bR = ", ",cg = "qx.core.AssertionError",bM = "Expected value to be a boolean but found ",bN = "Expected value not to be null but found null!",bO = "))!",bD = "Expected value to be a qooxdoo widget but found ",bU = "The value '",bE = "Expected value to be typeof '",bV = "\n Stack trace: \n",bW = "Expected value to be typeof function but found ",cb = "Expected value to be an integer but found ",bS = "Called fail().",cf = "The parameter 're' must be a string or a regular expression.",bT = ")), but found value '",bX = "qx.util.ColorUtil not available! Your code must have a dependency on 'qx.util.ColorUtil'",bY = "Expected value to be a number >= 0 but found ",ca = "Expected value to be instanceof '",cc = "], but found [",cd = "Wrong number of arguments given. Expected '",ce = "object";
  qx.Bootstrap.define(P, {
    statics : {
      __bA : true,
      __bB : function(ch, ci){

        var cm = Q;
        for(var i = 1,l = arguments.length;i < l;i++){

          cm = cm + this.__bC(arguments[i] === undefined ? A : arguments[i]);
        };
        var cl = Q;
        if(cm){

          cl = ch + L + cm;
        } else {

          cl = ch;
        };
        var ck = w + cl;
        if(qx.Class && qx.Class.isDefined(cg)){

          var cj = new qx.core.AssertionError(ch, cm);
          if(this.__bA){

            qx.Bootstrap.error(ck + bV + cj.getStackTrace());
          };
          throw cj;
        } else {

          if(this.__bA){

            qx.Bootstrap.error(ck);
          };
          throw new Error(ck);
        };
      },
      __bC : function(co){

        var cn;
        if(co === null){

          cn = y;
        } else if(qx.lang.Type.isArray(co) && co.length > 10){

          cn = bF + co.length + Y;
        } else if((co instanceof Object) && (co.toString == null)){

          cn = qx.lang.Json.stringify(co, null, 2);
        } else {

          try{

            cn = co.toString();
          } catch(e) {

            cn = Q;
          };
        };;
        return cn;
      },
      assert : function(cq, cp){

        cq == true || this.__bB(cp || Q, v);
      },
      fail : function(cr, cs){

        var ct = cs ? Q : bS;
        this.__bB(cr || Q, ct);
      },
      assertTrue : function(cv, cu){

        (cv === true) || this.__bB(cu || Q, m, cv, x);
      },
      assertFalse : function(cx, cw){

        (cx === false) || this.__bB(cw || Q, W, cx, x);
      },
      assertEquals : function(cy, cz, cA){

        cy == cz || this.__bB(cA || Q, D, cy, z, cz, O);
      },
      assertNotEquals : function(cB, cC, cD){

        cB != cC || this.__bB(cD || Q, D, cB, h, cC, O);
      },
      assertIdentical : function(cE, cF, cG){

        cE === cF || this.__bB(cG || Q, D, cE, T, cF, O);
      },
      assertNotIdentical : function(cH, cI, cJ){

        cH !== cI || this.__bB(cJ || Q, D, cH, bH, cI, O);
      },
      assertNotUndefined : function(cL, cK){

        cL !== undefined || this.__bB(cK || Q, J);
      },
      assertUndefined : function(cN, cM){

        cN === undefined || this.__bB(cM || Q, p, cN, I);
      },
      assertNotNull : function(cP, cO){

        cP !== null || this.__bB(cO || Q, bN);
      },
      assertNull : function(cR, cQ){

        cR === null || this.__bB(cQ || Q, t, cR, I);
      },
      assertJsonEquals : function(cS, cT, cU){

        this.assertEquals(qx.lang.Json.stringify(cS), qx.lang.Json.stringify(cT), cU);
      },
      assertMatch : function(cX, cW, cV){

        this.assertString(cX);
        this.assert(qx.lang.Type.isRegExp(cW) || qx.lang.Type.isString(cW), cf);
        cX.search(cW) >= 0 || this.__bB(cV || Q, E, cX, bG, cW.toString(), O);
      },
      assertArgumentsCount : function(db, dc, dd, cY){

        var da = db.length;
        (da >= dc && da <= dd) || this.__bB(cY || Q, cd, dc, j, dd, bP, da, bK);
      },
      assertEventFired : function(de, event, dh, di, dj){

        var df = false;
        var dg = function(e){

          if(di){

            di.call(de, e);
          };
          df = true;
        };
        var dk;
        try{

          dk = de.addListener(event, dg, de);
          dh.call(de);
        } catch(dl) {

          throw dl;
        }finally{

          try{

            de.removeListenerById(dk);
          } catch(dm) {
          };
        };
        df === true || this.__bB(dj || Q, G, event, N);
      },
      assertEventNotFired : function(dn, event, dr, ds){

        var dp = false;
        var dq = function(e){

          dp = true;
        };
        var dt = dn.addListener(event, dq, dn);
        dr.call();
        dp === false || this.__bB(ds || Q, G, event, f);
        dn.removeListenerById(dt);
      },
      assertException : function(dx, dw, dv, du){

        var dw = dw || Error;
        var dy;
        try{

          this.__bA = false;
          dx();
        } catch(dz) {

          dy = dz;
        }finally{

          this.__bA = true;
        };
        if(dy == null){

          this.__bB(du || Q, o);
        };
        dy instanceof dw || this.__bB(du || Q, M, dw, a, dy);
        if(dv){

          this.assertMatch(dy.toString(), dv, du);
        };
      },
      assertInArray : function(dC, dB, dA){

        dB.indexOf(dC) !== -1 || this.__bB(dA || Q, bU, dC, U, dB, x);
      },
      assertArrayEquals : function(dD, dE, dF){

        this.assertArray(dD, dF);
        this.assertArray(dE, dF);
        dF = dF || bI + dD.join(bR) + cc + dE.join(bR) + Y;
        if(dD.length !== dE.length){

          this.fail(dF, true);
        };
        for(var i = 0;i < dD.length;i++){

          if(dD[i] !== dE[i]){

            this.fail(dF, true);
          };
        };
      },
      assertKeyInMap : function(dI, dH, dG){

        dH[dI] !== undefined || this.__bB(dG || Q, bU, dI, C, dH, x);
      },
      assertFunction : function(dK, dJ){

        qx.lang.Type.isFunction(dK) || this.__bB(dJ || Q, bW, dK, I);
      },
      assertString : function(dM, dL){

        qx.lang.Type.isString(dM) || this.__bB(dL || Q, F, dM, I);
      },
      assertBoolean : function(dO, dN){

        qx.lang.Type.isBoolean(dO) || this.__bB(dN || Q, bM, dO, I);
      },
      assertNumber : function(dQ, dP){

        (qx.lang.Type.isNumber(dQ) && isFinite(dQ)) || this.__bB(dP || Q, V, dQ, I);
      },
      assertPositiveNumber : function(dS, dR){

        (qx.lang.Type.isNumber(dS) && isFinite(dS) && dS >= 0) || this.__bB(dR || Q, bY, dS, I);
      },
      assertInteger : function(dU, dT){

        (qx.lang.Type.isNumber(dU) && isFinite(dU) && dU % 1 === 0) || this.__bB(dT || Q, cb, dU, I);
      },
      assertPositiveInteger : function(dX, dV){

        var dW = (qx.lang.Type.isNumber(dX) && isFinite(dX) && dX % 1 === 0 && dX >= 0);
        dW || this.__bB(dV || Q, g, dX, I);
      },
      assertInRange : function(eb, ec, ea, dY){

        (eb >= ec && eb <= ea) || this.__bB(dY || Q, qx.lang.String.format(bL, [eb, ec, ea]));
      },
      assertObject : function(ee, ed){

        var ef = ee !== null && (qx.lang.Type.isObject(ee) || typeof ee === ce);
        ef || this.__bB(ed || Q, R, (ee), I);
      },
      assertArray : function(eh, eg){

        qx.lang.Type.isArray(eh) || this.__bB(eg || Q, c, eh, I);
      },
      assertMap : function(ej, ei){

        qx.lang.Type.isObject(ej) || this.__bB(ei || Q, n, ej, I);
      },
      assertRegExp : function(el, ek){

        qx.lang.Type.isRegExp(el) || this.__bB(ek || Q, r, el, I);
      },
      assertType : function(eo, en, em){

        this.assertString(en, u);
        typeof (eo) === en || this.__bB(em || Q, bE, en, S, eo, I);
      },
      assertInstance : function(er, es, ep){

        var eq = es.classname || es + Q;
        er instanceof es || this.__bB(ep || Q, ca, eq, S, er, I);
      },
      assertInterface : function(ev, eu, et){

        qx.Class && qx.Class.implementsInterface(ev, eu) || this.__bB(et || Q, k, ev, s, eu, O);
      },
      assertCssColor : function(eC, ez, eB){

        var ew = qx.Class ? qx.Class.getByName(K) : null;
        if(!ew){

          throw new Error(bX);
        };
        var ey = ew.stringToRgb(eC);
        try{

          var eA = ew.stringToRgb(ez);
        } catch(eE) {

          this.__bB(eB || Q, H, eC, d, ey.join(B), bT, ez, bQ);
        };
        var eD = ey[0] == eA[0] && ey[1] == eA[1] && ey[2] == eA[2];
        eD || this.__bB(eB || Q, H, ey, d, ey.join(B), bT, ez, d, eA.join(B), bO);
      },
      assertElement : function(eG, eF){

        !!(eG && eG.nodeType === 1) || this.__bB(eF || Q, q, eG, O);
      },
      assertQxObject : function(eI, eH){

        this.__bD(eI, b) || this.__bB(eH || Q, bJ, eI, I);
      },
      assertQxWidget : function(eK, eJ){

        this.__bD(eK, X) || this.__bB(eJ || Q, bD, eK, I);
      },
      __bD : function(eM, eL){

        if(!eM){

          return false;
        };
        var eN = eM.constructor;
        while(eN){

          if(eN.classname === eL){

            return true;
          };
          eN = eN.superclass;
        };
        return false;
      }
    }
  });
})();
(function(){

  var a = "-",b = "]",c = '\\u',d = "undefined",e = "",f = '\\$1',g = "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",h = "\\\\",j = '-',k = "g",l = "\\\"",m = "qx.lang.String",n = "(^|[^",o = "0",p = "%",q = '"',r = ' ',s = '\n',t = "])[";
  qx.Bootstrap.define(m, {
    statics : {
      __bE : g,
      __bF : null,
      __bG : {
      },
      camelCase : function(v){

        var u = this.__bG[v];
        if(!u){

          u = v.replace(/\-([a-z])/g, function(x, w){

            return w.toUpperCase();
          });
          if(v.indexOf(a) >= 0){

            this.__bG[v] = u;
          };
        };
        return u;
      },
      hyphenate : function(z){

        var y = this.__bG[z];
        if(!y){

          y = z.replace(/[A-Z]/g, function(A){

            return (j + A.charAt(0).toLowerCase());
          });
          if(z.indexOf(a) == -1){

            this.__bG[z] = y;
          };
        };
        return y;
      },
      capitalize : function(C){

        if(this.__bF === null){

          var B = c;
          this.__bF = new RegExp(n + this.__bE.replace(/[0-9A-F]{4}/g, function(D){

            return B + D;
          }) + t + this.__bE.replace(/[0-9A-F]{4}/g, function(E){

            return B + E;
          }) + b, k);
        };
        return C.replace(this.__bF, function(F){

          return F.toUpperCase();
        });
      },
      clean : function(G){

        return G.replace(/\s+/g, r).trim();
      },
      trimLeft : function(H){

        return H.replace(/^\s+/, e);
      },
      trimRight : function(I){

        return I.replace(/\s+$/, e);
      },
      startsWith : function(K, J){

        return K.indexOf(J) === 0;
      },
      endsWith : function(M, L){

        return M.substring(M.length - L.length, M.length) === L;
      },
      repeat : function(N, O){

        return N.length > 0 ? new Array(O + 1).join(N) : e;
      },
      pad : function(Q, length, P){

        var R = length - Q.length;
        if(R > 0){

          if(typeof P === d){

            P = o;
          };
          return this.repeat(P, R) + Q;
        } else {

          return Q;
        };
      },
      firstUp : qx.Bootstrap.firstUp,
      firstLow : qx.Bootstrap.firstLow,
      contains : function(T, S){

        return T.indexOf(S) != -1;
      },
      format : function(U, V){

        var W = U;
        var i = V.length;
        while(i--){

          W = W.replace(new RegExp(p + (i + 1), k), function(){

            return V[i] + e;
          });
        };
        return W;
      },
      escapeRegexpChars : function(X){

        return X.replace(/([.*+?^${}()|[\]\/\\])/g, f);
      },
      toArray : function(Y){

        return Y.split(/\B|\b/g);
      },
      stripTags : function(ba){

        return ba.replace(/<\/?[^>]+>/gi, e);
      },
      stripScripts : function(bd, bc){

        var be = e;
        var bb = bd.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){

          be += arguments[1] + s;
          return e;
        });
        if(bc === true){

          qx.lang.Function.globalEval(be);
        };
        return bb;
      },
      quote : function(bf){

        return q + bf.replace(/\\/g, h).replace(/\"/g, l) + q;
      }
    }
  });
})();
(function(){

  var a = "qx.globalErrorHandling",b = 'anonymous()',c = 'Method "qx.lang.Function.getCaller" cannot be used in strict mode.',d = ".prototype.",e = "()",f = "qx.lang.Function",g = ".",h = "qx.strict",i = ".constructor()";
  qx.Bootstrap.define(f, {
    statics : {
      getCaller : function(j){

        if(qx.core.Environment.get(h)){

          throw new Error(c);
        };
        return j.caller ? j.caller.callee : j.callee.caller;
      },
      getName : function(k){

        if(k.displayName){

          return k.displayName;
        };
        if(k.$$original || k.wrapper || k.classname){

          return k.classname + i;
        };
        if(k.$$mixin){

          for(var l in k.$$mixin.$$members){

            if(k.$$mixin.$$members[l] == k){

              return k.$$mixin.name + d + l + e;
            };
          };
          for(var l in k.$$mixin){

            if(k.$$mixin[l] == k){

              return k.$$mixin.name + g + l + e;
            };
          };
        };
        if(k.self){

          var n = k.self.constructor;
          if(n){

            for(var l in n.prototype){

              if(n.prototype[l] == k){

                return n.classname + d + l + e;
              };
            };
            for(var l in n){

              if(n[l] == k){

                return n.classname + g + l + e;
              };
            };
          };
        };
        var m = k.toString().match(/function\s*(\w*)\s*\(.*/);
        if(m && m.length >= 1 && m[1]){

          return m[1] + e;
        };
        return b;
      },
      globalEval : function(data){

        if(window.execScript){

          return window.execScript(data);
        } else {

          return eval.call(window, data);
        };
      },
      create : function(p, o){

        {
        };
        if(!o){

          return p;
        };
        if(!(o.self || o.args || o.delay != null || o.periodical != null || o.attempt)){

          return p;
        };
        return function(event){

          {
          };
          var r = qx.lang.Array.fromArguments(arguments);
          if(o.args){

            r = o.args.concat(r);
          };
          if(o.delay || o.periodical){

            var q = function(){

              return p.apply(o.self || this, r);
            };
            if(qx.core.Environment.get(a)){

              q = qx.event.GlobalError.observeMethod(q);
            };
            if(o.delay){

              return window.setTimeout(q, o.delay);
            };
            if(o.periodical){

              return window.setInterval(q, o.periodical);
            };
          } else if(o.attempt){

            var s = false;
            try{

              s = p.apply(o.self || this, r);
            } catch(t) {
            };
            return s;
          } else {

            return p.apply(o.self || this, r);
          };
        };
      },
      bind : function(u, self, v){

        return this.create(u, {
          self : self,
          args : arguments.length > 2 ? qx.lang.Array.fromArguments(arguments, 2) : null
        });
      },
      curry : function(w, x){

        return this.create(w, {
          args : arguments.length > 1 ? qx.lang.Array.fromArguments(arguments, 1) : null
        });
      },
      listener : function(z, self, A){

        if(arguments.length < 3){

          return function(event){

            return z.call(self || this, event || window.event);
          };
        } else {

          var y = qx.lang.Array.fromArguments(arguments, 2);
          return function(event){

            var B = [event || window.event];
            B.push.apply(B, y);
            z.apply(self || this, B);
          };
        };
      },
      attempt : function(C, self, D){

        return this.create(C, {
          self : self,
          attempt : true,
          args : arguments.length > 2 ? qx.lang.Array.fromArguments(arguments, 2) : null
        })();
      },
      delay : function(F, E, self, G){

        return this.create(F, {
          delay : E,
          self : self,
          args : arguments.length > 3 ? qx.lang.Array.fromArguments(arguments, 3) : null
        })();
      },
      periodical : function(I, H, self, J){

        return this.create(I, {
          periodical : H,
          self : self,
          args : arguments.length > 3 ? qx.lang.Array.fromArguments(arguments, 3) : null
        })();
      }
    }
  });
})();
(function(){

  var a = "qx.globalErrorHandling",b = "qx.event.GlobalError";
  qx.Bootstrap.define(b, {
    statics : {
      __bH : null,
      __bI : null,
      __bJ : null,
      __bK : function(){

        if(qx.core && qx.core.Environment){

          return qx.core.Environment.get(a);
        } else {

          return !!qx.Bootstrap.getEnvironmentSetting(a);
        };
      },
      setErrorHandler : function(c, d){

        this.__bH = c || null;
        this.__bJ = d || window;
        if(this.__bK()){

          if(c && window.onerror){

            var e = qx.Bootstrap.bind(this.__bL, this);
            if(this.__bI == null){

              this.__bI = window.onerror;
            };
            var self = this;
            window.onerror = function(f, g, h){

              self.__bI(f, g, h);
              e(f, g, h);
            };
          };
          if(c && !window.onerror){

            window.onerror = qx.Bootstrap.bind(this.__bL, this);
          };
          if(this.__bH == null){

            if(this.__bI != null){

              window.onerror = this.__bI;
              this.__bI = null;
            } else {

              window.onerror = null;
            };
          };
        };
      },
      __bL : function(i, j, k){

        if(this.__bH){

          this.handleError(new qx.core.WindowError(i, j, k));
        };
      },
      observeMethod : function(l){

        if(this.__bK()){

          var self = this;
          return function(){

            if(!self.__bH){

              return l.apply(this, arguments);
            };
            try{

              return l.apply(this, arguments);
            } catch(m) {

              self.handleError(new qx.core.GlobalError(m, arguments));
            };
          };
        } else {

          return l;
        };
      },
      handleError : function(n){

        if(this.__bH){

          this.__bH.call(this.__bJ, n);
        };
      }
    },
    defer : function(o){

      if(qx.core && qx.core.Environment){

        qx.core.Environment.add(a, true);
      } else {

        qx.Bootstrap.setEnvironmentSetting(a, true);
      };
      o.setErrorHandler(null, null);
    }
  });
})();
(function(){

  var a = "",b = "qx.core.WindowError";
  qx.Bootstrap.define(b, {
    extend : Error,
    construct : function(c, e, f){

      var d = Error.call(this, c);
      if(d.stack){

        this.stack = d.stack;
      };
      if(d.stacktrace){

        this.stacktrace = d.stacktrace;
      };
      this.__bM = c;
      this.__bN = e || a;
      this.__bO = f === undefined ? -1 : f;
    },
    members : {
      __bM : null,
      __bN : null,
      __bO : null,
      toString : function(){

        return this.__bM;
      },
      getUri : function(){

        return this.__bN;
      },
      getLineNumber : function(){

        return this.__bO;
      }
    }
  });
})();
(function(){

  var a = "GlobalError: ",b = "qx.core.GlobalError";
  qx.Bootstrap.define(b, {
    extend : Error,
    construct : function(e, c){

      if(qx.Bootstrap.DEBUG){

        qx.core.Assert.assertNotUndefined(e);
      };
      this.__bM = a + (e && e.message ? e.message : e);
      var d = Error.call(this, this.__bM);
      if(d.stack){

        this.stack = d.stack;
      };
      if(d.stacktrace){

        this.stacktrace = d.stacktrace;
      };
      this.__bP = c;
      this.__bQ = e;
    },
    members : {
      __bQ : null,
      __bP : null,
      __bM : null,
      toString : function(){

        return this.__bM;
      },
      getArguments : function(){

        return this.__bP;
      },
      getSourceException : function(){

        return this.__bQ;
      }
    },
    destruct : function(){

      this.__bQ = null;
      this.__bP = null;
      this.__bM = null;
    }
  });
})();
(function(){

  var a = "\x00\b\n\f\r\t",b = "-",c = "function",d = "[null,null,null]",e = "T",f = "+",g = ",\n",h = "constructor",i = "{\n",j = '"+275760-09-13T00:00:00.000Z"',k = "true",l = "\\n",m = "false",n = '"-271821-04-20T00:00:00.000Z"',o = "json",p = 'object',q = '""',r = "qx.lang.Json",s = "{}",t = "hasOwnProperty",u = "@",v = "prototype",w = 'hasOwnProperty',x = '"',y = "toLocaleString",z = "0",A = 'function',B = "",C = '\\"',D = "\t",E = "string",F = "}",G = "\r",H = "toJSON",I = ":",J = "[\n 1,\n 2\n]",K = "\\f",L = '"1969-12-31T23:59:59.999Z"',M = "/",N = "\\b",O = "Z",P = "\\t",Q = "\b",R = "[object Number]",S = "isPrototypeOf",T = "{",U = "toString",V = "0x",W = "[1]",X = "\\r",Y = "qx.strict",bI = "]",bJ = ",",bP = "null",bM = "\\u00",bN = "\n",bH = "json-stringify",bO = "[]",bS = "1",bU = "000000",bT = "[object Boolean]",cc = "valueOf",bQ = "\\\\",bK = "[object String]",bL = "json-parse",bR = "bug-string-char-index",bX = "[object Array]",co = "$",bY = "[\n",ca = '"-000001-01-01T00:00:00.000Z"',bV = "[",cl = "[null]",cb = "\\",bW = "[object Date]",cd = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}',ce = "a",cf = " ",cg = ".",ck = "[object Function]",cm = "01",cn = '"\t"',ch = "propertyIsEnumerable",ci = "\f",cj = "object";
  qx.Bootstrap.define(r, {
    statics : {
      stringify : null,
      parse : null
    }
  });
  (function(){

    var cq;
    var cp;
    var cr;
    (function(window){

      var ct = {
      }.toString,cI,cS,cE;
      var cA = typeof cr === c && cr.amd,cz = typeof cp == cj && cp;
      if(cz || cA){

        if(typeof JSON == cj && JSON){

          if(cz){

            cz.stringify = JSON.stringify;
            cz.parse = JSON.parse;
          } else {

            cz = JSON;
          };
        } else if(cA){

          cz = window.JSON = {
          };
        };
      } else {

        cz = window.JSON || (window.JSON = {
        });
      };
      var cW = new Date(-3509827334573292);
      try{

        cW = cW.getUTCFullYear() == -109252 && cW.getUTCMonth() === 0 && cW.getUTCDate() === 1 && cW.getUTCHours() == 10 && cW.getUTCMinutes() == 37 && cW.getUTCSeconds() == 6 && cW.getUTCMilliseconds() == 708;
      } catch(dc) {
      };
      function cL(name){

        if(name == bR){

          return ce[0] != ce;
        };
        var dg,df = cd,dj = name == o;
        if(dj || name == bH || name == bL){

          if(name == bH || dj){

            var dd = cz.stringify,di = typeof dd == c && cW;
            if(di){

              (dg = function(){

                return 1;
              }).toJSON = dg;
              try{

                di = dd(0) === z && dd(new Number()) === z && dd(new String()) == q && dd(ct) === cE && dd(cE) === cE && dd() === cE && dd(dg) === bS && dd([dg]) == W && dd([cE]) == cl && dd(null) == bP && dd([cE, ct, null]) == d && dd({
                  "a" : [dg, true, false, null, a]
                }) == df && dd(null, dg) === bS && dd([1, 2], null, 1) == J && dd(new Date(-8.64e15)) == n && dd(new Date(8.64e15)) == j && dd(new Date(-621987552e5)) == ca && dd(new Date(-1)) == L;
              } catch(dk) {

                di = false;
              };
            };
            if(!dj){

              return di;
            };
          };
          if(name == bL || dj){

            var dh = cz.parse;
            if(typeof dh == c){

              try{

                if(dh(z) === 0 && !dh(false)){

                  dg = dh(df);
                  var de = dg[ce].length == 5 && dg[ce][0] === 1;
                  if(de){

                    try{

                      de = !dh(cn);
                    } catch(dl) {
                    };
                    if(de){

                      try{

                        de = dh(cm) !== 1;
                      } catch(dm) {
                      };
                    };
                  };
                };
              } catch(dn) {

                de = false;
              };
            };
            if(!dj){

              return de;
            };
          };
          return di && de;
        };
      };
      if(!cL(o)){

        var cX = ck;
        var cP = bW;
        var cx = R;
        var db = bK;
        var cT = bX;
        var cH = bT;
        var cG = cL(bR);
        if(!cW){

          var cF = Math.floor;
          var cO = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
          var da = function(dp, dq){

            return cO[dq] + 365 * (dp - 1970) + cF((dp - 1969 + (dq = +(dq > 1))) / 4) - cF((dp - 1901 + dq) / 100) + cF((dp - 1601 + dq) / 400);
          };
        };
        if(!(cI = {
        }.hasOwnProperty)){

          cI = function(dr){

            var ds = {
            },dt;
            if((ds.__bR = null, ds.__bR = {
              "toString" : 1
            }, ds).toString != ct){

              cI = function(du){

                var dv = this.__bR,dw = du in (this.__bR = null, this);
                this.__bR = dv;
                return dw;
              };
            } else {

              dt = ds.constructor;
              cI = function(dx){

                var parent = (this.constructor || dt).prototype;
                return dx in this && !(dx in parent && this[dx] === parent[dx]);
              };
            };
            ds = null;
            return cI.call(this, dr);
          };
        };
        var cJ = {
          'boolean' : 1,
          'number' : 1,
          'string' : 1,
          'undefined' : 1
        };
        var cR = function(dA, dy){

          var dz = typeof dA[dy];
          return dz == p ? !!dA[dy] : !cJ[dz];
        };
        cS = function(dB, dC){

          var dH = 0,dG,dE,dF,dD;
          (dG = function(){

            this.valueOf = 0;
          }).prototype.valueOf = 0;
          dE = new dG();
          for(dF in dE){

            if(cI.call(dE, dF)){

              dH++;
            };
          };
          dG = dE = null;
          if(!dH){

            dE = [cc, U, y, ch, S, t, h];
            dD = function(dJ, dK){

              var dL = ct.call(dJ) == cX,dM,length;
              var dI = !dL && typeof dJ.constructor != A && cR(dJ, w) ? dJ.hasOwnProperty : cI;
              for(dM in dJ){

                if(!(dL && dM == v) && dI.call(dJ, dM)){

                  dK(dM);
                };
              };
              for(length = dE.length;dM = dE[--length];dI.call(dJ, dM) && dK(dM));
            };
          } else if(dH == 2){

            dD = function(dR, dN){

              var dQ = {
              },dO = ct.call(dR) == cX,dP;
              for(dP in dR){

                if(!(dO && dP == v) && !cI.call(dQ, dP) && (dQ[dP] = 1) && cI.call(dR, dP)){

                  dN(dP);
                };
              };
            };
          } else {

            dD = function(dV, dS){

              var dT = ct.call(dV) == cX,dU,dW;
              for(dU in dV){

                if(!(dT && dU == v) && cI.call(dV, dU) && !(dW = dU === h)){

                  dS(dU);
                };
              };
              if(dW || cI.call(dV, (dU = h))){

                dS(dU);
              };
            };
          };
          return dD(dB, dC);
        };
        if(!cL(bH)){

          var cV = {
            '92' : bQ,
            '34' : C,
            '8' : N,
            '12' : K,
            '10' : l,
            '13' : X,
            '9' : P
          };
          var cK = bU;
          var cY = function(dX, dY){

            return (cK + (dY || 0)).slice(-dX);
          };
          var cD = bM;
          var cN = function(eb){

            var ed = x,ea = 0,length = eb.length,ee = length > 10 && cG,ec;
            if(ee){

              ec = eb.split(B);
            };
            for(;ea < length;ea++){

              var ef = eb.charCodeAt(ea);
              switch(ef){case 8:case 9:case 10:case 12:case 13:case 34:case 92:
              ed += cV[ef];
              break;default:
              if(ef < 32){

                ed += cD + cY(2, ef.toString(16));
                break;
              };
              ed += ee ? ec[ea] : cG ? eb.charAt(ea) : eb[ea];};
            };
            return ed + x;
          };
          var cu = function(eB, eq, ey, en, em, ez, eu){

            var ev = eq[eB],ex,ek,eh,et,eA,er,eC,ep,eo,eg,ew,el,length,ei,es,ej;
            try{

              ev = eq[eB];
            } catch(eD) {
            };
            if(typeof ev == cj && ev){

              ex = ct.call(ev);
              if(ex == cP && !cI.call(ev, H)){

                if(ev > -1 / 0 && ev < 1 / 0){

                  if(da){

                    et = cF(ev / 864e5);
                    for(ek = cF(et / 365.2425) + 1970 - 1;da(ek + 1, 0) <= et;ek++);
                    for(eh = cF((et - da(ek, 0)) / 30.42);da(ek, eh + 1) <= et;eh++);
                    et = 1 + et - da(ek, eh);
                    eA = (ev % 864e5 + 864e5) % 864e5;
                    er = cF(eA / 36e5) % 24;
                    eC = cF(eA / 6e4) % 60;
                    ep = cF(eA / 1e3) % 60;
                    eo = eA % 1e3;
                  } else {

                    ek = ev.getUTCFullYear();
                    eh = ev.getUTCMonth();
                    et = ev.getUTCDate();
                    er = ev.getUTCHours();
                    eC = ev.getUTCMinutes();
                    ep = ev.getUTCSeconds();
                    eo = ev.getUTCMilliseconds();
                  };
                  ev = (ek <= 0 || ek >= 1e4 ? (ek < 0 ? b : f) + cY(6, ek < 0 ? -ek : ek) : cY(4, ek)) + b + cY(2, eh + 1) + b + cY(2, et) + e + cY(2, er) + I + cY(2, eC) + I + cY(2, ep) + cg + cY(3, eo) + O;
                } else {

                  ev = null;
                };
              } else if(typeof ev.toJSON == c && ((ex != cx && ex != db && ex != cT) || cI.call(ev, H))){

                ev = ev.toJSON(eB);
              };
            };
            if(ey){

              ev = ey.call(eq, eB, ev);
            };
            if(ev === null){

              return bP;
            };
            ex = ct.call(ev);
            if(ex == cH){

              return B + ev;
            } else if(ex == cx){

              return ev > -1 / 0 && ev < 1 / 0 ? B + ev : bP;
            } else if(ex == db){

              return cN(B + ev);
            };;
            if(typeof ev == cj){

              for(length = eu.length;length--;){

                if(eu[length] === ev){

                  throw TypeError();
                };
              };
              eu.push(ev);
              eg = [];
              ei = ez;
              ez += em;
              if(ex == cT){

                for(el = 0,length = ev.length;el < length;es || (es = true),el++){

                  ew = cu(el, ev, ey, en, em, ez, eu);
                  eg.push(ew === cE ? bP : ew);
                };
                ej = es ? (em ? bY + ez + eg.join(g + ez) + bN + ei + bI : (bV + eg.join(bJ) + bI)) : bO;
              } else {

                cS(en || ev, function(eE){

                  var eF = cu(eE, ev, ey, en, em, ez, eu);
                  if(eF !== cE){

                    eg.push(cN(eE) + I + (em ? cf : B) + eF);
                  };
                  es || (es = true);
                });
                ej = es ? (em ? i + ez + eg.join(g + ez) + bN + ei + F : (T + eg.join(bJ) + F)) : s;
              };
              eu.pop();
              return ej;
            };
          };
          cz.stringify = function(eM, eL, eN){

            var eH,eI,eK;
            if(typeof eL == c || typeof eL == cj && eL){

              if(ct.call(eL) == cX){

                eI = eL;
              } else if(ct.call(eL) == cT){

                eK = {
                };
                for(var eG = 0,length = eL.length,eJ;eG < length;eJ = eL[eG++],((ct.call(eJ) == db || ct.call(eJ) == cx) && (eK[eJ] = 1)));
              };
            };
            if(eN){

              if(ct.call(eN) == cx){

                if((eN -= eN % 1) > 0){

                  for(eH = B,eN > 10 && (eN = 10);eH.length < eN;eH += cf);
                };
              } else if(ct.call(eN) == db){

                eH = eN.length <= 10 ? eN : eN.slice(0, 10);
              };
            };
            return cu(B, (eJ = {
            }, eJ[B] = eM, eJ), eI, eK, eH, B, []);
          };
        };
        if(!cL(bL)){

          var cC = String.fromCharCode;
          var cB = {
            '92' : cb,
            '34' : x,
            '47' : M,
            '98' : Q,
            '116' : D,
            '110' : bN,
            '102' : ci,
            '114' : G
          };
          var cs,cw;
          var cy = function(){

            cs = cw = null;
            throw SyntaxError();
          };
          var cU = function(){

            var eQ = cw,length = eQ.length,eP,eO,eS,eR,eT;
            while(cs < length){

              eT = eQ.charCodeAt(cs);
              switch(eT){case 9:case 10:case 13:case 32:
              cs++;
              break;case 123:case 125:case 91:case 93:case 58:case 44:
              eP = cG ? eQ.charAt(cs) : eQ[cs];
              cs++;
              return eP;case 34:
              for(eP = u,cs++;cs < length;){

                eT = eQ.charCodeAt(cs);
                if(eT < 32){

                  cy();
                } else if(eT == 92){

                  eT = eQ.charCodeAt(++cs);
                  switch(eT){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
                  eP += cB[eT];
                  cs++;
                  break;case 117:
                  eO = ++cs;
                  for(eS = cs + 4;cs < eS;cs++){

                    eT = eQ.charCodeAt(cs);
                    if(!(eT >= 48 && eT <= 57 || eT >= 97 && eT <= 102 || eT >= 65 && eT <= 70)){

                      cy();
                    };
                  };
                  eP += cC(V + eQ.slice(eO, cs));
                  break;default:
                  cy();};
                } else {

                  if(eT == 34){

                    break;
                  };
                  eT = eQ.charCodeAt(cs);
                  eO = cs;
                  while(eT >= 32 && eT != 92 && eT != 34){

                    eT = eQ.charCodeAt(++cs);
                  };
                  eP += eQ.slice(eO, cs);
                };
              };
              if(eQ.charCodeAt(cs) == 34){

                cs++;
                return eP;
              };
              cy();default:
              eO = cs;
              if(eT == 45){

                eR = true;
                eT = eQ.charCodeAt(++cs);
              };
              if(eT >= 48 && eT <= 57){

                if(eT == 48 && ((eT = eQ.charCodeAt(cs + 1)), eT >= 48 && eT <= 57)){

                  cy();
                };
                eR = false;
                for(;cs < length && ((eT = eQ.charCodeAt(cs)), eT >= 48 && eT <= 57);cs++);
                if(eQ.charCodeAt(cs) == 46){

                  eS = ++cs;
                  for(;eS < length && ((eT = eQ.charCodeAt(eS)), eT >= 48 && eT <= 57);eS++);
                  if(eS == cs){

                    cy();
                  };
                  cs = eS;
                };
                eT = eQ.charCodeAt(cs);
                if(eT == 101 || eT == 69){

                  eT = eQ.charCodeAt(++cs);
                  if(eT == 43 || eT == 45){

                    cs++;
                  };
                  for(eS = cs;eS < length && ((eT = eQ.charCodeAt(eS)), eT >= 48 && eT <= 57);eS++);
                  if(eS == cs){

                    cy();
                  };
                  cs = eS;
                };
                return +eQ.slice(eO, cs);
              };
              if(eR){

                cy();
              };
              if(eQ.slice(cs, cs + 4) == k){

                cs += 4;
                return true;
              } else if(eQ.slice(cs, cs + 5) == m){

                cs += 5;
                return false;
              } else if(eQ.slice(cs, cs + 4) == bP){

                cs += 4;
                return null;
              };;
              cy();};
            };
            return co;
          };
          var cM = function(eW){

            var eV,eU;
            if(eW == co){

              cy();
            };
            if(typeof eW == E){

              if((cG ? eW.charAt(0) : eW[0]) == u){

                return eW.slice(1);
              };
              if(eW == bV){

                eV = [];
                for(;;eU || (eU = true)){

                  eW = cU();
                  if(eW == bI){

                    break;
                  };
                  if(eU){

                    if(eW == bJ){

                      eW = cU();
                      if(eW == bI){

                        cy();
                      };
                    } else {

                      cy();
                    };
                  };
                  if(eW == bJ){

                    cy();
                  };
                  eV.push(cM(eW));
                };
                return eV;
              } else if(eW == T){

                eV = {
                };
                for(;;eU || (eU = true)){

                  eW = cU();
                  if(eW == F){

                    break;
                  };
                  if(eU){

                    if(eW == bJ){

                      eW = cU();
                      if(eW == F){

                        cy();
                      };
                    } else {

                      cy();
                    };
                  };
                  if(eW == bJ || typeof eW != E || (cG ? eW.charAt(0) : eW[0]) != u || cU() != I){

                    cy();
                  };
                  eV[eW.slice(1)] = cM(cU());
                };
                return eV;
              };
              cy();
            };
            return eW;
          };
          var cQ = function(eX, eY, fa){

            var fb = cv(eX, eY, fa);
            if(fb === cE){

              delete eX[eY];
            } else {

              eX[eY] = fb;
            };
          };
          var cv = function(fc, fd, ff){

            var fe = fc[fd],length;
            if(typeof fe == cj && fe){

              if(ct.call(fe) == cT){

                for(length = fe.length;length--;){

                  cQ(fe, length, ff);
                };
              } else {

                cS(fe, function(fg){

                  cQ(fe, fg, ff);
                });
              };
            };
            return ff.call(fc, fd, fe);
          };
          cz.parse = function(fh, fk){

            var fi,fj;
            cs = 0;
            cw = B + fh;
            fi = cM(cU());
            if(cU() != co){

              cy();
            };
            cs = cw = null;
            return fk && ct.call(fk) == cX ? cv((fj = {
            }, fj[B] = fi, fj), B, fk) : fi;
          };
        };
      };
      if(cA){

        cr(function(){

          return cz;
        });
      };
    }(qx.core.Environment.get(Y) ? globalThis : window));
  }());
  qx.lang.Json.stringify = window.JSON.stringify;
  qx.lang.Json.parse = window.JSON.parse;
})();
(function(){

  var a = ": ",b = "qx.type.BaseError",c = "",d = "error";
  qx.Bootstrap.define(b, {
    extend : Error,
    construct : function(e, f){

      var g = Error.call(this, f);
      if(g.stack){

        this.stack = g.stack;
      };
      if(g.stacktrace){

        this.stacktrace = g.stacktrace;
      };
      this.__bS = e || c;
      this.message = f || qx.type.BaseError.DEFAULTMESSAGE;
    },
    statics : {
      DEFAULTMESSAGE : d
    },
    members : {
      __bT : null,
      __bS : null,
      message : null,
      getComment : function(){

        return this.__bS;
      },
      toString : function(){

        return this.__bS + (this.message ? a + this.message : c);
      }
    }
  });
})();
(function(){

  var a = "qx.core.AssertionError";
  qx.Bootstrap.define(a, {
    extend : qx.type.BaseError,
    construct : function(b, c){

      qx.type.BaseError.call(this, b, c);
      this.__bU = qx.dev.StackTrace.getStackTrace();
    },
    members : {
      __bU : null,
      getStackTrace : function(){

        return this.__bU;
      }
    }
  });
})();
(function(){

  var a = "anonymous",b = "...",c = "qx.dev.StackTrace",d = "",e = "\n",f = "?",g = "/source/class/",h = "Error created at",j = "ecmascript.error.stacktrace",k = "Backtrace:",l = "stack",m = ":",n = ".",o = "function",p = "prototype",q = "stacktrace";
  qx.Bootstrap.define(c, {
    statics : {
      FILENAME_TO_CLASSNAME : null,
      FORMAT_STACKTRACE : null,
      getStackTrace : function(){

        var t = [];
        try{

          throw new Error();
        } catch(G) {

          if(qx.dev.StackTrace.hasEnvironmentCheck && qx.core.Environment.get(j)){

            var y = qx.dev.StackTrace.getStackTraceFromError(G);
            var B = qx.dev.StackTrace.getStackTraceFromCaller(arguments);
            qx.lang.Array.removeAt(y, 0);
            t = B.length > y.length ? B : y;
            for(var i = 0;i < Math.min(B.length, y.length);i++){

              var w = B[i];
              if(w.indexOf(a) >= 0){

                continue;
              };
              var s = null;
              var C = w.split(n);
              var v = /(.*?)\(/.exec(C[C.length - 1]);
              if(v && v.length == 2){

                s = v[1];
                C.pop();
              };
              if(C[C.length - 1] == p){

                C.pop();
              };
              var E = C.join(n);
              var u = y[i];
              var F = u.split(m);
              var A = F[0];
              var z = F[1];
              var r;
              if(F[2]){

                r = F[2];
              };
              var x = null;
              if(qx.Class && qx.Class.getByName(A)){

                x = A;
              } else {

                x = E;
              };
              var D = x;
              if(s){

                D += n + s;
              };
              D += m + z;
              if(r){

                D += m + r;
              };
              t[i] = D;
            };
          } else {

            t = this.getStackTraceFromCaller(arguments);
          };
        };
        return t;
      },
      getStackTraceFromCaller : function(K){

        var J = [];
        var M = qx.lang.Function.getCaller(K);
        var H = {
        };
        while(M){

          var L = qx.lang.Function.getName(M);
          J.push(L);
          try{

            M = M.caller;
          } catch(N) {

            break;
          };
          if(!M){

            break;
          };
          var I = qx.core.ObjectRegistry.toHashCode(M);
          if(H[I]){

            J.push(b);
            break;
          };
          H[I] = M;
        };
        return J;
      },
      getStackTraceFromError : function(bd){

        var T = [];
        var R,S,ba,Q,P,bf,bb;
        var bc = qx.dev.StackTrace.hasEnvironmentCheck ? qx.core.Environment.get(j) : null;
        if(bc === l){

          if(!bd.stack){

            return T;
          };
          R = /@(.+):(\d+)$/gm;
          while((S = R.exec(bd.stack)) != null){

            bb = S[1];
            Q = S[2];
            ba = this.__bV(bb);
            T.push(ba + m + Q);
          };
          if(T.length > 0){

            return this.__bX(T);
          };
          R = /at (.*)/gm;
          var be = /\((.*?)(:[^\/].*)\)/;
          var Y = /(.*?)(:[^\/].*)/;
          while((S = R.exec(bd.stack)) != null){

            var X = be.exec(S[1]);
            if(!X){

              X = Y.exec(S[1]);
            };
            if(X){

              ba = this.__bV(X[1]);
              T.push(ba + X[2]);
            } else {

              T.push(S[1]);
            };
          };
        } else if(bc === q){

          var U = bd.stacktrace;
          if(!U){

            return T;
          };
          if(U.indexOf(h) >= 0){

            U = U.split(h)[0];
          };
          R = /line\ (\d+?),\ column\ (\d+?)\ in\ (?:.*?)\ in\ (.*?):[^\/]/gm;
          while((S = R.exec(U)) != null){

            Q = S[1];
            P = S[2];
            bb = S[3];
            ba = this.__bV(bb);
            T.push(ba + m + Q + m + P);
          };
          if(T.length > 0){

            return this.__bX(T);
          };
          R = /Line\ (\d+?)\ of\ linked\ script\ (.*?)$/gm;
          while((S = R.exec(U)) != null){

            Q = S[1];
            bb = S[2];
            ba = this.__bV(bb);
            T.push(ba + m + Q);
          };
        } else if(bd.message && bd.message.indexOf(k) >= 0){

          var W = bd.message.split(k)[1].trim();
          var V = W.split(e);
          for(var i = 0;i < V.length;i++){

            var O = V[i].match(/\s*Line ([0-9]+) of.* (\S.*)/);
            if(O && O.length >= 2){

              Q = O[1];
              bf = this.__bV(O[2]);
              T.push(bf + m + Q);
            };
          };
        } else if(bd.sourceURL && bd.line){

          T.push(this.__bV(bd.sourceURL) + m + bd.line);
        };;;
        return this.__bX(T);
      },
      __bV : function(bh){

        if(typeof qx.dev.StackTrace.FILENAME_TO_CLASSNAME == o){

          var bg = qx.dev.StackTrace.FILENAME_TO_CLASSNAME(bh);
          {
          };
          return bg;
        };
        return qx.dev.StackTrace.__bW(bh);
      },
      __bW : function(bk){

        var bl = g;
        var bi = bk.indexOf(bl);
        var bm = bk.indexOf(f);
        if(bm >= 0){

          bk = bk.substring(0, bm);
        };
        var bj = (bi == -1) ? bk : bk.substring(bi + bl.length).replace(/\//g, n).replace(/\.js$/, d);
        return bj;
      },
      __bX : function(bn){

        if(typeof qx.dev.StackTrace.FORMAT_STACKTRACE == o){

          bn = qx.dev.StackTrace.FORMAT_STACKTRACE(bn);
          {
          };
        };
        return bn;
      }
    },
    defer : function(bo){

      bo.hasEnvironmentCheck = qx.bom && qx.bom.client && qx.bom.client.EcmaScript && qx.bom.client.EcmaScript.getStackTrace;
    }
  });
})();
(function(){

  var c = "-",d = "",e = "qx.core.ObjectRegistry",f = "Disposed ",g = "$$hash",h = "-0",j = " objects",k = "Could not dispose object ",m = ": ";
  qx.Bootstrap.define(e, {
    statics : {
      inShutDown : false,
      __G : {
      },
      __bY : 0,
      __ca : [],
      __cb : d,
      __cc : {
      },
      register : function(n){

        var q = this.__G;
        if(!q){

          return;
        };
        var p = n.$$hash;
        if(p == null){

          var o = this.__ca;
          if(o.length > 0 && true){

            p = o.pop();
          } else {

            p = (this.__bY++) + this.__cb;
          };
          n.$$hash = p;
          {
          };
        };
        {
        };
        q[p] = n;
      },
      unregister : function(r){

        var s = r.$$hash;
        if(s == null){

          return;
        };
        var t = this.__G;
        if(t && t[s]){

          delete t[s];
          this.__ca.push(s);
        };
        try{

          delete r.$$hash;
        } catch(u) {

          if(r.removeAttribute){

            r.removeAttribute(g);
          };
        };
      },
      toHashCode : function(v){

        {
        };
        var x = v.$$hash;
        if(x != null){

          return x;
        };
        var w = this.__ca;
        if(w.length > 0){

          x = w.pop();
        } else {

          x = (this.__bY++) + this.__cb;
        };
        return v.$$hash = x;
      },
      clearHashCode : function(y){

        {
        };
        var z = y.$$hash;
        if(z != null){

          this.__ca.push(z);
          try{

            delete y.$$hash;
          } catch(A) {

            if(y.removeAttribute){

              y.removeAttribute(g);
            };
          };
        };
      },
      fromHashCode : function(B){

        return this.__G[B] || null;
      },
      shutdown : function(){

        this.inShutDown = true;
        var D = this.__G;
        var F = [];
        for(var C in D){

          F.push(C);
        };
        F.sort(function(a, b){

          return parseInt(b, 10) - parseInt(a, 10);
        });
        var E,i = 0,l = F.length;
        while(true){

          try{

            for(;i < l;i++){

              C = F[i];
              E = D[C];
              if(E && E.dispose){

                E.dispose();
              };
            };
          } catch(G) {

            qx.Bootstrap.error(this, k + E.toString() + m + G, G);
            if(i !== l){

              i++;
              continue;
            };
          };
          break;
        };
        qx.Bootstrap.debug(this, f + l + j);
        delete this.__G;
      },
      getRegistry : function(){

        return this.__G;
      },
      getNextHash : function(){

        return this.__bY;
      },
      getPostId : function(){

        return this.__cb;
      },
      getStackTraces : function(){

        return this.__cc;
      }
    },
    defer : function(H){

      if(window && window.top){

        var frames = window.top.frames;
        for(var i = 0;i < frames.length;i++){

          if(frames[i] === window){

            H.__cb = c + (i + 1);
            return;
          };
        };
      };
      H.__cb = h;
    }
  });
})();
(function(){

  var a = "[object Opera]",b = "function",c = "[^\\.0-9]",d = "4.0",e = "gecko",f = "1.9.0.0",g = "Version/",h = "9.0",i = "8.0",j = "Gecko",k = "Maple",l = "AppleWebKit/",m = "Trident",n = "Unsupported client: ",o = "",p = "opera",q = "engine.version",r = "! Assumed gecko version 1.9.0.0 (Firefox 3.0).",s = "mshtml",t = "engine.name",u = "webkit",v = "5.0",w = ".",x = "qx.bom.client.Engine";
  qx.Bootstrap.define(x, {
    statics : {
      getVersion : function(){

        var A = window.navigator.userAgent;
        var B = o;
        if(qx.bom.client.Engine.__cd()){

          if(/Opera[\s\/]([0-9]+)\.([0-9])([0-9]*)/.test(A)){

            if(A.indexOf(g) != -1){

              var D = A.match(/Version\/(\d+)\.(\d+)/);
              B = D[1] + w + D[2].charAt(0) + w + D[2].substring(1, D[2].length);
            } else {

              B = RegExp.$1 + w + RegExp.$2;
              if(RegExp.$3 != o){

                B += w + RegExp.$3;
              };
            };
          };
        } else if(qx.bom.client.Engine.__ce()){

          if(/AppleWebKit\/([^ ]+)/.test(A)){

            B = RegExp.$1;
            var C = RegExp(c).exec(B);
            if(C){

              B = B.slice(0, C.index);
            };
          };
        } else if(qx.bom.client.Engine.__cg() || qx.bom.client.Engine.__cf()){

          if(/rv\:([^\);]+)(\)|;)/.test(A)){

            B = RegExp.$1;
          };
        } else if(qx.bom.client.Engine.__ch()){

          var z = /Trident\/([^\);]+)(\)|;)/.test(A);
          if(/MSIE\s+([^\);]+)(\)|;)/.test(A)){

            B = RegExp.$1;
            if(B < 8 && z){

              if(RegExp.$1 == d){

                B = i;
              } else if(RegExp.$1 == v){

                B = h;
              };
            };
          } else if(z){

            var D = /\brv\:(\d+?\.\d+?)\b/.exec(A);
            if(D){

              B = D[1];
            };
          };
        } else {

          var y = window.qxFail;
          if(y && typeof y === b){

            B = y().FULLVERSION;
          } else {

            B = f;
            qx.Bootstrap.warn(n + A + r);
          };
        };;;
        return B;
      },
      getName : function(){

        var name;
        if(qx.bom.client.Engine.__cd()){

          name = p;
        } else if(qx.bom.client.Engine.__ce()){

          name = u;
        } else if(qx.bom.client.Engine.__cg() || qx.bom.client.Engine.__cf()){

          name = e;
        } else if(qx.bom.client.Engine.__ch()){

          name = s;
        } else {

          var E = window.qxFail;
          if(E && typeof E === b){

            name = E().NAME;
          } else {

            name = e;
            qx.Bootstrap.warn(n + window.navigator.userAgent + r);
          };
        };;;
        return name;
      },
      __cd : function(){

        return window.opera && Object.prototype.toString.call(window.opera) == a;
      },
      __ce : function(){

        return window.navigator.userAgent.indexOf(l) != -1;
      },
      __cf : function(){

        return window.navigator.userAgent.indexOf(k) != -1;
      },
      __cg : function(){

        return window.navigator.mozApps && window.navigator.product === j && window.navigator.userAgent.indexOf(k) == -1 && window.navigator.userAgent.indexOf(m) == -1;
      },
      __ch : function(){

        return window.navigator.cpuClass && (/MSIE\s+([^\);]+)(\)|;)/.test(window.navigator.userAgent) || /Trident\/\d+?\.\d+?/.test(window.navigator.userAgent));
      }
    },
    defer : function(F){

      qx.core.Environment.add(q, F.getVersion);
      qx.core.Environment.add(t, F.getName);
    }
  });
})();
(function(){

  var a = "qx.log.Logger",b = "[",c = "...(+",d = "array",e = ")",f = "info",g = "node",h = "instance",j = "string",k = "null",m = "error",n = "#",o = "class",p = ": ",q = "warn",r = "document",s = "{...(",t = "",u = "number",v = "stringify",w = "]",x = "date",y = "unknown",z = "function",A = "text[",B = "[...(",C = "boolean",D = "\n",E = ")}",F = "debug",G = ")]",H = "map",I = "undefined",J = "object";
  qx.Bootstrap.define(a, {
    statics : {
      __ci : F,
      setLevel : function(K){

        this.__ci = K;
      },
      getLevel : function(){

        return this.__ci;
      },
      setTreshold : function(L){

        this.__cl.setMaxMessages(L);
      },
      getTreshold : function(){

        return this.__cl.getMaxMessages();
      },
      __cj : {
      },
      __ck : 0,
      register : function(P){

        if(P.$$id){

          return;
        };
        var M = this.__ck++;
        this.__cj[M] = P;
        P.$$id = M;
        var N = this.__cm;
        var O = this.__cl.getAllLogEvents();
        for(var i = 0,l = O.length;i < l;i++){

          if(N[O[i].level] >= N[this.__ci]){

            P.process(O[i]);
          };
        };
      },
      unregister : function(Q){

        var R = Q.$$id;
        if(R == null){

          return;
        };
        delete this.__cj[R];
        delete Q.$$id;
      },
      debug : function(T, S){

        qx.log.Logger.__cn(F, arguments);
      },
      info : function(V, U){

        qx.log.Logger.__cn(f, arguments);
      },
      warn : function(X, W){

        qx.log.Logger.__cn(q, arguments);
      },
      error : function(ba, Y){

        qx.log.Logger.__cn(m, arguments);
      },
      trace : function(bb){

        var bc = qx.dev.StackTrace.getStackTrace();
        qx.log.Logger.__cn(f, [(typeof bb !== I ? [bb].concat(bc) : bc).join(D)]);
      },
      deprecatedMethodWarning : function(bf, bd){

        {

          var be;
        };
      },
      deprecatedClassWarning : function(bi, bg){

        {

          var bh;
        };
      },
      deprecatedEventWarning : function(bl, event, bj){

        {

          var bk;
        };
      },
      deprecatedMixinWarning : function(bn, bm){

        {

          var bo;
        };
      },
      deprecatedConstantWarning : function(bs, bq, bp){

        {

          var self,br;
        };
      },
      deprecateMethodOverriding : function(bv, bu, bw, bt){

        {

          var bx;
        };
      },
      clear : function(){

        this.__cl.clearHistory();
      },
      __cl : new qx.log.appender.RingBuffer(50),
      __cm : {
        debug : 0,
        info : 1,
        warn : 2,
        error : 3
      },
      __cn : function(bz, bB){

        var bE = this.__cm;
        if(bE[bz] < bE[this.__ci]){

          return;
        };
        var by = bB.length < 2 ? null : bB[0];
        var bD = by ? 1 : 0;
        var bA = [];
        for(var i = bD,l = bB.length;i < l;i++){

          bA.push(this.__cp(bB[i], true));
        };
        var bF = new Date;
        var bG = {
          time : bF,
          offset : bF - qx.Bootstrap.LOADSTART,
          level : bz,
          items : bA,
          win : window
        };
        if(by){

          if(by.$$hash !== undefined){

            bG.object = by.$$hash;
          } else if(by.$$type){

            bG.clazz = by;
          } else if(by.constructor){

            bG.clazz = by.constructor;
          };;
        };
        this.__cl.process(bG);
        var bC = this.__cj;
        for(var bH in bC){

          bC[bH].process(bG);
        };
      },
      __co : function(bJ){

        if(bJ === undefined){

          return I;
        } else if(bJ === null){

          return k;
        };
        if(bJ.$$type){

          return o;
        };
        var bI = typeof bJ;
        if(bI === z || bI == j || bI === u || bI === C){

          return bI;
        } else if(bI === J){

          if(bJ.nodeType){

            return g;
          } else if(bJ instanceof Error || (bJ.name && bJ.message)){

            return m;
          } else if(bJ.classname){

            return h;
          } else if(bJ instanceof Array){

            return d;
          } else if(bJ instanceof Date){

            return x;
          } else {

            return H;
          };;;;
        };
        if(bJ.toString){

          return v;
        };
        return y;
      },
      __cp : function(bP, bO){

        var bS = this.__co(bP);
        var bM = y;
        var bL = [];
        switch(bS){case k:case I:
        bM = bS;
        break;case j:case u:case C:case x:
        bM = bP;
        break;case g:
        if(bP.nodeType === 9){

          bM = r;
        } else if(bP.nodeType === 3){

          bM = A + bP.nodeValue + w;
        } else if(bP.nodeType === 1){

          bM = bP.nodeName.toLowerCase();
          if(bP.id){

            bM += n + bP.id;
          };
        } else {

          bM = g;
        };;
        break;case z:
        bM = qx.lang.Function.getName(bP) || bS;
        break;case h:
        bM = bP.basename + b + bP.$$hash + w;
        break;case o:case v:
        bM = bP.toString();
        break;case m:
        bL = qx.dev.StackTrace.getStackTraceFromError(bP);
        bM = (bP.basename ? bP.basename + p : t) + bP.toString();
        break;case d:
        if(bO){

          bM = [];
          for(var i = 0,l = bP.length;i < l;i++){

            if(bM.length > 20){

              bM.push(c + (l - i) + e);
              break;
            };
            bM.push(this.__cp(bP[i], false));
          };
        } else {

          bM = B + bP.length + G;
        };
        break;case H:
        if(bO){

          var bK;
          var bR = [];
          for(var bQ in bP){

            bR.push(bQ);
          };
          bR.sort();
          bM = [];
          for(var i = 0,l = bR.length;i < l;i++){

            if(bM.length > 20){

              bM.push(c + (l - i) + e);
              break;
            };
            bQ = bR[i];
            bK = this.__cp(bP[bQ], false);
            bK.key = bQ;
            bM.push(bK);
          };
        } else {

          var bN = 0;
          for(var bQ in bP){

            bN++;
          };
          bM = s + bN + E;
        };
        break;};
        return {
          type : bS,
          text : bM,
          trace : bL
        };
      }
    },
    defer : function(bT){

      var bU = qx.Bootstrap.$$logs;
      for(var i = 0;i < bU.length;i++){

        bT.__cn(bU[i][0], bU[i][1]);
      };
      qx.Bootstrap.debug = bT.debug;
      qx.Bootstrap.info = bT.info;
      qx.Bootstrap.warn = bT.warn;
      qx.Bootstrap.error = bT.error;
      qx.Bootstrap.trace = bT.trace;
    }
  });
})();
(function(){

  var a = "qx.event.type.Data",b = "qx.event.type.Event",c = "qx.data.IListData";
  qx.Interface.define(c, {
    events : {
      "change" : a,
      "changeLength" : b
    },
    members : {
      getItem : function(d){
      },
      setItem : function(e, f){
      },
      splice : function(g, h, i){
      },
      contains : function(j){
      },
      getLength : function(){
      },
      toArray : function(){
      }
    }
  });
})();
(function(){

  var a = "qx.core.ValidationError";
  qx.Class.define(a, {
    extend : qx.type.BaseError
  });
})();
(function(){

  var a = "qx.core.MProperty",b = "get",c = "reset",d = "No such property: ",e = "set";
  qx.Mixin.define(a, {
    members : {
      set : function(g, h){

        var f = qx.core.Property.$$method.set;
        if(qx.Bootstrap.isString(g)){

          if(!this[f[g]]){

            if(this[e + qx.Bootstrap.firstUp(g)] != undefined){

              this[e + qx.Bootstrap.firstUp(g)](h);
              return this;
            };
            throw new Error(d + g);
          };
          return this[f[g]](h);
        } else {

          for(var i in g){

            if(!this[f[i]]){

              if(this[e + qx.Bootstrap.firstUp(i)] != undefined){

                this[e + qx.Bootstrap.firstUp(i)](g[i]);
                continue;
              };
              throw new Error(d + i);
            };
            this[f[i]](g[i]);
          };
          return this;
        };
      },
      get : function(k){

        var j = qx.core.Property.$$method.get;
        if(!this[j[k]]){

          if(this[b + qx.Bootstrap.firstUp(k)] != undefined){

            return this[b + qx.Bootstrap.firstUp(k)]();
          };
          throw new Error(d + k);
        };
        return this[j[k]]();
      },
      reset : function(m){

        var l = qx.core.Property.$$method.reset;
        if(!this[l[m]]){

          if(this[c + qx.Bootstrap.firstUp(m)] != undefined){

            this[c + qx.Bootstrap.firstUp(m)]();
            return;
          };
          throw new Error(d + m);
        };
        this[l[m]]();
      }
    }
  });
})();
(function(){

  var a = "info",b = "debug",c = "warn",d = "qx.core.MLogging",e = "error";
  qx.Mixin.define(d, {
    members : {
      __cq : qx.log.Logger,
      debug : function(f){

        this.__cr(b, arguments);
      },
      info : function(g){

        this.__cr(a, arguments);
      },
      warn : function(h){

        this.__cr(c, arguments);
      },
      error : function(i){

        this.__cr(e, arguments);
      },
      trace : function(){

        this.__cq.trace(this);
      },
      __cr : function(j, l){

        var k = qx.lang.Array.fromArguments(l);
        k.unshift(this);
        this.__cq[j].apply(this.__cq, k);
      }
    }
  });
})();
(function(){

  var a = "function",b = 'loadeddata',c = "pointerover",d = 'pause',f = "transitionend",g = "gecko",h = "browser.name",j = 'timeupdate',k = 'canplay',m = "HTMLEvents",n = 'loadedmetadata',o = "css.transition",p = "mobile safari",q = "return;",r = "browser.documentmode",s = "safari",t = 'play',u = 'ended',v = "",w = "qx.bom.Event",x = 'playing',y = "mouseover",z = "end-event",A = "mshtml",B = "engine.name",C = 'progress',D = "webkit",E = 'volumechange',F = 'seeked',G = "on",H = "undefined";
  qx.Bootstrap.define(w, {
    statics : {
      addNativeListener : function(L, K, I, J){

        if(L.addEventListener){

          L.addEventListener(K, I, !!J);
        } else if(L.attachEvent){

          L.attachEvent(G + K, I);
        } else if(typeof L[G + K] != H){

          L[G + K] = I;
        } else {

          {
          };
        };;
      },
      removeNativeListener : function(P, O, M, N){

        if(P.removeEventListener){

          P.removeEventListener(O, M, !!N);
        } else if(P.detachEvent){

          try{

            P.detachEvent(G + O, M);
          } catch(e) {

            if(e.number !== -2146828218){

              throw e;
            };
          };
        } else if(typeof P[G + O] != H){

          P[G + O] = null;
        } else {

          {
          };
        };;
      },
      getTarget : function(e){

        return e.target || e.srcElement;
      },
      getRelatedTarget : function(e){

        if(e.relatedTarget !== undefined){

          if((qx.core.Environment.get(B) == g)){

            try{

              e.relatedTarget && e.relatedTarget.nodeType;
            } catch(Q) {

              return null;
            };
          };
          return e.relatedTarget;
        } else if(e.fromElement !== undefined && (e.type === y || e.type === c)){

          return e.fromElement;
        } else if(e.toElement !== undefined){

          return e.toElement;
        } else {

          return null;
        };;
      },
      preventDefault : function(e){

        if(e.preventDefault){

          e.preventDefault();
        } else {

          try{

            e.keyCode = 0;
          } catch(R) {
          };
          e.returnValue = false;
        };
      },
      stopPropagation : function(e){

        if(e.stopPropagation){

          e.stopPropagation();
        } else {

          e.cancelBubble = true;
        };
      },
      fire : function(U, S){

        if(document.createEvent){

          var T = document.createEvent(m);
          T.initEvent(S, true, true);
          return !U.dispatchEvent(T);
        } else {

          var T = document.createEventObject();
          return U.fireEvent(G + S, T);
        };
      },
      supportsEvent : function(V, be){

        var ba = qx.core.Environment.get(h);
        var bb = qx.core.Environment.get(B);
        if(be.toLowerCase().indexOf(f) != -1 && bb === A && qx.core.Environment.get(r) > 9){

          return true;
        };
        var bc = [p, s];
        if(bb === D && bc.indexOf(ba) > -1){

          var W = [b, C, j, F, k, t, x, d, n, u, E];
          if(W.indexOf(be.toLowerCase()) > -1){

            return true;
          };
        };
        if(V != window && be.toLowerCase().indexOf(f) != -1){

          var bd = qx.core.Environment.get(o);
          return (bd && bd[z] == be);
        };
        var X = G + be.toLowerCase();
        var Y = (X in V);
        if(!Y){

          Y = typeof V[X] == a;
          if(!Y && V.setAttribute){

            V.setAttribute(X, q);
            Y = typeof V[X] == a;
            V.removeAttribute(X);
          };
        };
        return Y;
      },
      getEventName : function(bf, bi){

        var bg = [v].concat(qx.bom.Style.VENDOR_PREFIXES);
        for(var i = 0,l = bg.length;i < l;i++){

          var bh = bg[i].toLowerCase();
          if(qx.bom.Event.supportsEvent(bf, bh + bi)){

            return bh ? bh + qx.lang.String.firstUp(bi) : bi;
          };
        };
        return null;
      }
    }
  });
})();
(function(){

  var a = "qx.bom.client.CssTransition",b = "E",c = "transitionEnd",d = "e",e = "nd",f = "transition",g = "css.transition",h = "Trans";
  qx.Bootstrap.define(a, {
    statics : {
      getTransitionName : function(){

        return qx.bom.Style.getPropertyName(f);
      },
      getSupport : function(){

        var name = qx.bom.client.CssTransition.getTransitionName();
        if(!name){

          return null;
        };
        var i = qx.bom.Event.getEventName(window, c);
        i = i == c ? i.toLowerCase() : i;
        if(!i){

          i = name + (name.indexOf(h) > 0 ? b : d) + e;
        };
        return {
          name : name,
          "end-event" : i
        };
      }
    },
    defer : function(j){

      qx.core.Environment.add(g, j.getSupport);
    }
  });
})();
(function(){

  var a = "-",b = "qx.bom.Style",c = "",d = '-',e = "Webkit",f = "ms",g = ":",h = ";",j = "Moz",k = "O",m = "string",n = "Khtml";
  qx.Bootstrap.define(b, {
    statics : {
      VENDOR_PREFIXES : [e, j, k, f, n],
      __cs : {
      },
      __ct : null,
      getPropertyName : function(q){

        var o = document.documentElement.style;
        if(o[q] !== undefined){

          return q;
        };
        for(var i = 0,l = this.VENDOR_PREFIXES.length;i < l;i++){

          var p = this.VENDOR_PREFIXES[i] + qx.lang.String.firstUp(q);
          if(o[p] !== undefined){

            return p;
          };
        };
        return null;
      },
      getCssName : function(r){

        var s = this.__cs[r];
        if(!s){

          s = r.replace(/[A-Z]/g, function(t){

            return (d + t.charAt(0).toLowerCase());
          });
          if((/^ms/.test(s))){

            s = a + s;
          };
          this.__cs[r] = s;
        };
        return s;
      },
      getAppliedStyle : function(A, x, z, v){

        var C = qx.bom.Style.getCssName(x);
        var w = qx.dom.Node.getWindow(A);
        var u = (v !== false) ? [null].concat(this.VENDOR_PREFIXES) : [null];
        for(var i = 0,l = u.length;i < l;i++){

          var y = false;
          var B = u[i] ? a + u[i].toLowerCase() + a + z : z;
          if(qx.bom.Style.__ct){

            y = qx.bom.Style.__ct.call(w, C, B);
          } else {

            A.style.cssText += C + g + B + h;
            y = (typeof A.style[x] == m && A.style[x] !== c);
          };
          if(y){

            return B;
          };
        };
        return null;
      }
    },
    defer : function(D){

      if(window.CSS && window.CSS.supports){

        qx.bom.Style.__ct = window.CSS.supports.bind(window.CSS);
      } else if(window.supportsCSS){

        qx.bom.Style.__ct = window.supportsCSS.bind(window);
      };
    }
  });
})();
(function(){

  var b = "qx.dom.Node",c = "";
  qx.Bootstrap.define(b, {
    statics : {
      ELEMENT : 1,
      ATTRIBUTE : 2,
      TEXT : 3,
      CDATA_SECTION : 4,
      ENTITY_REFERENCE : 5,
      ENTITY : 6,
      PROCESSING_INSTRUCTION : 7,
      COMMENT : 8,
      DOCUMENT : 9,
      DOCUMENT_TYPE : 10,
      DOCUMENT_FRAGMENT : 11,
      NOTATION : 12,
      getDocument : function(d){

        return d.nodeType === this.DOCUMENT ? d : d.ownerDocument || d.document;
      },
      getWindow : function(e){

        if(e.nodeType == null){

          return e;
        };
        if(e.nodeType !== this.DOCUMENT){

          e = e.ownerDocument;
        };
        return e.defaultView || e.parentWindow;
      },
      getDocumentElement : function(f){

        return this.getDocument(f).documentElement;
      },
      getBodyElement : function(g){

        return this.getDocument(g).body;
      },
      isNode : function(h){

        return !!(h && h.nodeType != null);
      },
      isElement : function(j){

        return !!(j && j.nodeType === this.ELEMENT);
      },
      isDocument : function(k){

        return !!(k && k.nodeType === this.DOCUMENT);
      },
      isDocumentFragment : function(l){

        return !!(l && l.nodeType === this.DOCUMENT_FRAGMENT);
      },
      isText : function(m){

        return !!(m && m.nodeType === this.TEXT);
      },
      isWindow : function(n){

        return !!(n && n.history && n.location && n.document);
      },
      isNodeName : function(o, p){

        if(!p || !o || !o.nodeName){

          return false;
        };
        return p.toLowerCase() == qx.dom.Node.getName(o);
      },
      getName : function(q){

        if(!q || !q.nodeName){

          return null;
        };
        return q.nodeName.toLowerCase();
      },
      getText : function(r){

        if(!r || !r.nodeType){

          return null;
        };
        switch(r.nodeType){case 1:
        var i,a = [],s = r.childNodes,length = s.length;
        for(i = 0;i < length;i++){

          a[i] = this.getText(s[i]);
        };
        return a.join(c);case 2:case 3:case 4:
        return r.nodeValue;};
        return null;
      },
      isBlockNode : function(t){

        if(!qx.dom.Node.isElement(t)){

          return false;
        };
        t = qx.dom.Node.getName(t);
        return /^(body|form|textarea|fieldset|ul|ol|dl|dt|dd|li|div|hr|p|h[1-6]|quote|pre|table|thead|tbody|tfoot|tr|td|th|iframe|address|blockquote)$/.test(t);
      }
    }
  });
})();
(function(){

  var a = "rim_tabletos",b = "10.1",c = "Darwin",d = "10.3",e = "os.version",f = "10.7",g = "2003",h = ")",i = "iPhone",j = "android",k = "unix",l = "ce",m = "7",n = "SymbianOS",o = "10.5",p = "os.name",q = "10.9",r = "|",s = "MacPPC",t = "95",u = "iPod",v = "10.8",w = "\.",x = "Win64",y = "linux",z = "me",A = "10.2",B = "Macintosh",C = "Android",D = "Windows",E = "98",F = "ios",G = "vista",H = "8",I = "blackberry",J = "2000",K = "8.1",L = "(",M = "",N = "win",O = "Linux",P = "10.6",Q = "BSD",R = "10.0",S = "10.4",T = "Mac OS X",U = "iPad",V = "X11",W = "xp",X = "symbian",Y = "qx.bom.client.OperatingSystem",bo = "g",bp = "Win32",bq = "osx",bk = "webOS",bl = "RIM Tablet OS",bm = "BlackBerry",bn = "nt4",br = ".",bs = "MacIntel",bt = "webos";
  qx.Bootstrap.define(Y, {
    statics : {
      getName : function(){

        if(!navigator){

          return M;
        };
        var bu = navigator.platform || M;
        var bv = navigator.userAgent || M;
        if(bu.indexOf(D) != -1 || bu.indexOf(bp) != -1 || bu.indexOf(x) != -1){

          return N;
        } else if(bu.indexOf(B) != -1 || bu.indexOf(s) != -1 || bu.indexOf(bs) != -1 || bu.indexOf(T) != -1){

          return bq;
        } else if(bv.indexOf(bl) != -1){

          return a;
        } else if(bv.indexOf(bk) != -1){

          return bt;
        } else if(bu.indexOf(u) != -1 || bu.indexOf(i) != -1 || bu.indexOf(U) != -1){

          return F;
        } else if(bv.indexOf(C) != -1){

          return j;
        } else if(bu.indexOf(O) != -1){

          return y;
        } else if(bu.indexOf(V) != -1 || bu.indexOf(Q) != -1 || bu.indexOf(c) != -1){

          return k;
        } else if(bu.indexOf(n) != -1){

          return X;
        } else if(bu.indexOf(bm) != -1){

          return I;
        };;;;;;;;;
        return M;
      },
      __cu : {
        "Windows NT 6.3" : K,
        "Windows NT 6.2" : H,
        "Windows NT 6.1" : m,
        "Windows NT 6.0" : G,
        "Windows NT 5.2" : g,
        "Windows NT 5.1" : W,
        "Windows NT 5.0" : J,
        "Windows 2000" : J,
        "Windows NT 4.0" : bn,
        "Win 9x 4.90" : z,
        "Windows CE" : l,
        "Windows 98" : E,
        "Win98" : E,
        "Windows 95" : t,
        "Win95" : t,
        "Mac OS X 10_9" : q,
        "Mac OS X 10.9" : q,
        "Mac OS X 10_8" : v,
        "Mac OS X 10.8" : v,
        "Mac OS X 10_7" : f,
        "Mac OS X 10.7" : f,
        "Mac OS X 10_6" : P,
        "Mac OS X 10.6" : P,
        "Mac OS X 10_5" : o,
        "Mac OS X 10.5" : o,
        "Mac OS X 10_4" : S,
        "Mac OS X 10.4" : S,
        "Mac OS X 10_3" : d,
        "Mac OS X 10.3" : d,
        "Mac OS X 10_2" : A,
        "Mac OS X 10.2" : A,
        "Mac OS X 10_1" : b,
        "Mac OS X 10.1" : b,
        "Mac OS X 10_0" : R,
        "Mac OS X 10.0" : R
      },
      getVersion : function(){

        var bw = qx.bom.client.OperatingSystem.__cv(navigator.userAgent);
        if(bw == null){

          bw = qx.bom.client.OperatingSystem.__cw(navigator.userAgent);
        };
        if(bw != null){

          return bw;
        } else {

          return M;
        };
      },
      __cv : function(bx){

        var bA = [];
        for(var bz in qx.bom.client.OperatingSystem.__cu){

          bA.push(bz);
        };
        var bB = new RegExp(L + bA.join(r).replace(/\./g, w) + h, bo);
        var by = bB.exec(bx);
        if(by && by[1]){

          return qx.bom.client.OperatingSystem.__cu[by[1]];
        };
        return null;
      },
      __cw : function(bF){

        var bG = bF.indexOf(C) != -1;
        var bC = bF.match(/(iPad|iPhone|iPod)/i) ? true : false;
        if(bG){

          var bE = new RegExp(/ Android (\d+(?:\.\d+)+)/i);
          var bH = bE.exec(bF);
          if(bH && bH[1]){

            return bH[1];
          };
        } else if(bC){

          var bI = new RegExp(/(CPU|iPhone|iPod) OS (\d+)_(\d+)(?:_(\d+))*\s+/);
          var bD = bI.exec(bF);
          if(bD && bD[2] && bD[3]){

            if(bD[4]){

              return bD[2] + br + bD[3] + br + bD[4];
            } else {

              return bD[2] + br + bD[3];
            };
          };
        };
        return null;
      }
    },
    defer : function(bJ){

      qx.core.Environment.add(p, bJ.getName);
      qx.core.Environment.add(e, bJ.getVersion);
    }
  });
})();
(function(){

  var a = "CSS1Compat",b = "IEMobile",c = " OPR/",d = "msie",e = "android",f = "operamini",g = "gecko",h = "maple",i = "AdobeAIR|Titanium|Fluid|Chrome|Android|Epiphany|Konqueror|iCab|iPad|iPhone|OmniWeb|Maxthon|Pre|PhantomJS|Mobile Safari|Safari",j = "browser.quirksmode",k = "browser.name",l = "trident",m = "mobile chrome",n = ")(/| )([0-9]+\.[0-9])",o = "iemobile",p = "prism|Fennec|Camino|Kmeleon|Galeon|Netscape|SeaMonkey|Namoroka|Firefox",q = "IEMobile|Maxthon|MSIE|Trident",r = "opera mobi",s = "Mobile Safari",t = "Maple",u = "operamobile",v = "ie",w = "mobile safari",x = "qx.bom.client.Browser",y = "(Maple )([0-9]+\.[0-9]+\.[0-9]*)",z = "",A = "opera mini",B = "(",C = "browser.version",D = "opera",E = "ce",F = ")(/|)?([0-9]+\.[0-9])?",G = "mshtml",H = "Opera Mini|Opera Mobi|Opera",I = "webkit",J = "browser.documentmode",K = "5.0",L = "Mobile/";
  qx.Bootstrap.define(x, {
    statics : {
      getName : function(){

        var O = navigator.userAgent;
        var P = new RegExp(B + qx.bom.client.Browser.__cx + F);
        var N = O.match(P);
        if(!N){

          return z;
        };
        var name = N[1].toLowerCase();
        var M = qx.bom.client.Engine.getName();
        if(M === I){

          if(name === e){

            name = m;
          } else if(O.indexOf(s) !== -1 || O.indexOf(L) !== -1){

            name = w;
          } else if(O.indexOf(c) != -1){

            name = D;
          };;
        } else if(M === G){

          if(name === d || name === l){

            name = v;
            if(qx.bom.client.OperatingSystem.getVersion() === E){

              name = o;
            };
            var P = new RegExp(b);
            if(O.match(P)){

              name = o;
            };
          };
        } else if(M === D){

          if(name === r){

            name = u;
          } else if(name === A){

            name = f;
          };
        } else if(M === g){

          if(O.indexOf(t) !== -1){

            name = h;
          };
        };;;
        return name;
      },
      getVersion : function(){

        var S = navigator.userAgent;
        var T = new RegExp(B + qx.bom.client.Browser.__cx + n);
        var Q = S.match(T);
        if(!Q){

          return z;
        };
        var name = Q[1].toLowerCase();
        var R = Q[3];
        if(S.match(/Version(\/| )([0-9]+\.[0-9])/)){

          R = RegExp.$2;
        };
        if(qx.bom.client.Engine.getName() == G){

          R = qx.bom.client.Engine.getVersion();
          if(name === d && qx.bom.client.OperatingSystem.getVersion() == E){

            R = K;
          };
        };
        if(qx.bom.client.Browser.getName() == h){

          T = new RegExp(y);
          Q = S.match(T);
          if(!Q){

            return z;
          };
          R = Q[2];
        };
        if(qx.bom.client.Engine.getName() == I || qx.bom.client.Browser.getName() == D){

          if(S.match(/OPR(\/| )([0-9]+\.[0-9])/)){

            R = RegExp.$2;
          };
        };
        return R;
      },
      getDocumentMode : function(){

        if(document.documentMode){

          return document.documentMode;
        };
        return 0;
      },
      getQuirksMode : function(){

        if(qx.bom.client.Engine.getName() == G && parseFloat(qx.bom.client.Engine.getVersion()) >= 8){

          return qx.bom.client.Engine.DOCUMENT_MODE === 5;
        } else {

          return document.compatMode !== a;
        };
      },
      __cx : {
        "webkit" : i,
        "gecko" : p,
        "mshtml" : q,
        "opera" : H
      }[qx.bom.client.Engine.getName()]
    },
    defer : function(U){

      qx.core.Environment.add(k, U.getName);
      qx.core.Environment.add(C, U.getVersion);
      qx.core.Environment.add(J, U.getDocumentMode);
      qx.core.Environment.add(j, U.getQuirksMode);
    }
  });
})();
(function(){

  var a = "__cD",b = "UNKNOWN_",c = "|bubble",d = "",e = "_",f = "c",g = "|",h = "unload",j = "|capture",k = "DOM_",m = "WIN_",n = "QX_",o = "qx.event.Manager",p = "capture",q = "__cC",r = "DOCUMENT_";
  qx.Class.define(o, {
    extend : Object,
    construct : function(s, t){

      this.__cy = s;
      this.__cz = qx.core.ObjectRegistry.toHashCode(s);
      this.__cA = t;
      if(s.qx !== qx){

        var self = this;
        qx.bom.Event.addNativeListener(s, h, qx.event.GlobalError.observeMethod(function(){

          qx.bom.Event.removeNativeListener(s, h, arguments.callee);
          self.dispose();
        }));
      };
      this.__cB = {
      };
      this.__cC = {
      };
      this.__cD = {
      };
      this.__cE = {
      };
    },
    statics : {
      __cF : 0,
      getNextUniqueId : function(){

        return (this.__cF++) + d;
      }
    },
    members : {
      __cA : null,
      __cB : null,
      __cD : null,
      __cG : null,
      __cC : null,
      __cE : null,
      __cy : null,
      __cz : null,
      getWindow : function(){

        return this.__cy;
      },
      getWindowId : function(){

        return this.__cz;
      },
      getHandler : function(v){

        var u = this.__cC[v.classname];
        if(u){

          return u;
        };
        return this.__cC[v.classname] = new v(this);
      },
      getDispatcher : function(x){

        var w = this.__cD[x.classname];
        if(w){

          return w;
        };
        return this.__cD[x.classname] = new x(this, this.__cA);
      },
      getListeners : function(z, D, y){

        var B = z.$$hash || qx.core.ObjectRegistry.toHashCode(z);
        var E = this.__cB[B];
        if(!E){

          return null;
        };
        var C = D + (y ? j : c);
        var A = E[C];
        return A ? A.concat() : null;
      },
      getAllListeners : function(){

        return this.__cB;
      },
      serializeListeners : function(G){

        var K = G.$$hash || qx.core.ObjectRegistry.toHashCode(G);
        var O = this.__cB[K];
        var J = [];
        if(O){

          var H,N,F,I,L;
          for(var M in O){

            H = M.indexOf(g);
            N = M.substring(0, H);
            F = M.charAt(H + 1) == f;
            I = O[M];
            for(var i = 0,l = I.length;i < l;i++){

              L = I[i];
              J.push({
                self : L.context,
                handler : L.handler,
                type : N,
                capture : F
              });
            };
          };
        };
        return J;
      },
      toggleAttachedEvents : function(R, Q){

        var U = R.$$hash || qx.core.ObjectRegistry.toHashCode(R);
        var X = this.__cB[U];
        if(X){

          var S,W,P,T;
          for(var V in X){

            S = V.indexOf(g);
            W = V.substring(0, S);
            P = V.charCodeAt(S + 1) === 99;
            T = X[V];
            if(Q){

              this.__cH(R, W, P);
            } else {

              this.__cI(R, W, P);
            };
          };
        };
      },
      hasListener : function(ba, be, Y){

        {
        };
        var bc = ba.$$hash || qx.core.ObjectRegistry.toHashCode(ba);
        var bf = this.__cB[bc];
        if(!bf){

          return false;
        };
        var bd = be + (Y ? j : c);
        var bb = bf[bd];
        return !!(bb && bb.length > 0);
      },
      importListeners : function(bg, bi){

        {
        };
        var bm = bg.$$hash || qx.core.ObjectRegistry.toHashCode(bg);
        var bo = this.__cB[bm] = {
        };
        var bk = qx.event.Manager;
        for(var bh in bi){

          var bl = bi[bh];
          var bn = bl.type + (bl.capture ? j : c);
          var bj = bo[bn];
          if(!bj){

            bj = bo[bn] = [];
            this.__cH(bg, bl.type, bl.capture);
          };
          bj.push({
            handler : bl.listener,
            context : bl.self,
            unique : bl.unique || (bk.__cF++) + d
          });
        };
      },
      addListener : function(br, by, bt, self, bp){

        {

          var bv;
        };
        var bq = br.$$hash || qx.core.ObjectRegistry.toHashCode(br);
        var bz = this.__cB[bq];
        if(!bz){

          bz = this.__cB[bq] = {
          };
        };
        var bu = by + (bp ? j : c);
        var bs = bz[bu];
        if(!bs){

          bs = bz[bu] = [];
        };
        if(bs.length === 0){

          this.__cH(br, by, bp);
        };
        var bx = (qx.event.Manager.__cF++) + d;
        var bw = {
          handler : bt,
          context : self,
          unique : bx
        };
        bs.push(bw);
        return bu + g + bx;
      },
      findHandler : function(bE, bN){

        var bL = false,bD = false,bO = false,bA = false;
        var bK;
        if(bE.nodeType === 1){

          bL = true;
          bK = k + bE.tagName.toLowerCase() + e + bN;
        } else if(bE.nodeType === 9){

          bA = true;
          bK = r + bN;
        } else if(bE == this.__cy){

          bD = true;
          bK = m + bN;
        } else if(bE.classname){

          bO = true;
          bK = n + bE.classname + e + bN;
        } else {

          bK = b + bE + e + bN;
        };;;
        var bC = this.__cE;
        if(bC[bK]){

          return bC[bK];
        };
        var bJ = this.__cA.getHandlers();
        var bF = qx.event.IEventHandler;
        var bH,bI,bG,bB;
        for(var i = 0,l = bJ.length;i < l;i++){

          bH = bJ[i];
          bG = bH.SUPPORTED_TYPES;
          if(bG && !bG[bN]){

            continue;
          };
          bB = bH.TARGET_CHECK;
          if(bB){

            var bM = false;
            if(bL && ((bB & bF.TARGET_DOMNODE) != 0)){

              bM = true;
            } else if(bD && ((bB & bF.TARGET_WINDOW) != 0)){

              bM = true;
            } else if(bO && ((bB & bF.TARGET_OBJECT) != 0)){

              bM = true;
            } else if(bA && ((bB & bF.TARGET_DOCUMENT) != 0)){

              bM = true;
            };;;
            if(!bM){

              continue;
            };
          };
          bI = this.getHandler(bJ[i]);
          if(bH.IGNORE_CAN_HANDLE || bI.canHandleEvent(bE, bN)){

            bC[bK] = bI;
            return bI;
          };
        };
        return null;
      },
      __cH : function(bS, bR, bP){

        var bQ = this.findHandler(bS, bR);
        if(bQ){

          bQ.registerEvent(bS, bR, bP);
          return;
        };
        {
        };
      },
      removeListener : function(bV, cc, bX, self, bT){

        {

          var ca;
        };
        var bU = bV.$$hash || qx.core.ObjectRegistry.toHashCode(bV);
        var cd = this.__cB[bU];
        if(!cd){

          return false;
        };
        var bY = cc + (bT ? j : c);
        var bW = cd[bY];
        if(!bW){

          return false;
        };
        var cb;
        for(var i = 0,l = bW.length;i < l;i++){

          cb = bW[i];
          if(cb.handler === bX && cb.context === self){

            qx.lang.Array.removeAt(bW, i);
            if(bW.length == 0){

              this.__cI(bV, cc, bT);
            };
            return true;
          };
        };
        return false;
      },
      removeListenerById : function(cg, co){

        {

          var ck;
        };
        var ci = co.split(g);
        var cn = ci[0];
        var ce = ci[1].charCodeAt(0) == 99;
        var cm = ci[2];
        var cf = cg.$$hash || qx.core.ObjectRegistry.toHashCode(cg);
        var cp = this.__cB[cf];
        if(!cp){

          return false;
        };
        var cj = cn + (ce ? j : c);
        var ch = cp[cj];
        if(!ch){

          return false;
        };
        var cl;
        for(var i = 0,l = ch.length;i < l;i++){

          cl = ch[i];
          if(cl.unique === cm){

            qx.lang.Array.removeAt(ch, i);
            if(ch.length == 0){

              this.__cI(cg, cn, ce);
            };
            return true;
          };
        };
        return false;
      },
      removeAllListeners : function(cr){

        var ct = cr.$$hash || qx.core.ObjectRegistry.toHashCode(cr);
        var cw = this.__cB[ct];
        if(!cw){

          return false;
        };
        var cs,cv,cq;
        for(var cu in cw){

          if(cw[cu].length > 0){

            cs = cu.split(g);
            cv = cs[0];
            cq = cs[1] === p;
            this.__cI(cr, cv, cq);
          };
        };
        delete this.__cB[ct];
        return true;
      },
      deleteAllListeners : function(cx){

        delete this.__cB[cx];
      },
      __cI : function(cB, cA, cy){

        var cz = this.findHandler(cB, cA);
        if(cz){

          cz.unregisterEvent(cB, cA, cy);
          return;
        };
        {
        };
      },
      dispatchEvent : function(cD, event){

        {

          var cH;
        };
        var cI = event.getType();
        if(!event.getBubbles() && !this.hasListener(cD, cI)){

          qx.event.Pool.getInstance().poolObject(event);
          return true;
        };
        if(!event.getTarget()){

          event.setTarget(cD);
        };
        var cG = this.__cA.getDispatchers();
        var cF;
        var cC = false;
        for(var i = 0,l = cG.length;i < l;i++){

          cF = this.getDispatcher(cG[i]);
          if(cF.canDispatchEvent(cD, event, cI)){

            cF.dispatchEvent(cD, event, cI);
            cC = true;
            break;
          };
        };
        if(!cC){

          {
          };
          return true;
        };
        var cE = event.getDefaultPrevented();
        qx.event.Pool.getInstance().poolObject(event);
        return !cE;
      },
      dispose : function(){

        this.__cA.removeManager(this);
        qx.util.DisposeUtil.disposeMap(this, q);
        qx.util.DisposeUtil.disposeMap(this, a);
        this.__cB = this.__cy = this.__cG = null;
        this.__cA = this.__cE = null;
      }
    }
  });
})();
(function(){

  var a = " is a singleton! Please use disposeSingleton instead.",b = "undefined",c = "qx.util.DisposeUtil",d = " of object: ",e = "!",f = " has non disposable entries: ",g = "The map field: ",h = "The array field: ",j = "The object stored in key ",k = "Has no disposable object under key: ";
  qx.Class.define(c, {
    statics : {
      disposeObjects : function(n, m, o){

        var name;
        for(var i = 0,l = m.length;i < l;i++){

          name = m[i];
          if(n[name] == null || !n.hasOwnProperty(name)){

            continue;
          };
          if(!qx.core.ObjectRegistry.inShutDown){

            if(n[name].dispose){

              if(!o && n[name].constructor.$$instance){

                throw new Error(j + name + a);
              } else {

                n[name].dispose();
              };
            } else {

              throw new Error(k + name + e);
            };
          };
          n[name] = null;
        };
      },
      disposeArray : function(q, p){

        var r = q[p];
        if(!r){

          return;
        };
        if(qx.core.ObjectRegistry.inShutDown){

          q[p] = null;
          return;
        };
        try{

          var s;
          for(var i = r.length - 1;i >= 0;i--){

            s = r[i];
            if(s){

              s.dispose();
            };
          };
        } catch(t) {

          throw new Error(h + p + d + q + f + t);
        };
        r.length = 0;
        q[p] = null;
      },
      disposeMap : function(v, u){

        var w = v[u];
        if(!w){

          return;
        };
        if(qx.core.ObjectRegistry.inShutDown){

          v[u] = null;
          return;
        };
        try{

          var y;
          for(var x in w){

            y = w[x];
            if(w.hasOwnProperty(x) && y){

              y.dispose();
            };
          };
        } catch(z) {

          throw new Error(g + u + d + v + f + z);
        };
        v[u] = null;
      },
      disposeTriggeredBy : function(A, C){

        var B = C.dispose;
        C.dispose = function(){

          B.call(C);
          A.dispose();
        };
      },
      destroyContainer : function(E){

        {
        };
        var D = [];
        this._collectContainerChildren(E, D);
        var F = D.length;
        for(var i = F - 1;i >= 0;i--){

          D[i].destroy();
        };
        E.destroy();
      },
      _collectContainerChildren : function(I, H){

        var J = I.getChildren();
        for(var i = 0;i < J.length;i++){

          var G = J[i];
          H.push(G);
          if(this.__cJ(G)){

            this._collectContainerChildren(G, H);
          };
        };
      },
      __cJ : function(L){

        var K = [];
        if(qx.ui.mobile && L instanceof qx.ui.mobile.core.Widget){

          K = [qx.ui.mobile.container.Composite];
        } else {

          K = [qx.ui.container.Composite, qx.ui.container.Scroll, qx.ui.container.SlideBar, qx.ui.container.Stack];
        };
        for(var i = 0,l = K.length;i < l;i++){

          if(typeof K[i] !== b && qx.Class.isSubClassOf(L.constructor, K[i])){

            return true;
          };
        };
        return false;
      }
    }
  });
})();
(function(){

  var c = "qx.event.Registration";
  qx.Class.define(c, {
    statics : {
      __cK : {
      },
      getManager : function(f){

        if(f == null){

          {
          };
          f = window;
        } else if(f.nodeType){

          f = qx.dom.Node.getWindow(f);
        } else if(!qx.dom.Node.isWindow(f)){

          f = window;
        };;
        var e = f.$$hash || qx.core.ObjectRegistry.toHashCode(f);
        var d = this.__cK[e];
        if(!d){

          d = new qx.event.Manager(f, this);
          this.__cK[e] = d;
        };
        return d;
      },
      removeManager : function(g){

        var h = g.getWindowId();
        delete this.__cK[h];
      },
      addListener : function(l, k, i, self, j){

        return this.getManager(l).addListener(l, k, i, self, j);
      },
      removeListener : function(p, o, m, self, n){

        return this.getManager(p).removeListener(p, o, m, self, n);
      },
      removeListenerById : function(q, r){

        return this.getManager(q).removeListenerById(q, r);
      },
      removeAllListeners : function(s){

        return this.getManager(s).removeAllListeners(s);
      },
      deleteAllListeners : function(u){

        var t = u.$$hash;
        if(t){

          this.getManager(u).deleteAllListeners(t);
        };
      },
      hasListener : function(x, w, v){

        return this.getManager(x).hasListener(x, w, v);
      },
      serializeListeners : function(y){

        return this.getManager(y).serializeListeners(y);
      },
      createEvent : function(B, C, A){

        {
        };
        if(C == null){

          C = qx.event.type.Event;
        };
        var z = qx.event.Pool.getInstance().getObject(C);
        A ? z.init.apply(z, A) : z.init();
        if(B){

          z.setType(B);
        };
        return z;
      },
      dispatchEvent : function(D, event){

        return this.getManager(D).dispatchEvent(D, event);
      },
      fireEvent : function(E, F, H, G){

        {

          var I;
        };
        var J = this.createEvent(F, H || null, G);
        return this.getManager(E).dispatchEvent(E, J);
      },
      fireNonBubblingEvent : function(K, P, N, M){

        {
        };
        var O = this.getManager(K);
        if(!O.hasListener(K, P, false)){

          return true;
        };
        var L = this.createEvent(P, N || null, M);
        return O.dispatchEvent(K, L);
      },
      PRIORITY_FIRST : -32000,
      PRIORITY_NORMAL : 0,
      PRIORITY_LAST : 32000,
      __cC : [],
      addHandler : function(Q){

        {
        };
        this.__cC.push(Q);
        this.__cC.sort(function(a, b){

          return a.PRIORITY - b.PRIORITY;
        });
      },
      getHandlers : function(){

        return this.__cC;
      },
      __cD : [],
      addDispatcher : function(S, R){

        {
        };
        this.__cD.push(S);
        this.__cD.sort(function(a, b){

          return a.PRIORITY - b.PRIORITY;
        });
      },
      getDispatchers : function(){

        return this.__cD;
      }
    }
  });
})();
(function(){

  var a = "qx.core.MEvent";
  qx.Mixin.define(a, {
    members : {
      __cL : qx.event.Registration,
      addListener : function(d, b, self, c){

        if(!this.$$disposed){

          return this.__cL.addListener(this, d, b, self, c);
        };
        return null;
      },
      addListenerOnce : function(h, f, self, g){

        var i = function(e){

          this.removeListener(h, f, this, g);
          f.call(self || this, e);
        };
        if(!f.$$wrapped_callback){

          f.$$wrapped_callback = {
          };
        };
        f.$$wrapped_callback[h + this.$$hash] = i;
        return this.addListener(h, i, this, g);
      },
      removeListener : function(l, j, self, k){

        if(!this.$$disposed){

          if(j.$$wrapped_callback && j.$$wrapped_callback[l + this.$$hash]){

            var m = j.$$wrapped_callback[l + this.$$hash];
            delete j.$$wrapped_callback[l + this.$$hash];
            j = m;
          };
          return this.__cL.removeListener(this, l, j, self, k);
        };
        return false;
      },
      removeListenerById : function(n){

        if(!this.$$disposed){

          return this.__cL.removeListenerById(this, n);
        };
        return false;
      },
      hasListener : function(p, o){

        return this.__cL.hasListener(this, p, o);
      },
      dispatchEvent : function(q){

        if(!this.$$disposed){

          return this.__cL.dispatchEvent(this, q);
        };
        return true;
      },
      fireEvent : function(s, t, r){

        if(!this.$$disposed){

          return this.__cL.fireEvent(this, s, t, r);
        };
        return true;
      },
      fireNonBubblingEvent : function(v, w, u){

        if(!this.$$disposed){

          return this.__cL.fireNonBubblingEvent(this, v, w, u);
        };
        return true;
      },
      fireDataEvent : function(z, A, x, y){

        if(!this.$$disposed){

          if(x === undefined){

            x = null;
          };
          return this.__cL.fireNonBubblingEvent(this, z, qx.event.type.Data, [A, x, !!y]);
        };
        return true;
      }
    }
  });
})();
(function(){

  var a = "qx.core.MAssert";
  qx.Mixin.define(a, {
    members : {
      assert : function(c, b){

        qx.core.Assert.assert(c, b);
      },
      fail : function(d, e){

        qx.core.Assert.fail(d, e);
      },
      assertTrue : function(g, f){

        qx.core.Assert.assertTrue(g, f);
      },
      assertFalse : function(i, h){

        qx.core.Assert.assertFalse(i, h);
      },
      assertEquals : function(j, k, l){

        qx.core.Assert.assertEquals(j, k, l);
      },
      assertNotEquals : function(m, n, o){

        qx.core.Assert.assertNotEquals(m, n, o);
      },
      assertIdentical : function(p, q, r){

        qx.core.Assert.assertIdentical(p, q, r);
      },
      assertNotIdentical : function(s, t, u){

        qx.core.Assert.assertNotIdentical(s, t, u);
      },
      assertNotUndefined : function(w, v){

        qx.core.Assert.assertNotUndefined(w, v);
      },
      assertUndefined : function(y, x){

        qx.core.Assert.assertUndefined(y, x);
      },
      assertNotNull : function(A, z){

        qx.core.Assert.assertNotNull(A, z);
      },
      assertNull : function(C, B){

        qx.core.Assert.assertNull(C, B);
      },
      assertJsonEquals : function(D, E, F){

        qx.core.Assert.assertJsonEquals(D, E, F);
      },
      assertMatch : function(I, H, G){

        qx.core.Assert.assertMatch(I, H, G);
      },
      assertArgumentsCount : function(L, K, M, J){

        qx.core.Assert.assertArgumentsCount(L, K, M, J);
      },
      assertEventFired : function(P, event, Q, N, O){

        qx.core.Assert.assertEventFired(P, event, Q, N, O);
      },
      assertEventNotFired : function(T, event, R, S){

        qx.core.Assert.assertEventNotFired(T, event, R, S);
      },
      assertException : function(V, W, X, U){

        qx.core.Assert.assertException(V, W, X, U);
      },
      assertInArray : function(bb, ba, Y){

        qx.core.Assert.assertInArray(bb, ba, Y);
      },
      assertArrayEquals : function(bc, bd, be){

        qx.core.Assert.assertArrayEquals(bc, bd, be);
      },
      assertKeyInMap : function(bh, bg, bf){

        qx.core.Assert.assertKeyInMap(bh, bg, bf);
      },
      assertFunction : function(bj, bi){

        qx.core.Assert.assertFunction(bj, bi);
      },
      assertString : function(bl, bk){

        qx.core.Assert.assertString(bl, bk);
      },
      assertBoolean : function(bn, bm){

        qx.core.Assert.assertBoolean(bn, bm);
      },
      assertNumber : function(bp, bo){

        qx.core.Assert.assertNumber(bp, bo);
      },
      assertPositiveNumber : function(br, bq){

        qx.core.Assert.assertPositiveNumber(br, bq);
      },
      assertInteger : function(bt, bs){

        qx.core.Assert.assertInteger(bt, bs);
      },
      assertPositiveInteger : function(bv, bu){

        qx.core.Assert.assertPositiveInteger(bv, bu);
      },
      assertInRange : function(by, bz, bx, bw){

        qx.core.Assert.assertInRange(by, bz, bx, bw);
      },
      assertObject : function(bB, bA){

        qx.core.Assert.assertObject(bB, bA);
      },
      assertArray : function(bD, bC){

        qx.core.Assert.assertArray(bD, bC);
      },
      assertMap : function(bF, bE){

        qx.core.Assert.assertMap(bF, bE);
      },
      assertRegExp : function(bH, bG){

        qx.core.Assert.assertRegExp(bH, bG);
      },
      assertType : function(bK, bJ, bI){

        qx.core.Assert.assertType(bK, bJ, bI);
      },
      assertInstance : function(bM, bN, bL){

        qx.core.Assert.assertInstance(bM, bN, bL);
      },
      assertInterface : function(bQ, bP, bO){

        qx.core.Assert.assertInterface(bQ, bP, bO);
      },
      assertCssColor : function(bR, bT, bS){

        qx.core.Assert.assertCssColor(bR, bT, bS);
      },
      assertElement : function(bV, bU){

        qx.core.Assert.assertElement(bV, bU);
      },
      assertQxObject : function(bX, bW){

        qx.core.Assert.assertQxObject(bX, bW);
      },
      assertQxWidget : function(ca, bY){

        qx.core.Assert.assertQxWidget(ca, bY);
      }
    }
  });
})();
(function(){

  var a = "module.events",b = "Cloning only possible with properties.",c = "qx.core.Object",d = "module.property",e = 'Method "qx.core.Object.self" cannot be used in strict mode.',g = "qx.strict",h = "]",j = "[",k = 'Method "qx.core.Object.base" cannot be used in strict mode.',m = "Object";
  qx.Class.define(c, {
    extend : Object,
    include : qx.core.Environment.filter({
      "module.databinding" : qx.data.MBinding,
      "module.logger" : qx.core.MLogging,
      "module.events" : qx.core.MEvent,
      "module.property" : qx.core.MProperty
    }),
    construct : function(){

      qx.core.ObjectRegistry.register(this);
    },
    statics : {
      $$type : m
    },
    members : {
      __M : qx.core.Environment.get(d) ? qx.core.Property : null,
      toHashCode : function(){

        return this.$$hash;
      },
      toString : function(){

        return this.classname + j + this.$$hash + h;
      },
      callee : function(o){

        function y(f){

          var p = function(){

            return f.bind(this, y(f)).apply(this, arguments);
          };
          p.base = o.base;
          return p;
        };
        var n = y.call(this, this.base__);
        if(arguments.length === 2){

          return n.call(this);
        } else {

          return n.apply(this, Array.prototype.slice.call(arguments, 2));
        };
      },
      base__ : function(r, q, s){

        {
        };
        return r.base.apply(this, Array.prototype.slice.call(arguments, 1));
      },
      base : function(t, u){

        if(qx.core.Environment.get(g)){

          throw new Error(k);
        };
        {
        };
        if(arguments.length === 1){

          return t.callee.base.call(this);
        } else {

          return t.callee.base.apply(this, Array.prototype.slice.call(arguments, 1));
        };
      },
      self : function(v){

        if(qx.core.Environment.get(g)){

          throw new Error(e);
        };
        return v.callee.self;
      },
      clone : function(){

        if(!qx.core.Environment.get(d)){

          throw new Error(b);
        };
        var x = this.constructor;
        var w = new x;
        var A = qx.Class.getProperties(x);
        var z = this.__M.$$store.user;
        var B = this.__M.$$method.set;
        var name;
        for(var i = 0,l = A.length;i < l;i++){

          name = A[i];
          if(this.hasOwnProperty(z[name])){

            w[B[name]](this[z[name]]);
          };
        };
        return w;
      },
      __cM : null,
      setUserData : function(C, D){

        if(!this.__cM){

          this.__cM = {
          };
        };
        this.__cM[C] = D;
      },
      getUserData : function(F){

        if(!this.__cM){

          return null;
        };
        var E = this.__cM[F];
        return E === undefined ? null : E;
      },
      isDisposed : function(){

        return this.$$disposed || false;
      },
      dispose : function(){

        if(this.$$disposed){

          return;
        };
        this.$$disposed = true;
        this.$$instance = null;
        this.$$allowconstruct = null;
        {
        };
        var I = this.constructor;
        var G;
        while(I.superclass){

          if(I.$$destructor){

            I.$$destructor.call(this);
          };
          if(I.$$includes){

            G = I.$$flatIncludes;
            for(var i = 0,l = G.length;i < l;i++){

              if(G[i].$$destructor){

                G[i].$$destructor.call(this);
              };
            };
          };
          I = I.superclass;
        };
        {

          var J,H;
        };
      },
      _disposeObjects : function(K){

        qx.util.DisposeUtil.disposeObjects(this, arguments);
      },
      _disposeSingletonObjects : function(L){

        qx.util.DisposeUtil.disposeObjects(this, arguments, true);
      },
      _disposeArray : function(M){

        qx.util.DisposeUtil.disposeArray(this, M);
      },
      _disposeMap : function(N){

        qx.util.DisposeUtil.disposeMap(this, N);
      }
    },
    environment : {
      "qx.debug.dispose.level" : 0
    },
    destruct : function(){

      if(qx.core.Environment.get(a)){

        if(!qx.core.ObjectRegistry.inShutDown){

          qx.event.Registration.removeAllListeners(this);
        } else {

          qx.event.Registration.deleteAllListeners(this);
        };
      };
      qx.core.ObjectRegistry.unregister(this);
      this.__cM = null;
      if(qx.core.Environment.get(d)){

        var Q = this.constructor;
        var U;
        var V = this.__M.$$store;
        var S = V.user;
        var T = V.theme;
        var O = V.inherit;
        var R = V.useinit;
        var P = V.init;
        while(Q){

          U = Q.$$properties;
          if(U){

            for(var name in U){

              if(U[name].dereference){

                this[S[name]] = this[T[name]] = this[O[name]] = this[R[name]] = this[P[name]] = undefined;
              };
            };
          };
          Q = Q.superclass;
        };
      };
    }
  });
})();
(function(){

  var a = "qx.event.type.Event";
  qx.Class.define(a, {
    extend : qx.core.Object,
    statics : {
      CAPTURING_PHASE : 1,
      AT_TARGET : 2,
      BUBBLING_PHASE : 3
    },
    members : {
      init : function(c, b){

        {
        };
        this._type = null;
        this._target = null;
        this._currentTarget = null;
        this._relatedTarget = null;
        this._originalTarget = null;
        this._stopPropagation = false;
        this._preventDefault = false;
        this._bubbles = !!c;
        this._cancelable = !!b;
        this._timeStamp = (new Date()).getTime();
        this._eventPhase = null;
        return this;
      },
      clone : function(d){

        if(d){

          var e = d;
        } else {

          var e = qx.event.Pool.getInstance().getObject(this.constructor);
        };
        e._type = this._type;
        e._target = this._target;
        e._currentTarget = this._currentTarget;
        e._relatedTarget = this._relatedTarget;
        e._originalTarget = this._originalTarget;
        e._stopPropagation = this._stopPropagation;
        e._bubbles = this._bubbles;
        e._preventDefault = this._preventDefault;
        e._cancelable = this._cancelable;
        return e;
      },
      stop : function(){

        if(this._bubbles){

          this.stopPropagation();
        };
        if(this._cancelable){

          this.preventDefault();
        };
      },
      stopPropagation : function(){

        {
        };
        this._stopPropagation = true;
      },
      getPropagationStopped : function(){

        return !!this._stopPropagation;
      },
      preventDefault : function(){

        {
        };
        this._preventDefault = true;
      },
      getDefaultPrevented : function(){

        return !!this._preventDefault;
      },
      getType : function(){

        return this._type;
      },
      setType : function(f){

        this._type = f;
      },
      getEventPhase : function(){

        return this._eventPhase;
      },
      setEventPhase : function(g){

        this._eventPhase = g;
      },
      getTimeStamp : function(){

        return this._timeStamp;
      },
      getTarget : function(){

        return this._target;
      },
      setTarget : function(h){

        this._target = h;
      },
      getCurrentTarget : function(){

        return this._currentTarget || this._target;
      },
      setCurrentTarget : function(i){

        this._currentTarget = i;
      },
      getRelatedTarget : function(){

        return this._relatedTarget;
      },
      setRelatedTarget : function(j){

        this._relatedTarget = j;
      },
      getOriginalTarget : function(){

        return this._originalTarget;
      },
      setOriginalTarget : function(k){

        this._originalTarget = k;
      },
      getBubbles : function(){

        return this._bubbles;
      },
      setBubbles : function(l){

        this._bubbles = l;
      },
      isCancelable : function(){

        return this._cancelable;
      },
      setCancelable : function(m){

        this._cancelable = m;
      }
    },
    destruct : function(){

      this._target = this._currentTarget = this._relatedTarget = this._originalTarget = null;
    }
  });
})();
(function(){

  var a = "qx.util.ObjectPool",b = "Class needs to be defined!",c = "Object is already pooled: ",d = "Integer",e = "qx.strict";
  qx.Class.define(a, {
    extend : qx.core.Object,
    construct : function f(g){

      if(qx.core.Environment.get(e)){

        this.callee(f, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this.__cN = {
      };
      if(g != null){

        this.setSize(g);
      };
    },
    properties : {
      size : {
        check : d,
        init : Infinity
      }
    },
    members : {
      __cN : null,
      getObject : function(k){

        if(this.$$disposed){

          return new k;
        };
        if(!k){

          throw new Error(b);
        };
        var h = null;
        var j = this.__cN[k.classname];
        if(j){

          h = j.pop();
        };
        if(h){

          h.$$pooled = false;
        } else {

          h = new k;
        };
        return h;
      },
      poolObject : function(n){

        if(!this.__cN){

          return;
        };
        var m = n.classname;
        var o = this.__cN[m];
        if(n.$$pooled){

          throw new Error(c + n);
        };
        if(!o){

          this.__cN[m] = o = [];
        };
        if(o.length > this.getSize()){

          if(n.destroy){

            n.destroy();
          } else {

            n.dispose();
          };
          return;
        };
        n.$$pooled = true;
        o.push(n);
      }
    },
    destruct : function(){

      var r = this.__cN;
      var p,q,i,l;
      for(p in r){

        q = r[p];
        for(i = 0,l = q.length;i < l;i++){

          q[i].dispose();
        };
      };
      delete this.__cN;
    }
  });
})();
(function(){

  var a = "singleton",b = "qx.event.Pool",c = "qx.strict";
  qx.Class.define(b, {
    extend : qx.util.ObjectPool,
    type : a,
    construct : function d(){

      if(qx.core.Environment.get(c)){

        this.callee(d, arguments, 30);
      } else {

        qx.util.ObjectPool.call(this, 30);
      };
    }
  });
})();
(function(){

  var a = 'Method "qx.event.type.Data.clone" cannot be used in strict mode.',b = "qx.strict",c = "qx.event.type.Data";
  qx.Class.define(c, {
    extend : qx.event.type.Event,
    members : {
      __cO : null,
      __cP : null,
      init : function e(g, f, d){

        if(qx.core.Environment.get(b)){

          this.callee(e, arguments, false, d);
        } else {

          qx.event.type.Event.prototype.init.call(this, false, d);
        };
        this.__cO = g;
        this.__cP = f;
        return this;
      },
      clone : function(h){

        if(qx.core.Environment.get(b)){

          throw new Error(a);
        };
        var i = qx.event.type.Event.prototype.clone.call(this, h);
        i.__cO = this.__cO;
        i.__cP = this.__cP;
        return i;
      },
      getData : function(){

        return this.__cO;
      },
      getOldData : function(){

        return this.__cP;
      }
    },
    destruct : function(){

      this.__cO = this.__cP = null;
    }
  });
})();
(function(){

  var a = "qx.event.IEventHandler";
  qx.Interface.define(a, {
    statics : {
      TARGET_DOMNODE : 1,
      TARGET_WINDOW : 2,
      TARGET_OBJECT : 4,
      TARGET_DOCUMENT : 8
    },
    members : {
      canHandleEvent : function(c, b){
      },
      registerEvent : function(f, e, d){
      },
      unregisterEvent : function(i, h, g){
      }
    }
  });
})();
(function(){

  var a = "qx.event.handler.Object";
  qx.Class.define(a, {
    extend : qx.core.Object,
    implement : qx.event.IEventHandler,
    statics : {
      PRIORITY : qx.event.Registration.PRIORITY_LAST,
      SUPPORTED_TYPES : null,
      TARGET_CHECK : qx.event.IEventHandler.TARGET_OBJECT,
      IGNORE_CAN_HANDLE : false
    },
    members : {
      canHandleEvent : function(c, b){

        return qx.Class.supportsEvent(c.constructor, b);
      },
      registerEvent : function(f, e, d){
      },
      unregisterEvent : function(i, h, g){
      }
    },
    defer : function(j){

      qx.event.Registration.addHandler(j);
    }
  });
})();
(function(){

  var a = "qx.event.IEventDispatcher";
  qx.Interface.define(a, {
    members : {
      canDispatchEvent : function(c, event, b){

        this.assertInstance(event, qx.event.type.Event);
        this.assertString(b);
      },
      dispatchEvent : function(e, event, d){

        this.assertInstance(event, qx.event.type.Event);
        this.assertString(d);
      }
    }
  });
})();
(function(){

  var a = "qx.event.dispatch.Direct";
  qx.Class.define(a, {
    extend : qx.core.Object,
    implement : qx.event.IEventDispatcher,
    construct : function(b){

      this._manager = b;
    },
    statics : {
      PRIORITY : qx.event.Registration.PRIORITY_LAST
    },
    members : {
      canDispatchEvent : function(d, event, c){

        return !event.getBubbles();
      },
      dispatchEvent : function(e, event, k){

        {

          var j,f;
        };
        event.setEventPhase(qx.event.type.Event.AT_TARGET);
        var g = this._manager.getListeners(e, k, false);
        if(g){

          for(var i = 0,l = g.length;i < l;i++){

            var h = g[i].context || e;
            {
            };
            g[i].handler.call(h, event);
          };
        };
      }
    },
    defer : function(m){

      qx.event.Registration.addDispatcher(m);
    }
  });
})();
(function(){

  var a = 'action',b = "unit/update_sensor",c = "resource/update_poi",d = "unit_commands",f = "unitSensors",g = "adminField",h = "itemProfileFields",j = "resource/update_drivers_group",l = "unsl",m = "u",n = "https://geocode-maps.wialon.com",o = "zonesGroup",p = "item/delete_item",q = "singleton",r = "resourcePois",s = 'zl',t = "ftp",u = "resourceZoneGroups",v = "item/update_admin_field",w = "&svc=file/get&params=",x = "script",y = "avl_evts:request",z = "core/check_items_billing",A = "resource/get_job_data",B = "qx.event.type.Event",C = "//",D = "item/update_profile_field",E = "resource/get_poi_data",F = "ujb",G = "token/login",H = "token/update",I = "jobs",J = "file/list",K = "__db",L = "__df",M = "unitFuelSettings",N = "local",O = "route/get_round_data",P = "flds",Q = "core/get_hw_types",R = 'driver',S = "userNotification",T = "si",U = "order_routes",V = "lang",W = "core/search_item",X = "profileField",Y = "=",fS = 'tags',fN = "core/create_resource",fT = "unsubscription",fP = "core/create_user",fQ = "?sid=",fD = "number",fR = "firmware",fX = "customField",fY = "core/create_unit",ga = "https://search-maps.wialon.com",gb = "; ",fU = "usnf",fV = "notifications",fO = "token/list",fW = "healthCheck",gf = "routeSchedules",gI = "core/login",gg = "route/update_round",gh = "string",gc = "account/get_business_spheres",gd = "resourceUnsubscription",hJ = "[\\?&]callback=([^&#]*)",ge = "core/create_auth_hash",gi = "poi",gj = "ud",gk = "core/update_data_flags",gp = "serviceInterval",gq = "core/create_retranslator",gr = "resourceReports",gl = "core/reset_password_perform",gm = "unitReportSettings",gn = "sensor",go = "qx.event.type.Data",gw = 'trailer',gx = "__de",gy = "https://render-maps.wialon.com",gz = "/avl_evts",gs = "core/create_route",gt = "round",gu = "rr",gv = "core/create_unit_group",gD = "unf",gE = "item/update_ftp_property",hS = "aflds",gF = "mapps",gA = 'resource/update_zone',gB = "core/get_account_data",hQ = "d",gC = 'resource/update_trailer',gG = "fileUploaded",gH = "avl_evts",gT = '.all',gS = "resourceDrivers",gR = "commandDefinition",gX = 'drvrs',gW = "unitServiceIntervals",gV = "resource/update_zones_group",gU = "function",gM = "tagsgr",gL = "rep",gK = "report/update_report",gJ = "resource/update_job",gQ = "rs",gP = "report",gO = "wialon.js",gN = "en",hf = "itemCreated",he = "unitEventRegistrar",hd = "orders",hc = 'undefined',hj = 'tag',hi = "user/update_user_notification",hh = "unitHealthCheck",hg = "serverUpdated",hb = 'resource/get_zone_data',ha = "unitCommandDefinitions",gY = 'trigger',hu = "user/send_sms",ht = "core/get_hw_cmds",hs = "file/read",hy = "route/update_schedule",hx = 'trlrs',hw = "account/get_account_data",hv = "/wialon/ajax.html",hn = "resourceDriverGroups",hm = "hch",hl = "m",hk = "resource/update_trailers_group",hr = "report/get_report_tables",hq = "resourceAccounts",hp = "resourceTags",ho = "mobileApps",hE = "qx.strict",hD = "account/list_change_accounts",hC = "notification",hB = "resource/update_unsubscription",hI = "unit/update_command_definition",hH = "itemIcon",hG = "order/route_update",hF = "schedule",hA = 'zone',hz = "col",eI = '',eH = "1.51",hT = "file/library",eF = "statsFinished",eG = 'resource/update_tag',eE = "itemFtpProps",hR = "core/search_items",eC = "core/duplicate",eD = "https://routing-maps.wialon.com",eB = "trlrsgr",hO = "FtpProp",ez = "order/update",eA = "trailersGroup",ey = "mobileApp",eR = "object",eS = "sensu",eP = "resource/update_notification",eQ = "unitDriveRankSettings",eN = "orderRoute",eO = "wialon.core.Session",eM = "featuresUpdated",ex = "item/update_custom_field",eK = "unit/update_service_interval",eL = "invalidSession",eJ = "drvrsgr",fg = "resourceJobs",fe = "core/use_auth_hash",ff = "resourceTrailers",fc = "routeRounds",fd = "resourceTrailerGroups",fb = "core/logout",hM = "driversGroup",eY = "core/set_session_property",fa = "resourceNotifications",eX = "resource/update_tags_group",hP = "order",eV = "job",eW = "resourceOrders",eT = "core/check_accessors",eU = "core/reset_password_request",fo = "resource/get_notification_data",fp = '.',fm = "itemAdminFields",fn = "report/get_report_data",fk = "unitMessagesFilter",fl = "cml",fj = "/",hL = "del_msg",fh = "&svc=core/export_file&params=",fi = "tagsGroup",fC = "unitTripDetector",hK = "sensorsUpdated",fE = "",fz = "__cX",fy = "resourceZones",fB = "userNotifications",fA = 'resource/update_driver',fv = "unit_sensors",fu = "sens",fx = "Can't parse avl_evts json, possible wrong chars in responce. Data is ignored.",fw = "itemDeleted",fr = "unitsUpdated",fq = "itemCustomFields",ft = "unitEvents",fs = "reporttemplates",fK = 'u',fJ = 'notifications',fM = "pflds",fL = "user/update_mobile_app",fG = "undefined",fF = "unit/update_health_check",fI = '/',fH = "zg";
  qx.Class.define(eO, {
    extend : qx.core.Object,
    type : q,
    construct : function hU(){

      if(qx.core.Environment.get(hE)){

        this.callee(hU, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this.__cQ = {
      };
      this.__cR = {
      };
      this._libraries = {
      };
    },
    members : {
      __cS : 0,
      __cT : fE,
      __cU : 0,
      __cV : null,
      __cW : 0,
      __cX : null,
      __cY : 0,
      __da : null,
      __db : null,
      __dc : null,
      __cQ : null,
      __cR : null,
      _libraries : null,
      __dd : fE,
      __de : null,
      __df : null,
      __dg : fE,
      __dh : false,
      __di : fE,
      __dj : fE,
      __dk : fE,
      __dl : {
      },
      __dm : null,
      __gi : [I, fV, fs, d, fv],
      __dn : fE,
      __do : eH,
      __dp : fE,
      __dq : null,
      __dr : 0,
      __ds : 0,
      __dt : fE,
      __du : fE,
      __dv : {
      },
      __dw : fE,
      __dx : gy,
      __dy : ga,
      __dz : n,
      __dA : eD,
      __gj : fE,
      __gk : fE,
      __gl : fE,
      __dB : hv,
      __dC : false,
      __dD : false,
      __dE : false,
      __dF : null,
      __dG : null,
      __dH : null,
      __dI : null,
      __dJ : null,
      __dK : null,
      initSession : function(hX, hW, hV, ib, hY, ic){

        if(this.__cS)return false;
        wialon.item.Item.registerProperties();
        wialon.item.User.registerProperties();
        wialon.item.Unit.registerProperties();
        wialon.item.Resource.registerProperties();
        wialon.item.UnitGroup.registerProperties();
        wialon.item.Retranslator.registerProperties();
        wialon.item.Route.registerProperties();
        this.__dg = hX;
        this.__dw = hX;
        if(typeof hW != fG)this.__di = hW;
        if(typeof hV != fG && !isNaN(parseInt(hV))){

          var ia = parseInt(hV);
          if(ia & 0x800)this.__dh = true;
        };
        if(typeof ib != fG)this.__dk = ib;
        this.__de = new wialon.render.Renderer;
        this.__df = new wialon.core.MessagesLoader;
        this.__cS = 1;
        if(hY)this.__dn = hY;
        if(ic){

          if(ic.apiPath)this.__dB = ic.apiPath;
          if(ic.gisUrl)this.__dw = ic.gisUrl;
          this.__dC = !!ic.ignoreBaseUrl;
          this.__dD = !!ic.whiteLabel;
          this.__dF = ic.logger;
          this.__dG = ic.loginSiteName;
          this.__dE = ic.requestWebSites;
        };
        return true;
      },
      isInitialized : function(){

        return this.__cS;
      },
      getToken : function(){

        return this.__dq;
      },
      getVersion : function(){

        return this.__dn;
      },
      getJsVersion : function(){

        return this.__do;
      },
      getAjaxVersion : function(){

        return this.__dp;
      },
      getHiddenLogin : function(){

        return this.__dr;
      },
      getAuthUser : function(){

        return this.__dd;
      },
      isLocal : function(){

        return this.__ds;
      },
      getHwGatewayIp : function(){

        return this.__dt;
      },
      getHwGatewayDns : function(){

        return this.__du;
      },
      getEnv : function(ie){

        if(ie)return this.__dv[ie];
        return this.__dv;
      },
      getClasses : function(){

        return this.__da;
      },
      login : function(ij, ih, ii, ig){

        ig = wialon.util.Helper.wrapCallback(ig);
        if(this.__cX || !this.__cS){

          ig(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gI, {
          user : ij,
          password : ih,
          operateAs : ii,
          loginHash : this.__dj,
          appName : this.__di,
          checkService : this.__dk
        }, qx.lang.Function.bind(this.__dS, this, ig));
      },
      loginAuthHash : function(ip, io, il){

        var ik = fE;
        if(io && typeof io == gU)il = io; else if(io && typeof io == gh)ik = io;;
        il = wialon.util.Helper.wrapCallback(il);
        if(this.__cX || !this.__cS){

          il(2);
          return;
        };
        var im = {
          authHash : ip,
          operateAs : ik,
          appName : this.__di,
          checkService : this.__dk
        };
        if(this.__dG)im.siteName = this.__dG;
        if(this.__dE)im.webSite = 1;
        return wialon.core.Remote.getInstance().remoteCall(fe, im, qx.lang.Function.bind(this.__dS, this, il));
      },
      loginToken : function(is, iu, ir){

        var iq = fE;
        if(iu && typeof iu == gU)ir = iu; else if(iu && typeof iu == gh)iq = iu;;
        ir = wialon.util.Helper.wrapCallback(ir);
        if(this.__cX || !this.__cS){

          ir(2);
          return;
        };
        var it = {
          token : is,
          operateAs : iq,
          appName : this.__di,
          checkService : this.__dk
        };
        if(this.__dG)it.siteName = this.__dG;
        if(this.__dE)it.webSite = 1;
        return wialon.core.Remote.getInstance().remoteCall(G, it, qx.lang.Function.bind(this.__dS, this, ir));
      },
      duplicate : function(iB, iy, iv, iA, iw){

        var iz = 0;
        if(iw)iz = 1;
        iA = wialon.util.Helper.wrapCallback(iA);
        if(this.__cX || !this.__cS){

          iA(2);
          return;
        };
        this.__cT = iB;
        var ix = {
          operateAs : iy,
          continueCurrentSession : iv,
          checkService : this.__dk,
          restore : iz,
          appName : this.__di
        };
        if(this.__dG)ix.siteName = this.__dG;
        if(this.__dE)ix.webSite = 1;
        return wialon.core.Remote.getInstance().remoteCall(eC, ix, qx.lang.Function.bind(this.__dS, this, iA));
      },
      logout : function(iC){

        iC = wialon.util.Helper.wrapCallback(iC);
        if(!this.__cX){

          iC(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fb, null, qx.lang.Function.bind(function(iD, iE){

          if(iD){

            iC(iD);
            return;
          };
          this.__dO();
          iC(0);
        }, this));
      },
      createAuthHash : function(iF){

        iF = wialon.util.Helper.wrapCallback(iF);
        if(!this.__cX){

          iF(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(ge, {
        }, iF);
      },
      updateSessionProperty : function(iH, iG){

        return wialon.core.Remote.getInstance().remoteCall(eY, {
          prop_name : iH.propName,
          prop_value : iH.propValue
        }, wialon.util.Helper.wrapCallback(iG));
      },
      updateToken : function(iI, iJ, iK){

        iK = wialon.util.Helper.wrapCallback(iK);
        return wialon.core.Remote.getInstance().remoteCall(H, {
          callMode : iI,
          h : iJ.h,
          app : iJ.app,
          at : iJ.at,
          dur : iJ.dur,
          fl : iJ.fl,
          p : iJ.p,
          items : iJ.items,
          deleteAll : iJ.deleteAll,
          userId : iJ.userId
        }, iK);
      },
      listTokens : function(iM, iL){

        return wialon.core.Remote.getInstance().remoteCall(fO, {
          app : iM.app,
          userId : iM.userId
        }, wialon.util.Helper.wrapCallback(iL));
      },
      updateDataFlags : function(iO, iN){

        iN = wialon.util.Helper.wrapCallback(iN);
        if(!this.__cX || typeof iO != eR){

          iN(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gk, {
          spec : iO
        }, qx.lang.Function.bind(this.__dT, this, iN));
      },
      searchItems : function(iT, iS, iP, iR, iQ, iU, iV){

        iU = wialon.util.Helper.wrapCallback(iU);
        if(!this.__cX || typeof iT != eR){

          iU(2, null);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(hR, {
          spec : iT,
          force : iS ? 1 : 0,
          flags : iP,
          from : iR,
          to : iQ
        }, qx.lang.Function.bind(this.__dU, this, iU), iV);
      },
      searchItem : function(iY, iW, iX){

        iX = wialon.util.Helper.wrapCallback(iX);
        if(!this.__cX){

          iX(2, null);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(W, {
          id : iY,
          flags : iW
        }, qx.lang.Function.bind(this.__dV, this, iX));
      },
      loadLibrary : function(jc){

        var ja = wialon.core.Session.getInstance();
        if(typeof this._libraries[jc] != fG)return true;
        if(jc == fB)wialon.item.PluginsManager.bindPropItem(wialon.item.User, fU, S, hi); else if(jc == fq)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, P, fX, ex); else if(jc == eE)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, t, hO, gE); else if(jc == fm)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, hS, g, v); else if(jc == h)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, fM, X, D); else if(jc == hH){

          qx.Class.include(wialon.item.Unit, wialon.item.MIcon);
          qx.Class.include(wialon.item.UnitGroup, wialon.item.MIcon);
        } else if(jc == ha)wialon.item.PluginsManager.bindPropItem(wialon.item.Unit, fl, gR, hI); else if(jc == f){

          wialon.item.PluginsManager.bindPropItem(wialon.item.Unit, fu, gn, b);
          qx.Class.include(wialon.item.Unit, wialon.item.MUnitSensor);
        } else if(jc == gW)wialon.item.PluginsManager.bindPropItem(wialon.item.Unit, T, gp, eK); else if(jc == hh)wialon.item.PluginsManager.bindPropItem(wialon.item.Unit, hm, fW, fF); else if(jc == fC)qx.Class.include(wialon.item.Unit, wialon.item.MUnitTripDetector); else if(jc == fk)qx.Class.include(wialon.item.Unit, wialon.item.MUnitMessagesFilter); else if(jc == he)qx.Class.include(wialon.item.Unit, wialon.item.MUnitEventRegistrar); else if(jc == gm)qx.Class.include(wialon.item.Unit, wialon.item.MUnitReportSettings); else if(jc == eQ)qx.Class.include(wialon.item.Unit, wialon.item.MUnitDriveRankSettings); else if(jc == M)qx.Class.include(wialon.item.Unit, wialon.item.MUnitFuelSettings); else if(jc == gd)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, l, fT, hB); else if(jc == fa)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gD, hC, eP, fo); else if(jc == fg)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, F, eV, gJ, A); else if(jc == fy){

          qx.Class.include(wialon.item.Resource, wialon.item.MZone);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : s,
            itemName : hA,
            ajaxPath : gA,
            extAjaxPath : hb,
            preProcessUpdateCallObj : function(jf){

              var je = ja.getCoordinatesTransformer();
              if(!je)return jf;
              return jb(je.reverse.bind(je), jf);
            },
            preProcessPropObj : function(jh){

              var jg = ja.getCoordinatesTransformer();
              if(!jg)return jh;
              return jb(jg.direct.bind(jg), jh);
            }
          });
        } else if(jc == u){

          qx.Class.include(wialon.item.Resource, wialon.item.MZone);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, fH, o, gV);
        } else if(jc == r){

          qx.Class.include(wialon.item.Resource, wialon.item.MPoi);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gi, gi, c, E);
        } else if(jc == gS){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : gX,
            itemName : R,
            ajaxPath : fA,
            preProcessPropObj : jd
          });
        } else if(jc == hn){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, eJ, hM, j);
        } else if(jc == ff){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : hx,
            itemName : gw,
            ajaxPath : gC,
            preProcessPropObj : jd
          });
        } else if(jc == fd){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, eB, eA, hk);
        } else if(jc == hq){

          qx.Class.include(wialon.item.Resource, wialon.item.MAccount);
          wialon.item.MAccount.registerAccountProperties();
        } else if(jc == gr){

          qx.Class.include(wialon.item.Resource, wialon.item.MReport);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gL, gP, gK, fn);
        } else if(jc == fc)wialon.item.PluginsManager.bindPropItem(wialon.item.Route, gu, gt, gg, O); else if(jc == gf)wialon.item.PluginsManager.bindPropItem(wialon.item.Route, gQ, hF, hy); else if(jc == ft)qx.Class.include(wialon.item.Unit, wialon.item.MUnitEvents); else if(jc == ho)wialon.item.PluginsManager.bindPropItem(wialon.item.User, gF, ey, fL); else if(jc == eW){

          qx.Class.include(wialon.item.Resource, wialon.item.MOrder);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, hd, hP, ez);
          qx.Class.include(wialon.item.Resource, wialon.item.MOrderRoute);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, U, eN, hG);
        } else if(jc == hp){

          qx.Class.include(wialon.item.Resource, wialon.item.MTag);
          wialon.item.MTag.registerTagProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gM, fi, eX);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : fS,
            itemName : hj,
            ajaxPath : eG,
            preProcessPropObj : jd
          });
        } else return false;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        this._libraries[jc] = 1;
        return true;
        function jb(jr, ji){

          var jo = 1.002;
          if(!ji)return ji;
          var jl = false;
          var jp = ji.p;
          var jq = ji.b;
          if(jq){

            var js = jr({
              x : jq.cen_x,
              y : jq.cen_y
            });
            var jn = js.x !== jq.cen_y || js.y !== jq.cen_y;
            if(jn){

              var jk = (jq.min_x - jq.cen_x) * jo;
              var jm = (jq.max_x - jq.cen_x) * jo;
              var jj = (jq.min_y - jq.cen_y) * jo;
              var jt = (jq.max_y - jq.cen_y) * jo;
              jl = true;
              jq = {
                cen_x : js.x,
                cen_y : js.y,
                min_x : js.x + jk,
                max_x : js.x + jm,
                min_y : js.y + jj,
                max_y : js.y + jt
              };
            };
          };
          if(Array.isArray(jp)){

            jl = true;
            jp = ji.p.map(function(ju){

              return jr(ju);
            });
          };
          if(jl){

            ji = Object.assign({
            }, ji, {
              b : jq,
              p : jp
            });
          };
          return ji;
        };
        function jd(jw){

          var jv = ja.getCoordinatesTransformer();
          if(!jv)return jw;
          if(!jw || !jw.pos)return jw;
          var jx = jv.direct(jw.pos);
          if(jx !== jw.pos){

            jw = Object.assign({
            }, jw, {
              pos : jx
            });
          };
          return jw;
        };
      },
      getHwTypes : function(jz, jy){

        var jA = {
        };
        if(jz && typeof jz == gU)jy = jz; else if(jz && typeof jz == eR)jA = jz;;
        if(!this.__cX){

          jy(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(Q, {
          filterType : jA.filterType,
          filterValue : jA.filterValue,
          includeType : jA.includeType
        }, wialon.util.Helper.wrapCallback(jy));
      },
      getHwCommands : function(jB, jC, jD){

        jD = wialon.util.Helper.wrapCallback(jD);
        if(!this.__cX){

          jD(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(ht, {
          deviceTypeId : jB,
          unitId : jC
        }, jD);
      },
      getHwCommandTemplates : function(jG, jE){

        var jF = {
        };
        if(jG && typeof jG == eR){

          jF = jG;
          jE = wialon.util.Helper.wrapCallback(jE);
        } else {

          jF.deviceTypeId = arguments[0];
          jF.unitId = arguments[1];
          jF.lang = gN;
          jE = wialon.util.Helper.wrapCallback(arguments[2]);
        };
        if(!this.__cX){

          jE(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(ht, {
          deviceTypeId : jF.deviceTypeId,
          unitId : jF.unitId,
          template : 1,
          lang : jF.lang
        }, jE);
      },
      createUnit : function(jK, name, jI, jH, jJ){

        jJ = wialon.util.Helper.wrapCallback(jJ);
        if(!this.__cX){

          jJ(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fY, {
          creatorId : jK.getId(),
          name : name,
          hwTypeId : jI,
          dataFlags : jH
        }, qx.lang.Function.bind(this.__dV, this, jJ));
      },
      createUser : function(jM, name, jP, jL, jO, jN){

        jN = jN || 0;
        jO = wialon.util.Helper.wrapCallback(jO);
        if(!this.__cX){

          jO(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fP, {
          creatorId : jM.getId(),
          name : name,
          password : jP,
          dataFlags : jL,
          logInvalid : jN
        }, qx.lang.Function.bind(this.__dV, this, jO));
      },
      createUnitGroup : function(jS, name, jQ, jR){

        jR = wialon.util.Helper.wrapCallback(jR);
        if(!this.__cX){

          jR(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gv, {
          creatorId : jS.getId(),
          name : name,
          dataFlags : jQ
        }, qx.lang.Function.bind(this.__dV, this, jR));
      },
      createRetranslator : function(jW, name, jV, jT, jU){

        jU = wialon.util.Helper.wrapCallback(jU);
        if(!this.__cX){

          jU(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gq, {
          creatorId : jW.getId(),
          name : name,
          config : jV,
          dataFlags : jT
        }, qx.lang.Function.bind(this.__dV, this, jU));
      },
      createRoute : function(ka, name, jX, jY){

        jY = wialon.util.Helper.wrapCallback(jY);
        if(!this.__cX){

          jY(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gs, {
          creatorId : ka.getId(),
          name : name,
          dataFlags : jX
        }, qx.lang.Function.bind(this.__dV, this, jY));
      },
      createResource : function(ke, name, kb, kd, kc){

        kc = wialon.util.Helper.wrapCallback(kc);
        if(!this.__cX){

          kc(2);
          return;
        };
        if(typeof kd == gU){

          kc = kd;
          kd = 0;
        };
        return wialon.core.Remote.getInstance().remoteCall(fN, {
          creatorId : ke.getId(),
          name : name,
          skipCreatorCheck : kd,
          dataFlags : kb
        }, qx.lang.Function.bind(this.__dV, this, kc));
      },
      deleteItem : function(ki, kf, kg){

        var kh = {
          itemId : ki.getId()
        };
        if(kg){

          kh.reason = kg;
        };
        kf = wialon.util.Helper.wrapCallback(kf);
        return wialon.core.Remote.getInstance().remoteCall(p, kh, qx.lang.Function.bind(this.__dW, this, kf, ki.getId()));
      },
      updateItem : function(kk, kl){

        if(!kk || !kl)return;
        if(kl.tp === gj){

          if(kl.pos){

            if(typeof kl.pos.t === fG)kl.pos.t = kl.t;
            if(typeof kl.pos.f === fG)kl.pos.f = kl.f;
            if(typeof kl.pos.lc === fG)kl.pos.lc = kl.lc;
          };
        };
        for(var kj in kl){

          switch(kj){case fu:case eS:
          continue;};
          km.call(this, kj);
        };
        if(Object.prototype.hasOwnProperty.call(kl, fu))km.call(this, fu);
        if(Object.prototype.hasOwnProperty.call(kl, eS))km.call(this, eS);
        function km(kn){

          var ko = this.__cQ[kn];
          if(typeof ko === gU){

            ko(kk, kl[kn]);
          };
        };
      },
      getIconsLibrary : function(kp, kr, ks){

        var kq = 0;
        if(typeof ks != fG)kq = kr; else ks = kr;
        wialon.core.Remote.getInstance().remoteCall(hT, {
          type : kp,
          flags : kq
        }, wialon.util.Helper.wrapCallback(ks));
      },
      getFirmwareLibrary : function(ku, kt){

        wialon.core.Remote.getInstance().remoteCall(J, {
          itemId : 0,
          storageType : 1,
          path : fR,
          mask : ku,
          recursive : true,
          fullPath : true
        }, wialon.util.Helper.wrapCallback(kt));
      },
      getLibraryFile : function(kv){

        var kw = {
          itemId : 0,
          storageType : 1,
          path : kv
        };
        return wialon.core.Session.getInstance().getBaseUrl() + this.__dB + fQ + wialon.core.Session.getInstance().getId() + w + wialon.util.Json.stringify(kw);
      },
      readLibraryFile : function(kx, ky){

        wialon.core.Remote.getInstance().remoteCall(hs, {
          itemId : 0,
          storageType : 1,
          path : kx
        }, wialon.util.Helper.wrapCallback(ky));
      },
      resetPasswordRequest : function(kG, kF, kC, kE, kB){

        kB = wialon.util.Helper.wrapCallback(kB);
        if(!this.__cS){

          kB(2);
          return;
        };
        var kA = document.cookie.split(gb);
        var kz = gN;
        for(var i = 0;i < kA.length;i++){

          var kD = kA[i].split(Y);
          if(kD.length == 2 && kD[0] == V){

            kz = kD[1];
            break;
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(eU, {
          user : kG,
          email : kF,
          emailFrom : kC,
          url : kE,
          lang : kz
        }, kB);
      },
      resetPasswordPerform : function(kJ, kI, kH){

        kH = wialon.util.Helper.wrapCallback(kH);
        if(!this.__cS){

          kH(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gl, {
          user : kJ,
          code : kI
        }, kH);
      },
      sendSms : function(kL, kM, kK){

        return wialon.core.Remote.getInstance().remoteCall(hu, {
          phoneNumber : kL,
          smsText : kM
        }, wialon.util.Helper.wrapCallback(kK));
      },
      getAccountData : function(kO, kN){

        return wialon.core.Remote.getInstance().remoteCall(gB, {
          type : kO ? 2 : 1
        }, wialon.util.Helper.wrapCallback(kN));
      },
      getAccountsData : function(kQ, kR, kP){

        if(typeof (kR) == gU){

          kP = kR;
          kR = 2;
        };
        return wialon.core.Remote.getInstance().remoteCall(hw, {
          itemId : kQ,
          type : kR
        }, wialon.util.Helper.wrapCallback(kP));
      },
      checkItemsBilling : function(kS, kT, kU, kV){

        return wialon.core.Remote.getInstance().remoteCall(z, {
          items : kS,
          serviceName : kT,
          accessFlags : kU
        }, wialon.util.Helper.wrapCallback(kV));
      },
      checkAccessors : function(kX, kW){

        return wialon.core.Remote.getInstance().remoteCall(eT, kX, wialon.util.Helper.wrapCallback(kW));
      },
      listChangeAccount : function(la, kY){

        return wialon.core.Remote.getInstance().remoteCall(hD, {
          dataFlags : la.dataFlags,
          units : la.units
        }, wialon.util.Helper.wrapCallback(kY));
      },
      getBusinessSpheres : function(lb, lc){

        var ld = {
        };
        lb && (ld.lang = lb);
        return wialon.core.Remote.getInstance().remoteCall(gc, ld, wialon.util.Helper.wrapCallback(lc));
      },
      getReportTables : function(le){

        return wialon.core.Remote.getInstance().remoteCall(hr, {
        }, wialon.util.Helper.wrapCallback(le));
      },
      setLoginHash : function(lf){

        this.__dj = lf;
      },
      getExportListUrl : function(lh){

        var lg = qx.lang.Object.clone(lh);
        return wialon.core.Session.getInstance().getBaseUrl() + this.__dB + fQ + wialon.core.Session.getInstance().getId() + fh + encodeURIComponent(wialon.util.Json.stringify(lg));
      },
      getCurrUser : function(){

        return this.__cX;
      },
      getServerTime : function(){

        return this.__cY;
      },
      getItem : function(li){

        if(!this.__db)return null;
        var lj = this.__db[parseInt(li)];
        if(typeof lj != hc)return lj;
        return null;
      },
      getItems : function(lm){

        if(!this.__db || !this.__dc)return null;
        if(typeof lm == fG || lm == fE){

          var ll = new Array;
          for(var lk in this.__db)ll.push(this.__db[lk]);
          return ll;
        } else {

          var ln = this.__dc[lm];
          if(typeof ln != fG)return ln;
        };
        return (new Array);
      },
      registerConstructor : function(lo, lp){

        if(typeof this.__cR[lo] != fG)return;
        this.__cR[lo] = lp;
      },
      registerProperty : function(lq, lr){

        if(typeof this.__cQ[lq] != fG)return;
        this.__cQ[lq] = lr;
      },
      getBaseUrl : function(){

        return this.__dg;
      },
      setBaseUrl : function(ls){

        this.__dg = ls;
        this.__dw = ls;
        wialon.core.Remote.getInstance().setRequestsBaseUrl();
      },
      getEvtPollInterval : function(){

        return this.__cU;
      },
      setEvtPollInterval : function(lt){

        if(this.__cU !== lt){

          this.__cU = lt;
          if(this.__cV){

            clearTimeout(this.__cV);
            var lw = Date.now() - this.__cW;
            if(lw < 0){

              lw = 0;
            };
            var lu = lt * 1000;
            if(lw >= lu){

              this.__dL();
            } else {

              var lv = lu - lw;
              if(lv < 0){

                lv = 0;
              };
              this.__cV = qx.lang.Function.delay(this.__dL, lv, this);
            };
          };
        };
      },
      getBaseGisUrl : function(lx){

        if(!this.__dh && this.__dw != fE){

          var ly = this.__dw.split(C);
          if(ly.length >= 2){

            var lz = {
              render : this.__dx,
              search : this.__dy,
              geocode : this.__dz,
              routing : this.__dA
            }[lx];
            if(lz){

              return lz + fI + ly[1];
            };
          };
        };
        return this.__dw;
      },
      getGisSid : function(){

        return this.__gj;
      },
      getVideoServiceUrl : function(){

        return this.__gk;
      },
      getVideoServiceBaseUrl : function(){

        return this.__gl;
      },
      getId : function(){

        return this.__cT;
      },
      getRenderer : function(){

        return this.__de;
      },
      getMessagesLoader : function(){

        return this.__df;
      },
      getFeatures : function(){

        return this.__dm;
      },
      getBhphFeatures : function(){

        return this.__gi;
      },
      getDriverFlags : function(){

        return this.__gw;
      },
      getBillingByCodes : function(){

        return this.__gr;
      },
      checkFeature : function(lC, lE){

        var lB = this.checkFullFeature(lC);
        if(lE || this.__gi.indexOf(lC) === -1){

          return lB;
        };
        if(lC === fJ && !lB){

          var lA = this.checkSubfeatures(lC, gY);
          var lD = this.checkSubfeatures(lC, a);
          if(!lD || !lA){

            return 0;
          } else if(lD === -1 || lA === -1){

            return -1;
          };
          return 1;
        };
        return lB || this.checkSubfeatures(lC);
      },
      checkFullFeature : function(lF){

        if(!this.__dm || typeof this.__dm.svcs == fG || !lF)return 0;
        if(typeof this.__dm.svcs[lF] == fG){

          if(this.__dm.unlim == 1)return 1;
          return 0;
        };
        var lG = this.__dm.svcs[lF];
        if(lG == 1)return 1; else if(lG == 0)return -1;;
        return 0;
      },
      checkSubfeatures : function(lM, lH){

        if(!this.__dm || typeof this.__dm.svcs == fG || !lM)return 0;
        var lJ = this.checkFullFeature(lM + gT);
        if(!lJ){

          return 0;
        } else if(lJ === -1){

          return -1;
        };
        var lK = this.getSubfeatures(lM, lH);
        var lI = 0;
        var lL = 0;
        var lN = Object.keys(lK).length;
        for(var name in lK){

          var status = lK[name];
          if(status === 0){

            lI++;
          } else if(status === 1){

            lL++;
          };
        };
        if(!lN || lI === lN){

          return 0;
        } else if(lL === 0){

          return -1;
        };
        return 1;
      },
      getSubfeatures : function(lT, lO){

        if(!lT){

          return {
          };
        };
        var lP = lT + gT;
        if(!this.checkFullFeature(lP)){

          return {
          };
        };
        var lU = new RegExp(lT + (lO ? fp + lO : eI) + fp);
        var lR = {
        };
        var lQ = this.getFeatures().svcs;
        for(var lS in lQ){

          if(lU.test(lS) && lS !== lP){

            lR[lS] = this.checkFullFeature(lS);
          };
        };
        return lR;
      },
      __dL : function(){

        this.__cV = null;
        this.__cW = Date.now();
        if(!this.__cT || !this.__cU || typeof wialon === fG)return;
        if(this.__dF && (typeof this.__dF.info === gU)){

          try{

            this.__dF.info({
              type : y
            });
          } catch(e) {

            console.error(e);
          };
        };
        wialon.core.Remote.getInstance().ajaxRequest(gz, {
          sid : this.__cT
        }, qx.lang.Function.bind(this.__dM, this, this.__cT), 60);
      },
      __dM : function(lX, lV, lW){

        if(this.__dF && (typeof this.__dF.info === gU)){

          try{

            this.__dF.info({
              type : gH,
              code : lV,
              result : lW
            });
          } catch(e) {

            console.error(e);
          };
        };
        if(lV != 0){

          if(lV == 1){

            if(this.__dO(lX))this.fireEvent(eL);
          } else if(this.__cU){

            if(!this.__cV)this.__cV = qx.lang.Function.delay(this.__dL, this.__cU * 1000, this);
          };
          return;
        };
        if(this.__cU){

          if(!this.__cV)this.__cV = qx.lang.Function.delay(this.__dL, this.__cU * 1000, this);
        };
        this.__cY = lW.tm;
        if(this.__dI){

          try{

            this.__dI(lW);
          } catch(e) {

            this.__bA(e);
          };
        } else {

          for(var i = 0;i < lW.events.length;i++){

            this.emitRawServerEvent(lW.events[i]);
          };
          this.fireEvent(hg);
        };
        if(lW.units_update){

          this.fireDataEvent(fr, lW.units_update, null);
        };
        if(lW.sensors && lW.sensors.length){

          this.fireDataEvent(hK, lW.sensors, null);
        };
      },
      emitRawServerEvent : function(md){

        var mc;
        var i;
        try{

          if(md.i > 0){

            mc = this.getItem(md.i);
            if(mc && typeof mc != fG){

              if(md.t == m)this.updateItem(mc, md.d); else if(md.t == hl)mc.handleMessage(md.d); else if(md.t == hQ)this._onItemDeleted(mc); else if(md.t == hL)mc.handleDeleteMessage(md.d);;;;
            } else {

              if(md && (typeof md.i === fD) && (md.t === fK)){

                var mb = this.__dl[md.i];
                if(!mb){

                  mb = [];
                  this.__dl[md.i] = mb;
                };
                mb.push(md);
              };
            };
          } else if(md.i == -1){

            this.fireDataEvent(gG, md.d, null);
          } else if(md.i == -2){

            if(this.__dO(this.getId()))this.fireEvent(eL);
          } else if(md.i == -3){

            this.__dm = md.d;
            this.fireEvent(eM);
          } else if(md.i == -4){

            this.fireDataEvent(eF, md.d, null);
          } else if(md.i == -5){

            var me = md.d;
            if(typeof me.r != fG && me.r.length){

              for(i = 0;i < me.r.length;i++){

                mc = this.getItem(me.r[i]);
                if(mc){

                  this._onItemDeleted(mc);
                };
              };
            };
            if(typeof me.a != fG && me.a.length){

              var ma = [];
              for(i = 0;i < me.a.length;i++){

                var mf = me.a[i].ids;
                for(var k = 0;k < mf.length;k++){

                  var lY = mf[k];
                  mc = this.getItem(lY);
                  if(!mc){

                    ma.push(lY);
                  };
                };
              };
              if(ma.length){

                this.checkNewItems({
                  ids : ma
                });
              };
            };
          };;;;;
        } catch(e) {

          this.__bA(e);
        };
      },
      __dN : {
      },
      checkNewItems : function(mj, mg){

        var mk = mj.ids,mh = mj.updateDataFlagsSpec;
        var mi = wialon.core.Session.getInstance();
        mk = mk.filter(qx.lang.Function.bind(function(ml){

          if(this.__dN[ml])return false;
          if(this.getItem(ml))return false;
          this.__dN[ml] = true;
          return true;
        }, this));
        if(!mh){

          if(!mk.length){

            if(typeof mg === gU)mg(null);
            return;
          };
          mh = [{
            type : hz,
            data : mk,
            flags : wialon.item.Item.dataFlag.base,
            mode : 1
          }];
        };
        this.updateDataFlags(mh, qx.lang.Function.bind(function(mn){

          mk.forEach(qx.lang.Function.bind(function(mo){

            delete this.__dN[mo];
          }, this));
          if(mn){

            if(typeof mg === gU)mg(mn);
            return;
          };
          var mm = [];
          mk.forEach(qx.lang.Function.bind(function(mq){

            var mp = this.getItem(mq);
            if(!mp)return;
            mm.push(mp);
          }, this));
          this.fireDataEvent(hf, mm, null);
          if(typeof mg === gU)mg(null);
        }, this));
      },
      parseSessionData : function(ms){

        if(!ms || this.__cX)return false;
        this.__cT = ms.eid;
        this.__cU = 2;
        this.__cY = ms.tm;
        this.__dd = ms.au;
        this.__ds = (ms.api && ms.api.indexOf(N) >= 0) ? 1 : 0;
        if(ms.wsdk_version)this.__dp = ms.wsdk_version;
        if(ms.hl)this.__dr = ms.hl;
        this.__da = {
        };
        for(var mr in ms.classes)this.__da[ms.classes[mr]] = mr;
        this.__db = {
        };
        this.__dc = {
        };
        this.__cX = this.__dP(ms.user, wialon.item.User.defaultDataFlags());
        this.__dQ(this.__cX);
        if(ms.token){

          try{

            this.__dq = wialon.util.Json.parse(ms.token);
            if(ms.th)this.__dq.th = ms.th;
            if(this.__dq.p)this.__dq.p = wialon.util.Json.parse(this.__dq.p);
          } catch(e) {

            console.log(fx);
          };
        };
        if(typeof ms.features != fG)this.__dm = ms.features;
        if(ms.gis_render){

          this.__dx = ms.gis_render.replace(/\/+$/, eI);
        };
        if(ms.gis_geocode){

          this.__dz = ms.gis_geocode.replace(/\/+$/, eI);
        };
        if(ms.gis_search){

          this.__dy = ms.gis_search.replace(/\/+$/, eI);
        };
        if(ms.gis_routing){

          this.__dA = ms.gis_routing.replace(/\/+$/, eI);
        };
        if(ms.gis_sid){

          this.__gj = ms.gis_sid.replace(/\/+$/, eI);
        };
        if(ms.video_service_url){

          this.__gk = ms.video_service_url.replace(/\/+$/, eI);
        };
        if(ms.video_service_base_url){

          this.__gl = ms.video_service_base_url.replace(/\/+$/, eI);
        };
        if(ms.billing_by_codes){

          this.__gr = ms.billing_by_codes;
        };
        if(ms.drivers_feature_flags){

          this.__gw = parseInt(ms.drivers_feature_flags);
        };
        if(typeof ms.base_url != fG && ms.base_url != fE && ms.base_url != this.getBaseUrl()){

          this.__dw = ms.base_url;
          if(!this.__dC){

            this.setBaseUrl(ms.base_url);
          };
        };
        wialon.core.Remote.getInstance().updateGisSenders();
        this.__dt = ms.hw_gw_ip || fE;
        this.__du = ms.hw_gw_dns || fE;
        if(typeof ms.env != fG && ms.env)this.__dv = ms.env;
        this.__dJ = ms.web_site;
        this.__dK = ms.web_cms_manager_site;
        if(this.__cU){

          if(!this.__cV)this.__cV = qx.lang.Function.delay(this.__dL, this.__cU * 1000, this);
        };
        return true;
      },
      getApiPath : function(){

        return this.__dB;
      },
      isWhiteLabel : function(){

        return this.__dD;
      },
      getLogger : function(){

        return this.__dF;
      },
      getCoordinatesTransformer : function(){

        return this.__dH;
      },
      setCoordinatesTransformer : function(mt){

        this.__dH = mt;
      },
      setRawServerEventsHandler : function(mu){

        this.__dI = mu;
      },
      getWebSite : function(){

        return this.__dJ;
      },
      getWebManagerSite : function(){

        return this.__dK;
      },
      __bA : function(e){

        if(this.__dF && typeof this.__dF.error === gU){

          try{

            this.__dF.error({
              exception : e
            });
          } catch(mv) {

            console.error(mv);
          };
        } else {

          console.error(e);
        };
      },
      __dO : function(mw){

        if(mw && mw != this.__cT)return false;
        this.__cS = 0;
        this.__cT = fE;
        this.__cX = null;
        this.__db = null;
        this.__dc = null;
        this.__cU = 0;
        this.__de = null;
        this.__df = null;
        this.__dg = fE;
        this.__dh = false;
        this.__cQ = {
        };
        this.__cR = {
        };
        this.__dd = fE;
        this._libraries = {
        };
        this._disposeMap(K);
        this._disposeObjects(fz);
        this.__da = null;
        this.__dm = null;
        this.__ds = 0;
        this.__dt = fE;
        this.__du = fE;
        this.__dv = {
        };
        this.__gj = fE;
        this.__gk = fE;
        this.__gl = fE;
        this.__gr = false;
        this.__gw = 0;
        wialon.services.Tasks.getInstance().clear();
        return true;
      },
      __dP : function(mA, mz){

        if(!mA || !mz)return null;
        mA.tp = this.__da[mA.cls];
        if(typeof mA.tp == fG)return null;
        var my;
        var mB = this.__cR[mA.tp];
        if(typeof mB == fG)return null;
        my = new mB(mA, mz);
        this.updateItem(my, mA);
        var mx = my && this.__dl[my.getId()];
        if(mx){

          delete this.__dl[my.getId()];
          mx.forEach(qx.lang.Function.bind(function(mC){

            this.updateItem(my, mC.d);
          }, this));
        };
        return my;
      },
      __dQ : function(mD){

        if(!mD || !this.__db)return;
        this.__db[mD.getId()] = mD;
        var mE = this.__dc[mD.getType()];
        if(typeof mE == fG){

          this.__dc[mD.getType()] = new Array;
          mE = this.__dc[mD.getType()];
        };
        mE.push(mD);
      },
      __dR : function(mF){

        if(!mF)return;
        if(typeof this.__db[mF.getId()] != fG)delete this.__db[mF.getId()];
        var mG = this.__dc[mF.getType()];
        if(typeof mG != fG)qx.lang.Array.remove(mG, mF);
        mF.dispose();
      },
      _onItemDeleted : function(mH){

        if(!mH)return;
        mH.fireEvent(fw);
        this.__dR(mH);
      },
      __dS : function(mI, mJ, mK){

        if(mJ || !mK){

          mI(mJ, mK);
          return;
        };
        if(this.parseSessionData(mK))mI(0); else mI(6);
      },
      __dT : function(mO, mM, mR){

        if(mM || !mR){

          mO(mM);
          return;
        };
        for(var i = 0;i < mR.length;i++){

          var mP = mR[i].f;
          var mL = mR[i].i;
          var mN = mR[i].d;
          var mQ = this.__db[mL];
          if(typeof mQ == fG && mP != 0 && mN){

            var mQ = this.__dP(mN, mP);
            if(mQ)this.__dQ(mQ);
          } else {

            if(mP == 0)this.__dR(mQ); else {

              if(typeof mQ == fG)return;
              if(mN)this.updateItem(mQ, mN);
              mQ.setDataFlags(mP);
            };
          };
          mN = null;
        };
        mO(0);
      },
      __dU : function(mT, mS, mW){

        if(mS || !mW){

          mT(mS, null);
          return;
        };
        var mU = {
          searchSpec : mW.searchSpec,
          dataFlags : mW.dataFlags,
          totalItemsCount : mW.totalItemsCount,
          indexFrom : mW.indexFrom,
          indexTo : mW.indexTo,
          items : []
        };
        for(var i = 0;i < mW.items.length;i++){

          var mV = this.__dP(mW.items[i], mW.dataFlags);
          if(mV)mU.items.push(mV);
          qx.core.ObjectRegistry.unregister(mV);
        };
        mT(0, mU);
        return mU;
      },
      __dV : function(nb, mY, na){

        if(mY || !na){

          nb(mY, na);
          return;
        };
        var mX = this.__dP(na.item, na.flags);
        qx.core.ObjectRegistry.unregister(mX);
        nb((mX === null ? 6 : 0), mX);
        return mX;
      },
      __dW : function(nd, nc, ne){

        if(!ne){

          var nf = this.getItem(nc);
          if(nf){

            nf.fireEvent(fw);
            this.__dR(nf);
          };
        };
        nd(ne);
      }
    },
    destruct : function(){

      this.__dO();
      this._disposeObjects(fz, gx, L);
    },
    events : {
      "serverUpdated" : B,
      "invalidSession" : B,
      "fileUploaded" : go,
      "featuresUpdated" : B,
      "unitsUpdated" : go
    },
    statics : {
      exportDataFlag : {
        userName : 0x0001,
        userCreatorName : 0x0002,
        userAccount : 0x0004,
        userBillingPlan : 0x0008,
        userLastVisit : 0x0010,
        unitName : 0x0001,
        unitCreatorName : 0x0002,
        unitAccount : 0x0004,
        unitDeviceType : 0x0008,
        unitUid : 0x0010,
        unitPhone : 0x0020,
        unitLastMsg : 0x0040,
        unitCreated : 0x0080,
        unitCustomFields : 0x0100,
        unitGroups : 0x0200,
        unitDeactivation : 0x0400,
        unitGroupName : 0x0001,
        unitGroupCreatorName : 0x0002,
        unitGroupAccount : 0x0004,
        unitGroupUnitsCount : 0x0008,
        accountName : 0x0001,
        accountCreatorName : 0x0002,
        accountParentAccount : 0x0004,
        accountBillingPlan : 0x0008,
        accountDealer : 0x0010,
        accountUnits : 0x0020,
        accountBalance : 0x0040,
        accountDays : 0x0080,
        accountStatus : 0x0100,
        accountBlocked : 0x0200,
        accountActivatedUnits : 0x0400,
        retranslatorName : 0x0001,
        retranslatorCreatorName : 0x0002,
        retranslatorAccount : 0x0004,
        retranslatorProtocol : 0x0008,
        retranslatorServer : 0x0010,
        retranslatorState : 0x0020,
        retranslatorUnitNames : 0x0040,
        retranslatorUnitIds : 0x0080
      },
      destroyInstance : function(){

        if(this.$$instance){

          this.$$instance.dispose();
          delete this.$$instance;
        };
      }
    }
  });
  var hN = window.setInterval(function(){

    if(qx.$$loader.scriptLoaded){

      clearInterval(hN);
      var nh = fE;
      if(document.currentScript)nh = document.currentScript.src; else {

        var nj = document.getElementsByTagName(x);
        for(var i = 0;i < nj.length;i++)if(nj[i].src.search(gO) > 0 && nj[i].src.lastIndexOf(fj) >= 0){

          nh = nj[i].src;
          break;
        };
      };
      var nk = hJ;
      var ng = new RegExp(nk);
      var ni = ng.exec(nh);
      if(ni != null && typeof window[ni[1]] == gU)window[ni[1]]();
    };
  }, 50);
})();
(function(){

  var a = "prp",b = "qx.event.type.Data",c = "file/mkdir",d = "item/add_log_record",e = "item/list_backups",f = "mu",g = "Integer",h = "string",i = "delete_item",j = "Object",k = "prpu",l = "bact",m = "custom_msg",n = "&svc=file/get&params=",o = "item/restore_icons",p = "qx.event.type.Event",q = "item/get_backup",r = "nm",s = "item/update_custom_property",t = "changeUserAccess",u = "update_name",v = "String",w = "changeDataFlags",x = "unitIcons",y = "",z = "changeMeasureUnits",A = "number",B = "file/write",C = "item/update_name",D = "qx.strict",E = "messageRegistered",F = "item/update_ftp_property",G = "uacl",H = "file/read",I = "ct",J = "file/put",K = "changeCustomProperty",L = "changeFtpProperty",M = "file/rm",N = "wialon.item.Item",O = "item/update_measure_units",P = "changeName",Q = "crt",R = "resId",S = "update_access",T = "file/list",U = "undefined",V = "?sid=",W = "object";
  qx.Class.define(N, {
    extend : qx.core.Object,
    construct : function X(ba, Y){

      if(qx.core.Environment.get(D)){

        this.callee(X, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this.setDataFlags(Y);
      this._id = ba.id;
      this._type = ba.tp;
    },
    properties : {
      dataFlags : {
        init : null,
        check : g,
        event : w
      },
      name : {
        init : null,
        check : v,
        event : P
      },
      measureUnits : {
        init : 0,
        check : g,
        event : z
      },
      userAccess : {
        init : null,
        check : g,
        event : t
      },
      customProps : {
        init : null,
        check : j
      },
      creatorId : {
        init : null,
        check : g
      },
      accountId : {
        init : null,
        check : g
      },
      creationTime : {
        init : null,
        check : g
      },
      ftpProps : {
        init : null,
        check : j
      }
    },
    members : {
      _id : 0,
      _type : y,
      getId : function(){

        return this._id;
      },
      getType : function(){

        return this._type;
      },
      getCustomProperty : function(bc, bd){

        var bb = this.getCustomProps();
        if(bb){

          var be = bb[bc];
          if(typeof be != U)return be;
        };
        if(typeof bd != U)return bd;
        return y;
      },
      setCustomProperty : function(bg, bf){

        var bi = this.getCustomProps();
        if(bi){

          var bh = bi[bg];
          if(typeof bh == U)bh = y;
          if(bf != y)bi[bg] = bf; else if(bh != y)delete bi[bg];;
          if(bf != bh)this.fireDataEvent(K, {
            n : bg,
            v : bf
          }, {
            n : bg,
            v : bh
          });
        };
      },
      getFtpProperty : function(bk, bl){

        var bj = this.getFtpProps();
        if(bj){

          var bm = bj[bk];
          if(typeof bm != U)return bm;
        };
        if(typeof bl != U)return bl;
        return y;
      },
      setFtpProperty : function(bo, bn){

        var bq = this.getFtpProps();
        if(bq){

          var bp = bq[bo];
          if(typeof bp == U)bp = y;
          if(bn != y)bq[bo] = bn; else if(bp != y)delete bq[bo];;
          if(bn != bp)this.fireDataEvent(L, {
            n : bo,
            v : bn
          }, {
            n : bo,
            v : bp
          });
        };
      },
      handleMessage : function(br){

        this.fireDataEvent(E, br, null);
      },
      handleDeleteMessage : function(){
      },
      updateCustomProperty : function(bu, bt, bs){

        return wialon.core.Remote.getInstance().remoteCall(s, {
          itemId : this.getId(),
          name : bu,
          value : (typeof bt == h || typeof bt == A) ? bt : y
        }, qx.lang.Function.bind(this.__dY, this, wialon.util.Helper.wrapCallback(bs)));
      },
      updateFtpProperty : function(bv, bw){

        if(typeof bv.ps == U){

          return wialon.core.Remote.getInstance().remoteCall(F, {
            itemId : this.getId(),
            host : bv.hs,
            login : bv.lg,
            path : bv.pt,
            check : bv.ch,
            hostingFtp : bv.tp
          }, qx.lang.Function.bind(this.__ea, this, wialon.util.Helper.wrapCallback(bw)));
        } else {

          return wialon.core.Remote.getInstance().remoteCall(F, {
            itemId : this.getId(),
            host : bv.hs,
            login : bv.lg,
            pass : bv.ps,
            path : bv.pt,
            check : bv.ch,
            hostingFtp : bv.tp
          }, qx.lang.Function.bind(this.__ea, this, wialon.util.Helper.wrapCallback(bw)));
        };
      },
      updateMeasureUnits : function(bz, by, bx){

        return wialon.core.Remote.getInstance().remoteCall(O, {
          itemId : this.getId(),
          type : bz,
          flags : by
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(bx)));
      },
      updateName : function(name, bA){

        return wialon.core.Remote.getInstance().remoteCall(C, {
          itemId : this.getId(),
          name : name
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(bA)));
      },
      addLogRecord : function(bB, bD, bE, bC){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          action : bB,
          newValue : bD || y,
          oldValue : bE || y
        }, wialon.util.Helper.wrapCallback(bC));
      },
      fileGet : function(bF, bG){

        var bI = {
          itemId : this.getId(),
          storageType : bF,
          path : bG
        };
        var bH = wialon.core.Session.getInstance();
        return bH.getBaseUrl() + bH.getApiPath() + V + wialon.core.Session.getInstance().getId() + n + encodeURIComponent(wialon.util.Json.stringify(bI));
      },
      fileList : function(bK, bN, bL, bJ, bO, bM){

        wialon.core.Remote.getInstance().remoteCall(T, {
          itemId : this.getId(),
          storageType : bK,
          path : bN,
          mask : bL,
          recursive : bJ,
          fullPath : bO
        }, wialon.util.Helper.wrapCallback(bM));
      },
      fileRm : function(bP, bQ, bR){

        wialon.core.Remote.getInstance().remoteCall(M, {
          itemId : this.getId(),
          storageType : bP,
          path : bQ
        }, wialon.util.Helper.wrapCallback(bR));
      },
      fileMkdir : function(bS, bT, bU){

        wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          storageType : bS,
          path : bT
        }, wialon.util.Helper.wrapCallback(bU));
      },
      filePut : function(bX, cc, bW, bV, cb, bY){

        var ca = {
        };
        ca.itemId = this.getId();
        ca.storageType = bX;
        ca.path = cc;
        ca.writeType = bV;
        wialon.core.Uploader.getInstance().uploadFiles([bW], J, ca, bY, true, cb);
      },
      fileRead : function(cd, cg, cf, ce){

        wialon.core.Remote.getInstance().remoteCall(H, {
          itemId : this.getId(),
          storageType : cd,
          contentType : cf,
          path : cg
        }, wialon.util.Helper.wrapCallback(ce));
      },
      fileWrite : function(cj, cl, content, ci, ch, ck){

        wialon.core.Remote.getInstance().remoteCall(B, {
          itemId : this.getId(),
          storageType : cj,
          path : cl,
          writeType : ci,
          contentType : ch,
          content : content
        }, wialon.util.Helper.wrapCallback(ck));
      },
      listBackups : function(cm){

        wialon.core.Remote.getInstance().remoteCall(e, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(cm));
      },
      getBackup : function(co, cn){

        wialon.core.Remote.getInstance().remoteCall(q, {
          itemId : this.getId(),
          fileId : co
        }, wialon.util.Helper.wrapCallback(cn));
      },
      restoreIcons : function(cq, cp){

        var cr = {
        };
        if(cq && typeof cq == W){

          cr = cq;
          cr[R] = this.getId();
        } else {

          cr[x] = {
          };
          cr[x][this.getId()] = cq;
        };
        wialon.core.Remote.getInstance().remoteCall(o, cr, wialon.util.Helper.wrapCallback(cp));
      },
      __dY : function(cs, ct, cu){

        if(ct == 0 && cu)this.setCustomProperty(cu.n, cu.v);
        cs(ct);
      },
      __ea : function(cv, cw, cx){

        if(cw == 0 && cx)this.setFtpProps(cx);
        cv(cw);
      },
      _onUpdateProperties : function(cy, cz, cA){

        if(cz == 0 && cA)wialon.core.Session.getInstance().updateItem(this, cA);
        cy(cz);
      }
    },
    statics : {
      dataFlag : {
        base : 0x00000001,
        customProps : 0x00000002,
        billingProps : 0x00000004,
        customFields : 0x00000008,
        image : 0x00000010,
        messages : 0x00000020,
        guid : 0x00000040,
        adminFields : 0x00000080,
        profileFields : 0x00800000,
        taskMessages : 0x01000000
      },
      accessFlag : {
        view : 0x1,
        viewProperties : 0x2,
        setAcl : 0x4,
        deleteItem : 0x8,
        editName : 0x10,
        viewCFields : 0x20,
        editCFields : 0x40,
        editOther : 0x80,
        editImage : 0x100,
        execReports : 0x200,
        editSubItems : 0x400,
        manageLog : 0x800,
        viewAFields : 0x1000,
        editAFields : 0x2000,
        viewFile : 0x4000,
        editFile : 0x8000
      },
      messageFlag : {
        typeMask : 0xFF00,
        typeUnitData : 0x0000,
        typeUnitSMS : 0x0100,
        typeUnitCmd : 0x0200,
        typeUnitEvent : 0x0600,
        typeUserLog : 0x0400,
        typeNotification : 0x0300,
        typeBalance : 0x0500,
        typeAgroCultivation : 0x0700,
        typeDriverSMS : 0x0900,
        typeLogRecord : 0x1000,
        typeOrder : 0x0B00,
        typeOther : 0xFF00,
        typeUnitTask : 0x5000
      },
      measureUnitsType : {
        si : 0x00,
        us : 0x01,
        im : 0x02,
        lat : 0x03
      },
      measureUnitsFlag : {
        setMeasureUnits : 0x00,
        convertMeasureUnits : 0x01
      },
      logMessageAction : {
        itemCustomMessage : m,
        itemUpdatedName : u,
        itemUpdatedUserAccess : S,
        itemDeleted : i
      },
      fileStorageType : {
        publicType : 1,
        protectedType : 2
      },
      fileWriteType : {
        overwrite : 0,
        append : 1,
        skip : 2
      },
      fileContentType : {
        plainText : 0,
        hexString : 1,
        base64 : 2
      },
      registerProperties : function(){

        var cB = wialon.core.Session.getInstance();
        cB.registerProperty(r, this.remoteUpdateName);
        cB.registerProperty(f, this.remoteUpdateMeasureUnits);
        cB.registerProperty(G, this.remoteUpdateUserAccess);
        cB.registerProperty(a, this.remoteUpdateCustomProps);
        cB.registerProperty(k, this.remoteUpdateCustomProp);
        cB.registerProperty(Q, this.remoteUpdateCreatorId);
        cB.registerProperty(l, this.remoteUpdateAccountId);
        cB.registerProperty(I, this.remoteUpdateCreationTime);
      },
      remoteUpdateName : function(cC, cD){

        cC.setName(cD);
      },
      remoteUpdateMeasureUnits : function(cE, cF){

        cE.setMeasureUnits(cF);
      },
      remoteUpdateUserAccess : function(cG, cH){

        cG.setUserAccess(cH);
      },
      remoteUpdateCustomProps : function(cI, cJ){

        cI.setCustomProps(cJ);
      },
      remoteUpdateCustomProp : function(cK, cM){

        for(var cL in cM){

          cK.setCustomProperty(cL, cM[cL]);
        };
      },
      remoteUpdateCreatorId : function(cN, cO){

        cN.setCreatorId(cO);
      },
      remoteUpdateAccountId : function(cP, cQ){

        cP.setAccountId(cQ);
      },
      remoteUpdateCreationTime : function(cR, cS){

        cR.setCreationTime(cS);
      }
    },
    events : {
      "changeName" : b,
      "changeDataFlags" : b,
      "changeUserAccess" : b,
      "changeCustomProperty" : b,
      "itemDeleted" : p,
      "messageRegistered" : b,
      "changeFtpProperty" : b
    }
  });
})();
(function(){

  var a = "/post.html",b = "/post.html?2",c = '',d = "geocode",e = "singleton",f = "wialon.core.Remote",g = "/gis_post?3",h = "error",j = "/gis_post?1",k = "abort",l = "success",m = "search",n = ":",o = "core/batch",p = "",q = "/gis_geocode",r = "sdk",s = "qx.strict",t = "/gis_search",u = "function",v = "//",w = "statusError",x = "/gis_post?2",y = "?svc=",z = '/wialon',A = "/post.html?3",B = "routing",C = "/post.html?1",D = "/wialon",E = "timeout",F = "undefined",G = "object";
  qx.Class.define(f, {
    extend : qx.core.Object,
    type : e,
    construct : function I(){

      if(qx.core.Environment.get(s)){

        this.callee(I, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this.setRequestsBaseUrl();
      this.queueRequest = new H(3);
    },
    members : {
      __eb : null,
      __ec : [],
      __ed : p,
      __ee : 30,
      setRequestsBaseUrl : function(){

        var J = wialon.core.Session.getInstance();
        var K = J.isWhiteLabel();
        var L = K ? c : z;
        this._req = {
        };
        this._req[r] = new wialon.core.PostMessage(this.createFullUrl(J.getBaseUrl()) + L + a);
        this.updateGisSenders();
      },
      remoteCall : function(O, R, P, S){

        P = wialon.util.Helper.wrapCallback(P);
        if(typeof S == F)S = this.__ee;
        if(this.__eb)this.__eb.push({
          svc : O,
          params : R ? R : {
          },
          callback : P,
          timeout : S
        }); else {

          var Q = wialon.core.Session.getInstance();
          var M = Q.getApiPath() + y + O;
          var N = {
            params : {
            }
          };
          if(R)N = {
            params : R
          };
          var self = this;
          return this.queueRequest.schedule(function(T){

            self.ajaxRequest(M, N, function(V, U){

              P(V, U);
              T();
            }, S, O);
          });
        };
      },
      updateGisSenders : function(){

        this.updateGisSender(m);
        this.updateGisSender(d);
        this.updateGisSender(B);
      },
      updateGisSender : function(bc){

        if(!this._req){

          return;
        };
        var ba = wialon.core.Session.getInstance();
        var W = {
          search : ba.getBaseGisUrl(m) ? j : C,
          geocode : ba.getBaseGisUrl(d) ? x : b,
          routing : ba.getBaseGisUrl(B) ? g : A
        };
        var Y = this._req[bc];
        if(Y && Y._io && (typeof postMessage.dispose === u)){

          Y.dispose();
        };
        var bb = W[bc];
        if(bb){

          var X;
          if(ba.getBaseGisUrl(bc) != p){

            X = this.createFullUrl(ba.getBaseGisUrl(bc)) + bb;
          } else {

            X = this.createFullUrl() + D + bb;
          };
          this._req[bc] = new wialon.core.PostMessage(X);
        };
      },
      replaceSender : function(bd, be){

        this._req[bd] = be;
      },
      startBatch : function(bf){

        if(this.__eb)return 0;
        if(bf)this.__ed = bf;
        this.__eb = new Array;
        return 1;
      },
      finishBatch : function(bg, bl, bm){

        bg = wialon.util.Helper.wrapCallback(bg);
        if(!this.__eb){

          bg(2, 2);
          return;
        };
        this.__ec.push(bg);
        if(this.__ed && bl != this.__ed){

          return;
        };
        bg = wialon.util.Helper.wrapCallback(this.__ec);
        if(!this.__eb.length){

          this.__ed = p;
          this.__ec = [];
          this.__eb = null;
          bg(0, 0);
          return;
        };
        if(!bm)bm = 0;
        var bj = 0;
        var bk = [];
        var bh = [];
        for(var i = 0;i < this.__eb.length;i++){

          var bi = this.__eb[i];
          bk.push({
            svc : bi.svc,
            params : bi.params
          });
          bh.push(bi.callback);
          if(bi.timeout > bj)bj = bi.timeout;
        };
        this.__eb = null;
        this.__ed = p;
        this.__ec = [];
        this.remoteCall(o, {
          params : bk,
          flags : bm
        }, qx.lang.Function.bind(this.__ei, this, bg, bh), bj);
      },
      ajaxRequest : function(bo, br, bq, bs, bn){

        var bp = r;
        if(bo.match(q))bp = d; else if(bo.match(t))bp = m;;
        if(this._req[bp].supportAsync())this._req[bp].send(bo, br, qx.lang.Function.bind(this.__ef, this, bq), qx.lang.Function.bind(this.__eg, this, bq), bs, {
        }); else {

          br.svc = bn;
          var bt = wialon.util.Json.stringify(br);
          br = null;
          return this.__ef(bq, wialon.util.Json.parse(this._req[bp].send(bt)));
        };
      },
      jsonRequest : function(bu, by, bx, bz, bA){

        var bw = new qx.io.request.Jsonp(bu);
        var bv = null;
        bw.setCache(false);
        if(bA)bw.setCallbackName(bA);
        bw.setTimeout(bz * 1000);
        if(by){

          if(typeof by == G)bw.setRequestData(by); else bw.setRequestData({
            params : by
          });
        };
        if(bx){

          bw.addListener(l, qx.lang.Function.bind(this.__eh, this, bx, bw));
          bv = qx.lang.Function.bind(this.__eg, this, bx, bw);
          bw.addListener(h, bv);
          bw.addListener(k, bv);
          bw.addListener(E, bv);
          bw.addListener(w, bv);
        };
        bw.send();
        bw = null;
        bv = null;
      },
      setBaseUrl : function(bB){

        this.__dg = bB;
      },
      setTimeout : function(bC){

        this.__ee = bC;
      },
      getTimeout : function(){

        return this.__ee;
      },
      createFullUrl : function(bD){

        if(typeof document == F)return bD;
        return bD ? bD : document.location.protocol + v + document.location.hostname + (document.location.port.length ? n + document.location.port : p);
      },
      __ef : function(bE, bF){

        return this.__ej(bF, bE);
      },
      __eg : function(bG, bH){

        bG(5, null);
      },
      __eh : function(bI, bJ){

        this.__ej(bJ.getResponse(), bI);
      },
      __ei : function(bL, bN, bK, bM){

        if(bK == 0 && (!bM || !bN || bN.length != bM.length))bK = 3;
        if(bK){

          for(var i = 0;i < bN.length;i++)bN[i] ? bN[i](bK) : null;
          bL(bK, bK);
          return;
        };
        var bR = 0;
        var bQ = [];
        var bP = 0;
        var bO = [];
        for(var i = 0;i < bM.length;i++){

          bO.push(this.__ej(bM[i], bN[i]));
          if(bM[i])bR = bM[i];
          bQ.push(bM[i]);
          if(typeof bM[i].error != F)bP++;
        };
        bL(bK, bR, bP, bQ);
        return bO;
      },
      __ej : function(bT, bS){

        if(bT && typeof bT.error != F && bT.error != 0)return bS(bT.error, bT); else if(bT)return bS(0, bT); else return bS(3, null);;
      }
    },
    destruct : function(){

      if(this._req)for(var bV in this._req)if(this._req.hasOwnProperty(bV)){

        var bU = this._req[bV];
        if(bU && (typeof bU.dispose === u)){

          bU.dispose();
        };
      };;
    },
    statics : {
      BatchFlag : {
        breakFailure : 0x01
      },
      destroyInstance : function(){

        if(this.$$instance){

          this.$$instance.dispose();
          delete this.$$instance;
        };
      }
    }
  });
  function H(bY){

    var bW = 0;
    var bX = [];
    this.schedule = function(cb){

      if(bW >= bY){

        bX.push(cb);
      } else {

        bW++;
        cb(ca);
      };
    };
    function ca(){

      bW--;
      if(bX.length && bW < bY){

        var cc = bX.shift();
        bW++;
        cc(ca);
      };
    };
  };
})();
(function(){

  var a = "onmessage",b = "message",c = "wialon.core.PostMessage",d = '',e = "string",f = "&sid=",g = "src",h = "onload",j = "load",k = ":",l = "\", \"enableChunkedResult\": true}",m = "posthtml",o = "",p = "qx.strict",q = "\", \"chunkedPrefix\": \"",r = "sid",s = "{\"id\": 0, \"source\":\"",t = "&",u = "none",v = "=",w = "iframe",x = "object";
  qx.Class.define(c, {
    extend : qx.core.Object,
    construct : function y(z){

      if(qx.core.Environment.get(p)){

        this.callee(y, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this._url = z;
      this._id = this._url;
      this._io = null;
      this._callbacks = {
      };
      this._chunkedPrefix = m + (++wialon.core.PostMessage._postMessagePrefixCounter) + k;
    },
    members : {
      send : function(C, E, B, G, F){

        if(!this._io){

          this._io = document.createElement(w);
          this._io.style.display = u;
          if(window.attachEvent)this._io.attachEvent(h, qx.lang.Function.bind(this.__er, this)); else this._io.addEventListener(j, qx.lang.Function.bind(this.__er, this), false);
          this._io.setAttribute(g, this._url);
          document.body.appendChild(this._io);
          this._messageEventHandler = qx.lang.Function.bind(this.__eo, this);
          if(window.addEventListener){

            window.addEventListener(b, this._messageEventHandler, false);
          } else {

            window.attachEvent(a, this._messageEventHandler);
          };
        };
        var H = {
          id : ++this._counter,
          url : C,
          params : this.__ek(E),
          source : this._id
        };
        var D = this._io.contentWindow;
        if(D){

          var A = wialon.util.Json.stringify(H);
          this._callbacks[this._counter] = [B, G, A, 0, F];
          if(F)this._callbacks[this._counter].push(setTimeout(qx.lang.Function.bind(this.__el, this, this._counter), F * 1000));
          if(this._frameReady)D.postMessage(A, this._url); else this._requests.push(A);
        } else G();
      },
      supportAsync : function(){

        return true;
      },
      _url : o,
      _io : null,
      _id : 0,
      _callbacks : {
      },
      _requests : [],
      _frameReady : false,
      _timeout : 0,
      _counter : 0,
      _chunkedPrefix : null,
      _chunkedResultEnabled : false,
      _chunksAwaiting : {
      },
      __eo : function(event){

        var K = event.data;
        var L = this._url && new URL(this._url).origin;
        if(event.origin != L){

          return;
        };
        if(this._chunkedResultEnabled){

          var I = this.__eq(K);
          if(!I)return;
          if(I.chunksCount === 1){

            K = I.data;
          } else {

            var N = this._chunksAwaiting[I.id];
            if(!N){

              N = {
                chunksLeft : I.chunksCount,
                chunks : []
              };
              for(var i = 0;i < I.chunksCount;i++){

                N.chunks.push(null);
              };
              this._chunksAwaiting[I.id] = N;
            };
            if(!N.chunks[I.chunkIndex]){

              N.chunks[I.chunkIndex] = I.data;
              N.chunksLeft--;
            };
            if(!N.chunksLeft){

              K = N.chunks.join(d);
              delete this._chunksAwaiting[I.id];
            } else {

              return;
            };
          };
        };
        var M = wialon.util.Json.parse(K);
        if(!M || M.source != this._id)return;
        if(!M.id){

          this._frameReady = true;
          if(M.chunkedResult){

            this._chunkedResultEnabled = true;
          };
          this.__er();
          return;
        };
        var J = this._callbacks[M.id];
        if(J){

          if(M && M.text && M.text.error && M.text.error == 1003 && J[3] < 3){

            J[3]++;
            if(J[4] && J[5]){

              clearTimeout(J[5]);
              J[5] = setTimeout(qx.lang.Function.bind(this.__el, this, this._counter), J[4] * 1000);
            };
            if(this._io.contentWindow){

              setTimeout(qx.lang.Function.bind(function(O){

                this._io.contentWindow.postMessage(O, this._url);
              }, this, J[2]), Math.random() * 1000);
              return;
            };
          };
          if(J[M.error])J[M.error](M.text);
          if(J[4] && J[5])clearTimeout(J[5]);
          delete this._callbacks[M.id];
        };
      },
      __eq : function(T){

        if(typeof T !== e)return false;
        if(T.slice(0, this._chunkedPrefix.length) !== this._chunkedPrefix)return null;
        var W = T.indexOf(k, this._chunkedPrefix.length);
        if(W < 0)return false;
        var P = T.indexOf(k, W + 1);
        if(P < 0)return false;
        var S = T.indexOf(k, P + 1);
        if(S < 0)return false;
        var Q = parseInt(T.slice(this._chunkedPrefix.length, W), 10),U = parseInt(T.slice(W + 1, P), 10),R = parseInt(T.slice(P + 1, S), 10),V = T.slice(S + 1);
        if(!isFinite(Q) || !isFinite(U) || !isFinite(R))return false;
        return {
          id : Q,
          chunkIndex : U,
          chunksCount : R,
          data : V
        };
      },
      __er : function(){

        if(!this._frameReady){

          var X = s + this._id + q + this._chunkedPrefix + l;
          this._io.contentWindow.postMessage(X, this._url);
          return;
        };
        for(var i = 0;i < this._requests.length;i++)this._io.contentWindow.postMessage(this._requests[i], this._url);
        this._requests = [];
      },
      __el : function(ba){

        var Y = this._callbacks[ba];
        if(Y){

          if(Y[1])Y[1]();
          delete this._callbacks[ba];
        };
      },
      __ek : function(bd){

        var bb = [];
        var bc = false;
        if(typeof bd == x){

          for(var n in bd){

            if(typeof bd[n] == x)bb.push(n + v + encodeURIComponent(wialon.util.Json.stringify(bd[n]))); else bb.push(n + v + encodeURIComponent(bd[n]));
            if(n == r)bc = true;
          };
          return bb.join(t) + (!bc ? f + wialon.core.Session.getInstance().getId() : o);
        };
        return !bc ? f + wialon.core.Session.getInstance().getId() : o;
      }
    },
    destruct : function(){

      if(this._io && this._io.parentNode){

        this._io.parentNode.removeChild(this._io);
        this._io = null;
      };
      if(this._messageEventHandler){

        if(window.addEventListener){

          window.removeEventListener(b, this._messageEventHandler);
        } else {

          window.detachEvent(a, this._messageEventHandler);
        };
        this._messageEventHandler = null;
      };
    },
    statics : {
      _postMessagePrefixCounter : 0
    }
  });
})();
(function(){

  var d = '\\u00',g = "array",h = '',j = '\\\\',k = '\\f',m = ']',n = "static",o = "wialon.util.Json",p = '"',q = "null",r = '\\"',s = ',',t = '(',u = ':',w = "",y = '\\t',z = "number",A = '\\r',B = '{',C = 'null',D = 'string',E = '\\b',F = '[',G = ')',H = '\\n',I = '}';
  qx.Class.define(o, {
    type : n,
    statics : {
      stringify : function(J){

        var f = null;
        if(isNaN(J))f = this.__ep[typeof J]; else if(J instanceof Array)f = this.__ep[g]; else f = this.__ep[z];;
        if(f)return f.apply(this, [J]);
        return w;
      },
      parse : function(json, safe){

        try{

          return JSON.parse(json);
        } catch(e) {
        };
        if(safe === undefined)safe = false;
        if(safe && !/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(json))return undefined;
        if(!json || json == w)return {
        };
        var res = null;
        try{

          res = qx.lang.Json.parse(json);
        } catch(e1) {

          try{

            res = eval(t + json + G);
          } catch(e) {

            try{

              res = eval(p + json + p);
            } catch(K) {

              return null;
            };
          };
        };
        return res;
      },
      compareObjects : function(L, M){

        if((L == null && M != null) || (M == null && L != null))return false;
        return this.stringify(L) == this.stringify(M);
      },
      __ep : {
        'array' : function(x){

          var a = [F],b,f,i,l = x.length,v;
          for(i = 0;i < l;i += 1){

            v = x[i];
            f = this.__ep[typeof v];
            if(f){

              v = f.apply(this, [v]);
              if(typeof v == D){

                if(b){

                  a[a.length] = s;
                };
                a[a.length] = v;
                b = true;
              };
            };
          };
          a[a.length] = m;
          return a.join(h);
        },
        'boolean' : function(x){

          return String(x);
        },
        'null' : function(x){

          return q;
        },
        'number' : function(x){

          return isFinite(x) ? String(x) : C;
        },
        'object' : function(x){

          if(x){

            if(x instanceof Array){

              return this.__ep.array.apply(this, [x]);
            };
            var a = [B],b,f,i,v;
            for(i in x){

              v = x[i];
              f = this.__ep[typeof v];
              if(f){

                v = f.apply(this, [v]);
                if(typeof v == D){

                  if(b){

                    a[a.length] = s;
                  };
                  a.push(this.__ep.string.apply(this, [i]), u, v);
                  b = true;
                };
              };
            };
            a[a.length] = I;
            return a.join(h);
          };
          return C;
        },
        'string' : function(x){

          if(/["\\\x00-\x1f]/.test(x)){

            x = x.replace(/([\x00-\x1f\\"])/g, function(a, b){

              var N = {
                '\b' : E,
                '\t' : y,
                '\n' : H,
                '\f' : k,
                '\r' : A,
                '"' : r,
                '\\' : j
              };
              var c = N[b];
              if(c){

                return c;
              };
              c = b.charCodeAt();
              return d + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            });
          };
          return p + x + p;
        }
      }
    }
  });
})();
(function(){

  var e = "function",f = "\\+",g = "core/check_unique",h = "\\)",j = "static",l = "\\]",m = "resource/get_zones_by_point",n = "\\^",o = "\\[",p = "wialon.util.Helper",q = "*",s = "",t = "\\.",u = '$',v = "\\(",w = '^',y = "\\{",z = "\\\\",A = "\\}",B = 'string',C = "?",D = ".*",E = "\\$",F = ".",G = "undefined",H = "object";
  qx.Class.define(p, {
    type : j,
    statics : {
      filterItems : function(I, J){

        if(!I)return null;
        var K = new Array;
        for(var i = 0;i < I.length;i++){

          var L = I[i];
          if(!L || wialon.util.Number.and(L.getUserAccess(), J) != J)continue;
          K.push(L);
        };
        return K;
      },
      searchObject : function(N, M, P){

        if(!N || !M || !P)return null;
        for(var O in N){

          if(typeof N[O][M] == G || N[O][M] != P)continue;
          return N[O];
        };
        return null;
      },
      sortItems : function(bq, bg, bp, br){

        var bn = (new Date()).getTime();
        if(!bq)return null;
        if(typeof bg != e)bg = function(a){

          return a.getName();
        };
        var S = {
        },R = false,Q,Y,bc,bh,x = 0,c = 0,d = 0,X = false,bf = false,W = 0,i = 0,bd = false,bj = false,bl = false,be,T,V,U;
        be = /(\d*\.?\d+)|((-*\.*[^\d]+)+)/g;
        T = /(-?\d*\.?\d+)|((-*\.*[^-\d]+)+)/g;
        V = be;
        U = V;
        if(typeof br != G){

          if(br & 0x1)bl = true;
          if(br & 0x2)V = T;
          if(br & 0x4)U = T;
        };
        var bi = function(bt, bu){

          return bt.match(bu ? U : V);
        };
        var ba = this._containsRTL;
        var bm = this._convertArabicForth.bind(this);
        var bk = bq.some(function(bv){

          if(!bv)return false;
          var name = bg(bv);
          return ba(name);
        });
        var bs = function(bw){

          if(!bw)return null;
          bf = false;
          var bx;
          for(i = 0;i < bw.length;i++){

            if(!bf){

              W = ~~bw[i];
              x = bw[i].length;
              X = false;
              if((W + s).length != x || W != bw[i]){

                W = parseFloat(bw[i]);
                X = (W == W);
              } else X = true;
              if(i > 0 || X){

                bw[i] = [W, bw[i], x];
                bf = true;
              } else bf = false;
            } else {

              bx = bw[i];
              if(bk && (typeof bx === B)){

                bw[i] = bm(bx);
              };
              bf = false;
            };
          };
          return bw;
        };
        var bo = function(a, b, by){

          R = (by && typeof bp == e);
          bc = R ? bp(bl ? b : a) : bg(bl ? b : a);
          bh = R ? bp(bl ? a : b) : bg(bl ? a : b);
          Q = S[bc];
          if(typeof Q == G){

            Q = bs(bi(bc.toLowerCase(), by));
            S[bc] = Q;
          };
          Y = S[bh];
          if(typeof Y == G){

            Y = bs(bi(bh.toLowerCase(), by));
            S[bh] = Y;
          };
          if(!Q || !Y || !Q.length || !Y.length){

            if(!Q || !Q.length)return -1;
            if(!Y || !Y.length)return 1;
            if(!by && typeof bp == e)bo(a, b, true);
            return 0;
          };
          for(x = 0;Q[x] && Y[x];x++){

            if(typeof Q[x] == H){

              c = Q[x][0];
              bd = true;
            } else {

              c = Q[x];
              bd = false;
            };
            if(typeof Y[x] == H){

              d = Y[x][0];
              bj = true;
            } else {

              d = Y[x];
              bj = false;
            };
            if(c !== d){

              if(bd && bj)return c - d; else {

                if(bd)c = Q[x][1];
                if(bj)d = Y[x][1];
                return (c > d) ? 1 : -1;
              };
            } else if(bd && bj && Q[x][2] != Y[x][2])return Y[x][2] - Q[x][2];;
          };
          if(Q.length == Y.length && !by && typeof bp == e)return bo(a, b, true);
          return Q.length - Y.length;
        };
        bq.sort(bo);
        S = null;
        return bq;
      },
      getZonesInPoint : function(bA, bz){

        return wialon.core.Remote.getInstance().remoteCall(m, {
          spec : bA
        }, wialon.util.Helper.wrapCallback(bz));
      },
      checkUniqueName : function(bC, bB){

        return wialon.core.Remote.getInstance().remoteCall(g, bC, wialon.util.Helper.wrapCallback(bB));
      },
      wildcardCompare : function(bI, bH, bD){

        if(bI == null || bH == null)return null;
        if(bD && bH.indexOf(q) == -1 && bH.indexOf(C) == -1)bH = q + bH + q;
        var bG = bH.toLowerCase();
        bG = bG.replace(/\\/g, z);
        bG = bG.replace(/\./g, t);
        bG = bG.replace(/\?/g, F);
        bG = bG.replace(/\*/g, D);
        bG = bG.replace(/\^/g, n);
        bG = bG.replace(/\$/g, E);
        bG = bG.replace(/\+/g, f);
        bG = bG.replace(/\(/g, v);
        bG = bG.replace(/\)/g, h);
        bG = bG.replace(/\[/g, o);
        bG = bG.replace(/\]/g, l);
        bG = bG.replace(/\{/g, y);
        bG = bG.replace(/\}/g, A);
        var bE = bI.toLowerCase().match(new RegExp(w + bG + u));
        return bE != null ? true : false;
      },
      wrapCallback : function(bJ){

        return typeof bJ == e ? bJ : qx.lang.Function.bind(this.__bH, this, bJ);
      },
      countProps : function(bL){

        var bK = 0;
        for(var k in bL){

          if(bL.hasOwnProperty(k)){

            bK++;
          };
        };
        return bK;
      },
      objectsEqual : function(bM, bN){

        if(typeof (bM) !== typeof (bN)){

          return false;
        };
        if(typeof (bM) === e){

          return bM.toString() === bN.toString();
        };
        if(bM instanceof Object && bN instanceof Object){

          if(this.countProps(bM) !== this.countProps(bN)){

            return false;
          };
          var r = true;
          for(var k in bM){

            r = this.objectsEqual(bM[k], bN[k]);
            if(!r){

              return false;
            };
          };
          return true;
        } else {

          return bM === bN;
        };
      },
      __bH : function(){

        if(!arguments.length)return arguments;
        var bP = Array.prototype.slice.call(arguments, 1);
        var bO = arguments[0];
        if(!bO)return bP;
        if(!(bO instanceof Array))bO = [bO];
        for(var i = 0;i < bO.length;i++)bO[i].apply(this, bP);
        return bP;
      },
      _containsRTL : function(bQ){

        return /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(bQ);
      },
      _convertArabicForth : function(bS){

        var bR = this._arabicMapForth;
        return bS.replace(/[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/g, function(x){

          return bR[x] || x;
        });
      },
      _arabicMapForth : (function(){

        var bT = {
        };
        [[8207, 1425], [1768, 1426], [1767, 1456], [1764, 1457], [1763, 1458], [1762, 1459], [1761, 1460], [1760, 1461], [1759, 1462], [1757, 1463], [1756, 1464], [1755, 1465], [1754, 1466], [1753, 1467], [1752, 1468], [1751, 1470], [1750, 1471], [1807, 1472], [8238, 1473], [1770, 1474], [1771, 1475], [1772, 1478], [1773, 1479], [8235, 1480], [1856, 1481], [1859, 1482], [1860, 1483], [1863, 1484], [1864, 1485], [1865, 1486], [1866, 1487], [65139, 1488], [2042, 1489], [1425, 1490], [1600, 1491], [1426, 1492], [1564, 1493], [1562, 1494], [1561, 1495], [1560, 1496], [1559, 1497], [1558, 1498], [1557, 1499], [1556, 1500], [1555, 1501], [1554, 1502], [1553, 1503], [1552, 1504], [1541, 1505], [1540, 1506], [1539, 1507], [1538, 1508], [1537, 1509], [1536, 1510], [1861, 1511], [1857, 1512], [1858, 1513], [1862, 1514], [1456, 1515], [1457, 1516], [1458, 1517], [1459, 1518], [1460, 1519], [1461, 1520], [1462, 1521], [1463, 1522], [1479, 1523], [1464, 1524], [1466, 1525], [1465, 1526], [1467, 1527], [1474, 1528], [1473, 1529], [1468, 1530], [1471, 1531], [64286, 1532], [1611, 1533], [65137, 1534], [65136, 1535], [1612, 1536], [65138, 1537], [64606, 1538], [1613, 1539], [65140, 1540], [64607, 1541], [1614, 1542], [65143, 1543], [65142, 1544], [64754, 1545], [64608, 1546], [1615, 1547], [65145, 1548], [65144, 1549], [64755, 1550], [64609, 1551], [1616, 1552], [65147, 1553], [65146, 1554], [64756, 1555], [64610, 1556], [1617, 1557], [65149, 1558], [65148, 1559], [64611, 1560], [1618, 1561], [65151, 1562], [65150, 1563], [1619, 1564], [1620, 1565], [1621, 1566], [1631, 1567], [1622, 1568], [1623, 1569], [1624, 1570], [1625, 1571], [1626, 1572], [1627, 1573], [1628, 1574], [1629, 1575], [1630, 1576], [1648, 1577], [1809, 1578], [1840, 1579], [1841, 1580], [1842, 1581], [1843, 1582], [1844, 1583], [1845, 1584], [1846, 1585], [1847, 1586], [1848, 1587], [1849, 1588], [1850, 1589], [1851, 1590], [1852, 1591], [1853, 1592], [1854, 1593], [1855, 1594], [2027, 1595], [2028, 1596], [2029, 1597], [2030, 1598], [2031, 1599], [2032, 1600], [2033, 1601], [2034, 1602], [2035, 1603], [1548, 1604], [1549, 1605], [1643, 1606], [1644, 1607], [2040, 1608], [1563, 1609], [1566, 1610], [1795, 1611], [1796, 1612], [1797, 1613], [1798, 1614], [1799, 1615], [1800, 1616], [2041, 1617], [1567, 1618], [1801, 1619], [1748, 1620], [1793, 1621], [1794, 1622], [1792, 1623], [2039, 1624], [64830, 1625], [64831, 1626], [1645, 1627], [1642, 1628], [1545, 1629], [1546, 1630], [1470, 1631], [1472, 1632], [1475, 1633], [1478, 1634], [1523, 1635], [1524, 1636], [1802, 1637], [1803, 1638], [1804, 1639], [1805, 1640], [1544, 1641], [1550, 1642], [1551, 1643], [1758, 1644], [1769, 1645], [65021, 1646], [64434, 1647], [64435, 1648], [64436, 1649], [64437, 1650], [64438, 1651], [64439, 1652], [64440, 1653], [64441, 1654], [64442, 1655], [64443, 1656], [64444, 1657], [64445, 1658], [64446, 1659], [64447, 1660], [64448, 1661], [64449, 1662], [2038, 1663], [64297, 1664], [1542, 1665], [1543, 1666], [1547, 1667], [65020, 1668], [1632, 1669], [1776, 1670], [1984, 1671], [1633, 1672], [1985, 1673], [1777, 1674], [1634, 1675], [1778, 1676], [1986, 1677], [1779, 1678], [1987, 1679], [1635, 1680], [1988, 1681], [1636, 1682], [1780, 1683], [1637, 1684], [1989, 1685], [1781, 1686], [1990, 1687], [1638, 1688], [1782, 1689], [1991, 1690], [1783, 1691], [1639, 1692], [1640, 1693], [1784, 1694], [1992, 1695], [1641, 1696], [1785, 1697], [1993, 1698], [1488, 1699], [64289, 1700], [64302, 1701], [64303, 1702], [64304, 1703], [64335, 1704], [1489, 1705], [64305, 1706], [64332, 1707], [1490, 1708], [64306, 1709], [1491, 1710], [64290, 1711], [64307, 1712], [1492, 1713], [64291, 1714], [64308, 1715], [1493, 1716], [64331, 1717], [64309, 1718], [1520, 1719], [1521, 1720], [1494, 1721], [64310, 1722], [1495, 1723], [1496, 1724], [64312, 1725], [1497, 1726], [64285, 1727], [64313, 1728], [1522, 1729], [64287, 1730], [1499, 1731], [64292, 1732], [1498, 1733], [64315, 1734], [64314, 1735], [64333, 1736], [1500, 1737], [64293, 1738], [64316, 1739], [1502, 1740], [64294, 1741], [1501, 1742], [64318, 1743], [1504, 1744], [1503, 1745], [64320, 1746], [1505, 1747], [64321, 1748], [1506, 1749], [64288, 1750], [1508, 1751], [1507, 1752], [64324, 1753], [64323, 1754], [64334, 1755], [1510, 1756], [1509, 1757], [64326, 1758], [1511, 1759], [64327, 1760], [1512, 1761], [64295, 1762], [64328, 1763], [1513, 1764], [64299, 1765], [64298, 1766], [64329, 1767], [64301, 1768], [64300, 1769], [1514, 1770], [64296, 1771], [64330, 1772], [1569, 1773], [1652, 1774], [65152, 1775], [1789, 1776], [1570, 1777], [65154, 1778], [65153, 1779], [1571, 1780], [65156, 1781], [65155, 1782], [1650, 1783], [1649, 1784], [64337, 1785], [64336, 1786], [1572, 1787], [65158, 1788], [65157, 1789], [1573, 1790], [65160, 1791], [65159, 1792], [1651, 1793], [1907, 1794], [1908, 1795], [1574, 1796], [65163, 1797], [65164, 1798], [65162, 1799], [65161, 1800], [64491, 1801], [64490, 1802], [64663, 1803], [64512, 1804], [64664, 1805], [64513, 1806], [64665, 1807], [64612, 1808], [64613, 1809], [64666, 1810], [64735, 1811], [64614, 1812], [64514, 1813], [64615, 1814], [64667, 1815], [64736, 1816], [64493, 1817], [64492, 1818], [64495, 1819], [64494, 1820], [64499, 1821], [64498, 1822], [64497, 1823], [64496, 1824], [64501, 1825], [64500, 1826], [64507, 1827], [64616, 1828], [64506, 1829], [64515, 1830], [64505, 1831], [64617, 1832], [64516, 1833], [64504, 1834], [64503, 1835], [64502, 1836], [1575, 1837], [65166, 1838], [65165, 1839], [64828, 1840], [64829, 1841], [1653, 1842], [65011, 1843], [65010, 1844], [1646, 1845], [1576, 1846], [65169, 1847], [65170, 1848], [65168, 1849], [65167, 1850], [64668, 1851], [64517, 1852], [64669, 1853], [64518, 1854], [64962, 1855], [64670, 1856], [64519, 1857], [64926, 1858], [64618, 1859], [64619, 1860], [64671, 1861], [64737, 1862], [64620, 1863], [64520, 1864], [64621, 1865], [64672, 1866], [64738, 1867], [64622, 1868], [64521, 1869], [64623, 1870], [64522, 1871], [1659, 1872], [64340, 1873], [64341, 1874], [64339, 1875], [64338, 1876], [1662, 1877], [64344, 1878], [64345, 1879], [64343, 1880], [64342, 1881], [1664, 1882], [64348, 1883], [64349, 1884], [64347, 1885], [64346, 1886], [1872, 1887], [1873, 1888], [1874, 1889], [1875, 1890], [1876, 1891], [1877, 1892], [1878, 1893], [1577, 1894], [65172, 1895], [65171, 1896], [1578, 1897], [65175, 1898], [65176, 1899], [65174, 1900], [65173, 1901], [64673, 1902], [64523, 1903], [64848, 1904], [64928, 1905], [64927, 1906], [64674, 1907], [64524, 1908], [64850, 1909], [64849, 1910], [64851, 1911], [64675, 1912], [64525, 1913], [64852, 1914], [64930, 1915], [64929, 1916], [64624, 1917], [64625, 1918], [64676, 1919], [64739, 1920], [64626, 1921], [64526, 1922], [64853, 1923], [64854, 1924], [64855, 1925], [64932, 1926], [64931, 1927], [64627, 1928], [64677, 1929], [64740, 1930], [64628, 1931], [64527, 1932], [64629, 1933], [64528, 1934], [1579, 1935], [65179, 1936], [65180, 1937], [65178, 1938], [65177, 1939], [64529, 1940], [64630, 1941], [64631, 1942], [64678, 1943], [64741, 1944], [64632, 1945], [64530, 1946], [64633, 1947], [64742, 1948], [64634, 1949], [64531, 1950], [64635, 1951], [64532, 1952], [1657, 1953], [64360, 1954], [64361, 1955], [64359, 1956], [64358, 1957], [1658, 1958], [64352, 1959], [64353, 1960], [64351, 1961], [64350, 1962], [1660, 1963], [1661, 1964], [1663, 1965], [64356, 1966], [64357, 1967], [64355, 1968], [64354, 1969], [1580, 1970], [65183, 1971], [65184, 1972], [65182, 1973], [65181, 1974], [64679, 1975], [64533, 1976], [64934, 1977], [64958, 1978], [65019, 1979], [64680, 1980], [64534, 1981], [64857, 1982], [64856, 1983], [64935, 1984], [64933, 1985], [64797, 1986], [64769, 1987], [64798, 1988], [64770, 1989], [1667, 1990], [64376, 1991], [64377, 1992], [64375, 1993], [64374, 1994], [1668, 1995], [64372, 1996], [64373, 1997], [64371, 1998], [64370, 1999], [1670, 2000], [64380, 2001], [64381, 2002], [64379, 2003], [64378, 2004], [1727, 2005], [1671, 2006], [64384, 2007], [64385, 2008], [64383, 2009], [64382, 2010], [1581, 2011], [65187, 2012], [65188, 2013], [65186, 2014], [65185, 2015], [64681, 2016], [64535, 2017], [64959, 2018], [64682, 2019], [64536, 2020], [64859, 2021], [64858, 2022], [64795, 2023], [64767, 2024], [64796, 2025], [64768, 2026], [1582, 2027], [65191, 2028], [65192, 2029], [65190, 2030], [65189, 2031], [64683, 2032], [64537, 2033], [64538, 2034], [64684, 2035], [64539, 2036], [64799, 2037], [64771, 2038], [64800, 2039], [64772, 2040], [1665, 2041], [1666, 2042], [1669, 2043], [1879, 2044], [1880, 2045], [1902, 2046], [1903, 2047], [1906, 8207], [1916, 8235], [1583, 8238], [65194, 64285], [65193, 64286], [1584, 64287], [65196, 64288], [65195, 64289], [64603, 64290], [1672, 64291], [64393, 64292], [64392, 64293], [1673, 64294], [1674, 64295], [1675, 64296], [1676, 64297], [64389, 64298], [64388, 64299], [1677, 64300], [64387, 64301], [64386, 64302], [1678, 64303], [64391, 64304], [64390, 64305], [1679, 64306], [1680, 64307], [1774, 64308], [1881, 64309], [1882, 64310], [1585, 64311], [65198, 64312], [65197, 64313], [64604, 64314], [65014, 64315], [1586, 64316], [65200, 64317], [65199, 64318], [1681, 64319], [64397, 64320], [64396, 64321], [1682, 64322], [1683, 64323], [1684, 64324], [1685, 64325], [1686, 64326], [1687, 64327], [1688, 64328], [64395, 64329], [64394, 64330], [1689, 64331], [1775, 64332], [1883, 64333], [1899, 64334], [1900, 64335], [1905, 64336], [1587, 64337], [65203, 64338], [65204, 64339], [65202, 64340], [65201, 64341], [64685, 64342], [64820, 64343], [64540, 64344], [64861, 64345], [64862, 64346], [64686, 64347], [64821, 64348], [64541, 64349], [64860, 64350], [64687, 64351], [64822, 64352], [64542, 64353], [64936, 64354], [64966, 64355], [64810, 64356], [64782, 64357], [64688, 64358], [64743, 64359], [64543, 64360], [64865, 64361], [64864, 64362], [64863, 64363], [64867, 64364], [64866, 64365], [64817, 64366], [64744, 64367], [64791, 64368], [64763, 64369], [64792, 64370], [64764, 64371], [1588, 64372], [65207, 64373], [65208, 64374], [65206, 64375], [65205, 64376], [64813, 64377], [64823, 64378], [64805, 64379], [64777, 64380], [64873, 64381], [64814, 64382], [64824, 64383], [64806, 64384], [64778, 64385], [64872, 64386], [64871, 64387], [64938, 64388], [64815, 64389], [64825, 64390], [64807, 64391], [64779, 64392], [64809, 64393], [64781, 64394], [64816, 64395], [64745, 64396], [64808, 64397], [64780, 64398], [64875, 64399], [64874, 64400], [64877, 64401], [64876, 64402], [64818, 64403], [64746, 64404], [64793, 64405], [64765, 64406], [64794, 64407], [64766, 64408], [1690, 64409], [1691, 64410], [1692, 64411], [1786, 64412], [1884, 64413], [1901, 64414], [1904, 64415], [1917, 64416], [1918, 64417], [1589, 64418], [65211, 64419], [65212, 64420], [65210, 64421], [65209, 64422], [64689, 64423], [64544, 64424], [64869, 64425], [64868, 64426], [64937, 64427], [64690, 64428], [64811, 64429], [64783, 64430], [65013, 64431], [65017, 64432], [65018, 64433], [65008, 64434], [64691, 64435], [64545, 64436], [64965, 64437], [64870, 64438], [64801, 64439], [64773, 64440], [64802, 64441], [64774, 64442], [1590, 64443], [65215, 64444], [65216, 64445], [65214, 64446], [65213, 64447], [64692, 64448], [64546, 64449], [64693, 64450], [64547, 64451], [64878, 64452], [64939, 64453], [64694, 64454], [64548, 64455], [64880, 64456], [64879, 64457], [64812, 64458], [64784, 64459], [64695, 64460], [64549, 64461], [64803, 64462], [64775, 64463], [64804, 64464], [64776, 64465], [1693, 64466], [1694, 64467], [1787, 64468], [1591, 64469], [65219, 64470], [65220, 64471], [65218, 64472], [65217, 64473], [64696, 64474], [64550, 64475], [64819, 64476], [64826, 64477], [64551, 64478], [64882, 64479], [64881, 64480], [64883, 64481], [64884, 64482], [64785, 64483], [64757, 64484], [64786, 64485], [64758, 64486], [1592, 64487], [65223, 64488], [65224, 64489], [65222, 64490], [65221, 64491], [64697, 64492], [64827, 64493], [64552, 64494], [1695, 64495], [1593, 64496], [65227, 64497], [65228, 64498], [65226, 64499], [65225, 64500], [64698, 64501], [64553, 64502], [64964, 64503], [64885, 64504], [65015, 64505], [64699, 64506], [64554, 64507], [64887, 64508], [64886, 64509], [64888, 64510], [64950, 64511], [64787, 64512], [64759, 64513], [64788, 64514], [64760, 64515], [1594, 64516], [65231, 64517], [65232, 64518], [65230, 64519], [65229, 64520], [64700, 64521], [64555, 64522], [64701, 64523], [64556, 64524], [64889, 64525], [64891, 64526], [64890, 64527], [64789, 64528], [64761, 64529], [64790, 64530], [64762, 64531], [1696, 64532], [1788, 64533], [1885, 64534], [1886, 64535], [1887, 64536], [1601, 64537], [65235, 64538], [65236, 64539], [65234, 64540], [65233, 64541], [64702, 64542], [64557, 64543], [64703, 64544], [64558, 64545], [64704, 64546], [64559, 64547], [64893, 64548], [64892, 64549], [64705, 64550], [64560, 64551], [64961, 64552], [64636, 64553], [64561, 64554], [64637, 64555], [64562, 64556], [1697, 64557], [1698, 64558], [1699, 64559], [1700, 64560], [64364, 64561], [64365, 64562], [64363, 64563], [64362, 64564], [1701, 64565], [1702, 64566], [64368, 64567], [64369, 64568], [64367, 64569], [64366, 64570], [1888, 64571], [1889, 64572], [1647, 64573], [1602, 64574], [65239, 64575], [65240, 64576], [65238, 64577], [65237, 64578], [64706, 64579], [64563, 64580], [65009, 64581], [64707, 64582], [64564, 64583], [64948, 64584], [64894, 64585], [64895, 64586], [64946, 64587], [64638, 64588], [64565, 64589], [64639, 64590], [64566, 64591], [1703, 64592], [1704, 64593], [1603, 64594], [65243, 64595], [65244, 64596], [65242, 64597], [65241, 64598], [64640, 64599], [64567, 64600], [64708, 64601], [64568, 64602], [64709, 64603], [64569, 64604], [64710, 64605], [64570, 64606], [64711, 64607], [64747, 64608], [64641, 64609], [64571, 64610], [64712, 64611], [64748, 64612], [64642, 64613], [64572, 64614], [64963, 64615], [64955, 64616], [64951, 64617], [64643, 64618], [64573, 64619], [64644, 64620], [64574, 64621], [1705, 64622], [64400, 64623], [64401, 64624], [64399, 64625], [64398, 64626], [1706, 64627], [1707, 64628], [1708, 64629], [1919, 64630], [1709, 64631], [64469, 64632], [64470, 64633], [64468, 64634], [64467, 64635], [1710, 64636], [1711, 64637], [64404, 64638], [64405, 64639], [64403, 64640], [64402, 64641], [1712, 64642], [1713, 64643], [64412, 64644], [64413, 64645], [64411, 64646], [64410, 64647], [1714, 64648], [1715, 64649], [64408, 64650], [64409, 64651], [64407, 64652], [64406, 64653], [1716, 64654], [1890, 64655], [1595, 64656], [1596, 64657], [1891, 64658], [1892, 64659], [1604, 64660], [65247, 64661], [65248, 64662], [65246, 64663], [65245, 64664], [65270, 64665], [65269, 64666], [65272, 64667], [65271, 64668], [65274, 64669], [65273, 64670], [65276, 64671], [65275, 64672], [64713, 64673], [64575, 64674], [64899, 64675], [64900, 64676], [64954, 64677], [64956, 64678], [64940, 64679], [64714, 64680], [64576, 64681], [64949, 64682], [64896, 64683], [64898, 64684], [64897, 64685], [64715, 64686], [64577, 64687], [64902, 64688], [64901, 64689], [64716, 64690], [64749, 64691], [64645, 64692], [64578, 64693], [64904, 64694], [64903, 64695], [64941, 64696], [64717, 64697], [64646, 64698], [64579, 64699], [64647, 64700], [64580, 64701], [1717, 64702], [1718, 64703], [1719, 64704], [1720, 64705], [1898, 64706], [1605, 64707], [65251, 64708], [65252, 64709], [65250, 64710], [65249, 64711], [1790, 64712], [64648, 64713], [64718, 64714], [64581, 64715], [64908, 64716], [64914, 64717], [64909, 64718], [64960, 64719], [64719, 64720], [64582, 64721], [64905, 64722], [64906, 64723], [65012, 64724], [64907, 64725], [64720, 64726], [64583, 64727], [64910, 64728], [64911, 64729], [64953, 64730], [64721, 64731], [64649, 64732], [64584, 64733], [64945, 64734], [64585, 64735], [64586, 64736], [1893, 64737], [1894, 64738], [1606, 64739], [65255, 64740], [65256, 64741], [65254, 64742], [65253, 64743], [64722, 64744], [64587, 64745], [64952, 64746], [64957, 64747], [64920, 64748], [64919, 64749], [64921, 64750], [64967, 64751], [64723, 64752], [64588, 64753], [64917, 64754], [64918, 64755], [64947, 64756], [64724, 64757], [64589, 64758], [64650, 64759], [64651, 64760], [64725, 64761], [64750, 64762], [64652, 64763], [64590, 64764], [64923, 64765], [64922, 64766], [64653, 64767], [64726, 64768], [64751, 64769], [64654, 64770], [64591, 64771], [64655, 64772], [64592, 64773], [1722, 64774], [64415, 64775], [64414, 64776], [1723, 64777], [64418, 64778], [64419, 64779], [64417, 64780], [64416, 64781], [1724, 64782], [1725, 64783], [1721, 64784], [1895, 64785], [1896, 64786], [1897, 64787], [1607, 64788], [65259, 64789], [65260, 64790], [65258, 64791], [65257, 64792], [64729, 64793], [64727, 64794], [64593, 64795], [64728, 64796], [64594, 64797], [64915, 64798], [64916, 64799], [64595, 64800], [64596, 64801], [1726, 64802], [64428, 64803], [64429, 64804], [64427, 64805], [64426, 64806], [1729, 64807], [64424, 64808], [64425, 64809], [64423, 64810], [64422, 64811], [1730, 64812], [1731, 64813], [1791, 64814], [1749, 64815], [1728, 64816], [64421, 64817], [64420, 64818], [1608, 64819], [1765, 64820], [65262, 64821], [65261, 64822], [1654, 64823], [65016, 64824], [1732, 64825], [1733, 64826], [64481, 64827], [64480, 64828], [1734, 64829], [64474, 64830], [64473, 64831], [1735, 64832], [64472, 64833], [64471, 64834], [1655, 64835], [64477, 64836], [1736, 64837], [64476, 64838], [64475, 64839], [1737, 64840], [64483, 64841], [64482, 64842], [1738, 64843], [1739, 64844], [64479, 64845], [64478, 64846], [1743, 64847], [1912, 64848], [1913, 64849], [1609, 64850], [64488, 64851], [64489, 64852], [65264, 64853], [65263, 64854], [64656, 64855], [64605, 64856], [1610, 64857], [1766, 64858], [65267, 64859], [65268, 64860], [65266, 64861], [65265, 64862], [1656, 64863], [64730, 64864], [64597, 64865], [64943, 64866], [64731, 64867], [64598, 64868], [64942, 64869], [64732, 64870], [64599, 64871], [64657, 64872], [64658, 64873], [64733, 64874], [64752, 64875], [64659, 64876], [64600, 64877], [64925, 64878], [64924, 64879], [64944, 64880], [64660, 64881], [64734, 64882], [64753, 64883], [64661, 64884], [64601, 64885], [64662, 64886], [64602, 64887], [1740, 64888], [64510, 64889], [64511, 64890], [64509, 64891], [64508, 64892], [1741, 64893], [1742, 64894], [1744, 64895], [64486, 64896], [64487, 64897], [64485, 64898], [64484, 64899], [1745, 64900], [1597, 64901], [1598, 64902], [1599, 64903], [1568, 64904], [1909, 64905], [1910, 64906], [1911, 64907], [1746, 64908], [64431, 64909], [64430, 64910], [1747, 64911], [64433, 64912], [64432, 64913], [1914, 64914], [1915, 64915], [1808, 64916], [1810, 64917], [1837, 64918], [1811, 64919], [1812, 64920], [1838, 64921], [1814, 64922], [1813, 64923], [1839, 64924], [1815, 64925], [1816, 64926], [1817, 64927], [1869, 64928], [1818, 64929], [1819, 64930], [1820, 64931], [1821, 64932], [1822, 64933], [1823, 64934], [1870, 64935], [1824, 64936], [1825, 64937], [1826, 64938], [1827, 64939], [1828, 64940], [1829, 64941], [1830, 64942], [1831, 64943], [1871, 64944], [1832, 64945], [1833, 64946], [1834, 64947], [1835, 64948], [1836, 64949], [1920, 64950], [1945, 64951], [1946, 64952], [1921, 64953], [1922, 64954], [1923, 64955], [1948, 64956], [1924, 64957], [1925, 64958], [1926, 64959], [1927, 64960], [1954, 64961], [1955, 64962], [1928, 64963], [1957, 64964], [1929, 64965], [1930, 64966], [1931, 64967], [1947, 64968], [1932, 64969], [1944, 64970], [1952, 64971], [1953, 64972], [1933, 64973], [1934, 64974], [1956, 64975], [1935, 64976], [1936, 64977], [1949, 64978], [1950, 64979], [1951, 64980], [1937, 64981], [1938, 64982], [1939, 64983], [1940, 64984], [1941, 64985], [1942, 64986], [1943, 64987], [1969, 64988], [1958, 64989], [1959, 64990], [1960, 64991], [1961, 64992], [1962, 64993], [1963, 64994], [1964, 64995], [1965, 64996], [1966, 64997], [1967, 64998], [1968, 64999], [1994, 65000], [1995, 65001], [1996, 65002], [1997, 65003], [1998, 65004], [1999, 65005], [2000, 65006], [2001, 65007], [2002, 65008], [2003, 65009], [2004, 65010], [2005, 65011], [2006, 65012], [2024, 65013], [2007, 65014], [2025, 65015], [2008, 65016], [2009, 65017], [2026, 65018], [2010, 65019], [2011, 65020], [2012, 65021], [2013, 65136], [2014, 65137], [2015, 65138], [2016, 65139], [2017, 65140], [2018, 65141], [2019, 65142], [2020, 65143], [2021, 65144], [2022, 65145], [2023, 65146], [2036, 65147], [2037, 65148], [1480, 65149], [1481, 65150], [1482, 65151], [1483, 65152], [1484, 65153], [1485, 65154], [1486, 65155], [1487, 65156], [1515, 65157], [1516, 65158], [1517, 65159], [1518, 65160], [1519, 65161], [1525, 65162], [1526, 65163], [1527, 65164], [1528, 65165], [1529, 65166], [1530, 65167], [1531, 65168], [1532, 65169], [1533, 65170], [1534, 65171], [1535, 65172], [1565, 65173], [1806, 65174], [1867, 65175], [1868, 65176], [1970, 65177], [1971, 65178], [1972, 65179], [1973, 65180], [1974, 65181], [1975, 65182], [1976, 65183], [1977, 65184], [1978, 65185], [1979, 65186], [1980, 65187], [1981, 65188], [1982, 65189], [1983, 65190], [2043, 65191], [2044, 65192], [2045, 65193], [2046, 65194], [2047, 65195], [64311, 65196], [64317, 65197], [64319, 65198], [64322, 65199], [64325, 65200], [64450, 65201], [64451, 65202], [64452, 65203], [64453, 65204], [64454, 65205], [64455, 65206], [64456, 65207], [64457, 65208], [64458, 65209], [64459, 65210], [64460, 65211], [64461, 65212], [64462, 65213], [64463, 65214], [64464, 65215], [64465, 65216], [64466, 65217], [64832, 65218], [64833, 65219], [64834, 65220], [64835, 65221], [64836, 65222], [64837, 65223], [64838, 65224], [64839, 65225], [64840, 65226], [64841, 65227], [64842, 65228], [64843, 65229], [64844, 65230], [64845, 65231], [64846, 65232], [64847, 65233], [64912, 65234], [64913, 65235], [64968, 65236], [64969, 65237], [64970, 65238], [64971, 65239], [64972, 65240], [64973, 65241], [64974, 65242], [64975, 65243], [64976, 65244], [64977, 65245], [64978, 65246], [64979, 65247], [64980, 65248], [64981, 65249], [64982, 65250], [64983, 65251], [64984, 65252], [64985, 65253], [64986, 65254], [64987, 65255], [64988, 65256], [64989, 65257], [64990, 65258], [64991, 65259], [64992, 65260], [64993, 65261], [64994, 65262], [64995, 65263], [64996, 65264], [64997, 65265], [64998, 65266], [64999, 65267], [65000, 65268], [65001, 65269], [65002, 65270], [65003, 65271], [65004, 65272], [65005, 65273], [65006, 65274], [65007, 65275], [65141, 65276]].forEach(function(bU){

          bT[String.fromCharCode(bU[0])] = String.fromCharCode(bU[1]);
        });
        return bT;
      })()
    }
  });
})();
(function(){

  var a = "number",b = "wialon.util.Number",c = "static",d = "string";
  qx.Class.define(b, {
    type : c,
    statics : {
      or : function(g){

        var f = this.__es();
        for(var i = 0;i < arguments.length;i++){

          var e = this.__es(arguments[i]);
          f[0] = (f[0] | e[0]) >>> 0;
          f[1] = (f[1] | e[1]) >>> 0;
        };
        return f[0] * 0x100000000 + f[1];
      },
      xor : function(k){

        var j = this.__es();
        for(var i = 0;i < arguments.length;i++){

          var h = this.__es(arguments[i]);
          j[0] = (j[0] ^ h[0]) >>> 0;
          j[1] = (j[1] ^ h[1]) >>> 0;
        };
        return j[0] * 0x100000000 + j[1];
      },
      and : function(n){

        var m = [0xFFFFFFFF, 0xFFFFFFFF];
        for(var i = 0;i < arguments.length;i++){

          var l = this.__es(arguments[i]);
          m[0] = (m[0] & l[0]) >>> 0;
          m[1] = (m[1] & l[1]) >>> 0;
        };
        return m[0] * 0x100000000 + m[1];
      },
      not : function(o){

        var p = this.__es(o);
        p[0] = ((~p[0]) & 0x1FFFFF) >>> 0;
        p[1] = (~p[1]) >>> 0;
        return p[0] * 0x100000000 + p[1];
      },
      exclude : function(s){

        if(!arguments.length)return 0;
        var r = this.__es(arguments[0]);
        for(var i = 1;i < arguments.length;i++){

          var q = this.__es(this.not(arguments[i]));
          r[0] = (r[0] & q[0]) >>> 0;
          r[1] = (r[1] & q[1]) >>> 0;
        };
        return r[0] * 0x100000000 + r[1];
      },
      umax : function(){

        return 0x1FFFFFFFFFFFFF;
      },
      __es : function(u){

        var v = [0, 0];
        if(typeof u == a){

          if(u == -1)return [0x1FFFFF, 0xFFFFFFFF];
          if(u < 0)u = 0x1FFFFFFFFFFFFF + 1 + u;
          u = u.toString(16);
        };
        if(typeof u == d && u.length && u.length <= 16){

          var t = [0, 0];
          for(var i = u.length;i > 0;i--)v[u.length - i < 8 ? 1 : 0] |= parseInt(u[i - 1], 16) << (((u.length - i) * 4) % 32);
        };
        v[0] = v[0] >>> 0;
        v[1] = v[1] >>> 0;
        return v;
      }
    }
  });
})();
(function(){

  var a = "loadEnd",b = "qx.io.request.AbstractRequest",c = "changePhase",d = "GET",f = "sent",g = "qx.event.type.Data",h = "qx.io.request.authentication.IAuthentication",i = "error",j = "fail",k = "loading",l = "load",m = "qx.event.type.Event",n = "abort",o = "success",p = "String",q = "",r = "opened",s = "qx.strict",t = "POST",u = "statusError",v = "readyStateChange",w = "Abstract method call",x = "abstract",y = "unsent",z = "changeResponse",A = "Number",B = "Content-Type",C = "timeout",D = "undefined";
  qx.Class.define(b, {
    type : x,
    extend : qx.core.Object,
    construct : function E(F){

      if(qx.core.Environment.get(s)){

        this.callee(E, arguments);
      } else {

        qx.core.Object.call(this);
      };
      if(F !== undefined){

        this.setUrl(F);
      };
      this.__et = {
      };
      var G = this._transport = this._createTransport();
      this._setPhase(y);
      this.__eu = qx.lang.Function.bind(this._onReadyStateChange, this);
      this.__ev = qx.lang.Function.bind(this._onLoad, this);
      this.__ew = qx.lang.Function.bind(this._onLoadEnd, this);
      this.__ex = qx.lang.Function.bind(this._onAbort, this);
      this.__ey = qx.lang.Function.bind(this._onTimeout, this);
      this.__ez = qx.lang.Function.bind(this._onError, this);
      G.onreadystatechange = this.__eu;
      G.onload = this.__ev;
      G.onloadend = this.__ew;
      G.onabort = this.__ex;
      G.ontimeout = this.__ey;
      G.onerror = this.__ez;
    },
    events : {
      "readyStateChange" : m,
      "success" : m,
      "load" : m,
      "loadEnd" : m,
      "abort" : m,
      "timeout" : m,
      "error" : m,
      "statusError" : m,
      "fail" : m,
      "changeResponse" : g,
      "changePhase" : g
    },
    properties : {
      url : {
        check : p
      },
      timeout : {
        check : A,
        nullable : true,
        init : 0
      },
      requestData : {
        check : function(H){

          return qx.lang.Type.isString(H) || qx.Class.isSubClassOf(H.constructor, qx.core.Object) || qx.lang.Type.isObject(H) || qx.lang.Type.isArray(H);
        },
        nullable : true
      },
      authentication : {
        check : h,
        nullable : true
      }
    },
    members : {
      __eu : null,
      __ev : null,
      __ew : null,
      __ex : null,
      __ey : null,
      __ez : null,
      __eA : null,
      __eB : null,
      __eC : null,
      __et : null,
      __eD : null,
      _transport : null,
      _createTransport : function(){

        throw new Error(w);
      },
      _getConfiguredUrl : function(){
      },
      _getConfiguredRequestHeaders : function(){
      },
      _getParsedResponse : function(){

        throw new Error(w);
      },
      _getMethod : function(){

        return d;
      },
      _isAsync : function(){

        return true;
      },
      send : function(){

        var M = this._transport,I,L,J,K;
        I = this._getConfiguredUrl();
        if(/\#/.test(I)){

          I = I.replace(/\#.*/, q);
        };
        M.timeout = this.getTimeout();
        L = this._getMethod();
        J = this._isAsync();
        {
        };
        M.open(L, I, J);
        this._setPhase(r);
        K = this._serializeData(this.getRequestData());
        this._setRequestHeaders();
        {
        };
        L == d ? M.send() : M.send(K);
        this._setPhase(f);
      },
      abort : function(){

        {
        };
        this.__eB = true;
        this.__eC = n;
        this._transport.abort();
      },
      _setRequestHeaders : function(){

        var O = this._transport,N = this._getAllRequestHeaders();
        for(var P in N){

          O.setRequestHeader(P, N[P]);
        };
      },
      _getAllRequestHeaders : function(){

        var Q = {
        };
        qx.lang.Object.mergeWith(Q, this._getConfiguredRequestHeaders());
        qx.lang.Object.mergeWith(Q, this.__eE());
        qx.lang.Object.mergeWith(Q, this.__eD);
        qx.lang.Object.mergeWith(Q, this.__et);
        return Q;
      },
      __eE : function(){

        var S = this.getAuthentication(),R = {
        };
        if(S){

          S.getAuthHeaders().forEach(function(T){

            R[T.key] = T.value;
          });
          return R;
        };
      },
      setRequestHeader : function(U, V){

        this.__et[U] = V;
      },
      getRequestHeader : function(W){

        return this.__et[W];
      },
      removeRequestHeader : function(X){

        if(this.__et[X]){

          delete this.__et[X];
        };
      },
      getTransport : function(){

        return this._transport;
      },
      getReadyState : function(){

        return this._transport.readyState;
      },
      getPhase : function(){

        return this.__eC;
      },
      getStatus : function(){

        return this._transport.status;
      },
      getStatusText : function(){

        return this._transport.statusText;
      },
      getResponseText : function(){

        return this._transport.responseText;
      },
      getAllResponseHeaders : function(){

        return this._transport.getAllResponseHeaders();
      },
      getResponseHeader : function(Y){

        return this._transport.getResponseHeader(Y);
      },
      overrideResponseContentType : function(ba){

        return this._transport.overrideMimeType(ba);
      },
      getResponseContentType : function(){

        return this.getResponseHeader(B);
      },
      isDone : function(){

        return this.getReadyState() === 4;
      },
      getResponse : function(){

        return this.__eA;
      },
      _setResponse : function(bc){

        var bb = bc;
        if(this.__eA !== bc){

          this.__eA = bc;
          this.fireEvent(z, qx.event.type.Data, [this.__eA, bb]);
        };
      },
      _onReadyStateChange : function(){

        var bd = this.getReadyState();
        {
        };
        this.fireEvent(v);
        if(this.__eB){

          return;
        };
        if(bd === 3){

          this._setPhase(k);
        };
        if(this.isDone()){

          this.__eF();
        };
      },
      __eF : function(){

        {
        };
        this._setPhase(l);
        if(qx.util.Request.isSuccessful(this.getStatus())){

          {
          };
          this._setResponse(this._getParsedResponse());
          this._fireStatefulEvent(o);
        } else {

          try{

            this._setResponse(this._getParsedResponse());
          } catch(e) {
          };
          if(this.getStatus() !== 0){

            this._fireStatefulEvent(u);
            this.fireEvent(j);
          };
        };
      },
      _onLoad : function(){

        this.fireEvent(l);
      },
      _onLoadEnd : function(){

        this.fireEvent(a);
      },
      _onAbort : function(){

        this._fireStatefulEvent(n);
      },
      _onTimeout : function(){

        this._fireStatefulEvent(C);
        this.fireEvent(j);
      },
      _onError : function(){

        this.fireEvent(i);
        this.fireEvent(j);
      },
      _fireStatefulEvent : function(be){

        {
        };
        this._setPhase(be);
        this.fireEvent(be);
      },
      _setPhase : function(bf){

        var bg = this.__eC;
        {
        };
        this.__eC = bf;
        this.fireDataEvent(c, bf, bg);
      },
      _serializeData : function(bj){

        var bh = typeof this.getMethod !== D && this.getMethod() == t,bi = /application\/.*\+?json/.test(this.getRequestHeader(B));
        if(!bj){

          return null;
        };
        if(qx.lang.Type.isString(bj)){

          return bj;
        };
        if(qx.Class.isSubClassOf(bj.constructor, qx.core.Object)){

          return qx.util.Serializer.toUriParameter(bj);
        };
        if(bi && (qx.lang.Type.isObject(bj) || qx.lang.Type.isArray(bj))){

          return qx.lang.Json.stringify(bj);
        };
        if(qx.lang.Type.isObject(bj)){

          return qx.util.Uri.toParameter(bj, bh);
        };
      }
    },
    environment : {
      "qx.debug.io" : false
    },
    destruct : function(){

      var bl = this._transport,bk = function(){
      };
      if(this._transport){

        bl.onreadystatechange = bl.onload = bl.onloadend = bl.onabort = bl.ontimeout = bl.onerror = bk;
        window.setTimeout(function(){

          bl.dispose();
        }, 0);
      };
    }
  });
})();
(function(){

  var a = "file",b = "+",c = "strict",d = "anchor",e = "div",f = "query",g = "source",h = "password",j = "host",k = "protocol",l = "user",n = "directory",p = "loose",q = "relative",r = "queryKey",s = "qx.util.Uri",t = "",u = "path",v = "authority",w = '">0</a>',x = "&",y = "port",z = '<a href="',A = "userInfo",B = "?",C = "=";
  qx.Bootstrap.define(s, {
    statics : {
      parseUri : function(F, E){

        var G = {
          key : [g, k, v, A, l, h, j, y, q, u, n, a, f, d],
          q : {
            name : r,
            parser : /(?:^|&)([^&=]*)=?([^&]*)/g
          },
          parser : {
            strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
          }
        };
        var o = G,m = G.parser[E ? c : p].exec(F),D = {
        },i = 14;
        while(i--){

          D[o.key[i]] = m[i] || t;
        };
        D[o.q.name] = {
        };
        D[o.key[12]].replace(o.q.parser, function(I, J, H){

          if(J){

            D[o.q.name][J] = H;
          };
        });
        return D;
      },
      appendParamsToUrl : function(K, L){

        if(L === undefined){

          return K;
        };
        {
        };
        if(qx.lang.Type.isObject(L)){

          L = qx.util.Uri.toParameter(L);
        };
        if(!L){

          return K;
        };
        return K += /\?/.test(K) ? x + L : B + L;
      },
      toParameter : function(M, Q){

        var P,O = [];
        for(P in M){

          if(M.hasOwnProperty(P)){

            var N = M[P];
            if(N instanceof Array){

              for(var i = 0;i < N.length;i++){

                this.__eG(P, N[i], O, Q);
              };
            } else {

              this.__eG(P, N, O, Q);
            };
          };
        };
        return O.join(x);
      },
      __eG : function(U, V, T, S){

        var R = window.encodeURIComponent;
        if(S){

          T.push(R(U).replace(/%20/g, b) + C + R(V).replace(/%20/g, b));
        } else {

          T.push(R(U) + C + R(V));
        };
      },
      getAbsolute : function(X){

        var W = document.createElement(e);
        W.innerHTML = z + X + w;
        return W.firstChild.href;
      }
    }
  });
})();
(function(){

  var a = "qx.util.Serializer",b = '\\\\',c = '\\f',d = '"',e = "null",f = '\\"',g = "}",h = "get",j = "{",k = '\\r',l = "",m = '\\t',n = "]",o = "Class",p = "Interface",q = "[",r = "Mixin",s = '":',t = "&",u = '\\b',v = "=",w = '\\n',x = ",";
  qx.Class.define(a, {
    statics : {
      toUriParameter : function(z, C, y){

        var E = l;
        var B = qx.util.PropertyUtil.getAllProperties(z.constructor);
        for(var name in B){

          if(B[name].group != undefined){

            continue;
          };
          var A = z[h + qx.lang.String.firstUp(name)]();
          if(qx.lang.Type.isArray(A)){

            var D = qx.data && qx.data.IListData && qx.Class.hasInterface(A && A.constructor, qx.data.IListData);
            for(var i = 0;i < A.length;i++){

              var F = D ? A.getItem(i) : A[i];
              E += this.__eH(name, F, C);
            };
          } else if(qx.lang.Type.isDate(A) && y != null){

            E += this.__eH(name, y.format(A), C);
          } else {

            E += this.__eH(name, A, C);
          };
        };
        return E.substring(0, E.length - 1);
      },
      __eH : function(name, I, G){

        if(I && I.$$type == o){

          I = I.classname;
        };
        if(I && (I.$$type == p || I.$$type == r)){

          I = I.name;
        };
        if(I instanceof qx.core.Object && G != null){

          var H = encodeURIComponent(G(I));
          if(H === undefined){

            var H = encodeURIComponent(I);
          };
        } else {

          var H = encodeURIComponent(I);
        };
        return encodeURIComponent(name) + v + H + t;
      },
      toNativeObject : function(L, N, K){

        var O;
        if(L == null){

          return null;
        };
        if(qx.data && qx.data.IListData && qx.Class.hasInterface(L.constructor, qx.data.IListData)){

          O = [];
          for(var i = 0;i < L.getLength();i++){

            O.push(qx.util.Serializer.toNativeObject(L.getItem(i), N, K));
          };
          return O;
        };
        if(qx.lang.Type.isArray(L)){

          O = [];
          for(var i = 0;i < L.length;i++){

            O.push(qx.util.Serializer.toNativeObject(L[i], N, K));
          };
          return O;
        };
        if(L.$$type == o){

          return L.classname;
        };
        if(L.$$type == p || L.$$type == r){

          return L.name;
        };
        if(L instanceof qx.core.Object){

          if(N != null){

            var J = N(L);
            if(J != undefined){

              return J;
            };
          };
          O = {
          };
          var Q = qx.util.PropertyUtil.getAllProperties(L.constructor);
          for(var name in Q){

            if(Q[name].group != undefined){

              continue;
            };
            var M = L[h + qx.lang.String.firstUp(name)]();
            O[name] = qx.util.Serializer.toNativeObject(M, N, K);
          };
          return O;
        };
        if(qx.lang.Type.isDate(L) && K != null){

          return K.format(L);
        };
        if(qx.locale && qx.locale.LocalizedString && L instanceof qx.locale.LocalizedString){

          return L.toString();
        };
        if(qx.lang.Type.isObject(L)){

          O = {
          };
          for(var P in L){

            O[P] = qx.util.Serializer.toNativeObject(L[P], N, K);
          };
          return O;
        };
        return L;
      },
      toJson : function(T, V, S){

        var W = l;
        if(T == null){

          return e;
        };
        if(qx.data && qx.data.IListData && qx.Class.hasInterface(T.constructor, qx.data.IListData)){

          W += q;
          for(var i = 0;i < T.getLength();i++){

            W += qx.util.Serializer.toJson(T.getItem(i), V, S) + x;
          };
          if(W != q){

            W = W.substring(0, W.length - 1);
          };
          return W + n;
        };
        if(qx.lang.Type.isArray(T)){

          W += q;
          for(var i = 0;i < T.length;i++){

            W += qx.util.Serializer.toJson(T[i], V, S) + x;
          };
          if(W != q){

            W = W.substring(0, W.length - 1);
          };
          return W + n;
        };
        if(T.$$type == o){

          return d + T.classname + d;
        };
        if(T.$$type == p || T.$$type == r){

          return d + T.name + d;
        };
        if(T instanceof qx.core.Object){

          if(V != null){

            var R = V(T);
            if(R != undefined){

              return d + R + d;
            };
          };
          W += j;
          var Y = qx.util.PropertyUtil.getAllProperties(T.constructor);
          for(var name in Y){

            if(Y[name].group != undefined){

              continue;
            };
            var U = T[h + qx.lang.String.firstUp(name)]();
            W += d + name + s + qx.util.Serializer.toJson(U, V, S) + x;
          };
          if(W != j){

            W = W.substring(0, W.length - 1);
          };
          return W + g;
        };
        if(qx.locale && qx.locale.LocalizedString && T instanceof qx.locale.LocalizedString){

          T = T.toString();
        };
        if(qx.lang.Type.isDate(T) && S != null){

          return d + S.format(T) + d;
        };
        if(qx.lang.Type.isObject(T)){

          W += j;
          for(var X in T){

            W += d + X + s + qx.util.Serializer.toJson(T[X], V, S) + x;
          };
          if(W != j){

            W = W.substring(0, W.length - 1);
          };
          return W + g;
        };
        if(qx.lang.Type.isString(T)){

          T = T.replace(/([\\])/g, b);
          T = T.replace(/(["])/g, f);
          T = T.replace(/([\r])/g, k);
          T = T.replace(/([\f])/g, c);
          T = T.replace(/([\n])/g, w);
          T = T.replace(/([\t])/g, m);
          T = T.replace(/([\b])/g, u);
          return d + T + d;
        };
        if(qx.lang.Type.isDate(T) || qx.lang.Type.isRegExp(T)){

          return d + T + d;
        };
        return T + l;
      }
    }
  });
})();
(function(){

  var a = "$$theme_",b = "$$user_",c = "qx.util.PropertyUtil",d = "$$init_";
  qx.Class.define(c, {
    statics : {
      getProperties : function(e){

        return e.$$properties;
      },
      getAllProperties : function(j){

        var g = {
        };
        var f = j;
        while(f != qx.core.Object){

          var i = this.getProperties(f);
          for(var h in i){

            g[h] = i[h];
          };
          f = f.superclass;
        };
        return g;
      },
      getUserValue : function(l, k){

        return l[b + k];
      },
      setUserValue : function(n, m, o){

        n[b + m] = o;
      },
      deleteUserValue : function(q, p){

        delete (q[b + p]);
      },
      getInitValue : function(s, r){

        return s[d + r];
      },
      setInitValue : function(u, t, v){

        u[d + t] = v;
      },
      deleteInitValue : function(x, w){

        delete (x[d + w]);
      },
      getThemeValue : function(z, y){

        return z[a + y];
      },
      setThemeValue : function(B, A, C){

        B[a + A] = C;
      },
      deleteThemeValue : function(E, D){

        delete (E[a + D]);
      },
      setThemed : function(H, G, I){

        var F = qx.core.Property.$$method.setThemed;
        H[F[G]](I);
      },
      resetThemed : function(K, J){

        var L = qx.core.Property.$$method.resetThemed;
        K[L[J]]();
      }
    }
  });
})();
(function(){

  var a = "HEAD",b = "CONNECT",c = "OPTIONS",d = "PUT",e = "GET",f = "PATCH",g = "//",h = "DELETE",i = "POST",j = "TRACE",k = "qx.util.Request";
  qx.Bootstrap.define(k, {
    statics : {
      isCrossDomain : function(l){

        var n = qx.util.Uri.parseUri(l),location = window.location;
        if(!location){

          return false;
        };
        var m = location.protocol;
        if(!(l.indexOf(g) !== -1)){

          return false;
        };
        if(m.substr(0, m.length - 1) == n.protocol && location.host === n.host && location.port === n.port){

          return false;
        };
        return true;
      },
      isSuccessful : function(status){

        return (status >= 200 && status < 300 || status === 304);
      },
      isMethod : function(p){

        var o = [e, i, d, h, a, c, j, b, f];
        return (o.indexOf(p) !== -1) ? true : false;
      },
      methodAllowsRequestBody : function(q){

        return !((/^(GET|HEAD)$/).test(q));
      }
    }
  });
})();
(function(){

  var a = '[object Boolean]',b = '[object String]',c = 'constructor',d = '[object Date]',e = '[object Number]',f = 'object',g = "qx.lang.Object",h = '[object RegExp]',j = '[object Array]';
  qx.Bootstrap.define(g, {
    statics : {
      empty : function(k){

        {
        };
        for(var m in k){

          if(k.hasOwnProperty(m)){

            delete k[m];
          };
        };
      },
      isEmpty : function(n){

        {
        };
        for(var o in n){

          return false;
        };
        return true;
      },
      getLength : qx.Bootstrap.objectGetLength,
      getValues : function(q){

        {
        };
        var r = [];
        var p = Object.keys(q);
        for(var i = 0,l = p.length;i < l;i++){

          r.push(q[p[i]]);
        };
        return r;
      },
      mergeWith : qx.Bootstrap.objectMergeWith,
      clone : function(s, v){

        if(qx.lang.Type.isObject(s)){

          var t = {
          };
          for(var u in s){

            if(v){

              t[u] = qx.lang.Object.clone(s[u], v);
            } else {

              t[u] = s[u];
            };
          };
          return t;
        } else if(qx.lang.Type.isArray(s)){

          var t = [];
          for(var i = 0;i < s.length;i++){

            if(v){

              t[i] = qx.lang.Object.clone(s[i], v);
            } else {

              t[i] = s[i];
            };
          };
          return t;
        };
        return s;
      },
      equals : function(w, x){

        return qx.lang.Object.__eI(w, x, [], []);
      },
      __eI : function(E, A, y, z){

        if(E === A){

          return E !== 0 || 1 / E == 1 / A;
        };
        if(E == null || A == null){

          return E === A;
        };
        var D = Object.prototype.toString.call(E);
        if(D != Object.prototype.toString.call(A)){

          return false;
        };
        switch(D){case b:
        return E == String(A);case e:
        return E != +E ? A != +A : (E == 0 ? 1 / E == 1 / A : E == +A);case d:case a:
        return +E == +A;case h:
        return E.source == A.source && E.global == A.global && E.multiline == A.multiline && E.ignoreCase == A.ignoreCase;};
        if(typeof E != f || typeof A != f){

          return false;
        };
        var length = y.length;
        while(length--){

          if(y[length] == E){

            return z[length] == A;
          };
        };
        var C = E.constructor,B = A.constructor;
        if(C !== B && !(qx.Bootstrap.isFunction(C) && (C instanceof C) && qx.Bootstrap.isFunction(B) && (B instanceof B)) && (c in E && c in A)){

          return false;
        };
        y.push(E);
        z.push(A);
        var H = 0,F = true;
        if(D == j){

          H = E.length;
          F = H == A.length;
          if(F){

            while(H--){

              if(!(F = qx.lang.Object.__eI(E[H], A[H], y, z))){

                break;
              };
            };
          };
        } else {

          for(var G in E){

            if(Object.prototype.hasOwnProperty.call(E, G)){

              H++;
              if(!(F = Object.prototype.hasOwnProperty.call(A, G) && qx.lang.Object.__eI(E[G], A[G], y, z))){

                break;
              };
            };
          };
          if(F){

            for(G in A){

              if(Object.prototype.hasOwnProperty.call(A, G) && !(H--)){

                break;
              };
            };
            F = !H;
          };
        };
        y.pop();
        z.pop();
        return F;
      },
      invert : function(I){

        {
        };
        var J = {
        };
        for(var K in I){

          J[I[K].toString()] = K;
        };
        return J;
      },
      getKeyFromValue : function(L, M){

        {
        };
        for(var N in L){

          if(L.hasOwnProperty(N) && L[N] === M){

            return N;
          };
        };
        return null;
      },
      contains : function(O, P){

        {
        };
        return this.getKeyFromValue(O, P) !== null;
      },
      fromArray : function(Q){

        {
        };
        var R = {
        };
        for(var i = 0,l = Q.length;i < l;i++){

          {
          };
          R[Q[i].toString()] = true;
        };
        return R;
      }
    }
  });
})();
(function(){

  var a = "qx.io.request.Jsonp",b = "qx.event.type.Event",c = "Boolean";
  qx.Class.define(a, {
    extend : qx.io.request.AbstractRequest,
    events : {
      "success" : b,
      "load" : b,
      "statusError" : b
    },
    properties : {
      cache : {
        check : c,
        init : true
      }
    },
    members : {
      _createTransport : function(){

        return new qx.bom.request.Jsonp();
      },
      _getConfiguredUrl : function(){

        var d = this.getUrl(),e;
        if(this.getRequestData()){

          e = this._serializeData(this.getRequestData());
          d = qx.util.Uri.appendParamsToUrl(d, e);
        };
        if(!this.getCache()){

          d = qx.util.Uri.appendParamsToUrl(d, {
            nocache : new Date().valueOf()
          });
        };
        return d;
      },
      _getParsedResponse : function(){

        return this._transport.responseJson;
      },
      setCallbackParam : function(f){

        this._transport.setCallbackParam(f);
      },
      setCallbackName : function(name){

        this._transport.setCallbackName(name);
      }
    }
  });
})();
(function(){

  var a = "url: ",b = "qx.debug.io",c = "qx.bom.request.Script",d = "Invalid state",e = "head",f = "error",g = "loadend",h = "qx.debug",i = "script",j = "load",k = "Unknown response headers",l = "browser.documentmode",m = "abort",n = "",o = "Received native readyState: loaded",p = "readystatechange",q = "Response header cannot be determined for ",r = "requests made with script transport.",s = "opera",t = "unknown",u = "Open native request with ",v = "Response headers cannot be determined for",w = "mshtml",x = "engine.name",y = "Detected error",z = "Send native request",A = "on",B = "timeout",C = "Unknown environment key at this phase",D = "Received native load";
  qx.Bootstrap.define(c, {
    construct : function(){

      this.__eR();
      this.__eJ = qx.Bootstrap.bind(this._onNativeLoad, this);
      this.__eK = qx.Bootstrap.bind(this._onNativeError, this);
      this.__ey = qx.Bootstrap.bind(this._onTimeout, this);
      this.__eL = document.head || document.getElementsByTagName(e)[0] || document.documentElement;
      this._emitter = new qx.event.Emitter();
      this.timeout = this.__eT() ? 0 : 15000;
    },
    events : {
      "readystatechange" : c,
      "error" : c,
      "loadend" : c,
      "timeout" : c,
      "abort" : c,
      "load" : c
    },
    members : {
      readyState : null,
      status : null,
      statusText : null,
      timeout : null,
      __eM : null,
      on : function(name, E, F){

        this._emitter.on(name, E, F);
        return this;
      },
      open : function(H, G){

        if(this.__eP){

          return;
        };
        this.__eR();
        this.__eB = null;
        this.__eN = G;
        if(this.__eW(b)){

          qx.Bootstrap.debug(qx.bom.request.Script, u + a + G);
        };
        this._readyStateChange(1);
      },
      setRequestHeader : function(I, J){

        if(this.__eP){

          return null;
        };
        var K = {
        };
        if(this.readyState !== 1){

          throw new Error(d);
        };
        K[I] = J;
        this.__eN = qx.util.Uri.appendParamsToUrl(this.__eN, K);
        return this;
      },
      send : function(){

        if(this.__eP){

          return null;
        };
        var M = this.__eU(),L = this.__eL,N = this;
        if(this.timeout > 0){

          this.__eO = window.setTimeout(this.__ey, this.timeout);
        };
        if(this.__eW(b)){

          qx.Bootstrap.debug(qx.bom.request.Script, z);
        };
        L.insertBefore(M, L.firstChild);
        window.setTimeout(function(){

          N._readyStateChange(2);
          N._readyStateChange(3);
        });
        return this;
      },
      abort : function(){

        if(this.__eP){

          return null;
        };
        this.__eB = true;
        this.__eV();
        this._emit(m);
        return this;
      },
      _emit : function(event){

        this[A + event]();
        this._emitter.emit(event, this);
      },
      onreadystatechange : function(){
      },
      onload : function(){
      },
      onloadend : function(){
      },
      onerror : function(){
      },
      onabort : function(){
      },
      ontimeout : function(){
      },
      getResponseHeader : function(O){

        if(this.__eP){

          return null;
        };
        if(this.__eW(h)){

          qx.Bootstrap.debug(q + r);
        };
        return t;
      },
      getAllResponseHeaders : function(){

        if(this.__eP){

          return null;
        };
        if(this.__eW(h)){

          qx.Bootstrap.debug(v + r);
        };
        return k;
      },
      setDetermineSuccess : function(P){

        this.__eM = P;
      },
      dispose : function(){

        var Q = this.__eQ;
        if(!this.__eP){

          if(Q){

            Q.onload = Q.onreadystatechange = null;
            this.__eV();
          };
          if(this.__eO){

            window.clearTimeout(this.__eO);
          };
          this.__eP = true;
        };
      },
      isDisposed : function(){

        return !!this.__eP;
      },
      _getUrl : function(){

        return this.__eN;
      },
      _getScriptElement : function(){

        return this.__eQ;
      },
      _onTimeout : function(){

        this.__eS();
        if(!this.__eT()){

          this._emit(f);
        };
        this._emit(B);
        if(!this.__eT()){

          this._emit(g);
        };
      },
      _onNativeLoad : function(){

        var S = this.__eQ,R = this.__eM,T = this;
        if(this.__eB){

          return;
        };
        if(this.__eW(x) === w && this.__eW(l) < 9){

          if(!(/loaded|complete/).test(S.readyState)){

            return;
          } else {

            if(this.__eW(b)){

              qx.Bootstrap.debug(qx.bom.request.Script, o);
            };
          };
        };
        if(this.__eW(b)){

          qx.Bootstrap.debug(qx.bom.request.Script, D);
        };
        if(R){

          if(!this.status){

            this.status = R() ? 200 : 500;
          };
        };
        if(this.status === 500){

          if(this.__eW(b)){

            qx.Bootstrap.debug(qx.bom.request.Script, y);
          };
        };
        if(this.__eO){

          window.clearTimeout(this.__eO);
        };
        window.setTimeout(function(){

          T._success();
          T._readyStateChange(4);
          T._emit(j);
          T._emit(g);
        });
      },
      _onNativeError : function(){

        this.__eS();
        this._emit(f);
        this._emit(g);
      },
      __eQ : null,
      __eL : null,
      __eN : n,
      __eJ : null,
      __eK : null,
      __ey : null,
      __eO : null,
      __eB : null,
      __eP : null,
      __eR : function(){

        this.readyState = 0;
        this.status = 0;
        this.statusText = n;
      },
      _readyStateChange : function(U){

        this.readyState = U;
        this._emit(p);
      },
      _success : function(){

        this.__eV();
        this.readyState = 4;
        if(!this.status){

          this.status = 200;
        };
        this.statusText = n + this.status;
      },
      __eS : function(){

        this.__eV();
        this.readyState = 4;
        this.status = 0;
        this.statusText = null;
      },
      __eT : function(){

        var W = this.__eW(x) === w && this.__eW(l) < 9;
        var V = this.__eW(x) === s;
        return !(W || V);
      },
      __eU : function(){

        var X = this.__eQ = document.createElement(i);
        X.src = this.__eN;
        X.onerror = this.__eK;
        X.onload = this.__eJ;
        if(this.__eW(x) === w && this.__eW(l) < 9){

          X.onreadystatechange = this.__eJ;
        };
        return X;
      },
      __eV : function(){

        var Y = this.__eQ;
        if(Y && Y.parentNode){

          this.__eL.removeChild(Y);
        };
      },
      __eW : function(ba){

        if(qx && qx.core && qx.core.Environment){

          return qx.core.Environment.get(ba);
        } else {

          if(ba === x){

            return qx.bom.client.Engine.getName();
          };
          if(ba === l){

            return qx.bom.client.Browser.getDocumentMode();
          };
          if(ba == b){

            return false;
          };
          throw new Error(C);
        };
      }
    },
    defer : function(){

      if(qx && qx.core && qx.core.Environment){

        qx.core.Environment.add(b, false);
      };
    }
  });
})();
(function(){

  var a = "qx.event.Emitter",b = "*";
  qx.Bootstrap.define(a, {
    extend : Object,
    statics : {
      __eX : []
    },
    members : {
      __eY : null,
      __fa : null,
      on : function(name, c, d){

        var e = qx.event.Emitter.__eX.length;
        this.__fb(name).push({
          listener : c,
          ctx : d,
          id : e,
          name : name
        });
        qx.event.Emitter.__eX.push({
          name : name,
          listener : c,
          ctx : d
        });
        return e;
      },
      once : function(name, f, g){

        var h = qx.event.Emitter.__eX.length;
        this.__fb(name).push({
          listener : f,
          ctx : g,
          once : true,
          id : h
        });
        qx.event.Emitter.__eX.push({
          name : name,
          listener : f,
          ctx : g
        });
        return h;
      },
      off : function(name, m, k){

        var l = this.__fb(name);
        for(var i = l.length - 1;i >= 0;i--){

          var n = l[i];
          if(n.listener == m && n.ctx == k){

            l.splice(i, 1);
            qx.event.Emitter.__eX[n.id] = null;
            return n.id;
          };
        };
        return null;
      },
      offById : function(p){

        var o = qx.event.Emitter.__eX[p];
        if(o){

          this.off(o.name, o.listener, o.ctx);
        };
        return null;
      },
      addListener : function(name, q, r){

        return this.on(name, q, r);
      },
      addListenerOnce : function(name, s, t){

        return this.once(name, s, t);
      },
      removeListener : function(name, u, v){

        this.off(name, u, v);
      },
      removeListenerById : function(w){

        this.offById(w);
      },
      emit : function(name, A){

        var x = this.__fb(name).concat();
        var y = [];
        for(var i = 0;i < x.length;i++){

          var z = x[i];
          z.listener.call(z.ctx, A);
          if(z.once){

            y.push(z);
          };
        };
        y.forEach(function(B){

          var C = this.__fb(name);
          var D = C.indexOf(B);
          C.splice(D, 1);
        }.bind(this));
        x = this.__fb(b);
        for(var i = x.length - 1;i >= 0;i--){

          var z = x[i];
          z.listener.call(z.ctx, A);
        };
      },
      getListeners : function(){

        return this.__eY;
      },
      getEntryById : function(F){

        for(var name in this.__eY){

          var E = this.__eY[name];
          for(var i = 0,j = E.length;i < j;i++){

            if(E[i].id === F){

              return E[i];
            };
          };
        };
      },
      __fb : function(name){

        if(this.__eY == null){

          this.__eY = {
          };
        };
        if(this.__eY[name] == null){

          this.__eY[name] = [];
        };
        return this.__eY[name];
      }
    }
  });
})();
(function(){

  var a = "qx.bom.request.Jsonp",b = "callback",c = "open",d = "dispose",e = "",f = "_onNativeLoad",g = "qx",h = ".callback",i = "qx.bom.request.Jsonp.";
  qx.Bootstrap.define(a, {
    extend : qx.bom.request.Script,
    construct : function(){

      qx.bom.request.Script.apply(this);
      this.__fk();
    },
    members : {
      responseJson : null,
      __ck : null,
      __fc : null,
      __fd : null,
      __fe : null,
      __ff : null,
      __fg : null,
      __eP : null,
      __fh : e,
      open : function(o, k){

        if(this.__eP){

          return;
        };
        var m = {
        },l,n,j = this;
        this.responseJson = null;
        this.__fe = false;
        l = this.__fc || b;
        n = this.__fd || this.__fh + i + this.__ck + h;
        if(!this.__fd){

          this.constructor[this.__ck] = this;
        } else {

          if(!window[this.__fd]){

            this.__ff = true;
            window[this.__fd] = function(p){

              j.callback(p);
            };
          } else {

            {
            };
          };
        };
        {
        };
        m[l] = n;
        this.__fg = k = qx.util.Uri.appendParamsToUrl(k, m);
        this.__fj(c, [o, k]);
      },
      callback : function(q){

        if(this.__eP){

          return;
        };
        this.__fe = true;
        {
        };
        this.responseJson = q;
        this.constructor[this.__ck] = undefined;
        this.__fi();
      },
      setCallbackParam : function(r){

        this.__fc = r;
        return this;
      },
      setCallbackName : function(name){

        this.__fd = name;
        return this;
      },
      setPrefix : function(s){

        this.__fh = s;
      },
      getGeneratedUrl : function(){

        return this.__fg;
      },
      dispose : function(){

        this.__fi();
        this.__fj(d);
      },
      _onNativeLoad : function(){

        this.status = this.__fe ? 200 : 500;
        this.__fj(f);
      },
      __fi : function(){

        if(this.__ff && window[this.__fd]){

          window[this.__fd] = undefined;
          this.__ff = false;
        };
      },
      __fj : function(u, t){

        qx.bom.request.Script.prototype[u].apply(this, t || []);
      },
      __fk : function(){

        this.__ck = g + (new Date().valueOf()) + (e + Math.random()).substring(2, 5);
      }
    }
  });
})();
(function(){

  var a = "function",b = "action",c = "wialon.core.Uploader",d = "input",e = "singleton",g = "eventHash",h = "max_http_buff",j = ">",k = "fileUploaded",l = "onload",m = "multipart/form-data",n = "load",o = "hidden",p = "enctype",q = "target",r = "name",s = "",t = "&sid=",u = "method",v = "form",w = "POST",x = "params",y = "?svc=",z = "none",A = "<",B = "jUploadFrame",C = "iframe",D = "jUploadForm",E = "undefined",F = "id",G = "hash",H = "object";
  qx.Class.define(c, {
    extend : qx.core.Object,
    type : e,
    members : {
      __fl : null,
      __fm : {
      },
      __fn : 1024 * 1024 * 64,
      uploadFiles : function(I, bb, S, R, W, bc){

        this.__fn = wialon.core.Session.getInstance().getEnv(h) || this.__fn;
        R = wialon.util.Helper.wrapCallback(R);
        if(!(I instanceof Array))return R(4);
        var P = (new Date()).getTime();
        var L = D + P;
        var X = B + P;
        var M = wialon.core.Session.getInstance();
        var ba = M.getBaseUrl() + M.getApiPath() + y + bb + t + M.getId();
        var V = document.createElement(v);
        if(!S)S = {
        };
        S[g] = L;
        var T = document.createElement(d);
        T.name = x;
        T.type = o;
        T.value = (wialon.util.Json.stringify(S).replace(/&lt;/g, A).replace(/&gt;/g, j));
        V.appendChild(T);
        var T = document.createElement(d);
        T.name = g;
        T.type = o;
        T.value = L;
        V.appendChild(T);
        var J = document.createElement(C);
        V.setAttribute(b, ba);
        V.setAttribute(u, w);
        V.setAttribute(r, L);
        V.setAttribute(F, L);
        V.setAttribute(p, m);
        V.style.display = z;
        var O = 0;
        for(var i = 0;i < I.length;i++){

          var N = I[i];
          var U = document.getElementById(N.id);
          var Q = 0;
          if(U && typeof U.files == H && U.files.length){

            var f = U.files[0];
            Q = typeof f.fileSize != E ? f.fileSize : (typeof f.size != E ? f.size : 0);
          };
          N.parentNode.insertBefore(N.cloneNode(true), N);
          N.setAttribute(F, s);
          V.appendChild(N);
          O += Q;
        };
        document.body.appendChild(V);
        J.setAttribute(F, X);
        J.setAttribute(r, X);
        J.style.display = z;
        document.body.appendChild(J);
        var K = qx.lang.Function.bind(this.__fo, this, {
          callback : R,
          io : J,
          form : V,
          phase : 0
        });
        if(O > this.__fn){

          K();
          return;
        };
        if(!W){

          if(window.attachEvent)J.attachEvent(l, K); else J.addEventListener(n, K, false);
        } else {

          if(!this.__fl)this.__fl = M.addListener(k, this.__fp, this);
          this.__fm[L] = K;
        };
        V.setAttribute(q, X);
        V.submit();
        if(bc && W){

          var Y = qx.lang.Function.bind(function(){

            if(typeof this.__fm[L] == a)this.__fm[L]();
          }, this);
          setTimeout(Y, bc * 1000);
        };
        return true;
      },
      __fo : function(bd, event){

        bd.io.parentNode.removeChild(bd.io);
        bd.form.parentNode.removeChild(bd.form);
        bd.io = null;
        bd.form = null;
        if(event && typeof event.result === H){

          if(event.result.svc_result){

            bd.callback(event.result.svc_error, event.result.svc_result);
          } else {

            bd.callback(event.result.error, event.result);
          };
        } else {

          bd.callback(event ? 0 : 6, (event && typeof event.preventDefault == a) ? null : event);
        };
      },
      __fp : function(event){

        var bf = event.getData();
        if(!bf || typeof bf[G] == E)return;
        var be = this.__fm[bf[G]];
        if(!be)return;
        be(bf);
        delete this.__fm[bf[G]];
      }
    }
  });
})();
(function(){

  var a = "create",b = "user/update_password",c = "changeAuthParams",d = "delete_user_notify",e = "user/update_hosts_mask",f = "Integer",g = "update_user_pass",h = "Object",i = "wialon.item.User",j = "delete",k = "user/update_item_access",l = "user/get_locale",m = "user",n = "hm",o = "userAccessChanged",p = "update_hosts_mask",q = "update_user_flags",r = "ap",s = "create_user",t = "String",u = "changeLoginDate",v = "user/update_locale",w = "changeHostsMask",x = "ld",y = "user/get_items_access",z = "create_user_notify",A = "acl",B = "changeUserFlags",C = "qx.event.type.Data",D = "fl",E = "user/update_auth_params",F = "user/send_push_message",G = "user/update_users_notifications",H = "user/update_user_flags",I = "user/verify_auth",J = "object";
  qx.Class.define(i, {
    extend : wialon.item.Item,
    properties : {
      userFlags : {
        init : null,
        check : f,
        event : B
      },
      hostsMask : {
        init : null,
        check : t,
        event : w
      },
      loginDate : {
        init : null,
        check : f,
        event : u
      },
      authParams : {
        init : null,
        check : h,
        nullable : true,
        event : c
      }
    },
    members : {
      getItemsAccess : function(M, K){

        var L = {
        };
        if(M && typeof M == J)L = M; else if(arguments.length > 2){

          L.flags = 0;
          L.directAccess = arguments[0];
          L.itemSuperclass = arguments[1];
          K = arguments[2];
        };
        return wialon.core.Remote.getInstance().remoteCall(y, {
          userId : this.getId(),
          directAccess : L.directAccess,
          itemSuperclass : L.itemSuperclass,
          flags : L.flags
        }, wialon.util.Helper.wrapCallback(K));
      },
      updateItemAccess : function(N, O, P){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          userId : this.getId(),
          itemId : N.getId(),
          accessMask : O
        }, wialon.util.Helper.wrapCallback(P));
      },
      updateUserFlags : function(S, R, Q){

        return wialon.core.Remote.getInstance().remoteCall(H, {
          userId : this.getId(),
          flags : S,
          flagsMask : R
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(Q)));
      },
      updateHostsMask : function(U, T){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          userId : this.getId(),
          hostsMask : U
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(T)));
      },
      getLocale : function(V){

        return wialon.core.Remote.getInstance().remoteCall(l, {
          userId : this.getId()
        }, wialon.util.Helper.wrapCallback(V));
      },
      updateLocale : function(W, X){

        return wialon.core.Remote.getInstance().remoteCall(v, {
          userId : this.getId(),
          locale : W
        }, wialon.util.Helper.wrapCallback(X));
      },
      updatePassword : function(bb, ba, bc, Y){

        Y = Y || 0;
        return wialon.core.Remote.getInstance().remoteCall(b, {
          userId : this.getId(),
          oldPassword : bb,
          newPassword : ba,
          logInvalid : Y
        }, wialon.util.Helper.wrapCallback(bc));
      },
      sendPushMessage : function(bh, be, bg, bf, bd){

        return wialon.core.Remote.getInstance().remoteCall(F, {
          userId : this.getId(),
          appName : bh,
          message : be,
          ttl : bf,
          params : bg
        }, wialon.util.Helper.wrapCallback(bd));
      },
      verifyAuth : function(bk, bi){

        var bj = {
          userId : this.getId(),
          type : bk.type,
          destination : bk.destination
        };
        return wialon.core.Remote.getInstance().remoteCall(I, bj, wialon.util.Helper.wrapCallback(bi));
      },
      updateAuthParams : function(bn, bl){

        var bm = {
          userId : this.getId(),
          type : bn.type
        };
        if(bn.phone)bm.phone = bn.phone;
        return wialon.core.Remote.getInstance().remoteCall(E, bm, wialon.util.Helper.wrapCallback(bl));
      }
    },
    statics : {
      dataFlag : {
        flags : 0x00000100,
        notifications : 0x00000200,
        connSettings : 0x00000400,
        mobileApps : 0x00000800
      },
      accessFlag : {
        setItemsAccess : 0x100000,
        operateAs : 0x200000,
        editUserFlags : 0x400000
      },
      authParamsType : {
        email : 1,
        sms : 2
      },
      defaultDataFlags : function(){

        return wialon.item.Item.dataFlag.base | wialon.item.Item.dataFlag.customProps | wialon.item.Item.dataFlag.billingProps | wialon.item.User.dataFlag.flags;
      },
      userFlag : {
        isDisabled : 0x00000001,
        cantChangePassword : 0x00000002,
        canCreateItems : 0x00000004,
        isReadonly : 0x00000010,
        canSendSMS : 0x00000020
      },
      accessDataFlag : {
        combined : 0x00000001,
        direct : 0x00000002
      },
      logMessageAction : {
        userCreated : s,
        userUpdatedHostsMask : p,
        userUpdatedPassword : g,
        userUpdatedFlags : q,
        userCreatedNotification : z,
        userDeletedNotification : d
      },
      registerProperties : function(){

        var bo = wialon.core.Session.getInstance();
        bo.registerConstructor(m, wialon.item.User);
        bo.registerProperty(D, this.remoteUpdateUserFlags);
        bo.registerProperty(n, this.remoteUpdateHostsMask);
        bo.registerProperty(x, this.remoteUpdateLoginDate);
        bo.registerProperty(A, this.remoteUpdateAcl);
        bo.registerProperty(r, this.remoteUpdateAuthParams);
      },
      remoteUpdateUserFlags : function(bp, bq){

        bp.setUserFlags(bq);
      },
      remoteUpdateAcl : function(br, bs){

        this.fireDataEvent(o, arguments);
      },
      remoteUpdateHostsMask : function(bt, bu){

        bt.setHostsMask(bu);
      },
      remoteUpdateLoginDate : function(bv, bw){

        bv.setLoginDate(bw);
      },
      remoteUpdateAuthParams : function(bx, by){

        bx.setAuthParams(by);
      },
      createUserNotifications : function(bz, bA, bC){

        if(!bz || !bA){

          return;
        };
        var bB = Object.assign({
        }, bz);
        bB.callMode = a;
        bB.items = bA;
        return wialon.core.Remote.getInstance().remoteCall(G, bB, wialon.util.Helper.wrapCallback(bC));
      },
      deleteUserNotifications : function(bD, bE){

        if(!bD){

          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(G, {
          callMode : j,
          items : bD
        }, wialon.util.Helper.wrapCallback(bE));
      }
    },
    events : {
      "changeUserFlags" : C,
      "changeHostsMask" : C,
      "changeLoginDate" : C,
      "userAccessChanged" : C,
      "changeAuthParams" : C
    }
  });
})();
(function(){

  var a = "download_file",b = "set",c = "cneh",d = "update_unit_phone",e = "changeAccessPassword",f = "update_unit_uid",g = "qx.event.type.Data",h = 'function',i = "check_config",j = "changeDeviceTypeId",k = "changeMessageParams",l = "changeDriverCode",m = "Float",n = "pos",o = "number",p = "unit/update_traffic_counter",q = "update_unit_trip_cfg",r = "update_alias",s = "unit/update_mileage_counter",t = "vp",u = "update_msgs_filter_cfg",v = "update_unit_milcounter",w = "delete_unit_msg",x = "unit/update_calc_flags",y = "bind_unit_trailer",z = "delete_alias",A = "?sid=",B = "unit/update_eh_counter",C = "&time=",D = "unit/set_active",E = "changeUniqueId2",F = "changeLastMessage",G = "unbind_unit_driver",H = "act",I = "hw",J = "update_unit_calcflags",K = "ud",L = "get",M = "&msgIndex=",N = "psw",O = "update_unit_phone2",P = "cfl",Q = "uid2",R = "avl_unit",S = "ph",T = "import_unit_msgs",U = "uid",V = "unit/exec_cmd",W = "update_unit_bytecounter",X = "create_alias",Y = "lmsg",cy = "changePhoneNumber2",cz = "changeMileageCounter",cA = 'position_deletion',cu = "changeActive",cv = "unit/reset_vrt_command_queue",cw = "&svc=unit/update_hw_params&params=",cx = "unit/update_access_password",cF = "changeActivityReason",cG = "function",cH = "delete_service_interval",cI = "changeTrafficCounter",cB = "wialon.item.Unit",cC = "unit/get_vrt_command_queue",cD = "update_unit_report_cfg",cE = "changeVideoParams",cM = "Object",dn = "changeNetConn",dO = "unit/update_unique_id2",cN = "changePhoneNumber",cJ = "/avl_msg_photo.jpeg?sid=",cK = "unit/update_activity_settings",dJ = "update_unit_pass",cL = "cmds",cO = "ph2",cP = "changeUniqueId",cQ = "changeCalcFlags",cV = "qx.strict",cW = "unbind_unit_trailer",cX = "unit/update_device_type",cR = "unit/update_phone",cS = 'number',cT = "bind_unit_driver",cU = "update_unit_hw",dc = "prms",dd = "account/change_account",dL = "object",de = "changeEngineHoursCounter",cY = "unit/update_phone2",da = "changeDeactivationTime",dK = "cnkb",db = "update_unit_ehcounter",di = "unit/get_activity_settings",dj = "update_sensor",dN = "Integer",dk = "changePosition",df = "update_unit_fuel_cfg",dg = "update_unit_uid2",dM = "Array",dh = 'position_validation',dl = "String",dm = "netconn",dz = "",dy = "act_reason",dx = "update_service_interval",dD = "cnm",dC = "changeCommands",dB = "v1311",dA = "create_sensor",ds = "drv",dr = "unit/get_command_definition_data",dq = "unit/update_hw_params",dp = "update_unit_hw_config",dw = "delete_sensor",dv = "/adfurl",du = "create_service_interval",dt = "import_unit_cfg",dH = "dactt",dG = "&unitIndex=",dF = "delete_unit_msgs",dE = "create_unit",dI = "undefined";
  qx.Class.define(cB, {
    extend : wialon.item.Item,
    properties : {
      uniqueId : {
        init : null,
        check : dl,
        event : cP
      },
      uniqueId2 : {
        init : null,
        check : dl,
        event : E
      },
      deviceTypeId : {
        init : null,
        check : dN,
        event : j
      },
      phoneNumber : {
        init : null,
        check : dl,
        event : cN
      },
      phoneNumber2 : {
        init : null,
        check : dl,
        event : cy
      },
      accessPassword : {
        init : null,
        check : dl,
        event : e
      },
      commands : {
        init : null,
        check : dM,
        event : dC
      },
      position : {
        init : null,
        check : cM,
        event : dk,
        nullable : true
      },
      lastMessage : {
        init : null,
        check : cM,
        event : F,
        nullable : true
      },
      prevMessage : {
        init : null,
        check : cM,
        nullable : true
      },
      driverCode : {
        init : null,
        check : dl,
        event : l
      },
      calcFlags : {
        init : null,
        check : dN,
        event : cQ
      },
      mileageCounter : {
        init : null,
        check : dN,
        event : cz
      },
      engineHoursCounter : {
        init : null,
        check : m,
        event : de
      },
      trafficCounter : {
        init : null,
        check : dN,
        event : cI
      },
      messageParams : {
        init : null,
        check : cM,
        event : k,
        nullable : true
      },
      netConn : {
        init : 0,
        check : dN,
        event : dn
      },
      activity : {
        init : 1,
        check : dN,
        event : cu
      },
      activityReason : {
        init : 1,
        check : dN,
        event : cF
      },
      deactivationTime : {
        init : 0,
        check : dN,
        event : da
      },
      videoParams : {
        init : null,
        check : cM,
        event : cE
      }
    },
    members : {
      remoteCommand : function(dQ, dP, dR, dU, dT, dS){

        if(dT && typeof dT == cG){

          dS = dT;
          dT = 0;
        };
        return wialon.core.Remote.getInstance().remoteCall(V, {
          itemId : this.getId(),
          commandName : dQ,
          linkType : dP,
          param : dR,
          timeout : dU,
          flags : dT
        }, wialon.util.Helper.wrapCallback(dS));
      },
      remoteCommandDefinitions : function(dW, dV){

        return wialon.core.Remote.getInstance().remoteCall(dr, {
          itemId : this.getId(),
          col : dW.commands
        }, wialon.util.Helper.wrapCallback(dV));
      },
      getVirtualCommandsQueue : function(dX){

        return wialon.core.Remote.getInstance().remoteCall(cC, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(dX));
      },
      resetVirtualCommandsQueue : function(dY){

        return wialon.core.Remote.getInstance().remoteCall(cv, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(dY));
      },
      updateDeviceSettings : function(ec, eb, ea){

        return wialon.core.Remote.getInstance().remoteCall(cX, {
          itemId : this.getId(),
          deviceTypeId : ec,
          uniqueId : eb
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ea)));
      },
      updateUniqueId2 : function(ed, ee){

        return wialon.core.Remote.getInstance().remoteCall(dO, {
          itemId : this.getId(),
          uniqueId2 : ed
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ee)));
      },
      updatePhoneNumber : function(eg, ef){

        return wialon.core.Remote.getInstance().remoteCall(cR, {
          itemId : this.getId(),
          phoneNumber : eg
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ef)));
      },
      updatePhoneNumber2 : function(ei, eh){

        return wialon.core.Remote.getInstance().remoteCall(cY, {
          itemId : this.getId(),
          phoneNumber : ei
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(eh)));
      },
      updateAccessPassword : function(ek, ej){

        return wialon.core.Remote.getInstance().remoteCall(cx, {
          itemId : this.getId(),
          accessPassword : ek
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ej)));
      },
      updateMileageCounter : function(em, el){

        return wialon.core.Remote.getInstance().remoteCall(s, {
          itemId : this.getId(),
          newValue : em
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(el)));
      },
      updateEngineHoursCounter : function(eo, en){

        return wialon.core.Remote.getInstance().remoteCall(B, {
          itemId : this.getId(),
          newValue : eo
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(en)));
      },
      updateTrafficCounter : function(eq, er, ep){

        return wialon.core.Remote.getInstance().remoteCall(p, {
          itemId : this.getId(),
          newValue : eq,
          regReset : er || 0
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ep)));
      },
      updateCalcFlags : function(et, es){

        return wialon.core.Remote.getInstance().remoteCall(x, {
          itemId : this.getId(),
          newValue : et
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(es)));
      },
      updateActive : function(ev, eu){

        return wialon.core.Remote.getInstance().remoteCall(D, {
          itemId : this.getId(),
          active : ev
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(eu)));
      },
      setActive : function(ew){

        this.updateActivity(ew);
      },
      getActive : function(){

        var ex = this.getActivity();
        if(ex === null)return 1; else return ex;
      },
      getActiveReason : function(){

        return this.getActivityReason() || 0;
      },
      changeAccount : function(ez, ey){

        return wialon.core.Remote.getInstance().remoteCall(dd, {
          itemId : this.getId(),
          resourceId : ez.resourceId
        }, wialon.util.Helper.wrapCallback(ey));
      },
      handleMessage : function eE(eF){

        if(eF && eF.tp == K){

          var eD = this.getLastMessage();
          var eH = this.getPosition();
          var eB = eF.f & wialon.item.Unit.dataMessageFlag.lbsFlag;
          var eG = 0;
          if(eH)eG = eH.f & wialon.item.Unit.dataMessageFlag.lbsFlag;
          if(!eD || eD.t < eF.t){

            if(!eD){

              this.setLastMessage(eF);
              this.setPrevMessage(eD);
            } else {

              var eC = qx.lang.Object.clone(eF);
              if(eF.p)eC.p = qx.lang.Object.clone(eF.p);
              if(wialon.core.Session.getInstance().getVersion() == dB){

                qx.lang.Object.mergeWith(eC, eD, 0);
                if(eD.p)qx.lang.Object.mergeWith(eC.p, eD.p, 0);
              };
              if(eC.pos && (!eH || !eB || (eH.lc != eF.lc && (eG || (eF.t - eH.t >= 300))))){
              } else {

                if(eH){

                  eC.pos = qx.lang.Object.clone(eH);
                  eC.pos._noPosition = true;
                } else {

                  eC.pos = null;
                };
              };
              this.setLastMessage(eC);
              this.setPrevMessage(eD);
            };
          };
          if(eF.pos && (!eH || !eH.t || eH.t < eF.t)){

            if(!eH || !eB || !eH.t || (eH.lc != eF.lc && (eG || (eF.t - eH.t >= 300)))){

              var eA = qx.lang.Object.clone(eF.pos);
              eA.t = eF.t;
              eA.f = eF.f;
              eA.lc = eF.lc;
              wialon.item.Unit.__fr(this, eA);
              this.__fq(eA);
            };
          };
        };
        wialon.services.Tasks.getInstance().addTask(eF, this.getId());
        if(qx.core.Environment.get(cV)){

          this.callee(eE, arguments, eF);
        } else {

          wialon.item.Item.prototype.handleMessage.call(this, eF);
        };
      },
      handleDeleteMessage : function eJ(eI){

        wialon.services.Tasks.getInstance().removeTask(eI);
        if(qx.core.Environment.get(cV)){

          this.callee(eJ, arguments, eI);
        } else {

          wialon.item.Item.prototype.handleDeleteMessage.call(this, eI);
        };
      },
      getMessageImageUrl : function(eM, eK, eL){

        if(!eL)eL = dz;
        return wialon.core.Session.getInstance().getBaseUrl() + dv + eL + cJ + wialon.core.Session.getInstance().getId() + C + eM + dG + this.getId() + M + eK;
      },
      downloadHwParamFile : function(eP, eQ, eN){

        var eO = wialon.core.Session.getInstance();
        return eO.getBaseUrl() + eO.getApiPath() + A + eO.getId() + cw + qx.lang.Json.stringify({
          itemId : this.getId(),
          hwId : eP,
          fileId : eQ,
          action : a
        });
      },
      updateHwParams : function(eS, eT, eR, eU){

        if(eR && eR.length && (typeof eT.full_data != dI && !eT.full_data))wialon.core.Uploader.getInstance().uploadFiles(eR, dq, {
          itemId : this.getId(),
          hwId : eS,
          params_data : eT,
          action : b
        }, wialon.util.Helper.wrapCallback(eU), true, 30000); else return wialon.core.Remote.getInstance().remoteCall(dq, {
          itemId : this.getId(),
          hwId : eS,
          params_data : eT,
          action : b
        }, wialon.util.Helper.wrapCallback(eU));
      },
      getDriverActivitySettings : function(eV){

        return wialon.core.Remote.getInstance().remoteCall(di, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(eV));
      },
      updateDriverActivitySettings : function(eX, eW){

        return wialon.core.Remote.getInstance().remoteCall(cK, {
          itemId : this.getId(),
          type : eX
        }, wialon.util.Helper.wrapCallback(eW));
      },
      __fq : function(fb){

        var fa = wialon.core.Session.getInstance();
        var eY = fa.getCoordinatesTransformer();
        if(eY){

          fb = eY.direct(fb);
        };
        this.setPosition(fb);
      }
    },
    statics : {
      dataFlag : {
        restricted : 0x00000100,
        commands : 0x00000200,
        lastMessage : 0x00000400,
        driverCode : 0x00000800,
        sensors : 0x00001000,
        counters : 0x00002000,
        routeControl : 0x00004000,
        maintenance : 0x00008000,
        log : 0x00010000,
        reportSettings : 0x00020000,
        other : 0x00040000,
        commandAliases : 0x00080000,
        messageParams : 0x00100000,
        netConn : 0x00200000,
        lastPosition : 0x00400000
      },
      accessFlag : {
        editDevice : 0x100000,
        viewDevice : 0x4000000,
        editSensors : 0x200000,
        editCounters : 0x400000,
        deleteMessages : 0x800000,
        executeCommands : 0x1000000,
        registerEvents : 0x2000000,
        editTasks : 0x20000000000,
        editTasksStatusAndComment : 0x10000000000,
        editActivationCodes : 0x40000000000,
        viewServiceIntervals : 0x10000000,
        editServiceIntervals : 0x20000000,
        importMessages : 0x40000000,
        exportMessages : 0x80000000,
        viewCmdAliases : 0x400000000,
        editCmdAliases : 0x800000000,
        editReportSettings : 0x4000000000,
        monitorState : 0x8000000000
      },
      calcFlag : {
        mileageMask : 0xF,
        mileageGps : 0x0,
        mileageAbsOdometer : 0x1,
        mileageRelOdometer : 0x2,
        mileageGpsIgn : 0x3,
        engineHoursMask : 0xF0,
        engineHoursIgn : 0x10,
        engineHoursAbs : 0x20,
        engineHoursRel : 0x40,
        mileageAuto : 0x100,
        engineHoursAuto : 0x200,
        trafficAuto : 0x400
      },
      dataMessageFlag : {
        position : 0x1,
        inputs : 0x2,
        outputs : 0x4,
        alarm : 0x10,
        driverCode : 0x20,
        imported : 0x40,
        lbsFlag : 0x20000,
        wifiFlag : 0x80000
      },
      eventMessageFlag : {
        typeMask : 0x0F,
        typeSimple : 0x0,
        typeViolation : 0x1,
        typeMaintenance : 0x2,
        typeRouteControl : 0x4,
        typeDrivingInfo : 0x8,
        maintenanceMask : 0x0,
        maintenanceService : 0x10,
        maintenanceFilling : 0x20
      },
      execCmdFlag : {
        primaryPhone : 0x01,
        secondaryPhone : 0x02,
        paramFsLink : 0x04,
        paramTempFile : 0x08,
        paramJson : 0x10
      },
      logMessageAction : {
        unitCreated : dE,
        unitUpdatedPassword : dJ,
        unitUpdatedPhone : d,
        unitUpdatedPhone2 : O,
        unitUpdatedCalcFlags : J,
        unitChangeMilageCounter : v,
        unitChangeByteCounter : W,
        unitChangeEngineHoursCounter : db,
        unitUpdatedUniqueId : f,
        unitUpdatedUniqueId2 : dg,
        unitUpdatedHwType : cU,
        unitUpdatedHwConfig : dp,
        unitUpdatedFuelConsumptionSettings : df,
        unitUpdatedTripDetectorSettings : q,
        unitCreatedSensor : dA,
        unitUpdatedSensor : dj,
        unitDeletedSensor : dw,
        unitCreatedCommandAlias : X,
        unitUpdatedCommandAlias : r,
        unitDeletedCommandAlias : z,
        unitCreatedServiceInterval : du,
        unitUpdatedServiceInterval : dx,
        unitDeletedServiceInterval : cH,
        unitSettingsImported : dt,
        unitMessagesImported : T,
        unitMessageDeleted : w,
        unitMessagesDeleted : dF,
        unitDriverBinded : cT,
        unitDriverUnbinded : G,
        unitTrailerBinded : y,
        unitTrailerUnbinded : cW,
        unitReportSettingsUpdated : cD,
        unitMessagesFilterSettingsUpdated : u
      },
      driverActivitySource : {
        none : 0,
        trips : 1,
        tachograph : 2
      },
      registerProperties : function(){

        var fc = wialon.core.Session.getInstance();
        fc.registerConstructor(R, wialon.item.Unit);
        fc.registerProperty(U, this.remoteUpdateUniqueId);
        fc.registerProperty(Q, this.remoteUpdateUniqueId2);
        fc.registerProperty(I, this.remoteUpdateDeviceTypeId);
        fc.registerProperty(S, this.remoteUpdatePhoneNumber);
        fc.registerProperty(cO, this.remoteUpdatePhoneNumber2);
        fc.registerProperty(N, this.remoteUpdateAccessPassword);
        fc.registerProperty(cL, this.remoteUpdateCommands);
        fc.registerProperty(n, this.remoteUpdatePosition);
        fc.registerProperty(Y, this.remoteUpdateLastMessage);
        fc.registerProperty(ds, this.remoteUpdateDriverCode);
        fc.registerProperty(P, this.remoteUpdateCalcFlags);
        fc.registerProperty(dD, this.remoteUpdateMileageCounter);
        fc.registerProperty(c, this.remoteUpdateEngineHoursCounter);
        fc.registerProperty(dK, this.remoteUpdateTrafficCounter);
        fc.registerProperty(dc, this.remoteUpdateMessageParams);
        fc.registerProperty(dm, this.remoteUpdateNetConn);
        fc.registerProperty(H, this.remoteUpdateActive);
        fc.registerProperty(dy, this.remoteUpdateActivityReason);
        fc.registerProperty(dH, this.remoteUpdateDeactivationTime);
        fc.registerProperty(t, this.remoteUpdateVideoParams);
        wialon.item.MIcon.registerIconProperties();
      },
      remoteUpdateVideoParams : function(fd, fe){

        fd.setVideoParams(fe);
      },
      remoteUpdateUniqueId : function(ff, fg){

        ff.setUniqueId(fg);
      },
      remoteUpdateUniqueId2 : function(fh, fi){

        fh.setUniqueId2(fi);
      },
      remoteUpdateDeviceTypeId : function(fj, fk){

        fj.setDeviceTypeId(fk);
      },
      remoteUpdatePhoneNumber : function(fl, fm){

        fl.setPhoneNumber(fm);
      },
      remoteUpdatePhoneNumber2 : function(fn, fo){

        fn.setPhoneNumber2(fo);
      },
      remoteUpdateAccessPassword : function(fp, fq){

        fp.setAccessPassword(fq);
      },
      remoteUpdateCommands : function(fr, fs){

        fr.setCommands(fs);
      },
      remoteUpdatePosition : function(ft, fx){

        var fv = wialon.core.Session.getInstance();
        var fu = fv.getLogger();
        if(fu && (typeof fu.warn === h)){

          var fw = ft.getPosition();
          if(fw && !fx){

            fu.warn({
              type : cA,
              unit : ft
            });
          } else {

            wialon.item.Unit.__fr(ft, fx);
          };
        };
        ft.__fq(fx);
      },
      remoteUpdateLastMessage : function(fy, fz){

        fy.setLastMessage(fz);
      },
      remoteUpdateDriverCode : function(fA, fB){

        fA.setDriverCode(fB);
      },
      remoteUpdateCalcFlags : function(fC, fD){

        fC.setCalcFlags(fD);
      },
      remoteUpdateMileageCounter : function(fE, fF){

        fE.setMileageCounter(fF);
      },
      remoteUpdateEngineHoursCounter : function(fG, fH){

        fG.setEngineHoursCounter(fH);
      },
      remoteUpdateTrafficCounter : function(fI, fJ){

        fI.setTrafficCounter(fJ);
      },
      remoteUpdateMessageParams : function(fL, fN){

        if(typeof fN != dL)return;
        var fK = fL.getMessageParams();
        if(!fK)fK = {
        }; else fK = qx.lang.Object.clone(fK);
        for(var fM in fN){

          if(typeof fN[fM] == dL && typeof fK[fM] == dL && fN[fM].ct > fK[fM].ct){

            var fO = fK[fM].at;
            fK[fM] = fN[fM];
            if(fO > fN[fM].at)fK[fM].at = fO;
          } else if(typeof fN[fM] == dL && typeof fK[fM] == dL && fN[fM].ct == fK[fM].ct && fN[fM].at > fK[fM].at){

            fK[fM].at = fN[fM].at;
          } else if(typeof fN[fM] == dL && typeof fK[fM] == dI)fK[fM] = fN[fM]; else if(typeof fK[fM] == dL && typeof fN[fM] == o && fN[fM] > fK[fM].at)fK[fM].at = fN[fM];;;;
        };
        fL.setMessageParams(fK);
      },
      remoteUpdateNetConn : function(fP, fQ){

        fP.setNetConn(fQ);
      },
      remoteUpdateActive : function(fR, fS){

        fR.setActivity(fS);
      },
      remoteUpdateActivityReason : function(fT, fU){

        fT.setActivityReason(fU);
      },
      remoteUpdateDeactivationTime : function(fV, fW){

        fV.setDeactivationTime(fW);
      },
      checkHwConfig : function(fY, fX){

        return wialon.core.Remote.getInstance().remoteCall(dq, {
          hwId : fY,
          action : i
        }, wialon.util.Helper.wrapCallback(fX));
      },
      getHwParams : function(gd, gc, gb, ga){

        return wialon.core.Remote.getInstance().remoteCall(dq, {
          itemId : gd,
          hwId : gc,
          fullData : gb ? 1 : 0,
          action : L
        }, wialon.util.Helper.wrapCallback(ga));
      },
      __fr : function(gi, gh){

        if(!gh)return;
        var gg = wialon.core.Session.getInstance();
        var gf = gg.getLogger();
        if(!gf || (typeof gf.warn !== h))return;
        var ge = (typeof gh.x === cS) && (typeof gh.y === cS);
        if(!ge)return;
        ge = (-90 <= gh.y && gh.y <= 90);
        if(!ge){

          gf.warn({
            type : dh,
            unit : gi,
            pos : gh
          });
        };
      }
    },
    events : {
      "changeUniqueId" : g,
      "changeUniqueId2" : g,
      "changeDeviceTypeId" : g,
      "changePhoneNumber" : g,
      "changePhoneNumber2" : g,
      "changeAccessPassword" : g,
      "changeCommands" : g,
      "changePosition" : g,
      "changeLastMessage" : g,
      "changeDriverCode" : g,
      "changeCalcFlags" : g,
      "changeMileageCounter" : g,
      "changeEngineHoursCounter" : g,
      "changeTrafficCounter" : g,
      "changeMessageParams" : g,
      "changeNetConn" : g,
      "changeActive" : g,
      "changeActivityReason" : g,
      "changeDeactivationTime" : g,
      "changeVideoParams" : g
    }
  });
})();
(function(){

  var a = 'function',b = "unit/update_task",c = "wialon.services.Tasks",d = "qx.strict",e = "serverUpdated",f = "unit/create_task",g = "tasksDeleted",h = "messages/get_task_messages",i = "tasksUpdated",j = "singleton",k = "qx.event.type.Data";
  qx.Class.define(c, {
    extend : qx.core.Object,
    type : j,
    construct : function l(n){

      if(qx.core.Environment.get(d)){

        this.callee(l, arguments);
      } else {

        qx.core.Object.call(this);
      };
      var m = wialon.core.Session.getInstance();
      m.addListener(e, qx.lang.Function.bind(function(){

        if(this.__go){

          this.fireDataEvent(i, this.__gn);
          this.__go = false;
        };
        if(Object.keys(this.__gq).length){

          this.fireDataEvent(g, this.__gq);
          this.__gq = {
          };
        };
      }, this));
    },
    members : {
      __gn : {
      },
      __go : false,
      __gq : {
      },
      addTask : function(o, p){

        var q = o.p && o.p.task_id;
        if(q){

          this.__gn[q] = Object.assign({
          }, o, {
            item_id : p
          });
          this.__go = true;
        };
      },
      removeTask : function(r){

        var s = r.p && r.p.task_id;
        if(s){

          this.__gq[s] = this.__gn[s];
          delete this.__gn[s];
        };
      },
      getTask : function(t){

        return this.__gn[t];
      },
      getTasks : function(){

        return this.__gn;
      },
      clear : function(){

        this.__gn = {
        };
        this.__gq = {
        };
        this.__go = false;
      },
      updateTaskAsync : function(v, u){

        return wialon.core.Remote.getInstance().remoteCall(b, v, qx.lang.Function.bind(function(y, x){

          if(y > 0){

            typeof u === a && u(y, x);
            return;
          };
          var w = this.__gn[v.taskId];
          if(w){

            w.p = Object.assign({
            }, w.p, v.props);
            typeof u === a && u(null, this.__gn);
            this.fireDataEvent(i, this.__gn);
          };
        }, this));
      },
      createTaskAsync : function(A, z){

        return wialon.core.Remote.getInstance().remoteCall(f, A, qx.lang.Function.bind(function(C, B){

          if(typeof z === a){

            z(C, B);
            return;
          };
        }, this));
      },
      getRemoteTasksAsync : function(E, D){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          itemIds : E.itemIds,
          timeFrom : E.timeFrom,
          timeTo : E.timeTo,
          loadCount : E.loadCount
        }, qx.lang.Function.bind(function(G, F){

          if(G > 0){

            typeof D === a && D(G, F);
            return;
          };
          if(F && F.messages){

            if(!E.isPartialRefresh){

              this.__gn = {
              };
            };
            F.messages.forEach(qx.lang.Function.bind(function(H){

              this.__gn[H.p.task_id] = H;
            }, this));
          };
          typeof D === a && D(null, this.__gn);
          this.fireDataEvent(i, this.__gn);
        }, this));
      },
      deleteTasksByUnitId : function(I){

        var J = this.__gn;
        var L = {
        };
        for(var K in J){

          if(J[K].item_id === I){

            L[K] = J[K];
            delete J[K];
          };
        };
        this.fireDataEvent(g, L);
      }
    },
    events : {
      "tasksUpdated" : k,
      "tasksDeleted" : k
    }
  });
})();
(function(){

  var a = "ugi",b = "undefined",c = "&v=1&sid=",d = "wialon.item.MIcon",e = "qx.event.type.Data",f = "number",g = "changeIconUri",h = "unit/upload_image",i = "string",j = "changeIcon",k = "img_rot",l = "?b=",m = ".png?sid=",n = "/avl_item_image/",o = "/",p = "Integer",q = "String",r = "unit/update_image",s = "uri";
  qx.Mixin.define(d, {
    properties : {
      iconCookie : {
        init : null,
        check : p,
        event : j
      },
      iconUri : {
        init : null,
        check : q,
        event : g
      }
    },
    members : {
      getIconUrl : function(w){

        if(typeof w == b || !w)w = 32;
        var v = this.getIconUri();
        var u = wialon.core.Session.getInstance();
        if(v){

          return u.getBaseUrl() + v + l + w + c + u.getId();
        };
        var t = u.getBaseUrl() + n + this.getId() + o + w + o + this.getIconCookie() + m + u.getId();
        return t;
      },
      updateIcon : function(x, y){

        if(typeof x == i)return wialon.core.Uploader.getInstance().uploadFiles([], h, {
          fileUrl : x,
          itemId : this.getId()
        }, y, true); else if(typeof x == f)return wialon.core.Remote.getInstance().remoteCall(r, {
          itemId : this.getId(),
          oldItemId : x
        }, y);;
        return wialon.core.Uploader.getInstance().uploadFiles([x], h, {
          itemId : this.getId()
        }, y, true);
      },
      updateIconLibrary : function(A, z, B){

        wialon.core.Remote.getInstance().remoteCall(r, {
          itemId : this.getId(),
          libId : A,
          path : z
        }, B);
      },
      canRotate : function(){

        return (this.getCustomProperty(k) != 0) && (wialon.util.Number.and(this.getIconCookie(), 0x1FFFFF00000000) == 0);
      },
      getIconGroupId : function(){

        if(wialon.util.Number.and(this.getIconCookie(), 0x1FFFFF00000000) != 0)return (this.getIconCookie() & 0xFFFFFFFF); else return 0;
      }
    },
    statics : {
      registerIconProperties : function(){

        var C = wialon.core.Session.getInstance();
        C.registerProperty(a, this.remoteUpdateIconCookie);
        C.registerProperty(s, this.remoteUpdateIconUri);
      },
      remoteUpdateIconCookie : function(D, E){

        D.setIconCookie(E);
      },
      remoteUpdateIconUri : function(F, G){

        F.setIconUri(G);
      }
    },
    events : {
      "changeIcon" : e,
      "changeIconUri" : e
    }
  });
})();
(function(){

  var a = "create_resource",b = "import_zones",c = "delete_notify",d = "resource/upload_tacho_file",e = "delete_poi",f = "update_driver",g = "switch_job",h = "update_driver_units",i = "avl_resource",j = "update_zone",k = "resource/update_email_template",l = "delete_drivers_group",m = "resource/get_orders_notification",n = "create_zones_group",o = "delete_report",p = "update_report",q = "delete_driver",r = "resource/get_email_template",s = "delete_zone",t = "update_poi",u = "delete_job",v = "update_notify",w = "update_drivers_group",x = "wialon.item.Resource",y = "create_drivers_group",z = "create_notify",A = "resource/update_orders_notification",B = "create_zone",C = "create_driver",D = "switch_notify",E = "create_report",F = "update_zones_group",G = "delete_zones_group",H = "update_job",I = "import_pois",J = "create_job",K = "create_poi";
  qx.Class.define(x, {
    extend : wialon.item.Item,
    members : {
      saveTachoData : function(N, M, O, L){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          driverCode : N,
          guid : M,
          outputFlag : O
        }, wialon.util.Helper.wrapCallback(L));
      },
      getOrdersNotification : function(P){

        return wialon.core.Remote.getInstance().remoteCall(m, {
          resourceId : this.getId()
        }, wialon.util.Helper.wrapCallback(P));
      },
      updateOrdersNotification : function(R, Q){

        return wialon.core.Remote.getInstance().remoteCall(A, {
          resourceId : this.getId(),
          ordersNotification : R
        }, wialon.util.Helper.wrapCallback(Q));
      },
      getEmailTemplate : function(S){

        return wialon.core.Remote.getInstance().remoteCall(r, {
          resourceId : this.getId()
        }, wialon.util.Helper.wrapCallback(S));
      },
      updateEmailTemplate : function(W, T, V, U){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          resourceId : this.getId(),
          subject : W,
          body : T,
          flags : V
        }, wialon.util.Helper.wrapCallback(U));
      }
    },
    statics : {
      dataFlag : {
        drivers : 0x00000100,
        jobs : 0x00000200,
        notifications : 0x00000400,
        poi : 0x00000800,
        zones : 0x00001000,
        reports : 0x00002000,
        agro : 0x01000000,
        driverUnits : 0x00004000,
        driverGroups : 0x00008000,
        trailers : 0x00010000,
        trailerGroups : 0x00020000,
        trailerUnits : 0x00040000,
        orders : 0x00080000,
        zoneGroups : 0x00100000,
        tags : 0x00200000,
        tagUnits : 0x00400000,
        tagGroups : 0x00800000
      },
      accessFlag : {
        viewNotifications : 0x100000,
        editNotifications : 0x200000,
        viewPoi : 0x400000,
        editPoi : 0x800000,
        viewZones : 0x1000000,
        editZones : 0x2000000,
        viewJobs : 0x4000000,
        editJobs : 0x8000000,
        viewReports : 0x10000000,
        editReports : 0x20000000,
        viewDrivers : 0x40000000,
        editDrivers : 0x80000000,
        manageAccount : 0x100000000,
        viewOrders : 0x200000000,
        editOrders : 0x400000000,
        viewTags : 0x800000000,
        editTags : 0x1000000000,
        agroEditCultivations : 0x10000000000,
        agroView : 0x20000000000,
        agroEdit : 0x40000000000,
        viewTrailers : 0x100000000000,
        editTrailers : 0x200000000000
      },
      logMessageAction : {
        resourceCreated : a,
        resourceCreatedZone : B,
        resourceUpdatedZone : j,
        resourceDeletedZone : s,
        resourceCreatedZonesGroup : n,
        resourceUpdatedZonesGroup : F,
        resourceDeletedZonesGroup : G,
        resourceCreatedPoi : K,
        resourceUpdatedPoi : t,
        resourceDeletedPoi : e,
        resourceCreatedJob : J,
        resourceSwitchedJob : g,
        resourceUpdatedJob : H,
        resourceDeletedJob : u,
        resourceCreatedNotification : z,
        resourceSwitchedNotification : D,
        resourceUpdatedNotification : v,
        resourceDeletedNotification : c,
        resourceCreatedDriver : C,
        resourceUpdatedDriver : f,
        resourceDeletedDriver : q,
        resourceCreatedDriversGroup : y,
        resourceUpdatedDriversGroup : w,
        resourceDeletedDriversGroup : l,
        resourceUpdatedDriverUnits : h,
        resourceCreatedReport : E,
        resourceUpdatedReport : p,
        resourceDeletedReport : o,
        resourceImportedPois : I,
        resourceImportedZones : b
      },
      remoteOptimizeFlag : {
        fitSchedule : 0x1,
        optimizeDuration : 0x2
      },
      jobFlags : {
        removeAfterLimit : 0x1
      },
      registerProperties : function(){

        var X = wialon.core.Session.getInstance();
        X.registerConstructor(i, wialon.item.Resource);
      }
    }
  });
})();
(function(){

  var a = "create_group",b = "Array",c = "u",d = "wialon.item.UnitGroup",e = "avl_unit",f = "avl_unit_group",g = "units_group",h = "qx.event.type.Data",i = "changeUnits",j = "unit_group/update_units";
  qx.Class.define(d, {
    extend : wialon.item.Item,
    properties : {
      units : {
        init : [],
        check : b,
        event : i
      }
    },
    members : {
      updateUnits : function(k, l){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          itemId : this.getId(),
          units : k
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(l)));
      }
    },
    statics : {
      registerProperties : function(){

        var m = wialon.core.Session.getInstance();
        m.registerConstructor(f, wialon.item.UnitGroup);
        m.registerProperty(c, this.remoteUpdateUnits);
        wialon.item.MIcon.registerIconProperties();
      },
      logMessageAction : {
        unitGroupCreated : a,
        unitGroupUnitsUpdated : g
      },
      remoteUpdateUnits : function(n, p){

        var o = n.getUnits() || [];
        if(o && wialon.util.Json.compareObjects(p, o))return;
        if(!p){

          p = [];
        };
        n.setUnits(p);
      },
      checkUnit : function(q, s){

        if(!q || q.getType() != f || !s || s.getType() != e)return false;
        var r = q.getUnits() || [];
        var t = s.getId();
        return (r.indexOf(t) != -1 ? true : false);
      }
    },
    events : {
      "changeUnits" : h
    }
  });
})();
(function(){

  var a = "Boolean",b = "changeOperating",c = "retranslator/update_config",d = "Integer",e = "Object",f = "retranslator/update_units",g = "changeStopTime",h = "avl_retranslator",i = "rtrc",j = "qx.event.type.Data",k = "retranslator/get_stats",l = "create_retranslator",m = "rtru",n = "switch_retranslator",o = "retranslator/update_operating",p = "rtro",q = "units_retranslator",r = "rtrst",s = "changeConfig",t = "retranslator/list",u = "changeUnits",v = "update_retranslator",w = "wialon.item.Retranslator",x = "object";
  qx.Class.define(w, {
    extend : wialon.item.Item,
    properties : {
      operating : {
        init : null,
        check : a,
        event : b
      },
      stopTime : {
        init : null,
        check : d,
        event : g
      },
      config : {
        init : null,
        check : e,
        event : s
      },
      units : {
        init : [],
        check : e,
        event : u
      }
    },
    members : {
      updateOperating : function(A, y){

        var z = {
        };
        if(A && typeof A == x)z = A; else z.operate = A;
        return wialon.core.Remote.getInstance().remoteCall(o, {
          itemId : this.getId(),
          callMode : z.callMode,
          operate : z.operate,
          timeFrom : z.timeFrom,
          timeTo : z.timeTo
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(y)));
      },
      updateOperatingWithTimeout : function(F, D, E, B){

        var C;
        if(E)C = D; else C = wialon.core.Session.getInstance().getServerTime() + D;
        return wialon.core.Remote.getInstance().remoteCall(o, {
          itemId : this.getId(),
          operate : F,
          stopTime : C
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(B)));
      },
      getStatistics : function(G){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(G));
      },
      updateConfig : function(I, H){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          config : I
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(H)));
      },
      updateUnits : function(J, K){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : this.getId(),
          units : J
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(K)));
      }
    },
    statics : {
      dataFlag : {
        state : 0x00000100,
        units : 0x00000200
      },
      accessFlag : {
        editSettings : 0x100000,
        editUnits : 0x200000
      },
      logMessageAction : {
        retranslatorCreated : l,
        retranslatorUpdated : v,
        retranslatorUnitsUpdated : q,
        retranslatorSwitched : n
      },
      registerProperties : function(){

        var L = wialon.core.Session.getInstance();
        L.registerConstructor(h, wialon.item.Retranslator);
        L.registerProperty(p, this.remoteUpdateOperating);
        L.registerProperty(r, this.remoteUpdateStopTime);
        L.registerProperty(i, this.remoteUpdateConfig);
        L.registerProperty(m, this.remoteUpdateUnits);
      },
      remoteUpdateOperating : function(M, N){

        M.setOperating(N ? true : false);
      },
      remoteUpdateStopTime : function(O, P){

        O.setStopTime(P);
      },
      remoteUpdateConfig : function(Q, R){

        Q.setConfig(R ? R : {
        });
      },
      remoteUpdateUnits : function(S, U){

        var T = S.getUnits() || [];
        if(T && wialon.util.Json.compareObjects(U, T))return;
        if(!U){

          U = [];
        };
        S.setUnits(U);
      },
      getRetranslatorTypes : function(V){

        return wialon.core.Remote.getInstance().remoteCall(t, {
        }, wialon.util.Helper.wrapCallback(V));
      }
    },
    events : {
      "changeOperating" : j,
      "changeStopTime" : j,
      "changeConfig" : j,
      "changeUnits" : j
    }
  });
})();
(function(){

  var a = "create_schedule",b = "update_route_points",c = "rpts",d = "route/get_schedule_time",e = "update_round",f = "Object",g = "update_route_cfg",h = "delete_round",i = "Array",j = "route/load_rounds",k = "update_schedule",l = "wialon.item.Route",m = "qx.event.type.Data",n = "delete_schedule",o = "create_route",p = "number",q = "route/get_all_rounds",r = "changeConfig",s = "changeCheckPoints",t = "route/update_checkpoints",u = "rcfg",v = "create_round",w = "route/update_config",z = "avl_route";
  qx.Class.define(l, {
    extend : wialon.item.Item,
    properties : {
      config : {
        init : null,
        check : f,
        nullable : true,
        event : r
      },
      checkPoints : {
        init : null,
        check : i,
        event : s
      }
    },
    members : {
      updateConfig : function(C, B){

        return wialon.core.Remote.getInstance().remoteCall(w, {
          itemId : this.getId(),
          config : C
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(B)));
      },
      getNextRoundTime : function(E, F, G, D){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          scheduleId : E,
          timeFrom : F,
          timeTo : G
        }, wialon.util.Helper.wrapCallback(D));
      },
      loadRoundsHistory : function(I, J, H, K){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          itemId : this.getId(),
          timeFrom : I,
          timeTo : J,
          fullJson : H
        }, wialon.util.Helper.wrapCallback(K));
      },
      updateCheckPoints : function(O, L){

        var N = wialon.core.Session.getInstance();
        var M = N.getCoordinatesTransformer();
        if(M){

          O = A({
            transform : M.reverse.bind(M),
            points : O
          });
        };
        return wialon.core.Remote.getInstance().remoteCall(t, {
          itemId : this.getId(),
          checkPoints : O
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(L)));
      },
      getRouteRounds : function(Q, R, P, S){

        return wialon.core.Remote.getInstance().remoteCall(q, {
          itemId : this.getId(),
          timeFrom : Q,
          timeTo : R,
          fullJson : P
        }, wialon.util.Helper.wrapCallback(S));
      }
    },
    statics : {
      dataFlag : {
        config : 0x00000100,
        checkPoints : 0x00000200,
        schedules : 0x00000400,
        rounds : 0x00000800
      },
      accessFlag : {
        editSettings : 0x100000
      },
      states : {
        stateInactive : 0x010000,
        stateFinshed : 0x020000,
        stateCheckingArrive : 0x040000,
        stateCheckingDeparture : 0x080000,
        stateTimeLate : 0x200000,
        stateTimeEarly : 0x400000,
        stateDisabled : 0x800000,
        stateAborted : 0x0100000,
        eventControlStarted : 0x1,
        eventControlFinished : 0x2,
        eventControlAborted : 0x4,
        eventPointArrived : 0x8,
        eventPointSkipped : 0x10,
        eventPointDepartured : 0x20,
        eventControlLate : 0x40,
        eventControlEarly : 0x80,
        eventControlInTime : 0x100
      },
      routePointFlag : {
        simple : 0x1,
        geozone : 0x2,
        unit : 0x4
      },
      scheduleFlag : {
        relative : 0x1,
        relativeDaily : 0x2,
        absolute : 0x4
      },
      roundFlag : {
        autoDelete : 0x2,
        allowSkipPoints : 0x10,
        generateEvents : 0x20,
        arbituaryPoints : 0x40
      },
      logMessageAction : {
        routeCreated : o,
        routeUpdatedPoints : b,
        routeUpdatedConfiguration : g,
        routeCreatedRound : v,
        routeUpdatedRound : e,
        routeDeletedRound : h,
        routeCreatedSchedule : a,
        routeUpdatedSchedule : k,
        routeDeletedSchedule : n
      },
      registerProperties : function(){

        var T = wialon.core.Session.getInstance();
        T.registerConstructor(z, wialon.item.Route);
        T.registerProperty(c, this.remoteUpdateCheckPoints);
        T.registerProperty(u, this.remoteUpdateConfig);
      },
      remoteUpdateCheckPoints : function(U, X){

        var W = wialon.core.Session.getInstance();
        var V = W.getCoordinatesTransformer();
        if(V){

          X = A({
            transform : V.direct.bind(V),
            points : X
          });
        };
        U.setCheckPoints(X);
      },
      remoteUpdateConfig : function(Y, ba){

        Y.setConfig(ba);
      }
    },
    events : {
      "changeCheckPoints" : m,
      "changeConfig" : m
    }
  });
  function A(bc){

    var bd = bc.transform;
    var bb = bc.points;
    return bb.map(function(be){

      if(!be)return be;
      var x = be.x;
      var y = be.y;
      if(typeof y !== p || typeof x !== p){

        return be;
      };
      var bg = bd({
        x : x,
        y : y
      });
      if(bg.x === x && bg.y === y){

        return be;
      };
      var bf = Object.assign({
      }, be);
      bf.x = bg.x;
      bf.y = bg.y;
      return bf;
    });
  };
})();
(function(){

  var a = "render/create_poi_layer",b = "function",c = ".png",d = "report",e = "wialon.render.Renderer",f = "__fz",g = "render/remove_all_layers",h = "Integer",j = "Object",k = "__fs",l = "qx.event.type.Event",m = "render/create_messages_layer",n = "/",o = "resource/create_zone_by_track",p = "render/remove_layer",q = "",r = "number",s = "_",t = "/avl_hittest_pos",u = "qx.strict",v = "render/set_locale",w = 'number',A = "/adfurl",B = "render/enable_layer",C = "changeVersion",D = "render/create_zones_layer",E = "/avl_render/",F = "undefined",G = "object";
  qx.Class.define(e, {
    extend : qx.core.Object,
    construct : function H(){

      if(qx.core.Environment.get(u)){

        this.callee(H, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this.__fs = new Array;
    },
    properties : {
      version : {
        init : 0,
        check : h,
        event : C
      },
      reportResult : {
        init : null,
        check : j,
        nullable : true,
        apply : f
      }
    },
    members : {
      __fs : null,
      __ft : Date.now(),
      getLayers : function(){

        return this.__fs;
      },
      getReportLayer : function(){

        for(var i = 0;i < this.__fs.length;i++)if(this.__fs[i].getName().substr(0, 6) == d)return this.__fs[i];;
        return null;
      },
      getTileUrl : function(x, y, z){

        return wialon.core.Session.getInstance().getBaseUrl() + A + this.__ft + s + this.getVersion() + E + x + s + y + s + (17 - z) + n + wialon.core.Session.getInstance().getId() + c;
      },
      setLocale : function(N, I, J, K){

        var L = 0;
        var M = q;
        if(J && typeof J == b){

          K = J;
        } else if(J && typeof J == r){

          L = J;
        } else if(J && typeof J == G){

          L = J.flags;
          M = J.formatDate;
        };;
        return wialon.core.Remote.getInstance().remoteCall(v, {
          tzOffset : N,
          language : I,
          flags : L,
          formatDate : M
        }, wialon.util.Helper.wrapCallback(K));
      },
      createMessagesLayer : function(P, O){

        return wialon.core.Remote.getInstance().remoteCall(m, P, qx.lang.Function.bind(this.__fu, this, wialon.util.Helper.wrapCallback(O)));
      },
      createPoiLayer : function(R, S, T, Q){

        for(var i = this.__fs.length - 1;i >= 0;i--){

          if(this.__fs[i].getName() == R){

            this.__fs[i].dispose();
            qx.lang.Array.remove(this.__fs, this.__fs[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(a, {
          layerName : R,
          pois : S,
          flags : T
        }, qx.lang.Function.bind(this.__fv, this, wialon.util.Helper.wrapCallback(Q)));
      },
      createZonesLayer : function(V, U, W, X){

        for(var i = this.__fs.length - 1;i >= 0;i--){

          if(this.__fs[i].getName() == V){

            this.__fs[i].dispose();
            qx.lang.Array.remove(this.__fs, this.__fs[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(D, {
          layerName : V,
          zones : U,
          flags : W
        }, qx.lang.Function.bind(this.__fv, this, wialon.util.Helper.wrapCallback(X)));
      },
      removeLayer : function(ba, Y){

        return wialon.core.Remote.getInstance().remoteCall(p, {
          layerName : ba.getName()
        }, qx.lang.Function.bind(this.__fw, this, wialon.util.Helper.wrapCallback(Y), ba));
      },
      enableLayer : function(bc, bd, bb){

        return wialon.core.Remote.getInstance().remoteCall(B, {
          layerName : bc.getName(),
          enable : bd ? 1 : 0
        }, qx.lang.Function.bind(this.__fy, this, wialon.util.Helper.wrapCallback(bb), bc));
      },
      removeAllLayers : function(be){

        return wialon.core.Remote.getInstance().remoteCall(g, {
        }, qx.lang.Function.bind(this.__fx, this, wialon.util.Helper.wrapCallback(be)));
      },
      hitTest : function(bk, bg, bf, bj, bm, bl, bi){

        var bn = 0;
        if(typeof bl == b)bi = bl; else if(typeof bl == r)bn = bl;;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseUrl() + t, {
          sid : wialon.core.Session.getInstance().getId(),
          lat : bk,
          flags : bn,
          lon : bg,
          scale : bf,
          radius : bj,
          layerName : q + bm
        }, wialon.util.Helper.wrapCallback(bh), 60);
        function bh(bs, br){

          var bq = wialon.core.Session.getInstance();
          var bp = bq.getCoordinatesTransformer();
          if(bp && !bs && br){

            if(br.currMsg){

              bo(br.currMsg);
            };
            if(br.prevMsg){

              bo(br.prevMsg);
            };
          };
          return bi.apply(this, arguments);
          function bo(bt){

            var bv = bt && bt.pos;
            var bu = bv && (typeof bv.x === w) && (typeof bv.y === w);
            if(bu){

              bt.pos = bp.direct(bv);
            };
          };
        };
      },
      createZoneByTrack : function(bx, bw){

        return wialon.core.Remote.getInstance().remoteCall(o, bx, wialon.util.Helper.wrapCallback(bw));
      },
      __fu : function(by, bA, bB){

        var bz = null;
        if(bA == 0 && bB){

          if(typeof bB.name != F){

            bz = new wialon.render.MessagesLayer(bB);
            this.__fs.push(bz);
          };
          this.setVersion(this.getVersion() + 1);
        };
        by(bA, bz);
      },
      __fv : function(bC, bE, bF){

        var bD = null;
        if(bE == 0 && bF){

          if(typeof bF.name != F){

            bD = new wialon.render.Layer(bF);
            this.__fs.push(bD);
          };
          this.setVersion(this.getVersion() + 1);
        };
        bC(bE, bD);
      },
      __fw : function(bG, bH, bI, bJ){

        if(bI){

          bG(bI);
          return;
        };
        qx.lang.Array.remove(this.__fs, bH);
        bH.dispose();
        this.setVersion(this.getVersion() + 1);
        bG(bI);
      },
      __fx : function(bK, bL, bM){

        if(bL){

          bK(bL);
          return;
        };
        if(this.__fs.length){

          for(var i = 0;i < this.__fs.length;i++)this.__fs[i].dispose();
          qx.lang.Array.removeAll(this.__fs);
          this.setVersion(this.getVersion() + 1);
        };
        bK(bL);
      },
      __fy : function(bN, bO, bP, bR){

        if(bP){

          bN(bP);
          return;
        };
        var bQ = bR.enabled ? true : false;
        if(bQ != bO.getEnabled()){

          bO.setEnabled(bQ);
          this.setVersion(this.getVersion() + 1);
        };
        bN(bP);
      },
      __fz : function(bS){

        var bT = false;
        for(var i = 0;i < this.__fs.length;i++)if(this.__fs[i].getName().substr(0, 6) == d){

          this.__fs.splice(i, 1);
          bT = true;
          break;
        };
        if(bS){

          var bV = bS.getLayerData();
          if(bV){

            var bU = bV.units ? new wialon.render.MessagesLayer(bV) : new wialon.render.Layer(bV);
            this.__fs.push(bU);
            bS.setLayer(bU);
            bT = true;
          };
        };
        if(bT)this.setVersion(this.getVersion() + 1);
      }
    },
    statics : {
      PoiFlag : {
        renderLabels : 0x01,
        enableGroups : 0x02
      },
      Hittest : {
        full : 0x01,
        markersLayer : 0x10,
        msgsLayer : 0x20,
        shapesLayer : 0x40
      },
      ZonesFlag : {
        renderLabels : 0x01
      },
      MarkerFlag : {
        grouping : 0x0001,
        numbering : 0x0002,
        events : 0x0004,
        fillings : 0x0008,
        charging : 0x4000,
        images : 0x0010,
        parkings : 0x0020,
        speedings : 0x0040,
        stops : 0x0080,
        thefts : 0x0100,
        usUnits : 0x0200,
        imUnits : 0x0400,
        videos : 0x0800,
        latUnits : 0x1000,
        intervals : 0x2000
      },
      OptionalFlag : {
        usMetrics : 0x01,
        imMetrics : 0x02,
        latMetrics : 0x03,
        skipBlankTiles : 0x100,
        zoomGoogle : 0x200,
        gcjCoordinates : 0x400
      }
    },
    destruct : function(){

      this._disposeArray(k);
    },
    events : {
      "changeVersion" : l
    }
  });
})();
(function(){

  var a = "wialon.render.Layer",b = "Boolean",c = "qx.strict";
  qx.Class.define(a, {
    extend : qx.core.Object,
    construct : function d(e){

      if(qx.core.Environment.get(c)){

        this.callee(d, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this._data = e;
    },
    properties : {
      enabled : {
        init : true,
        check : b
      }
    },
    members : {
      _data : null,
      getName : function(){

        return this._data.name;
      },
      getBounds : function(){

        return this._data.bounds;
      }
    }
  });
})();
(function(){

  var a = "&msgIndex=",b = "/adfurl",c = "/avl_hittest_time",d = "",e = "number",f = "&layerName=",g = "&unitIndex=",h = "/avl_msg_photo.jpeg?sid=",i = "wialon.render.MessagesLayer",j = "render/delete_message",k = "render/get_messages",l = "object";
  qx.Class.define(i, {
    extend : wialon.render.Layer,
    members : {
      getUnitsCount : function(){

        return this._data.units ? this._data.units.length : 0;
      },
      getUnitId : function(m){

        if(typeof m != e)return this._data.units[0].id;
        return this._data.units[m >= 0 ? m : 0].id;
      },
      getMaxSpeed : function(n){

        if(typeof n != e)return this._data.units[0].max_speed;
        return this._data.units[n >= 0 ? n : 0].max_speed;
      },
      getMileage : function(o){

        if(typeof o != e)return this._data.units[0].mileage;
        return this._data.units[o >= 0 ? o : 0].mileage;
      },
      getMessagesCount : function(p){

        if(typeof p != e)return this._data.units[0].msgs.count;
        return this._data.units[p >= 0 ? p : 0].msgs.count;
      },
      getFirstPoint : function(q){

        if(typeof q != e)return this._data.units[0].msgs.first;
        return this._data.units[q >= 0 ? q : 0].msgs.first;
      },
      getLastPoint : function(r){

        if(typeof r != e)return this._data.units[0].msgs.last;
        return this._data.units[r >= 0 ? r : 0].msgs.last;
      },
      getMessageImageUrl : function(u, s, t){

        if(!t)t = d;
        return wialon.core.Session.getInstance().getBaseUrl() + b + t + h + wialon.core.Session.getInstance().getId() + f + this.getName() + g + u + a + s;
      },
      getMessages : function(x, w){

        var v = {
        };
        if(x && typeof x == l){

          v = x;
        } else if(arguments.length > 2){

          v.unitIndex = arguments[0];
          v.indexFrom = arguments[1];
          v.indexTo = arguments[2];
          w = arguments[3];
        };
        return wialon.core.Remote.getInstance().remoteCall(k, {
          indexFrom : v.indexFrom,
          indexTo : v.indexTo,
          calcSensors : v.calcSensors,
          layerName : this.getName(),
          unitId : this.getUnitId(v.unitIndex)
        }, wialon.core.MessagesLoader.wrapGetMessagesCallback(w));
      },
      deleteMessage : function(A, z, y){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          layerName : this.getName(),
          msgIndex : z,
          unitId : this.getUnitId(A)
        }, wialon.util.Helper.wrapCallback(y));
      },
      hitTest : function(D, B){

        var C = {
        };
        if(D && typeof D == l){

          C = D;
        } else if(arguments.length > 2){

          C.unitId = arguments[0];
          C.time = arguments[1];
          C.revert = arguments[2];
          B = arguments[arguments.length - 1];
        };
        C.sid = wialon.core.Session.getInstance().getId();
        C.layerName = this.getName();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseUrl() + c, {
          sid : C.sid,
          layerName : C.layerName,
          unitId : C.unitId,
          time : C.time,
          revert : C.revert,
          anyMsg : C.anyMsg
        }, wialon.util.Helper.wrapCallback(B), 60);
      }
    },
    statics : {
    }
  });
})();
(function(){

  var a = "messages/get_packed_messages",b = "messages/delete_message",c = "messages/load_interval",d = "&svc=messages/get_message_file&params=",e = "wialon.core.MessagesLoader",f = "messages/load_last",g = "messages/unload",h = 'number',i = "messages/get_messages",j = "?sid=";
  qx.Class.define(e, {
    extend : qx.core.Object,
    members : {
      loadInterval : function(k, l, n, p, m, q, o){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : k,
          timeFrom : l,
          timeTo : n,
          flags : p,
          flagsMask : m,
          loadCount : q
        }, wialon.util.Helper.wrapCallback(o));
      },
      loadLast : function(r, x, t, v, s, w, u){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : r,
          lastTime : x,
          lastCount : t,
          flags : v,
          flagsMask : s,
          loadCount : w
        }, wialon.util.Helper.wrapCallback(u));
      },
      unload : function(y){

        return wialon.core.Remote.getInstance().remoteCall(g, {
        }, wialon.util.Helper.wrapCallback(y));
      },
      getMessages : function(B, z, A){

        return wialon.core.Remote.getInstance().remoteCall(i, {
          indexFrom : B,
          indexTo : z
        }, wialon.core.MessagesLoader.wrapGetMessagesCallback(A));
      },
      getMessageFile : function(D, E){

        var C = wialon.core.Session.getInstance();
        return C.getBaseUrl() + C.getApiPath() + j + C.getId() + d + encodeURIComponent(wialon.util.Json.stringify({
          msgIndex : D,
          fileName : E
        }));
      },
      deleteMessage : function(G, F){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          msgIndex : G
        }, wialon.util.Helper.wrapCallback(F));
      },
      getPackedMessages : function(H, J, L, K, I){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : H,
          timeFrom : J,
          timeTo : L,
          filtrationFlags : K
        }, wialon.util.Helper.wrapCallback(I));
      }
    },
    statics : {
      packedFiltration : {
        sats : 0x00000001
      },
      wrapGetMessagesCallback : function(M){

        return function(Q, P){

          var O = wialon.core.Session.getInstance();
          var N = O.getCoordinatesTransformer();
          if(N && !Q && Array.isArray(P)){

            P = P.map(function(R){

              var T = R && R.pos;
              var S = T && (typeof T.x === h) && (typeof T.y === h);
              if(S){

                R.pos = N.direct(T);
              };
              return R;
            });
          };
          return M.apply(this, arguments);
        };
      }
    }
  });
})();
(function(){

  var a = "function",b = 'Sensors',c = "create",d = "set",f = ';',g = '',h = 'object',j = "delete",k = "remoteCreate",l = "string",m = "static",n = "Object",o = 'monitoring_sensor',p = 'function',q = "reset_image",r = "Driver",s = "get",t = "modify",u = "number",v = "qx.event.type.Data",w = "ProfileField",y = "Poi",z = "u",A = "wialon.item.PluginsManager",B = "s",C = "Tag",D = "Data",E = "update",F = "wialon.item.M",G = "remoteUpdate",H = 'monitoring_sensor_id',I = "Zone",J = "Trailer",K = "resetImage",L = 'string',M = "mixinDef = wialon.item.M",N = "undefined",O = "object";
  qx.Class.define(A, {
    type : m,
    statics : {
      bindPropItem : function(clazz, propName, itemName, ajaxPath, extAjaxPath){

        var options;
        var preProcessPropObj;
        var preProcessUpdateCallObj;
        if(typeof propName === h && propName){

          options = propName;
          propName = options.propName;
          itemName = options.itemName;
          ajaxPath = options.ajaxPath;
          extAjaxPath = options.extAjaxPath;
          preProcessPropObj = options.preProcessPropObj;
          preProcessUpdateCallObj = options.preProcessUpdateCallObj;
        };
        var itemNameUCase = itemName.substr(0, 1).toUpperCase() + itemName.substr(1);
        var multName = itemNameUCase + B;
        var mixinBody = {
          members : {
          },
          properties : {
          },
          statics : {
          },
          events : {
          }
        };
        mixinBody.events[E + itemNameUCase] = v;
        mixinBody.properties[itemName + B] = {
          init : null,
          check : n
        };
        mixinBody.members[s + itemNameUCase] = function(R){

          var Q = this[s + multName]();
          if(!Q)return null;
          var P = Q[R];
          if(typeof P == N)return null;
          return P;
        };
        mixinBody.members[t + multName] = function(X, S, ba){

          var V = wialon.core.Session.getInstance().getItem(this.getId()) || this;
          var T = V[s + multName]();
          var U = false;
          if(X && typeof X == O){

            U = X.skipFlag;
            X = wialon.util.Helper.wrapCallback(X.callback);
          } else {

            X = wialon.util.Helper.wrapCallback(X);
          };
          var Y = null;
          if(S == 0 && T && ba instanceof Array && ba.length == 2){

            var bc = ba[0];
            Y = ba[1];
            var bb = T[bc];
            if(preProcessPropObj){

              Y = preProcessPropObj(Y);
            };
            var W = getMonitoringSensorColorTable(V);
            if(Y && W && W.sensorId === parseInt(bc, 10)){

              fixSensorColorTable(Y, W.ci);
            };
            if(typeof bb == N)bb = null;
            if(Y != null)T[bc] = Y; else if(bb && !U)delete T[bc];;
            if(!U && wialon.util.Json.stringify(Y) != wialon.util.Json.stringify(bb))V.fireDataEvent(E + itemNameUCase, Y, bb);
          };
          X(S, Y, {
            result : ba
          });
        };
        if(ajaxPath && ajaxPath.length){

          if(itemNameUCase == w){

            mixinBody.members[E + itemNameUCase] = function(name, be, bd){

              bd = wialon.util.Helper.wrapCallback(bd);
              return wialon.core.Remote.getInstance().remoteCall(ajaxPath, {
                itemId : this.getId(),
                n : name,
                v : be
              }, qx.lang.Function.bind(this[t + multName], this, bd));
            };
          } else {

            mixinBody.members[c + itemNameUCase] = function(bh, bf, bg){

              bf = wialon.util.Helper.wrapCallback(bf);
              if(bh){

                bh = qx.lang.Object.clone(bh);
                bh.itemId = this.getId();
                bh.id = 0;
                bh.callMode = c;
              };
              if(bh && preProcessUpdateCallObj){

                bh = preProcessUpdateCallObj(bh);
              };
              if(bg)wialon.core.Uploader.getInstance().uploadFiles([bg], ajaxPath, bh, qx.lang.Function.bind(this[t + multName], this, bf), true); else return wialon.core.Remote.getInstance().remoteCall(ajaxPath, bh, qx.lang.Function.bind(this[t + multName], this, bf));
            };
            mixinBody.members[E + itemNameUCase] = function(bl, bj, bi, bk){

              bj = wialon.util.Helper.wrapCallback(bj);
              if(bl){

                bl = qx.lang.Object.clone(bl);
                bl.itemId = this.getId();
                bl.callMode = typeof bi == l ? bi : E;
              };
              if(bl && preProcessUpdateCallObj){

                bl = preProcessUpdateCallObj(bl);
              };
              if(bk)wialon.core.Uploader.getInstance().uploadFiles([bk], ajaxPath, bl, qx.lang.Function.bind(this[t + multName], this, bj), true, 60); else return wialon.core.Remote.getInstance().remoteCall(ajaxPath, bl, qx.lang.Function.bind(this[t + multName], this, bj));
            };
            mixinBody.members[j + itemNameUCase] = function(bo, bm, bn){

              if(typeof bn == N)bn = false;
              bm = wialon.util.Helper.wrapCallback(bm);
              return wialon.core.Remote.getInstance().remoteCall(ajaxPath, {
                itemId : this.getId(),
                id : bo,
                callMode : j
              }, qx.lang.Function.bind(this[t + multName], this, {
                callback : bm,
                skipFlag : bn
              }));
            };
            if(itemNameUCase == r || itemNameUCase == J || itemNameUCase == y || itemNameUCase == I || itemNameUCase == C){

              mixinBody.members[K + itemNameUCase] = function(br, bp, bq){

                if(typeof bq == N)bq = false;
                bp = wialon.util.Helper.wrapCallback(bp);
                return wialon.core.Remote.getInstance().remoteCall(ajaxPath, {
                  itemId : this.getId(),
                  id : br,
                  callMode : q
                }, qx.lang.Function.bind(this[t + multName], this, {
                  callback : bp,
                  skipFlag : bq
                }));
              };
            };
          };
        };
        if(extAjaxPath && extAjaxPath.length){

          mixinBody.members[s + multName + D] = function(bw, bv, bu){

            if(bv && typeof bv == a){

              bu = bv;
              bv = 0;
            };
            bu = wialon.util.Helper.wrapCallback(bu);
            var bt = {
              itemId : this.getId()
            };
            if(bw && (typeof bw.length === u)){

              bt.col = [];
              for(var i = 0;i < bw.length;i++){

                if(typeof bw[i].id == N)bt.col.push(bw[i]); else bt.col.push(bw[i].id);
              };
            };
            bt.flags = bv;
            if(preProcessPropObj){

              var bs = bu;
              bu = function(by, bx){

                if(by || !Array.isArray(bx)){

                  return bs.apply(this, arguments);
                };
                bx = bx.map(function(x){

                  return preProcessPropObj(x);
                });
                return bs.call(this, by, bx);
              };
            };
            return wialon.core.Remote.getInstance().remoteCall(extAjaxPath, bt, bu);
          };
        };
        mixinBody.statics[k + itemNameUCase] = function(bA, bz){

          var bB = getMonitoringSensorColorTable(bA);
          if(bB && bz && bz[bB.sensorId]){

            var bE = bz[bB.sensorId];
            fixSensorColorTable(bE, bB.ci);
          };
          if(preProcessPropObj){

            var bC = {
            };
            for(var bD in bz)if(Object.prototype.hasOwnProperty.call(bz, bD)){

              bC[bD] = preProcessPropObj(bz[bD]);
            };
            bz = bC;
          };
          bA[d + multName](bz);
        };
        mixinBody.statics[G + itemNameUCase] = function(bF, bG){

          bF[t + multName](null, 0, bG);
        };
        var session = wialon.core.Session.getInstance();
        session.registerProperty(propName, qx.lang.Function.bind(mixinBody.statics[k + itemNameUCase], mixinBody));
        session.registerProperty(propName + z, qx.lang.Function.bind(mixinBody.statics[G + itemNameUCase], mixinBody));
        var mixinDef = null;
        eval(M + multName);
        if(qx.Class.hasMixin(clazz, mixinDef))return;
        var propMixin = qx.Mixin.define(F + multName, mixinBody);
        qx.Class.include(clazz, propMixin);
        function getMonitoringSensorColorTable(bK){

          if(multName !== b)return null;
          if(!bK || (typeof bK.getType !== p) || (typeof bK.getCustomProperty !== p))return null;
          var bM = parseInt(bK.getCustomProperty(H), 10);
          if(!bM || !isFinite(bM))return null;
          var bL = bK.getCustomProperty(o);
          if(!bL || (typeof bL !== L))return null;
          var bH = bL.split(f);
          var bJ = {
          };
          var bN = true;
          var bI = bH.every(function(bS){

            var bQ = /^(\d+(?:\.\d+)?|-?Infinity)\s+([0-9a-fA-F]{6,8})(?:\s+(.*?))?\s*$/.exec(bS);
            if(!bQ)return false;
            var bR = parseFloat(bQ[1]);
            if(isNaN(bR))return false;
            var bO = bQ[2];
            if(bO.length === 6){

              bO = parseInt(bO, 16);
            } else if(bO.length === 8){

              bO = parseInt(bO.slice(2), 16);
            };
            if(!isFinite(bO))return false;
            var bP = bQ[3] || g;
            bJ[bR] = {
              c : bO,
              t : bP
            };
            bN = false;
            return true;
          });
          if(!bI)return null;
          if(bN)return null;
          return {
            sensorId : bM,
            ci : bJ
          };
        };
        function fixSensorColorTable(bU, bV){

          if(!bU)return;
          var bT;
          try{

            bT = JSON.parse(bU.c);
          } catch(e) {

            bT = {
            };
          };
          if(typeof bT !== h)bT = {
          };
          if(!bT.ci || bW(bT.ci)){

            bT.ci = bV;
            bU.c = JSON.stringify(bT);
          };
          function bW(bX){

            for(var bY in bX)if(Object.prototype.hasOwnProperty.call(bX, bY)){

              return false;
            };
            return true;
          };
        };
      }
    }
  });
})();
(function(){

  var a = "const0",b = "regtime",c = "sats",d = "lon",f = '_',g = "speed",h = "string",j = 'tag',k = '',l = '^',m = "d",n = ']',o = "-0123456789ABCDEFabcdefx",p = "altitude",q = '(',r = ":",s = ':',t = '*',u = '.',v = "time",w = "lat",x = 'trailer',y = '|',z = "",A = "-0123456789",B = "number",C = ')',D = "n",E = "const",F = "wialon.item.MUnitSensor",G = ' ',H = "unit/calc_last_message",I = 'driver',J = "course",K = '#',L = '/',M = '-',N = "unit/calc_sensors",O = '[',P = "-01234567",Q = "undefined",R = '+';
  qx.Mixin.define(F, {
    members : {
      calculateSensorValue : function(S, T, U){

        if(!S)return wialon.item.MUnitSensor.invalidValue;
        if(typeof T == Q || !T)T = null;
        if(typeof U == Q || !U)U = null;
        return this.__fB(S, T, U, null);
      },
      remoteCalculateLastMessage : function(W, V){

        if(!W || !(W instanceof Array))W = [];
        return wialon.core.Remote.getInstance().remoteCall(H, {
          sensors : W,
          unitId : this.getId()
        }, wialon.util.Helper.wrapCallback(V));
      },
      remoteCalculateMsgs : function(bc, bb, X, ba, Y){

        return wialon.core.Remote.getInstance().remoteCall(N, {
          source : bc,
          unitId : this.getId(),
          indexFrom : bb,
          indexTo : X,
          sensorId : ba
        }, wialon.util.Helper.wrapCallback(Y));
      },
      remoteCalculateFilteredMsgs : function(bf, be, bd, bh, bi, bg){

        return wialon.core.Remote.getInstance().remoteCall(N, {
          source : bf,
          unitId : this.getId(),
          indexFrom : be,
          indexTo : bd,
          sensorId : bh,
          width : bi
        }, wialon.util.Helper.wrapCallback(bg));
      },
      getValue : function(bj, bk){

        if(!bj)return wialon.item.MUnitSensor.invalidValue;
        return this.__fC(bj.p, bk, bj);
      },
      __fA : {
      },
      __fB : function(bw, bx, bm, bu){

        if(!bw)return wialon.item.MUnitSensor.invalidValue;
        var bp = false;
        var bt = bw.id;
        if(bu){

          if(bu[bt])return wialon.item.MUnitSensor.invalidValue;
        } else {

          bu = new Object;
          bp = true;
        };
        bu[bt] = 1;
        var bo = this.__fE(bw, bx, bm, bu);
        var bn = typeof bo === h;
        var self = this;
        var br = [I, x, j].includes(bw.t);
        if(wialon.util.Sensors.isAvailable && br && bn){

          return wialon.util.Sensors.calculate(bw.p, function(bz){

            var bB = bz.expression;
            if(!bz.math){

              var bA = Object.assign({
              }, bw, {
                p : bz.expression
              });
              bB = self.__fE(bA, bx, bm, bu);
            };
            if(bB === null){

              return wialon.item.MUnitSensor.invalidValue;
            };
            return String(bB) === String(wialon.item.MUnitSensor.invalidValue) && bw.p !== bz.expression && !bz.isSensorParam ? bz.expression : bB;
          });
        };
        var bs;
        var bv = br;
        var bl = [wialon.item.MUnitSensor.validation.noneZero, wialon.item.MUnitSensor.validation.replaceOnError].includes(bw.vt);
        if(bn && !bl){

          if(!bv){

            try{

              bs = wialon.util.Json.parse(bw.c);
            } catch(e) {
            };
            bv = bs && !!bs.text_params;
          };
          if(bv){

            return bo;
          } else {

            return wialon.item.MUnitSensor.invalidValue;
          };
        };
        if(bo != wialon.item.MUnitSensor.invalidValue && !bn)bo = this.__fD(bw, bo, bs);
        if(bw.vs && bw.vt){

          var bq = this.getSensor(bw.vs);
          if(!bq){

            delete bu[bt];
            return wialon.item.MUnitSensor.invalidValue;
          };
          var by = this.__fB(bq, bx, bm, bu);
          if(bo != wialon.item.MUnitSensor.invalidValue && by != wialon.item.MUnitSensor.invalidValue){

            if(bw.vt == wialon.item.MUnitSensor.validation.logicalAnd){

              if(bo && by)bo = 1; else bo = 0;
            } else if(bw.vt == wialon.item.MUnitSensor.validation.noneZero){

              if(!by){

                delete bu[bt];
                bo = wialon.item.MUnitSensor.invalidValue;
              };
            } else if(bw.vt == wialon.item.MUnitSensor.validation.mathAnd){

              bo = Math.ceil(by) & Math.ceil(bo);
            } else if(bw.vt == wialon.item.MUnitSensor.validation.logicalOr){

              if(bo || by)bo = 1;
            } else if(bw.vt == wialon.item.MUnitSensor.validation.mathOr){

              bo = Math.ceil(by) | Math.ceil(bo);
            } else if(bw.vt == wialon.item.MUnitSensor.validation.summarize)bo += by; else if(bw.vt == wialon.item.MUnitSensor.validation.subtructValidator)bo -= by; else if(bw.vt == wialon.item.MUnitSensor.validation.subtructValue)bo = by - bo; else if(bw.vt == wialon.item.MUnitSensor.validation.multiply)bo *= by; else if(bw.vt == wialon.item.MUnitSensor.validation.divideValidator){

              if(by)bo /= by; else bo = wialon.item.MUnitSensor.invalidValue;
            } else if(bw.vt == wialon.item.MUnitSensor.validation.divideValue){

              if(bo)bo = by / bo; else bo = wialon.item.MUnitSensor.invalidValue;
            };;;;;;;;;;
          } else if(bw.vt == wialon.item.MUnitSensor.validation.replaceOnError){

            if(bo == wialon.item.MUnitSensor.invalidValue)bo = by;
          } else bo = wialon.item.MUnitSensor.invalidValue;;
        };
        delete bu[bt];
        return bo;
      },
      __fC : function(bJ, bT, bH){

        if(!bT)return wialon.item.MUnitSensor.invalidValue;
        var bG = wialon.item.MUnitSensor.invalidValue;
        var bM = bT.p;
        var bD = bJ.split(r);
        bJ = bD[0];
        var bI = 0;
        if(bM && typeof bM[bD[0]] != Q){

          bG = bM[bD[0]];
          if(typeof bG == h){

            var bO = A;
            var bL = 10;
            if(typeof bD[1] != Q){

              if(bD[1] == 8){

                bO = P;
                bL = bD[1];
              } else if(bD[1] == 16){

                bO = o;
                bL = bD[1];
              };
              if(wialon.util.String.strspn(bG, bO) == bG.length){

                if(bO.length - 1 !== 10 || BigInt(Number.MAX_SAFE_INTEGER) >= BigInt(bG)){

                  bG = parseInt(bG, bL);
                  bD = [];
                };
              } else {

                bG = wialon.item.MUnitSensor.invalidValue;
              };
            };
          };
        } else if(bD[1] == m){

          bI = 1;
        };
        var bK = bT.pos;
        if(bG == wialon.item.MUnitSensor.invalidValue){

          if(bJ == g){

            if(!bK || (bK && bK._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bG = bT.pos.s;
          } else if(bJ == c){

            if(!bK || (bK && bK._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bG = bT.pos.sc;
          } else if(bJ == p){

            if(!bK || (bK && bK._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bG = bT.pos.z;
          } else if(bJ == J){

            if(!bK || (bK && bK._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bG = bT.pos.c;
          } else if(bJ == w){

            if(!bK || (bK && bK._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bG = bT.pos.y;
          } else if(bJ == d){

            if(!bK || (bK && bK._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bG = bT.pos.x;
          } else if(/^in\d{0,2}$/.test(bJ)){

            if(!(bT.f & 0x2))return wialon.item.MUnitSensor.invalidValue;
            var bE = parseInt(bJ.substr(2), 10);
            if(isNaN(bE) || bE < 1 || bE > 32)return bT.i;
            var bR = 1 << (bE - 1);
            bG = (bT.i & bR) ? 1 : 0;
          } else if(/^out\d{0,2}$/.test(bJ)){

            if(!(bT.f & 0x4))return wialon.item.MUnitSensor.invalidValue;
            var bE = parseInt(bJ.substr(3), 10);
            if(isNaN(bE) || bE < 1 || bE > 32)return bT.o;
            var bR = 1 << (bE - 1);
            bG = (bT.o & bR) ? 1 : 0;
          } else if(/^const-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(bJ)){

            bG = parseFloat(bJ.substr(5));
          } else if(bJ === v){

            bG = bT.t;
          } else if(bJ === b){

            if(typeof bT.rt === B){

              bG = bT.rt;
            };
          };;;;;;;;;;
        };
        if(bI == 1 && bG != wialon.item.MUnitSensor.invalidValue){

          var bS = new Date(bG * 1000);
          var bF = Date.UTC(bS.getFullYear(), 0, 0);
          var bQ = bS.getTime() - bF;
          var bC = 1000 * 60 * 60 * 24;
          bG = Math.floor(bQ / bC);
        } else if(bD.length > 1 && bG != wialon.item.MUnitSensor.invalidValue){

          var bP = parseInt(bD[1], 10) - 1;
          if(bP < 0){

            return bG;
          };
          var bN;
          try{

            bN = BigInt(bG) & (BigInt(1) << BigInt(bP));
          } catch(e) {

            console.warn(e);
          };
          bG = bN ? 1 : 0;
        };
        return bG;
      },
      __fD : function(ca, bW, bX){

        if(!ca || isNaN(bW))return wialon.item.MUnitSensor.invalidValue;
        var bY = wialon.item.MUnitSensor.invalidValue;
        var bV = wialon.item.MUnitSensor.invalidValue;
        if(!bX){

          try{

            bX = wialon.util.Json.parse(ca.c);
          } catch(e) {
          };
        };
        if(bX && typeof bX.lower_bound == B)bY = bX.lower_bound;
        if(bX && typeof bX.upper_bound == B)bV = bX.upper_bound;
        if(bY != wialon.item.MUnitSensor.invalidValue && bV != wialon.item.MUnitSensor.invalidValue && bV <= bY){

          bY = wialon.item.MUnitSensor.invalidValue;
          bV = wialon.item.MUnitSensor.invalidValue;
        };
        if(!(ca.f & wialon.item.MUnitSensor.flags.boundsAfterCalc) && ((bY != wialon.item.MUnitSensor.invalidValue && bW < bY) || (bV != wialon.item.MUnitSensor.invalidValue && bW >= bV)))return wialon.item.MUnitSensor.invalidValue;
        var bU = bW;
        for(var i = 0;i < ca.tbl.length;i++){

          if(i != 0 && ca.tbl[i].x > bW)break;
          bU = parseFloat(ca.tbl[i].a) * parseFloat(bW) + parseFloat(ca.tbl[i].b);
        };
        if((ca.f & wialon.item.MUnitSensor.flags.boundsAfterCalc) && ((bY != wialon.item.MUnitSensor.invalidValue && bU < bY) || (bV != wialon.item.MUnitSensor.invalidValue && bU >= bV)))return wialon.item.MUnitSensor.invalidValue;
        return bU;
      },
      __fE : function(cg, ci, ce, cf){

        if(!cg || typeof cg.p != h || !cg.p.length)return wialon.item.MUnitSensor.invalidValue;
        var cd = this.__fA[cg.p];
        if(typeof cd == Q){

          cd = this.__fF(cg.p);
          if(!cd.length)return wialon.item.MUnitSensor.invalidValue;
          this.__fA[cg.p] = cd;
        };
        var ch = [];
        var cb = 0;
        for(var i = 0;i < cd.length;i++){

          var cc = cd[i];
          var cj = ch.length;
          if(cc[0] == t && cj > 1){

            if((wialon.item.MUnitSensor.invalidValue == ch[cj - 2]) || (wialon.item.MUnitSensor.invalidValue == ch[cj - 1]))ch[cj - 2] = wialon.item.MUnitSensor.invalidValue; else ch[cj - 2] = ch[cj - 2] * ch[cj - 1];
            ch.pop();
          } else if(cc[0] == L && cj > 1){

            if((wialon.item.MUnitSensor.invalidValue == ch[cj - 2]) || (wialon.item.MUnitSensor.invalidValue == ch[cj - 1]) || (ch[cj - 1] == 0))ch[cj - 2] = wialon.item.MUnitSensor.invalidValue; else ch[cj - 2] = ch[cj - 2] / ch[cj - 1];
            ch.pop();
          } else if(cc[0] == R && cj > 1){

            if((wialon.item.MUnitSensor.invalidValue == ch[cj - 2]) || (wialon.item.MUnitSensor.invalidValue == ch[cj - 1]))ch[cj - 2] = wialon.item.MUnitSensor.invalidValue; else ch[cj - 2] = ch[cj - 2] + ch[cj - 1];
            ch.pop();
          } else if(cc[0] == M){

            if(cj > 1){

              if((wialon.item.MUnitSensor.invalidValue == ch[cj - 2]) || (wialon.item.MUnitSensor.invalidValue == ch[cj - 1]))ch[cj - 2] = wialon.item.MUnitSensor.invalidValue; else ch[cj - 2] = ch[cj - 2] - ch[cj - 1];
              ch.pop();
            } else if(cj == 1)ch[cj - 1] = -ch[cj - 1];;
          } else if(cc[0] == l && cj > 1){

            if((wialon.item.MUnitSensor.invalidValue == ch[cj - 2]) || (wialon.item.MUnitSensor.invalidValue == ch[cj - 1]))ch[cj - 2] = wialon.item.MUnitSensor.invalidValue; else ch[cj - 2] = Math.pow(ch[cj - 2], ch[cj - 1]);
            ch.pop();
          } else if(cc[0] == y && cj > 1){

            if(wialon.item.MUnitSensor.invalidValue == ch[cj - 2])ch[cj - 2] = ch[cj - 1];
            ch.pop();
          } else {

            if(cc[0] == O){

              var cg = wialon.util.Helper.searchObject(this.getSensors(), D, cc.slice(1));
              if(!cg){

                ch.push(wialon.item.MUnitSensor.invalidValue);
                continue;
              };
              cb = this.__fB(cg, ci, ce, cf);
              ch.push(cb);
            } else {

              cb = wialon.item.MUnitSensor.invalidValue;
              if(cc[0] == K)cb = this.__fC(cc.slice(1), ce, cg); else cb = this.__fC(cc, ci, cg);
              if(typeof (cb) == h)return cb;
              ch.push(cb);
            };
          };;;;;
        };
        return ch.length == 1 ? ch[0] : wialon.item.MUnitSensor.invalidValue;
      },
      __fF : function(cs){

        var co = cs.length;
        var cv = z;
        var ct = [];
        var cp = [];
        var cw = 0;
        var cr = false;
        var cx = false;
        for(var i = 0;i < co;i++){

          if(cs[i] == G){

            if(!cw)continue;
          } else if(cs[i] == O)cr = true; else if(cs[i] == n)cr = false;;;
          var cu = cs[i].charCodeAt(0);
          var cn = (cu > 47 && cu < 58) || (cu > 64 && cu < 91) || (cu > 96 && cu < 123);
          var ck = cr || cn || cs[i] === f || cs[i] === K || cs[i] === u || cs[i] === s || cs[i] === G || (cs[i] === M && cv === E);
          if(ck){

            cv += cs[i];
            cw++;
            if(i < co - 1)continue;
          };
          if(cw && this.__fG(cv) == -1){

            cv = cv.replace(/\s+$/, k);
            cx = false;
            cp.push(cv);
          };
          cv = cs[i];
          var cm = this.__fG(cv);
          if(cm != -1){

            if(cs[i] == M && cx)cp.push(a);
            if(cs[i] == q)cx = true; else cx = false;
            if(ct.length){

              if(cs[i] == q)ct.push(cv); else if(cs[i] == C){

                while(ct.length){

                  var cq = ct[ct.length - 1];
                  ct.pop();
                  if(cq[0] != q)cp.push(cq); else break;
                };
              } else {

                while(ct.length){

                  var cq = ct[ct.length - 1];
                  var cl = this.__fG(cq);
                  if(cl >= cm){

                    if(cq[0] != q && cq[0] != C)cp.push(ct[ct.length - 1]);
                    ct.pop();
                  } else break;
                };
                ct.push(cv);
              };
            } else ct.push(cv);
          };
          cv = z;
          cw = 0;
        };
        while(ct.length){

          var cq = ct[ct.length - 1];
          if(cq[0] != C && cq[0] != q)cp.push(cq);
          ct.pop();
        };
        if(!cp.length)cp.push(cs);
        return cp;
      },
      __fG : function(cy){

        if(cy == z)return -1;
        switch(cy[0]){case y:
        return 5;case l:
        return 4;case t:case L:
        return 3;case M:case R:
        return 2;case C:
        return 1;case q:
        return 0;};
        return -1;
      }
    },
    statics : {
      invalidValue : -348201.3876,
      flags : {
        overflow : 0x20,
        boundsAfterCalc : 0x40
      },
      validation : {
        logicalAnd : 0x01,
        logicalOr : 0x02,
        mathAnd : 0x03,
        mathOr : 0x04,
        summarize : 0x05,
        subtructValidator : 0x06,
        subtructValue : 0x07,
        multiply : 0x08,
        divideValidator : 0x09,
        divideValue : 0x0A,
        noneZero : 0x0B,
        replaceOnError : 0x0C
      }
    }
  });
})();
(function(){

  var c = ': ',d = "+",f = 'dec',g = "^",h = "(.){1,",j = '',k = '+',m = "static",n = 'function',o = '^',p = 'invalid value',q = ',',r = "}",s = '*',t = 'Argument is invalid',u = 'Valid from 20 to 7E',v = 'invalid hex value:',w = '0x',x = 'g',y = 'rpn convert: invalid expression',z = 'valuemarker',A = ' ',B = 'Value is null',C = "*$",D = 'hex',E = '/',F = '0',G = '-',H = 'hextoascii',I = "wialon.util.Sensors";
  var M = /([a-zA-Z]{0,})\(([^\(\)]{0,})\)/gi;
  var P = [G, k];
  var K = /'(.)+'$/;
  var N = z;
  var J = (this && this.__gm) || function(R, Q, T){

    if(T || arguments.length === 2)for(var i = 0,l = Q.length,S;i < l;i++){

      if(S || !(i in Q)){

        if(!S)S = Array.prototype.slice.call(Q, 0, i);
        S[i] = Q[i];
      };
    };
    return R.concat(S || Array.prototype.slice.call(Q));
  };
  var L = function(name){

    var U = Array.prototype.slice.call(arguments, 1);
    throw new Error(name + c + U.join(A));
  };
  var O = {
    number : function(V){

      return +V;
    },
    split : function(X, W){

      if(!X){

        return [];
      };
      return X.match(new RegExp(h.concat(W || 1, r), x));
    },
    sum : function(Y){

      var ba = [];
      for(var bb = 1;bb < arguments.length;bb++){

        ba[bb - 1] = arguments[bb];
      };
      return J([], ba, true).reduce(function(bc, i){

        return (bc + O.number(i));
      }, +Y);
    },
    fill : function(be, bd){

      return (Array.from(new Array(O.number(be))).map(function(){

        return bd;
      }).join(j));
    },
    pow : function(bg, bf){

      if(bf === void 0){

        bf = 2;
      };
      return Math.pow(bg, bf || 2);
    },
    sqrt : function(bh){

      return Math.sqrt(bh);
    },
    '-' : function(a, b){

      return O.number(a) - O.number(b);
    },
    '+' : function(a, b){

      return O.number(a) + O.number(b);
    },
    ltrim : function(bj, bi){

      return bj.replace(new RegExp(g.concat(bi || F, d), x), j);
    },
    rtrim : function(bl, bk){

      return bl.replace(new RegExp((bk || F).concat(C), x), j);
    },
    lower : function(bm){

      return bm.toLowerCase();
    },
    upper : function(bn){

      return bn.toUpperCase();
    },
    reverse : function(bo){

      return O.split(bo, 1).reverse().join(j);
    },
    reverseb : function(bp){

      bp = O.lfill(bp, bp.length + bp.length % 2, 0);
      return O.split(bp, 2).reverse().join(j);
    },
    lfill : function(bq, br, symb = 0){

      return (O.fill(br, symb) + bq).slice(-Math.max(O.len(bq), br));
    },
    rfill : function(bs, bt, symb = 0){

      return O.substr(bs + (O.fill(bt, symb)), 0, Math.max(O.len(bs), O.number(bt)));
    },
    sequence : function(bu){

      var bw = [];
      for(var bv = 1;bv < arguments.length;bv++){

        bw[bv - 1] = arguments[bv];
      };
      return bw.map(function(bx){

        return bu[bx] || F;
      }).join(j);
    },
    hex : function(bz){

      var by = O.number(bz);
      return by ? by.toString(16) : L(D, p, bz);
    },
    hextoascii : function(bC){

      var bB = bC.toString();
      var bE = j;
      var bD = O.split(bB, 2);
      for(var i = 0;i < bD.length;i += 1){

        var bA = O.dec(bD[i]);
        if(bA < 32 || bA > 126){

          L(H, v + bD[i], u);
        };
        bE += String.fromCharCode(bA);
      };
      return bE;
    },
    dec : function(bH){

      var bF = w + bH;
      var bG = parseInt(bF, 16);
      return isNaN(Number(bF)) ? L(f, p, bH) : bG;
    },
    concat : function(){

      var bI = [];
      for(var bJ = 0;bJ < arguments.length;bJ++){

        bI[bJ] = arguments[bJ];
      };
      return J([], bI, true).join(j);
    },
    substr : function(bM, bK, bL){

      return bM.substr(O.number(bK), O.number(bL));
    },
    len : function(bN){

      return bN.length;
    }
  };
  qx.Class.define(I, {
    type : m,
    statics : {
      operands : O,
      isAvailable : 1,
      debug : 0,
      getValue : function(bT, bO, bR){

        var bQ = new wialon.util.Rpn({
          skipOperators : [o, E, s]
        });
        var bS = bT.match(bQ.mathregexp);
        if(!bS && bT.match(K)){

          return bT.replace(/'/g, j);
        };
        var bU = bT;
        if(typeof bO === n && !isFinite(bT)){

          bT = bO({
            expression : bU,
            math : bS,
            isSensorParam : bR
          });
        };
        if(bT && bS){

          var bP = bQ.convert(bT);
          if(bP){

            return bQ.parse(bP);
          } else {

            L(y);
          };
        };
        return bT;
      },
      calculate : function(){

        var bV = j;
        try{

          bV = this.calculateExpression.apply(this, arguments);
        } catch(e) {

          if(wialon.util.Sensors.debug){

            console.error(e.message);
          };
          bV = null;
        };
        return bV;
      },
      calculateExpression : function(cc, bW){

        var cb = cc;
        var bX = this.operands;
        var ca = this.getValue;
        while(cb){

          var bY = Array.from(cb.matchAll(M));
          if(!bY.length){

            if(cb.includes(N)){

              cb = cb.replace(N, j);
            };
            cb = ca(cb, bW);
            break;
          };
          bY.forEach(function(cg){

            var cd = cg[0];
            var name = cg[1];
            var ce = cg[2];
            var cf = F;
            if(P.includes(name)){

              ce = cd.replaceAll(name, q);
            };
            var ch = ce.split(q).map(function(i){

              return i.trim();
            });
            if(bX[name]){

              ch = ch.map(function(i, ci){

                var ck = /\'.*\'/.test(i) || i.includes(N);
                var cl = /\[.*\]/.test(i);
                var cm = (ci === 0 || cl) && !ck;
                var cj = i;
                if(i.includes(N)){

                  cj = i.replace(N, j);
                };
                return ca(cj, bW, cm);
              });
              if(ch.includes(wialon.item.MUnitSensor.invalidValue)){

                throw Error(t);
              };
              cf = bX[name].apply(null, ch);
              if(cf === null){

                throw Error(B);
              };
            } else if(ch.length === 1){

              ch = ch.map(function(i){

                return ca(i, bW);
              });
              cf = ch[0];
            };
            if(wialon.util.Sensors.debug){

              console.log(cd, cf);
            };
            cb = cb.replace(cd, cf + N);
          });
        };
        return cb;
      }
    }
  });
})();
(function(){

  var a = '(',b = ']))([',c = '(?:(?<![',d = ' ',e = '^*/+-',f = '-',g = "wialon.util.Rpn",h = "qx.strict",j = '',k = 'left',l = '\(\)])',m = '(\\d{1,}\\s?[',n = '\\',o = ')',p = '])(\\s?\\d{1,})',q = '+',r = 'right';
  var s = function(t){

    return Object.keys(t).map(function(v){

      return n + v;
    }).join(j);
  };
  qx.Class.define(g, {
    extend : qx.core.Object,
    construct : function u(w){

      var self = this;
      if(qx.core.Environment.get(h)){

        this.callee(u, arguments);
      } else {

        qx.core.Object.call(this);
      };
      if(w && w.skipOperators){

        w.skipOperators.forEach(function(z){

          if(z in self.operators){

            delete self.operators[z];
          };
        });
      };
      this.operands = {
        '*' : function(x, y){

          return x * y;
        },
        '/' : function(x, y){

          return x / y;
        }
      };
      [q, f].forEach(function(A){

        if(A in wialon.util.Sensors.operands){

          self.operands[A] = wialon.util.Sensors.operands[A];
        };
      });
      this.preparedOperands = s(this.operators);
      this.mathregexp = new RegExp(m + this.preparedOperands + p);
    },
    members : {
      operators : {
        '^' : {
          priority : 4,
          associativity : r
        },
        '/' : {
          priority : 3,
          associativity : k
        },
        '*' : {
          priority : 3,
          associativity : k
        },
        '+' : {
          priority : 2,
          associativity : k
        },
        '-' : {
          priority : 2,
          associativity : k
        }
      },
      clean : function(B){

        return B.filter(function(C){

          return C !== j;
        });
      },
      isNumeric : function(D){

        return !isNaN(parseFloat(D)) && isFinite(D);
      },
      convert : function(F){

        var G = j;
        var E = [];
        F = F.replace(/\s+/g, j);
        F = this.clean(F.split(new RegExp(c + this.preparedOperands + b + this.preparedOperands + l)));
        for(var i = 0;i < F.length;i++){

          var H = F[i];
          if(this.isNumeric(H)){

            G += H + d;
          } else if(e.indexOf(H) !== -1){

            var J = H;
            var I = E[E.length - 1];
            while(e.indexOf(I) !== -1 && ((this.operators[J].associativity === k && this.operators[J].priority <= this.operators[I].priority) || (this.operators[J].associativity === r && this.operators[J].priority < this.operators[I].priority))){

              G += E.pop() + d;
              I = E[E.length - 1];
            };
            E.push(J);
          } else if(H === a){

            E.push(H);
          } else if(H === o){

            while(E[E.length - 1] !== a){

              G += E.pop() + d;
            };
            E.pop();
          } else {

            return null;
          };;;
        };
        while(E.length > 0){

          G += E.pop() + d;
        };
        return G;
      },
      parse : function(K){

        var L = K.trim().split(d).map(function(i){

          return Number(i) ? Number(i) : i;
        });
        var M = [];
        var self = this;
        L.forEach(function(N){

          M.push(self.operands[N] ? self.operands[N].apply(null, M.splice(-2)) : N);
        });
        return M.pop();
      }
    }
  });
})();
(function(){

  var a = "wialon.util.String",b = '',c = "null",d = 'x',e = 'c',f = "",g = 'b',h = 'X',k = 'o',m = '-',n = 'f',o = ' ',p = "x",q = '%',r = ":",s = 's',t = 'd',u = "0",v = "undefined",w = "string",x = "static";
  qx.Class.define(a, {
    type : x,
    statics : {
      wrapString : function(y){

        if(typeof y == v || !y.length)y = f;
        return y;
      },
      xor : function(A, B){

        var z = [];
        for(var i = 0;i < A.length;i++)z.push(A.charCodeAt(i) ^ B.charCodeAt(i % B.length));
        return z.join(r);
      },
      unxor : function(D, E){

        var C = f;
        if(D == f)return D;
        D = D.split(r);
        for(var i = 0;i < D.length;i++)C += String.fromCharCode(D[i] ^ E.charCodeAt(i % E.length));
        return C;
      },
      isValidText : function(F){

        if(F === c)return false;
        var G = f + F;
        var H = /([\"\{\}\\])/i;
        return (G != null && typeof G === w && (!G.length || !H.test(G)));
      },
      isValidName : function(name, J){

        var K = f + name;
        if(J == null)return (K != null && this.isValidText(K) && K.length > 0 && K[0] != o && K[K.length - 1] != o);
        var L = (J.min != null ? J.min : 1);
        var I = (J.max != null ? J.max : 4096);
        return (K != null && this.isValidText(K) && K.length >= L && K.length <= I && K[0] != o && K[K.length - 1] != o);
      },
      isValidEmail : function(M){

        return (/^[^\s@]+@[^\s@]+\.[^\s@]{2,64}$/i).test(M);
      },
      isValidPhone : function(N){

        var O = f + N;
        return (O != null && this.isValidText(O) && (/^[+]{1,1}[\d]{7,16}$/i).test(O));
      },
      stringMatchTemplates : function(R, P, Q){

        if(typeof R != w || !R.length || !(P instanceof Array))return true;
        if(typeof Q != w || Q.length != 1)Q = p;
        for(var i = 0;i < P.length;i++){

          var S = P[i];
          if(typeof S != w || S.length != R.length)continue;
          var T = true;
          for(var j = 0;j < R.length;j++){

            if(R[j] != S[j] && S[j].toLowerCase() != Q[0]){

              T = false;
              break;
            };
          };
          if(T)return true;
        };
        return false;
      },
      sprintf : function(){

        if(typeof arguments == v){

          return null;
        };
        if(arguments.length < 1){

          return null;
        };
        if(typeof arguments[0] != w){

          return null;
        };
        if(typeof RegExp == v){

          return null;
        };
        var V = arguments[0];
        var ba = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d+)?)?([bcdfosxX])))/g);
        var W = new Array();
        var be = new Array();
        var X = 0;
        var Y = 0;
        var bc = 0;
        var bg = 0;
        var bd = b;
        var bf = null;
        while(bf = ba.exec(V)){

          if(bf[9]){

            X += 1;
          };
          Y = bg;
          bc = ba.lastIndex - bf[0].length;
          be[be.length] = V.substring(Y, bc);
          bg = ba.lastIndex;
          W[W.length] = {
            match : bf[0],
            left : bf[3] ? true : false,
            sign : bf[4] || b,
            pad : bf[5] || o,
            min : bf[6] || 0,
            precision : bf[8],
            code : bf[9] || q,
            negative : parseFloat(arguments[X]) < 0 ? true : false,
            argument : String(arguments[X])
          };
        };
        be[be.length] = V.substring(bg);
        if(W.length == 0){

          return V;
        };
        if((arguments.length - 1) < X){

          return null;
        };
        var U = null;
        var bf = null;
        var i = null;
        var bb = null;
        for(i = 0;i < W.length;i++){

          if(W[i].code == q){

            bb = q;
          } else if(W[i].code == g){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(2));
            bb = this.__fH(W[i], true);
          } else if(W[i].code == e){

            W[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(W[i].argument)))));
            bb = this.__fH(W[i], true);
          } else if(W[i].code == t){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)));
            bb = this.__fH(W[i]);
          } else if(W[i].code == n){

            W[i].argument = String(Math.abs(parseFloat(W[i].argument)).toFixed(W[i].precision < 15 ? W[i].precision : 6));
            bb = this.__fH(W[i]);
          } else if(W[i].code == k){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(8));
            bb = this.__fH(W[i]);
          } else if(W[i].code == s){

            W[i].argument = W[i].argument.substring(0, W[i].precision ? W[i].precision : W[i].argument.length);
            bb = this.__fH(W[i], true);
          } else if(W[i].code == d){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(16));
            bb = this.__fH(W[i]);
          } else if(W[i].code == h){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(16));
            bb = this.__fH(W[i]).toUpperCase();
          } else {

            bb = W[i].match;
          };;;;;;;;
          bd += be[i];
          bd += bb;
        };
        bd += be[i];
        return bd;
      },
      strspn : function(bi, bh){

        if(typeof bi != w || typeof bh != w)return 0;
        var i,j;
        for(i = 0;i < bi.length;i++){

          for(j = 0;j < bh.length;j++)if(bh[j] == bi[i])break;;
          if(j == bh.length && bh[j] != bi[i])break;
        };
        return i;
      },
      __fH : function(bl, bj){

        if(bj){

          bl.sign = b;
        } else {

          bl.sign = bl.negative ? m : bl.sign;
        };
        var l = bl.min - bl.argument.length + 1 - bl.sign.length;
        var bk = new Array(l < 0 ? 0 : l).join(bl.pad);
        if(!bl.left){

          if(bl.pad == u || bj){

            return bl.sign + bk + bl.argument;
          } else {

            return bk + bl.sign + bl.argument;
          };
        } else {

          if(bl.pad == u || bj){

            return bl.sign + bl.argument + bk.replace(/0/g, o);
          } else {

            return bl.sign + bl.argument + bk;
          };
        };
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitTripDetector",b = "unit/get_trip_detector",c = "unit/get_trips",d = "unit/update_trip_detector";
  qx.Mixin.define(a, {
    members : {
      getTripDetector : function(e){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(e));
      },
      getTrips : function(g, i, h, f){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          timeFrom : g,
          timeTo : i,
          msgsSource : h
        }, wialon.util.Helper.wrapCallback(f));
      },
      updateTripDetector : function(r, n, k, o, l, m, j, q, p){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          type : r,
          gpsCorrection : n,
          minSat : k,
          minMovingSpeed : o,
          minStayTime : l,
          maxMessagesDistance : m,
          minTripTime : j,
          minTripDistance : q
        }, wialon.util.Helper.wrapCallback(p));
      }
    },
    statics : {
      tripDetectionType : {
        gpsSpeed : 1,
        gpsPosition : 2,
        ignitionSensor : 3,
        mileageSensorAbsolute : 4,
        mileageSensorRelative : 5
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitMessagesFilter",b = "undefined",c = "unit/get_messages_filter",d = "unit/update_messages_filter",e = "object";
  qx.Mixin.define(a, {
    members : {
      getMessagesFilter : function(f){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(f));
      },
      updateMessagesFilter : function(l, h, k, g, i, n, j){

        var m;
        if(typeof l === e){

          m = l;
          j = h;
        } else {

          if(typeof j == b){

            j = n;
            n = 0;
          };
          m = {
            enabled : l,
            skipInvalid : h,
            minSats : k,
            maxHdop : g,
            maxSpeed : i,
            lbsCorrection : n
          };
        };
        m.itemId = this.getId();
        return wialon.core.Remote.getInstance().remoteCall(d, m, wialon.util.Helper.wrapCallback(j));
      }
    }
  });
})();
(function(){

  var a = "unit/registry_maintenance_event",b = "",c = "wialon.item.MUnitEventRegistrar",d = "unit/registry_status_event",e = "unit/registry_insurance_event",f = "unit/registry_custom_event",g = "unit/registry_fuel_filling_event";
  qx.Mixin.define(c, {
    members : {
      registryStatusEvent : function(h, k, j, i){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          date : h,
          description : k,
          params : j,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(i));
      },
      registryInsuranceEvent : function(n, m, o, l){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          type : m,
          case_num : o,
          description : n,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(l));
      },
      registryCustomEvent : function(q, r, x, y, s, t, u){

        var p = {
          date : q,
          x : x,
          y : y,
          description : r,
          violation : s,
          itemId : this.getId()
        };
        if(u && u.nt && u.nct){

          p.nt = u.nt + b;
          p.nct = u.nct + b;
        };
        return wialon.core.Remote.getInstance().remoteCall(f, p, wialon.util.Helper.wrapCallback(t));
      },
      registryFuelFillingEvent : function(w, z, x, y, location, A, C, v, B){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          date : w,
          volume : A,
          cost : C,
          location : location,
          deviation : v,
          x : x,
          y : y,
          description : z,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(B));
      },
      registryMaintenanceEvent : function(F, G, x, y, location, D, K, J, E, L, H, I){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          date : F,
          info : D,
          duration : K,
          cost : J,
          location : location,
          x : x,
          y : y,
          description : G,
          mileage : E,
          eh : L,
          done_svcs : H,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(I));
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitReportSettings",b = "unit/get_report_settings",c = "unit/update_report_settings";
  qx.Mixin.define(a, {
    members : {
      getReportSettings : function(d){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(d));
      },
      updateReportSettings : function(f, e){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          params : f
        }, wialon.util.Helper.wrapCallback(e));
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitDriveRankSettings",b = "unit/get_accelerometers_calibration",c = "unit/update_drive_rank_settings",d = "unit/update_accelerometers_calibration",e = "unit/get_drive_rank_settings";
  qx.Mixin.define(a, {
    members : {
      getDriveRankSettings : function(f){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(f));
      },
      updateDriveRankSettings : function(h, g){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          driveRank : h
        }, wialon.util.Helper.wrapCallback(g));
      },
      getAccelerometersCalibration : function(i){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(i));
      },
      updateAccelerometersCalibration : function(k, l, j){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          timeFrom : k,
          timeTo : l
        }, wialon.util.Helper.wrapCallback(j));
      },
      resetAccelerometersCalibration : function(m){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          reset : 1
        }, wialon.util.Helper.wrapCallback(m));
      }
    }
  });
})();
(function(){

  var a = "function",b = "unit/update_fuel_rates_params",c = "unit/update_fuel_math_params",d = "unit/update_fuel_impulse_params",e = "wialon.item.MUnitFuelSettings",f = "unit/update_fuel_calc_types",g = "unit/get_fuel_settings",h = "unit/update_fuel_level_params",i = "object";
  qx.Mixin.define(e, {
    members : {
      getFuelSettings : function(j){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(j));
      },
      updateFuelCalcTypes : function(l, k){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : this.getId(),
          calcTypes : l
        }, wialon.util.Helper.wrapCallback(k));
      },
      updateFuelLevelParams : function(o, n){

        var m = {
        };
        if(o && typeof o == i){

          m = o;
        } else if(arguments.length > 2){

          m.flags = arguments[0];
          m.ignoreStayTimeout = arguments[1];
          m.minFillingVolume = arguments[2];
          m.minTheftTimeout = arguments[3];
          m.minTheftVolume = arguments[4];
          m.filterQuality = arguments[5];
          if(arguments.length > 7){

            m.fillingsJoinInterval = arguments[6];
            m.theftsJoinInterval = arguments[7];
            n = arguments[8];
          } else {

            m.fillingsJoinInterval = 300;
            m.theftsJoinInterval = 300;
            n = arguments[6];
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(h, {
          itemId : this.getId(),
          flags : m.flags,
          ignoreStayTimeout : m.ignoreStayTimeout,
          minFillingVolume : m.minFillingVolume,
          minTheftTimeout : m.minTheftTimeout,
          minTheftVolume : m.minTheftVolume,
          filterQuality : m.filterQuality,
          fillingsJoinInterval : m.fillingsJoinInterval,
          theftsJoinInterval : m.theftsJoinInterval,
          extraFillingTimeout : m.extraFillingTimeout
        }, wialon.util.Helper.wrapCallback(n));
      },
      updateFuelConsMath : function(s, r){

        var t,p,q;
        if(arguments.length >= 4){

          t = arguments[0];
          p = arguments[1];
          q = arguments[2];
          r = arguments[4];
        } else if(s && typeof s === i){

          t = s.idling , p = s.urban;
          q = s.suburban;
        } else {

          if(typeof r === a)r(4);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          idling : t,
          urban : p,
          suburban : q
        }, wialon.util.Helper.wrapCallback(r));
      },
      updateFuelConsRates : function(u, w, v, y, x, A, C, B, z){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId(),
          idlingSummer : u,
          idlingWinter : w,
          consSummer : v,
          consWinter : y,
          winterMonthFrom : x,
          winterDayFrom : A,
          winterMonthTo : C,
          winterDayTo : B
        }, wialon.util.Helper.wrapCallback(z));
      },
      updateFuelConsImpulse : function(D, E, F){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          maxImpulses : D,
          skipZero : E
        }, wialon.util.Helper.wrapCallback(F));
      }
    },
    statics : {
      fuelCalcType : {
        math : 0x01,
        levelSensors : 0x02,
        levelSensorsMath : 0x04,
        absConsSensors : 0x08,
        impConsSensors : 0x10,
        instConsSensors : 0x20,
        rates : 0x40
      },
      fuelLevelFlag : {
        mergeSensors : 0x01,
        smoothData : 0x02,
        splitConsSensors : 0x04,
        requireStay : 0x08,
        calcByTime : 0x10,
        calcFillingsByRaw : 0x40,
        calcTheftsByRaw : 0x80,
        detectTheftsInMotion : 0x100,
        calcFillingsByTime : 0x200,
        calcTheftsByTime : 0x400,
        calcConsumptionByTime : 0x800
      }
    }
  });
})();
(function(){

  var a = "&v=1",b = "resource/upload_zone_image",c = "wialon.item.MZone",d = "",e = "number",f = "?b=",g = "undefined",h = "string",i = "object";
  qx.Mixin.define(c, {
    members : {
      getZoneImageUrl : function(j, k){

        if(typeof k == g || !k)k = 32;
        if(j.icon)return wialon.core.Session.getInstance().getBaseUrl() + j.icon + f + k + a;
        return d;
      },
      setZoneImage : function(m, l, n){

        if(typeof l == h)return wialon.core.Uploader.getInstance().uploadFiles([], b, {
          fileUrl : l,
          itemId : this.getId(),
          id : m.id
        }, n, true); else if(l === null || l === undefined)return wialon.core.Uploader.getInstance().uploadFiles([], b, {
          fileUrl : d,
          itemId : this.getId(),
          id : m.id
        }, n, true); else if(typeof l == i && typeof l.resId == e && typeof l.zoneId == e)return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId(),
          id : m.id,
          oldItemId : l.resId,
          oldZoneId : l.zoneId
        }, n);;;
        return wialon.core.Uploader.getInstance().uploadFiles([l], b, {
          itemId : this.getId(),
          id : m.id
        }, n, true);
      }
    },
    statics : {
      flags : {
        area : 0x00000001,
        perimeter : 0x00000002,
        boundary : 0x00000004,
        points : 0x00000008,
        base : 0x000000010
      }
    }
  });
})();
(function(){

  var a = "resource/cleanup_driver_interval",b = "changeDriverUnits",c = "wialon.item.MDriver",d = ".png",e = "say",f = "resource/driver_actions_register",g = "/1/",h = "/2/",i = "changeTrailerUnits",j = "resource/get_driver_bindings",k = "Array",l = "resource/update_trailer_units",m = "resource/upload_trailer_image",n = "/",o = "qx.event.type.Data",p = "resource/upload_driver_image",q = "number",r = "resource/driver_actions_cleanup",s = "resource/bind_unit_driver",t = "resource/driver_actions_list",u = "driver/operate",v = "trlrun",w = "resource/cleanup_trailer_interval",x = "read",y = "resource/get_trailer_bindings",z = "drvrun",A = "resource/bind_unit_trailer",B = "/avl_driver_image/",C = "resource/update_driver_units",D = "undefined",E = "?sid=",F = "object";
  qx.Mixin.define(c, {
    construct : function(){

      var G = wialon.core.Session.getInstance();
      G.registerProperty(z, qx.lang.Function.bind(function(H, I){

        H.setDriverUnits(I);
      }, this));
      G.registerProperty(v, qx.lang.Function.bind(function(J, K){

        J.setTrailerUnits(K);
      }, this));
    },
    properties : {
      driverUnits : {
        init : null,
        check : k,
        event : b
      },
      trailerUnits : {
        init : null,
        check : k,
        event : i
      }
    },
    members : {
      updateDriverUnits : function(L, M){

        return wialon.core.Remote.getInstance().remoteCall(C, {
          itemId : this.getId(),
          units : L
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(M)));
      },
      updateTrailerUnits : function(N, O){

        return wialon.core.Remote.getInstance().remoteCall(l, {
          itemId : this.getId(),
          units : N
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(O)));
      },
      getDriverImageUrl : function(R, S){

        if(typeof S == D || !S)S = 32;
        var Q = wialon.core.Session.getInstance();
        var P = Q.getBaseUrl() + B + this.getId() + n + R.id + n + S + g + R.ck + d + E + Q.getId();
        return P;
      },
      getTrailerImageUrl : function(V, W){

        if(typeof W == D || !W)W = 32;
        var U = wialon.core.Session.getInstance();
        var T = U.getBaseUrl() + B + this.getId() + n + V.id + n + W + h + V.ck + d + E + U.getId();
        return T;
      },
      setDriverImage : function(Y, X, ba){

        if(typeof X == F && typeof X.resId == q && typeof X.drvId == q)return wialon.core.Remote.getInstance().remoteCall(p, {
          itemId : this.getId(),
          driverId : Y.id,
          oldItemId : X.resId,
          oldDrvId : X.drvId
        }, ba);
        return wialon.core.Uploader.getInstance().uploadFiles([X], p, {
          itemId : this.getId(),
          driverId : Y.id
        }, ba);
      },
      setTrailerImage : function(bc, bb, bd){

        if(typeof bb == F && typeof bb.resId == q && typeof bb.trId == q)return wialon.core.Remote.getInstance().remoteCall(m, {
          itemId : this.getId(),
          trailerId : bc.id,
          oldItemId : bb.resId,
          oldTrId : bb.trId
        }, bd);
        return wialon.core.Uploader.getInstance().uploadFiles([bb], m, {
          itemId : this.getId(),
          trailerId : bc.id
        }, bd);
      },
      bindDriverToUnit : function(bg, bk, bj, bi, bh){

        var be = 0;
        var bf = 0;
        if(bg)be = bg.id;
        if(bk)bf = bk.getId();
        return wialon.core.Remote.getInstance().remoteCall(s, {
          resourceId : this.getId(),
          driverId : be,
          time : bj,
          unitId : bf,
          mode : bi
        }, wialon.util.Helper.wrapCallback(bh));
      },
      registerDriverAction : function(bn, bo){

        var bl = 0;
        var bm = 0;
        if(bn.driver)bl = bn.driver.id;
        if(bn.unit)bm = bn.unit.getId();
        return wialon.core.Remote.getInstance().remoteCall(f, {
          resourceId : this.getId(),
          driverId : bl,
          time : bn.time,
          unitId : bm,
          action : bn.action,
          timeTo : bn.timeTo,
          ignoreState : bn.ignoreState
        }, wialon.util.Helper.wrapCallback(bo));
      },
      cleanupDriverAction : function(bq, bp){

        var br = null;
        if(bq.driver)br = bq.driver.id;
        return wialon.core.Remote.getInstance().remoteCall(r, {
          resourceId : this.getId(),
          driverId : br,
          timeFrom : bq.timeFrom,
          timeTo : bq.timeTo,
          action : bq.action
        }, wialon.util.Helper.wrapCallback(bp));
      },
      getDriverActions : function(bt, bs){

        var bu = null;
        if(bt.driver)bu = bt.driver.id;
        return wialon.core.Remote.getInstance().remoteCall(t, {
          resourceId : this.getId(),
          driverId : bu,
          timeFrom : bt.timeFrom,
          timeTo : bt.timeTo
        }, wialon.util.Helper.wrapCallback(bs));
      },
      bindTrailerToUnit : function(bB, by, bv, bz, bx){

        var bw = 0;
        var bA = 0;
        if(bB)bw = bB.id;
        if(by)bA = by.getId();
        return wialon.core.Remote.getInstance().remoteCall(A, {
          resourceId : this.getId(),
          trailerId : bw,
          time : bv,
          unitId : bA,
          mode : bz
        }, wialon.util.Helper.wrapCallback(bx));
      },
      cleanupDriverInterval : function(bE, bD, bF, bG){

        var bC = 0;
        if(bE)bC = bE.id;
        return wialon.core.Remote.getInstance().remoteCall(a, {
          resourceId : this.getId(),
          driverId : bC,
          timeFrom : bD,
          timeTo : bF
        }, wialon.util.Helper.wrapCallback(bG));
      },
      cleanupTrailerInterval : function(bK, bJ, bL, bH){

        var bI = 0;
        if(bK)bI = bK.id;
        return wialon.core.Remote.getInstance().remoteCall(w, {
          resourceId : this.getId(),
          trailerId : bI,
          timeFrom : bJ,
          timeTo : bL
        }, wialon.util.Helper.wrapCallback(bH));
      },
      getDriverBindings : function(bS, bO, bM, bP, bQ){

        var bN = 0;
        var bR = 0;
        if(bO)bN = bO.id;
        if(bS)bR = bS.getId();
        return wialon.core.Remote.getInstance().remoteCall(j, {
          resourceId : this.getId(),
          unitId : bR,
          driverId : bN,
          timeFrom : bM,
          timeTo : bP
        }, wialon.util.Helper.wrapCallback(bQ));
      },
      getTrailerBindings : function(ca, bX, bT, bV, bW){

        var bU = 0;
        var bY = 0;
        if(bX)bU = bX.id;
        if(ca)bY = ca.getId();
        return wialon.core.Remote.getInstance().remoteCall(y, {
          resourceId : this.getId(),
          unitId : bY,
          trailerId : bU,
          timeFrom : bT,
          timeTo : bV
        }, wialon.util.Helper.wrapCallback(bW));
      },
      registerChatMessage : function(cd, cc, cb){

        return wialon.core.Remote.getInstance().remoteCall(u, {
          resourceId : this.getId(),
          driverId : cd.id,
          message : cc,
          callMode : e
        }, wialon.util.Helper.wrapCallback(cb));
      },
      getChatHistory : function(cg, cf, ch, ce){

        return wialon.core.Remote.getInstance().remoteCall(u, {
          resourceId : this.getId(),
          driverId : cg.id,
          timeFrom : cf,
          timeTo : ch,
          callMode : x
        }, wialon.util.Helper.wrapCallback(ce));
      }
    },
    statics : {
      registerDriverProperties : function(){

        var ci = wialon.core.Session.getInstance();
        ci.registerProperty(z, this.remoteUpdateDriverUnits);
        ci.registerProperty(v, this.remoteUpdateTrailerUnits);
      },
      remoteUpdateDriverUnits : function(cj, ck){

        cj.setDriverUnits(ck);
      },
      remoteUpdateTrailerUnits : function(cl, cm){

        cl.setTrailerUnits(cm);
      },
      flags : {
        driver : 0x01,
        trailer : 0x02,
        assignmentRestriction : 0x04
      }
    },
    events : {
      "changeDriverUnits" : o,
      "changeTrailerUnits" : o
    }
  });
})();
(function(){

  var a = "create_account",b = "function",c = "account/enable_account",d = "account/update_sub_plans",e = "account/get_account_history",f = "Integer",g = "account/update_business_sphere",h = "update_account_min_days",i = "Object",j = "account/get_billing_plans",k = "account/update_dealer_rights",l = "account/create_account",m = "account/update_min_days",n = "switch_account",o = "update_account_history_period",p = "account/get_account_data",q = "String",r = "account/do_payment",s = "wialon.item.MAccount",t = "update_account_flags",u = "number",v = "create_account_service",w = "fleetio",x = "account/delete_account",y = "update_dealer_rights",z = "update_account_service",A = "account/update_plan",B = 'function',C = "account/update_history_period",D = "update_account_plan",E = "delete_account_service",F = "account/update_flags",G = "update_account_subplans",H = "sph",I = "account/update_drivers_feature_flags",J = "drvf",K = "account/update_billing_plan",L = "account/update_billing_service",M = "object";
  qx.Mixin.define(s, {
    construct : function(){

      var N = wialon.core.Session.getInstance();
      N.registerProperty(H, qx.lang.Function.bind(function(O, P){

        O.setBusinessSphere(P);
      }, this));
    },
    properties : {
      businessSphere : {
        init : null,
        check : q
      },
      fleetio : {
        init : null,
        check : i
      },
      driverFlags : {
        init : 0,
        check : f
      }
    },
    members : {
      getAccountData : function(R, Q){

        if(typeof (R) == b){

          Q = R;
          R = 2;
        };
        return wialon.core.Remote.getInstance().remoteCall(p, {
          itemId : this.getId(),
          type : R
        }, wialon.util.Helper.wrapCallback(Q));
      },
      getAccountHistory : function(U, T, S){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          itemId : this.getId(),
          days : U,
          tz : T
        }, wialon.util.Helper.wrapCallback(S));
      },
      updateDealerRights : function(W, V){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          itemId : this.getId(),
          enable : W
        }, wialon.util.Helper.wrapCallback(V));
      },
      updatePlan : function(Y, X){

        return wialon.core.Remote.getInstance().remoteCall(A, {
          itemId : this.getId(),
          plan : Y
        }, wialon.util.Helper.wrapCallback(X));
      },
      updateFlags : function(bb, ba){

        var bc = {
        };
        if(bb && typeof bb == M)bc = bb; else if(typeof bb == u)bc.flags = bb;;
        return wialon.core.Remote.getInstance().remoteCall(F, {
          itemId : this.getId(),
          flags : bc.flags,
          blockBalance : bc.blockBalance,
          denyBalance : bc.denyBalance
        }, wialon.util.Helper.wrapCallback(ba));
      },
      updateMinDays : function(be, bd){

        return wialon.core.Remote.getInstance().remoteCall(m, {
          itemId : this.getId(),
          minDays : be
        }, wialon.util.Helper.wrapCallback(bd));
      },
      updateHistoryPeriod : function(bg, bf){

        return wialon.core.Remote.getInstance().remoteCall(C, {
          itemId : this.getId(),
          historyPeriod : bg
        }, wialon.util.Helper.wrapCallback(bf));
      },
      updateBillingService : function(name, bi, bk, bj, bh){

        return wialon.core.Remote.getInstance().remoteCall(L, {
          itemId : this.getId(),
          name : name,
          type : bi,
          intervalType : bk,
          costTable : bj
        }, wialon.util.Helper.wrapCallback(bh));
      },
      enableAccount : function(bm, bl){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          enable : bm
        }, wialon.util.Helper.wrapCallback(bl));
      },
      updateSubPlans : function(bo, bn){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          plans : bo
        }, wialon.util.Helper.wrapCallback(bn));
      },
      doPayment : function(bq, br, bs, bp){

        return wialon.core.Remote.getInstance().remoteCall(r, {
          itemId : this.getId(),
          balanceUpdate : bq,
          daysUpdate : br,
          description : bs
        }, wialon.util.Helper.wrapCallback(bp));
      },
      createAccount : function(bu, bt){

        return wialon.core.Remote.getInstance().remoteCall(l, {
          itemId : this.getId(),
          plan : bu
        }, wialon.util.Helper.wrapCallback(bt));
      },
      deleteAccount : function(bx, bw){

        var bv = {
          itemId : this.getId()
        };
        if(typeof bx === B){

          bw = bx;
        } else {

          bv = Object.assign({
          }, bv, bx);
        };
        return wialon.core.Remote.getInstance().remoteCall(x, bv, wialon.util.Helper.wrapCallback(bw));
      },
      getBillingPlans : function(by){

        return wialon.core.Remote.getInstance().remoteCall(j, {
        }, wialon.util.Helper.wrapCallback(by));
      },
      updateBillingPlan : function(bz, bA, bB){

        bB = wialon.util.Helper.wrapCallback(bB);
        return wialon.core.Remote.getInstance().remoteCall(K, {
          callMode : bz,
          plan : bA
        }, bB);
      },
      updateBusinessSphere : function(bC, bD){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          itemId : this.getId(),
          sph : bC
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(bD)));
      },
      updateDriverFlags : function(bF, bE){

        return wialon.core.Remote.getInstance().remoteCall(I, {
          itemId : this.getId(),
          flags : bF
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(bE)));
      }
    },
    statics : {
      registerAccountProperties : function(){

        var bG = wialon.core.Session.getInstance();
        bG.registerProperty(H, this.remoteUpdateBusinessSphere);
        bG.registerProperty(w, this.remoteFleetio);
        bG.registerProperty(J, this.remoteUpdateDriverFlags);
      },
      remoteUpdateBusinessSphere : function(bH, bI){

        bH.setBusinessSphere(bI);
      },
      remoteFleetio : function(bJ, bK){

        bJ.setFleetio(bK);
      },
      remoteUpdateDriverFlags : function(bL, bM){

        bL.setDriverFlags(bM);
      },
      billingPlanFlag : {
        blockAccount : 0x1,
        denyServices : 0x2,
        allowUnknownServices : 0x4,
        restrictDeviceListedOnly : 0x8,
        restrictDeviceNotListedOnly : 0x10,
        subtractDays : 0x20,
        overridePlanFlags : 0x40
      },
      billingIntervalType : {
        none : 0,
        hourly : 1,
        daily : 2,
        weekly : 3,
        monthly : 4
      },
      billingServiceType : {
        onDemand : 1,
        periodic : 2
      },
      logMessageAction : {
        accountCreated : a,
        accountSwitched : n,
        accountUpdateDealerRights : y,
        accountUpdateFlags : t,
        accountUpdateMinDays : h,
        accountUpdatedHistoryPeriod : o,
        accountUpdatePlan : D,
        accountUpdateSubplans : G,
        accountCreatedService : v,
        accountUpdatedService : z,
        accountDeletedService : E
      },
      driverFlags : {
        enabled : 0x01,
        canControl : 0x02,
        logSwitching : 0x04
      }
    }
  });
})();
(function(){

  var a = "function",b = "report/abort_report",c = "wialon.item.MReport",d = "report/exec_report",e = "report/apply_report_result",f = "report/cleanup_result",g = "report/get_report_status",h = 'Invalid execReport additional id:';
  qx.Mixin.define(c, {
    members : {
      execReport : function(m, k, i, l, j){

        if(arguments.length <= 2 || (typeof k === a)){

          return this.__fI(m, k);
        };
        return this.__fI({
          report : m,
          objectId : k,
          objectSecondaryId : i,
          interval : l
        }, j);
      },
      getReportStatus : function(n){

        return wialon.core.Remote.getInstance().remoteCall(g, {
        }, wialon.util.Helper.wrapCallback(n));
      },
      abortReport : function(o){

        return wialon.core.Remote.getInstance().remoteCall(b, {
        }, wialon.util.Helper.wrapCallback(o));
      },
      applyReportResult : function(p){

        return wialon.core.Remote.getInstance().remoteCall(e, {
        }, qx.lang.Function.bind(this.__fJ, this, wialon.util.Helper.wrapCallback(p)));
      },
      cleanupResult : function(q){

        return wialon.core.Remote.getInstance().remoteCall(f, {
        }, qx.lang.Function.bind(this.__fK, this, wialon.util.Helper.wrapCallback(q)));
      },
      __fI : function(A, y){

        var B = A.report,t = A.objectId,u = A.additionalObjectsIds,C = A.objectSecondaryId,s = A.interval,w = A.remoteExec;
        var v = null;
        if(!B.id)v = B;
        var r = {
          reportResourceId : this.getId(),
          reportTemplateId : B.id,
          reportTemplate : v,
          reportObjectId : t,
          reportObjectSecId : C,
          interval : s
        };
        if(w)r.remoteExec = 1;
        if(Array.isArray(u)){

          var x = [],z = {
          };
          u.forEach(function(E){

            var F = parseInt(E, 10),D = isFinite(F) && F > 0;
            if(!D){

              console.warn(h, E);
              return;
            };
            if(!z.hasOwnProperty(F)){

              x.push(F);
              z[F] = true;
            };
          });
          r.reportObjectIdList = x;
        };
        return wialon.core.Remote.getInstance().remoteCall(d, r, qx.lang.Function.bind(this.__fJ, this, wialon.util.Helper.wrapCallback(y)), 180);
      },
      __fJ : function(G, H, K){

        var J = null;
        if(H == 0 && K){

          if(!K.reportResult){

            G(0, Object.assign(K, {
              remoteExec : true
            }));
            return;
          };
          J = new wialon.report.ReportResult(K);
          var I = wialon.core.Session.getInstance().getRenderer();
          if(I)I.setReportResult(J);
        };
        G(H, J);
      },
      __fK : function(L, M, N){

        var O = wialon.core.Session.getInstance().getRenderer();
        if(O)O.setReportResult(null);
        L(M);
      }
    },
    statics : {
      intervalFlag : {
        absolute : 0x00,
        useCurrentTime : 0x01,
        prevHour : 0x40,
        prevMinute : 0x80,
        prevDay : 0x02,
        prevWeek : 0x04,
        prevMonth : 0x08,
        prevYear : 0x10,
        currTimeAndPrev : 0x20,
        weekDayMask : 0x700
      },
      tableFlag : {
      },
      columnFlag : {
      },
      remoteExecFlag : {
        queued : 0x01,
        executing : 0x02,
        ready : 0x04,
        cancelled : 0x08,
        error : 0x10
      }
    }
  });
})();
(function(){

  var a = "report/get_result_subrows",b = "&svc=report/export_result&params=",c = "&svc=report/get_result_photo&params=",d = "report/select_result_rows",e = "wialon.report.ReportResult",f = "&svc=report/get_result_map&params=",g = "qx.strict",h = "report/get_result_rows",i = "report/hittest_chart",j = "&svc=report/get_result_chart&params=",k = "report/render_json",l = "object",m = "?sid=",n = "report/get_result_video",o = "Object";
  qx.Class.define(e, {
    extend : qx.core.Object,
    construct : function p(q){

      if(qx.core.Environment.get(g)){

        this.callee(p, arguments);
      } else {

        qx.core.Object.call(this);
      };
      this._data = q;
    },
    properties : {
      layer : {
        init : null,
        check : o,
        nullable : true
      }
    },
    members : {
      _data : null,
      getTables : function(){

        return this._data.reportResult.tables;
      },
      isRendered : function(){

        return this._data.reportResult.msgsRendered;
      },
      isEmpty : function(){

        var r = 0,s = 0,t = 0;
        if(this._data.reportResult.tables)r = this._data.reportResult.tables.length;
        if(this._data.reportResult.stats)s = this._data.reportResult.stats.length;
        if(this._data.reportResult.attachments)t = this._data.reportResult.attachments.length;
        if(!r && !s && !t)return true;
        return false;
      },
      getTableRows : function(w, x, u, v){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          tableIndex : w,
          indexFrom : x,
          indexTo : u
        }, wialon.util.Helper.wrapCallback(v));
      },
      getRowDetail : function(A, y, z){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          tableIndex : A,
          rowIndex : y
        }, wialon.util.Helper.wrapCallback(z));
      },
      selectRows : function(C, D, B){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          tableIndex : C,
          config : D
        }, wialon.util.Helper.wrapCallback(B));
      },
      renderJSON : function(F, E, I, H, J, G){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          attachmentIndex : F,
          width : E,
          useCrop : I,
          cropBegin : H,
          cropEnd : J
        }, wialon.util.Helper.wrapCallback(G));
      },
      getMessages : function(M, K, L){

        var N = {
          index : 0,
          indexFrom : M,
          indexTo : K
        };
        this.getUnitMessages(N, L);
      },
      getUnitMessages : function(T, S){

        S = wialon.util.Helper.wrapCallback(S);
        if(!T){

          S(3);
          return;
        };
        var P = T.index;
        var R = T.indexFrom;
        var O = T.indexTo;
        var Q = this.getLayer();
        if(Q && Q instanceof wialon.render.MessagesLayer)Q.getMessages(P, R, O, S); else S(3);
      },
      getStatistics : function(){

        return this._data.reportResult.stats;
      },
      getAttachments : function(){

        return this._data.reportResult.attachments;
      },
      getChartUrl : function(W, bc, U, X, bb, Y, be, V){

        var bd = {
          reportResourceId : this._data.reportResourceId,
          attachmentIndex : W,
          action : bc,
          width : U,
          height : X,
          autoScaleY : bb,
          pixelFrom : Y,
          pixelTo : be,
          flags : V,
          rnd : (new Date).getTime()
        };
        var ba = wialon.core.Session.getInstance();
        return ba.getBaseUrl() + ba.getApiPath() + m + ba.getId() + j + encodeURIComponent(wialon.util.Json.stringify(bd));
      },
      hitTestChart : function(bg, bf){

        var bh = {
        };
        if(bg && typeof bg == l){

          bh = bg;
        } else if(arguments.length > 2){

          bh.attachmentIndex = arguments[0];
          bh.datasetIndex = arguments[1];
          bh.valueX = arguments[2];
          bh.valueY = arguments.length > 6 ? arguments[3] : 0;
          bh.flags = arguments.length > 6 ? arguments[4] : 0;
          bh.cropBegin = arguments.length > 6 ? arguments[5] : 0;
          bh.cropEnd = arguments.length > 6 ? arguments[6] : 0;
          bf = arguments[arguments.length - 1];
        };
        return wialon.core.Remote.getInstance().remoteCall(i, {
          attachmentIndex : bh.attachmentIndex,
          datasetIndex : bh.datasetIndex,
          valueX : bh.valueX,
          valueY : bh.valueY,
          flags : bh.flags,
          cropBegin : bh.cropBegin,
          cropEnd : bh.cropEnd
        }, wialon.util.Helper.wrapCallback(bf));
      },
      getExportUrl : function(bl, bk){

        var bj = qx.lang.Object.clone(bk);
        bj.format = bl;
        var bi = wialon.core.Session.getInstance();
        return bi.getBaseUrl() + bi.getApiPath() + m + bi.getId() + b + encodeURIComponent(wialon.util.Json.stringify(bj));
      },
      getMapUrl : function(bm, bp){

        var bo = {
          width : bm,
          height : bp,
          rnd : (new Date).getTime()
        };
        var bn = wialon.core.Session.getInstance();
        return bn.getBaseUrl() + bn.getApiPath() + m + bn.getId() + f + encodeURIComponent(wialon.util.Json.stringify(bo));
      },
      getPhotoUrl : function(bt, bs, bu){

        var bq = {
          attachmentIndex : bt,
          border : bs,
          rnd : (new Date).getTime(),
          type : bu || 0
        };
        var br = wialon.core.Session.getInstance();
        return br.getBaseUrl() + br.getApiPath() + m + br.getId() + c + encodeURIComponent(wialon.util.Json.stringify(bq));
      },
      getVideoUrl : function(bx, bv){

        var bw = {
          attachmentIndex : bx,
          rnd : (new Date).getTime()
        };
        return wialon.core.Remote.getInstance().remoteCall(n, bw, wialon.util.Helper.wrapCallback(bv));
      },
      getLayerData : function(){

        return this._data.reportLayer;
      }
    },
    statics : {
      chartFlag : {
        headerTop : 0x01,
        headerBottom : 0x02,
        headerNone : 0x04,
        axisUpDown : 0x40,
        axisDownUp : 0x80,
        legendTop : 0x100,
        legendBottom : 0x200,
        legendLeft : 0x400,
        legendShowAlways : 0x1000
      },
      exportFormat : {
        html : 0x1,
        pdf : 0x2,
        xls : 0x4,
        xlsx : 0x8,
        xml : 0x10,
        csv : 0x20
      }
    }
  });
})();
(function(){

  var a = "unit/get_events",b = "*",c = "unit/update_event_data",d = "sensors",e = "ignition",f = "trips",g = "wialon.item.MUnitEvents";
  qx.Mixin.define(g, {
    members : {
      getTripsHistory : function(k, i, j, h){

        return this.__fL(f, k, i, j, 0, 0, b, h);
      },
      getCurrentTrip : function(m, l){

        return this.__fL(f, 0, 0, 0, m, 0, b, l);
      },
      updateTripsData : function(q, r, o, p, n){

        return this.__fM(q, f, r, o, p, 0, b, n);
      },
      resetTrips : function(t, s){

        return this.__fL(f, t ? -1 : -2, 0, 0, 0, 0, b, s);
      },
      getIgnitionHistory : function(y, w, u, z, x, v){

        return this.__fL(e, y, w, u, 0, z, x, v);
      },
      getCurrentIgnition : function(A, B, C, D){

        return this.__fL(e, 0, 0, 0, C, A, B, D);
      },
      updateIgnitionData : function(H, I, F, G, E){

        return this.__fM(H, e, I, F, G, 0, b, E);
      },
      resetIgnition : function(K, J){

        return this.__fL(e, K ? -1 : -2, 0, 0, 0, 0, b, J);
      },
      getSensorsHistory : function(P, N, L, Q, O, M){

        return this.__fL(d, P, N, L, 0, Q, O, M);
      },
      getCurrentSensors : function(R, S, T, U){

        return this.__fL(d, 0, 0, 0, T, R, S, U);
      },
      updateSensorsData : function(Y, ba, W, X, V){

        return this.__fM(Y, d, ba, W, X, 0, b, V);
      },
      resetSensors : function(bc, bb){

        return this.__fL(e, bc ? -1 : -2, 0, 0, 0, 0, b, bb);
      },
      __fL : function(be, bj, bh, bd, bf, bi, bk, bg){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : this.getId(),
          eventType : be,
          ivalType : bj,
          ivalFrom : bh,
          ivalTo : bd,
          diffOnly : bf,
          filter1 : bi,
          filter2 : bk
        }, wialon.util.Helper.wrapCallback(bg));
      },
      __fM : function(bs, bm, bq, bo, bl, bp, br, bn){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          params : bs,
          eventType : bm,
          ivalType : bq,
          ivalFrom : bo,
          ivalTo : bl,
          filter1 : bp,
          filter2 : br
        }, wialon.util.Helper.wrapCallback(bn));
      }
    }
  });
})();
(function(){

  var a = "order/detach",b = "object",c = "wialon.item.MOrder",d = "assign",e = "register",f = "number",g = "&svc=order/get_attachment&params=",h = "order/update",i = "?sid=",j = "order/complete_from_history",k = "order/attach",l = "order/list_attachments",m = "order/optimize",n = "order/route_update",o = "undefined",p = "confirm",q = "reject";
  qx.Mixin.define(c, {
    members : {
      getOrderAttachments : function(s, r){

        return wialon.core.Remote.getInstance().remoteCall(l, {
          itemId : this.getId(),
          id : s.id
        }, wialon.util.Helper.wrapCallback(r));
      },
      attachToOrder : function(u, t, v){

        return wialon.core.Uploader.getInstance().uploadFiles([t], k, {
          itemId : this.getId(),
          id : u.id
        }, v, true);
      },
      rejectOrder : function(x, w){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : q,
          itemId : this.getId(),
          id : x.id
        }, wialon.util.Helper.wrapCallback(w));
      },
      confirmOrder : function(z, y){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : p,
          itemId : this.getId(),
          id : z.id
        }, wialon.util.Helper.wrapCallback(y));
      },
      detachFromOrder : function(B, C, A){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : this.getId(),
          id : B.id,
          path : C
        }, wialon.util.Helper.wrapCallback(A));
      },
      getOrderAttachment : function(E, F){

        var D = wialon.core.Session.getInstance();
        return D.getBaseUrl() + D.getApiPath() + i + D.getId() + g + encodeURIComponent(wialon.util.Json.stringify({
          itemId : this.getId(),
          id : E.id,
          path : F
        }));
      },
      assignUnitToOrder : function(H, I, G){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : d,
          itemId : this.getId(),
          id : H.id,
          u : I
        }, wialon.util.Helper.wrapCallback(G));
      },
      moveOrderToHistory : function(K, J){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : e,
          itemId : this.getId(),
          id : K.id
        }, wialon.util.Helper.wrapCallback(J));
      },
      remoteOptimizeOrderDelivery : function(Q, P, O, L, N){

        if(typeof N == o){

          N = L;
          L = 0;
        };
        if(typeof L != b){

          L = {
            addPoints : L
          };
        };
        if(typeof P != f){

          var M = wialon.util.Helper.wrapCallback(N);
          return wialon.core.Remote.getInstance().remoteCall(m, {
            itemId : this.getId(),
            orders : Q,
            units : P,
            flags : O,
            gis : L
          }, M);
        } else {

          var M = wialon.util.Helper.wrapCallback(N);
          return wialon.core.Remote.getInstance().remoteCall(m, {
            itemId : this.getId(),
            orders : Q,
            unitCount : P,
            flags : O,
            gis : L
          }, M);
        };
      },
      remoteCompleteOrdersFromHistory : function(S, R){

        var T = wialon.util.Helper.wrapCallback(R);
        return wialon.core.Remote.getInstance().remoteCall(j, {
          itemId : this.getId(),
          orders : S
        }, T);
      },
      routeUpdate : function(X, Y, U, V){

        var W = wialon.util.Helper.wrapCallback(V);
        return wialon.core.Remote.getInstance().remoteCall(n, {
          itemId : this.getId(),
          orders : X,
          routeId : Y,
          callMode : U
        }, W);
      }
    },
    statics : {
      status : {
        inactive : 0,
        active : 1,
        completedInTime : 2,
        completedOverdue : 3,
        canceled : 4
      },
      trackingFlag : {
        stopRequired : 0x1
      },
      statusFlag : {
        rejected : 0x100
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MOrderRoute",b = "order/route_update",c = "register";
  qx.Mixin.define(a, {
    members : {
      registerOrderRoute : function(f, d){

        var g = wialon.util.Helper.wrapCallback(d);
        var e = {
        };
        qx.lang.Object.mergeWith(e, f);
        qx.lang.Object.mergeWith(e, {
          itemId : this.getId(),
          callMode : c
        });
        return wialon.core.Remote.getInstance().remoteCall(b, e, g);
      }
    },
    statics : {
      statusMask : 0xFF,
      status : {
        notStarted : 0,
        started : 1,
        completed : 2,
        cancelled : 3
      },
      statusFlagsMask : 0xFFFFFF00,
      statusFlag : {
        expired : 0x100
      },
      trackingFlag : {
        strict : 0x01,
        fixed : 0x20
      }
    }
  });
})();
(function(){

  var a = "object",b = "qx.event.type.Data",c = "number",d = "Array",e = ".png",f = "driver/operate",g = "changeTagUnits",h = "resource/update_tag_units",i = "wialon.item.MTag",j = "/1/",k = "tagrun",l = "resource/bind_unit_tag",m = "say",n = "changeTagGroups",o = "/",p = "undefined",q = "resource/get_tag_bindings",r = "?sid=",s = "resource/upload_tag_image",t = "/avl_tag_image/";
  qx.Mixin.define(i, {
    construct : function(){

      var u = wialon.core.Session.getInstance();
      u.registerProperty(k, qx.lang.Function.bind(function(v, w){

        v.setTagUnits(w);
      }, this));
    },
    properties : {
      tagUnits : {
        init : null,
        check : d,
        event : g
      },
      tagGroups : {
        init : null,
        check : d,
        event : n
      }
    },
    members : {
      updateTagUnits : function(x, y){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          itemId : this.getId(),
          units : x
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(y)));
      },
      getTagImageUrl : function(A, C){

        if(typeof C == p || !C)C = 32;
        var B = wialon.core.Session.getInstance();
        var z = B.getBaseUrl() + t + this.getId() + o + A.id + o + C + j + A.ck + e + r + B.getId();
        return z;
      },
      setTagImage : function(E, D, F){

        if(typeof D == a && typeof D.resId == c && typeof D.tagId == c)return wialon.core.Remote.getInstance().remoteCall(s, {
          itemId : this.getId(),
          tagId : E.id,
          oldItemId : D.resId,
          oldTagId : D.tagId
        }, F);
        return wialon.core.Uploader.getInstance().uploadFiles([D], s, {
          itemId : this.getId(),
          tagId : E.id
        }, F);
      },
      bindTagToUnit : function(J, M, L, K, I){

        var G = 0;
        var H = 0;
        if(J)G = J.id;
        if(M)H = M.getId();
        return wialon.core.Remote.getInstance().remoteCall(l, {
          resourceId : this.getId(),
          tagId : G,
          time : L,
          unitId : H,
          mode : K
        }, wialon.util.Helper.wrapCallback(I));
      },
      getTagBindings : function(T, R, N, P, Q){

        var O = 0;
        var S = 0;
        if(R)O = R.id;
        if(T)S = T.getId();
        return wialon.core.Remote.getInstance().remoteCall(q, {
          resourceId : this.getId(),
          unitId : S,
          tagId : O,
          timeFrom : N,
          timeTo : P
        }, wialon.util.Helper.wrapCallback(Q));
      },
      registerChatMessage : function(W, V, U){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          resourceId : this.getId(),
          driverId : W.id,
          message : V,
          callMode : m
        }, wialon.util.Helper.wrapCallback(U));
      }
    },
    statics : {
      registerTagProperties : function(){

        var X = wialon.core.Session.getInstance();
        X.registerProperty(k, this.remoteUpdateTagUnits);
      },
      remoteUpdateTagUnits : function(Y, ba){

        Y.setTagUnits(ba);
      },
      flags : {
        Passenger : 0x01
      }
    },
    events : {
      "changeTagUnits" : b
    }
  });
})();
(function(){

  var a = "apps/list",b = "apps/update",c = "apps/delete",d = "apps/check_top_service",e = "apps/create",f = "wialon.util.Apps",g = "static";
  qx.Class.define(f, {
    type : g,
    statics : {
      createApplication : function(name, o, i, l, n, m, j, h, k){

        k = wialon.util.Helper.wrapCallback(k);
        return wialon.core.Remote.getInstance().remoteCall(e, {
          name : name,
          description : o,
          url : i,
          flags : l,
          langs : n,
          sortOrder : m,
          requiredServicesList : j,
          billingPlans : h
        }, k);
      },
      updateApplication : function(x, name, q, r, u, w, v, s, p, t){

        t = wialon.util.Helper.wrapCallback(t);
        return wialon.core.Remote.getInstance().remoteCall(b, {
          id : x,
          name : name,
          description : q,
          url : r,
          flags : u,
          langs : w,
          sortOrder : v,
          requiredServicesList : s,
          billingPlans : p
        }, t);
      },
      deleteApplication : function(z, y){

        y = wialon.util.Helper.wrapCallback(y);
        return wialon.core.Remote.getInstance().remoteCall(c, {
          id : z
        }, y);
      },
      getApplications : function(C, A, B){

        B = wialon.util.Helper.wrapCallback(B);
        return wialon.core.Remote.getInstance().remoteCall(a, {
          manageMode : C,
          filterLang : A
        }, B);
      },
      remoteCheckTopService : function(D){

        D = wialon.util.Helper.wrapCallback(D);
        return wialon.core.Remote.getInstance().remoteCall(d, {
        }, D);
      },
      urlFlags : {
        sid : 0x00000001,
        user : 0x00000002,
        baseUrl : 0x00000004,
        hostUrl : 0x00000008,
        lang : 0x00000010,
        authHash : 0x00000020
      },
      appTypes : {
        reportsServer : 0x00010000
      }
    }
  });
})();
(function(){

  var a = "update_agro_machine",b = "plots",c = "agro/update_machine",d = "delete_agro_crop",e = "create_agro_machine",f = "agroUnit",g = "crop",h = "agro/update_plot_group",i = "agro/get_plot_data",j = "plotGroup",k = "create_agro_equip",l = "aplt",m = "machine",n = "delete_agro_cul_type",o = "delete_agro_machine",p = "update_agro_plot_group",q = "delete_agro_equip",r = "cultivationType",s = "acltt",t = "delete_agro_msg",u = "create_agro_plot_group",v = "plot",w = "agro/update_equipment",x = "wialon.agro.MAgro",y = "update_agro_crop",z = "amch",A = "update_agro_unit_cfg",B = "equipment",C = "update_agro_fuel",D = "cultivationTypes",E = "machines",F = "delete_agro_plot",G = "agro/update_crop",H = "apltg",I = "equipments",J = "plotGroups",K = "delete_agro_plot_group",L = "create_agro_cul_type",M = "import_agro_plots",N = "agro/update_plot",O = "agro/update_cultivation_type",P = "aequ",Q = "create_agro_crop",R = "fuelRates",S = "create_agro_plot",T = "update_agro_plot",U = "update_agro_props",V = "crops",W = "update_agro_equip",X = "update_agro_cul_type",Y = "undefined",bb = "aclt";
  qx.Mixin.define(x, {
    members : {
      loadAgroLibrary : function(bc){

        if(!this._libraries)return false;
        if(typeof this._libraries[bc] != Y)return true;
        if(bc == b)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, l, v, N, i); else if(bc == J)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, H, j, h); else if(bc == E)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, z, m, c); else if(bc == I)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, P, B, w); else if(bc == D)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, s, r, O); else if(bc == V)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, bb, g, G); else if(bc == R)qx.Class.include(wialon.item.Resource, wialon.agro.MFuelRates); else if(bc == f)qx.Class.include(wialon.item.Unit, wialon.agro.MAgroUnit); else return false;;;;;;;;
        this._libraries[bc] = 1;
        return true;
      },
      logMessageAction : {
        agroCreatedCrop : Q,
        agroUpdatedCrop : y,
        agroDeletedCrop : d,
        agroCreatedCultivationType : L,
        agroUpdatedCultivationType : X,
        agroDeletedCultivationType : n,
        agroCreatedEquipment : k,
        agroUpdatedEquipment : W,
        agroDeletedEquipment : q,
        agroCreatedMachine : e,
        agroUpdatedMachine : a,
        agroDeletedMachine : o,
        agroCreatedPlot : S,
        agroUpdatedPlot : T,
        agroDeletedPlot : F,
        agroCreatedPlotGroup : u,
        agroUpdatedPlotGroup : p,
        agroDeletedPlotGroup : K,
        agroDeletedMessage : t,
        agroUpdatedProperties : U,
        agroUpdatedUnitSettings : A,
        agroUpdatedFuelRates : C,
        agroImportedAgroPlots : M
      }
    }
  });
})();
(function(){

  var a = "wialon.agro.MFuelRates",b = "agro/get_fuel_rates",c = "agro/update_fuel_rates";
  qx.Mixin.define(a, {
    members : {
      getFuelRates : function(d){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(d));
      },
      updateFuelRates : function(f, e){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          rates : f
        }, wialon.util.Helper.wrapCallback(e));
      }
    }
  });
})();
(function(){

  var a = "agro/update_agro_props",b = "wialon.agro.MAgroUnit",c = "agro/get_agro_props";
  qx.Mixin.define(b, {
    members : {
      getAgroProps : function(d){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(d));
      },
      updateAgroProps : function(f, e){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : this.getId(),
          props : f
        }, wialon.util.Helper.wrapCallback(e));
      }
    }
  });
})();
(function(){

  var a = "function",b = "undefined",c = "wialon.util.MDataFlagsHelper",d = "*",e = "",f = 'number',g = "id",h = "type",j = "col",k = "qx.event.type.Event",l = "access",m = "Integer",n = "string",o = "object";
  qx.Mixin.define(c, {
    members : {
      properties : {
        newItemsCheckingTimeout : {
          init : 600,
          check : m
        }
      },
      startBatch : function(){

        if(this.__eb)return 0;
        this.__eb = new Array;
        return 1;
      },
      finishBatch : function(p){

        p = wialon.util.Helper.wrapCallback(p);
        if(!this.__eb){

          p(2);
          return;
        };
        if(!this.__eb.length){

          this.__eb = null;
          p(0);
          return;
        };
        this.__fT(this.__eb);
        this.__eb = null;
      },
      addItems : function(q, t, r){

        r = wialon.util.Helper.wrapCallback(r);
        if(typeof t != o)return r(2);
        var s = {
          owner : q,
          spec : t,
          callback : r,
          mode : 1
        };
        if(this.__eb)this.__eb.push(s); else this.__fT([s]);
      },
      removeItems : function(u, x, v){

        v = wialon.util.Helper.wrapCallback(v);
        if(typeof x != o)return v(2);
        var w = {
          owner : u,
          spec : x,
          callback : v,
          mode : 2
        };
        if(this.__eb)this.__eb.push(w); else this.__fT([w]);
      },
      getItemsByOwner : function(C, z){

        if(typeof C != n || !C.length)return [];
        var y = [];
        for(var D in this.__fQ){

          var B = false;
          var A = wialon.core.Session.getInstance().getItem(D);
          if(!A)continue;
          if(z && z != A.getType())continue;
          if(this.__fQ[D][C])y.push(A);
        };
        return y;
      },
      getItemDataFlags : function(E, F){

        if(typeof E != n || !E.length)return 0;
        var G = this.__fQ[F];
        if(!G || !G[E])return 0;
        return G[E];
      },
      getItemByOwner : function(H, I){

        if(typeof H != n || !H.length)return null;
        var J = this.__fQ[I];
        if(!J || !J[H])return null;
        return wialon.core.Session.getInstance().getItem(I);
      },
      startNewItemsChecking : function(M){

        if(this.__fN)return;
        if(M && typeof M == o){

          var K = wialon.core.Session.getInstance().getClasses();
          for(var L in M){

            if(L in K)this.__fO[L] = 1;
          };
        };
        wialon.core.Session.getInstance().updateDataFlags([{
          type : l,
          data : 1,
          flags : 0,
          mode : 0
        }], qx.lang.Function.bind(function(N){

          if(N)return;
          this.__fN = true;
        }, this));
      },
      stopNewItemsChecking : function(){

        if(!this.__fN)return;
        wialon.core.Session.getInstance().updateDataFlags([{
          type : l,
          data : 0,
          flags : 0,
          mode : 0
        }], qx.lang.Function.bind(function(O){

          if(O)return;
          this.__fO = {
          };
          this.__fN = false;
        }, this));
      },
      startItemsCreationChecking : function(P){

        if(typeof this.__fR[P] != b)return;
        this.__fR[P] = {
        };
        this.findNewItems(P, true);
      },
      finishItemsCreationChecking : function(Q){

        if(typeof this.__fR[Q] == b)return;
        delete this.__fR[Q];
      },
      findNewItems : function(T, U, X, V){

        clearTimeout(this.__fP);
        this.__fP = null;
        wialon.core.Remote.getInstance().startBatch();
        var R = 0;
        if(X && !(T in this.__fR)){

          this.__fR[T] = {
          };
          R = 1;
        };
        for(var W in this.__fR){

          if(T && T != W)continue;
          var S = qx.lang.Function.bind(function(bf, bb, bh){

            if(bb)return;
            var bd = [];
            var bc = [];
            for(var i = 0;i < bh.items.length;i++){

              var bj = bh.items[i].getId();
              if(this.__fR[bf.itemsType][bj] || wialon.core.Session.getInstance().getItem(bj))continue;
              this.__fR[bf.itemsType][bj] = 1;
              bd.push({
                type : g,
                data : bj,
                flags : 0,
                mode : 0
              });
              bd.push({
                type : g,
                data : bj,
                flags : wialon.item.Item.dataFlag.base,
                mode : 1
              });
              bc.push(bj);
            };
            var bg = !bf.skipEvent && bc.length > 0;
            if(bg){

              wialon.core.Session.getInstance().checkNewItems({
                ids : bc,
                updateDataFlagsSpec : bd
              }, V);
            };
            var Y = 0;
            for(var bi in this.__fR[bf.itemsType])Y++;
            if(Y > bh.items.length){

              for(var bi in this.__fR[bf.itemsType]){

                var ba = 0;
                for(var i = 0;i < bh.items.length;i++){

                  if(bh.items[i].getId() == bi){

                    ba = bi;
                    break;
                  };
                };
                if(ba)continue;
                delete this.__fR[bf.itemsType][bi];
                this._onItemDeleted(this.getItem(bi));
              };
            };
            for(var i = 0;i < bh.items.length;i++){

              var be = bh.items[i];
              if(be && typeof be.dispose != b)be.dispose();
            };
            if(!bg && typeof V === a){

              V(null);
            };
          }, this, {
            itemsType : W,
            skipEvent : U ? 1 : 0
          });
          wialon.core.Session.getInstance().searchItems({
            itemsType : W,
            propName : d,
            propValueMask : d,
            sortType : e
          }, 1, wialon.item.Item.dataFlag.base, 0, 0xFFFFFFFF, S);
        };
        wialon.core.Remote.getInstance().finishBatch(qx.lang.Function.bind(function(bm, bk, bl){

          if(bm && bk){

            delete this.__fR[bl];
          };
          if(!this.__fP && !bm)this.__fP = setTimeout(qx.lang.Function.bind(this.findNewItems, this), this.__fS * 1000);
        }, this, X, R, T));
      },
      __fQ : {
      },
      __eb : null,
      __fP : null,
      __fR : {
      },
      __fS : 600,
      __fN : false,
      __fO : {
      },
      __fT : function(bv){

        if(!bv instanceof Array)return;
        wialon.core.Remote.getInstance().startBatch();
        for(var i = 0;i < bv.length;i++){

          var bq = bv[i];
          if(typeof bq != o)continue;
          bq.spec.mode = bq.mode;
          if(bq.mode == 1){

            var bo = qx.lang.Function.bind(this.__fU, this, bq);
            wialon.core.Session.getInstance().updateDataFlags([bq.spec], bo);
          } else if(bq.mode == 2){

            var br = [];
            if(bq.spec.type == g)br.push(bq.spec.data); else if(bq.spec.type == j)br = br.concat(bq.spec.data); else if(bq.spec.type == h){

              for(var bz in this.__fQ){

                var bt = wialon.core.Session.getInstance().getItem(bz);
                if(bt && bt.getType() == bq.spec.data)br.push(bz);
              };
            };;
            if(!br.length)continue;
            var bn = {
            };
            var bu = bq.spec.flags;
            for(var i = 0;i < br.length;i++){

              var bp = this.__fQ[br[i]];
              if(!bp)continue;
              if(!bp[bq.owner])continue;
              var bs = bp[bq.owner];
              if(typeof bs !== f)bs = 0;
              var bx = wialon.util.Number.and(bs, bu);
              bp[bq.owner] = wialon.util.Number.exclude(bs, bx);
              if(bx){

                for(var bw in bp)if(Object.prototype.hasOwnProperty.call(bp, bw)){

                  var by = bp[bw];
                  bx = wialon.util.Number.exclude(bx, by);
                };
              };
              if(bx){

                if(!bn[br[i]]){

                  bn[br[i]] = {
                    type : g,
                    data : br[i],
                    flags : 0,
                    mode : 2
                  };
                };
                bn[br[i]].flags = wialon.util.Number.or(bn[br[i]].flags, bx);
              };
            };
            for(var bz in bn)if(bn.hasOwnProperty(bz))wialon.core.Session.getInstance().updateDataFlags([bn[bz]]);;
            if(bq.callback)bq.callback();
          };
        };
        wialon.core.Remote.getInstance().finishBatch();
      },
      __fU : function(bC, bA){

        var bE = (new Date()).getTime();
        if(!bC)return;
        if(bA)return bC.callback ? bC.callback() : null;
        var bD = [];
        if(bC.spec.type == g)bD.push(bC.spec.data); else if(bC.spec.type == j)bD = bD.concat(bC.spec.data); else if(bC.spec.type == h){

          var bB = wialon.core.Session.getInstance().getItems(bC.spec.data);
          for(var i = 0;i < bB.length;i++)bD.push(bB[i].getId());
        };;
        for(var i = 0;i < bD.length;i++){

          var bF = bD[i];
          if(!this.__fQ[bF])this.__fQ[bF] = {
          };
          if(!this.__fQ[bF][bC.owner])this.__fQ[bF][bC.owner] = 0;
          this.__fQ[bF][bC.owner] = wialon.util.Number.or(this.__fQ[bF][bC.owner], bC.spec.flags);
        };
        return bC.callback ? bC.callback() : null;
      }
    },
    events : {
      "itemCreated" : k
    }
  });
})();
(function(){

  var a = "file/write_file",b = "&svc=file/get_file&params=",c = "file/list_files",d = "wialon.util.File",e = "{}",f = "file/read_file",g = "file/put_file",h = "file/rm",i = "files",j = "?sid=",k = "static",l = "error";
  qx.Class.define(d, {
    type : k,
    statics : {
      fileStorageType : {
        publicType : 1,
        protectedType : 2
      },
      getFileURL : function(m, q, n){

        var p = {
          itemId : m,
          path : q,
          flags : n
        };
        var o = wialon.core.Session.getInstance();
        return o.getBaseUrl() + o.getApiPath() + j + wialon.core.Session.getInstance().getId() + b + wialon.util.Json.stringify(p);
      },
      listFiles : function(r, v, t, u, s){

        u = this.__fW(u);
        wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : r,
          path : v,
          mask : t,
          flags : u
        }, wialon.util.Helper.wrapCallback(s));
      },
      rm : function(w, z, y, x){

        y = this.__fW(y);
        wialon.core.Remote.getInstance().remoteCall(h, {
          itemId : w,
          path : z,
          flags : y
        }, wialon.util.Helper.wrapCallback(x));
      },
      putFiles : function(A, F, B, E, G, C){

        G = this.__fW(G);
        var D = {
        };
        D.itemId = A;
        D.path = F;
        D.flags = G;
        wialon.core.Uploader.getInstance().uploadFiles(B, g, D, qx.lang.Function.bind(this.__fo, this, C), 1, E);
      },
      readFile : function(H, K, J, I){

        J = this.__fW(J);
        wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : H,
          path : K,
          flags : J
        }, wialon.util.Helper.wrapCallback(I));
      },
      writeFile : function(L, P, O, N, M){

        O = this.__fW(O);
        wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : L,
          path : P,
          flags : O,
          fileData : N
        }, wialon.util.Helper.wrapCallback(M));
      },
      __fo : function(Q, R, S){

        if(S && this.__fV(S, l) && this.__fV(S, i))Q(S.error, S.files); else Q(0, e);
      },
      __fV : function(U, V){

        if(U instanceof Object){

          var T = Object.keys(U);
          if(T.indexOf(V) !== -1)return true;
        };
        return false;
      },
      __fW : function(W){

        var X = W;
        if(!X)X = 0;
        return X;
      }
    }
  });
})();
(function(){

  var a = "route/optimize",b = "static",c = "wialon.util.Routing";
  qx.Class.define(c, {
    type : b,
    statics : {
      remoteOptimizeCourierRoute : function(d, f, e, g){

        g = wialon.util.Helper.wrapCallback(g);
        return wialon.core.Remote.getInstance().remoteCall(a, {
          pathMatrix : d,
          pointSchedules : f,
          flags : e
        }, g);
      },
      remoteOptimizeFlag : {
        fitSchedule : 0x1,
        optimizeDuration : 0x2,
        optimizeTime : 0x4,
        fixFirstPoint : 0x8,
        fixLastPoint : 0x10
      }
    }
  });
})();
(function(){

  var a = "plots",b = "Comic Sans MS",c = "agro/get_plots_by_point",d = "render",e = "wialon.agro.Helper",f = "agro/update_unit_settings",g = "agro/import_plots",h = "Courier New",j = "agro/upload_cultivation",k = "Arial Black",l = "static",m = "agro/get_units_in_plots",n = "DejaVuSans-BoldOblique",o = "Impact",p = "Arial",q = "Georgia",r = "DejaVuSans",s = "uploadTrack",t = "agro/delete_cultivation_msg",u = "Times New Roman",v = "Trebuchet MS",w = "",x = "register",y = "clear",z = "agro/upload_plot",A = "register_ex",B = "&svc=agro/export_plots&params=",C = "agro/convert_plots",D = "upload",E = "Verdana",F = "&svc=agro/print_plots&params=",G = "agro/update_cultivation_msg",H = "DejaVuSans-Oblique",I = "?sid=",J = "agro/get_cultivations",K = "DejaVuSans-Bold",L = "agro/create_plots_layer",M = "undefined",N = "agro/get_unit_settings",O = "object";
  qx.Class.define(e, {
    type : l,
    statics : {
      getPlotsInPoint : function(Q, P){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          spec : Q
        }, wialon.util.Helper.wrapCallback(P));
      },
      getCultivations : function(ba, V, S, U, Y, T, W){

        var X = wialon.core.Session.getInstance().getRenderer();
        if(!X)return;
        var R = X.getLayers();
        for(var i = R.length - 1;i >= 0;i--){

          if(R[i].getName() == Y){

            R[i].dispose();
            qx.lang.Array.remove(R, R[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(J, {
          plotItemId : ba,
          plotId : V,
          timeFrom : S,
          timeTo : U,
          layerName : typeof Y == M ? w : Y,
          paintingScheme : T ? T : null
        }, qx.lang.Function.bind(this.__fY, this, wialon.util.Helper.wrapCallback(W)), 300);
      },
      getCultivationsList : function(be, bb, bd, bf, bc){

        return wialon.core.Remote.getInstance().remoteCall(J, {
          plotItemId : be,
          plotId : bb,
          timeFrom : bd,
          timeTo : bf,
          layerName : w,
          paintingScheme : null
        }, wialon.util.Helper.wrapCallback(bc), 300);
      },
      uploadCultivation : function(bg, bi, bh, bj){

        wialon.core.Uploader.getInstance().uploadFiles(bg, j, {
          tzOffset : bi,
          color : bh,
          callMode : D
        }, qx.lang.Function.bind(this.__ga, this, wialon.util.Helper.wrapCallback(bj)), true);
      },
      updateCultivationLayer : function(bn, bm, bk, bl){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          time : bn,
          action : bm,
          color : bk,
          callMode : d
        }, qx.lang.Function.bind(this.__gb, this, wialon.util.Helper.wrapCallback(bl)), 300);
      },
      uploadUnitCultivation : function(bx, bq, bt, bz, by, bw, bB, bs, br, bA, bo, bp, bu, bv){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          unitId : bx,
          timeFrom : bq,
          timeTo : bt,
          switchSensorId : bz,
          widthSensorId : by,
          flags : bw,
          tzOffset : bB,
          color : bs,
          defaultWidth : br,
          plotItemId : bA,
          plotId : bo,
          withinPlot : bp ? 1 : 0,
          callMode : s,
          filter : bu
        }, qx.lang.Function.bind(this.__ga, this, wialon.util.Helper.wrapCallback(bv)), 300);
      },
      uploadPlot : function(bC, bE, bD){

        wialon.core.Uploader.getInstance().uploadFiles(bC, z, {
          tzOffset : bE,
          callMode : D
        }, wialon.util.Helper.wrapCallback(bD), true);
      },
      uploadUnitPlot : function(bJ, bH, bI, bF, bG){

        return wialon.core.Remote.getInstance().remoteCall(z, {
          unitId : bJ,
          timeFrom : bH,
          timeTo : bI,
          switchSensorId : bF,
          callMode : s
        }, wialon.util.Helper.wrapCallback(bG), 300);
      },
      clearUploadedCultivation : function(bK){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          callMode : y
        }, qx.lang.Function.bind(this.__fX, this, wialon.util.Helper.wrapCallback(bK)), 300);
      },
      registerUploadedCultivation : function(bY, bS, bO, bX, bW, bQ, bP, bU, bN, bL, bR, bV, bM, bT){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          plotItemId : bY,
          plotId : bS,
          ctypeItemId : bO,
          ctypeId : bX,
          machineItemId : bW,
          machineId : bQ,
          equipItemId : bP,
          equipId : bU,
          description : bN,
          timeFrom : bL,
          timeTo : bR,
          unitId : bV,
          fuelFlags : bM,
          callMode : x
        }, wialon.util.Helper.wrapCallback(bT), 300);
      },
      registerUnitCultivation : function(cn, ca, ce, cm, cl, cf, cc, cj, cd, cb, cg, co, ck, ch, ci){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          plotItemId : cn,
          plotId : ca,
          ctypeItemId : ce,
          ctypeId : cm,
          machineItemId : cl,
          machineId : cf,
          equipItemId : cc,
          equipId : cj,
          description : cd,
          timeFrom : cb,
          timeTo : cg,
          tzOffset : co,
          unitId : ck,
          filter : ch,
          callMode : A
        }, wialon.util.Helper.wrapCallback(ci), 300);
      },
      createPlotsLayer : function(cu, ct, cr, cq){

        var cs = wialon.core.Session.getInstance().getRenderer();
        if(!cs)return;
        var cp = cs.getLayers();
        for(var i = cp.length - 1;i >= 0;i--){

          if(cp[i].getName() == cu){

            cp[i].dispose();
            qx.lang.Array.remove(cp, cp[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(L, {
          layerName : cu,
          plots : ct,
          flags : cr
        }, qx.lang.Function.bind(this.__fv, this, wialon.util.Helper.wrapCallback(cq)), 300);
      },
      getPrintUrl : function(cv){

        var cx = {
        };
        if(cv && typeof cv == O){

          cx = cv;
        } else if(arguments.length > 8){

          cx.fileType = arguments[0];
          cx.isPlotGroup = arguments[1];
          cx.plots = arguments[2];
          cx.imageFlags = arguments[3];
          cx.plotFlags = arguments[4];
          if(arguments.length > 9){

            cx.mapScale = arguments[5];
            cx.font = arguments[6];
            cx.fontSize = arguments[7];
            cx.fontColor = arguments[8];
            cx.lang = arguments[9];
          } else {

            cx.font = arguments[5];
            cx.fontSize = arguments[6];
            cx.fontColor = arguments[7];
            cx.lang = arguments[8];
          };
          cx.rnd = (new Date).getTime();
        };
        var cw = wialon.core.Session.getInstance();
        return cw.getBaseUrl() + cw.getApiPath() + I + cw.getId() + F + wialon.util.Json.stringify(cx);
      },
      getUnitSettings : function(cz, cy){

        return wialon.core.Remote.getInstance().remoteCall(N, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(cy), 300);
      },
      updateUnitSettings : function(cA, cD, cB, cE, cC){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          unitId : cA,
          machineItemId : cD,
          machineId : cB,
          settings : cE
        }, wialon.util.Helper.wrapCallback(cC), 300);
      },
      convertPlots : function(cF, cG, cH){

        return wialon.core.Remote.getInstance().remoteCall(C, {
          resourceId : cF,
          plots : cG
        }, wialon.util.Helper.wrapCallback(cH), 300);
      },
      updateCultivationMsg : function(cO, cL, cI, cK, cJ, cN, cM){

        return wialon.core.Remote.getInstance().remoteCall(G, {
          plotItemId : cO,
          plotId : cL,
          timeFrom : cI,
          timeTo : cK,
          msgIndex : cJ,
          params : cN
        }, wialon.util.Helper.wrapCallback(cM), 300);
      },
      deleteCultivationMsg : function(cU, cS, cP, cR, cQ, cT){

        return wialon.core.Remote.getInstance().remoteCall(t, {
          plotItemId : cU,
          plotId : cS,
          timeFrom : cP,
          timeTo : cR,
          msgIndex : cQ
        }, wialon.util.Helper.wrapCallback(cT), 300);
      },
      getPlotsUrl : function(cW, cV, cY){

        var cX = wialon.core.Session.getInstance();
        return cX.getBaseUrl() + cX.getApiPath() + I + cX.getId() + B + wialon.util.Json.stringify({
          fileName : cW ? cW : a,
          plots : cV,
          tzOffset : cY
        });
      },
      importPlot : function(db, dc, da){

        wialon.core.Uploader.getInstance().uploadFiles([db], g, {
          tzOffset : dc,
          callMode : D
        }, wialon.util.Helper.wrapCallback(da), true);
      },
      registerPlots : function(dd, df, de, dg){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          resourceId : dd,
          groupId : df,
          config : de,
          callMode : x
        }, wialon.util.Helper.wrapCallback(dg), 300);
      },
      getUnitsInPlots : function(dh){

        return wialon.core.Remote.getInstance().remoteCall(m, {
        }, wialon.util.Helper.wrapCallback(dh), 300);
      },
      print : {
        fileType : {
          svg : 0x01,
          png : 0x02
        },
        imageFlag : {
          a0 : 0x01,
          a1 : 0x02,
          a2 : 0x04,
          a3 : 0x08,
          a4 : 0x10,
          attachMap : 0x20,
          colored : 0x40
        },
        mapScale : {
          normal : 0x00,
          x2 : 0x01,
          x4 : 0x02,
          x6 : 0x03,
          x8 : 0x04,
          x10 : 0x05,
          x20 : 0x06,
          x50 : 0x07,
          x100 : 0x08,
          x200 : 0x09,
          x400 : 0x0A,
          x1000 : 0x0B
        },
        font : {
          dejaVuSans : r,
          dejaVuSansOblique : H,
          dejaVuSansBold : K,
          dejaVuSansBoldOblique : n,
          arial : p,
          arialBlack : k,
          courierNew : h,
          comicSansMS : b,
          georgia : q,
          impact : o,
          timesNewRoman : u,
          trebuchetMS : v,
          verdana : E
        },
        plotFlag : {
          placementHorizontal : 0x00,
          landscape : 0x01,
          rotate90CCW : 0x02,
          plotName : 0x04,
          plotDescription : 0x08,
          plotArea : 0x10,
          usefulPlotArea : 0x20,
          crop : 0x40,
          placementVertical : 0x80
        }
      },
      __fX : function(dk, dj, dm){

        var dl = wialon.core.Session.getInstance().getRenderer();
        if(!dl)return;
        if(dj == 0 && dm){

          var di = dl.getLayers();
          for(var i = di.length - 1;i >= 0;i--){

            if(di[i].getName() == dm.layerName){

              di[i].dispose();
              qx.lang.Array.remove(di, di[i]);
            };
          };
          dl.setVersion(dl.getVersion() + 1);
        };
        dk(dj, dm);
      },
      __fv : function(dn, dq, dr){

        var ds = wialon.core.Session.getInstance().getRenderer();
        if(!ds)return;
        var dp = null;
        if(dq == 0 && dr){

          if(typeof dr.name != M){

            dp = new wialon.render.Layer(dr);
            ds.getLayers().push(dp);
          };
          ds.setVersion(ds.getVersion() + 1);
        };
        dn(dq, dp);
      },
      __fY : function(dt, dv, dw){

        var dx = wialon.core.Session.getInstance().getRenderer();
        if(!dx)return;
        var du = null;
        if(dv == 0 && dw && dw.layer){

          if(typeof dw.layer.name != M){

            du = new wialon.render.Layer(dw.layer);
            dx.getLayers().push(du);
          };
          dx.setVersion(dx.getVersion() + 1);
        };
        dt(dv, {
          layer : du,
          cultivation : dw.cultivation
        });
      },
      __ga : function(dB, dA, dC){

        var dD = wialon.core.Session.getInstance().getRenderer();
        if(!dD)return;
        var dz = null;
        if(dA == 0 && dC && dC.data && dC.data.layer){

          var dy = dD.getLayers();
          for(var i = dy.length - 1;i >= 0;i--){

            if(dy[i].getName() == dC.data.layer.name){

              dy[i].dispose();
              qx.lang.Array.remove(dy, dy[i]);
            };
          };
          if(typeof dC.data.layer.name != M){

            dz = new wialon.render.Layer(dC.data.layer);
            dD.getLayers().push(dz);
          };
          dD.setVersion(dD.getVersion() + 1);
        };
        dB(dA, {
          layer : dz,
          registrar : (dC && dC.data) ? dC.data.registrar : []
        });
      },
      __gb : function(dE, dF, dG){

        var dH = wialon.core.Session.getInstance().getRenderer();
        if(!dH)return;
        dH.setVersion(dH.getVersion() + 1);
        dE(dF, dG);
      }
    }
  });
})();
(function(){

  var e = "-",h = "'",j = "0",m = "",n = "&deg;",q = "wialon.util.Geometry",t = "00",u = "render/calculate_polygon",w = " ",x = "render/calculate_polyline",y = "static",z = "object";
  qx.Class.define(q, {
    type : y,
    statics : {
      getDistance : function(I, L, J, M){

        var k = Math.PI / 180;
        var H = 1 / 298.257;
        var c,d,f,g,C,B,l,o,r,s,G,F,N,D,O,E,K,A;
        if(I == J && L == M)return 0;
        f = (I + J) / 2;
        g = (I - J) / 2;
        l = (L - M) / 2;
        N = Math.sin(g * k);
        D = Math.cos(g * k);
        O = Math.sin(f * k);
        E = Math.cos(f * k);
        K = Math.sin(l * k);
        A = Math.cos(l * k);
        G = Math.pow(N * A, 2);
        F = Math.pow(E * K, 2);
        s = G + F;
        G = Math.pow(D * A, 2);
        F = Math.pow(O * K, 2);
        c = G + F;
        o = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / o;
        d = 2 * o * 6378.137;
        C = (3 * r - 1) / (2 * c);
        B = (3 * r + 1) / (2 * s);
        G = O * D;
        G = G * G * C * H + 1;
        F = E * N;
        F = F * F * B * H;
        return d * (G - F) * 1000;
      },
      getCoordDegrees : function(Q, R, P, T, S, U){

        if(!U)U = n;
        return Q.toFixed(6) + U;
      },
      getCoordMinutes : function(W, X, V, bb, Y, bc){

        if(!bc)bc = n;
        var v = Number(W);
        var ba = (v < 0) ? e : m;
        var be = v > 0 ? bb : Y;
        v = Math.abs(v);
        var bf = Math.floor(v);
        var bd = (v - bf) * 60.0;
        var p = String(bd);
        if(bd < 10)p = j + bd;
        var bg = m;
        if(X == 2){

          if(bf >= 0 && bf < 10)bg = j + bf; else bg = bf;
        } else if(X == 3){

          if(bf >= 0 && bf < 10)bg = t + bf; else if(bf >= 10 && bf < 100)bg = j + bf; else bg = bf;;
        };
        bg = ba + bg;
        return be + w + bg + bc + w + p.substr(0, V + 3) + h;
      },
      getCoord : function(bi, bj, bh, bl, bk, bm){

        return this.getCoordMinutes(bi, bj, bh, bl, bk, bm);
      },
      getDistanceToLine : function(br, bo, bt, bn, bw, bq, bp){

        var bu = {
        };
        if(br == bt && bo == bn)return this.getDistance(br, bo, bw, bq);
        var bv = 0;
        var bs = 0;
        if(bo != bn){

          var a = (br - bt) / (bo - bn);
          var b = br - bo * a;
          bv = (bq + a * bw - a * b) / (a * a + 1.0);
          bs = bv * a + b;
        } else {

          var a = (bo - bn) / (br - bt);
          var b = bo - br * a;
          bs = (bw + a * bq - a * b) / (a * a + 1.0);
          bv = bs * a + b;
        };
        if(!bp)return this.getDistance(bs, bv, bw, bq);
        if(bv < bo && bv < bn || bv > bo && bv > bn || bs < br && bs < bt || bs > br && bs > bt)return -1; else return this.getDistance(bs, bv, bw, bq);
      },
      pointInShape : function(bH, bI, bE, bz, bL){

        if(!bH || typeof bH != z)return false;
        var bA = bH.length;
        if(bH.length > 2 && bI == 0){

          if(bL && !(bz >= bL.min_y && bz <= bL.max_y && bE >= bL.min_x && bE <= bL.max_x))return;
          var bJ = 0;
          var bF = 0;
          var bD = 0;
          var bx = 0;
          var by = 0;
          var bB = 0;
          var bK = 0;
          var bM = 0;
          var bC = false;
          bD = bH[bA - 1].x;
          bx = bH[bA - 1].y;
          for(var i = 0;i < bA;i++){

            bJ = bH[i].x;
            bF = bH[i].y;
            if(bJ > bD){

              by = bD;
              bK = bJ;
              bB = bx;
              bM = bF;
            } else {

              by = bJ;
              bK = bD;
              bB = bF;
              bM = bx;
            };
            if((bJ < bE) == (bE <= bD) && (bz - bB) * (bK - by) < (bM - bB) * (bE - by)){

              bC = !bC;
            };
            bD = bJ;
            bx = bF;
          };
          return bC;
        } else if(bH.length > 1 && bI){

          if(bL && !(bz >= bL.min_y && bz <= bL.max_y && bE >= bL.min_x && bE <= bL.max_x))return;
          var bO = 0;
          var bN = 0;
          for(var i = 0;i < bA;i++){

            var bG = this.getDistance(bH[i].y, bH[i].x, bz, bE);
            if(bI && bG != -1 && bG <= bI)return true;
            if(bI){

              if(bG != -1 && bG <= bI / 2)return true;
              if(i > 0){

                var bG = this.getDistanceToLine(bH[i].y, bH[i].x, bO, bN, bz, bE, true);
                if(bG != -1 && bG <= bI / 2)return true;
              };
            };
            bO = bH[i].y;
            bN = bH[i].x;
          };
        } else if(bH.length == 1 && bI){

          var p = bH[0];
          bG = this.getDistance(p.y, p.x, bz, bE);
          if(bG != -1 && bG <= bI)return true;
        };;
        return false;
      },
      getShapeCenter : function(bT){

        if(!bT || typeof bT != z)return;
        var bU = bT.length;
        var bR = 0xFFFFFFFF;
        var bS = 0xFFFFFFFF;
        var bP = -0xFFFFFFFF;
        var bQ = -0xFFFFFFFF;
        for(var i = 0;i < bU;i++){

          if(bT[i].x < bR)bR = bT[i].x;
          if(bT[i].x > bP)bP = bT[i].x;
          if(bT[i].y < bS)bS = bT[i].y;
          if(bT[i].y > bQ)bQ = bT[i].y;
        };
        return {
          x : (bP + bR) / 2,
          y : (bQ + bS) / 2
        };
      },
      calculatePolygon : function(bW, bX, bV){

        wialon.core.Remote.getInstance().remoteCall(u, {
          p : bW,
          flags : bX
        }, wialon.util.Helper.wrapCallback(bV));
      },
      calculatePolyline : function(ca, cb, bY, cc){

        wialon.core.Remote.getInstance().remoteCall(x, {
          p : ca,
          flags : cb,
          w : bY
        }, wialon.util.Helper.wrapCallback(cc));
      },
      calculateBoundary : function(cj){

        var ci = 0;
        var cm = 0;
        var ch = 0;
        var co = 0;
        var cd = 0;
        if(!ci && !cm && !ch && !co){

          var cd = 0;
          for(var i = 0;i < cj.length;i++){

            var cn = cj[i];
            if(!ci && !cm && !ch && !co){

              ch = cn.y;
              ci = cn.y;
              co = cn.x;
              cm = cn.x;
              cd = cn.w;
            } else {

              if(co > cn.x)co = cn.x;
              if(cm < cn.x)cm = cn.x;
              if(ch > cn.y)ch = cn.y;
              if(ci < cn.y)ci = cn.y;
              if(cn.radius > cd)cd = cn.w;
            };
          };
          var ce = wialon.util.Geometry.getDistance(ch, co, ch + 1, co);
          var ck = wialon.util.Geometry.getDistance(ch, co, ch, co + 1);
          if(ce && ck){

            ch -= cd / ce;
            co -= cd / ck;
            ci += cd / ce;
            cm += cd / ck;
          };
        };
        return {
          min_y : ch,
          min_x : co,
          max_y : ci,
          max_x : cm
        };
      }
    }
  });
})();
(function(){

  var a = "resource/upload_tacho_file",b = "&svc=exchange/export_zones&params=",c = "wlb",d = "string",e = "static",f = "exchange/import_zones_save",g = ">",h = "<",i = "wln",j = "",k = "exchange/import_csv",l = "&svc=exchange/export_json&params=",m = "&svc=exchange/export_messages&params=",n = "exchange/import_json",o = "plt",p = "core/search_item",q = "txt",r = "kml",s = "exchange/import_xml",t = "exchange/import_pois_save",u = "&svc=exchange/export_pois&params=",v = "wialon.exchange.Exchange",w = "?sid=",x = ",";
  qx.Class.define(v, {
    type : e,
    statics : {
      msgExportFormat : {
        plt : o,
        nmea : q,
        kml : r,
        wln : i,
        wlb : c
      },
      getJsonExportUrl : function(z, B){

        if(typeof B != d || !B.length)B = (new Date()).getTime();
        var A = {
          json : z,
          fileName : B
        };
        var y = wialon.core.Session.getInstance();
        return y.getBaseUrl() + y.getApiPath() + w + y.getId() + l + encodeURI(qx.lang.Json.stringify(A).replace(/&lt;/g, h).replace(/&gt;/g, g));
      },
      importJson : function(C, D){

        wialon.core.Uploader.getInstance().uploadFiles(C, n, {
        }, D, true);
      },
      importXml : function(E, F){

        wialon.core.Uploader.getInstance().uploadFiles(E, s, {
        }, F, true);
      },
      importCsv : function(G, I, H){

        if(qx.lang.Type.isFunction(I))H = I;
        if(!qx.lang.Type.isString(I))I = x;
        H = wialon.util.Helper.wrapCallback(H);
        wialon.core.Uploader.getInstance().uploadFiles(G, k, {
          separator : I
        }, H, true);
      },
      getMessagesExportUrl : function(K, N, M){

        var J = {
          layerName : K,
          format : N,
          compress : M
        };
        var L = wialon.core.Session.getInstance();
        return L.getBaseUrl() + L.getApiPath() + w + L.getId() + m + qx.lang.Json.stringify(J);
      },
      getPOIsExportUrl : function(S, Q, R){

        if(!Q || !Q.length)return j;
        var P = {
          fileName : S,
          pois : Q,
          compress : R
        };
        var O = wialon.core.Session.getInstance();
        return O.getBaseUrl() + O.getApiPath() + w + O.getId() + u + qx.lang.Json.stringify(P);
      },
      getZonesExportUrl : function(X, T, W){

        if(!T || !T.length)return j;
        var U = {
          fileName : X,
          zones : T,
          compress : W
        };
        var V = wialon.core.Session.getInstance();
        return V.getBaseUrl() + V.getApiPath() + w + V.getId() + b + qx.lang.Json.stringify(U);
      },
      importPois : function(Y, ba, bb){

        return wialon.core.Remote.getInstance().remoteCall(t, {
          itemId : Y,
          pois : ba
        }, qx.lang.Function.bind(this.__gc, this, bb));
      },
      importZones : function(bd, bc, be){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : bd,
          zones : bc
        }, qx.lang.Function.bind(this.__gc, this, be));
      },
      getItemJson : function(bf, bg){

        bg = wialon.util.Helper.wrapCallback(bg);
        return wialon.core.Remote.getInstance().remoteCall(p, {
          id : bf,
          flags : wialon.util.Number.umax()
        }, qx.lang.Function.bind(bg));
      },
      uploadTachoFile : function(bh, bj, bi){

        wialon.core.Uploader.getInstance().uploadFiles(bh, a, {
          outputFlag : bj
        }, bi, true);
      },
      __gc : function(bk, bl, bm){

        if(bl || !bm){

          bk(bl);
          return;
        };
        bk(0, bm);
      }
    }
  });
})();
(function(){

  var a = "/gis_many_searchintelli",c = "/gis_copyright",d = "/gis_get_route",e = "/gis_get_one_to_many_route",f = "",g = "/gis_geocode",h = "number",i = "search",j = "/gis_searchintelli",k = "string",l = "render",m = "/gis_check_point",n = "routing",o = "wialon.util.Gis",q = "/gis_get_route_via_waypoints",r = "[object Array]",s = "/gis_search",t = "/gis_get_many_to_many_route",u = "geocode",v = "static",w = "object";
  qx.Class.define(o, {
    type : v,
    statics : {
      geocodingFlags : {
        level_countries : 1,
        level_regions : 2,
        level_cities : 3,
        level_streets : 4,
        level_houses : 5
      },
      searchFlags : {
        search_countries : 0,
        search_regions : 1,
        search_cities : 2,
        search_streets : 3,
        search_houses : 4,
        search_full_path : 0x100,
        search_map_name : 0x200,
        search_coords : 0x400
      },
      searchByStringFlags : {
        search_countries : 0x1,
        search_regions : 0x2,
        search_cities : 0x4,
        search_streets : 0x8,
        search_houses : 0x10
      },
      geocodingParams : {
        flags : 0,
        city_radius : 0,
        dist_from_unit : 0,
        txt_dist : f,
        house_detect_radius : 0
      },
      routingFlags : {
        CH : 0x1
      },
      routingViaWaypointsFlags : {
        detailed_information_by_section : 0x1
      },
      decodePoly : function(E){

        E = String(E);
        var B = [];
        var x = 0;
        var z = E.length;
        var D = 0;
        var F = 0;
        while(x < z){

          var y = 0;
          var G = 0;
          var b = 0;
          do {

            b = E.charCodeAt(x++) - 63;
            G |= (b & 0x1f) << y;
            y += 5;
          }while((b >= 0x20));
          var A = ((G & 1) != 0 ? ~(G >> 1) : (G >> 1));
          D += A;
          y = 0;
          G = 0;
          do {

            b = E.charCodeAt(x++) - 63;
            G |= (b & 0x1f) << y;
            y += 5;
          }while((b >= 0x20));
          var C = ((G & 1) != 0 ? ~(G >> 1) : (G >> 1));
          F += C;
          var p = {
            lat : D / 100000,
            lon : F / 100000
          };
          B.push(p);
        };
        return B;
      },
      getRoute : function(H, L, I, M, K, J){

        return this.getRouteBetween({
          origin : {
            lat : H,
            lon : L
          },
          destination : {
            lat : I,
            lon : M
          },
          flags : K
        }, J);
      },
      getRouteBetween : function(T, S){

        var N = T.origin,Q = T.destination,R = T.waypoints,U = T.flags,P = T.params,V = T.searchProvider;
        var self = this;
        S = wialon.util.Helper.wrapCallback(S);
        if(!N || !Q){

          S ? S(2, null) : null;
          return;
        };
        if(R && R.length)O(); else W();
        function W(){

          var X = N.lat,bc = N.lon,Y = Q.lat,be = Q.lon;
          if(typeof X != h || typeof bc != h || typeof Y != h || typeof be != h){

            S(2, null);
            return;
          };
          if(typeof U != h || !U)U = 0x1;
          var bb = {
            lat1 : X,
            lon1 : bc,
            lat2 : Y,
            lon2 : be,
            flags : U
          };
          var ba = wialon.core.Session.getInstance().getGisSid();
          if(ba){

            bb.gis_sid = ba;
          };
          var bd = wialon.core.Session.getInstance().getCurrUser();
          if(bd)bb.uid = bd.getId();
          if(V)bb.search_provider = V;
          if(P)bb.params = P;
          wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + d, bb, function(bf, bg){

            if(!bf){

              if(bg.points){

                bg.points = self.decodePoly(bg.points);
              };
              S(0, bg);
            } else S(bf, null);
          }, wialon.core.Remote.getInstance().getTimeout());
        };
        function O(){

          if(!R){

            S ? S(2, null) : null;
            return;
          };
          var bi = {
            data : {
              origin : N,
              destination : Q,
              waypoints : R,
              flags : (U ? U : 0)
            }
          };
          var bh = wialon.core.Session.getInstance().getGisSid();
          if(bh){

            bi.gis_sid = bh;
          };
          var bj = wialon.core.Session.getInstance().getCurrUser();
          if(bj)bi.uid = bj.getId();
          if(V)bi.search_provider = V;
          if(P)bi.params = P;
          wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + q, bi, function(bk, bl){

            if(!bk){

              if(bl.points){

                bl.points = self.decodePoly(bl.points);
              };
              S(0, bl);
            } else S(bk, null);
          }, wialon.core.Remote.getInstance().getTimeout());
        };
      },
      getRouteViaWaypoints : function(bm, bo, bp, bq, br){

        bq = wialon.util.Helper.wrapCallback(bq);
        if(!bm || !bo || !bp){

          bq ? bq(2, null) : null;
          return;
        };
        var bs = {
          data : {
            origin : bm,
            destination : bo,
            waypoints : bp,
            flags : (br ? br : 0)
          }
        };
        var bn = wialon.core.Session.getInstance().getGisSid();
        if(bn){

          bs.gis_sid = bn;
        };
        var bt = wialon.core.Session.getInstance().getCurrUser();
        if(bt)bs.uid = bt.getId();
        var self = this;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + q, bs, function(bu, bv){

          if(!bu){

            if(bv.points){

              bv.points = self.decodePoly(bv.points);
            };
            bq(0, bv);
          } else bq(bu, null);
        }, wialon.core.Remote.getInstance().getTimeout());
      },
      getManyToManyRoute : function(bx, bw){

        return this.manyToManyRouting({
          points : bx
        }, bw);
      },
      manyToManyRouting : function(bA, bB){

        var bC = bA.points,bG = bA.searchProvider;
        bB = wialon.util.Helper.wrapCallback(bB);
        var by = [];
        var bz = Array.isArray(bC) && bC.every(function(bH){

          if(!bH || (typeof bH.lat !== h) || (typeof bH.lon !== h))return false;
          by.push({
            lat : bH.lat,
            lon : bH.lon
          });
          return true;
        });
        if(!bz){

          bB ? bB(2, null) : null;
          return;
        };
        var bD = {
          data : {
            points : by
          }
        };
        var bE = wialon.core.Session.getInstance().getGisSid();
        if(bE){

          bD.gis_sid = bE;
        };
        var bF = wialon.core.Session.getInstance().getCurrUser();
        if(bF)bD.uid = bF.getId();
        if(bG)bD.search_provider = bG;
        var self = this;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + t, bD, function(bI, bJ){

          if(!bI){

            if(bJ.points){

              bJ.points = self.decodePoly(bJ.points);
            };
            bB(0, bJ);
          } else bB(bI, null);
        }, wialon.core.Remote.getInstance().getTimeout());
      },
      getOneToManyRoute : function(bP, bL, bN, bM){

        bM = wialon.util.Helper.wrapCallback(bM);
        if(!bN || !bN.length || typeof bP != h || typeof bL != h){

          bM ? bM(2, null) : null;
          return;
        };
        var bO = {
          data : {
            lat : bP,
            lon : bL,
            points : bN
          }
        };
        var bK = wialon.core.Session.getInstance().getGisSid();
        if(bK){

          bO.gis_sid = bK;
        };
        var bQ = wialon.core.Session.getInstance().getCurrUser();
        if(bQ)bO.uid = bQ.getId();
        var self = this;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + e, bO, function(bR, bS){

          if(!bR){

            if(bS.points){

              bS.points = self.decodePoly(bS.points);
            };
            bM(0, bS);
          } else bM(bR, null);
        }, wialon.core.Remote.getInstance().getTimeout());
      },
      getLevelFlags : function(bY, bW, bX, bU, bV){

        if(bY < 1 || bY > 5)return 1255211008;
        var bT = bY << 28;
        if(bW > 0 || bW < 6)bT += bW << 25;
        if(bX > 0 || bX < 6)bT += bX << 22;
        if(bU > 0 || bU < 6)bT += bU << 19;
        if(bV > 0 || bV < 6)bT += bV << 16;
        return bT;
      },
      getLocations : function(cb, ca){

        return this.pointsToAddresses({
          positions : cb
        }, ca);
      },
      pointsToAddresses : function(ci, ce){

        ce = wialon.util.Helper.wrapCallback(ce);
        if(!ci || !ci.positions){

          ce(2, null);
          return;
        };
        var cf = qx.lang.Object.clone(this.geocodingParams);
        var cg = wialon.core.Session.getInstance().getGisSid();
        if(cg){

          cf.gis_sid = cg;
        };
        var cc = ci.lang;
        if(cc){

          cf.lang = cc;
        };
        var cd = ci.positions;
        if(Array.isArray(cd)){

          cd = cd.map(function(cj){

            return {
              lat : cj.lat,
              lon : cj.lon
            };
          });
        };
        cf.coords = wialon.util.Json.stringify(cd);
        if(ci.searchProvider)cf.search_provider = ci.searchProvider;
        var ch = wialon.core.Session.getInstance().getCurrUser();
        if(ch)cf.uid = ch.getId();
        if(ci.log){

          cf.log = ci.log;
        };
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(u) + g, cf, ce, wialon.core.Remote.getInstance().getTimeout());
      },
      searchByString : function(cl, ck){

        var cm = {
        };
        if(cl && typeof cl == w){

          cm = cl;
        } else if(arguments.length > 2){

          cm.phrase = arguments[0];
          cm.flags = arguments[1];
          cm.count = arguments[2];
          if(arguments.length > 4){

            cm.allow_irrelevant = arguments[3];
            ck = arguments[4];
          } else {

            ck = arguments[3];
          };
        };
        return this.addressToPoints(cm, ck);
      },
      addressToPoints : function(cx, ct){

        ct = wialon.util.Helper.wrapCallback(ct);
        var cs = cx.phrase,cn = cx.count,cu = cx.flags || 0,co = cx.lang,cp = cx.allow_irrelevant;
        var cq = typeof cs == k || (typeof cs == w && typeof cs.phrase == k);
        if(!cq || typeof cn != h){

          ct(2, null);
          return;
        };
        var cv = {
          phrase : cs,
          flags : cu,
          count : cn,
          allow_irrelevant : cp
        };
        if(co){

          cv.lang = co;
        };
        var cr = wialon.core.Session.getInstance().getGisSid();
        if(cr){

          cv.gis_sid = cr;
        };
        if(cx.searchProvider)cv.search_provider = cx.searchProvider;
        var cw = wialon.core.Session.getInstance().getCurrUser();
        if(cw)cv.uid = cw.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(i) + j, cv, ct, wialon.core.Remote.getInstance().getTimeout());
      },
      searchByStringArray : function(cC, cB){

        var cG = {
        };
        if(cC && typeof cC == w){

          cG = cC;
        } else if(arguments.length > 2){

          cG.phrases = arguments[0];
          cG.flags = arguments[1];
          cG.count = arguments[2];
          if(arguments.length > 4){

            cG.allow_irrelevant = arguments[3];
            cB = arguments[4];
          } else {

            cB = arguments[3];
          };
        };
        cB = wialon.util.Helper.wrapCallback(cB);
        if(Object.prototype.toString.call(cG.phrases) !== r || typeof cG.count != h){

          cB(2, null);
          return;
        };
        var cA = cG.phrases,cy = cG.count,cF = cG.flags || 0,cz = cG.allow_irrelevant,cE = wialon.core.Session.getInstance().getGisSid();
        var cC = {
          phrases : cA,
          flags : cF,
          count : cy,
          allow_irrelevant : cz
        };
        if(cG.searchProvider)cC.search_provider = cG.searchProvider;
        if(cE){

          cC.gis_sid = cE;
        };
        var cD = wialon.core.Session.getInstance().getCurrUser();
        if(cD)cC.uid = cD.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(i) + a, cC, cB, wialon.core.Remote.getInstance().getTimeout());
      },
      search : function(cJ, cK, cI, cM, cN, cH, cL){

        cL = wialon.util.Helper.wrapCallback(cL);
        if(typeof cJ != k || typeof cK != k || typeof cI != k || typeof cM != k){

          cL(2, null);
          return;
        };
        var cO = {
          country : cJ,
          region : cK,
          city : cI,
          street : cM,
          flags : cN,
          count : cH
        };
        var cP = wialon.core.Session.getInstance().getGisSid();
        if(cP){

          cO.gis_sid = cP;
        };
        var cQ = wialon.core.Session.getInstance().getCurrUser();
        if(cQ)cO.uid = cQ.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(i) + s, cO, cL, wialon.core.Remote.getInstance().getTimeout());
      },
      copyright : function(cR, cX, cS, da, cU, cV){

        cV = wialon.util.Helper.wrapCallback(cV);
        if(typeof cR != h || typeof cX != h || typeof cS != h || typeof da != h || typeof cU != h){

          cV(2, null);
          return;
        };
        var cW = {
          lat1 : cR,
          lon1 : cX,
          lat2 : cS,
          lon2 : da,
          zoom : cU
        };
        var cT = wialon.core.Session.getInstance().getGisSid();
        if(cT){

          cW.gis_sid = cT;
        };
        var cY = wialon.core.Session.getInstance().getCurrUser();
        if(cY)cW.uid = cY.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(l) + c, cW, cV, wialon.core.Remote.getInstance().getTimeout());
      },
      checkPointForObject : function(dk, df, dd, de, db, dh, dc, di, dg){

        dg = wialon.util.Helper.wrapCallback(dg);
        if(typeof dk != h || typeof df != h || typeof dd != k || typeof de != k || typeof db != k || typeof dh != k || typeof di != h){

          dg(2, null);
          return;
        };
        var dl = {
          lat : dk,
          lon : df,
          country : dd,
          region : de,
          city : db,
          street : dh,
          house : dc,
          radius : di
        };
        var dj = wialon.core.Session.getInstance().getGisSid();
        if(dj){

          dl.gis_sid = dj;
        };
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(u) + m, dl, dg, wialon.core.Remote.getInstance().getTimeout());
      }
    }
  });
})();
(function(){

  var a = "=",b = "data",c = "error",d = "",e = 'POST',f = "wialon.core.NodeHttp",g = "http",h = 'sid=',i = "utf8",j = 'application/x-www-form-urlencoded',k = "qx.strict",l = '',m = "https",o = "sid",p = ":",q = "end",r = "&",s = "://",t = "object";
  qx.Class.define(f, {
    extend : qx.core.Object,
    construct : function u(v){

      if(qx.core.Environment.get(k)){

        this.callee(u, arguments);
      } else {

        qx.core.Object.call(this);
      };
      var w = wialon.core.Session.getInstance().getBaseUrl().split(s);
      if(w[0] == m){

        this._port = 443;
        this._http = require(m);
      } else {

        this._port = 80;
        this._http = require(g);
      };
      w = w[w.length - 1].split(p);
      if(w.length > 1)this._port = w[1];
      this._hostname = w[0];
      this._callbacks = {
      };
    },
    members : {
      send : function(z, A, y, C, B){

        var x = Buffer.from(this.__ek(A));
        var E = {
          method : e,
          host : this._hostname,
          port : this._port,
          path : z,
          headers : {
            'Content-Type' : j,
            'Content-Length' : x.length
          }
        };
        var D = {
          counter : ++this._counter,
          options : E,
          body : x
        };
        this._callbacks[this._counter] = [y, C, D, 0, B, null, d];
        this.__em(this._counter);
      },
      supportAsync : function(){

        return true;
      },
      _http : null,
      _hostname : d,
      _port : 80,
      _id : 0,
      _callbacks : {
      },
      _timeout : 0,
      _counter : 0,
      __ek : function(I){

        var F = [];
        var H = false;
        var G = wialon.core.Session.getInstance().getId();
        var J = G ? h + G : l;
        if(typeof I == t){

          for(var n in I){

            if(typeof I[n] == t)F.push(n + a + encodeURIComponent(wialon.util.Json.stringify(I[n]))); else F.push(n + a + encodeURIComponent(I[n]));
            if(n == o)H = true;
          };
          return F.join(r) + (!H ? J : l);
        };
        return !H ? J : l;
      },
      __el : function(L){

        var K = this._callbacks[L];
        if(!K)return;
        if(K[1])K[1]();
        delete this._callbacks[L];
      },
      __em : function(Q){

        var M = this._callbacks[Q];
        if(M[4])M.push(setTimeout(qx.lang.Function.bind(this.__el, this, Q), M[4] * 1000));
        var P = qx.lang.Function.bind(this.__eo, this, Q, 0, d);
        var O = qx.lang.Function.bind(function(R, S){

          S.setEncoding(i);
          S.on(b, qx.lang.Function.bind(this.__en, this, R));
          S.on(q, qx.lang.Function.bind(this.__eo, this, R));
        }, this, Q);
        var N = this._http.request(M[2].options, O).on(c, P);
        N.write(M[2].body);
        N.end();
      },
      __en : function(U, V){

        var T = this._callbacks[U];
        if(!T || !V)return;
        T[6] += V;
      },
      __eo : function(X){

        var W = this._callbacks[X];
        if(!W)return;
        var Y = wialon.util.Json.parse(W[6]);
        if(!Y){

          W[1]();
          return;
        };
        if(Y.error && Y.error == 1003 && W[3] < 3){

          W[3]++;
          W[6] = d;
          if(W[4] && W[5]){

            clearTimeout(W[5]);
            W[5] = setTimeout(qx.lang.Function.bind(this.__el, this, X), W[4] * 1000);
          };
          setTimeout(qx.lang.Function.bind(function(ba){

            this.__em(X);
          }, this, X), Math.random() * 1000);
          return;
        };
        if(W[0])W[0](Y);
        if(W[4] && W[5])clearTimeout(W[5]);
        delete this._callbacks[X];
      }
    }
  });
})();
(function(){

  var a = "account/trash",b = "list",c = "wialon.util.Trash",d = "restore",e = "wialon",f = "admin/trash",g = "static",h = "object";
  qx.Class.define(c, {
    type : g,
    statics : {
      getDeletedItems : function(j){

        j = wialon.util.Helper.wrapCallback(j);
        var k = {
          callMode : b
        };
        var i = a;
        var l = wialon.core.Session.getInstance().isLocal();
        if(l){

          i = f;
          k.creator = e;
        };
        return wialon.core.Remote.getInstance().remoteCall(i, k, j);
      },
      restoreDeletedItems : function(q, n){

        n = wialon.util.Helper.wrapCallback(n);
        if(typeof q != h)return n(2);
        var p = {
          callMode : d,
          guids : q.guids
        };
        var m = a;
        var o = wialon.core.Session.getInstance().isLocal();
        if(o){

          m = f;
          p.creator = e;
        };
        return wialon.core.Remote.getInstance().remoteCall(m, p, n);
      }
    }
  });
})();
(function(){

  var a = "Error performing request",b = "Item with such unique property already exists",c = "Invalid result",d = "Authorization server is unavailable, please try again later",e = "Internal billing error",f = "static",g = "Destination resource is not an account",h = "Error getting creator of destination account",i = "Error getting source account",j = "Error changing account of the item",k = "Access denied",l = "Messages count has exceeded the limit",m = "Invalid service",n = "Invalid user name or password",o = "Only one request of given time is allowed at the moment",p = "No message for selected interval",q = "Error moving item on a tree parents",r = "Abort batch request",s = "Execution time has exceeded the limit",t = "",u = "Error changing creator of the item",v = "wialon.core.Errors",w = "Item already in the destination account",x = "Invalid user name or e-mail",y = "Subsystem not available",z = "Invalid input item or source account",A = "Item is locked",B = "Invalid input",C = "Creator of destination account no access to item",D = "Error operation in the billing",E = "Selected user is a creator for some system objects, thus this user cannot be bound to a new account",F = "Invalid session",G = "Account is blocked",H = "Unknown error";
  qx.Class.define(v, {
    type : f,
    statics : {
      getErrorText : function(I){

        switch(I){case 0:
        return t;case 1:
        return F;case 2:
        return m;case 3:
        return c;case 4:
        return B;case 5:
        return a;case 6:
        break;case 7:
        return k;case 8:
        return n;case 9:
        return d;case 10:
        return r;case 11:
        return x;case 12:
        return y;case 1001:
        return p;case 1002:
        return b;case 1003:
        return o;case 1004:
        return l;case 1005:
        return s;case 2001:
        return z;case 2002:
        return g;case 2003:
        return e;case 2004:
        return G;case 2005:
        return h;case 2006:
        return C;case 2007:
        return i;case 2008:
        return w;case 2009:
        return q;case 2010:
        return D;case 2011:
        return e;case 2012:
        return j;case 2013:
        return u;case 2014:
        return E;case 2015:
        return A;default:
        break;};
        return H;
      }
    }
  });
})();
(function(){

  var a = "mm",b = "%m",c = "Esfand",e = "Mar",f = "Aug",g = "%b",h = "%",j = "May",k = "December",l = "Thursday",m = "hh",n = "dddd",o = "%l",p = "Bahman",q = "Jun",r = 'day',s = "June",u = "Oct",v = "Tuesday",w = "Friday",x = "tt",y = "Feb",z = "%e",A = "Jan",B = "Azar",C = "July",D = "pm",E = "January",F = "dd",G = "MMMM",H = "Shahrivar",I = "am",J = "%P",K = "H:m:s",L = "string",M = "Mordad",N = "HH:mm",O = "%a",P = "October",Q = "Nov",R = "tz",S = "PC",T = "Thu",U = "November",V = "0",W = "%Y",X = "March",Y = "ddd",cf = "g",cg = "%I",ch = "d",cb = "Fri",cc = "%A",cd = "yyyy-MM-dd",ce = "Tue",cm = "Tir",cn = "ss",co = "Apr",cp = "Monday",ci = "static",cj = "Day",ck = "%H",cl = "wialon.util.DateTime",ct = "September",cS = "HH",cT = "April",cu = "%p",cq = "Dec",cr = "Mehr",cW = "Sunday",cs = "August",cv = "February",cw = "Wed",cx = "%y",cB = "MM",cX = "%B",cC = "yy",cy = "Mon",cz = "yyyy-MM-dd HH:mm:ss",cV = "Sun",cA = "Jul",cG = "Aban",cH = "%S",da = "%02d %s %04d %02d:%02d:%02d",cI = "Khordad",cD = "number",cE = "Sep",cY = "%E",cF = "",cN = "Saturday",cO = "Sat",db = "Farvardin",cP = "MMM",cJ = "M",cK = 'days',cL = "Ordibehest",cM = "%M",cQ = "Wednesday",cR = "yyyy",cU = "undefined";
  qx.Class.define(cl, {
    type : ci,
    statics : {
      formatTime : function(df, dc, dd){

        if(!df || typeof df != cD)return cF;
        var self = this;
        var dg = dd;
        df = this.userTime(df);
        var d = new Date(df * 1000);
        if(!dg || typeof dg != L){

          dg = cz;
          if(dc){

            var dj = new Date(this.userTime(wialon.core.Session.getInstance().getServerTime()) * 1000);
            if((d.getUTCFullYear() == dj.getUTCFullYear() && d.getUTCMonth() == dj.getUTCMonth() && d.getUTCDate() == dj.getUTCDate()) || dc == 2)dg = N;
          };
        };
        if(dg.indexOf(h) < 0)dg = this.convertFormat(dg);
        function di(dk){

          var dl = false;
          var dm;
          return function(){

            if(dl)return dm;
            dm = dk();
            dl = true;
            return dm;
          };
        };
        var de = {
          "%A" : di(function(){

            return self.__gh.days[d.getUTCDay()];
          }),
          "%a" : di(function(){

            return self.__gh.days_abbrev[d.getUTCDay()];
          }),
          "%E" : di(function(){

            return self.__gd(d.getUTCDate());
          }),
          "%e" : di(function(){

            return d.getUTCDate();
          }),
          "%I" : di(function(){

            return self.__gd((d.getUTCHours() % 12) ? (d.getUTCHours() % 12) : 12);
          }),
          "%M" : di(function(){

            return self.__gd(d.getUTCMinutes());
          }),
          "%S" : di(function(){

            return self.__gd(d.getUTCSeconds());
          }),
          "%p" : di(function(){

            return d.getUTCHours() >= 12 ? D : I;
          }),
          "%Y" : di(function(){

            return d.getUTCFullYear();
          }),
          "%y" : di(function(){

            return self.__gd(d.getUTCFullYear() % 100);
          }),
          "%H" : di(function(){

            return self.__gd(d.getUTCHours());
          }),
          "%B" : di(function(){

            return self.__gh.months[d.getUTCMonth()];
          }),
          "%b" : di(function(){

            return self.__gh.months_abbrev[d.getUTCMonth()];
          }),
          "%m" : di(function(){

            return self.__gd(d.getUTCMonth() + 1);
          }),
          "%l" : di(function(){

            return d.getUTCMonth() + 1;
          }),
          "%P" : di(function(){

            return self.persianFormatTime(self.absoluteTime(df));
          })
        };
        var dh = /%A|%a|%E|%e|%I|%M|%S|%p|%Y|%y|%H|%B|%b|%m|%l|%P/g;
        dg = dg.replace(dh, function(dn){

          return de[dn]();
        });
        return dg;
      },
      formatDate : function(dr, dp){

        if(!dr || typeof dr != cD)return cF;
        var ds = dp;
        if(!ds || typeof ds != L)ds = cd;
        dr = this.userTime(dr);
        var d = new Date(dr * 1000);
        if(ds.indexOf(h) < 0)ds = this.convertFormat(ds);
        var dq = {
          "%A" : this.__gh.days[d.getUTCDay()],
          "%a" : this.__gh.days_abbrev[d.getUTCDay()],
          "%E" : this.__gd(d.getUTCDate()),
          "%e" : d.getUTCDate(),
          "%Y" : d.getUTCFullYear(),
          "%y" : this.__gd(d.getUTCFullYear() % 100),
          "%B" : this.__gh.months[d.getUTCMonth()],
          "%b" : this.__gh.months_abbrev[d.getUTCMonth()],
          "%m" : this.__gd(d.getUTCMonth() + 1),
          "%l" : d.getUTCMonth() + 1,
          "%P" : this.persianFormatTime(this.absoluteTime(dr))
        };
        for(var i in dq)ds = ds.replace(new RegExp(i, cf), dq[i]);
        return ds;
      },
      formatDuration : function(dt, du){

        var dy = cF;
        if(typeof dt !== cD || dt < 0)return dy;
        if(!du || typeof du !== L)du = K;
        var dz = this.getAbsoluteDaysDuration(dt);
        var dw = {
          'd' : dz,
          'l' : this.getPluralForm(dz),
          'h' : this.__gd(this.getRelativeHoursDuration(dt)),
          'H' : this.__gd(this.getAbsoluteHoursDuration(dt)),
          'm' : this.__gd(this.getRelativeMinutesDuration(dt)),
          'M' : this.__gd(this.getAbsoluteHoursDuration(dt)),
          's' : this.__gd(this.getRelativeSecondsDuration(dt)),
          'S' : this.__gd(this.getAbsoluteSecondsDuration(dt))
        };
        for(var i = 0,dv = du.length;i < dv;i++){

          var dx = du[i];
          if(dw.hasOwnProperty(dx)){

            dy += dw[dx];
          } else {

            dy += dx;
          };
        };
        return dy;
      },
      getAbsoluteDaysDuration : function(dA){

        if(typeof dA !== cD || dA < 0)return 0;
        return Math.floor(dA / 86400);
      },
      getPluralForm : function(dB, dD){

        if(!dD)dD = this.__gh.days_plural;
        if(dD.length === 3){

          var dC = 0;
          if(dB % 10 === 1 && dB % 100 !== 11){

            dC = 0;
          } else if(dB % 10 >= 2 && dB % 10 <= 4 && (dB % 100 < 10 || dB % 100 >= 20)){

            dC = 1;
          } else {

            dC = 2;
          };
          return dD[dC];
        };
        return cF;
      },
      getAbsoluteHoursDuration : function(dE){

        if(typeof dE !== cD || dE < 0)return 0;
        return Math.floor(dE / 3600);
      },
      getRelativeHoursDuration : function(dF){

        if(typeof dF !== cD || dF < 0)return 0;
        return Math.floor((dF - this.getAbsoluteDaysDuration(dF) * 86400) / 3600);
      },
      getAbsoluteMinutesDuration : function(dG){

        if(typeof dG !== cD || dG < 0)return 0;
        return Math.floor(dG / 60);
      },
      getRelativeMinutesDuration : function(dH){

        if(typeof dH !== cD || dH < 0)return 0;
        var dI = this.getAbsoluteHoursDuration(dH);
        return Math.floor((dH - dI * 3600) / 60);
      },
      getAbsoluteSecondsDuration : function(dJ){

        if(typeof dJ !== cD || dJ < 0)return 0;
        return dJ;
      },
      getRelativeSecondsDuration : function(dL){

        if(typeof dL !== cD || dL < 0)return cF;
        var dK = this.getAbsoluteMinutesDuration(dL);
        return dL - dK * 60;
      },
      persianFormatTime : function(dS){

        if(!dS || typeof dS != cD)return cF;
        dS = this.userTime(dS);
        var d = new Date(dS * 1000);
        var dP = [db, cL, cI, cm, M, H, cr, cG, B, cj, p, c];
        var i = 0;
        var dT = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var dQ = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
        var dR = d.getUTCFullYear() - 1600;
        var dM = 365 * dR + parseInt((dR + 3) / 4) - parseInt((dR + 99) / 100) + parseInt((dR + 399) / 400);
        for(i = 0;i < d.getUTCMonth();i++)dM += dT[i];
        if(d.getUTCMonth() > 1 && ((!(dR % 4) && (dR % 100)) || !(dR % 400)))dM++;
        dM += d.getUTCDate() - 1;
        var dU = dM - 79;
        var dN = parseInt(dU / 12053);
        dU %= 12053;
        var dO = 979 + 33 * dN + 4 * parseInt(dU / 1461);
        dU %= 1461;
        if(dU >= 366){

          dO += parseInt((dU - 1) / 365);
          dU = (dU - 1) % 365;
        };
        for(i = 0;i < 11 && dU >= dQ[i];i++)dU -= dQ[i];
        return wialon.util.String.sprintf(da, dU + 1, dP[i], dO, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
      },
      setLocale : function(dX, dW, dY, dV, ea){

        if(dX instanceof Array)this.__gh.days = dX;
        if(dW instanceof Array)this.__gh.months = dW;
        if(dY instanceof Array)this.__gh.days_abbrev = dY;
        if(dV instanceof Array)this.__gh.months_abbrev = dV;
        if(ea instanceof Array)this.__gh.days_plural = ea;
      },
      convertFormat : function(eb, ee){

        var ed = {
          "HH" : ck,
          "MMMM" : cX,
          "MMM" : g,
          "MM" : b,
          "M" : o,
          "PC" : J,
          "dddd" : cc,
          "ddd" : O,
          "dd" : cY,
          "d" : z,
          "hh" : cg,
          "mm" : cM,
          "ss" : cH,
          "tt" : cu,
          "yyyy" : W,
          "yy" : cx
        };
        var eg = {
          "%H" : cS,
          "%B" : G,
          "%b" : cP,
          "%m" : cB,
          "%l" : cJ,
          "%P" : S,
          "%A" : n,
          "%a" : Y,
          "%E" : F,
          "%e" : ch,
          "%I" : m,
          "%M" : a,
          "%S" : cn,
          "%p" : x,
          "%Y" : cR,
          "%y" : cC
        };
        var ef = /HH|MMMM|MMM|MM|M|PC|dddd|ddd|dd|d|hh|mm|ss|tt|yyyy|yy/g,ec = /%H|%B|%b|%m|%l|%P|%A|%a|%E|%e|%I|%M|%S|%p|%Y|%y/g;
        if(!ee){

          eb = eb.replace(ef, function(eh){

            return ed[eh];
          });
        } else {

          eb = eb.replace(ec, function(ei){

            return eg[ei];
          });
        };
        return eb;
      },
      getTimezone : function(){

        var ej = -(new Date()).getTimezoneOffset() * 60;
        var ek = wialon.core.Session.getInstance().getCurrUser();
        if(!ek)return ej;
        return parseInt(ek.getCustomProperty(R, ej)) >>> 0;
      },
      getTimezoneOffset : function(){

        var el = this.getTimezone();
        if((el & this.__ge.TZ_TYPE_MASK) != this.__ge.TZ_TYPE_WITH_DST)return el & this.__ge.TZ_OFFSET_MASK;
        return parseInt(el & 0x80000000 ? ((el & 0xFFFF) | 0xFFFF0000) : (el & 0xFFFF));
      },
      getDSTOffset : function(ew){

        if(!ew)return 0;
        var ep = this.getTimezone();
        var et = ep & this.__ge.TZ_TYPE_MASK;
        var eA = this.getTimezoneOffset(ep);
        if((et == this.__ge.TZ_TYPE_WITH_DST && (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_NONE) || (et != this.__ge.TZ_TYPE_WITH_DST && (ep & this.__ge.TZ_DISABLE_DST_BIT)))return 0;
        if((et == this.__ge.TZ_TYPE_WITH_DST && (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_SERVER) || et != this.__ge.TZ_TYPE_WITH_DST){

          var em = new Date();
          em.setTime(ew * 1000);
          var eu = new Date();
          eu.setTime((ew - 90 * 86400) * 1000);
          var ev = new Date();
          ev.setTime((ew + 150 * 86400) * 1000);
          if(em.getTimezoneOffset() < eu.getTimezoneOffset() || em.getTimezoneOffset() < ev.getTimezoneOffset())return 3600;
          return 0;
        };
        var er = ep & this.__ge.TZ_CUSTOM_DST_MASK;
        var ez = new Date((ew + eA) * 1000);
        var eq = ez.getTime() / 1000;
        var ey = 0;
        var en = 0;
        var ex = ez.getUTCFullYear();
        if(typeof this.__gg.from[er | ex] == cU || typeof this.__gg.to[er | ex] == cU){

          switch(er){case this.__gf.DST_MAR2SUN2AM_NOV1SUN2AM:
          ey = this.getWdayTime(ex, 2, 2, 0, 0, 2);
          en = this.getWdayTime(ex, 10, 1, 0, 0, 1);
          break;case this.__gf.DST_MAR6SUN_OCT6SUN:
          ey = this.getWdayTime(ex, 2, 6, 0);
          en = this.getWdayTime(ex, 9, 6, 0);
          break;case this.__gf.DST_MAR6SUN1AM_OCT6SUN1AM:
          ey = this.getWdayTime(ex, 2, 6, 0, 0, 1);
          en = this.getWdayTime(ex, 9, 6, 0, 1);
          break;case this.__gf.DST_MAR6FRI_OCT6FRI:
          ey = this.getWdayTime(ex, 2, 6, 5);
          en = this.getWdayTime(ex, 9, 6, 5);
          break;case this.__gf.DST_MAR6SUN2AM_OCT6SUN2AM:
          ey = this.getWdayTime(ex, 2, 6, 0, 0, 2);
          en = this.getWdayTime(ex, 9, 6, 0, 0, 2);
          if(ew > 1414281600)return 0;
          return 3600;
          break;case this.__gf.DST_MAR6FRI_OCT6FRI_SYRIA:
          ey = this.getWdayTime(ex, 2, 6, 5);
          en = this.getWdayTime(ex, 9, 6, 5);
          if(ew > 1664841600){

            return 0;
          };
          break;case this.__gf.DST_APR1SUN2AM_OCT6SUN2AM:
          ey = this.getWdayTime(ex, 3, 1, 0, 0, 2);
          en = this.getWdayTime(ex, 9, 6, 0, 0, 2);
          break;case this.__gf.DST_MAR2SUN_NOV1SUN:
          ey = this.getWdayTime(ex, 2, 2, 0, 0, 0);
          en = this.getWdayTime(ex, 10, 1, 0, 0, 0);
          break;case this.__gf.DST_MAR21_22SUN_SEP20_21SUN:
          if(this.isLeapYear(ex)){

            ey = this.getWdayTime(ex, 2, 0, -1, 21);
            en = this.getWdayTime(ex, 8, 0, -1, 20, 23, 0, 0);
          } else {

            ey = this.getWdayTime(ex, 2, 0, -1, 22);
            en = this.getWdayTime(ex, 8, 0, -1, 21, 23, 0, 0);
          };
          break;case this.__gf.DST_SEP1SUN_APR1SUN:
          ey = this.getWdayTime(ex, 8, 1, 0);
          en = this.getWdayTime(ex, 3, 1, 0);
          break;case this.__gf.DST_SEP6SUN_APR1SUN:
          ey = this.getWdayTime(ex, 8, 6, 0, 0, 2);
          en = this.getWdayTime(ex, 3, 1, 0, 0, 2);
          break;case this.__gf.DST_AUG2SUN_MAY2SUN:
          if(ew > 1546315200){

            ey = this.getWdayTime(ex, 8, 1, 0, 0, 4);
            en = this.getWdayTime(ex, 3, 1, 0, 0, 4);
          } else {

            ey = this.getWdayTime(ex, 7, 2, 0);
            en = this.getWdayTime(ex, 4, 2, 0, 0, -1);
          };
          break;case this.__gf.DST_OCT3SUN_FEB3SUN:
          ey = this.getWdayTime(ex, 9, 3, 0);
          en = this.getWdayTime(ex, 1, 3, 0, 0, -1);
          break;case this.__gf.DST_OCT1SUN_MAR6SUN:
          ey = this.getWdayTime(ex, 9, 1, 0);
          en = this.getWdayTime(ex, 2, 6, 0);
          break;case this.__gf.DST_OCT1SUN_MAR2SUN:
          ey = this.getWdayTime(ex, 9, 1, 0);
          en = this.getWdayTime(ex, 2, 2, 0);
          break;case this.__gf.DST_OCT1SUN_APR1SUN:
          ey = this.getWdayTime(ex, 9, 1, 0, 0, 2);
          en = this.getWdayTime(ex, 3, 1, 0, 0, 2);
          break;case this.__gf.DST_NOV1SUN_JAN3SUN:
          ey = this.getWdayTime(ex, 10, 1, 0, 0, 2);
          en = this.getWdayTime(ex, 0, 3, 0, 0, 2);
          break;case this.__gf.DST_OCT1SUN_APR1SUN_TASMANIA:
          ey = this.getWdayTime(ex, 9, 1, 0);
          en = this.getWdayTime(ex, 0, 3, 0);
          break;case this.__gf.DST_MAR6FRI_OCT6SUN_ISRAEL:
          ey = this.getWdayTime(ex, 2, 6, 7, 0, 0, 0, 0, 2);
          en = this.getWdayTime(ex, 9, 6, 7);
          break;default:
          return 0;};
          this.__gg.from[er | ex] = ey;
          if(en % 2 == 0)en--;
          this.__gg.to[er | ex] = en;
        } else {

          ey = this.__gg.from[er | ex];
          en = this.__gg.to[er | ex];
        };
        var es = (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_CUSTOM_UTC ? ey : ey - eA;
        var eo = (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_CUSTOM_UTC ? en : en - eA;
        if(er >= this.__gf.DST_SOUTHERN_SEMISPHERE)return (ew <= es && ew >= eo) ? 0 : 3600;
        return (ew >= es && ew <= eo) ? 3600 : 0;
      },
      isLeapYear : function(eB){

        if(eB % 4 == 0 && eB % 100 != 0)return true; else if(eB % 4 == 0 && eB % 100 == 0 && eB % 400 == 0)return true;;
        return false;
      },
      getWdayTime : function(eJ, eF, eK, eI, eE, eG, eL, eD, eH){

        var eM = new Date();
        eM.setUTCFullYear(eJ);
        eM.setUTCMonth(eF);
        eM.setUTCDate(1);
        eM.setUTCHours(0);
        eM.setUTCMilliseconds(0);
        eM.setUTCMinutes(0);
        eM.setUTCSeconds(0);
        var eC = 0;
        if(eI == -1)eC = eE; else {

          if(eM.getUTCDay() <= eI)eC = (eI - eM.getUTCDay()) + 1; else eC = 8 - (eM.getUTCDay() - eI);
          if(eK < 6){

            if(eE){

              while(eC <= eE)eC += 7;
            } else if(eK)eC += 7 * (eK - 1);;
          } else {

            var eN = this.getMonthDays(eF, eJ);
            if(eC + 4 * 7 <= eN)eC += 4 * 7; else eC += 3 * 7;
          };
        };
        if(eH){

          eC -= eH;
        };
        eM.setUTCDate(eC);
        if(eG)eM.setUTCHours(eG);
        if(eL)eM.setUTCMinutes(eL);
        if(eD)eM.setUTCSeconds(eD);
        return parseInt(eM.getTime() / 1000);
      },
      getMonthDays : function(eP, eQ){

        if(eP < 0 || !eQ)return 0;
        var eO = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if(eP >= eO.length)return 0;
        if(eP == 1 && this.getYearDays(eQ) == 365)return 29;
        return eO[eP];
      },
      getYearDays : function(eR){

        if(!eR)return 0;
        if((eR % 4) == 0){

          if((eR % 100) == 0)return ((eR % 400) == 0) ? 365 : 364;
          return 365;
        };
        return 364;
      },
      userTime : function(eS){

        return eS + this.getDSTOffset(eS) + this.getTimezoneOffset();
      },
      absoluteTime : function(eU){

        var t = eU - this.getTimezoneOffset();
        var eT = this.getDSTOffset(t);
        var eV = this.getDSTOffset(t - 3600);
        if(eT == eV)return t - eT;
        return t;
      },
      calculateFlags : function(eW, eX){

        if(!eW || typeof eW != cD)eW = 0;
        if(!eX || eX < 1 || eX > 7)eX = 1;
        return (eX << 24) | eW;
      },
      calculateInterval : function(eY, fh, fk){

        var fg = wialon.item.MReport.intervalFlag;
        var ff = wialon.core.Session.getInstance().getServerTime();
        if(fk & fg.useCurrentTime)fh = ff;
        if(fk & (fg.prevMinute | fg.prevHour | fg.prevDay | fg.prevWeek | fg.prevMonth | fg.prevYear))eY = ff;
        var d = new Date(this.userTime(eY) * 1000);
        var fb = eY - d.getUTCSeconds() - 60 * d.getUTCMinutes() - 3600 * d.getUTCHours();
        if(fk & fg.prevMinute){

          if(fk & fg.currTimeAndPrev){

            var fj = ff;
            eY = fj - 60 * fh + 1;
            fh = fj;
          } else {

            var fj = fb + (3600 * d.getUTCHours()) + (60 * d.getUTCMinutes());
            eY = fj - 60 * fh;
            fh = fj - 1;
          };
        } else if(fk & fg.prevHour){

          if(fk & fg.currTimeAndPrev){

            var fj = ff - (ff % 60);
            eY = fj - 3600 * fh;
            fh = fj - 1;
          } else {

            var fj = fb + (3600 * d.getUTCHours());
            eY = fj - 3600 * fh;
            fh = fj - 1;
          };
        } else if(fk & fg.prevDay){

          if(fk & fg.currTimeAndPrev){

            eY = fb - 86400 * (fh - 1);
            fh = ff;
          } else {

            eY = fb - 86400 * fh;
            fh = fb - 1;
          };
        } else if(fk & fg.prevWeek){

          var fl = (fk & 0x7000000) >> 24;
          if(!fl)fl = 1;
          var fe = (d.getUTCDay() - fl);
          var fa = fb - 86400 * ((fe >= 0) ? fe : (7 - Math.abs(fe)));
          if(fk & fg.currTimeAndPrev){

            eY = fa - 86400 * 7 * (fh - 1);
            fh = ff;
          } else {

            eY = fa - 86400 * 7 * fh;
            fh = fa - 1;
          };
        } else if(fk & fg.prevMonth){

          var fi = d.getUTCMonth();
          var fm = d.getUTCFullYear();
          var fc = fb - 86400 * (d.getUTCDate() - 1);
          eY = fc;
          if(fk & fg.currTimeAndPrev)fh -= 1;
          while(fh-- > 0){

            if(--fi < 0){

              fi = 11;
              if(--fm == 0)return;
            };
            eY -= 86400 * this.getMonthDays(fi, fm);
          };
          if(fk & fg.currTimeAndPrev){

            fh = ff;
          } else {

            fh = fc - 1;
          };
        } else if(fk & fg.prevYear){

          var fm = 1970;
          var fn = Math.floor(fb / 86400);
          var fd = this.getYearDays(fm) + 1;
          while(fn >= fd){

            fn -= fd;
            fd = this.getYearDays(++fm) + 1;
          };
          var fo = fb - 86400 * (++fn);
          eY = fo;
          if(fk & fg.currTimeAndPrev)fh -= 1;
          while(fh-- > 0){

            if(--fm == 0)return;
            eY -= 86400 * (this.getYearDays(fm) + 1);
          };
          if(fk & fg.currTimeAndPrev){

            fh = ff;
          } else {

            fh = fo - 1;
          };
        };;;;;
        return {
          from : eY,
          to : fh
        };
      },
      __gd : function(i){

        if(i < 10)i = V + i;
        return i;
      },
      __ge : {
        TZ_DISABLE_DST_BIT : 0x00000001,
        TZ_TYPE_MASK : 0x0C000000,
        TZ_TYPE_WITH_DST : 0x08000000,
        TZ_DST_TYPE_MASK : 0x03000000,
        TZ_DST_TYPE_NONE : 0x00000000,
        TZ_DST_TYPE_SERVER : 0x01000000,
        TZ_DST_TYPE_CUSTOM : 0x02000000,
        TZ_CUSTOM_DST_MASK : 0x00FF0000,
        TZ_DST_TYPE_CUSTOM_UTC : 0x03000000,
        TZ_OFFSET_MASK : 0xFFFFFFFE
      },
      __gf : {
        DST_MAR2SUN2AM_NOV1SUN2AM : 0x00010000,
        DST_MAR6SUN_OCT6SUN : 0x00020000,
        DST_MAR6SUN1AM_OCT6SUN1AM : 0x00030000,
        DST_MAR6FRI_OCT6FRI : 0x00040000,
        DST_MAR6SUN2AM_OCT6SUN2AM : 0x00050000,
        DST_MAR6FRI_OCT6FRI_SYRIA : 0x00060000,
        DST_APR1SUN2AM_OCT6SUN2AM : 0x00070000,
        DST_MAR2SUN_NOV1SUN : 0x00080000,
        DST_APR6THU_SEP6THU : 0x00090000,
        DST_APR6THU_UNKNOWN : 0x000A0000,
        DST_MAR21_22SUN_SEP20_21SUN : 0x000C0000,
        DST_SOUTHERN_SEMISPHERE : 0x00200000,
        DST_MAR6FRI_OCT6SUN_ISRAEL : 0x000D0000,
        DST_SEP1SUN_APR1SUN : 0x00210000,
        DST_SEP6SUN_APR1SUN : 0x00220000,
        DST_AUG2SUN_MAY2SUN : 0x00230000,
        DST_OCT3SUN_FEB3SUN : 0x00240000,
        DST_OCT1SUN_MAR6SUN : 0x00250000,
        DST_OCT1SUN_MAR2SUN : 0x00260000,
        DST_OCT1SUN_APR1SUN : 0x00270000,
        DST_OCT1SUN_APR1SUN_TASMANIA : 0x00280000,
        DST_NOV1SUN_JAN3SUN : 0x00290000
      },
      __gg : {
        from : {
        },
        to : {
        }
      },
      __gh : {
        days : [cW, cp, v, cQ, l, w, cN],
        months : [E, cv, X, cT, j, s, C, cs, ct, P, U, k],
        days_abbrev : [cV, cy, ce, cw, T, cb, cO],
        months_abbrev : [A, y, e, co, j, q, cA, f, cE, u, Q, cq],
        days_plural : [r, cK, cK]
      }
    }
  });
})();

qx.$$loader.init();

