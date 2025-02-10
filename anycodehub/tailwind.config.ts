import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
	  ],
	  theme: {
      	extend: {
      		colors: {
      			background: 'var(--background)',
      			foreground: 'var(--foreground)',
      			primary: '#8B5DFF',
				grayDarkest: '#131316',
				grayDarker: '#212126',
				grayDark: '#9394A1'
      		},
      		fontFamily: {
      			primary: [
      				'var(--font-manrope)'
      			],
      			secondary: [
      				'var(--font-roboto)'
      			]
      		},
      		borderRadius: {
      			lg: 'var(--radius)',
      			md: 'calc(var(--radius) - 2px)',
      			sm: 'calc(var(--radius) - 4px)'
      		}
      	}
      },
	  plugins: [require("tailwindcss-animate")],
} satisfies Config;
