import { useState, useEffect } from "react"
import { auth, token, scheduleAccessTokenRefresh, clearAccessTokenRefreshSchedule } from "./api.js"
import { LandingPage } from "./pages/LandingPage.jsx"
import { AuthPage } from "./pages/AuthPage.jsx"
import { Dashboard } from "./pages/Dashboard.jsx"

import "./styles/App.css"

export default function App() {
    const [user, setUser] = useState(() => {
        try {
            const u = localStorage.getItem("tb_user")
            return u ? JSON.parse(u) : null
        } catch {
            return null
        }
    })
    
    // user still in session -> go to dashboard
    const [page, setPage] = useState(() => {
        try {
            return localStorage.getItem("tb_user") ? "dashboard" : "landing"
        } catch {
            return "landing"
        }
    })
    const [authScreen, setAuthScreen] = useState("login")

    function navigate(target) {
        window.scrollTo({ top: 0, behavior: "instant" })
        if (target === "login" || target === "register") {
            setAuthScreen(target)
            setPage("auth")
        } else {
            setPage(target)
        }
    }

    function handleLogin(userData) {
        setUser(userData)
        localStorage.setItem("tb_user", JSON.stringify(userData))
        setPage("dashboard")
        scheduleAccessTokenRefresh()
    }

    function handleLogout() {
        clearAccessTokenRefreshSchedule()
        auth.logout().catch(() => {})
        token.clear()
        localStorage.removeItem("tb_user")
        setUser(null)
        setPage("landing")
    }

    useEffect(() => {
        if (token.getAccess() && token.getRefresh()) scheduleAccessTokenRefresh()
        return () => clearAccessTokenRefreshSchedule()
    }, [])

    return (
        <>
            {page === "landing" && <LandingPage navigate={navigate} />}
            {page === "auth" && <AuthPage key={authScreen} initialScreen={authScreen} navigate={navigate} onLogin={handleLogin} />}
            {page === "dashboard" && user && <Dashboard user={user} navigate={navigate} onLogout={handleLogout} />}
            {page === "dashboard" && !user && <AuthPage initialScreen="login" navigate={navigate} onLogin={handleLogin} />}
        </>
    )
}
