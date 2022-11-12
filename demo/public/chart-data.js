import { avgPower, powerLens } from "./hero-queries.js";

export const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};


// ----------------------------- hero utils -------------------------

export function HeroChart(queries) {
    function raceBarChart() {
        let heroes = queries.getHeroesByRace({ minimumCount: 8 });
        let labels = heroes.map(hero => hero[0]);
        let datasets = [{
            label: "Count",
            data: heroes.map(hero => hero[1].length),
            backgroundColor: CHART_COLORS.green,
        }, {
            type: 'bar',
            label: "Avg Power (Max. 100)",
            data: heroes.map(raceHeroes => {
                let totalRacePower = raceHeroes[1].reduce((a, c) => a += avgPower(powerLens(c)), 0);
                return Math.floor(totalRacePower / raceHeroes[1].length);
            }),
            backgroundColor: CHART_COLORS.red,
        }]

        let data = {
            labels,
            datasets
        }

        return {
            type: 'bar',
            data: data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Heroes By Race'
                    }
                }
            },
        }

    }


    function genderPieChart() {
        let heroesByGender = queries.getHeroesCountByGender();
        let labels = Object.keys(heroesByGender);
        let datasets = [{
            label: "Heroes by Gender",
            data: Object.values(heroesByGender),
            backgroundColor: [CHART_COLORS.red, CHART_COLORS.blue, CHART_COLORS.green]
        }]

        let data = { labels, datasets };

        return {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(2) + "%";
                            return `${percentage}\n(${value})`;
                        },
                        color: '#000',
                    },
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Heroes by Gender'
                    }
                }
            },
        }
    }

    return {
        genderPieChart,
        raceBarChart
    }
}
