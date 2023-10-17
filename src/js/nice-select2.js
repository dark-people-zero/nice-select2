import "../scss/nice-select2.scss";

// utility functions
function triggerClick(el) {
	var event = document.createEvent("MouseEvents");
	event.initEvent("click", true, false);
	el.dispatchEvent(event);
}

function triggerChange(el) {
	var event = document.createEvent("HTMLEvents");
	event.initEvent("change", true, false);
	el.dispatchEvent(event);
}

function triggerInput(el) {
	var event = document.createEvent("InputEvent");
	event.initEvent("change", true, false);
	el.dispatchEvent(event);
}

function triggerFocusIn(el) {
	var event = document.createEvent("FocusEvent");
	event.initEvent("focusin", true, false);
	el.dispatchEvent(event);
}

function triggerFocusOut(el) {
	var event = document.createEvent("FocusEvent");
	event.initEvent("focusout", true, false);
	el.dispatchEvent(event);
}

function triggerModalOpen(el) {
	var event = document.createEvent("UIEvent");
	event.initEvent("modalopen", true, false);
	el.dispatchEvent(event);
}

function triggerModalClose(el) {
	var event = document.createEvent("UIEvent");
	event.initEvent("modalclose", true, false);
	el.dispatchEvent(event);
}

function triggerValidationMessage(el, type) {
	if (type == "invalid") {
		addClass(this.dropdown, "invalid");
		removeClass(this.dropdown, "valid");
	} else {
		addClass(this.dropdown, "valid");
		removeClass(this.dropdown, "invalid");
	}
}

function attr(el, key) {
	if (el[key] != undefined) {
		return el[key];
	}
	return el.getAttribute(key);
}

function data(el, key) {
	return el.getAttribute("data-" + key);
}

function hasClass(el, className) {
	if (el) {
		return el.classList.contains(className);
	} else {
		return false;
	}
}

function addClass(el, className) {
	if (el) return el.classList.add(className);
}

function removeClass(el, className) {
	if (el) return el.classList.remove(className);
}

var defaultOptions = {
	data: null,
	searchable: false,
	showSelectedItems: false,
	serverSide: false,
	fetchUri: null,
	fetchOpt: {},
	fetchRes: null,
};

export default function NiceSelect(element, options) {
	this.el = element;
	this.config = Object.assign({}, defaultOptions, options || {});
	this.data = this.config.data;
	this.selectedOptions = [];

	this.controller = null;
	this.search = "";
	this.fetch = null;

	if (this.config.serverSide) this.config.searchable = options.searchable !== undefined ? options.searchable : true;

	this.placeholder =
		attr(this.el, "placeholder") ||
		this.config.placeholder ||
		"Select an option";
	this.searchtext =
		attr(this.el, "searchtext") || this.config.searchtext || "Search";
	this.selectedtext =
		attr(this.el, "selectedtext") || this.config.selectedtext || "selected";

	this.dropdown = null;
	this.dropdownInfo = null;
	this.dropdownNoresult = null;
	this.multiple = attr(this.el, "multiple");
	this.disabled = attr(this.el, "disabled");

	this.create();
}

NiceSelect.prototype.create = function () {
	this.el.style.opacity = "0";
	this.el.style.width = "0";
	this.el.style.padding = "0";
	this.el.style.height = "0";
	
	if (this.config.serverSide) {
		this.fetchData();
	}else{
		if (this.data) {
			this.processData(this.data);
		} else {
			this.extractData();
		}

		this.renderDropdown();
		this.bindEvent();
	}
};

NiceSelect.prototype.fetchData = function(q = '', first = true) {
	this.controller = new AbortController();
	const fetchOption = this.config.fetchOpt;
	fetchOption.signal = this.controller.signal;

	this.fetch = fetch(this.config.fetchUri+"?q="+q, fetchOption).then(e => e.json()).then(e => {
		if(this.config.fetchRes != null) {
			this.data = this.config.fetchRes(false, e);
			this.processData(this.data, first);
			if (first) {
				this.renderDropdown();
				this.bindEvent();
			}else{
				this._renderItems(first);
				this.showHideInfo();
				this.showHideNoResult(this.data.length == 0);
			}
		} else {
			this.data = e;
			if (first) {
				this.renderDropdown();
				this.bindEvent();
			}else{
				this._renderItems(first);
				this.showHideInfo();
				this.showHideNoResult(this.data.length == 0);
			}
		}

		this.fetch = null;
	}).catch(err => {
		this.showHideInfo();
		this.showHideNoResult();
		this.fetch = null;
		if(this.config.fetchRes != null) this.config.fetchRes(err, null);
		console.error(err.message);
	});
}

