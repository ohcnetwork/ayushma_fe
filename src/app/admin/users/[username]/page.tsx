"use client";

import { Button, Input } from "@/components/ui/interactive";
import { User, UserUpdate } from "@/types/user";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = ({ params }: { params: { username: string } }) => {
    const { username } = params;
    const router = useRouter();
    const userQuery = useQuery(["user", username], () => API.users.get(username), {
        onSuccess(data) {
            setUserState(data);
        },
    });
    const userData: User | undefined = userQuery.data;

    const [updatingUser, setUpdatingUser] = useState(false);
    const [deletingUser, setDeletingUser] = useState(false);

    const [userState, setUserState] = useState<UserUpdate>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setUpdatingUser(true);
        e.preventDefault();
        updateUserMutation.mutate();
    };

    const updateUserMutation = useMutation(
        () => API.users.update(userData ? userData.username : "", userState),
        {
            onSuccess: () => setUpdatingUser(false),
            onError: () => setUpdatingUser(false),
        }
    );

    const updateError = updateUserMutation.error as any;


    const deleteUser = () => {
        if (confirm("Are you sure you want to delete this user?") && userData) {
            setDeletingUser(true);
            deleteUserMutation.mutate({
                username: userData.username
            }, {
                onSuccess: () => {
                    setDeletingUser(false);
                    router.push("/admin/users");
                }
            });
        }
    }

    const deleteUserMutation = useMutation(
        (params: { username: string }) => API.users.delete(params.username),
        {
            onError: () => {
                alert("Cannot delete account that is currently being used");
                setDeletingUser(false);
            }
        }
    );

    return (
        <div>
            <h1 className="text-3xl font-black">{userData?.username}</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 mt-6"
                encType="multipart/form-data"
            >
                <div>
                    <div className="flex gap-4 items-center">
                        <p className="mb-2 text-sm text-gray-500">
                            Full name
                        </p>
                        {updateError && updateError.error.full_name && (
                            <p className="text text-sm text-red-500 mb-2">
                                ({updateError.error.full_name})
                            </p>
                        )}
                    </div>

                    <Input
                        placeholder="Full name"
                        value={userState.full_name}
                        onChange={(e) => setUserState((us) => { return { ...us, full_name: e.target.value } })}
                    />
                </div>
                <div>
                    <div className="flex gap-4 items-center">
                        <p className="mb-2 text-sm text-gray-500">
                            Email
                        </p>
                        {updateError && updateError.error.email && (
                            <p className="text text-sm text-red-500 mb-2">
                                ({updateError.error.email})
                            </p>
                        )}
                    </div>
                    <Input
                        placeholder="Email"
                        value={userState.email}
                        onChange={(e) => setUserState((us) => { return { ...us, email: e.target.value } })}
                    />
                </div>
                <div>
                    <p className="mb-2 text-sm text-gray-500">
                        Roles
                    </p>
                    <div className="flex gap-6 items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => setUserState({ ...userState, is_staff: !userState.is_staff })} checked={userState.is_staff} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">Is Admin</span>
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => setUserState({ ...userState, is_reviewer: !userState.is_reviewer })} checked={userState.is_reviewer} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">Is Reviewer</span>
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => setUserState({ ...userState, allow_key: !userState.allow_key })} checked={userState.allow_key} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">Allow key</span>
                        </label>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <Button loading={updatingUser} type="submit" className="w-full">
                        Update user
                    </Button>
                    <Button loading={deletingUser} variant="danger" onClick={deleteUser} className="w-full">
                        Delete user
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Page;