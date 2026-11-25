# Makefile — Trabalho Final Data Viz
#
# Interface fina sobre os scripts do package.json (Bun é o único runtime).
# Execute `make` ou `make help` para listar os comandos.

.DEFAULT_GOAL := help

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

PROJECT_NAME := data-viz
BUILD_DIR := dist

# Overridable defaults:
#   make dev PORT=3000
BUN ?= bun
PORT ?= 5173
BASE_PATH := /Trabalho-Final-Data-Viz/

# Quality commands (reuse package.json scripts)
FORMAT_CMD ?= $(BUN) run format
FORMAT_CHECK_CMD ?= $(BUN) run format:check
LINT_CMD ?= $(BUN) run lint
TEST_CMD ?= $(BUN) run test
BUILD_CMD ?= $(BUN) run build

-include .env
-include .env.local

DEV_URL := http://localhost:$(PORT)$(BASE_PATH)

# -----------------------------------------------------------------------------
# Public targets
# -----------------------------------------------------------------------------

## help: list available targets and their descriptions
.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@sed -n 's/^## //p' $(MAKEFILE_LIST) \
		| awk -F ': ' '{ printf "  %-24s %s\n", $$1, $$2 }'

## install: install dependencies from the lockfile
.PHONY: install
install:
	$(BUN) install --frozen-lockfile

## setup: install dependencies and the Playwright Chromium browser
.PHONY: setup
setup: install visual-install
	@echo "Setup complete. Run 'make dev' to start."

## dev: run the Vite dev server
.PHONY: dev
dev:
	@echo "Dev server: $(DEV_URL)"
	$(BUN) run dev -- --port $(PORT)

## build: type-check and build the production bundle
.PHONY: build
build:
	$(BUILD_CMD)

## preview: serve the production build locally
.PHONY: preview
preview: build
	$(BUN) run preview

## format: format source files (modifies files)
.PHONY: format
format:
	$(FORMAT_CMD)

## format-check: verify formatting without modifying files
.PHONY: format-check
format-check:
	$(FORMAT_CHECK_CMD)

## lint: run oxlint static analysis
.PHONY: lint
lint:
	$(LINT_CMD)

## test: run the Vitest suite once
.PHONY: test
test:
	$(TEST_CMD)

## test-watch: run Vitest in watch mode
.PHONY: test-watch
test-watch:
	$(BUN) run test:watch

## check: run all non-mutating checks (format-check, lint, test, build)
.PHONY: check
check: format-check lint test build

## visual: capture visual inspection screenshots (see specs/visual-inspection.md)
.PHONY: visual
visual:
	$(BUN) run visual

## visual-matrix: capture the full visual inspection matrix
.PHONY: visual-matrix
visual-matrix:
	$(BUN) run visual:matrix

## visual-install: install the Playwright Chromium browser
.PHONY: visual-install
visual-install:
	$(BUN) run visual:install

## clean: remove build output and visual captures
.PHONY: clean
clean:
	rm -rf $(BUILD_DIR) visual-results
