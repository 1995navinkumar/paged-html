export type Config = {
    root: HTMLElement;
    events?: PagedEvents;
    pageConfig?: PageConfig;
}

export type PAGE_SIZE = 'Letter' | 'Legal' | 'Tabloid' | 'Ledger' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6';

export type Margin = {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export type PageConfig = {
    format: PAGE_SIZE;
    landscape: boolean;
    margin: Margin;
}

export type PagedEvents = {
    onPageStart: (PagedHTMLElement, PagedHTMLInstance) => void;
    onPageEnd: (PagedHTMLElement, PagedHTMLInstance) => void;
}


export type PagedHTMLInstance = {
    pages: Array<HTMLElement>;
    depth: number;
    sections: Array<any>;
    createNewPage: () => PagedHTMLElement;
    insertNewPage: () => PagedHTMLElement;
    getCurrentPage: () => PagedHTMLElement;
    getRemainingHeight: () => number;
    createSection: (name: string, userProps?: Record<string, any>) => Section;
    events: PagedEvents;
    render: (components: Array<TemplateConfig>, userProps?: Record<string, any>) => void;
    pagesDiv: HTMLElement;
}

export type Section = {
    name: string;
    sections: Array<Section>;
    page: PagedHTMLElement;
    sectionNumber: number;
    depth: number;

    parent: Section,
    createSection: (name: string, userProps?: Record<string, any>) => Section;
}

export interface PagedHTMLElement extends HTMLElement {
    contentArea: HTMLElement;
    pageNumber: number;
    isNew: () => boolean;
}

export type TemplateConfig = {
    // component: (instance: PagedHTMLInstance, props?: Record<string, any>) => PagedComponent;
    [key: string]: any;
}

export type PagedComponent = {
    init?: (instance: PagedHTMLInstance) => Promise<void> | void;
    renderer: (instance: PagedHTMLInstance, userProps?: Record<string, any>) => AsyncIterableIterator<HTMLElement> | IterableIterator<HTMLElement>;
    onOverflow?: (instance: PagedHTMLInstance, el: HTMLElement) => void;
    onEnd?: (instance: PagedHTMLInstance) => Promise<void> | void;
}


export type ParagraphProps = {
    paraElement: HTMLElement
}

export type SectionProps = {
    templates: Array<TemplateConfig>;
    name: string;
    displayName: string;
    parentSection?: Section | PagedHTMLInstance,
    newPage?: boolean;
    threshold?: number;
}

export type TableProps = {
    columns: Array<Record<string, any>>;
    rows: Array<Record<string, any>>;
}