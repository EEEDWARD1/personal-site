export default function Footer() {
    return (
        <footer className="flex flex-col item-center">
            <h1>Wanna get in touch?</h1>
            <p>I am always available for exciting discussions</p>
            <a href="mailto:ed@eduardteodor.co.uk" className="inline-flex w-fit items-center gap-2 text-foreground hover:text-foreground">
                <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                </svg>
                <span>ed@eduardteodor.co.uk</span>
            </a>
            <a href="https://www.google.com/maps?q=london+united+kingdom" className="inline-flex w-fit items-center gap-2 text-foreground hover:text-foreground">
                <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>London, United Kingdom</span>
            </a>
        </footer>
    )
}
