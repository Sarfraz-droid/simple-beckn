prod-setup:
	npm install
	node scripts/setup.js
	npm run build

setup:
	npm install -g yarn localtunnel concurrently
	yarn

sarfraz-bap:
	npx concurrently \
		"lt --port 3001 --subdomain sarfraz-bap" \
		"yarn dev:bap"

sarfraz-bpp:
	npx concurrently \
		"lt --port 3000 --subdomain sarfraz-bpp" \
		"yarn dev:bpp"

sarfraz-bap-bpp:
	npx concurrently \
		"lt --port 3001 --subdomain sarfraz-bap" \
		"lt --port 3000 --subdomain sarfraz-bpp" \
		"yarn dev:bap" \
		"yarn dev:bpp"
