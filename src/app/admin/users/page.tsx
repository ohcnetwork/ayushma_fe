"use client";

import { Input } from "@/components/ui/interactive";
import { User } from "@/types/user";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const RoleButton = (props: {
    color: "green" | "blue" | "orange";
    text: string;
    state: boolean;
}
    & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
    const { color, text, className, state, ...rest } = props;
    return (
        <button {...rest} className={twMerge(`flex gap-1 border w-fit px-2 py-1 rounded-full items-center ${color === "green" && "hover:border-green-400"} ${color === "blue" && "hover:border-blue-400"} ${color === "orange" && "hover:border-orange-400"} transition-all ${state && `${color === "green" && "bg-green-400"} ${color === "blue" && "bg-blue-400"} ${color === "orange" && "bg-orange-400"}`}`, className)}>
            <span className={`p-1.5 rounded-full h-fit ${state ? "bg-white" : `${color === "green" && "bg-green-400"} ${color === "blue" && "bg-blue-400"} ${color === "orange" && "bg-orange-400"}`}`}></span>
            <span className={`${state ? "text-white" : `${color === "green" && "text-green-400"} ${color === "blue" && "text-blue-400"} ${color === "orange" && "text-orange-400"}`}`}>{text}</span>
        </button>
    )
}

const RoleBubble = (props: {
    color: "green" | "gray" | "orange";
    text: string;
}
) => {
    const { color, text } = props;
    return (
        <div className="flex gap-1 border w-fit px-2 py-1 rounded-full items-center transition-all">
            <span className={`p-1.5 rounded-full h-fit ${color === "green" && "bg-green-400"} ${color === "gray" && "bg-gray-400"} ${color === "orange" && "bg-orange-400"}`}></span>
            <span className={`${color === "green" && "text-green-400"} ${color === "gray" && "text-gray-400"} ${color === "orange" && "text-orange-400"}`}>{text}</span>
        </div>
    )
}

export default function Page() {
    const [searchString, setSearchString] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isReviewer, setIsReviewer] = useState(false);
    const [isKeyAllowed, setIsKeyAllowed] = useState(false);
    const userQuery = useQuery(["users"], () => API.users.list({ search: searchString, ordering: "-created_at", is_staff: isAdmin ? true : null, is_reviewer: isReviewer ? true : null, allow_key: isKeyAllowed ? true : null }));
    const usersList: User[] = userQuery.data?.results || [];

    useEffect(() => { userQuery.refetch() }, [searchString, userQuery, isAdmin, isReviewer])

    return (
        <div>
            <h1 className="text-3xl font-black mb-4">Users</h1>
            <div className="flex items-center gap-2">
                <Input type="text" placeholder="Search for user" value={searchString} onChange={event => setSearchString(event.target.value)} className="!py-1 placeholder-gray-400" />
                <RoleButton onClick={() => setIsAdmin(s => !s)} color="green" text="Admin" state={isAdmin} />
                <RoleButton onClick={() => setIsReviewer(s => !s)} color="orange" text="Reviewer" state={isReviewer} />
                <RoleButton onClick={() => setIsKeyAllowed(s => !s)} color="blue" text="Key Allowed" state={isKeyAllowed} />
            </div>
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
                        {usersList.length > 0 ? usersList.map((user, i) =>
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
                                        {!user.is_staff && !user.is_reviewer && <RoleBubble color="gray" text="User" />}
                                        {user.is_staff && <RoleBubble color="green" text="Admin" />}
                                        {user.is_reviewer && <RoleBubble color="orange" text="Reviewer" />}
                                    </div>
                                </td>
                                <td className="px-6 py-2 text-right">
                                    <a href="#" className="font-medium text-green-600 hover:underline">Edit</a>
                                </td>
                            </tr>
                        ) :
                            <tr className="bg-white border-b border-x hover:bg-gray-50 w-full">
                                <td colSpan={100} className="p-4 text-center text-gray-400">
                                    No users found
                                </td>
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
