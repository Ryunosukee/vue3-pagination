"use strict";

var _vue = require("vue");
module.exports = function (props) {
  return function (h) {
    var theme = this.theme;
    var prevChunk = '';
    var nextChunk = '';
    var firstPage = '';
    var lastPage = '';
    var countText = props.opts.hideCount ? '' : (0, _vue.createVNode)("p", {
      "style": parseInt(this.records) ? '' : 'display:none',
      "class": "VuePagination__count ".concat(theme.count)
    }, [this.count]);
    var items = this.pages.map(function (page) {
      return (0, _vue.createVNode)("li", {
        "class": "VuePagination__pagination-item ".concat(theme.page, " ").concat(this.activeClass(page)),
        "onClick": this.setPage.bind(this, page),
        "onKeyDown": this.pageEvents(page).keydown
      }, [(0, _vue.createVNode)("button", {
        "class": "".concat(theme.link, " ").concat(this.activeClass(page))
      }, [this.formatNumber(page)])]);
    }.bind(this));
    if (this.opts.edgeNavigation && this.totalChunks > 1) {
      firstPage = (0, _vue.createVNode)("li", {
        "class": "VuePagination__pagination-item ".concat(theme.page, " ").concat(this.page === 1 ? theme.disabled : '', " VuePagination__pagination-item-first-page"),
        "onClick": this.setPage.bind(this, 1)
      }, [(0, _vue.createVNode)("button", {
        "type": "button",
        "class": theme.link,
        "disabled": this.page === 1
      }, [this.opts.texts.first])]);
      lastPage = (0, _vue.createVNode)("li", {
        "class": "VuePagination__pagination-item ".concat(theme.page, " ").concat(this.page === this.totalPages ? theme.disabled : '', " VuePagination__pagination-item-last-page"),
        "onClick": this.setPage.bind(this, this.totalPages)
      }, [(0, _vue.createVNode)("button", {
        "type": "button",
        "class": theme.link,
        "disabled": this.page === this.totalPages
      }, [this.opts.texts.last])]);
    }
    if (this.opts.chunksNavigation === 'fixed') {
      prevChunk = (0, _vue.createVNode)("li", {
        "class": "VuePagination__pagination-item ".concat(theme.page, " ").concat(theme.prev, " VuePagination__pagination-item-prev-chunk ").concat(this.allowedChunkClass(-1)),
        "onClick": this.setChunk.bind(this, -1)
      }, [(0, _vue.createVNode)("button", {
        "type": "button",
        "class": theme.link,
        "disabled": !!this.allowedChunkClass(-1)
      }, [this.opts.texts.prevChunk])]);
      nextChunk = (0, _vue.createVNode)("li", {
        "class": "VuePagination__pagination-item ".concat(theme.page, " ").concat(theme.next, " VuePagination__pagination-item-next-chunk ").concat(this.allowedChunkClass(1)),
        "onClick": this.setChunk.bind(this, 1)
      }, [(0, _vue.createVNode)("button", {
        "type": "button",
        "class": theme.link,
        "disabled": !!this.allowedChunkClass(1)
      }, [this.opts.texts.nextChunk])]);
    }
    return (0, _vue.createVNode)("div", {
      "class": "VuePagination ".concat(theme.wrapper)
    }, [(0, _vue.createVNode)("nav", {
      "class": "".concat(theme.nav)
    }, [(0, _vue.createVNode)("ul", {
      "style": this.totalPages > 1 ? '' : 'display:none',
      "class": "".concat(theme.list, " VuePagination__pagination")
    }, [firstPage, prevChunk, (0, _vue.createVNode)("li", {
      "class": "VuePagination__pagination-item ".concat(theme.page, " ").concat(theme.prev, " VuePagination__pagination-item-prev-page ").concat(this.allowedPageClass(this.page - 1)),
      "onClick": this.prev.bind(this)
    }, [(0, _vue.createVNode)("button", {
      "type": "button",
      "class": theme.link,
      "disabled": !!this.allowedPageClass(this.page - 1)
    }, [this.opts.texts.prevPage])]), items, (0, _vue.createVNode)("li", {
      "class": "VuePagination__pagination-item ".concat(theme.page, " ").concat(theme.next, " VuePagination__pagination-item-next-page ").concat(this.allowedPageClass(this.page + 1)),
      "onClick": this.next.bind(this)
    }, [(0, _vue.createVNode)("button", {
      "type": "button",
      "class": theme.link,
      "disabled": !!this.allowedPageClass(this.page + 1)
    }, [this.opts.texts.nextPage])]), nextChunk, lastPage]), countText])]);
  }.bind(props);
};