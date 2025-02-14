import { BarComponent } from "libs/ui-components/src/components/bar-chart";
import { PieChartComponent } from "libs/ui-components/src/components/pie-chart";
import { LineChartComponent } from "libs/ui-components/src/components/line-chart";
import { RadialChartComponent } from "libs/ui-components/src/components/radial-chart";

export default async function Index() {
  return (
    <>
    <section className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <BarComponent />
        <PieChartComponent />
        <RadialChartComponent/>
      </div>
      <LineChartComponent />
    </section>
    </>
  );
}