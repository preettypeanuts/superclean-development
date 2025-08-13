import { PageBanner } from "libs/shared/src/components/mitra/page-banner"
import { NotificationListItems } from "libs/shared/src/components/mitra/notification-list"

export default function PemberitahuanPage() {
    return (
        <main className="pb-[20vh] space-y-7">
            <PageBanner
                title="Pemberitahuan"
                variant="white"
                size="compact"
            />
            <NotificationListItems />
        </main>
    )
}