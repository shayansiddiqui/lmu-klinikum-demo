# STEP 1 build static website
FROM node:alpine
# Create app directory
WORKDIR /app
COPY . /app/
# Install app dependencies
RUN npm update && npm install -g @angular/cli
RUN cd /app && npm set progress=false && npm install
CMD ["npm", "start"]
