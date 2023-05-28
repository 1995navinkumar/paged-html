import { utils } from "../../build";
import { avgPower, heightInCm, heightLens, weightInKg, weightLens } from "./hero-queries";

export function PDFChart({ chartData, height = 500, width = 500 }) {
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

export function Card({ heroes }) {
    const height = 579;
    function init(pagedInstance) {
        var remainingHeight = pagedInstance.getRemainingHeight();
        if (remainingHeight < height) {
            pagedInstance.insertNewPage();
        }
    }

    function getPairs(heroes) {
        const pairs = [];
        for (var cursor = 0; cursor < heroes.length; cursor += 2) {
            const pair = heroes.slice(cursor, cursor + 2);
            pairs.push(pair);
        }
        return pairs;
    }

    function renderCard(hero) {
        const powerStat = avgPower(hero.powerstats);
        const height = heightInCm(heightLens(hero));
        const weight = weightInKg(weightLens(hero));
        return `
            <div class="card ${hero.name}">
                <div class="card__avatar">
                    <img src=${hero.images.sm} />
                </div>
                <div class="card__details">
                    <span>Name: ${hero.name} </span>
                    <span>Gender: ${hero.appearance.gender}</span>
                    <span>Alignment: ${hero.biography.alignment}</span>
                    <span>Power Stat: ${powerStat}</span>
                    <span>Height: ${height} </span>
                    <span>Weight: ${weight}</span>
                </div>
            </div>
        `;
    }

    async function* renderer(pagedInstance) {
        const pairs = getPairs(heroes);
        for (const heroPair of pairs) {
            var cardEl = utils.htmlToElement(`
            <div class="card-container">
                ${heroPair.map(renderCard).join("")}
            </div>
            `);
            var pageContent = pagedInstance.getCurrentPage().contentArea;
            pageContent.appendChild(cardEl);
            yield cardEl;
        }
    }

    function onOverflow(pagedInstance, el) {
        pagedInstance.insertNewPage();
        pagedInstance.getCurrentPage().contentArea.appendChild(el);
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