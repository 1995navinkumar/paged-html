import { setPageOptions, assignDefaultEvents, noOp, TEMPLATE } from './utils.js';

export function PagedHTML(data) {
    var { rootNode, templates, events = {}, pageConfig = {} } = data;
    var pages = [];
    var sections = [];
    var depth = 0;

    var pagesDiv = document.createElement("div");
    pagesDiv.classList.add("pages");
    rootNode.appendChild(pagesDiv);

    var instance = {
        pages,
        sections,
        depth,
        createNewPage,
        insertNewPage,
        getCurrentPage,
        getRemainingHeight,
        createSection,
        TemplateRenderer,
        rootNode,
        pageEvents,
        pagesDiv,
        templates,
        events: assignDefaultEvents(events)
    }

    function createNewPage() {
        var pageTemplate = document.createElement("template");
        pageTemplate.innerHTML = TEMPLATE;
        return document.importNode(pageTemplate.content, true);
    }

    function triggerPageEndEvent() {
        if (pages[pages.length - 1]) {
            instance.events.onPageEnd(pages[pages.length - 1], instance);
        }
    }

    function insertNewPage() {
        triggerPageEndEvent();

        var newPage = createNewPage();
        pagesDiv.appendChild(newPage);
        var pageEl = pagesDiv.lastElementChild;
        pageEl.contentArea = pageEl.querySelector(".content");
        pages.push(pageEl);
        pageEl.pageNumber = pages.length;
        pageEl.isNew = () => {
            return pageEl.contentArea.childNodes.length == 0
        }

        instance.events.onPageStart(pageEl, instance);
        return pageEl;
    }

    function getCurrentPage() {
        return pages[pages.length - 1];
    }

    function getRemainingHeight(page = getCurrentPage()) {
        var contentArea = page.contentArea;

        var children = Array.from(contentArea.children);

        var contentHeight = children.reduce((totalHeight, child) => {
            totalHeight += child.getBoundingClientRect().height;
            return totalHeight
        }, 0);

        return contentArea.clientHeight - contentHeight;
    }


    function TemplateRenderer(templ, userProps = {}) {
        templ.forEach(template => {
            var { component, ...rest } = template;

            var { init, renderer, onOverflow, onEnd } = component(instance, { ...rest, ...userProps });

            init();

            for (const el of renderer()) {
                var currentPage = getCurrentPage();
                var contentArea = currentPage.contentArea;
                if (contentArea.scrollHeight > contentArea.clientHeight) {
                    onOverflow(el);
                }
            }

            onEnd();

        });

    }

    function pageEvents(...eventNames) {
        if (eventNames.length == 0) {
            eventNames = ["onPageStart", "onPageEnd"];
        }
        function on() {
            eventNames.forEach(e => {
                instance.events[e] = events[e] || noOp;
            })
        }
        function off() {
            eventNames.forEach(e => {
                instance.events[e] = noOp;
            })
        }
        return {
            on,
            off
        }
    }

    function createSection(name, userProps = {}) {
        var page = instance.getCurrentPage();
        var Section = {
            name,
            ...userProps,
            sections: [],
            page,
            sectionNumber: this.sections.length + 1,
            depth: this.depth + 1,
            parent: this,
            createSection
        }
        this.sections.push(Section);
        return Section;
    }

    setPageOptions(rootNode, pageConfig);

    insertNewPage();

    TemplateRenderer(templates);

    triggerPageEndEvent();

    return instance;

}