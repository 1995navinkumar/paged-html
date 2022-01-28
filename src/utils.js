
export function nodeBottom(node) {
    var isTextNode = node.nodeType == 3;
    if (isTextNode) {
        var range = document.createRange();
        range.selectNode(node);
        return range.getBoundingClientRect().bottom;
    } else {
        return node.getBoundingClientRect().bottom;
    }

}

var formatSizes = {
    Letter: ["8.5in", "11in"],
    Legal: ["8.5in", "14in"],
    Tabloid: ["11in", "17in"],
    Ledger: ["17in", "11in"],
    A0: ["33.1in", "46.8in"],
    A1: ["23.4in", "33.1in"],
    A2: ["16.54in", "23.4in"],
    A3: ["11.7in", "16.54in"],
    A4: ["8.27in", "11.7in"],
    A5: ["5.83in", "8.27in"],
    A6: ["4.13in", "5.83in"]
}

var defaultMargin = {
    left: "1in",
    top: "1in",
    right: "1in",
    bottom: "1in"
}

export function setPageOptions(el, options) {
    var { format, width = "8.5in", height = "11in", margin = defaultMargin, landscape = false } = options;
    var { left = 0, right = 0, top = 0, bottom = 0 } = margin;

    if (format) {
        [width, height] = formatSizes[format];
    }
    if (landscape) {
        var tempWidth = width;
        width = height;
        height = tempWidth;
    }


    el.style.setProperty(`--page-width`, width);
    el.style.setProperty(`--page-height`, height);

    el.style.setProperty(`--margin-top`, top);
    el.style.setProperty(`--margin-bottom`, bottom);
    el.style.setProperty(`--margin-left`, left);
    el.style.setProperty(`--margin-right`, right);

    var styleEl = htmlToElement(`<style>
			@page {
				size :  ${width} ${height};
				margin : 0;
			}
		</style>`);

    el.appendChild(styleEl);
}

export function assignDefaultEvents(events = {}) {
    var defaults = {
        onPageStart: noOp,
        onPageEnd: noOp
    }
    var decoratedEvents = Object.assign({}, defaults, events);
    return decoratedEvents;
}

export function noOp() {

}

export function findOverflowingNode(el, parent) {
    var parentBottom = parent.getBoundingClientRect().bottom;

    var findOverFlowNode = (node) => {
        var cNodes = Array.from(node.childNodes);
        var overflowNode = cNodes.find(node => {
            return nodeBottom(node) > parentBottom
        });

        if (overflowNode.hasChildNodes()) {
            return findOverFlowNode(overflowNode)
        } else {
            return overflowNode
        }
    }

    return findOverFlowNode(el);
}

export function htmlToElement(html) {
    var template = document.createElement('template');
    html = normalizeHTML(html);
    template.innerHTML = html;
    return template.content.firstChild;
}

export function normalizeHTML(str) {
    str = str.replaceAll("\n", "");
    str = str.trim();
    str = str.replace(/\s+/g, " ");
    return str;
}

export const TEMPLATE = `  
<div class="page">
	<div class="top-left"></div>
	<div class="top-center"></div>
	<div class="top-right"></div>
	<div class="left"></div>
	<div class="right"></div>
	<div class="bottom-left"></div>
	<div class="bottom-center"></div>
	<div class="bottom-right"></div>
	<div class="content"></div>
</div>`;
