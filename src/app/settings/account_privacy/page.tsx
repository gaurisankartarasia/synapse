// app/settings/page.tsx
import PrivacyToggle from './components/PrivacyToggle';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <PrivacyToggle />
    </div>
  );
}