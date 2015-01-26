REPORTER = spec
TIMEOUT = 10000
MOCHA = ./node_modules/.bin/mocha
MOCHA_TARGET = test

test:
		@NODE_ENV=test ./node_modules/mocha/bin/mocha --ui bdd --reporter spec --timeout $(TIMEOUT)

coverage:
		@$(MOCHA) --require blanket $(MOCHA_TARGET) -R html-cov > coverage.html 

.PHONY: test coverage
