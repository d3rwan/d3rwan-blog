---
title: An ELK stack from scratch, with Docker
date: "2016-09-28T14:00:00.000Z"
description: Or how to deploy a complete monitoring architecture in few minutes
template: "post"
draft: false
slug: "elk-from-scratch"
category: "Dev"
language: 🇬🇧
tags:
  - "Monitoring"
  - "ELK"
  - "Elasticsearch"
  - "Kibana"
  - "Logstash"
  - "Redis"
  - "Docker"
  - "Architecture"
socialImage: "/media/elk/response.png"
---

Or how to deploy a complete monitoring architecture in few minutes.

## Monitor.

In few years, monitoring has become an indispensable activity in the IT world. Technical or functional, whether it provides metrics, charts, or other KPIs, monitoring its system has become a must-have.

In the rest of the article, we will learn how to deploy a monitoring architecture from scratch, in few minutes, thanks to Docker.

## The stack.

First off, we will use the ELK stack, which has become in a few years a credible alternative to other monitoring solutions (Splunk, SAAS …).

It is based on the following software:

* **E** as *Elasticsearch*, search engine which provide full text search & analytics,

* **L** as *Logstash*, an ETL for retrieving data from heterogeneous sources, transforming them and sending them to *Elasticsearch*,

* **K** as *Kibana*, which provide an UI for exploring data, and create interactive dashboards

But also :

* **R** as *Redis, *an upstream broker which will serve as buffer in case of latency of the system, while avoiding excessive congestion in case of a peak,

* **C** as *Curator*, a tool to manage our index

* **B **as *Beats*, client-side agent to send the logs/metrics to our stack

![The complete architecture](/d3rwan-blog/media/elk/stack-elk.jpeg)*The complete architecture*

## Deploy.

We will use Docker containers for each stack component.

* [Elasticsearch](https://hub.docker.com/_/elasticsearch/) (5.1.2),

* [Logstash](https://hub.docker.com/_/logstash/) (5.1.2),

* [Kibana](https://hub.docker.com/_/kibana/) (5.1.2),

* [Redis](https://hub.docker.com/_/redis/) (3.2.6),

* [Curator](https://hub.docker.com/r/bobrik/curator/) (4.0.4)

Services and interactions are described in a docker-compose.yml file:

`gist:d3rwan/66311cf71c8398aae0be32e47f270bab#docker-compose.yml`

A viable configuration is also available on my github account : [docker_elk_stack](https://github.com/d3rwan/docker_elk_stack).

## Hello, world.

Based on this repository, we will deploy a functional stack:

    # clone repo & build images
    git clone [https://github.com/d3rwan/docker_elk_stack](https://github.com/d3rwan/docker_elk_stack)
    cd docker_elk_stack
    docker-compose build

    # run (daemon)
    docker-compose up -d

    # show logs
    docker-compose logs

After startup, you should be able to access Kibana (port 5601).

Then, we will deploy a basic example web app (NGinx serving HTML + Filebeat agent to send log in our stack)

    # build image
    docker build ./webapp -t dockerelkstack_webapp

    # run (daemon)
    docker run --network dockerelkstack_logging --link redis:redis -p 80:80 -d --name webapp dockerelkstack_webapp

    # show logs
    docker logs webapp

After startup, you should be able to access the web app (port 80).

![Example web app capture (source: [https://github.com/sbilly/joli-admin](https://github.com/sbilly/joli-admin))](/d3rwan-blog/media/elk/joliadmin.png)*Example web app capture (source: [https://github.com/sbilly/joli-admin](https://github.com/sbilly/joli-admin))*

After few minutes browsing, returning to Kibana. An index (*logstash-**) is now available.

![Kibana: Index pattern configuration screen (here, logstash-* index is available)](/d3rwan-blog/media/elk/configure-pattern.png)*Kibana: Index pattern configuration screen (here, logstash-* index is available)*

After creating index, we can now exploring our web app logs (Discover tab), create visualizations (Visualize tab) and dashboards (Dashboard tab).

![Kibana: Exploring the raw logs](/d3rwan-blog/media/elk/response.png)*Kibana: Exploring the raw logs*

![Kibana: Analytic dashboard](/d3rwan-blog/media/elk/analytics.png)*Kibana: Analytic dashboard*

And… voilà! In just few minutes, we set up, an operational monitoring stack.
