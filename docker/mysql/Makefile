include .env

build:
	docker build -t mysql .

run:
	docker run -it -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} -v /root/mysqld:/var/run/mysqld -v /root/mysql:/app --name mysql mysql

exec:
	docker exec -it -e MYSQL_PWD=${MYSQL_ROOT_PASSWORD} mysql mysql -h ${MYSQL_ROOT_LINK} -P 3306 -u root
logs:
	docker logs mysql

ps:
	docker ps -a

img:
	docker images

rm:
	docker rm -f $$(docker ps -aq)

rmi:
	docker rmi $$(docker images -q)

