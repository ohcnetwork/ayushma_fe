"use client";

import { Button, Input } from "@/components/ui/interactive";
import { API } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { User, UserUpdate } from "@/types/user";

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userQuery = useQuery<User, Error>(["userDetails"], API.user.me);
  const userData: User | undefined = userQuery.data || undefined;

  const [formData, setFormData] = useState({
    full_name: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = () => {
    if (formData.password !== formData.confirm_password) return;
    updateProfileMutation.mutate({
      userDetails: {
        full_name: formData.full_name,
        password: formData.password ? formData.password : undefined,
      },
    });
  };

  const updateProfileMutation = useMutation(
    (params: { userDetails: UserUpdate }) => API.user.save(params.userDetails),
    {
      retry: false,
      onSuccess: async (data, vars) => {
        toast.success("Profile updated successfully");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      },
    }
  );

  useEffect(() => {
    if (userData) {
      setFormData({ ...formData, full_name: userData.full_name });
    }
  }, [userData]);

  return (
    <div className="mx-auto">
      <div className="my-24 py-10 px-2">
        <div className="flex flex-col items-center text-gray-600 justify-center ">
          <div className="w-[95%] md:w-[75%] lg:w-[75%]">
            <h2 className="text-center text-3xl font-extrabold select-none text-gray-900">
              Edit Profile
            </h2>
            <div className="mt-8 space-y-4">
              <div>
                <p className="text text-sm select-none text-gray-500 mb-2">
                  Full Name:
                </p>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      full_name: event.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className="text select-none text-sm text-gray-500 mb-2">
                  Change Password:
                </p>
                <div className="relative z-0">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={formData.password}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        password: event.target.value,
                      })
                    }
                  />
                  <div
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md shadow-sm float-right absolute right-0 inset-y-0 z-10"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative z-0">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        confirm_password: event.target.value,
                      })
                    }
                  />
                  <div
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md shadow-sm float-right absolute right-0 inset-y-0 z-10"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {formData.password != formData.confirm_password ? (
                <p className="text select-none text-sm text-red-500 mb-2">
                  Passwords do not match
                </p>
              ) : (
                <p className="text-transparent select-none text-sm mb-2">
                  &nbsp;
                </p>
              )}
              <div className="flex gap-2 py-4">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-gray-200"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  variant="primary"
                >
                  Update Profile
                </Button>
              </div>
            </div>
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
}
