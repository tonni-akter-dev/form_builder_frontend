import { Suspense } from "react";
import LoginForm from "./LoginForm";
export const dynamic = "force-dynamic";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;