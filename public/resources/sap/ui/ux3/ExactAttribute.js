/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element','./library'],function(E,l){"use strict";var a=l.ExactOrder;var b=E.extend("sap.ui.ux3.ExactAttribute",{metadata:{library:"sap.ui.ux3",properties:{text:{type:"string",group:"Misc",defaultValue:null},selected:{type:"boolean",group:"Misc",defaultValue:null},width:{type:"int",group:"Misc",defaultValue:168},listOrder:{type:"sap.ui.ux3.ExactOrder",defaultValue:a.Select},showSubAttributesIndicator:{type:"boolean",group:"Misc",defaultValue:true},additionalData:{type:"object",group:"Misc",defaultValue:null},supplyActive:{type:"boolean",group:"Misc",defaultValue:true},autoActivateSupply:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"attributes",aggregations:{attributes:{type:"sap.ui.ux3.ExactAttribute",multiple:true,singularName:"attribute"}},events:{supplyAttributes:{parameters:{attribute:{type:"sap.ui.ux3.ExactAttribute"}}}}}});b._MINWIDTH=70;b._MAXWIDTH=500;b.prototype.init=function(){this._getAttributesCallCount=0;};b.prototype.scrollTo=function(A){if(!(A instanceof b)){this._scrollToAttributeId=undefined;return;}var L=this.getChangeListener();if(L){L=sap.ui.getCore().byId(L.id);if(L&&L._lb){var i=this.indexOfAttribute(A);if(i>=0){L._lb.scrollToIndex(i,true);}this._scrollToAttributeId=undefined;return;}}this._scrollToAttributeId=A.getId();};b.prototype.setText=function(t){this.setProperty("text",t,true);this._handleChange(this,"text");return this;};b.prototype.setWidth=function(w){this._setWidth(w);this._handleChange(this,"width");return this;};b.prototype.setTooltip=function(t){E.prototype.setTooltip.apply(this,arguments);this._handleChange(this,"tooltip",true);return this;};b.prototype.setSelected=function(s){this.setProperty("selected",s,true);if(!this.getSelected()){this._clearSelection();}this._handleChange(this,"selected");return this;};b.prototype.setSupplyActive=function(s){this.setProperty("supplyActive",s,true);return this;};b.prototype.setAutoActivateSupply=function(A){this.setProperty("autoActivateSupply",A,true);return this;};b.prototype.setAdditionalData=function(A){this.setProperty("additionalData",A,true);return this;};b.prototype.setListOrder=function(L){this.setProperty("listOrder",L,true);this._handleChange(this,"order");return this;};b.prototype.getAttributes=function(){this._getAttributesCallCount++;if(this._getAttributesCallCount>1){this.setSupplyActive(false);}if(this.hasListeners("supplyAttributes")&&this.getSupplyActive()){this._bSuppressChange=true;this._bChangedHappenedDuringSuppress=false;this.fireSupplyAttributes({attribute:this});this.setSupplyActive(false);this._bSuppressChange=undefined;if(this._bChangedHappenedDuringSuppress){this._handleChange(this,"attributes");}this._bChangedHappenedDuringSuppress=undefined;}this._getAttributesCallCount--;return this.getAttributesInternal();};b.prototype.insertAttribute=function(A,i){this.insertAggregation("attributes",A,i,true);this._handleChange(this,"attributes");this.setSupplyActive(false);return this;};b.prototype.addAttribute=function(A){this.addAggregation("attributes",A,true);this._handleChange(this,"attributes");this.setSupplyActive(false);return this;};b.prototype.removeAttribute=function(e){var A=this.removeAggregation("attributes",e,true);if(A){A.setChangeListener(null);this._handleChange(this,"attributes");}return A;};b.prototype.removeAllAttributes=function(){var A=this.getAttributesInternal();for(var i=0;i<A.length;i++){A[i].setChangeListener(null);}var r=this.removeAllAggregation("attributes",true);if(A.length>0){this._handleChange(this,"attributes");}return r;};b.prototype.destroyAttributes=function(){var A=this.getAttributesInternal();for(var i=0;i<A.length;i++){A[i].setChangeListener(null);}this.destroyAggregation("attributes",true);if(A.length>0){this._handleChange(this,"attributes");}return this;};b.prototype.getShowSubAttributesIndicator_Computed=function(){return this.hasListeners("supplyAttributes")&&this.getSupplyActive()?this.getShowSubAttributesIndicator():this.getAttributesInternal().length>0;};b.prototype.attachSupplyAttributes=function(d,f,L){this.attachEvent("supplyAttributes",d,f,L);if(this.getSelected()){this.getAttributesInternal(true);}return this;};b.prototype._setProperty_Orig=b.prototype.setProperty;b.prototype.setProperty=function(p,v,s){this._setProperty_Orig(p,v,s);if(p=="selected"){if(v){this.getAttributesInternal(true);}else{if(this.getAutoActivateSupply()){this.setSupplyActive(true);}}}return this;};b.prototype.setChangeListener=function(c){this._oChangeListener=c;};b.prototype.getChangeListener=function(c){return this._oChangeListener;};b.prototype.getAttributesInternal=function(f){return f?this.getAttributes():this.getAggregation("attributes",[]);};b.prototype._handleChange=function(s,t){if(this._bSuppressChange){this._bChangedHappenedDuringSuppress=true;return;}if(this.getChangeListener()){this.getChangeListener()._notifyOnChange(t,s);}else if(this.getParent()&&this.getParent()._handleChange){this.getParent()._handleChange(s,t);}};b.prototype._clearSelection=function(){this.setProperty("selected",false,true);var v=this.getAttributesInternal();for(var i=0;i<v.length;i++){v[i]._clearSelection();}};b.prototype._setWidth=function(w){w=Math.round(b._checkWidth(w));this.setProperty("width",w,true);};b._checkWidth=function(w){w=Math.max(w,b._MINWIDTH);w=Math.min(w,b._MAXWIDTH);return w;};return b;});
