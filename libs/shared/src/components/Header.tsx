type HeaderProps = {
    label: string,
    desc?: string
    count?: number
}

export const Header = ({ label, desc, count }: HeaderProps) => {
    return (
        <section className="flex gap-3 items-center">
            <div className="w-1 self-stretch rounded-full bg-mainColor"></div>
            <div>
                <h1 className="text-3xl font-medium flex items-center gap-2">
                    {label}
                    <span className={`${!count && "hidden"} text-sm px-1 py-[1px] bg-mainColor/60 rounded-[5px]`}>
                        {count}
                    </span>
                </h1>
                <p className="opacity-70">
                    {desc}
                </p>
            </div>
        </section>
    )
} 