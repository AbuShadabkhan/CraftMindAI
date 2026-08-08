# Base image
FROM node:20-alpine

# sharp library ko kuch native dependencies chahiye hoti hain Alpine pe
RUN apk add --no-cache vips-dev

WORKDIR /app

# Pehle sirf package files copy karo — Docker layer caching ke liye
# (agar code change ho but dependencies same rahein, to npm install dubara nahi chalega)
COPY package*.json ./

RUN npm install --production

# Baaki poora server code copy karo
COPY . .

# Temp/tmp folders jo tumhare code mein use ho rahe hain, ensure karo exist karein
RUN mkdir -p temp tmp

EXPOSE 3000

CMD ["node", "server.js"]