// @ts-check
import { setPageOptions, assignDefaultEvents, TEMPLATE } from './utils.js';

/**
 * @typedef { import("./types").PagedHTMLInstance } PagedHTMLInstance
 * @typedef { import("./types").Config } Config
 * @typedef { import("./types").PAGE_SIZE } PAGE_SIZE
 * @typedef { import("./types").Margin } Margin
 * @typedef { import("./types").PageConfig } PageConfig
 * @typedef { import("./types").PagedEvents } PagedEvents
 * @typedef { import("./types").Section } Section
 * @typedef { import("./types").PagedHTMLElement } PagedHTMLElement
 * @typedef { import("./types").TemplateConfig } TemplateConfig
 * @typedef { import("./types").PagedComponent } PagedComponent
*/

/**
 * @param {Config} config
 */
function create(config) {
    const { root, events = assignDefaultEvents(config.events), pageConfig } = config;
    const pages = [];
    const sections = [];
    const depth = 0;

    const pagesDiv = document.createElement("div");
    pagesDiv.classList.add("pages");
    root.appendChild(pagesDiv);

    /**
     * @type {PagedHTMLInstance}
     */
    const instance = {
        pages,
        depth,
        sections,
        createNewPage,
        insertNewPage,
        getCurrentPage,
        getRemainingHeight,
        createSection,
        events: assignDefaultEvents(events),
        render,
        pagesDiv
    }

    /**
     * @returns {PagedHTMLElement}
     */
    function createNewPage() {
        var pageTemplate = document.createElement("template");
        pageTemplate.innerHTML = TEMPLATE;
        //@ts-ignore
        return pageTemplate.content.firstElementChild;
    }

    function triggerPageEndEvent() {
        if (pages[pages.length - 1]) {
            events.onPageEnd(pages[pages.length - 1], instance);
        }
    }

    function insertNewPage() {
        triggerPageEndEvent();

        var newPage = createNewPage();
        pagesDiv.appendChild(newPage);
        pages.push(newPage);
        const contentArea = newPage.querySelector(".content");
        const pageNumber = pages.length;
        const isNew = () => {
            //@ts-ignore
            return contentArea.childNodes.length == 0
        }

        Object.assign(newPage, { contentArea, pageNumber, isNew });

        events.onPageStart(newPage, instance);
        return newPage;
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

    function createSection(name, userProps = {}) {
        var page = getCurrentPage();
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

    setPageOptions(root, pageConfig);
    insertNewPage();

    /**
     * @param { Array<TemplateConfig> } templates 
     * @param { object } userProps 
     */
    async function render(templates, userProps = {}) {
        for (const template of templates) {
            const { component, ...rest } = template;

            const { getCurrentPage } = instance;

            const { init, renderer, onOverflow, onEnd } = component(instance, { ...rest, ...userProps });

            await init();

            for await (const el of renderer()) {
                var currentPage = getCurrentPage();
                var contentArea = currentPage.contentArea;
                if (contentArea.scrollHeight > contentArea.clientHeight) {
                    onOverflow(el);
                }
            }

            await onEnd();
        }
        triggerPageEndEvent();
    }



    return instance;

}


const PagedHTML = {
    create
}

export default PagedHTML;