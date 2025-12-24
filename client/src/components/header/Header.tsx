export const Header: React.FC = () => {
    return (
        <header className="w-full border-b border-neutral-200/60 bg-gradient-to-br from-slate-50 via-white to-neutral-50/80 backdrop-blur-sm">
            <div className="px-8 lg:px-0 lg:mx-auto lg:max-w-[50vw] py-6 lg:py-8 flex items-baseline justify-between">
                <a
                    href="/"
                    className="text-lg lg:text-3xl font-medium text-neutral-500 google-sans-flex tracking-[0.1em] uppercase"
                >
                    Urban Jobs
                </a>
                <h1 className="text-lg lg:text-3xl font-medium text-neutral-500 google-sans-flex tracking-[0.1em] uppercase">
                    NYC
                </h1>
            </div>
        </header>
    )
}