NiceSelect.prototype.processData = function (data, first = true) {
	if(first) {
		var opt = this.el.querySelectorAll("option,optgroup");
		this.selectedOptions = [...opt].map(e => {
			return {
				data: {
					text: e.innerHTML ?? "",
					value: e.getAttribute("value") ?? "",
					selected: e.getAttribute("selected") != null,
					disabled: e.getAttribute("disabled") != null,
				},
				attributes: {
					selected: e.getAttribute("selected") != null,
					disabled: e.getAttribute("disabled") != null,
					optgroup: e.value == "optgroup",
				},
			}
		});
	}else{
		if (this.selectedOptions.length > 0 && this.search == "") {
			let sel = this.selectedOptions.filter(e => !data.find(x => x.value == e.data.value)).map(e => {
				e.data.selected = e.attributes.selected;
				e.data.disabled = e.attributes.disabled;
				return e.data;
			});
			
			data = [...sel, ...data];
		}
	}
	
	this.options = data.map(item => {
		let fn = this.selectedOptions.find(e => e.data.value == item.value && e.attributes.selected);
		item.selected = fn ? true : false;

		if (this.config.serverSide) {
			let opt = new Option(item.text, item.value, false, !!item.selected);
			this.el.append(opt);
		}
		return {
			data: item,
			attributes: {
				selected: !!item.selected,
				disabled: !!item.disabled,
				optgroup: item.value == "optgroup",
			},
		}
	});
};

NiceSelect.prototype.extractData = function () {
	var options = this.el.querySelectorAll("option,optgroup");
	
	this.options = [...options].map(e => {
		if (e.tagName == "OPTGROUP") {
			return {
				data: {
					text: e.label,
					value: "optgroup",
				},
				attributes: {
					selected: e.getAttribute("selected") != null,
					disabled: e.getAttribute("disabled") != null,
					optgroup: e.tagName == "OPTGROUP",
				}
			}
		} else {
			return {
				data: {
					text: e.dataset.display != undefined ? e.dataset.display : e.innerHTML,
					value: e.value,
				},
				attributes: {
					selected: e.getAttribute("selected") != null,
					disabled: e.getAttribute("disabled") != null,
					optgroup: e.tagName == "OPTGROUP",
				}
			}	
		}
	});

	this.data = this.options.reduce((a, b) => {
		a.push(b.data);
		return a;
	}, []);

	this.selectedOptions = this.options.filter(e => e.attributes.selected);
};

NiceSelect.prototype.renderDropdown = function () {
	var classes = [
		"nice-select",
		attr(this.el, "class") || "",
		this.disabled ? "disabled" : "",
		this.multiple ? "has-multiple" : "",
	];

	let searchHtml = `
		<div class="nice-select-search-box">
			<input type="text" class="nice-select-search" placeholder="${this.searchtext}..." title="search"/>
			<div class="nice-select-info">Searching...</div>
			<div class="nice-select-info-noResult">No result found: <b>${this.search}</b></div>
		</div>
	`;

	var html = `
		<div class="${classes.join(" ")}" tabindex="${this.disabled ? null : 0 }">
			<span class="${this.multiple ? "multiple-options" : "current" }"></span>
			<div class="nice-select-dropdown">
				${this.config.searchable ? searchHtml : ""}
				<ul class="list"></ul>
			</div>
		</div>
	`;

	this.el.insertAdjacentHTML("afterend", html);

	this.dropdown = this.el.nextElementSibling;
	this.dropdownInfo = this.dropdown.querySelector(".nice-select-info");
	this.dropdownNoresult = this.dropdown.querySelector(".nice-select-info-noResult");
	this._renderSelectedItems();
	this._renderItems();
};

NiceSelect.prototype._renderSelectedItems = function () {
	if (this.multiple) {
		var selectedHtml = "";
		if (
			this.config.showSelectedItems ||
			this.config.showSelectedItems ||
			window.getComputedStyle(this.dropdown).width == "auto" ||
			this.selectedOptions.length < 2
		) {
			this.selectedOptions.forEach(function (item) {
				selectedHtml += `<span class="current">${item.data.text}</span>`;
			});

			selectedHtml = selectedHtml == "" ? this.placeholder : selectedHtml;
		} else {
			selectedHtml = this.selectedOptions.length + " " + this.selectedtext;
		}

		this.dropdown.querySelector(".multiple-options").innerHTML = selectedHtml;
	} else {
		var html =
			this.selectedOptions.length > 0
				? this.selectedOptions[0].data.text
				: this.placeholder;

		this.dropdown.querySelector(".current").innerHTML = html;
	}
};

NiceSelect.prototype._renderItems = function (first) {
	var ul = this.dropdown.querySelector("ul");
	[...ul.children].forEach(e => e.remove());

	this.options.forEach((item) => {
		ul.appendChild(this._renderItem(item));
	});

	if (this.config.serverSide && !first) {
		this.dropdown.querySelectorAll(".focus").forEach(function (item) {
			removeClass(item, "focus");
		});
	
		var firstEl = this._findNext(null);
		addClass(firstEl, "focus");
	}
};

