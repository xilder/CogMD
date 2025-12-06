FROM node:20-alpine AS client-builder

WORKDIR /app/client

COPY client/package*.json ./

RUN npm ci

COPY client/ ./

ENV NEXT_FONT_GOOGLE_DISABLE_FONT_DOWNLOAD=true

RUN npm run build

FROM python:3.12-slim AS server-builder

WORKDIR /app/server

COPY server/requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt supervisor

COPY server/ ./

RUN find . -type d -name "__pycache__" -exec rm -rf {} +

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get purge -y --auto-remove curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system app \
    && adduser --system --group app

COPY --from=server-builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

COPY --from=server-builder /usr/local/bin/supervisord /usr/local/bin/supervisorctl /usr/local/bin/uvicorn /usr/local/bin/

COPY --from=server-builder /app/server ./server

COPY --from=client-builder /app/client/.next/standalone /app/client-server

COPY --from=client-builder /app/client/.next/static /app/client-server/.next/static

COPY --from=client-builder /app/client/public /app/client-server/public

COPY supervisord.conf /etc/supervisord.conf

RUN find . -type d -name "__pycache__" -exec rm -rf {} +

RUN chown -R app:app /app

USER app

EXPOSE 8000

EXPOSE 3000

CMD ["supervisord", "-c", "/etc/supervisord.conf"]


