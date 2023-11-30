"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _config = _interopRequireDefault(require("./config"));
var _merge = _interopRequireDefault(require("merge"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  name: 'RenderlessPagination',
  inject: ['Page', 'records', 'perPage'],
  props: {
    itemClass: {
      required: false,
      "default": 'VuePagination__pagination-item'
    }
  },
  render: function render() {
    var _this = this;
    return this.$slots["default"]({
      override: this.opts.template,
      showPagination: this.totalPages > 1,
      pages: this.pages,
      pageEvents: function pageEvents(page) {
        return {
          click: function click() {
            return _this.setPage(page);
          },
          keydown: function keydown(e) {
            if (e.key === 'ArrowRight') {
              _this.next();
            }
            if (e.key === 'ArrowLeft') {
              _this.prev();
            }
          }
        };
      },
      activeClass: this.activeClass,
      hasEdgeNav: this.opts.edgeNavigation && this.totalChunks > 1,
      setPage: this.setPage,
      setFirstPage: this.setPage.bind(this, 1),
      setLastPage: this.setPage.bind(this, this.totalPages),
      hasChunksNav: this.opts.chunksNavigation === 'fixed',
      setPrevChunk: this.prevChunk,
      setNextChunk: this.nextChunk,
      setPrevPage: this.prev,
      firstPageProps: {
        "class": this.Theme.link,
        disabled: this.page === 1
      },
      lastPageProps: {
        "class": this.Theme.link,
        disabled: this.page === this.totalPages
      },
      prevProps: {
        "class": this.Theme.link,
        disabled: !!this.allowedPageClass(this.page - 1)
      },
      nextProps: {
        "class": this.Theme.link,
        disabled: !!this.allowedPageClass(this.page + 1)
      },
      pageClasses: function pageClasses(page) {
        return "".concat(_this.itemClass, " ").concat(_this.Theme.item, " ").concat(_this.activeClass(page));
      },
      prevChunkProps: {
        "class": this.Theme.link,
        disabled: !this.allowedChunk(-1)
      },
      nextChunkProps: {
        "class": this.Theme.link,
        disabled: !this.allowedChunk(1)
      },
      setNextPage: this.next,
      theme: {
        nav: this.Theme.nav,
        list: "VuePagination__pagination ".concat(this.Theme.list),
        prev: "".concat(this.itemClass, " ").concat(this.itemClass, "-prev-page ").concat(this.Theme.item, " ").concat(this.Theme.prev, " ").concat(this.allowedPageClass(this.page - 1)),
        next: "".concat(this.itemClass, "  ").concat(this.itemClass, "-next-page ").concat(this.Theme.item, " ").concat(this.Theme.next, " ").concat(this.allowedPageClass(this.page + 1)),
        prevChunk: "".concat(this.itemClass, " ").concat(this.Theme.item, " ").concat(this.Theme.prev, " ").concat(this.itemClass, "-prev-chunk ").concat(this.allowedChunkClass(-1)),
        nextChunk: "".concat(this.itemClass, " ").concat(this.Theme.item, " ").concat(this.Theme.next, " ").concat(this.itemClass, "-next-chunk ").concat(this.allowedChunkClass(1)),
        firstPage: "".concat(this.itemClass, " ").concat(this.Theme.item, " ").concat(this.page === 1 ? this.Theme.disabled : '', " ").concat(this.itemClass, "-first-page"),
        lastPage: "".concat(this.itemClass, " ").concat(this.Theme.item, " ").concat(this.page === this.totalPages ? this.Theme.disabled : '', " ").concat(this.itemClass, "-last-page"),
        link: this.Theme.link,
        page: "".concat(this.itemClass, " ").concat(this.Theme.item),
        wrapper: this.Theme.wrapper,
        count: "VuePagination__count ".concat(this.Theme.count)
      },
      hasRecords: this.hasRecords,
      count: this.count,
      texts: this.opts.texts,
      opts: this.opts,
      allowedChunkClass: this.allowedChunkClass,
      allowedPageClass: this.allowedPageClass,
      setChunk: this.setChunk,
      prev: this.prev,
      next: this.next,
      totalPages: this.totalPages,
      totalChunks: this.totalChunks,
      page: this.Page(),
      records: this.records(),
      perPage: this.perPage(),
      formatNumber: this.formatNumber
    });
  },
  data: function data() {
    return {
      firstPage: this.$parent.modelValue,
      For: this.$parent["for"],
      Options: this.$parent.options
    };
  },
  watch: {
    page: function page(val) {
      if (this.opts.chunksNavigation === 'scroll' && this.allowedPage(val) && !this.inDisplay(val)) {
        if (val === this.totalPages) {
          var first = val - this.opts.chunk + 1;
          this.firstPage = first >= 1 ? first : 1;
        } else {
          this.firstPage = val;
        }
      }
      this.$parent.$emit('paginate', val);
    }
  },
  computed: {
    Records: function Records() {
      return this.records();
    },
    PerPage: function PerPage() {
      return this.perPage();
    },
    opts: function opts() {
      return _merge["default"].recursive((0, _config["default"])(), this.Options);
    },
    Theme: function Theme() {
      if (this.opts.theme instanceof Object) {
        return this.opts.theme;
      }
      var themes = {
        tailwind: require('./themes/tailwind')
      };
      if (!themes[this.opts.theme]) {
        throw "vue-pagination-2: the theme ".concat(this.opts.theme, " does not exist");
      }
      return themes[this.opts.theme];
    },
    page: function page() {
      return this.Page();
    },
    pages: function pages() {
      if (!this.Records) return [];
      return range(this.paginationStart, this.pagesInCurrentChunk);
    },
    totalPages: function totalPages() {
      return this.Records ? Math.ceil(this.Records / this.PerPage) : 1;
    },
    totalChunks: function totalChunks() {
      return Math.ceil(this.totalPages / this.opts.chunk);
    },
    currentChunk: function currentChunk() {
      return Math.ceil(this.page / this.opts.chunk);
    },
    paginationStart: function paginationStart() {
      if (this.opts.chunksNavigation === 'scroll') {
        return this.firstPage;
      }
      return (this.currentChunk - 1) * this.opts.chunk + 1;
    },
    pagesInCurrentChunk: function pagesInCurrentChunk() {
      return this.paginationStart + this.opts.chunk <= this.totalPages ? this.opts.chunk : this.totalPages - this.paginationStart + 1;
    },
    hasRecords: function hasRecords() {
      return parseInt(this.Records) > 0;
    },
    count: function count() {
      if (/{page}/.test(this.opts.texts.count)) {
        if (this.totalPages <= 1) return '';
        return this.opts.texts.count.replace('{page}', this.page).replace('{pages}', this.totalPages);
      }
      var parts = this.opts.texts.count.split('|');
      var from = (this.page - 1) * this.PerPage + 1;
      var to = this.page == this.totalPages ? this.Records : from + this.PerPage - 1;
      var i = Math.min(this.Records == 1 ? 2 : this.totalPages == 1 ? 1 : 0, parts.length - 1);
      return parts[i].replace('{count}', this.formatNumber(this.Records)).replace('{from}', this.formatNumber(from)).replace('{to}', this.formatNumber(to));
    }
  },
  methods: {
    setPage: function setPage(page) {
      if (this.allowedPage(page)) {
        this.paginate(page);
      }
    },
    paginate: function paginate(page) {
      this.$parent.$emit('update:modelValue', page);

      // this.$nextTick(() => {
      //     this.$el.querySelector('li.active button').focus();
      // });
    },
    next: function next() {
      return this.setPage(this.page + 1);
    },
    prev: function prev() {
      return this.setPage(this.page - 1);
    },
    inDisplay: function inDisplay(page) {
      var start = this.firstPage;
      var end = start + this.opts.chunk - 1;
      return page >= start && page <= end;
    },
    nextChunk: function nextChunk() {
      return this.setChunk(1);
    },
    prevChunk: function prevChunk() {
      return this.setChunk(-1);
    },
    setChunk: function setChunk(direction) {
      this.setPage((this.currentChunk - 1 + direction) * this.opts.chunk + 1);
    },
    allowedPage: function allowedPage(page) {
      return page >= 1 && page <= this.totalPages;
    },
    allowedChunk: function allowedChunk(direction) {
      return direction == 1 && this.currentChunk < this.totalChunks || direction == -1 && this.currentChunk > 1;
    },
    allowedPageClass: function allowedPageClass(direction) {
      return this.allowedPage(direction) ? '' : this.Theme.disabled;
    },
    allowedChunkClass: function allowedChunkClass(direction) {
      return this.allowedChunk(direction) ? '' : this.Theme.disabled;
    },
    activeClass: function activeClass(page) {
      return this.page == page ? this.Theme.active : '';
    },
    formatNumber: function formatNumber(num) {
      if (!this.opts.format) return num;
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
function range(start, count) {
  return Array.apply(0, Array(count)).map(function (element, index) {
    return index + start;
  });
}
module.exports = exports.default;