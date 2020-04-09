---
title: Hello (new) World
date: "2020-04-09T12:00:00.000Z"
description: Confinement, semaine 3. Et si je refaisais des articles de blog? Et pourquoi pas (enfin) quitter Medium?   
template: "post"
draft: true
slug: "hello-new-world"
category: "Dev"
language: 🇫🇷
tags:
socialImage: "/media/tech-blog.png"
---

## Préambule

Quel jour on est déjà ? Ah, #ConfinementJour24 selon twitter. 
Depuis quelques jours j'ai resenti l'envie de refaire des articles de blog. 

Lors de mes derniers articles, j'avais choisi d'utiliser la plateforme Medium, qui permettait à l'époque facilement de publier du contenu au travers d'une IHM minimaliste, tout en offrant une belle visibilité. 
Depuis, la plateforme a évoluée, et est devenue assez désagréable à utiliser _en tant que lecteur_. Affichage permanent du paywall, obligation de se connecter, _exode_ d'une partie de la communauté tech...   
 
L'alternative du moment, c'est [dev.to](https://dev.to), et ca a l'avantage (ou l'inconvénient) d'être orientée tech, là ou medium se voulait plus généraliste. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">DEV is now open source <a href="https://t.co/05nuBnkbKI">https://t.co/05nuBnkbKI</a></p>&mdash; DEV Community 👩‍💻👨‍💻 (@ThePracticalDev) <a href="https://twitter.com/ThePracticalDev/status/1027239140826460170?ref_src=twsrc%5Etfw">August 8, 2018</a></blockquote> 
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


Néanmoins, on peut se poser la question : est-ce que ce ne serait pas qu'un nouveau medium, qui suivra le même chemin? 
Sans-doute diront certains, néanmoins [dev.to](https://dev.to) propose nativement une fonctionnalité de cross-posting qui permet de publier sur leur site un article que vous auriez publié ailleurs.
On pourrait donc avoir les avantages d'une plateforme en vogue (visibilité, communauté), tout en gardant la propriété de ses données ?
C'est même un concept : [POSSE - Publish on your Own Site, Syndicate ElseWhere](https://indieweb.org/POSSE)

## De medium à un blog maison

J'ai décidé de partir sur [Gatsby](https://www.gatsbyjs.org/), un générateur de site statique basé sur ReactJS et GraphQL. 
Gatsby se base d'une part sur des composants React affichant la structure du blog, et permet d'autre part de parser des fichers markdown qui correspondent aux articles de blog.

Par ailleurs, la fonctionnalité Github Pages permet d'exposer un site statique.
 
1. Récupérer mes anciens articles sur medium.

Pour cela, j'ai utilisé le projet [mediumexporter](https://www.npmjs.com/package/mediumexporter) qui permet automatique de parser un article en markdown depuis son url publique.    
Il a fallu néanmoins une seconde passe de nettoyage du markdown généré, notamment pour remplacer les medias importés dans medium (image, tweets ou gist).

2. Bootstraper un blog avec Gatsby

Rien de plus simple, il existe un tas de boilerplate sur Github, parmis lesquels celui de Dan Abramov [overreacted.io](https://github.com/gaearon/overreacted.io), le créateur de Redux.

Le plus simple est cependant de se baser sur le starter officiel [gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) qui explique le mode opératoire pas à pas. 

3. Publier sur Github Pages

Là encore, la [documentation officielle](https://www.gatsbyjs.org/docs/how-gatsby-works-with-github-pages/#deploying-to-a-path-on-github-pages) est bien faite et explique le fonctionnement pas à pas.

## D'un blog maison à Dev.to

[TBC] 