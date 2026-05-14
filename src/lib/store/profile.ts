import { writable } from "svelte/store";

const API_SERVER = import.meta.env.VITE_API_SERVER;

export type UserProfile = {
  steamID64: string | number;
  name: string;
  avatarLink: string;
};

export const profileState = writable<UserProfile | null>(null);

export const setProfileState = async (token: string | null) => {
  if (!token) {
    profileState.set(null);
    return null;
  }

  try {
    const response = await fetch(`${API_SERVER}/user-summary/profile/self`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      profileState.set(null);
      return null;
    }

    const profile = await response.json() as Partial<UserProfile>;

    const nextProfile: UserProfile = {
      steamID64: profile.steamID64!!,
      name: profile.name!!,
      avatarLink: profile.avatarLink!!,
    };

    profileState.set(nextProfile);
    return nextProfile;
  } catch (error) {
    profileState.set(null);
    return null;
  }
};
