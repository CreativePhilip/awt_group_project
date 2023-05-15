import axios from "axios"

export const setupAxios = () => {
    axios.defaults.baseURL = "http://localhost:8001/"
    axios.defaults.withCredentials = true

    axios.interceptors.request.use((config) => {
        config.headers["X-CSRFToken"] = getCookie("csrftoken")

        return config
    })
}

export function getCookie(name: string): string | null {
    const pattern = RegExp(name + "=.[^;]*")
    const matched = document.cookie.match(pattern)
    if (matched) {
        const cookie = matched[0].split("=")
        return cookie[1]
    }
    return null
}