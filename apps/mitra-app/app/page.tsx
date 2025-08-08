import { HomeBanner } from "libs/shared/src/components/mitra/home-banner"
import { OngoingTask } from "libs/shared/src/components/mitra/ongoing-task"

export default async function Index() {
  return (
    <>
      <HomeBanner />
      <OngoingTask />
    </>
  );
}