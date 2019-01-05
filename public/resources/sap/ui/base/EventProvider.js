/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Event','./Object','./ObjectPool',"sap/base/assert"],function(E,B,O,a){"use strict";var b=B.extend("sap.ui.base.EventProvider",{constructor:function(){B.call(this);this.mEventRegistry={};}});var c="EventHandlerChange";b.M_EVENTS={EventHandlerChange:c};b.prototype.oEventPool=new O(E);b.prototype.attachEvent=function(e,d,f,l){var m=this.mEventRegistry;a(typeof(e)==="string"&&e,"EventProvider.attachEvent: sEventId must be a non-empty string");if(typeof(d)==="function"){l=f;f=d;d=undefined;}a(typeof(f)==="function","EventProvider.attachEvent: fnFunction must be a function");a(!l||typeof(l)==="object","EventProvider.attachEvent: oListener must be empty or an object");var g=m[e];if(!Array.isArray(g)){g=m[e]=[];}g.push({oListener:l,fFunction:f,oData:d});if(m[c]){this.fireEvent(c,{EventId:e,type:'listenerAttached',listener:l,func:f,data:d});}return this;};b.prototype.attachEventOnce=function(e,d,f,l){if(typeof(d)==="function"){l=f;f=d;d=undefined;}a(typeof(f)==="function","EventProvider.attachEventOnce: fnFunction must be a function");function o(){this.detachEvent(e,o);f.apply(l||this,arguments);}this.attachEvent(e,d,o,undefined);return this;};b.prototype.detachEvent=function(e,f,l){var m=this.mEventRegistry;a(typeof(e)==="string"&&e,"EventProvider.detachEvent: sEventId must be a non-empty string");a(typeof(f)==="function","EventProvider.detachEvent: fnFunction must be a function");a(!l||typeof(l)==="object","EventProvider.detachEvent: oListener must be empty or an object");var d=m[e];if(!Array.isArray(d)){return this;}var l;for(var i=0,L=d.length;i<L;i++){if(d[i].fFunction===f&&d[i].oListener===l){l=d[i];d.splice(i,1);break;}}if(d.length==0){delete m[e];}if(l&&m[c]){this.fireEvent(c,{EventId:e,type:'listenerDetached',listener:l.listener,func:l.fFunction,data:l.oData});}return this;};b.prototype.fireEvent=function(e,p,A,d){if(typeof p==="boolean"){d=A;A=p;}var P=this,f=false,g,o,i,l,I;do{g=P.mEventRegistry[e];if(Array.isArray(g)){g=g.slice();o=o||this.oEventPool.borrowObject(e,this,p);for(i=0,l=g.length;i<l;i++){I=g[i];I.fFunction.call(I.oListener||P,o,I.oData);}d=d&&!o.bCancelBubble;}P=P.getEventingParent();}while(d&&P);if(o){f=o.bPreventDefault;this.oEventPool.returnObject(o);}return A?!f:this;};b.prototype.hasListeners=function(e){return!!this.mEventRegistry[e];};b.getEventList=function(e){return e.mEventRegistry;};b.hasListener=function(e,s,f,l){a(typeof(s)==="string"&&s,"EventProvider.hasListener: sEventId must be a non-empty string");a(typeof(f)==="function","EventProvider.hasListener: fnFunction must be a function");a(!l||typeof(l)==="object","EventProvider.hasListener: oListener must be empty or an object");var d=e&&e.mEventRegistry[s];if(d){for(var i=0,L=d.length;i<L;i++){if(d[i].fFunction===f&&d[i].oListener===l){return true;}}}return false;};b.prototype.getEventingParent=function(){return null;};b.prototype.toString=function(){if(this.getMetadata){return"EventProvider "+this.getMetadata().getName();}else{return"EventProvider";}};b.prototype.destroy=function(){this.mEventRegistry={};B.prototype.destroy.apply(this,arguments);};return b;});
