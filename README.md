# PagedHTML

A tiny util to render dynamic HTML contents page by page to make it print ready. It can be used to generate dynamic PDF's. 

## Motivation

There are several standalone libraries to generate dynamic PDF's. Popular ones are

* [iText](https://itextpdf.com/en/products/itext-7/itext-7-core) for Java
* [jsPDF](https://github.com/parallax/jsPDF) for Node


Main disadvantage of using these libraries is that the developer needs to get used to the API's before using it efficiently. Also, PDF is more like a Read Only User Interface and we all know what HTML and CSS is capable of in terms of User Interfaces. To put it simply, the libraries listed above will make PDF creation difficult even for a simpler UI. 


Consider we need to create a PDF that has text and image side by side.

<details>
<summary>Using iText</summary>

```java
public void createPdf(String dest) throws IOException, DocumentException {
    Document document = new Document();
    PdfWriter.getInstance(document, new FileOutputStream(dest));
    document.open();
    PdfPTable table = new PdfPTable(2);
    table.setWidthPercentage(100);
    table.setWidths(new int[]{1, 2});
    table.addCell(createImageCell(IMG1));
    table.addCell(createTextCell("This picture was taken at Java One.\nIt shows the iText crew at Java One in 2013."));
    document.add(table);
    document.close();
}

public static PdfPCell createImageCell(String path) throws DocumentException, IOException {
    Image img = Image.getInstance(path);
    PdfPCell cell = new PdfPCell(img, true);
    return cell;
}

public static PdfPCell createTextCell(String text) throws DocumentException, IOException {
    PdfPCell cell = new PdfPCell();
    Paragraph p = new Paragraph(text);
    p.setAlignment(Element.ALIGN_RIGHT);
    cell.addElement(p);
    cell.setVerticalAlignment(Element.ALIGN_BOTTOM);
    cell.setBorder(Rectangle.NO_BORDER);
    return cell;
}
```

</details>

<details>
<summary>Using jsPDF</summary>
You need to use an extra plugin called <a href="https://github.com/simonbengtsson/jsPDF-AutoTable">jsPDF-AutoTable</a> to achieve this!.

```js
function generate() {
      var doc = new jsPDF();

  doc.autoTable({
    html: '#mytable',
    bodyStyles: {minCellHeight: 15},
    didDrawCell: function(data) {
      if (data.column.index === 5 && data.cell.section === 'body') {
         var td = data.cell.raw;
         var img = td.getElementsByTagName('img')[0];
         var dim = data.cell.height - data.cell.padding('vertical');
         var textPos = data.cell.textPos;
         doc.addImage(img.src, textPos.x,  textPos.y, dim, dim);
      }
    }
  });

      doc.save("table.pdf");
    }
```
</details>

<details>
<summary>Using HTML and CSS</summary>

```html
  <div style="display : flex;">
    <p style="flex : 1">This is a sample text that is on the left side of the page</p>
    <img style="width : 100px; height : 100px" src="sample.png" />
  </div>
```

</details>

<br/>  

As you can see the difference, it is much easier to generate PDF UI using HTML. Also, it eliminates the need for learning a whole bunch of API's to achieve something that can be easily done by HTML and CSS.  

So, we can happily create UI using HTML and save as PDF using browsers, which will be equivalent to the generated PDF's of native libraries.
But the problem is not in converting the HTML to PDF (which the browser does already), but in aligning the contents with respect to the page size. 
There is no control when a page will be created or when an element overflows the current page. Images will be sliced between the two pages and the problem goes on. 

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

## Sample Output

Check out the sample generated PDF out of a [Super Hero API](./output/Paged%20HTML.pdf)


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
* How can I render PDF in server-side? In cases where I want to schedule it?
  * All you need is a browser and a page to render in it. So, Puppeteer would be a good solution to render the PDF in server in case of scheduling.



## Usage

```npm install paged-html```

```js
import PagedHTML , { components } from 'paged-html';

const  { Section } = components;

const root = document.getElementById('root');

const instance = PagedHTML.create({
    root,
    pageConfig: {
      landscape : false,
      format: 'A4'
    }
});

const Chapter1 = Section({
  name: "Chapter1",
  displayName: "Chapter 1",
  templates : [ Table({ columns, rows }), YourCustomChartComponent(...data) ]
});

const Chapter2 = Section({
  name: "Chapter2",
  displayName: "Chapter 2",
  templates : [ Table({ columns, rows }), YourCustomChartComponent(...data) ]
});

instance.render([Chapter1, Chapter2]);

```


## Component Structure

PagedHTML Component Structure

```js
    function MyPagedComponent( instance, userProps ){
        async function init(){
            /**
              Invoked first
              Can initialise any component state here
             */
        }
        async function* renderer(){
            /**
                A Generator function used to push the actual HTML elements one by one to the current page. 
                Make sure to break the component into tiny elements so that it will be easy to handle overflows.
                Will be called until all the elements are rendered to the page and    there is nothing to yield.
             */
        }
        async function onOverflow(overflowedElement){
            /**
               Hook invoked whenever the yielded element overflows
               Custom Logic must be added (DOM mutation) to handle overflows. 
             */
        }

        async function onEnd(){
            /**
               Invoked when the component has rendered all its elements. Can be used to clean up any state.
             */
        }
    }
```

### Example - PDF Image Component

```js
  import { utils } from 'paged-html';

  function PDFImage({ src , height = "100px" , width = "100px" }){
      return function(instance){
                function init(){
                    /* You look for the remaining space in the current page and decide
                        whether the image can be rendered in the same page or in a new page
                    */ 

                    var remainingHeight = instance.getRemainingHeight();
                    if(remainingHeight < height) {
                      instance.insertNewPage();
                    }
                }

                function* renderer(){
                    var imgElement = utils.htmlToElement(`
                      <img src=${src} style="width : ${width}; height : ${height}"/>
                    `);

                      var pageContent = instance.getCurrentPage().contentArea;
                      pageContent.appendChild(imgElement);
                      
                      /* 
                        you need to yield elements that has been appended to the page so as to know when overflow is occuring.
                      */
                      yield imgElement; 
                }

                function onOverflow(overflowedImageElement){
                    /*
                        Hook for handling overflow content. Not needed in this case since we have already handled the case in init hook
                    */

                }

                function onEnd(){
                    
                }

                return {
                  init,
                  renderer,
                  onOverflow,
                  onEnd
                }
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