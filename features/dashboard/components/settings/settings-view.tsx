import { NotificationPreferences } from "@/features/dashboard/components/settings/notification-preferences";
import { Plan } from "@/features/dashboard/components/settings/plan";
import { ProfileForm } from "@/features/dashboard/components/settings/profile-form";
import { Security } from "@/features/dashboard/components/settings/security";
import { SettingsViewClient } from "@/features/dashboard/components/settings/settings-view-client";
import { Verification } from "@/features/dashboard/components/settings/verification";
import { getSettings } from "@/features/dashboard/dashboard-queries";

export async function SettingsView() {
  const settings = await getSettings();
  return (
    <SettingsViewClient
      sections={[
        {
          value: "profile",
          label: "Profile",
          content: <ProfileForm profile={settings.profile} />,
        },
        {
          value: "verification",
          label: "Verification",
          content: <Verification items={settings.verification} />,
        },
        {
          value: "notifications",
          label: "Notifications",
          content: (
            <NotificationPreferences
              initialPreferences={settings.notificationPrefs}
            />
          ),
        },
        {
          value: "security",
          label: "Security",
          content: (
            <Security
              initialSessions={settings.sessions}
              contact={settings.contact}
            />
          ),
        },
        {
          value: "plan",
          label: "Plan",
          content: (
            <Plan
              currentPlan={settings.plan}
              plans={settings.plans}
              billingHistory={settings.billingHistory}
            />
          ),
        },
      ]}
    />
  );
}
