---
title: Discovering Vector 
date: "2020-04-15T12:00:00.000Z"
description: Vector is a high-performance and open-source observability data router build in Rust. A Logstash killer?      
template: "post"
draft: false
slug: "discovering-vector"
category: "Dev"
language: 🇬🇧
tags:
  - "Monitoring"
  - "Vector"
  - "Rust"
  - "Logstash"
socialImage: "/d3rwan-blog/media/vector/vector.png"
---

## TL/DR
`Logstash` + `Rust` = [Vector](https://vector.dev/) ?

We can actually describe Vector as a Logstash built in Rust, with all the language's advantages for free (high performance, cross-compilation), but the flaws of a still young product (few modules, no known references). Note that the documentation seems well done, and the first existing modules allow you to manage a lot of simple monitoring use-case. As we can agree that Logstash is not the best product in the world, let's hope that Vector will find its place in the community in the coming months. In addition, Vector natively offers modules equivalent to the Logstash's one, which means that the migration will not be complicated!

## And so what ? We have time, right ? #LockedDown 

[Vector](https://vector.dev/) could be defined as an high-performance observability data router that makes transforming, collecting, and sending events (logs & metrics) easy.

### Concept
![](/d3rwan-blog/media/vector/concept.png)

Basically, it's an ETL based on the following concepts:
- **Source** (aka. E / Extract)

Reading raw data from the source. 
For example, we could [read log into a file](https://vector.dev/docs/reference/sources/file/), [listen a Kafka topic](https://vector.dev/docs/reference/sources/kafka/) or [get StatsD metrics](https://vector.dev/docs/reference/sources/statsd/)

- **Transform** (aka. T / Transform)

Transform raw data, or complete data stream.
For example, we could [filter entries](https://vector.dev/docs/reference/transforms/filter/) or [parse a log using a regular expression](https://vector.dev/docs/reference/transforms/regex_parser/) 

- **Sink** (aka. L / Load)

Destination for events. Each module's transmission method is dictated by the downstream service it is interacting with (ie. individual events, bulk or stream). For example, we could [save raw data into Amazon S3](https://vector.dev/docs/reference/sinks/aws_s3/), [indexing them into Elasticsearch](https://vector.dev/docs/reference/sinks/elasticsearch/) or [expose to Prometheus](https://vector.dev/docs/reference/sinks/prometheus/)

### Features

#### Fast

Built in Rust, Vector is fast and memory-efficient, all without runtime or garbage collector 

#### One only tool, from source to destination

Vector is designed to be used by everyone, whatever the context, by offering several deployment strategies:

- [Daemon](https://vector.dev/docs/setup/deployment/strategies/#daemon)

In this case, it serves as serves as an light-weight agent by running in the background, in its own process, for collecting all data for that host.  
![](/d3rwan-blog/media/vector/strategy_daemon.png)

- [Sidecar](https://vector.dev/docs/setup/deployment/strategies/#sidecar)

Here, it serves also an an agent, but we will have one process by service.
![](/d3rwan-blog/media/vector/strategy_sidecar.png)

- [Service](https://vector.dev/docs/setup/deployment/strategies/#service)

In ths case, Vector is a separate service designed to receive data from an upstream source and fan-out to one or more destinations. 
![](/d3rwan-blog/media/vector/strategy_service.png)

By using and/or combining theses strategies, we can define several architecture topologies to collect our data.

- [Distributed](https://vector.dev/docs/setup/deployment/topologies/#distributed)

In this topology, each Vector instance will directly send data to downstream services. It's the simplest topology, and it will easily scale with our architecture. However, it can impact local performance or lead to data losses. 
![](/d3rwan-blog/media/vector/topology_distributed.png)

- [Centralized](https://vector.dev/docs/setup/deployment/topologies/#centralized)

Here, each agent will send data to a dedicated centralized Vector instance, which will responsible to do the most expensive operations. So, it's more efficient for client nodes, but a dedicated centralized service as a SPOF which could lead to data losses.
![](/d3rwan-blog/media/vector/topology_centralized.png)

- [Stream based](https://vector.dev/docs/setup/deployment/topologies/#stream-based)

Variant of the previous topology, in which we will add a broker upstream of the centralized service in order to remove the SPOF. This topology is the most scalable and reliable, but also the most complex and expensive.
![](/d3rwan-blog/media/vector/topology_stream.png)

#### Easy deployment

Built with Rust, Vector cross-compiles to a single static binary without any runtime. 

## Well, but does it really works ? 

I will be inspired by a previous blog post : [An ELK stack from scratch, with Docker](https://d3rwan.github.io/d3rwan-blog/posts/elk-from-scratch)

![](/d3rwan-blog/media/vector/archi.png)*Proof of concept architecture* 

In this case, we will use:

- Elasticsearch, search engine which provide full text search & analytics,
- Kibana, which provide an UI for exploring data, and create interactive dashboards
- Vector, as central service, to transform events and sending them to Elasticsearch,
- Kafka, as an upstream broker
- Vector, as an agent, to ingest raw source data and sending them to Kafka

> So here, we are under a [Stream based topology](https://vector.dev/docs/setup/deployment/topologies/#stream-based)

Services and interactions are described in a docker-compose.yml file:

`gist:d3rwan/13aba18e159c340b2947992bfbb45f81#docker-compose.yml`

The Vector central service is configured as below:
- Reading events from Kafka
- JSON Parsing from events send by Vector agent
- Grok Parsing (same as Logstash Grok format) from raw log line
- Indexing into Elasticsearch

`gist:d3rwan/13aba18e159c340b2947992bfbb45f81#vector.toml`

Fun fact, we can [unit testing our configuration](https://vector.dev/docs/reference/tests/), as we can see in the [[tests]] section.

Note that each configuration step is based on at least one previous step. 
 

On our webapp side, we will have an Vector agent configured as below:
- Reading logs from file
- Sending them to Kafka

`gist:d3rwan/13aba18e159c340b2947992bfbb45f81#agent_vector.toml`

> Complete projet is available on github [discovering_vector](https://github.com/d3rwan/discovering_vector)

Now, I can start all my services with docker-compose:

```bash 
 docker-compose build
 docker-compose up
```

Then, you should be able to access the web app (http://localhost:80, in my case)
![](/d3rwan-blog/media/elk/joliadmin.png)*Web Application example (source: [https://github.com/sbilly/joli-admin](https://github.com/sbilly/joli-admin))*

After few minutes browsing, you can go to Kibana UI. (in my case, http://localhost:5601), then click on `Management` tab, then `Kibana > Index Patterns`

![](/d3rwan-blog/media/vector/add_index_kibana.png)_Adding vector-\* index pattern_

Here we go ! A `vector-YYYY.MM.DD` index should be created with my application logs. 
From there, I will be able to create my searchs, visualizations, dashboards or canvas in Kibana, and use all theses informations. 

To conclude, it's actually quite easy to use [Vector](https://vector.dev/) as a substitute for Logstash/Beats in an Elastic stack, and it works. 
Remains to see if performance gains are real, and if the project can resist in the future and become a real alternative for the community.
Until then, even very young, this project is full of promises and good ideas (unit tests, multi-topologies, ...), and so deserves that we take a look! 
