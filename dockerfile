
# Build backend server (node)
FROM node:16-alpine

# Working directory be app
WORKDIR /usr/src/app

COPY package.json .

###  Installing dependencies

RUN yarn install 

# copy local files to app folder
COPY . .

EXPOSE 8000

CMD ["node","server.js"]