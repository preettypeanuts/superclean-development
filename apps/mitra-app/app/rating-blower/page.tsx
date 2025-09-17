import { PageBanner } from "libs/shared/src/components/mitra/page-banner"
import { TipWidget } from "libs/shared/src/components/mitra/tip-widget"
import { RatingHistory } from "libs/shared/src/components/mitra/rating-history"

export default function RatingBlowerPage() {
    return (
        <main className="pb-[20vh]">
            <PageBanner
                title="Rating"
                variant="white"
                size="compact"
            />
            <TipWidget blower={true} />
            <RatingHistory blower={true} />
        </main>
    )
}