NiceSelect.prototype._renderItem = function (option) {
	var el = document.createElement("li");

	el.innerHTML = option.data.text;

	if (option.attributes.optgroup) {
		addClass(el, "optgroup");
	} else {
		el.setAttribute("data-value", option.data.value);
		var classList = [
			"option",
			option.attributes.selected ? "selected" : null,
			option.attributes.disabled ? "disabled" : null,
		];

		el.addEventListener("click", this._onItemClicked.bind(this, option));
		el.classList.add(...classList);
	}

	option.element = el;
	return el;
};

NiceSelect.prototype.update = function () {
	this.extractData();
	if (this.dropdown) {
		var open = hasClass(this.dropdown, "open");
		this.dropdown.parentNode.removeChild(this.dropdown);
		this.create();

		if (open) {
			triggerClick(this.dropdown);
		}
	}

	if (attr(this.el, "disabled")) {
		this.disable();
	} else {
		this.enable();
	}
};

NiceSelect.prototype.disable = function () {
	if (!this.disabled) {
		this.disabled = true;
		addClass(this.dropdown, "disabled");
	}
};

NiceSelect.prototype.enable = function () {
	if (this.disabled) {
		this.disabled = false;
		removeClass(this.dropdown, "disabled");
	}
};

NiceSelect.prototype.clear = function () {
	this.resetSelectValue();
	this.selectedOptions = [];
	this._renderSelectedItems();
	this.update();

	triggerChange(this.el);
};

NiceSelect.prototype.destroy = function () {
	if (this.dropdown) {
		this.dropdown.parentNode.removeChild(this.dropdown);
		this.el.style.display = "";
	}
};

NiceSelect.prototype.bindEvent = function () {
	var $this = this;
	this.dropdown.addEventListener("click", this._onClicked.bind(this));
	this.dropdown.addEventListener("keydown", this._onKeyPressed.bind(this));
	this.dropdown.addEventListener("focusin", triggerFocusIn.bind(this, this.el));
	this.dropdown.addEventListener(
		"focusout",
		triggerFocusOut.bind(this, this.el)
	);
	this.el.addEventListener(
		"invalid",
		triggerValidationMessage.bind(this, this.el, "invalid")
	);
	window.addEventListener("click", this._onClickedOutside.bind(this));

	if (this.config.searchable) {
		this._bindSearchEvent();
	}
};

NiceSelect.prototype._bindSearchEvent = function () {
	var searchBox = this.dropdown.querySelector(".nice-select-search");
	if (searchBox) {
		searchBox.addEventListener("click", function (e) {
			e.stopPropagation();
			return false;
		});
	}

	searchBox.addEventListener("input", this._onSearchChanged.bind(this));
};

NiceSelect.prototype._onClicked = function (e) {
	e.preventDefault();
	if (!hasClass(this.dropdown, "open")) {
		addClass(this.dropdown, "open");
		triggerModalOpen(this.el);
	} else {
		if (this.multiple) {
			if (e.target == this.dropdown.querySelector(".multiple-options")) {
				removeClass(this.dropdown, "open");
				triggerModalClose(this.el);
			}
		} else {
			removeClass(this.dropdown, "open");
			triggerModalClose(this.el);
		}
	}

	var search = this.dropdown.querySelector(".nice-select-search");
	if (hasClass(this.dropdown, "open")) {
		if (search) {
			search.value = "";
			search.focus();
		}

		var t = this.dropdown.querySelector(".focus");
		removeClass(t, "focus");
		t = this.dropdown.querySelector(".selected");
		addClass(t, "focus");
		this.dropdown.querySelectorAll("ul li").forEach(function (item) {
			item.style.display = "";
		});
	} else {
		this.dropdown.focus();
		if(this.config.serverSide) this._resetDataServerSide();
	}
};

NiceSelect.prototype._onItemClicked = function (option, e) {
	var optionEl = e.target;

	if (!hasClass(optionEl, "disabled")) {
		if (this.multiple) {
			if (hasClass(optionEl, "selected")) {
				removeClass(optionEl, "selected");
				this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
				this.el
					.querySelector(`option[value="${optionEl.dataset.value}"]`)
					.removeAttribute("selected");
			} else {
				addClass(optionEl, "selected");
				this.selectedOptions.push(option);
			}
		} else {
			this.options.forEach(function (item) {
				removeClass(item.element, "selected");
			});
			this.selectedOptions.forEach(function (item) {
				removeClass(item.element, "selected");
			});

			addClass(optionEl, "selected");
			option.attributes.selected = true;
			this.selectedOptions = [option];
			if(this.config.onChange) this.config.onChange(this.selectedOptions);
		}

		this._renderSelectedItems();
		this.updateSelectValue();
	}
};

