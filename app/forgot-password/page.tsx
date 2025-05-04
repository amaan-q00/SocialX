import ForgotPassword from "@/components/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text px-6">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold text-brand">Reset Your Password</h1>
        <ForgotPassword />
      </div>
    </div>
  );
}
