import { useState, useEffect, useCallback } from "react";
import { useUser } from "../authentication/useUser";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Camera, Loader2 } from "lucide-react";

export default function ProfileDetails() {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          fullName: data.full_name || "",
          email: user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          bio: data.bio || "",
        });

        if (data.avatar_url) {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(data.avatar_url);

          if (publicUrlData) {
            setAvatarUrl(publicUrlData.publicUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate("/auth");
    } else {
      fetchProfile();
    }
  }, [user, isUserLoading, navigate, fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      return filePath;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let avatarPath = null;
      if (avatar) {
        avatarPath = await uploadAvatar(avatar);
      }

      const { error } = await supabase
        .from("profile")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
          ...(avatarPath && { avatar_url: avatarPath }),
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");

      // Refresh profile data
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Avatar section */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-40 w-40 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center overflow-hidden border-2 border-blue-500/50">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-20 w-20 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Upload photo</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-100">
                {formData.fullName || "Your Name"}
              </h2>
              <p className="text-gray-400 text-sm">
                {user?.email || "email@example.com"}
              </p>
            </div>
          </div>

          {/* Form section */}
          <div className="md:w-2/3 md:pl-8 md:border-l border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Profile Information
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                    <User className="h-4 w-4 mr-2 text-blue-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                    <Mail className="h-4 w-4 mr-2 text-blue-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white opacity-75"
                    placeholder="your.email@example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                    <Phone className="h-4 w-4 mr-2 text-blue-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                    <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Enter your address"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-300 mb-1">
                    <User className="h-4 w-4 mr-2 text-blue-400" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex justify-center items-center px-4 py-2 rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
