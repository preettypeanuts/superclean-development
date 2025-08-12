import { PageBanner } from "libs/shared/src/components/mitra/page-banner"
import { TipWidget } from "libs/shared/src/components/mitra/tip-widget"

export default function RatingPage() {
    return (
        <main className="pb-[20vh]">
            <PageBanner
                title="Rating"
                variant="white"
                size="compact"
            />
            <TipWidget/>
        </main>
    )
}