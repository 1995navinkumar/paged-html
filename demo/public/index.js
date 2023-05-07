// @ts-check
import { HeroQueries } from './hero-queries.js';
import { HeroChart } from './chart-data.js';
import { heaviestHeroes, top10HeroesByPower, top10TallestHeroes } from './table-data.js';
import PagedHTML, { utils } from '../../src/index.js';
import { Section, Table, TOC } from '../../src/components.js';

Chart.register(ChartDataLabels);

Chart.defaults.set('plugins.datalabels', {
    color: '#FFF'
});


function PDFChart(pagedInstance, { chartData, height = 500, width = 500 }) {
    function init() {
        var remainingHeight = pagedInstance.getRemainingHeight();
        if (remainingHeight < height) {
            pagedInstance.insertNewPage();
        }
    }

    function* renderer() {
        var chartEl = utils.htmlToElement(`
            <div style="width:${width}px; height:${height}px;">
                <canvas></canvas>
            </div>
        `);

        var pageContent = pagedInstance.getCurrentPage().contentArea;
        pageContent.appendChild(chartEl);

        new Chart(chartEl.querySelector('canvas'), chartData);

        yield chartEl;
    }

    function onOverflow(overflowedImageElement) {

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

function PDF(heroes) {
    let queries = HeroQueries(heroes);
    window.queries = queries;
    let chartData = HeroChart(queries);
    let topHeroesByPower = top10HeroesByPower(queries);
    let topHeroesByHeight = top10TallestHeroes(queries);
    let topHeaviestHeroes = heaviestHeroes(queries);

    const instance = PagedHTML.create({
        root: document.getElementById('root'),
        events: {
            onPageEnd: (page, instance) => {
                const topLeft = page.querySelector('.top-left');
                const style = `
                    width: 100%;
                    position: relative;
                    top: 16px;
                    left: 16px;
                `
                topLeft.innerHTML = `<img src='public/Marvel_Logo.svg' style='${style}'/>`;
            },
            onPageStart: () => { }
        },
    });

    const heroesByGender = {
        component: Section,
        name: 'heroesByGender',
        displayName: 'Heroes By  Gender',
        templates: [{
            component: PDFChart,
            chartData: chartData.genderPieChart()
        }]
    }

    const heroesByRace = {
        component: Section,
        name: 'heroesByRace',
        displayName: 'Heroes By Race',
        templates: [{
            component: PDFChart,
            chartData: chartData.raceBarChart(),
            width: 600,
            height: 200
        }]
    }

    const powerfulHeroes = {
        component: Section,
        newPage: true,
        name: 'powerfulHeroes',
        displayName: 'Powerful Heroes',
        templates: [{
            component: Table,
            ...topHeroesByPower
        }]
    }

    const heaviestHeroesSection = {
        component: Section,
        newPage: true,
        name: 'heaviestHeroes',
        displayName: 'Heaviest Heroes',
        templates: [{
            component: Table,
            ...topHeaviestHeroes
        }]
    }

    const tallestHeroes = {
        component: Section,
        name: 'tallestHeroes',
        displayName: 'Tallest Heroes',
        templates: [{
            component: Table,
            ...topHeroesByHeight
        }]
    }

    const TableOfContents = {
        component: TOC,
    }

    instance.render([
        heroesByGender,
        heroesByRace,
        powerfulHeroes,
        heaviestHeroesSection,
        tallestHeroes, TableOfContents]);

}

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json")
        .then(res => res.json())
        .then(heroes => {
            PDF(heroes);
        })
});

if (process.env.NODE_ENV === 'development') {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}


