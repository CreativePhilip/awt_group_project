import {create} from "zustand";
import {User} from "./api/models/user";
import {getCurrentUser} from "./api/login";



interface UserStore {
    user: User | null,
    loadUser: () => Promise<User | null>,
    isLoggedIn: () => Promise<boolean>
}

export const useUserStore = create<UserStore>()((set, get) => ({
    user: null,
    loadUser: async () => {
        const newUser = await getCurrentUser()

        if (newUser !== null) {
            set(() => ({user: newUser}))
            return newUser
        }

        return null
    },
    isLoggedIn: async () => {
        const userStore = get()

        if (userStore.user !== null) {
            return true
        }

        const hasLoaded = await userStore.loadUser()
        return hasLoaded !== null
    }
}))