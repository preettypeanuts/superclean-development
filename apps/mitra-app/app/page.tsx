import { HomeBanner } from "libs/shared/src/components/mitra/home-banner"
import { OngoingTask } from "libs/shared/src/components/mitra/ongoing-task"
import { HistoryTask } from "libs/shared/src/components/mitra/history-task"
import { TotalRating } from "libs/shared/src/components/mitra/total-rating"

export default async function Index() {
  return (
    <main className="pb-[20vh] space-y-7">
      <HomeBanner />
      <OngoingTask />
      <HistoryTask />
      <TotalRating />
    </main>
  );
}