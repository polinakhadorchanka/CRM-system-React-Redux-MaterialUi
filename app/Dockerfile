FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV config "Server=DBServer1,50100;Initial Catalog=BORODICH;User Id=nodejs@DBServer1;Password=nodejs;"

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["sh", "-c", "node app.js \"${config}\""]