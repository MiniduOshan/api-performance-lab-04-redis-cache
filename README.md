# API Performance Lab 04 - Redis Cache

This lab compares an API that reads directly from MySQL with the same API backed by Redis caching.

The goal is to show how caching reduces repeated database work and improves response time under load.

## What Is Included

- `no-cache/` - Express API that queries MySQL on every request
- `redis-cache/` - Express API that checks Redis before hitting MySQL
- `k6-test/` - load test used to compare both versions
- `results/` - sample benchmark output from both runs

## Stack

- Node.js
- Express.js
- MySQL
- Redis
- Docker
- k6

## Request Flow

No cache:

```text
Request -> API -> MySQL -> Response
```

Redis cache:

```text
Request -> API -> Redis -> Response
Request -> API -> MySQL -> Response
```

The first Redis request may fall back to MySQL. Later requests can be served from memory until the cache expires.

## Prerequisites

Install and run the following before testing:

- Node.js
- MySQL
- Docker Desktop
- k6

## Database

Both servers query the same MySQL database:

```text
perfo_lab_03
```

The `products` table must exist, and the query expects rows with `category = 'Laptop'`.

## Run MySQL

Start your MySQL service first. If you are using XAMPP, make sure Apache and MySQL are running.

## Run Redis

Start Redis in Docker:

```bash
docker run -d -p 6379:6379 redis
```

Verify the container is running:

```bash
docker ps
```

## Run the No-Cache API

From the project root:

```bash
cd no-cache
npm install
node server.js
```

The server listens on port `3000`.

Test it in a browser or with curl:

```text
http://localhost:3000/products
```

## Run the Redis-Cache API

In a second terminal:

```bash
cd redis-cache
npm install
node server.js
```

The server listens on port `3001`.

Test it here:

```text
http://localhost:3001/products
```

This version checks Redis first and stores successful database responses with a 10-second TTL.

## Run the k6 Benchmark

The test script sends repeated requests to one API endpoint at a time.

No-cache run:

```bash
cd k6-test
k6 run load-test.js > ../results/no-cache.txt
```

Redis-cache run:

```bash
cd k6-test
k6 run load-test.js > ../results/redis-cache.txt
```

If you want to compare both APIs manually, update the URL inside `k6-test/load-test.js` before each run.

## Sample Results

| Version | Avg Latency | p95 Latency | Throughput | Failed Requests |
| --- | ---: | ---: | ---: | ---: |
| No Cache | 18.46ms | 24.77ms | 2699 req/s | 0% |
| Redis Cache | 13.82ms | 22.33ms | 3603 req/s | 0% |

## Why Redis Helped

The no-cache API queries MySQL for every request, even when the data is the same.

The Redis version serves repeated requests from memory, which avoids extra database work and lowers response time.

That is why the cached version shows better throughput and lower average latency.

## Takeaway

Caching is useful when the same data is requested frequently and the backend should stay responsive under load.

Redis is a good fit for short-lived, repeatable reads where speed matters more than always hitting the database.
