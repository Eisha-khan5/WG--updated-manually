
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
				// New color palette based on the provided image
				navy: {
					50: '#e6ebf0',
					100: '#cdd7e0',
					200: '#9aafC1',
					300: '#6787a3',
					400: '#345f84',
					500: '#193756',
					600: '#162e47',
					700: '#132539',
					800: '#101c2b',
					900: '#0c131c',
					950: '#060a0e',
				},
				steel: {
					50: '#f0f5f8',
					100: '#e1ebf1',
					200: '#c3d6e2',
					300: '#a4c1d4',
					400: '#86acc5',
					500: '#6797b7',
					600: '#527992',
					700: '#3d5b6e',
					800: '#293c49',
					900: '#141e25',
					950: '#0a0f12',
				},
				sky: {
					50: '#f0f7f9',
					100: '#e0eff3',
					200: '#c2dfe7',
					300: '#a3cedb',
					400: '#85becf',
					500: '#66adc3',
					600: '#528a9c',
					700: '#3e6875',
					800: '#29454e',
					900: '#152227',
					950: '#0a1114',
				},
				cream: {
					50: '#fdfef2',
					100: '#fbfce5',
					200: '#f7f9cb',
					300: '#f4f6b2',
					400: '#f0f398',
					500: '#ecef7e',
					600: '#bdbf65',
					700: '#8e8f4c',
					800: '#5e6032',
					900: '#2f3019',
					950: '#17180d',
				},
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'serif': ['Playfair Display', 'serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
