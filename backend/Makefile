
.PHONY:

CONTAINER := senryu-app
SQL_TABLE := senryu

container-up:
	docker-compose up

db-reset:
	docker-compose exec ${CONTAINER} poetry run python -m migrate_db

db-show:
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'show tables;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'DESCRIBE tasks;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'DESCRIBE dones;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'SELECT * FROM tasks;'"
	docker-compose exec db bash -c "mysql ${SQL_TABLE} -e 'SELECT * FROM dones;'"

db-connect:
	docker-compose exec db bash -c "mysql ${SQL_TABLE}"

test:
	docker-compose run --entrypoint "poetry run pytest" ${CONTAINER}