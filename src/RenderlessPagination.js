import defaultOptions from './config';
import merge from 'merge';

export default {
    name: 'RenderlessPagination',
    inject: ['Page', 'records', 'perPage'],
    props: {
        itemClass: {
            required: false,
            default: 'VuePagination__pagination-item'
        }
    },
    render() {
        return this.$slots.default({
            override: this.opts.template,
            showPagination: this.totalPages > 1,
            pages: this.pages,
            pageEvents: (page) => {
                return {
                    click: () => this.setPage(page),
                    keydown: (e) => {
                        if (e.key === 'ArrowRight') {
                            this.next();
                        }

                        if (e.key === 'ArrowLeft') {
                            this.prev();
                        }
                    }
                }
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
                class: this.Theme.link,
                disabled: this.page === 1
            },
            lastPageProps: {
                class: this.Theme.link,
                disabled: this.page === this.totalPages
            },
            prevProps: {
                class: this.Theme.link,
                disabled: !!this.allowedPageClass(this.page - 1)
            },
            nextProps: {
                class: this.Theme.link,
                disabled: !!this.allowedPageClass(this.page + 1)
            },
            pageClasses: (page) => {
                return `${this.itemClass} ${this.Theme.item} ${this.activeClass(page)}`
            },
            prevChunkProps: {
                class: this.Theme.link,
                disabled: !this.allowedChunk(-1)
            },
            nextChunkProps: {
                class: this.Theme.link,
                disabled: !this.allowedChunk(1)
            },
            setNextPage: this.next,
            theme: {
                nav: this.Theme.nav,
                list: `VuePagination__pagination ${this.Theme.list}`,
                prev: `${this.itemClass} ${this.itemClass}-prev-page ${this.Theme.item} ${this.Theme.prev} ${this.allowedPageClass(this.page - 1)}`,
                next: `${this.itemClass}  ${this.itemClass}-next-page ${this.Theme.item} ${this.Theme.next} ${this.allowedPageClass(this.page + 1)}`,
                prevChunk: `${this.itemClass} ${this.Theme.item} ${this.Theme.prev} ${this.itemClass}-prev-chunk ${this.allowedChunkClass(-1)}`,
                nextChunk: `${this.itemClass} ${this.Theme.item} ${this.Theme.next} ${this.itemClass}-next-chunk ${this.allowedChunkClass(1)}`,
                firstPage: `${this.itemClass} ${this.Theme.item} ${this.page === 1 ? this.Theme.disabled : ''} ${this.itemClass}-first-page`,
                lastPage: `${this.itemClass} ${this.Theme.item} ${this.page === this.totalPages ? this.Theme.disabled : ''} ${this.itemClass}-last-page`,
                link: this.Theme.link,
                page: `${this.itemClass} ${this.Theme.item}`,
                wrapper: this.Theme.wrapper,
                count: `VuePagination__count ${this.Theme.count}`
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
    data() {
        return {
            firstPage: this.$parent.modelValue,
            For: this.$parent.for,
            Options: this.$parent.options
        }
    },
    watch: {
        page(val) {
            if (this.opts.chunksNavigation === 'scroll' && this.allowedPage(val) && !this.inDisplay(val)) {
                if (val === this.totalPages) {
                    var first = val - this.opts.chunk + 1;
                    this.firstPage = first >= 1 ? first : 1;
                } else {
                    this.firstPage = val;
                }
            }

            this.$parent.$emit('paginate', val)
        }
    },
    computed: {
        Records() {
            return this.records()
        },
        PerPage() {
            return this.perPage()
        },
        opts() {
            return merge.recursive(defaultOptions(), this.Options);
        },
        Theme() {

            if (this.opts.theme instanceof Object) {
                return this.opts.theme;
            }

            var themes = {
                tailwind: require('./themes/tailwind'),
            }

            if (!themes[this.opts.theme]) {
                throw `vue-pagination-2: the theme ${this.opts.theme} does not exist`;
            }

            return themes[this.opts.theme];
        },
        page() {
            return this.Page();
        },
        pages: function () {

            if (!this.Records)
                return [];

            return range(this.paginationStart, this.pagesInCurrentChunk);
        },
        totalPages: function () {
            return this.Records ? Math.ceil(this.Records / this.PerPage) : 1;
        },
        totalChunks: function () {
            return Math.ceil(this.totalPages / this.opts.chunk);
        },
        currentChunk: function () {
            return Math.ceil(this.page / this.opts.chunk);
        },
        paginationStart: function () {
            if (this.opts.chunksNavigation === 'scroll') {
                return this.firstPage;
            }

            return ((this.currentChunk - 1) * this.opts.chunk) + 1;
        },
        pagesInCurrentChunk: function () {
            return this.paginationStart + this.opts.chunk <= this.totalPages ?
                this.opts.chunk :
                this.totalPages - this.paginationStart + 1;

        },
        hasRecords() {
            return parseInt(this.Records) > 0;
        },
        count: function () {

            if (/{page}/.test(this.opts.texts.count)) {

                if (this.totalPages <= 1) return '';

                return this.opts.texts.count.replace('{page}', this.page).replace('{pages}', this.totalPages);

            }

            let parts = this.opts.texts.count.split('|');
            let from = ((this.page - 1) * this.PerPage) + 1;
            let to = this.page == (this.totalPages) ? this.Records : from + this.PerPage - 1;
            let i = Math.min(this.Records == 1 ? 2 : this.totalPages == 1 ? 1 : 0, parts.length - 1);

            return parts[i].replace('{count}', this.formatNumber(this.Records))
                .replace('{from}', this.formatNumber(from))
                .replace('{to}', this.formatNumber(to))
        }
    },
    methods: {
        setPage: function (page) {
            if (this.allowedPage(page)) {
                this.paginate(page);
            }
        },
        paginate(page) {
            this.$parent.$emit('update:modelValue', page);

            // this.$nextTick(() => {
            //     this.$el.querySelector('li.active button').focus();
            // });
        },
        next: function () {
            return this.setPage(this.page + 1);
        },
        prev: function () {
            return this.setPage(this.page - 1);
        },
        inDisplay(page) {

            var start = this.firstPage;
            var end = start + this.opts.chunk - 1;

            return page >= start && page <= end;
        },
        nextChunk: function () {
            return this.setChunk(1);
        },
        prevChunk: function () {
            return this.setChunk(-1);
        },
        setChunk: function (direction) {
            this.setPage((((this.currentChunk - 1) + direction) * this.opts.chunk) + 1);
        },
        allowedPage: function (page) {
            return page >= 1 && page <= this.totalPages;
        },
        allowedChunk: function (direction) {
            return (direction == 1 && this.currentChunk < this.totalChunks)
                || (direction == -1 && this.currentChunk > 1);
        },
        allowedPageClass: function (direction) {
            return this.allowedPage(direction) ? '' : this.Theme.disabled;
        },
        allowedChunkClass: function (direction) {
            return this.allowedChunk(direction) ? '' : this.Theme.disabled;
        },
        activeClass: function (page) {
            return this.page == page ? this.Theme.active : '';
        },
        formatNumber: function (num) {

            if (!this.opts.format) return num;

            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}

function range(start, count) {
    return Array.apply(0, Array(count))
        .map(function (element, index) {
            return index + start;
        });
}

