.PHONY: dev build start check fix lint prettier-check prettier-fix help

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

check-all: ## Run all checks (lint, format, types, build)
	npm run lint && npm run format:check && npx tsc --noEmit && npm run build

# Автоматическое исправление (линт + форматирование)
fix:
	@echo "🔧 Fixing lint issues..."
	@npm run lint -- --fix
	@echo "✨ Fixing code formatting..."
	@npx prettier --write .
	@echo "✅ All fixes applied!"

# Только линт
lint:
	@npm run lint

# Только проверка форматирования
prettier-check:
	@npx prettier --check .

# Только исправление форматирования
prettier-fix:
	@npx prettier --write .

type-check: ## Check code types
	npx tsc --noEmit

# Помощь
help:
	@echo "Available commands:"
	@echo "  make dev           - Run development server"
	@echo "  make build         - Build for production"
	@echo "  make start         - Start production server"
	@echo "  make check         - Check code quality (lint + prettier)"
	@echo "  make fix           - Auto-fix issues (lint + prettier)"
	@echo "  make lint          - Run ESLint only"
	@echo "  make prettier-check - Check Prettier formatting only"
	@echo "  make prettier-fix  - Fix Prettier formatting only"
	@echo "  make help          - Show this help message"