NiceSelect.prototype.updateSelectValue = function () {
	if (this.multiple) {
		var select = this.el;
		this.selectedOptions.forEach(function (item) {
			var el = select.querySelector(`option[value="${item.data.value}"]`);
			if (el) {
				el.setAttribute("selected", true);
			}
		});
	} else if (this.selectedOptions.length > 0) {
		this.el.value = this.selectedOptions[0].data.value;
	}
	triggerChange(this.el);
};

NiceSelect.prototype.resetSelectValue = function () {
	if (this.multiple) {
		var select = this.el;
		this.selectedOptions.forEach(function (item) {
			var el = select.querySelector(`option[value="${item.data.value}"]`);
			if (el) {
				el.removeAttribute("selected");
			}
		});
	} else if (this.selectedOptions.length > 0) {
		this.el.selectedIndex = -1;
	}

	triggerChange(this.el);
};

NiceSelect.prototype._onClickedOutside = function (e) {
	if (!this.dropdown.contains(e.target)) {
		if(hasClass(this.dropdown, "open") && this.config.serverSide) this._resetDataServerSide();
		removeClass(this.dropdown, "open");
		triggerModalClose(this.el);
	}
};

NiceSelect.prototype._onKeyPressed = function (e) {
	// Keyboard events

	var focusedOption = this.dropdown.querySelector(".focus");

	var open = hasClass(this.dropdown, "open");

	// Enter
	if (e.keyCode == 13) {
		if (open) {
			triggerClick(focusedOption);
		} else {
			triggerClick(this.dropdown);
		}
	} else if (e.keyCode == 40) {
		// Down
		if (!open) {
			triggerClick(this.dropdown);
		} else {
			var next = this._findNext(focusedOption);
			if (next) {
				var t = this.dropdown.querySelector(".focus");
				removeClass(t, "focus");
				addClass(next, "focus");
			}
		}
		e.preventDefault();
	} else if (e.keyCode == 38) {
		// Up
		if (!open) {
			triggerClick(this.dropdown);
		} else {
			var prev = this._findPrev(focusedOption);
			if (prev) {
				var t = this.dropdown.querySelector(".focus");
				removeClass(t, "focus");
				addClass(prev, "focus");
			}
		}
		e.preventDefault();
	} else if (e.keyCode == 27 && open) {
		// Esc
		triggerClick(this.dropdown);
	} else if (e.keyCode === 32 && open) {
		// Space
		return false;
	}
	return false;
};

NiceSelect.prototype._findNext = function (el) {
	if (el) {
		el = el.nextElementSibling;
	} else {
		el = this.dropdown.querySelector(".list .option");
	}

	while (el) {
		if (!hasClass(el, "disabled") && el.style.display != "none") {
			return el;
		}
		el = el.nextElementSibling;
	}

	return null;
};

NiceSelect.prototype._findPrev = function (el) {
	if (el) {
		el = el.previousElementSibling;
	} else {
		el = this.dropdown.querySelector(".list .option:last-child");
	}

	while (el) {
		if (!hasClass(el, "disabled") && el.style.display != "none") {
			return el;
		}
		el = el.previousElementSibling;
	}

	return null;
};

NiceSelect.prototype._onSearchChanged = function (e) {
	var open = hasClass(this.dropdown, "open");
	var text = e.target.value;
	this.search = text;

	if (this.config.serverSide) {
		if(this.controller != null && this.fetch != null) this.controller.abort();
		this.dropdownNoresult.innerHTML = `No result found: <b>${this.search}</b>`;
		this.showHideInfo(true);
		this.showHideNoResult();
		this.fetchData(text, false);
	}else{
		text = text.toLowerCase();
		if (text == "") {
			this.options.forEach(function (item) {
				item.element.style.display = "";
			});
		} else if (open) {
			var matchReg = new RegExp(text);
			this.options.forEach(function (item) {
				var optionText = item.data.text.toLowerCase();
				var matched = matchReg.test(optionText);
				item.element.style.display = matched ? "" : "none";
			});
		}
	
		this.dropdown.querySelectorAll(".focus").forEach(function (item) {
			removeClass(item, "focus");
		});
	
		var firstEl = this._findNext(null);
		addClass(firstEl, "focus");
	}

};

NiceSelect.prototype._resetDataServerSide = function () { 
	this.search = "";
	this.showHideInfo();
	this.showHideNoResult();
	this.fetchData("", false);
}

NiceSelect.prototype.showHideInfo = function (show = false) { 
	this.dropdownInfo.style.display = show ? "block" : "none";
}
NiceSelect.prototype.showHideNoResult = function (show = false) { 
	this.dropdownNoresult.style.display = show ? "block" : "none";
}

export function bind(el, options) {
	return new NiceSelect(el, options);
}
