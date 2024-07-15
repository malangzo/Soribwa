build:
	 docker build -t mysql .
run:
	 docker run -it -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=${MYSQL_PASSWORD} -v /root/mysqld:/var/run/mysqld -v /root/mysql:/app --name mysql mysql

exec:
	 docker exec -it mysql /bin/bash

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

