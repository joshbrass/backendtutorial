#Use an official node js runtime as a parent image

FROM node:22-alphine


# se the working directory in the container
WORKDIR /app

# copy thr package.json and the package-lock.json files to the container

COPY package*.json .

#install the dependency

RUN npm install

#copy the rest of the application code

COPY . .

# expose the port that the app runs on
EXPOSE 3000

#DEFINE THE COMMAND TO RUN YOUR APPLICATION

CMD ['node' "./src/server.js"]