FROM node:18

WORKDIR /app
EXPOSE 9778
EXPOSE 4200

RUN npm i -g @angular/cli


ENTRYPOINT [ "/app/frontend_commands.sh"]