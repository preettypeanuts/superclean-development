import { AuthLayout } from "@shared/components/auth/AuthLayout";
import { loginPageData } from "@shared/data/system";

export default function Login() {
    return <AuthLayout form={loginPageData.forms} headline={loginPageData.headLine} tagline={loginPageData.tagLine} bgImage={loginPageData.bgImage} />;
}
