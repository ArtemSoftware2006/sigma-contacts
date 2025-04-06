LOCAL_BIN:=$(CURDIR)/bin

run:
	docker compose up --build

stop:
	docker compose down