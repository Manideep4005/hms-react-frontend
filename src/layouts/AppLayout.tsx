import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Stethoscope,
    PlusCircle,
    Search,
    CalendarDays,
    Menu,
    LogOut,
    Receipt,
    User,
    Key,
    UserCog,
    ClipboardList,
    CalendarPlus,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type MenuItem = {
    name: string;
    path: string;
    icon: LucideIcon;
    exact?: boolean;
};

type MenuSection = {
    section: string;
    items: MenuItem[];
};

function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const role = user?.role as "ADMIN" | "PATIENT" | "DOCTOR";

    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem("appSidebarCollapsed") === "true";
    });

    const [openMenu, setOpenMenu] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [tooltip, setTooltip] = useState({
        visible: false,
        text: "",
        top: 0,
        left: 0,
    });

    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        localStorage.setItem(
            "appSidebarCollapsed",
            String(collapsed)
        );
    }, [collapsed]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpenMenu(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    useEffect(() => {
        setOpenMenu(false);
    }, [location.pathname]);

    const handleLogout = () => {
        setOpenMenu(false);
        logout();
        navigate("/");
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";

        const parts = name.split(" ");

        return parts.length > 1
            ? parts[0][0] + parts[1][0]
            : parts[0][0];
    };

    const menuByRole: Record<string, MenuSection[]> = {
        ADMIN: [
            {
                section: "OVERVIEW",
                items: [
                    {
                        name: "Dashboard",
                        path: "/admin/dashboard",
                        icon: LayoutDashboard,
                        exact: true,
                    },
                ],
            },

            {
                section: "USER MANAGEMENT",
                items: [
                    {
                        name: "Users",
                        path: "/admin/users",
                        icon: Users,
                    },
                    {
                        name: "Register User",
                        path: "/admin/register",
                        icon: UserPlus,
                    },
                    {
                        name: "Patients",
                        path: "/admin/patients",
                        icon: UserCog,
                    },
                ],
            },

            {
                section: "DOCTOR MANAGEMENT",
                items: [
                    {
                        name: "Doctors",
                        path: "/admin/doctors",
                        icon: Stethoscope,
                        exact: true,
                    },
                    {
                        name: "Add Doctor",
                        path: "/admin/doctors/create",
                        icon: PlusCircle,
                    },
                    {
                        name: "Doctor Availability",
                        path: "/admin/doctors/availability",
                        icon: CalendarDays,
                    },
                ],
            },

            {
                section: "APPOINTMENTS",
                items: [
                    {
                        name: "Appointments",
                        path: "/admin/appointments",
                        icon: ClipboardList,
                    },
                    {
                        name: "Guest Appointment",
                        path: "/admin/guest-appointment",
                        icon: CalendarPlus,
                    },
                    {
                        name: "Search Appointment",
                        path: "/admin/search",
                        icon: Search,
                    },
                ],
            },

            {
                section: "FINANCE",
                items: [
                    {
                        name: "Billing",
                        path: "/admin/billing",
                        icon: Receipt,
                    },
                ],
            },
        ],

        PATIENT: [
            {
                section: "MAIN",
                items: [
                    {
                        name: "Dashboard",
                        path: "/patient/dashboard",
                        icon: LayoutDashboard,
                        exact: true,
                    },
                ],
            },
            {
                section: "APPOINTMENTS",
                items: [
                    {
                        name: "My Appointments",
                        path: "/patient/appointments",
                        icon: ClipboardList,
                    },
                    {
                        name: "Book Appointment",
                        path: "/patient/book",
                        icon: CalendarPlus,
                    },
                ],
            },
            {
                section: "BILLS",
                items: [
                    {
                        name: "My Bills",
                        path: "/patient/my-bills",
                        icon: Receipt,
                    },
                ],
            },
        ],

        DOCTOR: [
            {
                section: "MAIN",
                items: [
                    {
                        name: "Dashboard",
                        path: "/doctor/dashboard",
                        icon: LayoutDashboard,
                        exact: true,
                    },
                ],
            },
            {
                section: "APPOINTMENTS",
                items: [
                    {
                        name: "Appointments",
                        path: "/doctor/appointments",
                        icon: ClipboardList,
                    },
                ],
            },
        ],
    };

    const menu = menuByRole[role] || [];

    const getBreadcrumbs = () => {
        const allParts = location.pathname
            .split("/")
            .filter(Boolean);

        const parts = allParts.slice(1);

        return parts.map((part, index) => {
            const path =
                "/" +
                allParts
                    .slice(0, index + 2)
                    .join("/");

            return {
                label:
                    part.charAt(0).toUpperCase() +
                    part.slice(1).replace(/-/g, " "),
                path,
            };
        });
    };

    const breadcrumbs = getBreadcrumbs();

    const isDashboardPage =
        location.pathname ===
        `/${role.toLowerCase()}/dashboard` ||
        location.pathname ===
        `/${role.toLowerCase()}`;

    return (
        <div className="h-screen flex bg-gray-50 text-gray-800 overflow-hidden">
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}
            {/* SIDEBAR */}
            <aside
                className={`
        fixed lg:relative top-0 left-0 z-50 h-screen
        bg-white border-r flex flex-col overflow-hidden
        transition-all duration-300 ease-in-out
        ${mobileSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"}
        ${collapsed ? "lg:w-[72px]" : "lg:w-64"}
        w-64
    `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b shrink-0">
                    {!collapsed || mobileSidebarOpen ? (
                        <img
                            src="/MANI_HOSPITAL.png"
                            className="h-8"
                            alt="Logo"
                        />
                    ) : (
                        <span className="text-blue-600 font-bold text-xl">
                            M
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
                    {menu.map((group) => (
                        <div key={group.section}>
                            <p
                                className={`text-xs font-bold text-gray-400 px-3 mb-2 transition-all duration-200 ${collapsed && !mobileSidebarOpen ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"
                                    }`}
                            >
                                {group.section}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((m) => {
                                    const Icon = m.icon;
                                    const isActive = m.exact
                                        ? location.pathname === m.path
                                        : location.pathname.startsWith(m.path);

                                    return (
                                        <NavLink
                                            key={m.path}
                                            to={m.path}
                                            end={m.exact}
                                            onMouseEnter={(e) => {
                                                if (!collapsed || mobileSidebarOpen) return;
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setTooltip({
                                                    visible: true,
                                                    text: m.name,
                                                    top: rect.top + rect.height / 2,
                                                    left: rect.right + 10,
                                                });
                                            }}
                                            onMouseLeave={() =>
                                                setTooltip((t) => ({
                                                    ...t,
                                                    visible: false,
                                                }))
                                            }
                                            className={`flex items-center h-11 rounded-xl text-sm font-medium transition-all duration-200 ${collapsed && !mobileSidebarOpen
                                                    ? "justify-center px-0"
                                                    : "gap-3 px-3"
                                                } ${isActive
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            <Icon size={20} className="shrink-0" />

                                            <span
                                                className={`whitespace-nowrap transition-all duration-200 ${collapsed && !mobileSidebarOpen
                                                        ? "opacity-0 w-0 overflow-hidden"
                                                        : "opacity-100 w-auto"
                                                    }`}
                                            >
                                                {m.name}
                                            </span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* HEADER */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-3 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 px-2 sm:px-3 h-10 rounded-lg">
                        {/* Menu Buttons */}
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="lg:hidden p-1.5 rounded hover:bg-gray-200"
                        >
                            <Menu size={18} />
                        </button>

                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:block p-1.5 rounded hover:bg-gray-200"
                        >
                            <Menu size={18} />
                        </button>

                        {/* Back Button */}
                        {!isDashboardPage && (
                            <>
                                <span className="text-gray-300 hidden sm:inline">|</span>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-1 rounded hover:bg-gray-200 text-gray-600"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                            </>
                        )}

                        {/* Breadcrumb - Now visible on all screen sizes */}
                        {breadcrumbs.length > 0 && (
                            <>
                                <span className="text-gray-300 hidden xs:inline">|</span>
                                <div className="flex items-center gap-1 text-sm overflow-x-auto max-w-[calc(100vw-200px)] sm:max-w-none">
                                    {breadcrumbs.map((crumb, index) => {
                                        const isLast = index === breadcrumbs.length - 1;

                                        return (
                                            <div key={crumb.path} className="flex items-center gap-1">
                                                <button
                                                    onClick={() => !isLast && navigate(crumb.path)}
                                                    className={`capitalize whitespace-nowrap ${isLast
                                                            ? "text-gray-800 font-semibold cursor-default"
                                                            : "text-gray-500 hover:text-blue-600"
                                                        }`}
                                                >
                                                    {crumb.label}
                                                </button>
                                                {!isLast && (
                                                    <ChevronRight size={14} className="text-gray-400 shrink-0" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            className="flex items-center gap-2 sm:gap-3"
                        >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                                {getInitials(user?.username)}
                            </div>

                            <span className="hidden sm:block text-sm font-semibold text-gray-700">
                                {user?.username}
                            </span>
                        </button>

                        {openMenu && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setOpenMenu(false);
                                        navigate(`/${role.toLowerCase()}/profile`);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    <User size={16} />
                                    Profile
                                </button>

                                <button
                                    onClick={() => {
                                        setOpenMenu(false);
                                        navigate(`/${role.toLowerCase()}/change-password`);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                    <Key size={16} />
                                    Change Password
                                </button>

                                <div className="border-t"></div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Tooltip */}
            {tooltip.visible && (
                <div
                    className="fixed z-[9999] bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap"
                    style={{
                        top: tooltip.top,
                        left: tooltip.left,
                        transform: "translateY(-50%)",
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}

export default AppLayout;