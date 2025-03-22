import LoginForm from "@/components/forms/LoginForm";
import Procu from "@/components/shared/Procu";

function LoginPage() {
  return (
    <div className="mt-3 flex items-center">
      <div className="flex-grow">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
