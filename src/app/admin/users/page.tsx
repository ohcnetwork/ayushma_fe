"use client";

import { User } from "@/types/user";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
    const userQuery = useQuery(["users"], () => API.users.list());
    const usersList: User[] = userQuery.data?.results || [];

    return (
        <div>
            <h1 className="text-3xl font-black">Users</h1>
            <div className="relative overflow-x-auto mt-2 sm:rounded-lg">
                <table className="w-full text-sm text-left ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-300 rounded-lg">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList.map((user, i) =>
                            <tr key={i} className="bg-white border-b border-x hover:bg-gray-50">
                                <td scope="row" className="px-6 py-2 font-medium text-gray-900 ">
                                    <div className="flex flex-col">
                                        <div className="flex gap-2 items-center">
                                            <span>{user.full_name ? user.full_name : "(No name)"}</span>
                                            {user.allow_key && <i className="fa fa-key text-xs text-gray-400" aria-hidden="true" />}
                                        </div>
                                        <span className="text-green-400 text-xs">{user.username}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-2">
                                    {user.email}
                                </td>
                                <td className="px-6 py-2">
                                    <div className="flex gap-2">
                                        {!user.is_staff && !user.is_reviewer && <div className="flex gap-1 border w-fit px-2 py-1 rounded-full items-center">
                                            <span className="bg-gray-400 p-1.5 rounded-full h-fit"></span>
                                            <span className="text-gray-500">User</span>
                                        </div>}
                                        {user.is_staff && <div className="flex gap-1 border w-fit px-2 py-1 rounded-full items-center">
                                            <span className="bg-green-400 p-1.5 rounded-full h-fit"></span>
                                            <span className="text-green-500">Admin</span>
                                        </div>}
                                        {user.is_reviewer && <div className="flex gap-1 border w-fit px-2 py-1 rounded-full items-center">
                                            <span className="bg-orange-400 p-1.5 rounded-full h-fit"></span>
                                            <span className="text-orange-500">Reviewer</span>
                                        </div>}
                                    </div>
                                </td>
                                <td className="px-6 py-2 text-right">
                                    <a href="#" className="font-medium text-green-600 hover:underline">Edit</a>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
