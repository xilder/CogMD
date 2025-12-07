FROM python:3.12-alpine AS builder

WORKDIR /app

RUN apk add --no-cache build-base libffi-dev openssl-dev

COPY server/requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

COPY server .

# ---- Final image ----
FROM python:3.12-alpine

WORKDIR /app

RUN apk add --no-cache libstdc++ supervisor

COPY --from=builder /root/.local /root/.local
COPY server .

ENV PATH=/root/.local/bin:$PATH

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
