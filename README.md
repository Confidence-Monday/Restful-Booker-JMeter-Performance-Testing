# Restful-Booker JMeter Performance Testing

## Project Overview

Performance and load testing suite for the Restful-Booker RESTful API (https://restful-booker.herokuapp.com) using Apache JMeter 5.6.3.

The test suite covers the complete booking lifecycle: Authentication, Create, Get, Full update, Partial update and Delete operations under realistic load conditions.

## Objectives

- Validate API stability under 50 users (GUI) and 200 users (CLI)
- Measure response times, throughput and error rates
- Identify performance bottlenecks and breaking points
- Verify all endpoints meet the 2,000ms SLA threshold

## Tools Used

- Apache JMeter 5.6.3

- JMeter Plugins Manager

- Git / GitHub

## Project Structure
```
JMeter/

├── scripts/

   ├── Restful-Booker Performance Test.jmx
   ├── Restful-Booker-GUI-Light-Test.jmx
   └── Restful-Booker-CLI-Load-Test.jmx

├── data/

   └── booking_data.csv

├── reports/

   ├── GUI/
   └── CLI/
       ├── HTML-Report/
       └── results.jtl

├── screenshots/

   ├── GUI/
   └── CLI/

├── docs/

   └── Restful-Booker-Performance-Test-Report.docx

└── README.md
```

## Prerequisites

 Requirement               | Version

 Java JDK                  | 17 LTS 

 Apache JMeter             | 5.6.3 

 JMeter Plugins Manager    | 1.10+ 

## Setup Instructions

### 1. Install Java
```bash
# Verify Java installation
java -version

### 2. Download JMeter

Direct Download Link (v5.6.3):

Windows/Mac/Linux: https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.zip

### 3. Clone This Repository
```bash
git clone https://github.com/Confidence-Monday/Restful-Booker-JMeter-Performance-Testing.git
cd Restful-Booker-JMeter-Performance-Testing

### 4. Plugins

- Download Plugins Manager

Download Link: https://jmeter-plugins.org/install/Install/

Direct JAR Download: https://jmeter-plugins.org/get/


## 5. Required Plugins Installation

- 3 Basic Graphs
- Custom Thread Groups
- Throughtput Shaping Timer
- PerfMon (Server Agent)
- JSON Plugins

**Execution Steps**

### GUI Light Test (50 Users — Debug/Validate)

- Open JMeter
- File → Open → scripts/Restful-Booker-GUI-Light-Test.jmx
- Run → Start (Ctrl + R)
- Monitor View Results Tree

### CLI Load Test (200 Users — Full Load)
```bash
# Navigate to JMeter bin
cd /path/to/apache-jmeter-5.6.3/bin

# Run load test

jmeter -n -t Restful-Booker-Performance-Test.jmx -l results.jtl -e -o html_report

## Load Testing Scenarios

| Scenario        | Users    | Ramp-up     | Duration        | Mode 
              
| Light/Debug     | 50       | 60s         | 2 loops 	     | GUI 

| Full Load       | 200      | 120s        | 10 min 	     | CLI 

## Endpoints Under Test

| #  | Method | Endpoint      | Auth token 

| 01 | GET    | /ping         | ❌ 

| 02 | POST   | /auth         | ❌

| 03 | GET    | /booking      | ❌ 

| 04 | POST   | /booking      | ❌ 

| 05 | GET    | /booking/{id} | ❌ 

| 06 | PUT    | /booking/{id} | ✅ 

| 07 | PATCH  | /booking/{id} | ✅ 

| 08 | DELETE | /booking/{id} | ✅ 

**Test Results Summary**

### GUI Test — 50 Users

 Metric           | Value 

Total Requests    | 400 

Error Rate        | 0.00% 

Average Response  | 352ms 

Max Response      | 1,475ms 

Throughput        | 1.9/sec 

### CLI Load Test — 200 Users

 Metric           | Value 

Total Requests    | 9,044 

Active Error Rate | 0.03% 

Average Response  | ~300ms 

Peak Throughput   | 41.9/sec 

APDEX Score       | 0.954 


## SLA Validation

 Criterion   | Target     | Actual    | Status 
 
Error Rate   | < 1%       | 0.03%     | ✅ PASS 

Avg Response | < 2000ms   | ~300ms    | ✅ PASS 

Throughput   | > 10/s     | 41.9/s    | ✅ PASS 

APDEX        | > 0.85     | 0.954     | ✅ PASS 


## Report Interpretation Guide

### Summary Report Columns

 Column     | Meaning 

Samples     | Total requests executed 

Average     | Mean response time (ms) 

Error %     | Failed requests percentage 

Throughput  | Requests per second 

### Aggregate Report Percentiles

 Percentile | Meaning 

90% Line    | 90% of requests faster than this 

95% Line    | Main SLA metric 

99% Line    | Worst case scenario 

### APDEX Score Guide

 Score       | Rating 

0.94 - 1.00  | Excellent ✅ 
 
0.85 - 0.93  | Good 

0.70 - 0.84  | Fair 

< 0.70       | Poor ❌ 

## Key Findings

1. API handles 200 concurrent users with 0.03% real error rate

2. Average response time of ~300ms — well within 2,000ms SLA

3. Peak throughput of 41.9 req/sec at full load

4. Health Check shows cold-start latency on Heroku free tier

5. APDEX score of 0.954 — Excellent rating
