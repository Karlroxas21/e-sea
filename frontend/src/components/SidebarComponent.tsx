import {
    House,
    FileText,
    ShieldCheck,
    Anchor,
    Briefcase,
    GraduationCap,
    ClipboardCheck,
    BookOpen,
    FolderOpen,
    Newspaper,
    Settings,
    LogOut,
    ArrowLeftToLine,
    ArrowRightToLine,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import UTSLogo from '@/assets/UTS.png';
import UTSLogoIcon from '@/assets/UTS_LOGO.png';
import { useAuth } from '@/providers/auth-provider';

const mainNavItems = [
    { title: 'Dashboard', url: '/dashboard', icon: House, isActive: true },
    { title: 'My Requirements', url: '/requirements', icon: FileText, badge: '5' },
    { title: 'Compliance', url: '/compliance', icon: ShieldCheck },
    { title: 'Assignments', url: '/assignments', icon: Anchor },
    { title: 'Jobs', url: '/jobs', icon: Briefcase },
];

const activityNavItems = [
    { title: 'Training', url: '/training', icon: GraduationCap },
    { title: 'Assessments', url: '/assessments', icon: ClipboardCheck },
    { title: 'Logbook', url: '/logbook', icon: BookOpen },
    { title: 'Documents', url: '/documents', icon: FolderOpen },
    { title: 'News', url: '/news', icon: Newspaper },
];

export function SidebarComponent({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, toggleSidebar } = useSidebar();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Sign out request failed:', error);
        }
    };

    const isCollapsed = state === 'collapsed';

    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className={cn('border-y-0 border-slate-300 bg-white', className)}
        >
            <SidebarHeader className="p-4 md:p-6 group-data-[collapsible=icon]:p-4">
                <div
                    className="flex justify-between items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group-data-[collapsible=icon]:justify-center"
                    title="Toggle Sidebar"
                >
                    <img
                        src={isCollapsed ? UTSLogoIcon : UTSLogo}
                        alt="UTS Logo"
                        className={`${isCollapsed ? 'hidden' : 'block'} transition-all duration-200 object-contain h-10 w-auto`}
                    />
                    {isCollapsed ? (
                        <div onClick={toggleSidebar}>
                            <ArrowRightToLine size="16" />
                        </div>
                    ) : (
                        <div onClick={toggleSidebar}>
                            <ArrowLeftToLine size="16" />
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-4 mb-2 group-data-[collapsible=icon]:hidden">
                        Main
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => {
                                const isActive = location.pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                'h-9 px-4 rounded-md transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',
                                                isActive
                                                    ? 'bg-[#0B2545] text-white hover:bg-[#0B2545] hover:text-white'
                                                    : 'text-slate-500 hover:bg-slate-100',
                                            )}
                                        >
                                            <Link
                                                to={item.url}
                                                className="flex items-center gap-3 w-full"
                                            >
                                                <item.icon className="h-4 w-4 shrink-0" />
                                                <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                                                    {item.title}
                                                </span>
                                                {item.badge && (
                                                    <span className="bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ml-auto group-data-[collapsible=icon]:hidden">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-slate-400 px-4 mb-2 group-data-[collapsible=icon]:hidden">
                        Activities
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {activityNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="h-9 px-4 text-slate-500 hover:bg-slate-100 rounded-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                                    >
                                        <a href={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                                                {item.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-slate-300">
                <div className="flex items-center justify-between w-full px-2 group-data-[collapsible=icon]:justify-center">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#0B2545] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {user?.fullName
                                ? user.fullName
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .toUpperCase()
                                      .slice(0, 2)
                                : 'U'}
                        </div>
                        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                            <span className="text-sm font-bold text-slate-900 leading-tight">
                                {user?.fullName || 'User'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                                {user?.currentStatus || 'Online'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                        <button className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer rounded-md hover:bg-slate-50 transition-colors">
                            <Settings className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-600 cursor-pointer rounded-md hover:bg-red-50 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
