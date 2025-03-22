"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

// Example form components - replace with your actual forms
const ProfileForm = () => (
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Full Name</label>
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Enter your name"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <input
        type="email"
        className="w-full p-2 border rounded-md"
        placeholder="Enter your email"
      />
    </div>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Update Profile
    </button>
  </form>
);

const SettingsForm = () => (
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">
        Notification Preferences
      </label>
      <input type="checkbox" className="h-4 w-4" />
    </div>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Save Settings
    </button>
  </form>
);

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "profile", label: "Vendor Profile" },
    // { id: "settings", label: "Settings" },
    // { id: "history", label: "History" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Overview</h3>
            <p>
              Welcome to your dashboard. Here&apos;s an overview of your
              account.
            </p>
          </div>
        );
      case "profile":
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
            <ProfileForm />
          </div>
        );
      case "settings":
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
            <SettingsForm />
          </div>
        );
      case "history":
        return (
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Activity History</h3>
            <p>Your recent activity will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="flex border-b bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white m-4 rounded-lg shadow">
        {renderTabContent()}
      </div>
    </div>
  );
}
