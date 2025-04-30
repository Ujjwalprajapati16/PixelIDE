'use client'
export const getAvatarName = (name: string) => {
    const nameArray = name?.split(" ");
    if (nameArray?.length > 1) {
        return nameArray?.[0]?.[0] + nameArray?.[1]?.[0];
    } else {
        return nameArray?.[0]?.[0];
    }
    return "";
}