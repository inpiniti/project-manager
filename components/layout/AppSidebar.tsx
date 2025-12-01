'use client';

import * as React from "react"
import { useUiStore } from "@/store/uiStore"
import { CATEGORIES } from "@/lib/constants"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { selectedCategory, setSelectedCategory } = useUiStore()

    return (
        <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r" {...props}>
            <SidebarHeader className="flex items-center justify-center py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                    P
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="flex flex-col items-center gap-1 px-2">
                    {CATEGORIES.map((category) => (
                        <SidebarMenuItem key={category.id}>
                            <SidebarMenuButton
                                isActive={selectedCategory === category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className="flex flex-col items-center justify-center h-8 w-8 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                                tooltip={category.name}
                            >
                                {category.icon}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="flex items-center justify-center py-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Settings className="h-4 w-4" />
                </Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
