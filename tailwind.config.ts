
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Open Sans', 'Arial', 'system-ui', 'sans-serif'],
				display: ['Open Sans', 'Arial', 'system-ui', 'sans-serif'],
			},
			colors: {
				primary: '#137252', // Dark green
				secondary: '#b7e1cd', // Light green
				background: '#f3fff9', // Very light green
				accent: '#fff4c5', // Light yellow
				neutral: '#fffff0', // Off-white

				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				green: {
					50: '#f3fff9',
					100: '#e6f7ed',
					200: '#cceede',
					300: '#b7e1cd',
					400: '#9dd4bc',
					500: '#82c7ab',
					600: '#68ba9a',
					700: '#4dad89',
					800: '#339a78',
					900: '#137252', // Base color
				},
				mint: {
					50: '#f3fff9', // Very light green
					100: '#e6f7ed',
					200: '#d9f0e0',
					300: '#cce8d4',
					400: '#bfe1c7',
					500: '#b7e1cd', // Base color
					600: '#a0d4b6',
					700: '#89c79f',
					800: '#72ba88',
					900: '#5bad71',
				},
				cream: {
					50: '#fffff0', // Off-white
					100: '#fffef5',
					200: '#fffdf0',
					300: '#fffceb',
					400: '#fffbe6',
					500: '#fff9e1',
					600: '#fff8dc',
					700: '#fff4c5', // Light yellow
					800: '#fff1c0',
					900: '#ffeebc',
				},
				pale: {
					50: '#f3fff9', // Very light green
					100: '#eefdf5',
					200: '#e9fcf1',
					300: '#e4faed',
					400: '#dff9e9',
					500: '#daf7e5',
					600: '#d5f6e1',
					700: '#d0f4dd',
					800: '#cbf3d9',
					900: '#c6f1d5',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'wave': {
					'0%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(-25%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'wave': 'wave 10s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
