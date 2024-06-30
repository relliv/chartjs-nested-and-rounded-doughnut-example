import "zone.js";
import { CommonModule } from "@angular/common";
import { bootstrapApplication } from "@angular/platform-browser";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Chart, registerables } from "chart.js";
import doughnutChartPlugin from "./doughnut-chart-plugin";

Chart.register(...registerables);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas width="150px" height="150px" #statsCircleCanvas></canvas>
  `,
})
export class App implements OnInit {
  @ViewChild("statsCircleCanvas")
  public statsCircleCanvas!: ElementRef;

  @ViewChild("statsCircleCanvas") set load(x: any) {
    this.loadGraph();
  }

  private chartConfigs: any;
  private chartInstance!: Chart;

  ngOnInit(): void {
    this.chartConfigs = {
      type: "doughnut",
      data: {
        datasets: [],
      },

      plugins: [doughnutChartPlugin],
    };
  }

  /**
   * Load the daily stats graph
   */
  private loadGraph(): void {
    const drawGraph: any = this.statsCircleCanvas
      ? this.statsCircleCanvas.nativeElement
      : null;

    console.log(drawGraph);

    if (drawGraph) {
      const context = drawGraph.getContext("2d");

      const doughnutOptions: any = {
        ...Chart.defaults.datasets.doughnut,
        ...{
          cutout: "70%",
        },
      };

      // global configs
      Chart.defaults.elements.arc.borderWidth = 0;
      Chart.defaults.datasets.doughnut = doughnutOptions;
      Chart.defaults.plugins.tooltip.enabled = false;

      // #region Graph Data

      this.chartConfigs.data.datasets = [
        {
          data: [11, 111, 44, 55],
          backgroundColor: ["#FFF4E0", "#FFBF9B", "#B46060", "#4D4D4D"],
        },
      ];

      console.log(44);

      // #endregion

      this.destroyChart();
      this.chartInstance = new Chart(context, this.chartConfigs);
    }
  }

  /**
   * Destroy the chart before re-rendering
   */
  private destroyChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}

bootstrapApplication(App);
