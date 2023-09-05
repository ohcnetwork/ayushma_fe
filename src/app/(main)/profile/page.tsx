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
            <h2 className="text-center text-3xl font-extrabold   text-gray-900">
              Edit Profile
            </h2>
            <div className="mt-8 space-y-4">
              <div>
                <p className="text text-sm text-gray-500 mb-2">Full Name:</p>
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
                <p className="text text-sm text-gray-500 mb-2">
                  Change Password:
                </p>
                <div className="relative z-0">
                  <Input
                    right={
                      <button
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300 absolute top-0 right-0 px-5 py-3.5  rounded-md shadow-sm"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <i
                          className={
                            showPassword ? "far fa-eye" : "fa fa-eye-slash"
                          }
                          style={{ color: "#2d2a2a" }}
                        />
                      </button>
                    }
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
                </div>
              </div>
              <div>
                <div className="relative z-0">
                  <Input
                    right={
                      <button
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300 absolute top-0 right-0 px-5 py-3.5  rounded-md shadow-sm "
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        <i
                          className={
                            showConfirmPassword
                              ? "far fa-eye"
                              : "fa fa-eye-slash"
                          }
                        />
                      </button>
                    }
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
                </div>
              </div>
              {formData.password != formData.confirm_password ? (
                <p className="text text-sm text-red-500 mb-2">
                  Passwords do not match
                </p>
              ) : (
                <p className="text-transparent text-sm mb-2">&nbsp;</p>
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
