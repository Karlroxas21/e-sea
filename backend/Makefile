SOLUTION := api.slnx
ENTRYPOINT := api/Entrypoint

.PHONY: build run watch restore test format format-check db-up db-down migration

build:
	dotnet build $(SOLUTION)

run:
	dotnet run --project $(ENTRYPOINT)

watch:
	dotnet watch --project $(ENTRYPOINT) run

restore:
	dotnet restore $(SOLUTION)

test:
	dotnet test $(SOLUTION) --verbosity normal

format:
	dotnet format $(SOLUTION)

format-check:
	dotnet format $(SOLUTION) --verify-no-changes --verbosity diagnostic

db-up:
	docker compose --profile dev up -d mssql

db-down:
	docker compose --profile dev down

docker-build:
	docker compose --profile dev build

up:
	docker compose --profile dev up -d

migration:
	@[ -n "$(name)" ] || (echo "Usage: make migration name=<MigrationName>" && exit 1)
	dotnet ef migrations add $(name) --project api/Infrastructure --startup-project $(ENTRYPOINT)

migrate:
	dotnet ef database update --project api/Infrastructure --startup-project $(ENTRYPOINT)
	

