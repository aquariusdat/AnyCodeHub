import { Manrope, Roboto } from "next/font/google";

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
});

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-roboto",
});

export { manrope, roboto };