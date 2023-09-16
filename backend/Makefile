
.PHONY:

CONTAINER_APP := senryu-app
CONTAINER_DB:= db
SQL_TABLE := senryu

container-up:
	docker-compose up

db-reset:
	docker-compose exec ${CONTAINER_APP} python -m migrate_db

db-test:
	docker-compose exec ${CONTAINER_APP} python -m test

db-show:
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'show tables;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'DESCRIBE results;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'SELECT * FROM results;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'DESCRIBE topics;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'SELECT * FROM topics;'"

db-connect:
	docker-compose exec db bash -c "mysql ${SQL_TABLE}"

build:
	docker-compose build ${CONTAINER_APP}
	docker-compose build ${CONTAINER_DB}

rebuild:
	docker-compose build --no-cache ${CONTAINER_APP}
	docker-compose build --no-cache ${CONTAINER_DB}