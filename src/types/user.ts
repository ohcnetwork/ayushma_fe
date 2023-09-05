export type User = {
    external_id: string,
    email: string,
    username: string,
    full_name: string,
    allow_key: boolean,
    is_staff: boolean,
    is_reviewer: boolean
}

export type UserUpdate = {
    full_name?: string,
    email?: string,
    allow_key?: boolean,
    is_staff?: boolean,
    is_reviewer?: boolean,
    password?: string,
}