import { PageBanner } from "libs/shared/src/components/mitra/page-banner"
import { JadwalPekerjaanBlowerTabs } from "libs/shared/src/components/mitra/jadwal-pekerjaan-blower-tabs"

export default function JadwalPekerjaan() {
    return (
        <main className="pb-[20vh] space-y-7">
            <PageBanner
                title="Jadwal Pekerjaan"
            />
            <JadwalPekerjaanBlowerTabs />
        </main>
    )
}