// @ts-check
import { HeroQueries } from './hero-queries.js';
import { HeroChart } from './chart-data.js';
import { heaviestHeroes, top10HeroesByPower, top10TallestHeroes } from './table-data.js';
import PagedHTML, { components, utils } from '../../build/index.js';
import { Card, PDFChart } from './components.js';
import { styles } from './styles.js';

const { Section, TOC, Table } = components;

Chart.register(ChartDataLabels);

Chart.defaults.set('plugins.datalabels', {
    color: '#FFF'
});

async function PDF(heroes) {
    let queries = HeroQueries(heroes);
    // @ts-ignore
    window.queries = queries
    let chartData = HeroChart(queries);
    let topHeroesByPower = top10HeroesByPower(queries);
    let topHeroesByHeight = top10TallestHeroes(queries);
    let topHeaviestHeroes = heaviestHeroes(queries);
    let heroesOfTheMonth = queries.getHeroesOftheMonth(10);

    const rootEl = document.getElementById('root');

    const shadow = rootEl?.attachShadow({ mode: 'closed' });

    shadow?.appendChild(utils.htmlToElement(`<div>
        <style>${styles}</style>
    </div>`));

    const root = shadow?.firstElementChild;

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
                topLeft.innerHTML = `<span>${page.pageNumber}</span>`;
            },
            onPageStart: () => { }
        }
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

    const cardComponent = Section({
        name: 'heroOfTheMonth',
        displayName: 'Hero Of the Month',
        newPage: true,
        templates: [Card({ heroes: heroesOfTheMonth })]
    })

    await instance.render([heroesByGender, heroesByRace, powerfulHeroes, heaviestHeroesSection, tallestHeroes, cardComponent]);

    instance.events = {
        onPageEnd: (page, instance) => {
            // const topLeft = page.querySelector('.top-left');
            // const style = `
            //     width: 100%;
            //     position: relative;
            //     top: 16px;
            //     left: 16px;
            // `
            // topLeft.innerHTML = `<span>${page.pageNumber}</span>`;
        },
        onPageStart: () => { }
    }

    instance.render([TOC]);

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


