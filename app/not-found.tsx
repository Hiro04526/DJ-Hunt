import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <section className="w-full text-white dark:text-black bg-black dark:bg-white py-4 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mt-16 mx-auto max-w-xl p-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Uh-oh. Page not found.
                    </h1>
                    <p className="mt-4 text-sm text-muted-foreground">
                        The link you clicked may be broken or the page may have been removed.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <Button
                            asChild
                            className={cn(
                                buttonVariants({ variant: "inverted", size: "lg" }),
                                "hover:shadow-[0_0_25px_#00FF84] hover:scale-105"
                            )}
                        >
                            <Link href="/">
                                Go home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}