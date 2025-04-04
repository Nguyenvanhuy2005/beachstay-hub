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
				background: '#edf6f9', // Light blue-gray
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
					50: '#e6f2ed',
					100: '#cce6dc',
					200: '#b3d9ca',
					300: '#99ccb9',
					400: '#80bfa7',
					500: '#66b396',
					600: '#4da684',
					700: '#339973',
					800: '#1a8c61',
					900: '#137252', // Base color
				},
				mint: {
					50: '#f4fbf8',
					100: '#e8f7f1',
					200: '#dcf3e9',
					300: '#d0efe2',
					400: '#c4ebdb',
					500: '#b7e1cd', // Base color
					600: '#9ad7bc',
					700: '#7dcdac',
					800: '#60c39b',
					900: '#43b98b',
				},
				cream: {
					50: '#fffff8',
					100: '#fffff5',
					200: '#fffff2',
					300: '#fffff0', // Base color
					400: '#fffceb',
					500: '#fff9e6',
					600: '#fff6e0',
					700: '#fff4c5', // Base color
					800: '#fff1c0',
					900: '#ffeebc',
				},
				pale: {
					50: '#fbfcfd',
					100: '#f7f9fb',
					200: '#f3f7f9',
					300: '#eff4f7',
					400: '#edf6f9', // Base color
					500: '#e6f0f4',
					600: '#dfe9ee',
					700: '#d8e3e9',
					800: '#d1dce3',
					900: '#cad6de',
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
