import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import { toast, Toaster } from "sonner";
import { isLoggedIn } from "@/utils/auth";
import axios, { AxiosError } from "axios";
import { getErrorMessage } from "@/utils/error";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { CustomError, ErrorResponseData } from "@/types";
import Input from "@/components/dashboard/ui/InputField";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Missing fields", {
        description: "Please fill in all fields",
        richColors: true,
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/api/admin/login", { email, password });
      toast.success("Welcome back!", {
        description: "Redirecting to dashboard...",
        richColors: true,
        duration: 4000,
      });
      router.push("/admin/dashboard");
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Login failed", {
        description: message,
        richColors: true,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | SoSHSA Admin</title>
      </Head>

      <Toaster position="top-right" richColors />

      <div
        className="min-h-screen bg-gray-50 grid grid-cols-12"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="hidden lg:flex col-span-8 p-4">
          <div className="w-full h-full rounded-2xl bg-teal-500/20 flex flex-col items-center justify-center gap-8">
            <Image
              width={300}
              height={300}
              alt="SoSHSA Logo"
              src="/images/logo.jpeg"
              className="object-contain rounded-full"
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                SoSHSA Admin
              </h1>
              <p className="text-gray-500 text-base">
                Society of Students of Health Sciences Association
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center mb-10">
              <Image
                width={150}
                height={150}
                alt="SoSHSA Logo"
                src="/images/logo.jpeg"
                className="object-contain rounded-full"
              />
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-500">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    required
                    type="email"
                    value={email}
                    placeholder="admin@soshsa.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    required
                    value={password}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const adminData = isLoggedIn(req);

  if (adminData) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
