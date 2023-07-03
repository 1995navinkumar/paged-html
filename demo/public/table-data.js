import { heightLens, nameLens, totalPower, powerLens, weightLens, imageLens } from "./hero-queries.js";

export function top10HeroesByPower(queries) {
    let top10Heroes = queries.getTop10HeroesByPower();
    let columns = [{
        name: 'avatar', header: (column) => ``, cell: (column, row) => `<img src=${imageLens(row)} />`,
    }, {
        name: "Name", header: () => 'Name', cell: (column, row, index) => `${nameLens(row)}`,
    }, {
        name: "Power", header: () => 'Power', cell: (column, row) => totalPower(powerLens(row)),
    }];

    return {
        columns,
        rows: top10Heroes
    }
}

export function heaviestHeroes(queries) {
    let heroes = queries.getHeaviestHeroes();
    let columns = [{
        name: "Name", header: () => 'Name', cell: (column, row, index) => `${nameLens(row)}`,
    }, {
        name: "Weight", header: () => 'Weight', cell: (column, row, index) => `${weightLens(row)}`,
    }]
    return {
        columns,
        rows: heroes
    }
}

export function top10TallestHeroes(queries) {
    let heroes = queries.getTop10TallestHeroes();
    let columns = [{
        name: "Name", header: () => 'Name', cell: (column, row, index) => `${nameLens(row)}`,
    }, {
        name: "Height", header: () => 'Height', cell: (column, row, index) => `${heightLens(row)}`,
    }]
    return {
        columns,
        rows: heroes
    }
}

export function HeroTable(heroes) {
    const getGroupedHeaders = () => {
        let columns = Object.keys(heroes[0]);
        return columns.map((col) => {
            let val = heroes[0][col];
            let span = typeof val === "object" ? Object.keys(val).length : 1;
            return {
                span,
                label: span > 1 ? col : ""
            };
        });
    };

    const getHeaders = () => {
        return flatObj(heroes[0]);
    };

    const flatObj = (obj) => {
        let keys = Object.keys(obj);
        return keys.reduce((acc, key) => {
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                return [...acc, ...flatObj(obj[key])];
            } else {
                return [...acc, key];
            }
        }, []);
    };

    let flatRow = (obj) => {
        if (!obj) return [];
        let keys = Object.keys(obj);
        return keys.reduce((acc, key) => {
            if (
                obj[key] &&
                typeof obj[key] === "object" &&
                !Array.isArray(obj[key])
            ) {
                return [...acc, ...flatRow(obj[key])];
            } else {
                return [...acc, obj[key]];
            }
        }, []);
    };

    return html`
            <div class="App">
                <table>
                    <thead>
                        <tr>
                        ${getGroupedHeaders().map((header, idx) => (
        html`<th colspan=${header.span}>
                            ${header.label}
                            </th>`
    ))}
                        </tr>
                        <tr>
                        ${getHeaders().map((header) => (
        html`<th>${header}</th>`
    ))}
                        </tr>
                    </thead>
                    <tbody>
                        ${heroes.map((hero, idx) => (
        html`<tr>
                            ${flatRow(hero).map((cell, idx) => (
            html`<td>${cell ? cell : "---"}</td>`
        ))}
                        </tr>`
    ))}
                    </tbody>
                </table>
            </div>
    `
}