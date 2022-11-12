
import { html, render } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import './components.js';
import { HeroQueries } from './hero-queries.js';
import { HeroChart } from './chart-data.js';
import { heaviestHeroes, top10HeroesByPower, top10TallestHeroes } from './table-data.js';

Chart.register(ChartDataLabels);

Chart.defaults.set('plugins.datalabels', {
    color: '#FFF'
});

function App(heroes) {
    let queries = HeroQueries(heroes);
    window.queries = queries;
    let chartData = HeroChart(queries);
    let topHeroesByPower = top10HeroesByPower(queries);
    let topHeroesByHeight = top10TallestHeroes(queries);
    let topHeaviestHeroes = heaviestHeroes(queries);

    return html`
        <div style="display:flex; flex-wrap: wrap; grid-gap:44px">
            <sn-chart .chartdata=${chartData.genderPieChart()}></sn-chart>
            <sn-chart .width=${800} .chartdata=${chartData.raceBarChart()}></sn-chart>
            <sn-table 
                .caption=${"Powerful Heroes"} 
                .columns=${topHeroesByPower.columns} 
                .rows=${topHeroesByPower.rows}>
            </sn-table>
            <sn-table 
                .caption=${"Tallest Heroes"}
                .columns=${topHeroesByHeight.columns}
                .rows=${topHeroesByHeight.rows}
            >
            </sn-table>
            <sn-table 
                .caption=${"Heaviest Heroes"}
                .columns=${topHeaviestHeroes.columns}
                .rows=${topHeaviestHeroes.rows}
            >
            </sn-table>
        </div>
    `
}


document.addEventListener("DOMContentLoaded", () => {
    fetch("https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json")
        .then(res => res.json())
        .then(heroes => {
            render(App(heroes), document.getElementById("root"));
        })
}
);