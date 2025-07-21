import { BriefcaseBusinessIcon, Calendar, Code2Icon, Crown, LayoutDashboard, List, Puzzle, Settings, User2Icon, WalletCards } from "lucide-react";

export const SidebarOptions = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
    },
    {
        name: 'Schedule Interview',
        icon: Calendar,
        path: '/schedule-interview',
    },
    {
        name: 'All Interviews',
        icon: List,
        path: '/all-interviews',
    },
    {
        name: 'Billing',
        icon: WalletCards,
        path: '/billing',
    },
    {
        name: 'Settings',
        icon: Settings,
        path: '/settings',
    },
]

export const InterviewType = [
    {
        title: 'Technical',
        icon: Code2Icon
    },
    {
        title: 'Behavioral',
        icon: User2Icon
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Problem Solving',
        icon: Puzzle
    },
    {
        title: 'Leadership',
        icon: Crown
    },
]