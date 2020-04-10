---
title: Hello, new world - De Medium à Dev.to
date: "2020-04-10T12:00:00.000Z"
description: Confinement, semaine 4. Et si je refaisais des articles de blog? Et pourquoi pas en profiter pour quitter Medium?    
template: "post"
draft: false
slug: "hello-new-world"
category: "Dev"
language: 🇫🇷
tags:
  - "Blogging"
socialImage: "/media/tech-blog.jpg"
---

## Préambule

Quel jour on est déjà ? Ah, #ConfinementJour25 selon Twitter. 
Depuis quelques jours j'ai ressenti l'envie de refaire des articles de blog. 

Lors de mes derniers articles, j'avais choisi d'utiliser la plateforme [Medium](https://medium.com), qui permettait à l'époque facilement de publier du contenu au travers d'une IHM minimaliste, tout en offrant une belle visibilité. 
Depuis, la plateforme a évoluée, et est devenue assez désagréable à utiliser _en tant que lecteur_. Affichage permanent du paywall, obligation de se connecter, _exode_ d'une partie de la communauté tech...   
 
L'alternative du moment, c'est [dev.to](https://dev.to), et ca a l'avantage (ou l'inconvénient) d'être orientée tech, là ou [medium](https://medium.com) se voulait plus généraliste. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">DEV is now open source <a href="https://t.co/05nuBnkbKI">https://t.co/05nuBnkbKI</a></p>&mdash; DEV Community 👩‍💻👨‍💻 (@ThePracticalDev) <a href="https://twitter.com/ThePracticalDev/status/1027239140826460170?ref_src=twsrc%5Etfw">August 8, 2018</a></blockquote> 
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


Néanmoins, on peut se poser la question : est-ce que ce ne serait pas qu'un nouveau [medium](https://medium.com), qui suivra le même chemin? 
Sans-doute diront certains, néanmoins [dev.to](https://dev.to) propose nativement une fonctionnalité de cross-posting qui permet de publier sur leur site un article que vous auriez publié ailleurs.
On pourrait donc avoir les avantages d'une plateforme en vogue (visibilité, communauté), tout en gardant la propriété de ses données ?
C'est même un concept : [POSSE - Publish on your Own Site, Syndicate ElseWhere](https://indieweb.org/POSSE)

## De medium à un blog maison

J'ai décidé de partir sur [Gatsby](https://www.gatsbyjs.org/), un générateur de site statique basé sur ReactJS et GraphQL. 
Gatsby se base d'une part sur des composants React affichant la structure du blog, et permet d'autre part de parser des fichers markdown qui correspondent aux articles de blog.

Par ailleurs, la fonctionnalité Github Pages permet d'exposer un site statique.
 
1. Récupérer mes anciens articles sur [medium](https://medium.com).

Pour cela, j'ai utilisé le projet [mediumexporter](https://www.npmjs.com/package/mediumexporter) qui permet automatique de parser un article en markdown depuis son url publique.    
Il a fallu néanmoins une seconde passe de nettoyage du markdown généré, notamment pour remplacer les medias importés dans [medium](https://medium.com) (image, tweets ou gist).

2. Bootstraper un blog avec Gatsby

Rien de plus simple, il existe un tas de boilerplate sur Github, parmis lesquels celui de Dan Abramov [overreacted.io](https://github.com/gaearon/overreacted.io), le créateur de Redux.

Le plus simple est cependant de se baser sur le starter officiel [gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) qui explique le mode opératoire pas à pas. 

3. Publier sur Github Pages

Là encore, la [documentation officielle](https://www.gatsbyjs.org/docs/how-gatsby-works-with-github-pages/#deploying-to-a-path-on-github-pages) est bien faite et explique le fonctionnement pas à pas.

En 2 mots, dans mon cas, depuis mon repository Github, en allant dans le menu `Settings`, dans la section `GitHub Pages`, je choisi la branche dans laquelle est versionnée la version générée du blog
 
![](/d3rwan-blog/media/hello-new-world/gh-pages.png)*Configuration de Github Pages*

A noter que la branche `gh-pages` est la branche par défaut lors de l'utilisation du plugin [gh-pages](https://www.npmjs.com/package/gh-pages)

## D'un blog maison à Dev.to

Là encore, rien de très compliqué.  
Une fois son compte crée, il suffit de configurer son alimentation par un flux RSS. 

Pour cela, se rendre dans le menu `Settings > Publishing from RSS`, puis y renseigner l'url du flux RSS généré par son blog personnel (par défaut, un blog Gatsby aura généré un fichier `rss.xml` à la racine)

![](/d3rwan-blog/media/hello-new-world/rss-dev.png)*Configuration de l'alimentation par flux RSS*

A partir de là, tous les articles de votre blog vont être importés dans [dev.to](https://dev.to), et seront visible depuis le menu `dashboard`. 
Par défaut, les articles sont importés en mode `draft`, ce qui vous laissera le soin de valider la bonne importation, et éventuellement corriger les éventuelles différences. 
Par exemple, dans le cas d'import d'un tweet ou d'un gist, il existe [une syntaxe particulière](https://dev.to/p/editor_guide) qu'il faudra adapter pour un rendu optimal.

![](/d3rwan-blog/media/hello-new-world/frontmatter.png)*Edition d'un post depuis [dev.to](https://dev.to)*

Dernier point important, verifier que le champ `canonical_url` dans la configuration de votre post se réfère bien au post original sur votre blog. 

Et voila, en quelques heures, j'ai pu récupérer le contenu des mes anciens posts, créer et déployer un blog personnel pour les publier, et les syndiquer sur [dev.to](https://dev.to). 

Hello, new world. 