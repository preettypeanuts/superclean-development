type HeaderProps = {
    label: string,
    desc: string
}

export const Header = ({ label, desc }: HeaderProps) => {
    return (
        <section className="">
            <h1 className="text-3xl font-medium">
                {label}
            </h1>
            <p>
                {desc}
            </p>
        </section>
    )
} 