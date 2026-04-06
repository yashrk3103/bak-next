"use client";

import { useEffect, useState, ChangeEvent } from "react";

import { FaUpload, FaUser } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import OrderTable from "../../components/OrderTable";
import { useRouter, useSearchParams } from "next/navigation";
import ChatScreen from "../../components/ChatScreen";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";

export default function ProfilePage() {
  const [active, setActive] = useState<"profile" | "orders">("profile");
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const router = useRouter();

  const nameRegex = /^[A-Za-z\s]*$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getPhoneDigits = (value: string) => value.replace(/\D/g, "");
  const getLocalPhoneDigits = (value: string) => getPhoneDigits(value).slice(-10);

  const resolveAvatarUrl = async (
    avatarPath?: string | null,
    fallbackUrl?: string | null,
  ) => {
    if (avatarPath) {
      const { data } = await supabase.storage
        .from("user_images")
        .createSignedUrl(avatarPath, 60 * 60 * 24);

      if (data?.signedUrl) return data.signedUrl;

      const { data: publicData } = supabase.storage
        .from("user_images")
        .getPublicUrl(avatarPath);

      if (publicData?.publicUrl) return publicData.publicUrl;
    }

    return fallbackUrl || null;
  };

  const syncProfileFromAuth = async () => {
    const { data } = await supabase.auth.getUser();
    const nextUser = data?.user;

    if (!nextUser) return;

    setUser(nextUser);
    setFirstName(nextUser.user_metadata?.full_name?.split(" ")[0] || "");
    setLastName(nextUser.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "");
    setEmail(nextUser.email || "");
    setPhone(getPhoneDigits(nextUser.user_metadata?.phone || nextUser.phone || ""));

    const resolvedAvatarUrl = await resolveAvatarUrl(
      nextUser.user_metadata?.avatar_path,
      nextUser.user_metadata?.avatar_url || null,
    );

    setAvatarUrl(resolvedAvatarUrl);
  };

  // ---------------- Handle Order Redirect ----------------
  useEffect(() => {
    const activeParam = searchParams.get("active");
    if (orderId || activeParam === "orders") {
      queueMicrotask(() => setActive("orders"));
    }
  }, [orderId, searchParams]);

  // ---------------- Fetch User ----------------
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!error && data?.user) {
        await syncProfileFromAuth();
      }
    };

    fetchUser();
  }, []);

  // ---------------- Update Profile ----------------
  const handleUpdate = async () => {
    setMsg("");

    // Validate all fields before API call
    if (!firstName.trim()) return setMsg("First name is required");
    if (!lastName.trim()) return setMsg("Last name is required");
    if (!emailRegex.test(email)) return setMsg("Invalid email");

    const phoneDigits = getPhoneDigits(phone);
    const localPhoneDigits = getLocalPhoneDigits(phone);

    if (phoneDigits && !/^[6-9]\d{9}$/.test(localPhoneDigits)) {
      return setMsg("Phone must be 10 digits");
    }

    setLoading(true);

    const full_name = `${firstName} ${lastName}`;
    const emailChanged = user?.email !== email;

    const updatePayload: { email?: string; data: { full_name: string; phone: string } } = {
      data: { full_name, phone: phoneDigits },
    };

    if (user?.email !== email) {
      updatePayload.email = email;
    }

    const { data, error } = await supabase.auth.updateUser(updatePayload);

    setLoading(false);

    if (error) return setMsg(error.message);

    await supabase.auth.refreshSession();
    await syncProfileFromAuth();
    window.dispatchEvent(new Event("auth-change"));

    setMsg(emailChanged ? "Profile updated. Check your email to confirm the new address." : "Profile updated successfully!");
    console.log("data.user", data.user);
  };

  // ---------------- Upload Image ----------------
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setMsg("");

    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setMsg("Please select a valid image file");
      e.target.value = "";
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setMsg("Image size should be under 5MB");
      e.target.value = "";
      return;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
    const previewUrl = URL.createObjectURL(file);

    setAvatarPreviewUrl(previewUrl);

    setLoading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from("user_images")
        .upload(filePath, file, {
          upsert: false,
          cacheControl: "3600",
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicData } = supabase.storage
        .from("user_images")
        .getPublicUrl(filePath);

      const resolvedAvatarUrl = await resolveAvatarUrl(filePath, publicData?.publicUrl || null);

      if (!resolvedAvatarUrl) {
        throw new Error("Image uploaded, but profile URL could not be resolved");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_path: filePath,
          avatar_url: publicData?.publicUrl || null,
          avatar_updated_at: new Date().toISOString(),
        },
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      await supabase.auth.refreshSession();
      setAvatarUrl(resolvedAvatarUrl);
      setAvatarPreviewUrl(null);
      window.dispatchEvent(new Event("auth-change"));
      toast.success("Profile image updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload profile image";
      setMsg(message);
      toast.error(message);
      setAvatarPreviewUrl(null);
    } finally {
      URL.revokeObjectURL(previewUrl);
      e.target.value = "";
      setLoading(false);
    }
  };

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  return (
    <div className="min-h-screen py-10">
      <div className="flex items-center justify-between mb-10 px-20">
        <Image
          src="/images/Zirwa.png"
          alt="Website Logo"
          width={120}
          height={40}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        <h1 className="text-3xl font-semibold text-gray-800">
          {active === "profile" ? "My Profile" : "My Orders"}
        </h1>
        <div className="w-[120px]" />
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-10 px-4">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white shadow-md rounded-2xl py-6 px-4">
            <div className="flex flex-col items-center">
              <Image
                src={avatarPreviewUrl || avatarUrl || "/images/Zirwa.png"}
                width={90}
                height={90}
                unoptimized={!!avatarPreviewUrl}
                draggable={false}
                alt="User"
                className="rounded-full w-[90px] h-[90px] object-cover"
              />
              <p className="mt-3 font-medium text-gray-700 text-lg">
                {firstName + " " + lastName}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => setActive("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                  active === "profile"
                    ? "bg-red-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUser /> My Profile
              </button>

              <button
                onClick={() => setActive("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                  active === "orders"
                    ? "bg-red-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <IoBagCheck /> My Orders
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                <MdOutlineLogout /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile */}
        {active === "profile" && (
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-6">
                Profile Settings
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                {/* Profile Picture */}
                <div className="relative">
                  <Image
                    src={avatarPreviewUrl || avatarUrl || "/images/Zirwa.png"}
                    width={90}
                    height={90}
                    unoptimized={!!avatarPreviewUrl}
                    alt="User"
                    draggable={false}
                    className="rounded-full w-[90px] h-[90px] object-cover"
                  />

                  <label
                    htmlFor="upload"
                    className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600"
                  >
                    <FaUpload />
                  </label>
                  <input
                    type="file"
                    id="upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <p className="font-medium text-lg text-gray-700">
                  {firstName + " " + lastName}
                </p>
              </div>

              {/* ---------------- Form Fields ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    First Name*
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    maxLength={30}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (nameRegex.test(value)) {
                        setFirstName(value);
                      }
                    }}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    maxLength={30}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (nameRegex.test(value)) {
                        setLastName(value);
                      }
                    }}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);
                    }}
                    className={`w-full mt-1 border rounded-lg px-4 py-3 ${email && !emailRegex.test(email) ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>

                <div>
                 
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    inputStyle={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "0.5rem", height: "48px" }}
                    containerStyle={{ width: "100%", marginTop: "0.25rem" }}
                    onChange={(value: string) => setPhone(value)}
                  />
                </div>
              </div>

              {/* ---------------- Success / Error Message ---------------- */}
              {msg && (
                <p className="text-center mt-5 text-red-600 font-medium">
                  {msg}
                </p>
              )}
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {active === "orders" && !orderId && <OrderTable />}
        {active === "orders" && orderId && <ChatScreen orderId={orderId} />}
      </div>
    </div>
  );
}
