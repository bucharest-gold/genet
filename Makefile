ci: test
	npm run prepublish

test: lint
	npm test

lint: node_modules
	npm run lint

clean:
	rm -rf node_modules
	rm *.cpuprofile
	rm *.cpuprofile.txt

node_modules: package.json
	npm install

.PHONY: node_modules