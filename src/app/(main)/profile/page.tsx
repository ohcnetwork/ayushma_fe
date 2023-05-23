"use client";

import { Button, Input } from "@/components/ui/interactive";
import { API } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from 'react-hot-toast';
import { UserUpdate } from "@/types/user";

export default function Page() {
  const [formData, setFormData] = useState({
    full_name: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = () => {
    if(formData.password !== formData.confirm_password) return;
    updateProfileMutation.mutate({userDetails: {
      full_name: formData.full_name,
      password: formData.password ? formData.password : undefined,
    }});
  };
  
  const updateProfileMutation = useMutation((params: { userDetails: UserUpdate }) => API.user.save(params.userDetails), {
    retry: false,
    onSuccess: async (data, vars) => {
      toast.success('Profile updated successfully');
      setTimeout(() => {
        router.push('/');
      }
      , 1000);
    }
});
  useEffect(() => {
    async function getUserDetails() {
      const userData = await API.user.me();
      if (userData) setFormData(userData);
    }
    getUserDetails();
  }, []);

  const router = useRouter();

  return (
    <div className="w-full p-8">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">Edit Profile</h2>
      <div className="mt-8 space-y-4">
        <div>
          <p className="text text-sm text-gray-500 mb-2">
            Full Name:
          </p>
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(event) => setFormData({ ...formData, full_name: event.target.value })}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div>
          <p className="text text-sm text-gray-500 mb-2">
            Change Password:
          </p>
          <Input
            type="password"
            placeholder="New Password"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={(event) => setFormData({ ...formData, confirm_password: event.target.value })}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
        </div>
        {(formData.password != formData.confirm_password) && <p className="text text-sm text-red-500 mb-2">
          Passwords do not match
        </p>}
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/') }
            className="w-full"
            variant="secondary">
          Cancel
        </Button>
          <Button
          onClick={handleSubmit}
            className="w-full"
            variant="primary">
            Update Profile
          </Button>
          </div>
      </div>
      <Toaster />
    </div >
  );
}