type HeaderProps = {
    label: string,
    desc?: string
    count?: number
}

export const Header = ({ label, desc, count }: HeaderProps) => {
    return (
        <section className="flex gap-3 items-center w-[105%] border-b pb-3 -m-3 p-3">
            <div className="w-1 self-stretch rounded-full bg-mainColor"></div>
            <div>
                <h1 className="text-xl font-medium flex items-center gap-2">
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



export const HeaderMobile = ({ label, desc, count }: HeaderProps) => {
    return (
        <section className="navbar h-16 shadow">
            <h1 className="w-full text-xl font-semibold flex items-center justify-center">
                {label}
            </h1>
        </section>
    )
}

