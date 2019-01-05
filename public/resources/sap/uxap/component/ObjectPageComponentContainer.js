/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/ComponentContainer',"sap/base/Log",'sap/ui/core/Component'],function(C,L){"use strict";var O=C.extend("sap.uxap.component.ObjectPageComponentContainer",{metadata:{properties:{"jsonConfigurationURL":{type:"string",group:"Behavior"},"mode":{type:"sap.uxap.ObjectPageConfigurationMode",group:"Behavior"}}},init:function(){this.setPropagateModel(true);this.setName("sap.uxap.component");},onBeforeRendering:function(){this._oComponent=sap.ui.component("sap.uxap");if(!this._oComponent){this._oComponent=sap.ui.component({name:this.getName(),url:this.getUrl(),componentData:{jsonConfigurationURL:this.getJsonConfigurationURL(),mode:this.getMode()}});this.setComponent(this._oComponent,true);}if(C.prototype.onBeforeRendering){C.prototype.onBeforeRendering.call(this);}},getObjectPageLayoutInstance:function(){var o=null;if(this._oComponent&&this._oComponent._oView){o=this._oComponent._oView.byId("ObjectPageLayout");}else{L.error("ObjectPageComponentContainer :: cannot find children ObjectPageLayout, has it been rendered already?");}return o;},renderer:"sap.ui.core.ComponentContainerRenderer"});return O;});