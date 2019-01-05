/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.PlanningCalendarHeader.
sap.ui.define([
	'sap/ui/core/Control',
	'./library',
	'./Toolbar',
	'./AssociativeOverflowToolbar',
	'./Button',
	'./AccButton',
	'./Title',
	'./ToolbarSpacer',
	'./SegmentedButton',
	'sap/ui/unified/Calendar',
	'sap/ui/unified/calendar/CalendarDate',
	'sap/ui/core/format/DateFormat',
	'sap/ui/core/Popup',
	'sap/ui/core/IconPool',
	'sap/ui/core/InvisibleText',
	"./PlanningCalendarHeaderRenderer"
],
function(
	Control,
	library,
	Toolbar,
	AssociativeOverflowToolbar,
	Button,
	AccButton,
	Title,
	ToolbarSpacer,
	SegmentedButton,
	Calendar,
	CalendarDate,
	DateFormat,
	Popup,
	IconPool,
	InvisibleText,
	PlanningCalendarHeaderRenderer
) {
	"use strict";

	// shortcut for sap.m.ToolbarDesign
	var ToolbarDesign = library.ToolbarDesign;

	/**
	 * Constructor for a new <code>PlanningCalendarHeader</code>.
	 *
	 * @param {string} [sID] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Disclaimer: This control is in a beta state - incompatible API changes may be done before its official public
	 * release. Use at your own discretion.
	 *
	 * <h3>Overview</h3>
	 *
	 * Тhe calendar header contains the action controls which you can use to manipulate the calendar and facilitate
	 * navigation.
	 *
	 * <b>Note:</b> The <code>PlanningCalendarHeader</code> uses parts of the <code>sap.ui.unified</code> library.
	 * This library will be loaded after the <code>PlanningCalendarHeader</code>, if it wasn't previously loaded.
	 * This could lead to a waiting time when a <code>PlanningCalendarHeader</code> is used for the first time.
	 * To prevent this, apps using the <code>PlanningCalendarHeader</code> must also load the
	 * <code>sap.ui.unified</code> library.
	 *
	 * <h3>Usage</h3>
	 *
	 * The <code>PlanningCalendarHeader</code> has the following structure:
	 *
	 * It contains two toolbars.
	 * <ul>
	 *     <li>The title of the control, set from the <code>title</code> property, is placed at the beginning
	 *     of the first toolbar. If there is more than one view, the user can switch between the views using the
	 *     <code>SegmentedButton</code>, displayed afterwards. If controls in the <code>actions</code>
	 *     aggregation are set, they will be displayed at the end.</li>
	 *     <li>Navigation in the second toolbar will help the user select the desired time period.
	 *     It contains navigation arrows, Today button and a calendar picker.</li>
	 * </ul>
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.61.1
	 *
	 * @constructor
	 * @private
	 * @since 1.61
	 * @alias sap.m.PlanningCalendarHeader
	 */

	var PlanningCalendarHeader = Control.extend("sap.m.PlanningCalendarHeader", /** @lends sap.m.PlanningCalendarHeader.prototype */ { metadata : {

		library : "sap.m",

		properties : {

			/**
			 * Determines the title of the <code>PlanningCalendarHeader</code>.
			 */
			title: { type: "string", group: "Appearance", defaultValue: "" },

			/**
			 * Determines the start date used in the calendar picker, as a JavaScript date object. It is considered as a local date.
			 * The time part will be ignored. The current date is used as default.
			 */
			startDate: { type : "object", group : "Data" },

			/**
			 * Determines the text of the button which opens the calendar picker.
			 */
			pickerText : { type : "string", group : "Data" }

		},

		aggregations : {

			/**
			 * The controls to be passed to the toolbar.
			 */
			actions : { type : "sap.ui.core.Control", multiple: true, singularName: "action" },

			/**
			 * Hidden, for internal use only.
			 * The toolbar which contains the title, the SegmentedButton for the views and the controls from the actions aggregation.
			 *
			 * @private
			 */
			_actionsToolbar : { type: "sap.m.OverflowToolbar", multiple: false, visibility : "hidden" },

			/**
			 * Hidden, for internal use only.
			 * The toolbar which contains the navigation inner controls.
			 *
			 * @private
			 */
			_navigationToolbar : { type: "sap.m.Toolbar", multiple: false, visibility : "hidden" },

			/**
			 * Hidden, for internal use only.
			 * The popup which contains the calendar for navigation.
			 *
			 * @private
			 */
			_calendarPicker : { type : "sap.ui.unified.Calendar", multiple : false, visibility : "hidden" }
		},

		events : {

			/**
			 * <code>startDate</code> was changed while navigating backward in the <code>PlanningCalendarHeader</code>.
			 * The new value can be obtained, using the <code>sap.m.PlanningCalendarHeader#getStartDate()</code> method.
			 */
			pressPrevious: {},

			/**
			 * <code>startDate</code> was changed while navigating through the Today button in the
			 * <code>PlanningCalendarHeader</code>.
			 * The new value can be obtained, using the <code>sap.m.PlanningCalendarHeader#getStartDate()</code> method.
			 */
			pressToday: {},

			/**
			 * <code>startDate</code> was changed while navigating forward in the <code>PlanningCalendarHeader</code>.
			 * The new value can be obtained, using the <code>sap.m.PlanningCalendarHeader#getStartDate()</code> method.
			 */
			pressNext: {},

			/**
			 * A date was selected through the calendar picker.
			 * The new value can be obtained, using the <code>sap.m.PlanningCalendarHeader#getStartDate()</code> method.
			 */
			dateSelect: {},

			/**
			 * The calendar picker popup was closed and no date was selected.
			 */
			cancel: {}
		}

	}});

	// Number of items to be skipped when removing content from actions aggregation.
	// In the _actionsToolbar content are placed the sap.m.Title control, containing the value from the title property,
	// a sap.m.ToolbarSpacer and a sap.m.SegmentedButton, used for navigation through the views in the calendar.
	// The other controls in this aggregation are forwarded from the actions aggregation of the
	// sap.m.SinglePlanningCalendar. Therefore when manipulations of the latter are needed, the first three controls
	// must be skipped. (ex. when removeAllActions is used)
	var RESERVED_ACTIONS_ITEMS_COUNT = 3;

	PlanningCalendarHeader.prototype.init = function() {

		var sOPHId = this.getId(),
			sNavToolbarId = sOPHId + "-NavToolbar",
			oRB = sap.ui.getCore().getLibraryResourceBundle("sap.m"),
			oPrevBtn,
			oNextBtn,
			oPicker;

		this.setAggregation("_actionsToolbar", new AssociativeOverflowToolbar(sOPHId + "-ActionsToolbar", {
			design: ToolbarDesign.Transparent
		})
			.addStyleClass("sapMPCHeadActionsToolbar")
			.addContent(this._getOrCreateTitleControl())
			.addContent(this._getOrCreateToolbarSpacer())
			.addContent(this._getOrCreateViewSwitch())
		);

		oPrevBtn = new Button(sNavToolbarId + "-PrevBtn", {
			icon: IconPool.getIconURI('slim-arrow-left'),
			tooltip: oRB.getText("PCH_NAVIGATE_BACKWARDS"),
			press: function () {
				this.firePressPrevious();
			}.bind(this)
		});
		this._oTodayBtn = new Button(sNavToolbarId + "-TodayBtn", {
			text: oRB.getText("PLANNINGCALENDAR_TODAY"),
			ariaLabelledBy: InvisibleText.getStaticId("sap.m", "PCH_NAVIGATE_TO_TODAY"),
			press: function () {
				this.firePressToday();
			}.bind(this)
		});
		oNextBtn = new Button(sNavToolbarId + "-NextBtn", {
			icon: IconPool.getIconURI('slim-arrow-right'),
			tooltip: oRB.getText("PCH_NAVIGATE_FORWARD"),
			press: function () {
				this.firePressNext();
			}.bind(this)
		});
		oPicker = new Calendar(sOPHId + "-Cal", {
			ariaLabelledBy: InvisibleText.getStaticId("sap.ui.unified", "CALENDAR_DIALOG")
		});
		oPicker.attachEvent("select", this._handlePickerDateSelect, this);
		oPicker.attachEvent("cancel", function (oEvent) {
			var oPickerBtnDomRef = this._oPickerBtn.getDomRef();

			this.fireCancel();
			oPickerBtnDomRef && oPickerBtnDomRef.focus();
		}, this);
		this.setAggregation("_calendarPicker", oPicker);
		this._oPickerBtn = new AccButton(sNavToolbarId + "-PickerBtn", {
			text: this.getPickerText(),
			ariaHaspopup: "dialog",
			ariaLabelledBy: InvisibleText.getStaticId("sap.m", "PCH_SELECT_RANGE"),
			press: function () {
				var oDate = this.getStartDate() || new Date();
				oPicker.displayDate(oDate);

				this._openCalendarPickerPopup(oPicker);
			}.bind(this)
		});

		this.setAggregation("_navigationToolbar", new Toolbar(sNavToolbarId, {
			design: ToolbarDesign.Transparent,
			content: [
				oPrevBtn,
				this._oTodayBtn,
				oNextBtn,
				this._oPickerBtn
			]
		}).addStyleClass("sapMPCHeadNavToolbar"));

	};

	PlanningCalendarHeader.prototype.exit = function () {
		if (this._oTitle) {
			this._getActionsToolbar().removeContent(this._oTitle);
			this._oTitle.destroy();
			this._oTitle = null;
		}
		if (this._oToolbarSpacer) {
			this._getActionsToolbar().removeContent(this._oToolbarSpacer);
			this._oToolbarSpacer.destroy();
			this._oToolbarSpacer = null;
		}
		if (this._oViewSwitch) {
			this._getActionsToolbar().removeContent(this._oViewSwitch);
			this._oViewSwitch.destroy();
			this._oViewSwitch = null;
		}
		if (this._oPopup) {
			this._oPopup.destroy();
			this._oPopup = null;
		}
	};

	PlanningCalendarHeader.prototype.onBeforeRendering = function () {
		var bVisible = !!this.getActions().length || !!this.getTitle() || this._getOrCreateViewSwitch().getItems() > 1;

		this._getActionsToolbar().setProperty("visible", bVisible, true);
	};

	PlanningCalendarHeader.prototype.setTitle = function (sTitle) {
		this._getOrCreateTitleControl().setText(sTitle).setVisible(!!sTitle);

		return this.setProperty("title", sTitle);
	};

	PlanningCalendarHeader.prototype.addAction = function (oAction) {
		if (!oAction) {
			return this;
		}
		this._getActionsToolbar().addContent(oAction);

		return this.addAggregation("actions", oAction);
	};

	PlanningCalendarHeader.prototype.insertAction = function (oAction, iIndex) {
		if (!oAction) {
			return this;
		}
		this._getActionsToolbar().insertContent(oAction, iIndex + RESERVED_ACTIONS_ITEMS_COUNT);

		return this.insertAggregation("actions", oAction, iIndex);
	};

	PlanningCalendarHeader.prototype.removeAction = function (oAction) {
		if (!oAction) {
			return this;
		}
		this._getActionsToolbar().removeContent(oAction);

		return this.removeAggregation("actions", oAction);
	};

	PlanningCalendarHeader.prototype.removeAllActions = function () {
		var oActionsToolbar = this._getActionsToolbar(),
			oActionsToolbarContent = oActionsToolbar.getContent();

		for (var i = RESERVED_ACTIONS_ITEMS_COUNT; i < oActionsToolbarContent.length; i++) {
			oActionsToolbar.removeContent(oActionsToolbarContent[i]);
		}

		return this.removeAllAggregation("actions");
	};

	PlanningCalendarHeader.prototype.destroyActions = function () {
		var oActionsToolbar = this._getActionsToolbar(),
			oActionsToolbarContent = oActionsToolbar.getContent();

		for (var i = RESERVED_ACTIONS_ITEMS_COUNT; i < oActionsToolbarContent.length; i++) {
			oActionsToolbar.removeContent(oActionsToolbarContent[i]);
		}

		return this.destroyAggregation("actions");
	};

	PlanningCalendarHeader.prototype.setPickerText = function (sText) {
		this.setProperty("pickerText", sText);
		this._oPickerBtn.setText(sText);

		return this;
	};

	/**
	 * If not existing yet, creates the inner Title control.
	 * Otherwise just returns it.
	 * @returns {sap.m.Title} The title object
	 * @private
	 */
	PlanningCalendarHeader.prototype._getOrCreateTitleControl = function () {
		if (!this._oTitle) {
			this._oTitle = new Title(this.getId() + "-Title", { visible: false });
		}

		return this._oTitle;
	};

	/**
	 * If not existing yet, creates the inner ToolbarSpacer control.
	 * Otherwise just returns it.
	 * @returns {sap.m.ToolbarSpacer} The ToolbarSpacer object
	 * @private
	 */
	PlanningCalendarHeader.prototype._getOrCreateToolbarSpacer = function () {
		if (!this._oToolbarSpacer) {
			this._oToolbarSpacer = new ToolbarSpacer(this.getId() + "-Spacer");
		}

		return this._oToolbarSpacer;
	};

	/**
	 * If not existing yet, creates the inner SegmentedButton control, which controls the views.
	 * Otherwise just returns it.
	 * @returns {sap.m.SegmentedButton} The SegmentedButton object
	 * @private
	 */
	PlanningCalendarHeader.prototype._getOrCreateViewSwitch = function () {
		if (!this._oViewSwitch) {
			this._oViewSwitch = new SegmentedButton(this.getId() + "-ViewSwitch");
		}

		return this._oViewSwitch;
	};

	/**
	 * Returns the today button control.
	 *
	 * @returns {sap.m.Button} The today button
	 * @private
	 */
	PlanningCalendarHeader.prototype._getTodayButton = function () {
		return this._oTodayBtn;
	};

	/**
	 * Handler for the select event of the Calendar in _calendarPicker aggregation.
	 * @private
	 */
	PlanningCalendarHeader.prototype._handlePickerDateSelect = function (oEvent) {
		var oSelectedDate = this.getAggregation("_calendarPicker").getSelectedDates()[0].getStartDate();

		this.setStartDate(oSelectedDate);
		this._closeCalendarPickerPopup();
		this.fireDateSelect();

		// TODO: Focus should be returned to the picker after selection.
		//oPickerBtnDomRef && oPickerBtnDomRef.focus();
	};

	/**
	 * Opens the _calendarPicker popup, when the picker button from the _navigationToolbar is pressed.
	 * @param {object} oPicker The _calendarPicker to be opened
	 * @private
	 */
	PlanningCalendarHeader.prototype._openCalendarPickerPopup = function(oPicker){
		var eDock;

		if (!this._oPopup) {
			this._oPopup = this._createPopup();
		}

		this._oPopup.setContent(oPicker);

		eDock = Popup.Dock;
		this._oPopup.open(0, eDock.CenterTop, eDock.CenterTop, this._oPickerBtn, null, "flipfit", true);
	};

	/**
	 * Creates the _calendarPicker popup.
	 * @returns {Popup} the created popup
	 * @private
	 */
	PlanningCalendarHeader.prototype._createPopup = function () {
		var oPopup = new Popup();

		oPopup.setAutoClose(true);
		oPopup.setAutoCloseAreas([this.getDomRef()]);
		oPopup.setDurations(0, 0); // no animations
		oPopup.onsapescape = function(oEvent) {
			this.onsapescape(oEvent);
		}.bind(this);

		return oPopup;
	};

	/**
	 * Closes the _calendarPicker popup without setting new startDate to the PlanningCalendarHeader.
	 * @private
	 */
	PlanningCalendarHeader.prototype.onsapescape = function(){
		if (this._oPopup) {
			this._closeCalendarPickerPopup();
			if (this._oPickerBtn.getDomRef()) {
				this._oPickerBtn.getDomRef().focus();
			}
		}
	};

	/**
	 * Closes the _calendarPicker popup.
	 * @private
	 */
	PlanningCalendarHeader.prototype._closeCalendarPickerPopup = function() {
		if (this._oPopup && this._oPopup.isOpen()) {
			this._oPopup.close();
		}
	};

	/**
	 * Getter for _actionsToolbar.
	 * @returns {object} The _actionsToolbar object
	 * @private
	 */
	PlanningCalendarHeader.prototype._getActionsToolbar = function () {
		return this.getAggregation("_actionsToolbar");
	};

	return PlanningCalendarHeader;

});