# Day 7 - Scaling Plan for SnapShare

## 1. Assumptions
- Total registered users: 10,000,000
- Daily Active Users (DAU): 10% = 1,000,000 users/day
- Per active user: 1 upload/day, 50 feed pages/day
- Average photo: 2 MB + 50 KB thumbnail = 2.05 MB total
- Thumbnail generation is CPU-heavy, done async
- 1 day = 86,400 seconds
- Peak traffic = 5x average

DAU = 10,000,000 * 0.10 = 1,000,000

## 2. Estimates

Uploads per second:
Total/day = 1,000,000 * 1 = 1,000,000
Average = 1,000,000 / 86,400 = 11.57/sec
Peak = 57.9 ~ 58/sec

Feed views per second:
Total/day = 1,000,000 * 50 = 50,000,000
Average = 50,000,000 / 86,400 = 578.7 ~ 579 RPS
Peak = 2,893.5 ~ 2,894 RPS

Storage per year:
Per day = 1,000,000 * 2 MB = 2 TB/day (2.05 TB with thumbs)
Per year = 2 TB * 365 = 730 TB/year (748 TB with thumbs ~0.73 PB/year)

## 3. Read-heavy vs Write-heavy
READ-HEAVY 50:1. Optimize reads: CDN for photos, cache for feed, read replica. Writes can be queued.

## 4. Why not store photos inside DB?
DB for small structured rows, not multi-MB blobs. Bloats tables, slows backup, fills buffer pool.
Use Object Storage S3/GCS, only metadata (photo_id, user_id, s3_url, thumb_url, created_at) in DB.

## 5. Architecture Diagram
Client -> CDN -> Load Balancer -> App Servers (N) -> Cache Redis / Primary DB + Read Replica / Object Storage S3 / Queue + Worker

## 6. Component Roles
- CDN: Caches photos at edge close to users, reduces latency
- Load Balancer: Distributes requests across healthy servers
- App Servers: Stateless API logic, auth, feed assembly
- Cache Redis: Stores hot feeds in memory, avoids DB hits
- Primary DB + Read Replica: Primary writes, replica handles most reads
- Object Storage S3: Durable storage for originals and thumbs
- Queue + Worker: Async thumbnail generation decoupled from upload

## 7. Upload Flow
1. POST /upload/init auth
2. App generates pre-signed S3 URL
3. Client uploads directly to S3
4. POST /upload/complete {photo_id}
5. Write metadata to Primary DB status=processing
6. Enqueue job
7. Return 202 Accepted
8. Worker downloads, resizes thumb
9. Uploads thumb to S3
10. Updates DB thumbnail_url status=ready
11. Invalidates cache

## 8. Trade-offs
1. Cache Consistency vs Speed: Cache fast but stale, use eventual consistency, read-your-own-writes
2. Sync vs Async Thumbs: Async fast retryable but complex, choose async
3. Replica Lag vs Scalability: Replica scales reads cheaply but lags 10-100ms, mitigation read from primary for own recent uploads
