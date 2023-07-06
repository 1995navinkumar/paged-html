export const styles = `
a {
    all: unset;
}

table {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td,
th {
    border: 1px solid #ddd;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

tr:hover {
    background-color: #ddd;
}

th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04aa6d;
    color: white;
}

td img {
    width: 56px;
    height: 56px;
    border-radius: 8px;
}

.section {
    font-size: 24px;
    font-weight: bold;
    color: gray;
    opacity: 0.9;
    margin-top: 24px;
}

.section[depth='1'] {
    margin-top: 0;
    border-bottom: 1px solid gray;
    padding-bottom: 4px;
}

.toc-section {
    display: flex;
    font-size: 22px;
    color: gray;
    /* font-weight: bold; */
    padding: 8px 0px;
    cursor: pointer;
}

.toc-dotted {
    flex: 1;
    border-bottom: 1px dotted;
    position: relative;
    bottom: 6px;
    margin: 0px 8px
}

.toc-title {
    font-size: 24px;
    color: gray;
    font-weight: bold;
    padding: 8px 0px;
}

.card-container {
    display: flex;
    justify-content: space-between;
}

.card-container:not(:first-child) {
    margin-top: 12px;
}

.card {
    width: 252px;
    border: 1px solid #dedede;
}

.card__avatar img {
    width: 100%;
    height: 264px;
    object-fit: fill;
}

.card__details {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    padding: 12px;
}`