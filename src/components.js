import {
    findOverflowingNode,
    normalizeHTML,
    nodeBottom,
    htmlToElement
} from "./utils.js";

export function Paragraph(instance, { paraElement }) {
    function init() {
        var remHeight = instance.getRemainingHeight();
        if (remHeight < 180) {
            instance.insertNewPage();
        }
    }

    function* renderer() {
        var pageContent = instance.getCurrentPage().contentArea;
        pageContent.appendChild(paraElement);
        yield paraElement;
    }

    function onOverflow(overflowParagraph) {
        var pageContent = instance.getCurrentPage().contentArea;
        var overFlowingNode = findOverflowingNode(overflowParagraph, pageContent);
        var pageBottom = nodeBottom(pageContent);

        var { textContent } = overFlowingNode;

        var words = normalizeHTML(textContent).split(" ");
        var lastIndex = 0;

        var overflowWord = words.find(w => {
            var startIndex = textContent.indexOf(w, lastIndex);

            var textRange = document.createRange();
            textRange.setStart(overFlowingNode, startIndex);
            textRange.setEnd(overFlowingNode, startIndex + w.length);
            var didOverflow = textRange.getBoundingClientRect().bottom > pageBottom;
            lastIndex = startIndex + w.length;
            return didOverflow;
        });

        var overflowIndex = lastIndex - overflowWord.length;

        var overflowRange = document.createRange();
        overflowRange.selectNode(overflowParagraph);
        overflowRange.setStart(overFlowingNode, overflowIndex);

        instance.insertNewPage();

        instance.getCurrentPage()
            .contentArea
            .appendChild(overflowRange.extractContents());
    }

    function onEnd() {

    }

    return {
        init,
        onEnd,
        renderer,
        onOverflow
    }

}

export function Section(instance, { templates, name, displayName, parentSection, newPage, threshold = 0 }) {

    parentSection = parentSection || instance;

    function init() {
        // chapter must begin in a new page
        if (!instance.getCurrentPage().isNew()) {
            if (newPage || instance.getRemainingHeight() < threshold) {
                instance.insertNewPage()
            }
        }

        var section = createAnchor();
        instance.TemplateRenderer(templates, { parentSection: section });
    }

    function createAnchor() {
        var section = parentSection.createSection(name, { displayName });

        var anchor = htmlToElement(`<div depth="${section.depth}" class="section"><span id="${name}">${displayName || name}</span></div>`);
        instance.getCurrentPage().contentArea.appendChild(anchor);
        return section;
    }

    function* renderer() {

    }

    function onOverflow() {

    }

    function onEnd() {

    }

    return {
        init,
        onEnd,
        renderer,
        onOverflow
    }

}

export function Table(instance, data) {
    var table = htmlToElement(`<table></table>`);
    var tbody = htmlToElement(`<tbody></tbody>`);

    var { columns, rows } = data;

    var pageContent = instance.getCurrentPage().contentArea;

    function init() {
        renderHeader();
        table.appendChild(tbody);
        pageContent.appendChild(table);
    }

    function renderHeader() {
        var thead = htmlToElement(`<thead></thead>`);
        var titleTr = htmlToElement(`<tr><th colspan=${columns + 1}>Test Table</th></tr>`);

        var headTr = htmlToElement(`<tr></tr>`);
        for (var col = 0; col <= columns; col++) {
            var th = htmlToElement(`<th> col ${col}</th>`);
            headTr.appendChild(th);
        }
        thead.appendChild(titleTr);
        thead.appendChild(headTr);
        table.appendChild(thead);
    }

    function* renderer() {
        for (var i = 0; i <= rows; i++) {
            var tr = htmlToElement(`<tr></tr>`);
            for (var j = 0; j <= columns; j++) {
                var td = htmlToElement(`<td> row ${i} col ${j}</td>`);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            yield tr;
        }
    }

    function onOverflow(overflowRow) {
        var page = instance.insertNewPage();
        table = htmlToElement(`<table></table>`);
        tbody = htmlToElement(`<tbody></tbody>`);

        renderHeader();

        table.appendChild(tbody);

        var pageContent = page.contentArea;

        pageContent.appendChild(table);

        var tr = overflowRow.parentElement.removeChild(overflowRow);
        tbody.appendChild(tr);
    }

    function onEnd() {
    }

    return {
        init,
        renderer,
        onOverflow,
        onEnd
    }
}


export function TOC(instance, userData) {

    var tocElement = htmlToElement(`<div class="toc"><p class="toc-title">Table Of Contents</p></div>`);

    function init() {
        // assign null objects to pageEnd and pageStart events
        !instance.getCurrentPage().isNew() && instance.insertNewPage();
        instance.getCurrentPage().contentArea.appendChild(tocElement);
    }

    function* renderer(sections = userData.sections) {
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var secHTML = htmlToElement(`<div style="padding-left : ${section.depth * 24}px" class="toc-section">
                <a href="#${section.name}">${section.displayName}</a>
                <span class="toc-dotted"></span>
                <span class="toc-page-number">${section.page.pageNumber}</span>
                </div>`);
            tocElement.appendChild(secHTML);
            yield secHTML;
            if (section.sections.length > 0) {
                yield* renderer(section.sections);
            }
        }
    }

    function onOverflow(overFlowEl) {
        instance.insertNewPage();
        tocElement = htmlToElement(`<div class="toc"><p class="toc-title">Table Of Contents</p></div>`);
        instance.getCurrentPage().contentArea.appendChild(tocElement);
        tocElement.appendChild(overFlowEl);
    }

    function onEnd() {
        instance.rootNode.prepend(instance.pagesDiv);
    }

    return {
        init,
        onEnd,
        renderer,
        onOverflow
    }

}