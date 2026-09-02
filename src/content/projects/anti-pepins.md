---
title: "Anti-Pépins"
subtitle: "Plateforme IA de lutte contre les arnaques en ligne"
stack: ["Next.js", "Laravel", "Supabase", "REST API", "IA"]
summary: "Une API d'analyse qui évalue automatiquement URLs, emails, numéros et messages pour détecter les tentatives d'arnaque, avant qu'un utilisateur ne clique."
context: "Les arnaques en ligne (phishing, faux support technique, fraude au colis) touchent un public de plus en plus large, souvent démuni face à des messages de plus en plus crédibles. L'objectif : donner à n'importe qui un moyen simple de vérifier un contenu suspect en quelques secondes, sur web comme sur mobile."
challenges: "Combiner rapidité de réponse et fiabilité de détection sans faire reposer tout le système sur un seul modèle : un moteur de règles trop rigide laisse passer les nouvelles arnaques, un LLM seul est trop lent et coûteux à grande échelle, et les données traitées (numéros, emails, messages) sont sensibles."
solution: "Architecture frontend/backend découplée (Next.js côté client, Laravel côté API) avec un moteur d'analyse hybride : règles heuristiques pour les cas connus, LLM pour les cas ambigus ou nouveaux formats d'arnaque. Les données utilisateur sont protégées par des politiques RLS (Row Level Security) au niveau base de données plutôt qu'au niveau applicatif, pour une sécurité qui tient même en cas de bug côté code."
results: "Plateforme compatible web et mobile, capable d'évaluer un contenu en quelques secondes. L'architecture RLS élimine toute une classe de failles de sécurité liées aux oublis de vérification côté application."
featured: true
order: 1
---
