---
title: Une stack ELK from scratch avec Docker
date: "2016-09-28T12:00:00.000Z"
description: Ou comment déployer une architecture de monitoring en quelques minutes
template: "post"
draft: false
slug: "elk-depuis-zero"
category: "Dev"
language: 🇫🇷
tags:
  - "Monitoring"
  - "ELK"
  - "Elasticsearch"
  - "Kibana"
socialImage: "/d3rwan-blog/media/elk/logo.jpeg"
---

Ou comment déployer une architecture de monitoring en quelques minutes.

## ***Mo-ni-to-rer.***

En quelques années, le monitoring est devenu une activité indispensable dans le monde de l’IT. Qu’il soit technique ou fonctionnel, qu’il fournisse des métriques, charts, ou autres KPI, le monitoring de son système est devenu un must-have.

Dans la suite de l’article, nous allons voir comment déployer une architecture de monitoring à partir de zéro, en quelques minutes, grâce à Docker.

## La stack.

Pour commencer, nous nous appuyerons sur la stack ***ELK*** qui, en quelques années, est devenue une alternative crédible aux autres solutions de monitoring (Splunk, solutions SAAS…).

Elle se compose des éléments suivants:

* **E** comme *Elasticsearch*, le moteur d’indexation, de recherche & d’analytics,

* **L** comme *Logstash*, un ETL permettant de récupérer les données dans des sources hétérogènes, les transformer et les envoyer vers Elasticsearch,

* **K** comme *Kibana*, un IHM de visualisation et de générations de tableaux de bord interactifs

Nous ajouterons également :

* **R** comme *Redis, *utilisé comme broker en amont, qui servira de buffer en cas de latence du système, tout en évitant un engorgement trop important en cas de pic,

* **C** comme *Curator*, un outil de management des indexs

* **B **comme *Beats*, sondes à installer côté client afin d’envoyer les logs/métriques à notre stack

![Stack de monitoring](/media/elk/stack-elk.jpeg)*Notre stack de monitoring*

## ***Déploiement.***

Nous utiliserons des conteneurs Docker pour chacun des composants de notre stack.

* [Elasticsearch](https://hub.docker.com/_/elasticsearch/), dans sa version 5.1.2,

* [Logstash](https://hub.docker.com/_/logstash/), dans sa version 5.1.2,

* [Kibana](https://hub.docker.com/_/kibana/), dans sa version 5.1.2,

* [Redis](https://hub.docker.com/_/redis/), dans sa version 3.2.6,

* [Curator](https://hub.docker.com/r/bobrik/curator/), dans sa version 4.0.4

L’ensemble des services et des interactions sont décrites dans un fichier docker-compose.yml:

`gist:d3rwan/66311cf71c8398aae0be32e47f270bab#docker-compose.yml`

Pour chacun des services, on va définir si besoin les ports à exposer ou les volumes à utiliser (notamment les fichiers de configuration). Un exemple de configuration viable est disponible sur mon compte github : [docker\_elk\_stack](https://github.com/d3rwan/docker_elk_stack).

## Hello, world

En se basant sur ce repository, nous allons déployer une stack fonctionnelle:

    # clone repo & build images
    git clone [https://github.com/d3rwan/docker_elk_stack](https://github.com/d3rwan/docker_elk_stack)
    cd docker_elk_stack
    docker-compose build

    # run (daemon)
    docker-compose up -d

    # show logs
    docker-compose logs

Une fois les différents composants démarrés, vous devriez pouvoir accéder à l’interface Kibana (port 5601).

Puis nous allons lancer un example d’application web (site HTML statique exposé par Nginx, ainsi qu’une sonde FileBeat permettant l’envoi des logs vers notre stack ELK)

    # build image
    docker build /media/elk/webapp -t dockerelkstack_webapp

    # run (daemon)
    docker run --network dockerelkstack_logging --link redis:redis -p 80:80 -d --name webapp dockerelkstack_webapp

    # show logs
    docker logs webapp

Une fois notre composant démarré, vous devriez pouvoir accéder à l’application web (port 80).

![Exemple d’application web](/media/elk/joliadmin.png)*Exemple d’application web (source: [https://github.com/sbilly/joli-admin](https://github.com/sbilly/joli-admin))*

Après avoir navigué quelques minutes, en retournant sur l’IHM de Kibana, un index *logstash *est à présent disponible.

![Configuration pattern d'index](/media/elk/configure-pattern.png)*Kibana : écran de configuration d’un pattern d’index (ici, l’index logstash est détecté)*

Après avoir crée notre pattern d’index, nous pouvons à présent naviguer dans les logs de notre application web (onglet *Discover*), créer des visualisations (onglet *Visualize*) et des tableaux de bord (onglet *Dashboard*)

![Kibana: données brutes](/media/elk/response.png)*Kibana: Visualisation brute des logs de notre application web*

![Kibana: tableau de bord analytique](/media/elk/analytics.png)*Kibana: Tableau de bord analytique*

And… voilà! Nous avons donc mis en place, en quelques minutes seulement, une stack de supervision opérationnelle.
