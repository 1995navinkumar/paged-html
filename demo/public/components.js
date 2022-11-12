import { LitElement, html, ref, createRef, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

class RenderChart extends LitElement {
    chartRef = createRef();
    render() {
        return html`<canvas ${ref(this.chartRef)} width=${this.width || 400} height=${this.height || 400}></canvas>`;
    }
    firstUpdated() {
        let ctx = this.chartRef.value;
        new Chart(ctx, this.chartdata);
    }
}
customElements.define('sn-chart', RenderChart);


class RenderTable extends LitElement {
    static styles = css`
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
            min-width : 150px;
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #04aa6d;
            color: white;
        }
    `
    render() {
        return html`
                <table>
                    <caption>${this.caption}</caption>
                    <thead>
                        <tr>
                            ${
                                this.columns.map(column => html`<th>${column.label}</th>`)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            this.rows.map(row => html`
                                    <tr>
                                        ${this.columns.map(col => html`<td>${col.accessor(row)}</td>`)}
                                    </tr>
                                `)
                        }
                    </tbody>
                </table>
        `
    }
}

customElements.define('sn-table', RenderTable);
