import { AuthLayout } from "@shared/components/auth/AuthLayout";
import { registerPageData } from "@shared/data/system";

export default function Register() {
    return <AuthLayout form={registerPageData.forms} headline={registerPageData.headLine} tagline={registerPageData.tagLine} bgImage={registerPageData.bgImage} />;
}
