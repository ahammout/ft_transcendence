
up:
	docker-compose -f docker-compose.yml up

stop:
	docker stop $(shell docker ps -qa)

show:
	docker images
	docker ps
	docker volume ls
	docker network ls

clean: stop
	docker rm $(shell docker ps -qa)
	docker system prune -f

fclean: clean
	docker volume rm $(shell docker volume ls -q)
	docker rmi -f $(shell docker images -q)

re: fclean up

