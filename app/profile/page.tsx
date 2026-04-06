import ProfileForm from "@/components/profile/ProfileForm";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfileForm />
    </Suspense>
  );
}
