import { useEffect, useState, useMemo } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import userApi from "../api/userApi";
import { getOrders } from "../api/orderApi";
import { sendContactMessage } from "../api/contactApi";
import { logoutUser } from "../api/authApi";
import { formatEGP } from "../components/formatCurrency";
import ConfirmDialog from "../components/ConfirmDialog";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400";

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile"); // profile | password | orders | support
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [pendingImageFile, setPendingImageFile] = useState(null);

  const [orders, setOrders] = useState([]);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    type: null, // 'profile' | 'image' | 'password' | 'support' | 'logout'
  });

  const openConfirm = (type) => setConfirmConfig({ open: true, type });
  const closeConfirm = () => setConfirmConfig({ open: false, type: null });

  // ------------ FETCH PROFILE + ORDERS ------------
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading((l) => ({ ...l, init: true }));

        // get profile
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
        if (imgUrl) setPreviewImage(imgUrl);

        // get orders
        const ordersData = await getOrders();
        const rawOrders = ordersData || [];

        // normalize orders
        const normalized = rawOrders.map((o) => ({
          id: o.id || o.orderId || o.orderID,
          date: o.orderDate || o.date || o.createdAt,
          total: o.total || o.totalAmount || o.orderTotal || 0,
          status: o.status || o.orderStatus || "Pending",
          itemsCount:
            o.items?.length ??
            o.orderItems?.length ??
            o.itemsCount ??
            o.quantity ??
            0,
        }));

        setOrders(normalized);
      } catch (err) {
        console.error("Profile init error:", err);
        toast.error("Failed to load your profile. Please try again.");
      } finally {
        if (mounted) {
          setLoading((l) => ({ ...l, init: false }));
        }
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

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
      const data = res.data || res;

      const newUrl =
        data.imageUrl ||
        data.profileImageUrl ||
        data.url ||
        previewImage;

      setPreviewImage(newUrl);
      setProfile((p) => ({ ...(p || {}), imageUrl: newUrl }));
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

  // ------------ PASSWORD ------------
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((f) => ({ ...f, [name]: value }));
  };

  const doChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      closeConfirm();
      return;
    }

    try {
      setLoading((l) => ({ ...l, password: true }));
      await userApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success("Password changed successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Change password error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors ||
        "Failed to change password.";
      toast.error(typeof msg === "string" ? msg : "Failed to change password.");
    } finally {
      setLoading((l) => ({ ...l, password: false }));
      closeConfirm();
    }
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

  // ------------ RENDER ------------
  if (loading.init) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-md border border-slate-100 p-8 animate-pulse space-y-6">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="grid md:grid-cols-[220px,1fr] gap-6">
            <div className="h-52 bg-slate-100 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
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
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <main className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Header strip */}
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-slate-50 to-slate-50">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                AURAYE Account
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                Manage your profile, orders and support in one place.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Avatar"
                    className="w-full h-full object-cover "
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {profileForm.fullName || "Guest"}
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[180px]">
                  {profileForm.email}
                </p>
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-[260px,1fr] md:flex min-h-[480px]">
            {/* SIDEBAR */}
            <aside className="bg-slate-50/60 border-r border-slate-100 px-4 py-5 md:px-6 flex flex-col gap-6">
              {/* Avatar mobile */}
              <div className="flex md:hidden items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
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
                  <p className="text-sm font-medium text-slate-900">
                    {profileForm.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-[180px]">
                    {profileForm.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { id: "profile", label: "Profile details", icon: User },
                  { id: "password", label: "Password", icon: Lock },
                  { id: "orders", label: "Orders", icon: ShoppingBag },
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
                          ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                          : "text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openConfirm("logout")}
                  disabled={loading.logout}
                  className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <section className="px-5 md:px-8 py-6 space-y-6">
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Profile details
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Update your personal information and profile photo.
                    </p>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-semibold overflow-hidden">
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
                      <p className="text-sm font-medium text-slate-900">
                        Profile photo
                      </p>
                      <p className="text-xs text-slate-500 mb-2">
                        JPG or PNG, maximum size 2 MB.
                      </p>
                      <label className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">
                        <Camera className="w-4 h-4" />
                        <span>Upload new</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        Full name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                      <label className="text-xs font-semibold text-slate-600">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                      <label className="text-xs font-semibold text-slate-600">
                        Phone number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          name="phoneNumber"
                          value={profileForm.phoneNumber}
                          onChange={handleProfileChange}
                          className={`${inputClass} pl-9`}
                          placeholder="+20 ..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openConfirm("profile")}
                      disabled={loading.profile || isBusy}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
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
                    <h2 className="text-lg font-semibold text-slate-900">
                      Change password
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Use a strong password to keep your AURAYE account secure.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        Current password
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        className={inputClass}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        New password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className={inputClass}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className={inputClass}
                        placeholder="Re-enter new password"
                      />
                    </div>

                    <p className="text-xs text-slate-500">
                      Password should be at least 8 characters and include
                      numbers and symbols.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openConfirm("password")}
                      disabled={loading.password || isBusy}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      {loading.password ? "Saving..." : "Update password"}
                    </button>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Your orders
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Track your AURAYE glasses and AR experiences.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      You haven&apos;t placed any orders yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-slate-100 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Order #{order.id}
                            </p>
                            <p className="text-xs text-slate-500">
                              {order.date
                                ? new Date(order.date).toLocaleDateString()
                                : "—"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs uppercase text-slate-400 tracking-wide">
                              Total
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {formatEGP(order.total || 0)}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white border border-slate-200 text-slate-700">
                              {order.status}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {order.itemsCount || 0} item
                              {(order.itemsCount || 0) !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUPPORT TAB */}
              {activeTab === "support" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Contact support
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Need help with your AR glasses or an order? Send us a
                      message and we&apos;ll get back to you.
                    </p>
                  </div>

                  <div className="max-w-lg space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
                        Subject
                      </label>
                      <input
                        name="subject"
                        value={supportForm.subject}
                        onChange={handleSupportChange}
                        className={inputClass}
                        placeholder="Order issue, AR try-on, account..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">
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

                    <p className="text-xs text-slate-500">
                      We&apos;ll reply to{" "}
                      <span className="font-medium">
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
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
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
            : "Confirm"
        }
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
}
