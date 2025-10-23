"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, ChangeEvent, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";

// ============================================
// TYPE DEFINITIONS (matching your API exactly)
// ============================================

type UserProfile = {
  id: string;
  profileUser?: string | null;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
};

type UpdateProfilePayload = {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

type ProfileForm = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatarUrl: string;
};

type MediaUploadResponse = {
  name: string;
  extension: string;
  mimeTypeFile: string;
  uri: string;
  size: number;
};

// ============================================
// PROFILE CONTENT COMPONENT (uses useSearchParams)
// ============================================

function ProfileContent() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    avatarUrl: "",
  });

  // For preview only (local file object)
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const API = process.env.NEXT_PUBLIC_API_URL;

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const displayName = useMemo<string>(() => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile?.username || session?.user?.name?.split(" ")[0] || 
           session?.user?.email?.split("@")[0] || "User";
  }, [session, profile]);

  const displayAvatar = useMemo<string>(() => {
    // Priority: preview (newly selected file) -> form URL -> profile URL -> default
    if (avatarPreview) return avatarPreview;
    if (form.avatarUrl) return form.avatarUrl;
    if (profile?.avatarUrl) return profile.avatarUrl;
    if (session?.user?.name) {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.user.name)}`;
    }
    return "";
  }, [avatarPreview, form.avatarUrl, profile?.avatarUrl, session?.user?.name]);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.apiAccessToken) {
      fetchProfile();
      if (searchParams.get("from") === "login") {
        setIsEditing(true);
      }
    }
  }, [status, session?.apiAccessToken, searchParams]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // ============================================
  // API FUNCTIONS
  // ============================================


  const fetchProfile = async (): Promise<void> => {
    if (!session?.apiAccessToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.apiAccessToken}`,
          Accept: "*/*",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to fetch profile");
      }

      const data: UserProfile = await res.json();
      console.log("✅ Profile fetched:", data);
      
      setProfile(data);
      
      // Initialize form with fetched data
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username || "",
        email: data.email || "",
        password: "",
        avatarUrl: data.avatarUrl || "",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch profile";
      console.error("❌ Fetch profile error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!session?.apiAccessToken) {
      throw new Error("No API token available");
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("📤 Uploading avatar to /medias/upload-single...", { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type 
      });

      const uploadRes = await fetch(`${API}/medias/upload-single`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.apiAccessToken}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("❌ Avatar upload failed:", errorText);
        throw new Error(`Avatar upload failed: ${uploadRes.status} ${errorText}`);
      }

      const uploadData: MediaUploadResponse = await uploadRes.json();
      console.log("✅ Avatar upload response:", uploadData);

      if (!uploadData.uri) {
        console.warn("⚠️ No URI in response:", uploadData);
        throw new Error("No avatar URI returned from server");
      }

      console.log("✅ Avatar uploaded successfully:", uploadData.uri);
      return uploadData.uri;

    } catch (error) {
      console.error("❌ Avatar upload error:", error);
      throw error;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!session?.apiAccessToken) {
      alert("No API token available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare payload according to API spec
      const payload: UpdateProfilePayload = {};

      // Handle avatar upload first if there's a file
      if (avatarFile) {
        try {
          const uploadedUrl = await uploadAvatar(avatarFile);
          if (uploadedUrl) {
            payload.avatarUrl = uploadedUrl;
            // Update form to reflect the uploaded URL
            setForm(prev => ({ ...prev, avatarUrl: uploadedUrl }));
          }
        } catch (uploadError) {
          const errorMsg = uploadError instanceof Error ? uploadError.message : "Avatar upload failed";
          alert(`⚠️ ${errorMsg}\n\nContinuing to save other profile data...`);
          console.error("Avatar upload error:", uploadError);
        }
      } else if (form.avatarUrl?.trim() && form.avatarUrl !== profile?.avatarUrl) {
        // User provided a URL directly
        payload.avatarUrl = form.avatarUrl.trim();
      }


      // Only include fields that have changed and are not empty
      if (form.username?.trim() && form.username !== profile?.username) {
        payload.username = form.username.trim();
      }
      if (form.email?.trim() && form.email !== profile?.email) {
        payload.email = form.email.trim();
      }
      if (form.firstName?.trim()) {
        payload.firstName = form.firstName.trim();
      }
      if (form.lastName?.trim()) {
        payload.lastName = form.lastName.trim();
      }

      console.log("📤 Sending update payload:", payload);

      const res = await fetch(`${API}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.apiAccessToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        
        if (res.status === 403) {
          throw new Error(
            "Permission denied. Your account doesn't have permission to update profile. Please contact administrator."
          );
        }
        
        throw new Error(errorText || `Failed to update profile (${res.status})`);
      }

      const updated: UserProfile = await res.json();
      console.log("✅ Profile updated successfully:", updated);
      
      setProfile(updated);
      setForm({
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
        username: updated.username || "",
        email: updated.email || "",
        password: "",
        avatarUrl: updated.avatarUrl || "",
      });
      
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsEditing(false);

      try {
        console.log("🔄 Updating NextAuth session...");
        
        await updateSession({
          user: {
            name: updated.firstName && updated.lastName 
              ? `${updated.firstName} ${updated.lastName}`
              : updated.username,
            email: updated.email,
            image: updated.avatarUrl,
          }
        });

        console.log("✅ Session updated successfully");
        alert("✅ Profile updated successfully!");

      } catch (sessionErr) {
        console.warn("⚠️ Session update failed, but profile was saved:", sessionErr);
        alert("✅ Profile updated! Please refresh the page to see all changes.");
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      console.error("❌ Update error:", err);
      setError(errorMessage);
      alert("❌ " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (PNG, JPG, JPEG, GIF, or WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    console.log("✅ Avatar file selected:", file.name);
  };

  const handleRemoveAvatar = (): void => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    setForm(prev => ({ ...prev, avatarUrl: "" }));
  };


  const handleCancel = (): void => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: profile.username || "",
        email: profile.email || "",
        password: "",
        avatarUrl: profile.avatarUrl || "",
      });
      
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      
      setAvatarFile(null);
      setAvatarPreview(null);
    }
    setIsEditing(false);
  };

  // ============================================
  // RENDER
  // ============================================

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchProfile}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
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
    <div className="bg-gray-50 min-h-screen flex justify-center items-start p-4 pt-20">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-2xl overflow-hidden">
        
        {/* COVER IMAGE */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {/* PROFILE HEADER */}
        <div className="relative px-6 sm:px-10 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
            
            {/* Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              <div className="relative">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 border-4 border-white rounded-full overflow-hidden bg-gray-200 shadow-xl">
                  {displayAvatar ? (
                    <Image 
                      src={displayAvatar} 
                      alt={displayName} 
                      fill 
                      className="object-fill" 
                      unoptimized 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-700">
                      {displayName[0]?.toUpperCase()}
                    </div>
                  )}
                  
                  {/* Upload indicator */}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-lg transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input 
                        type="file" 
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" 
                        onChange={handleAvatarFileChange} 
                        className="hidden"
                        disabled={uploadingAvatar}
                      />
                    </label>
                    {(avatarPreview || avatarFile) && (

                      <button
                        onClick={handleRemoveAvatar}
                        className="bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-lg transition-colors"
                        disabled={uploadingAvatar}
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{displayName}</h2>
                <p className="text-gray-600">{profile.email}</p>
                {profile.profileUser && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    {profile.profileUser}
                  </p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </p>
                {avatarFile && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 justify-center sm:justify-start">
                    <Upload className="w-3 h-3" />
                    Ready to upload: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center sm:justify-end mt-4 sm:mt-0">
              {!isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-md"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => router.push("/dashboard")} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleSave} 
                    disabled={loading || uploadingAvatar} 
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-md"
                  >
                    {uploadingAvatar ? "Uploading..." : loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    onClick={handleCancel} 
                    disabled={loading || uploadingAvatar} 
                    className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 px-6 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="px-6 sm:px-10 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={form.firstName}
                readOnly={!isEditing}
                onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              />
            </div>


            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                readOnly={!isEditing}
                onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={form.username}
                readOnly={!isEditing}
                onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                readOnly={!isEditing}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                className={`w-full rounded-xl border px-4 py-3 ${
                  isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              />
            </div>

            {/* Avatar URL */}
            {isEditing && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL (optional - or upload using camera icon)
                </label>
                <input
                  type="url"
                  value={form.avatarUrl}
                  onChange={(e) => setForm(p => ({ ...p, avatarUrl: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white"
                  disabled={!!avatarFile}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {avatarFile 
                    ? "Clear the selected file to enter a URL instead" 
                    : "Or use the camera icon above to upload a file"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT WITH SUSPENSE
// ============================================

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
