const BASE = (import.meta.env?.VITE_API_URL || "http://localhost:3000") + "/api/v1"
export const API_BASE = BASE

// --- handle token ---
export const token = {
    getAccess: () => localStorage.getItem("access_token"),
    getRefresh: () => localStorage.getItem("refresh_token"),
    setAccess: (t) => localStorage.setItem("access_token", t),
    set: (a, r) => {
        localStorage.setItem("access_token", a)
        if (r != null) localStorage.setItem("refresh_token", r)
    },
    clear: () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
    },
}

function decodeJwtPayload(accessToken) {
    if (!accessToken || typeof accessToken !== "string") return null
    const parts = accessToken.split(".")
    if (parts.length < 2) return null
    try {
        const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
        const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : ""
        return JSON.parse(atob(b64 + pad))
    } catch {
        return null
    }
}

let refreshTimerId = null

async function refreshAccessToken() {
    const refresh_token = token.getRefresh()
    if (!refresh_token) throw new Error("No refresh token")
    const res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
    })
    if (!res.ok) {
        token.clear()
        throw new Error("Session expired")
    }
    const data = await res.json()
    const access = data.access_token
    if (!access) {
        token.clear()
        throw new Error("Session expired")
    }
    if (data.refresh_token) token.set(access, data.refresh_token)
    else token.setAccess(access)
    return access
}

// --- schedule refresh 60s before access JWT expires, called after login and after each successful refresh ---
export function scheduleAccessTokenRefresh() {
    if (refreshTimerId) clearTimeout(refreshTimerId)
    refreshTimerId = null
    const access = token.getAccess()
    const refresh = token.getRefresh()
    if (!access || !refresh) return
    const payload = decodeJwtPayload(access)
    const expMs = payload?.exp ? payload.exp * 1000 : null
    if (!expMs) return
    const skew = 60_000
    const delay = Math.max(5_000, expMs - Date.now() - skew)
    refreshTimerId = setTimeout(() => {
        refreshTimerId = null
        refreshAccessToken()
            .then(() => scheduleAccessTokenRefresh())
            .catch(() => {})
    }, delay)
}

export function clearAccessTokenRefreshSchedule() {
    if (refreshTimerId) clearTimeout(refreshTimerId)
    refreshTimerId = null
}

// --- error message ---
async function readErrorPayload(res) {
    const text = await res.text()
    if (!text?.trim()) return {}
    try {
        return JSON.parse(text)
    } catch {
        return { message: text.slice(0, 240) }
    }
}

function errorMessageFromPayload(body, status) {
    if (body && typeof body === "object") {
        if (typeof body.message === "string" && body.message.trim()) return body.message.trim()
        if (typeof body.error === "string" && body.error.trim()) return body.error.trim()
        if (typeof body.detail === "string" && body.detail.trim()) return body.detail.trim()
        if (Array.isArray(body.errors)) {
            const parts = body.errors.map((e) => (e && (e.msg || e.message)) || "").filter(Boolean)
            if (parts.length) return parts.join(" ")
        }
    }
    const byStatus = {
        400: "Invalid request. Check your input and try again.",
        401: "Incorrect email or password, or your session has expired.",
        403: "You don't have permission to do that.",
        404: "We couldn't find what you asked for.",
        409: "This email may already be registered. Try signing in instead.",
        422: "Some fields are invalid. Please review the form.",
        429: "Too many attempts. Please wait a moment and try again.",
        500: "Something went wrong on our side. Please try again later.",
        502: "The server is temporarily unavailable. Please try again.",
        503: "The service is temporarily unavailable. Please try again later.",
    }
    return byStatus[status] || `Request failed (${status}). Please try again.`
}

let isRefreshing = false
let refreshQueue = []

