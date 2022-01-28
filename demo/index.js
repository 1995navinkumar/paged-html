const { PagedHTML, components, utils } = require('paged-html');
const styles = require('../paged.css');

const { Section, Paragraph, TOC } = components;
const { htmlToElement } = utils;

document.addEventListener("DOMContentLoaded", () => {
    var rootNode = document.querySelector("#root");

    var templates = [{
        component: Section,
        name: "Chapter1",
        displayName: "Chapter 1",
        newPage: true,
        templates: [{
            component: Paragraph,
            paraElement: getParaElement()
        }]
    }]

    var pdfInstance = PagedHTML({
        rootNode,
        templates
    })

    var toc = PagedHTML({
        rootNode,
        templates: [{
            component: TOC,
            sections: pdfInstance.sections,
            parentNode: pdfInstance.rootNode
        }]
    })
})

function getParaElement() {
    return htmlToElement(
        `
                <div class="para">
                    <p>
                        <b>Whitehawk Camp</b> is the remains of a
                        <a href="/wiki/Causewayed_enclosure" title="Causewayed enclosure">causewayed enclosure</a> on
                        <a href="/wiki/Whitehawk_Hill" title="Whitehawk Hill">Whitehawk Hill</a> near
                        <a href="/wiki/Brighton_and_Hove" title="Brighton and Hove">Brighton</a>, East Sussex, England. Causewayed
                        enclosures are a form of
                        <a href="/wiki/Neolithic_British_Isles#Early_and_Middle_Neolithic:_4000–2900_BCE"
                        title="Neolithic British Isles">early Neolithic</a>
                        <a href="/wiki/Earthworks_(archaeology)" title="Earthworks (archaeology)">earthwork</a> that were built in
                        England from shortly before 3700 BC until
                        about 3300 BC, characterized by the full or partial enclosure of an area with ditches that are interrupted by
                        gaps, or causeways. Their purpose is not known; they may have been settlements, or meeting places, or ritual
                        sites. The Whitehawk site consists of four roughly concentric circular ditches, with banks of earth along the
                        interior of the ditches evident in some places. There may have been a timber <a href="/wiki/Palisade"
                        title="Palisade">palisade</a> on top of the banks. Outside the outermost circuit there are at least two more
                        ditches, one of which is thought from <a href="/wiki/Radiocarbon_dating"
                        title="Radiocarbon dating">radiocarbon</a> evidence to date to the <a href="/wiki/Bronze_Age_Britain"
                        title="Bronze Age Britain">Bronze Age</a>,<sup id="cite_ref-2" class="reference"><a href="#cite_note-2">[note
                            1]</a></sup> about two thousand years after the earliest dated activity at the site.
                            </p>
                            
                            <p>
                                Whitehawk was first excavated by R.P. Ross Williamson and <a
                                href="/w/index.php?title=E._Cecil_Curwen&amp;action=edit&amp;redlink=1" class="new"
                                title="E. Cecil Curwen (page does not exist)">E. Cecil Curwen</a> in 1929 in response to a plan to lay out <a
                                href="/wiki/Football_pitch" title="Football pitch">football pitches</a> on the site. <a
                                href="/wiki/Brighton_Racecourse" title="Brighton Racecourse">Brighton Racecourse</a> overlaps Whitehawk Camp,
                                and when an expansion of the course's pulling-up ground<sup id="cite_ref-4" class="reference"><a
                                    href="#cite_note-4">[note 2]</a></sup> affected part of the site, Curwen led another <a
                                    href="/wiki/Rescue_archaeology" title="Rescue archaeology">rescue dig</a> in the winter of 1932–1933;
                                    similarly in 1935 the area to be crossed by a new road was excavated, again by Curwen. In 1991, during the
                                    construction of a housing development near the site, one of the ditches outside the outermost circuit was
                                    uncovered, and the construction was paused to allow an excavation, run by <a href="/wiki/Miles_Russell"
                                    title="Miles Russell">Miles Russell</a>. In 2011, the Gathering Time project published an analysis of
                                    <span style="color : red">radiocarbon dates from almost forty British causewayed enclosures, including several from Whitehawk Camp. The
                                        conclusion was that the Neolithic part of the site was probably constructed between 3650 and 3500 BC, and
                                        probably went out </span>of use some time between 3500 and 3400 BC. The site was designated as a <a
                                        href="/wiki/Scheduled_monument" title="Scheduled monument">scheduled monument</a> in 1923.
                                        </p>
                                        </div>
                                        `
    )
}
