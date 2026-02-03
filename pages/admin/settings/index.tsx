import { useState } from "react";
import Input from "@/components/dashboard/ui/InputField";
import { Eye, EyeOff, Save, User, Lock, Bell } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

type TabType = "profile" | "security" | "notifications";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const [profileSettings, setProfileSettings] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@soshsa.com",
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

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newComments: true,
    newSubmissions: true,
    weeklyDigest: false,
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile settings saved:", profileSettings);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Password changed");
    setPasswordSettings({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Notification settings saved:", notificationSettings);
  };

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "security" as TabType, label: "Security", icon: Lock },
    { id: "notifications" as TabType, label: "Notifications", icon: Bell },
  ];

  return (
    <DashboardLayout pageTitle="Settings">
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

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="cursor-pointer flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
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
                      label="Current Password"
                      type={showPasswords.current ? "text" : "password"}
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
                      label="New Password"
                      type={showPasswords.new ? "text" : "password"}
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
                      label="Confirm New Password"
                      type={showPasswords.confirm ? "text" : "password"}
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

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="cursor-pointer flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Save size={18} />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Notification Preferences
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose what notifications you want to receive
                  </p>
                </div>

                <form onSubmit={handleNotificationSave} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-900">
                          Email Notifications
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Receive email notifications for important updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-900">
                          New Comments
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Get notified when someone comments on articles
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.newComments}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newComments: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-900">
                          New Contact Submissions
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Get notified when someone submits the contact form
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.newSubmissions}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newSubmissions: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-900">
                          Weekly Digest
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Receive a weekly summary of activity
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyDigest}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            weeklyDigest: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="cursor-pointer flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Save size={18} />
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
