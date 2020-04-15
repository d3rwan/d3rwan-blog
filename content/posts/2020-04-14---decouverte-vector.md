---
title: A la découverte de Vector 
date: "2020-04-14T12:00:00.000Z"
description: Vector est un router de données d'observabilité haute-performance, open-source et écrit en Rust. Un Logstash killer ?      
template: "post"
draft: false
slug: "decouverte-vector"
category: "Dev"
language: 🇫🇷
tags:
  - "Monitoring"
  - "Vector"
  - "Rust"
  - "Logstash"
socialImage: "/media/vector/vector.png"
---

## TL/DR
En 2 briques, `Logstash` ? ETL ! `Rust` ? [Vector](https://vector.dev/) !
On peut effectivement décrire Vector comme un Logstash qu'on aurait réécrit en Rust, avec tous les avantages inhérents au langage (performance, binaire natif), mais les défauts d'une solution encore très jeune (nombre de modules limités, peu de références). 
On notera que la documentation semble plutôt bien faite, et que les composants natifs permettent de gérer beaucoup de use-case simple de monitoring. 
Et comme on peut convenir que Logstash n'est pas le meilleur produit du monde, espérons que Vector trouve sa place dans les prochains mois dans la communauté. 
Et en plus, ca tombe bien, Vector propose nativement des modules équivalents à ceux de Logstash, ce qui fait que la migration ne sera pas compliquée !     

## Après-tout, on a le temps non ? #Confinement

[Vector](https://vector.dev/) se défini comme un routeur de données d'observabilité haute-performance, qui permet la collecte, la transformation et l'envoi d'évênements (logs et/ou métriques).

### Fonctionnement conceptuel
![](/d3rwan-blog/media/vector/concept.png)

Il s'agit basiquement d'un ETL qui s'appuie sur les notions suivantes:
- **Source** (aka. E / Extract)

Récupération des données brutes depuis l'endroit où elles sont produites. 
Par exemple, on pourra [lire les logs dans un fichier](https://vector.dev/docs/reference/sources/file/), [écouter une file Kafka](https://vector.dev/docs/reference/sources/kafka/) ou [récupérer des métriques de StatsD](https://vector.dev/docs/reference/sources/statsd/)

- **Transform** (aka. T / Transform)

Transformation des données brutes, ou du flux complet de données,
Par exemple, on pourra [filtrer des entrées](https://vector.dev/docs/reference/transforms/filter/) ou encore [parser un log selon une expression régulière](https://vector.dev/docs/reference/transforms/regex_parser/) 

- **Sink** (aka. L / Load)

Destination des données lues et transformées. Chaque module enverra les données de manière unitaire ou sous la forme d'un stream en fonction du service cible.
Par exemple, on pourra [sauvegarder les données brutes sous Amazon S3](https://vector.dev/docs/reference/sinks/aws_s3/), les [indexer dans un cluster Elasticsearch](https://vector.dev/docs/reference/sinks/elasticsearch/) ou les [exposer à Prometheus](https://vector.dev/docs/reference/sinks/prometheus/)

### Fonctionnalités

#### Rapide

Ecrit en Rust, Vector est très rapide avec une gestion efficiente de la mémoire. 
Le tout sans runtime, ni garbage collector.

#### Un outil unique, de la source à la destination

Vector propose plusieurs stratégies de déploiement afin de pouvoir être utilisé par tous, quelque-soit le contexte. 

- [Déploiement en tant que Démon](https://vector.dev/docs/setup/deployment/strategies/#daemon)

Ici, on lancera une instance de Vector en tâche de fond pour collecter *toutes* les données du serveur hôte 
![](/d3rwan-blog/media/vector/strategy_daemon.png)

- [Déploiement en tant que Sidecar](https://vector.dev/docs/setup/deployment/strategies/#sidecar)

Dans cette stratégie, on lancera une instance de Vector par service à monitorer.
![](/d3rwan-blog/media/vector/strategy_sidecar.png)

- [Déploiement en tant que Service](https://vector.dev/docs/setup/deployment/strategies/#service)

Ici, Vector est lancé en tant qu'un service dédié. 
![](/d3rwan-blog/media/vector/strategy_service.png)

En utilisant et/ou combinant ces stratégies, on peut donc définir des topologies d'architecture de collecte de données

- [Collecte distribuée](https://vector.dev/docs/setup/deployment/topologies/#distributed)

Dans cette topologie, chaque instance de Vector va directement envoyer les données au(x) service(s) cibles. 
Il s'agit du cas le plus simple, et qui permet de _scaler_ facilement. 
Néanmoins, il peut induire des pertes de performance locales ou de données.
 
![](/d3rwan-blog/media/vector/topology_distributed.png)

- [Collecte Centralisée](https://vector.dev/docs/setup/deployment/topologies/#centralized)

Ici, chaque instance de Vector va envoyer les données à une instance centrale, chargée d'effectuer les opérations les plus coûteuses. 
De fait, moins d'impact sur les performances locales des applicatifs, mais un service centrale en tant que [SPOF](https://fr.wikipedia.org/wiki/Point_de_d%C3%A9faillance_unique)  
![](/d3rwan-blog/media/vector/topology_centralized.png)

- [Collecte Streamée](https://vector.dev/docs/setup/deployment/topologies/#stream-based)

Variante de la topologie précédente, dans laquelle on va rajouter un broker en amont du service centrale afin de supprimer le SPOF.  
Cette topologie est la plus scalable et durable, mais aussi la plus complexe à mettre en place.  

![](/d3rwan-blog/media/vector/topology_stream.png)

#### Simplicité de déploiement

Concu en Rust, Vector se présente donc sous la forme d'un binaire cross-compilé pour l'os cible, et ne nécessite pas de runtime type JVM

## Bon, OK, mais ca marche au moins ?

Pour tester Vector, je vais m'inspirer d'un post précédent : [Une stack ELK from scratch avec Docker](https://d3rwan.github.io/d3rwan-blog/posts/elk-depuis-zero)

![](/d3rwan-blog/media/vector/archi.png)*Architecture de notre POC* 

Dans le cas présent, je vais m'appuyer sur :

- Elasticsearch, comme moteur d’indexation, de recherche & d’analytics,
- Kibana, comme IHM de visualisation et de génération de tableaux de bord interactifs
- Vector, en tant que service central, pour transformer les données et les envoyer vers Elasticsearch,
- Kafka, en tant que broker en amont de ma stack de monitoring
- Vector, en tant qu'agent, pour récupérer les données sources et les envoyer vers Kafka

> On se positionne donc dans la topologie de [Collecte Streamée](https://vector.dev/docs/setup/deployment/topologies/#stream-based) décrite ci-avant

L’ensemble des services et des interactions sont décrites dans un fichier docker-compose.yml:

`gist:d3rwan/13aba18e159c340b2947992bfbb45f81#docker-compose.yml`

Le service central Vector est configuré comme suit:
- Lecture des évênements depuis le broker Kafka
- Parsing du JSON de l'évênement envoyé depuis l'agent Vector
- Parsing Grok (format Logstash) de la ligne de log brute
- Indexation vers Elasticsearch

`gist:d3rwan/13aba18e159c340b2947992bfbb45f81#vector.toml`

Fun fact, il est possible de [tester unitairement la configuration](https://vector.dev/docs/reference/tests/) avec Vector, comme on peut le voir dans la section [[tests]] du fichier

On pourra également noter que chaque step de configuration se base sur au moins un step précédent. 
 

Côté webapp, on ajoute un agent Vector configuré comme suit:
- Lecture des logs depuis un fichier
- Envoi vers le broker Kafka

`gist:d3rwan/13aba18e159c340b2947992bfbb45f81#agent_vector.toml`

> Le projet de test complet est disponible sur github [discovering_vector](https://github.com/d3rwan/discovering_vector)

Il ne me reste qu'à lancer tous mes services

```bash 
 docker-compose build
 docker-compose up
```

Puis me rendre sur ma webapp (dans mon cas, http://localhost:80)
![](/d3rwan-blog/media/elk/joliadmin.png)*Exemple d’application web (source: [https://github.com/sbilly/joli-admin](https://github.com/sbilly/joli-admin))*

Après une rapide navigation, je peux me rendre sur mon IHM Kibana (dans mon cas, http://localhost:5601), puis dans l'onglet `Management` puis `Kibana > Index Patterns`

![](/d3rwan-blog/media/vector/add_index_kibana.png)_Ajout du pattern d'index vector-\*_

Et voilà ! Un index `vector-YYYY.MM.DD` a été crée et contient bien mes logs applicatifs. 
A partir de là, je vais pouvoir créer mes indexs, recherches visualisations, dashboards et autre canvas dans Kibana, et pouvoir utiliser ces informations de monitoring.

Pour conclure, il est effectivement assez facile d'utiliser [Vector](https://vector.dev/) comme remplacant de logtash/beats dans une stack Elastic, et le fait est que ca fonctionne.
Reste à voir sur la durée si les gains de performance annoncé sont réels, et si le projet arrive durablement à s'imposer dans la communauté. 
En attendant, même très jeune, ce projet est plein de promesses et de bonnes idées (tests unitaires, multi-topologies natives, ...), et mérite donc qu'on y jette un oeil!

