import type { ReactNode } from "react"

type Props = {
    label: ReactNode
    children: ReactNode
}
function CommonSection(props: Props) {
    return <div className="px-4 lg:px-12 !w-full text-white">
        {props.label}
        <div className="w-4 lg:h-6 h-12"></div>
        <div className="!w-full">
            {props.children}
        </div>
    </div>
}

export default CommonSection