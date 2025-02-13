import { BarComponent } from "libs/ui-components/src/components/ui/bar-chart";
import { PieChartComponent } from "libs/ui-components/src/components/ui/pie-chart";
import { LineChartComponent } from "libs/ui-components/src/components/ui/line-chart";
import { RadialChartComponent } from "libs/ui-components/src/components/ui/radial-chart";

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