import useSWR from "swr";
import { NextApiRequest } from "next";
import { BASE_URL } from "@/utils/url";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { isLoggedIn } from "@/utils/auth";
import { useState, FormEvent } from "react";
import { getErrorMessage } from "@/utils/error";
import Button from "@/components/dashboard/ui/Button";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData, TabType } from "@/types";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { AdminProfile, DashboardPageProps } from "@/types/interface/dashboard";

const SettingsPage = ({ adminData }: DashboardPageProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const fetchProfile = async (): Promise<AdminProfile> => {
    const { data } = await axios.get(`${BASE_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data: profile, mutate } = useSWR(
    ["admin-profile", adminData.token],
    fetchProfile,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load profile", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const [profileSettings, setProfileSettings] = useState({
    firstName: profile?.firstName || adminData.firstName,
    lastName: profile?.lastName || adminData.lastName,
    email: profile?.email || adminData.email,
  });

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const { data } = await axios.patch(
        `${BASE_URL}/admin/profile`,
        profileSettings,
        {
          headers: { Authorization: `Bearer ${adminData.token}` },
        },
      );

      await axios.post("/api/admin/update-cookie", {
        token: adminData.token,
        userId: adminData.userId,
        email: data.data.email,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
      });

      toast.success("Profile updated successfully");
      mutate();

      window.location.reload();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to update profile", {
        description: message,
        duration: 4000,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: FormEvent) => {
    e.preventDefault();

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSavingPassword(true);

    try {
      await axios.patch(
        `${BASE_URL}/admin/profile`,
        { password: passwordSettings.newPassword },
        {
          headers: { Authorization: `Bearer ${adminData.token}` },
        },
      );
      toast.success("Password changed successfully");
      setPasswordSettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to change password", {
        description: message,
        duration: 4000,
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "security" as TabType, label: "Security", icon: Lock },
  ];

  return (
    <>
      <Toaster position="top-right" richColors />
      <DashboardLayout pageTitle="Settings" adminData={adminData}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white">
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white px-6 py-4 border-l border-teal-300">
              {activeTab === "profile" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Profile Information
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Update your personal account details
                    </p>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                      className="border-teal-100"
                        label="First Name"
                        type="text"
                        value={profileSettings.firstName}
                        onChange={(e) =>
                          setProfileSettings({
                            ...profileSettings,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />

                      <Input
                      className="border-teal-100"
                        label="Last Name"
                        type="text"
                        value={profileSettings.lastName}
                        onChange={(e) =>
                          setProfileSettings({
                            ...profileSettings,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <Input
                    className="border-teal-100"
                      label="Email Address"
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) =>
                        setProfileSettings({
                          ...profileSettings,
                          email: e.target.value,
                        })
                      }
                      required
                    />

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={savingProfile}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Change Password
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Update your password to keep your account secure
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSave} className="space-y-4">
                    <div className="relative">
                      <Input
                      className="border-teal-100"
                        label="Current Password"
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordSettings.currentPassword}
                        onChange={(e) =>
                          setPasswordSettings({
                            ...passwordSettings,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="cursor-pointer absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                      className="border-teal-100"
                        label="New Password"
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordSettings.newPassword}
                        onChange={(e) =>
                          setPasswordSettings({
                            ...passwordSettings,
                            newPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="cursor-pointer absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                      className="border-teal-100"
                        label="Confirm New Password"
                        type={showPasswords.confirm ? "text" : "password"}
                        placeholder="••••••••"
                        value={passwordSettings.confirmPassword}
                        onChange={(e) =>
                          setPasswordSettings({
                            ...passwordSettings,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="cursor-pointer absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={savingPassword}
                      >
                        Change Password
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const adminData = isLoggedIn(req);

  if (!adminData) {
    return {
      redirect: {
        destination: "/admin/auth/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { adminData },
  };
};

export default SettingsPage;
