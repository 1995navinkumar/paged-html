# PagedHTML

A tiny util to render dynamic HTML contents page by page to make it print ready. It can be used to generate dynamic PDF's. 

## Motivation

There are several standalone libraries to generate dynamic PDF's.
* iText for Java
* pdfkit for Node
* jspdf for Node



Main disadvantage of using these libraries is that the developer needs to get used to the API's before using it efficiently. Also, PDF is more like a Read Only User Interface and we all know what HTML and CSS is capable of in terms of User Interfaces. To put it simply, the libraries listed above will make PDF creation difficult even for a simpler UI. 
So, we can happily create UI using HTML and save as PDF using browsers, which will be equivalent to the generated PDF's of native libraries.
But the problem is not in converting the HTML to PDF (which the browser does efficiently), but in aligning the contents with respect to the page size. 
There is no control when a page will be created or when an element overflows the current page. Images will be sliced between the two pages and so on. 

Wouldn't it be dreamy if we can render HTML contents page by page along with complete control over where the element should be rendered in the page ? 
Yes, you can! Using PagedHTML. 

## Features

* Render HTML contents Page by Page
* Component based rendering
* Custom Page sizes
* Custom Margins
* Header and Footer for pages
* Table of Contents
* Hooks for PageStart, PageEnd, Overflow of element.
* Built-In Components
  * Chapter
  * Section
  * Paragraph
  * Image
  * Table
  * Table Of Contents
  * Header 
  * Footer


## Common Questions

* What are the features that will be missed when comparing to native libraries?
  * There are few features which is not supported by browsers when creating a PDF
    * Bookmarks
    * Password Encryption
    * Filling Forms in PDF
* Can I reuse the UI components that I already have for my website?
  * Yes and No
    * Because, Web UI components are created for interactivity and not for handling page breaks. 
    * Most of the time, what we show in web UI does not actually fit in a PDF. PDF itself will have a separate theme and boundaries which makes it different to treat it like a web UI component.
    * We can reuse the logic, but it would be difficult to reuse the exact same component for PDF.
* How can I render PDF in server-side? In cases where I schedule it?
  * All you need is a browser and a page to render in it. So, Puppeteer would be a good solution to render the PDF in server in case of scheduling.



## Usage

```npm install paged-html```

```js
import {PagedHTML} from 'paged-html';
import styles from 'paged-html/paged.css';


```


## Component Structure

Each PagedHTML Component has the below hooks

```js
    function MyPagedComponent( pagedInstance, userProps ){
        function init(){
            /**
              Invoked first
              Can initialise any component state here
             */
        }
        function* renderer(){
            /**
                A Generator function used to push the actual HTML elements one by one to the current page. 
                Make sure to break the component into tiny elements so that it will be easy to handle overflows.
                Will be called until all the elements are rendered to the page.
             */
        }
        function onOverflow(overflowedElement){
            /**
               Hook invoked whenever the yielded element overflows
               Logic must be added (DOM mutation) to handle overflows 
             */
        }

        function onEnd(){
            /**
               Invoked when the component has rendered all its elements. Can be used to clean up any state.
             */
        }


    }
```

### pagedInstance

Each component will receive pagedInstance upon rendering

#### Methods

* createNewPage
* insertNewPage
* getCurrentPage
* getRemainingHeight
* createSection
* TemplateRenderer


#### Events

* onPageStart
* onPageEnd

#### Properties

* pages
* sections
* destinationNode
* pagesDiv
* templates
* events


### Template Structure 

`templates` is an array of PagedHTML components which will be rendered sequentially. If a PagedHTML component needs to render its own templates (chapter and sections), it can be provided as nested property

```js

templates = [{
  component : Section,
  name: "Chapter1",
  displayName: "Chapter 1",
  // templates that needs to be rendered inside this section can be provided as follows
},{

}]

```