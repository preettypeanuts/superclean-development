import { PageBanner } from "libs/shared/src/components/mitra/page-banner"
import { DaftarSPKTabs } from "libs/shared/src/components/mitra/daftar-spk-tabs"

export default function DaftarSPK() {
    return (
        <main className="pb-[20vh] space-y-7">
            <PageBanner
                title="Jadwal Pekerjaan"
            />
            <DaftarSPKTabs />
        </main>
    )
}