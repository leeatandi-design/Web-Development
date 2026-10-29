# Day 8 Reflection

What was the most difficult concept and how did I overcome it?
The most difficult was concurrency and preventing double-booking. I thought `if seat.available then sell` in JS was enough. I learned two requests can pass that check together and sell same seat. I overcame it by learning `SELECT ... FOR UPDATE` which locks the row so second user must wait, and adding `UNIQUE(seat_id)` on order_items as final safety - Postgres rejects second sale even if code bugs. Building QuickNotes and seeing 30 RPS vs 1666 RPS made it click: correctness must be in DB, not just app.

Which part of my capstone would you improve, based on feedback?
Based on feedback, I would improve caching. I cached feed with long TTL and manual invalidation, showing stale data. For TicketHub I fixed it: short 3-5s TTL for seat maps during big sale and always read primary for holds. I would also add queue token system to QuickNotes if viral, because horizontal scaling alone (Q4 answer) is not enough without throttling. And add idempotency keys to API which I missed.

What will you learn next?
Next I want to learn message queues and payment idempotency. Holding seat is easy but handling payment failure without losing seat is hard. I want to learn SQS/Kafka for async payments and Stripe webhooks for exactly-once orders. Also load testing with k6 to simulate 200k big sale and see where design breaks.
