"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
type UserProfile = {
  id: string;
  profileUser?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
  phone?: string;
  bio?: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // editable form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "", // optional: if provided, backend should handle password change
    profileUser: "",
    phone: "",
    bio: "",
  });

  // avatar file + preview
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.apiAccessToken) {
      fetchProfile(session.apiAccessToken as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  // ---------- FETCH PROFILE ----------
  const fetchProfile = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username || "",
        email: data.email || "",
        password: "",
        profileUser: data.profileUser || "",
        phone: data.phone || "",
        bio: data.bio || "",
      });
      setAvatarPreview(data.avatarUrl || null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  // ---------- AVATAR HANDLING ----------
  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setAvatarFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarPreview(url);
    }
  };

  // helper: convert file -> base64 (fallback)
  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(String(reader.result));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ---------- UPDATE PROFILE ----------
  const handleSave = async () => {
    if (!session?.apiAccessToken) {
      alert("No API token available");
      return;
    }

    setLoading(true);

    try {
      let avatarUrlFromUpload: string | undefined = undefined;

      // 1) If avatar file selected, try dedicated avatar upload endpoint first
      if (avatarFile) {
        try {
          const formData = new FormData();
          formData.append("file", avatarFile);

          // NOTE: Adjust endpoint if your backend uses a different path
          const uploadRes = await fetch(`${API}/users/me/avatar`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.apiAccessToken}`,
              // DO NOT set Content-Type for multipart/form-data; browser will set boundary
            },
            body: formData,
          });

          if (uploadRes.ok) {
            const json = await uploadRes.json();
            // assume backend returns { avatarUrl: "https://..." }
            avatarUrlFromUpload = json.avatarUrl || json.url || undefined;
          } else {
            // If upload endpoint doesn't exist or failed, we'll fallback to embedding base64 in PUT below
            console.warn(
              "avatar upload endpoint failed, fallback to base64 in PUT"
            );
          }
        } catch (err) {
          console.warn("avatar upload attempt failed:", err);
        }
      }

      // 2) Prepare payload for PUT
      const payload: any = {
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        username: form.username || null,
        email: form.email || null,
        profileUser: form.profileUser || null,
        phone: form.phone || null,
        bio: form.bio || null,
      };

      if (form.password) {
        // include password if user wants to change it
        payload.password = form.password;
      }

      if (avatarUrlFromUpload) {
        payload.avatarUrl = avatarUrlFromUpload;
      } else if (avatarFile) {
        // fallback: include base64 string in JSON as "avatarBase64"
        const base64 = await fileToBase64(avatarFile);
        payload.avatarBase64 = base64; // backend must support this field
      }

      // send PUT to update profile
      const updateRes = await fetch(`${API}/users/me`, {
        method: "PUT", // or PATCH as your backend expects
        headers: {
          Authorization: `Bearer ${session.apiAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!updateRes.ok) {
        const txt = await updateRes.text();
        throw new Error(txt || "Failed to update profile");
      }

      const updated = await updateRes.json();
      // update local state
      setProfile(updated);
      setIsEditing(false);
      setForm((prev) => ({ ...prev, password: "" })); // clear password field
      // best-effort: refresh page / session so NextAuth / app see new data
      // If you have a server-side session tied to NextAuth user, you may need to call your own backend route to sync.
      try {
        // refresh the window so other components using server session reload (simple approach)
        window.location.reload();
      } catch (err) {
        // fallback: re-fetch profile
        fetchProfile(session.apiAccessToken as string);
      }
      alert("Profile updated successfully");
    } catch (err: any) {
      alert("Update failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mt-4 flex justify-center items-center p-4">
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-md shadow-md rounded-2xl p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              {avatarPreview ? (
                // Using next/image with external url: ensure domain is in next.config.js images.domains
                <Image
                  src={avatarPreview}
                  alt={profile.username}
                  fill
                  className="rounded-full object-cover border-2 border-orange-400"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-gray-700 border-2 border-orange-400">
                  {profile.firstName?.[0]?.toUpperCase() ||
                    profile.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {profile.firstName && profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.username}
              </h2>
              <p className="text-gray-500 text-sm">{profile.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Member since:{" "}
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSave()}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    // cancel edits: restore form and avatar preview
                    if (profile) {
                      setForm({
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        username: profile.username,
                        email: profile.email,
                        password: "",
                        profileUser: profile.profileUser || "",
                        phone: profile.phone || "",
                        bio: profile.bio || "",
                      });
                      setAvatarFile(null);
                      setAvatarPreview(profile.avatarUrl || null);
                    }
                    setIsEditing(false);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Avatar upload */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-gray-200">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="avatar preview"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                    {profile.firstName?.[0]?.toUpperCase() ||
                      profile.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={!isEditing}
                  onChange={onAvatarChange}
                  id="avatar"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG. Max size: depends on backend.
                </p>
              </div>
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={form.firstName}
              readOnly={!isEditing}
              onChange={(e) =>
                setForm((p) => ({ ...p, firstName: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2 ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={form.lastName}
              readOnly={!isEditing}
              onChange={(e) =>
                setForm((p) => ({ ...p, lastName: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2 ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              readOnly={!isEditing}
              onChange={(e) =>
                setForm((p) => ({ ...p, username: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2 ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              readOnly={!isEditing}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2 ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (leave blank to keep)
            </label>
            <input
              type="password"
              value={form.password}
              readOnly={!isEditing}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2 ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>

          {/* Profile Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Type
            </label>
            <input
              type="text"
              value={form.profileUser}
              readOnly={!isEditing}
              onChange={(e) =>
                setForm((p) => ({ ...p, profileUser: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2 ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={form.phone}
              readOnly={!isEditing}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2 ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={form.bio}
              readOnly={!isEditing}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              className={`w-full rounded-xl border px-4 py-2 min-h-[80px] ${
                isEditing
                  ? "bg-white border-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
