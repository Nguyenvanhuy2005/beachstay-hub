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
				sans: ['Open Sans', 'system-ui'],
				display: ['Montserrat', 'system-ui',],
			},
			colors: {
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
				olive: {
					50: '#f3f4f1',
					100: '#e7e9e3',
					200: '#d0d4c8',
					300: '#b8bfac',
					400: '#a1aa90',
					500: '#8a9575',
					600: '#6c7560',
					700: '#565e4d',
					800: '#41483a',
					900: '#2b3127',
				},
				terra: {
					50: '#fcf6f3',
					100: '#f9ede7',
					200: '#f3dbcf',
					300: '#ecc9b8',
					400: '#e5b7a0',
					500: '#d69a7c',
					600: '#c07653',
					700: '#9a5e42',
					800: '#734632',
					900: '#4d2e21',
				},
				beach: {
					50: '#E0F7FF',
					100: '#C0EEFF',
					200: '#81DEFF',
					300: '#42CDFF',
					400: '#03BCFF',
					500: '#0099D6',
					600: '#007AB0',
					700: '#005C85',
					800: '#003D59',
					900: '#001F2E',
				},
				sand: {
					50: '#FEF7ED',
					100: '#FEEFD7',
					200: '#FDDFAF',
					300: '#FBCF87',
					400: '#F9BF5F',
					500: '#F8AF37',
					600: '#E9920C',
					700: '#B77209',
					800: '#7F5006',
					900: '#462C03',
				},
				coral: {
					50: '#FFF1F0',
					100: '#FFE2E0',
					200: '#FFC5C1',
					300: '#FFA8A2',
					400: '#FF8B83',
					500: '#FF6E64',
					600: '#FF5147',
					700: '#FF352A',
					800: '#FF180C',
					900: '#EB0A00',
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