// create a request
async function request(method, path, body, isFile = false) {
    const makeReq = async (accessToken) => {
        const headers = {}
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`
        if (!isFile) headers["Content-Type"] = "application/json"

        const res = await fetch(`${BASE}${path}`, {
            method,
            headers,
            body: isFile ? body : body ? JSON.stringify(body) : undefined,
        })

        const isAuthPath = path.startsWith("/auth/")
        const isRefreshCall = path === "/auth/refresh"

        if (res.status === 401 && !isAuthPath && !isRefreshCall) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject })
                }).then((newToken) => makeReq(newToken))
            }
            isRefreshing = true
            try {
                const newToken = await refreshAccessToken()
                scheduleAccessTokenRefresh()
                refreshQueue.forEach((p) => p.resolve(newToken))
                refreshQueue = []
                isRefreshing = false
                return makeReq(newToken)
            } catch (err) {
                refreshQueue.forEach((p) => p.reject(err))
                refreshQueue = []
                isRefreshing = false
                throw err
            }
        }

        if (!res.ok) {
            const errBody = await readErrorPayload(res)
            throw new Error(errorMessageFromPayload(errBody, res.status))
        }

        if (res.status === 204) return null
        
        const text = await res.text()

        if (!text || !text.trim()) return null
        
        try {
            return JSON.parse(text)
        } catch {
            throw new Error("Invalid response from server")
        }
    }

    return makeReq(token.getAccess())
}

const get = (path) => request("GET", path)
const post = (path, body) => request("POST", path, body)
const put = (path, body) => request("PUT", path, body)
const del = (path, body) => request("DELETE", path, body)
const upload = (path, form) => request("POST", path, form, true)
const uploadPut = (path, form) => request("PUT", path, form, true)
const uploadPost = (path, form) => request("POST", path, form, true)

// --- auth ---
export const auth = {
    register: (email, password, role) => post("/auth/register", { email, password, role }),

    login: (email, password) => post("/auth/login", { email, password }),

    refresh: (refresh_token) => post("/auth/refresh", { refresh_token }),

    logout: () => post("/auth/logout", { refresh_token: token.getRefresh() }),
}

// --- profiles ---
// 1. job seeker profile
export const candidateProfile = {
    getOwn: () => get("/profiles/candidates/my"),
    getById: (id) => get(`/profiles/candidates/${id}`),
    update: (data) => put("/profiles/candidates", data),
    uploadAvatar: (file) => {
        const form = new FormData()
        form.append("avatar", file)
        return uploadPost("/profiles/candidates/my/avatar", form)
    },
    deleteAvatar: () => del(`/profiles/candidates/my/avatar`),
}

// 2. company profile
export const companyProfile = {
    getOwn: () => get("/profiles/companies/my"),
    getById: (id) => get(`/profiles/companies/${id}`),
    update: (data) => put("/profiles/companies", data),
    uploadLogo: (file) => {
        const form = new FormData()
        form.append("logo", file)
        return uploadPut("/profiles/companies/logo", form)
    },
    // POST /profiles/companies/verify — upload one or more docs
    submitVerification: (files) => {
        const form = new FormData()
        const fileList = Array.isArray(files) ? files : [files]
        fileList.forEach((f) => form.append("documents", f))
        return upload("/profiles/companies/verify", form)
    },
    // GET /profiles/companies/verify — list all docs for the authenticated company
    getVerificationDocuments: () => get("/profiles/companies/verify"),
    // DELETE /profiles/companies/verify — body: { docs: [id, ...] }
    deleteVerificationDocuments: (ids) => del("/profiles/companies/verify", { docs: Array.isArray(ids) ? ids : [ids] }),
    // PUT /profiles/companies/verify/:id — replace a single doc file
    editVerificationDocument: (id, file) => {
        const form = new FormData()
        form.append("documents", file)
        return uploadPut(`/profiles/companies/verify/${id}`, form)
    },
}

// --- cv ---
export const cvs = {
    upload: (file) => {
        const form = new FormData()
        form.append("cv", file)
        return upload("/cvs", form)
    },
    list: () => get("/cvs"),
    getById: (id) => get(`/cvs/${id}`),
    update: (id, file) => {
        const form = new FormData()
        form.append("cv", file)
        return uploadPut(`/cvs/${id}`, form)
    },
    delete: (id) => del(`/cvs/${id}`),
}

// --- jobs ---
// can search job with following filter: search, location, minSalary, maxSalary, currency, type, page, limit
export const jobs = {
    create: (data) => post("/jobs", data),
    update: (id, data) => put(`/jobs/${id}`, data),
    getMine: () => get("/jobs/my"),
    search: (params = {}) => {
        const q = new URLSearchParams()
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "") q.append(k, v)
        })
        return get(`/jobs${q.toString() ? "?" + q.toString() : ""}`)
    },
    getById: (id) => get(`/jobs/${id}`),
    getCompany: (id) => get(`/jobs/${id}/company`),
    delete: (id) => del(`/jobs/${id}`),
}

//  --- bookmark ---
function normalizeJobListResponse(raw) {
    if (Array.isArray(raw)) return raw
    if (raw?.data && Array.isArray(raw.data)) return raw.data
    if (raw?.jobs && Array.isArray(raw.jobs)) return raw.jobs
    return []
}

export const savedJobs = {
    list: async () => normalizeJobListResponse(await get("/bookmark/")),
    save: (jobId) => post(`/bookmark/${jobId}/`, {}),
    unsave: (jobId) => del(`/bookmark/${jobId}/`),
}

// --- ranking applicants to a job ---
export const ranking = {
    getForJob: (job_id) => get(`/ranking/${job_id}`),
}

// --- applications ---
export const applications = {
    apply: (job_id, cv_id) => post("/applications", { job_id, cv_id }),
    getMine: () => get("/applications/my"),
    getApplicationsForRecruiterJob: (job_id) => get(`/applications/job/${job_id}`),
    updateStatus: (id, status) => put(`/applications/${id}/status`, { status }),
    updateApplication: (id, data) => put(`/applications/${id}`, data),
    deleteApplication: (id) => del(`/applications/${id}`),
}

// --- download ---
async function downloadFile(path, suggestedName) {
    const accessToken = token.getAccess()
    const res = await fetch(`${BASE}${path}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })

    if (!res.ok) {
        const errBody = await readErrorPayload(res)
        throw new Error(errorMessageFromPayload(errBody, res.status))
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = suggestedName || "download"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

export const downloads = {
    cv: (cvId, fileName) => downloadFile(`/download/cv/${cvId}`, fileName),

    // *note: admin can download any veridoc
    verificationDoc: (docId, fileName) => downloadFile(`/download/verification/${docId}`, fileName),
}
 