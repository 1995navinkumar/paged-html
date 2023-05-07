// @ts-check
import { html, render } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import './components.js';
import { HeroQueries } from './hero-queries.js';
import { HeroChart } from './chart-data.js';
import { heaviestHeroes, top10HeroesByPower, top10TallestHeroes } from './table-data.js';
import PagedHTML, { utils } from '../../src/index.js';
import { Table } from '../../src/components.js';

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
                topLeft.innerHTML = `<img src='public/Marvel_Logo.svg' style='height : 44px'/>`;
            },
            onPageStart: () => { }
        },
    });


    instance.render([{
        component: PDFChart,
        chartData: chartData.genderPieChart()
    }, {
        component: PDFChart,
        chartData: chartData.raceBarChart(),
        width: 600,
        height: 200
    }, {
        component: Table,
        ...topHeroesByPower
    }, {
        component: Table,
        ...topHeaviestHeroes
    }, {
        component: Table,
        ...topHeroesByHeight
    }]);

}

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json")
        .then(res => res.json())
        .then(heroes => {
            render(PDF(heroes), document.getElementById("root"));
        })
});

if (process.env.NODE_ENV === 'development') {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}


