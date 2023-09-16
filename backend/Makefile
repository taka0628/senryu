
.PHONY:

CONTAINER_APP := senryu-app
CONTAINER_DB:= db
SQL_TABLE := senryu

container-up:
	docker-compose up

db-reset:
	docker-compose exec ${CONTAINER_APP} poetry run python -m migrate_db

db-show:
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'show tables;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'DESCRIBE tasks;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'DESCRIBE dones;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'SELECT * FROM tasks;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'SELECT * FROM dones;'"

db-connect:
	docker-compose exec db bash -c "mysql ${SQL_TABLE}"

build:
	docker-compose build ${CONTAINER_APP}
	docker-compose build ${CONTAINER_DB}

rebuild:
	docker-compose build --no-cache ${CONTAINER_APP}
	docker-compose build --no-cache ${CONTAINER_DB}