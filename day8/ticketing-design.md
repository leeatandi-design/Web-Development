# TicketHub - Event Ticketing System Design

## 1. Requirements

Functional: Browse events, View seat map, Hold seat 10min, Purchase ticket, View my tickets, Admin create event
Non-Functional: Correctness (never double-book), Speed P95 <300ms normal / <1s big sale, Fairness (queue token + max 6 per user), Scalability 2M users / 200k burst, Availability 99.9%

## 2. Estimates

Normal: 50k \*10 =500k views/day=6 RPS avg=30 RPS peak, 5k tickets=0.23 RPS write
Big Sale: 200k/600s=333 RPS holds, burst 2000 RPS, 1M views in 10min=1666 RPS reads
Comparison: 55x read, 150-1000x write vs normal. Bottleneck is lock contention on 20k seats, not storage.

## 3. API Design (6 endpoints)

GET /events?search=&city=&page=
GET /events/{id}
GET /events/{id}/seats?status=available
POST /holds {event_id, seat_ids, idempotency_key} -> 201 hold_id, 409 conflict
POST /orders {hold_id, payment_token} -> 201 order_id + qr_code, 410 expired
GET /me/tickets

## 4. Data Model (5 tables)

users(id PK, email UNIQUE, password_hash) 1->many orders
events(id PK, name, date, on_sale_at, total_seats 20000)
seats(id PK, event_id FK, row, number, tier, price, status available/held/sold, held_by, expires_at, UNIQUE(event_id,row,number)) Index (event_id,status)
holds(id PK UUID, user_id, seat_id FK, expires_at +10min, UNIQUE(seat_id) WHERE active)
orders(id PK, user_id FK, hold_id UNIQUE, total) + order_items(id PK, order_id FK, seat_id FK UNIQUE - prevents double sell, qr_code)

## 5. Double-Booking Prevention

BEGIN; SELECT \* FROM seats WHERE id IN (...) AND status='available' FOR UPDATE; -- lock
UPDATE seats SET status='held' WHERE ...; INSERT holds; COMMIT;
Other transaction waits, then sees held -> 409. Plus UNIQUE(seat_id) on order_items - DB rejects second sale even if app fails. Plus idempotency + expiry worker.

## 6. Architecture

CDN cache 5s seat map -> WAF/Rate Limiter + Queue token (200k -> 500 concurrent) -> ALB -> 10 app servers (horizontal scaling) -> Redis (cache + rate limit) + Postgres Primary+Replica (row locks + UNIQUE) + Queue Worker expire holds every 60s + Stripe payment
Survives because reads from CDN/Redis, writes throttled, DB constraints guarantee correctness.

## 7. Trade-offs

1. Pessimistic FOR UPDATE vs Optimistic version: Pessimistic better for high contention 200k->20k (optimistic would 90% retries), cost deadlock if order not sorted -> fix sort ASC.
2. Short TTL 3s vs Strong Consistency: Short TTL reduces DB 55x but shows stale available -> user gets 409, acceptable vs DB crash. Holds always read Primary.
3. Queue Fairness vs Latency: Queue adds wait but prevents crash and bot unfairness.
