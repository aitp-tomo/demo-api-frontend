FROM node:20

RUN apt-get update && apt-get install -y locales \
    && locale-gen en_US.UTF-8 \
    && localedef -i en_US -f UTF-8 en_US.UTF-8 \
    && echo "export LC_ALL=en_US.UTF-8" >> ~/.bashrc \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

COPY ./app /app

WORKDIR /app

RUN npm install \
    && npm run build

ENV PORT 80

CMD ["npx", "serve", "-s", "build" ] 

RUN apt-get install -y \
    wget \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*