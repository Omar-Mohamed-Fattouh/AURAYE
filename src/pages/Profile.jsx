// src/pages/Profile.jsx
import { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Headset,
  LogOut,
  Camera,
  Mail,
  Phone,
  ShoppingBag,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import userApi from "../api/userApi";
import { sendContactMessage } from "../api/contactApi";
import { logoutUser } from "../api/authApi";
import ConfirmDialog from "../components/ConfirmDialog";

import { AuthContext } from "../features/auth/AuthContext";
import { CartContext } from "../store/cartContext";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../forms/changePasswordSchema";

const BASE_URL = "https://graduation-project1.runasp.net";

const inputClass =
  "w-full rounded-xl border border-neutral-700 px-3 py-2.5 text-sm bg-neutral-900 text-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-300 placeholder:text-neutral-500";

// ✅ fix blob/url issue
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (
    url.startsWith("http") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `${BASE_URL}${url}`;
};

export default function Profile() {
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  const auth = useContext(AuthContext);
  const isLoggedIn = auth?.isLoggedIn;

  const [activeTab, setActiveTab] = useState("profile"); // profile | password | support
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [pendingImageFile, setPendingImageFile] = useState(null);

  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState({
    init: true,
    profile: false,
    image: false,
    password: false,
    support: false,
    logout: false,
  });

  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    type: null, // 'profile' | 'image' | 'removeImage' | 'password' | 'support' | 'logout'
  });

  const [pendingPasswordData, setPendingPasswordData] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const openConfirm = (type) => setConfirmConfig({ open: true, type });
  const closeConfirm = () => setConfirmConfig({ open: false, type: null });

  // react-hook-form + zod for password
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset: resetPasswordForm,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") || "";

  const getPasswordStrength = (password) => {
    if (!password) return { label: "", className: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: "Weak", className: "text-red-400" };
    }
    if (score === 3 || score === 4) {
      return { label: "Medium", className: "text-yellow-400" };
    }
    return { label: "Strong", className: "text-emerald-400" };
  };

  const passwordStrength = getPasswordStrength(newPasswordValue);

  const onSubmitPassword = (data) => {
    setPendingPasswordData(data);
    openConfirm("password");
  };

  // Redirect if not logged in
  useEffect(() => {
    if (isLoggedIn === false) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // ------------ FETCH PROFILE ------------
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading((l) => ({ ...l, init: true }));

        const profileRes = await userApi.getProfile();
        const profileData = profileRes.data || profileRes;

        if (!mounted) return;

        setProfile(profileData);
        setProfileForm({
          fullName: profileData.fullName || "",
          email: profileData.email || "",
          phoneNumber: profileData.phoneNumber || "",
        });

        const imgUrl =
          profileData.imageUrl ||
          profileData.profileImageUrl ||
          profileData.avatarUrl ||
          null;

        if (imgUrl) {
          setPreviewImage(resolveImageUrl(imgUrl));
        } else {
          setPreviewImage(null);
        }
      } catch (err) {
        console.error("Profile init error:", err);
        toast.error("Failed to load your profile. Please try again.");
      } finally {
        if (mounted) {
          setLoading((l) => ({ ...l, init: false }));
        }
      }
    }

    if (isLoggedIn) {
      fetchData();
    } else {
      setLoading((l) => ({ ...l, init: false }));
    }

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  // ------------ HANDLERS: PROFILE FORM ------------
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((f) => ({ ...f, [name]: value }));
  };

  const doSaveProfile = async () => {
    try {
      setLoading((l) => ({ ...l, profile: true }));
      await userApi.updateProfile({
        fullName: profileForm.fullName,
        email: profileForm.email,
        phoneNumber: profileForm.phoneNumber,
      });

      setProfile((p) => ({
        ...(p || {}),
        fullName: profileForm.fullName,
        email: profileForm.email,
        phoneNumber: profileForm.phoneNumber,
      }));

      toast.success("Profile updated successfully.");
    } catch (err) {
      console.error("Update profile error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors ||
        "Failed to update profile.";
      toast.error(typeof msg === "string" ? msg : "Failed to update profile.");
    } finally {
      setLoading((l) => ({ ...l, profile: false }));
      closeConfirm();
    }
  };

  // ------------ IMAGE UPLOAD ------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ نوع الملف
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    // ✅ الحجم (2MB)
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error("Maximum file size is 2MB.");
      return;
    }

    setPendingImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    openConfirm("image");
  };

  const doUploadImage = async () => {
    if (!pendingImageFile) {
      closeConfirm();
      return;
    }
    try {
      setLoading((l) => ({ ...l, image: true }));
      const res = await userApi.uploadImage(pendingImageFile);
      const data = res?.data || res || {};

      // لو الـ API رجع لينك حقيقي من السيرفر
      const rawUrl =
        data.imageUrl || data.profileImageUrl || data.url || null;

      if (rawUrl) {
        const newUrl = resolveImageUrl(rawUrl);
        setPreviewImage(newUrl);
        setProfile((p) => ({
          ...(p || {}),
          imageUrl: newUrl,
          profileImageUrl: newUrl,
          avatarUrl: newUrl,
        }));
      }

      toast.success("Profile photo updated.");
    } catch (err) {
      console.error("Upload image error:", err);
      toast.error("Failed to upload image.");
    } finally {
      setLoading((l) => ({ ...l, image: false }));
      setPendingImageFile(null);
      closeConfirm();
    }
  };

  // ------------ REMOVE IMAGE ------------
  const doRemoveImage = async () => {
    try {
      setLoading((l) => ({ ...l, image: true }));

      // لو عندك API للحذف backend
      if (typeof userApi.deleteImage === "function") {
        await userApi.deleteImage();
      }

      setPreviewImage(null);
      setProfile((p) => ({
        ...(p || {}),
        imageUrl: null,
        profileImageUrl: null,
        avatarUrl: null,
      }));

      toast.success("Profile photo removed.");
    } catch (err) {
      console.error("Remove image error:", err);
      toast.error("Failed to remove profile photo.");
    } finally {
      setLoading((l) => ({ ...l, image: false }));
      closeConfirm();
    }
  };

  const handleRemoveImageClick = () => {
    if (!previewImage) return;
    openConfirm("removeImage");
  };

  // ------------ SUPPORT ------------
  const handleSupportChange = (e) => {
    const { name, value } = e.target;
    setSupportForm((f) => ({ ...f, [name]: value }));
  };

  const doSendSupport = async () => {
    try {
      setLoading((l) => ({ ...l, support: true }));
      await sendContactMessage({
        name: profileForm.fullName,
        email: profileForm.email,
        subject: supportForm.subject,
        message: supportForm.message,
      });
      toast.success("Your message has been sent to support.");
      setSupportForm({ subject: "", message: "" });
    } catch (err) {
      console.error("Support message error:", err);
      toast.error(err.message || "Failed to send message.");
    } finally {
      setLoading((l) => ({ ...l, support: false }));
      closeConfirm();
    }
  };

  // ------------ PASSWORD (using pendingPasswordData from RHF) ------------
  const doChangePassword = async () => {
    if (!pendingPasswordData) {
      closeConfirm();
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = pendingPasswordData;

    try {
      setLoading((l) => ({ ...l, password: true }));
      await userApi.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password changed successfully.");
      resetPasswordForm();
    } catch (err) {
      console.error("Change password error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors ||
        "Failed to change password.";
      toast.error(typeof msg === "string" ? msg : "Failed to change password.");
    } finally {
      setLoading((l) => ({ ...l, password: false }));
      setPendingPasswordData(null);
      closeConfirm();
    }
  };

  // ------------ LOGOUT ------------
  const doLogout = async () => {
    try {
      setLoading((l) => ({ ...l, logout: true }));
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setLoading((l) => ({ ...l, logout: false }));
      closeConfirm();
      navigate("/login");
    }
  };

  // ------------ CONFIRM HANDLER ------------
  const handleConfirm = () => {
    if (confirmConfig.type === "profile") return doSaveProfile();
    if (confirmConfig.type === "image") return doUploadImage();
    if (confirmConfig.type === "removeImage") return doRemoveImage();
    if (confirmConfig.type === "password") return doChangePassword();
    if (confirmConfig.type === "support") return doSendSupport();
    if (confirmConfig.type === "logout") return doLogout();
  };

  const isBusy = useMemo(
    () =>
      loading.profile ||
      loading.image ||
      loading.password ||
      loading.support ||
      loading.logout,
    [loading]
  );

  // ------------ INITIAL LOADING SKELETON ------------
  if (loading.init) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="w-full max-w-7xl mx-auto bg-neutral-900 rounded-3xl shadow-xl border border-neutral-800 p-8 animate-pulse space-y-6">
          <div className="h-6 w-40 bg-neutral-800 rounded" />
          <div className="grid md:grid-cols-[260px,1fr] gap-6">
            <div className="h-52 bg-neutral-800 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-10 bg-neutral-800 rounded-xl" />
              <div className="h-10 bg-neutral-800 rounded-xl" />
              <div className="h-10 bg-neutral-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initials =
    profileForm.fullName
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "AU";

  return (
    <>
      <div className="min-h-screen bg-neutral-950 py-6 px-4 md:px-8">
        <main className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Header strip */}
          <div className="border border-neutral-800 rounded-3xl px-6 py-4 flex items-center justify-between bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-neutral-50 tracking-tight">
                AURAYE Account
              </h1>
              <p className="text-xs md:text-sm text-neutral-400">
                Manage your profile and support in one clean dashboard.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-50 text-sm font-semibold overflow-hidden ring-1 ring-neutral-700/80">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-50">
                    {profileForm.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-neutral-400 truncate max-w-[180px]">
                    {profileForm.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800/80 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart</span>
                <span className="inline-flex min-w-[1.5rem] justify-center rounded-full bg-neutral-100 text-neutral-900 text-[11px] font-semibold px-1">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Layout full-width (FLEX) */}
          <div className="flex flex-col md:flex-row gap-6 min-h-[480px]">
            {/* SIDEBAR */}
            <aside className="w-full md:w-72 bg-neutral-950/60 border border-neutral-800 rounded-3xl px-4 py-5 md:px-6 flex flex-col gap-6">
              {/* Avatar mobile */}
              <div className="flex md:hidden items-center gap-3 pb-3 border-b border-neutral-800">
                <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-50 text-sm font-semibold overflow-hidden ring-1 ring-neutral-700/80">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-50">
                    {profileForm.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-neutral-400 truncate max-w-[180px]">
                    {profileForm.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { id: "profile", label: "Profile details", icon: User },
                  { id: "password", label: "Password", icon: Lock },
                  { id: "support", label: "Support", icon: Headset },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition ${
                        active
                          ? "bg-neutral-900 text-neutral-50 shadow-sm border border-neutral-700"
                          : "text-neutral-400 hover:bg-neutral-900/70 hover:text-neutral-50 border border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => openConfirm("logout")}
                  disabled={loading.logout}
                  className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2.5 rounded-xl border bg-red-700 border-red-500/40 text-white hover:bg-red-800 transition disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <section className="flex-1 bg-neutral-900 border border-neutral-800 rounded-3xl px-5 md:px-8 py-6 space-y-6">
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-50">
                      Profile details
                    </h2>
                    <p className="text-sm text-neutral-400 mt-1">
                      Update your personal information and profile photo.
                    </p>
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-50 text-xl font-semibold overflow-hidden ring-2 ring-neutral-600/70">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-neutral-50">
                        Profile photo
                      </p>
                      <p className="text-xs text-neutral-500">
                        JPG, PNG or WEBP, maximum size 2 MB.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <label className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-full border border-neutral-600 text-neutral-100 hover:bg-neutral-800 cursor-pointer transition">
                          <Camera className="w-4 h-4" />
                          <span>Upload new</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>

                        {previewImage && (
                          <button
                            type="button"
                            onClick={handleRemoveImageClick}
                            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-full borde bg-red-700 border-red-500/40 text-white hover:bg-red-800 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove photo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Full name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          name="fullName"
                          value={profileForm.fullName}
                          onChange={handleProfileChange}
                          className={`${inputClass} pl-9`}
                          placeholder="Your name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className={`${inputClass} pl-9`}
                          placeholder="you@example.com"
                          type="email"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Phone number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          name="phoneNumber"
                          value={profileForm.phoneNumber}
                          onChange={handleProfileChange}
                          className={`${inputClass} pl-9`}
                          placeholder="+20 8468 1..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openConfirm("profile")}
                      disabled={loading.profile || isBusy}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-neutral-50 text-neutral-900 text-sm font-semibold shadow-sm hover:bg-neutral-200 transition disabled:opacity-60"
                    >
                      {loading.profile ? "Saving..." : "Save changes"}
                    </button>
                  </div>
                </div>
              )}

              {/* PASSWORD TAB */}
              {activeTab === "password" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-50">
                      Change password
                    </h2>
                    <p className="text-sm text-neutral-400 mt-1">
                      Use a strong password to keep your AURAYE account secure.
                    </p>
                  </div>

                  <form
                    className="space-y-4 max-w-md"
                    onSubmit={handleSubmit(onSubmitPassword)}
                    noValidate
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Current password
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          {...register("oldPassword")}
                          className={`${inputClass} pr-10`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowOldPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                        >
                          {showOldPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.oldPassword && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.oldPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        New password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          {...register("newPassword")}
                          className={`${inputClass} pr-10`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowNewPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordStrength.label && (
                        <p
                          className={`text-xs mt-1 ${passwordStrength.className}`}
                        >
                          Strength: {passwordStrength.label}
                        </p>
                      )}
                      {errors.newPassword && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Confirm new password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword")}
                          className={`${inputClass} pr-10`}
                          placeholder="Re-enter new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-400 mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500">
                      Password should be at least 8 characters and include
                      uppercase, lowercase, numbers, and symbols.
                    </p>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading.password || isBusy}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-neutral-50 text-neutral-900 text-sm font-semibold shadow-sm hover:bg-neutral-200 transition disabled:opacity-60"
                      >
                        {loading.password ? "Saving..." : "Update password"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUPPORT TAB */}
              {activeTab === "support" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-50">
                      Contact support
                    </h2>
                    <p className="text-sm text-neutral-400 mt-1">
                      Need help with your AR glasses or your account? Send us a
                      message and we&apos;ll get back to you.
                    </p>
                  </div>

                  <div className="max-w-lg space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Subject
                      </label>
                      <input
                        name="subject"
                        value={supportForm.subject}
                        onChange={handleSupportChange}
                        className={inputClass}
                        placeholder="Account issue, AR try-on, technical support..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={supportForm.message}
                        onChange={handleSupportChange}
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder="Describe your issue or question in detail."
                      />
                    </div>

                    <p className="text-xs text-neutral-500">
                      We&apos;ll reply to{" "}
                      <span className="font-medium text-neutral-200">
                        {profileForm.email || "your email"}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openConfirm("support")}
                      disabled={loading.support || isBusy}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-neutral-50 text-neutral-900 text-sm font-semibold shadow-sm hover:bg-neutral-200 transition disabled:opacity-60"
                    >
                      {loading.support ? "Sending..." : "Send message"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmConfig.open}
        loading={isBusy}
        title={
          confirmConfig.type === "profile"
            ? "Save profile changes?"
            : confirmConfig.type === "image"
            ? "Update profile photo?"
            : confirmConfig.type === "removeImage"
            ? "Remove profile photo?"
            : confirmConfig.type === "password"
            ? "Change your password?"
            : confirmConfig.type === "support"
            ? "Send this message to support?"
            : "Log out of AURAYE?"
        }
        message={
          confirmConfig.type === "profile"
            ? "Your name, email and phone will be updated."
            : confirmConfig.type === "image"
            ? "Your new photo will replace the current one."
            : confirmConfig.type === "removeImage"
            ? "Your current profile photo will be removed."
            : confirmConfig.type === "password"
            ? "Make sure you remember your new password."
            : confirmConfig.type === "support"
            ? "We’ll send this message to our support team."
            : "You will be logged out from this device."
        }
        confirmLabel={
          confirmConfig.type === "logout"
            ? "Logout"
            : confirmConfig.type === "support"
            ? "Send"
            : confirmConfig.type === "removeImage"
            ? "Remove"
            : "Confirm"
        }
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
}
