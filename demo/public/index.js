// @ts-check
import { HeroQueries } from './hero-queries.js';
import { HeroChart } from './chart-data.js';
import { heaviestHeroes, top10HeroesByPower, top10TallestHeroes } from './table-data.js';
import PagedHTML, { utils, components } from '../../build/index.js';

const { Section, TOC, Table } = components;

Chart.register(ChartDataLabels);

Chart.defaults.set('plugins.datalabels', {
    color: '#FFF'
});


function PDFChart({ chartData, height = 500, width = 500 }) {
    function init(pagedInstance) {
        var remainingHeight = pagedInstance.getRemainingHeight();
        if (remainingHeight < height) {
            pagedInstance.insertNewPage();
        }
    }

    async function* renderer(pagedInstance) {
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
    let chartData = HeroChart(queries);
    let topHeroesByPower = top10HeroesByPower(queries);
    let topHeroesByHeight = top10TallestHeroes(queries);
    let topHeaviestHeroes = heaviestHeroes(queries);

    const root = document.getElementById('root');

    if (!root) return;

    const instance = PagedHTML.create({
        root,
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

    const heroesByGender = Section({
        name: 'heroesByGender',
        displayName: 'Heroes By Gender',
        templates: [PDFChart({ chartData: chartData.genderPieChart() })]
    })

    const heroesByRace = Section({
        name: 'heroesByRace',
        displayName: 'Heroes By Race',
        newPage: true,
        templates: [Section({
            name: 'heroesByRaceSection1',
            displayName: 'Heroes By Race Section 1',
            templates: [PDFChart({
                chartData: chartData.raceBarChart(), width: 600,
                height: 200
            })]
        })]
    })

    const powerfulHeroes = Section({
        newPage: true,
        name: 'powerfulHeroes',
        displayName: 'Powerful Heroes',
        templates: [Table({ ...topHeroesByPower })]
    })

    const heaviestHeroesSection = Section({
        newPage: true,
        name: 'heaviestHeroes',
        displayName: 'Heaviest Heroes',
        templates: [Table({ ...topHeaviestHeroes })]
    })

    const tallestHeroes = Section({
        name: 'tallestHeroes',
        displayName: 'Tallest Heroes',
        templates: [Table({ ...topHeroesByHeight })]
    })

    const TableOfContents = TOC();

    instance.render([heroesByGender, heroesByRace, powerfulHeroes, heaviestHeroesSection, tallestHeroes, TableOfContents]);

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


