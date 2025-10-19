import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

export const LabelWithIcon = (props: { icon: ReactNode, children: ReactNode, className?: string }) => <div className={cn("flex gap-2 items-center", props.className)}>
    { props.icon }
    { props.children }
</div>