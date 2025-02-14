import { DataTable } from "libs/ui-components/src/components/data-table"
import { Header } from "@shared/components/Header"
import { Wrapper } from "libs/shared/src/components/Wrapper"
export default async function UserPage() {
    return (
        <Wrapper>
            <Header />
            <DataTable />
        </Wrapper>
    );
}