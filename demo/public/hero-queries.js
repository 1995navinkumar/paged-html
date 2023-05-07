export const groupBy = data => keyFn => {
    return data.reduce((acc, item) => {
        let key = keyFn(item);
        acc[key] = key in acc ? [...acc[key], item] : [item];
        return acc;
    }, {});
}


export const genderLens = hero => hero.appearance.gender;
export const genderMap = {
    "-": "Unknown"
}

export const powerLens = hero => hero.powerstats;
export const totalPower = p => p.intelligence + p.strength + p.speed + p.durability + p.power + p.combat;
export const avgPower = p => totalPower(p) / 6;

export const imageLens = hero => hero.images.md;

export const nameLens = hero => hero.name;
export const heightLens = hero => hero.appearance.height[1]; // we omit inches and consider only cm/meters
export const heightInCm = h => {
    let [value, unit] = h.split(" ");
    return unit == "cm" ? Number(value) : 100 * Number(value);
}

export const weightLens = hero => hero.appearance.weight[1]; //ignoring lb
export const weightInKg = w => {
    let [value, unit] = w.split(" ");
    value = value.replace(",", "");
    return unit == "kg" ? Number(value) : 1000 * Number(value);
}
export const raceLens = hero => hero.appearance.race;





export function HeroQueries(heroes) {
    const heroGroupBy = groupBy(heroes);

    function getTotalHeroesCount() {
        return heroes.length;
    }

    function getHeroesCountByGender() {
        const groupByGender = heroGroupBy(genderLens);
        return Object.entries(groupByGender)
            .reduce((a, c) => {
                let key = c[0] in genderMap ? genderMap[c[0]] : c[0];
                a[key] = c[1].length;
                return a;
            }, {});
    }

    function getTop10HeroesByPower() {
        return [...heroes]
            .sort((hero1, hero2) => totalPower(powerLens(hero2)) - totalPower(powerLens(hero1)))
            .slice(0, 10)
    }

    function getTop10TallestHeroes() {
        return [...heroes]
            .sort((hero1, hero2) => heightInCm(heightLens(hero2)) - heightInCm(heightLens(hero1)))
            .slice(0, 10)
    }

    function getHeaviestHeroes() {
        return [...heroes]
            .sort((hero1, hero2) => weightInKg(weightLens(hero2)) - weightInKg(weightLens(hero1)))
            .slice(0, 10)
    }

    function getHeroesByRace({ minimumCount }) {
        const race = heroGroupBy(raceLens);
        return Object.entries(race)
            .filter(hero => hero[0] != "null")
            .filter(hero => hero[1].length >= minimumCount)
    }

    return {
        getTotalHeroesCount,
        getHeroesCountByGender,
        getTop10HeroesByPower,
        getTop10TallestHeroes,
        getHeaviestHeroes,
        getHeroesByRace
    }
}