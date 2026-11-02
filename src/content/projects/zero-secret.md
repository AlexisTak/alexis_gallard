---
title: "Zero-Secret"
subtitle: "Limiter les accès privilégiés au strict nécessaire"
status: "En cours"
role: "Conception et développement du prototype"
stack: ["Rust", "Go", "TypeScript", "WebAuthn / FIDO2", "Cedar", "OpenBao"]
summary: "Remplacer les secrets permanents par des accès temporaires, autorisés selon le contexte et traçables. Un prototype pour repenser la sécurité des environnements critiques."
context: "Une clé d’API permanente ou un compte administrateur oublié peut donner un accès durable à une infrastructure. Zero-Secret part d’une question concrète : comment autoriser une intervention sans laisser derrière elle un accès exploitable indéfiniment ?"
challenges: "Faire fonctionner ensemble identité, autorisation, expiration et traçabilité, avec des responsabilités clairement séparées. Le projet vise des environnements critiques : chaque choix doit pouvoir être expliqué, testé et examiné par un tiers."
solution: "Je développe un parcours en quatre étapes : preuve d’identité WebAuthn/FIDO2, décision d’accès selon des politiques dynamiques, émission d’identifiants éphémères juste à temps, puis accès à la ressource. Les composants Rust et Go séparent les décisions de sécurité de l’orchestration. L’architecture intègre OpenBao, une interface HSM PKCS#11 — SoftHSM2 en développement — et un journal d’audit signé et chaîné, dont l’intégrité peut être vérifiée."
results: "Un prototype technique fonctionnel, avec un parcours JIT documenté et une base de code publique conçue pour être examinée. Le travail se poursuit : le projet n’a pas encore fait l’objet d’une revue de sécurité indépendante ni d’un test d’intrusion. Il constitue un terrain d’expérimentation, pas une solution validée pour la production critique."
link: "https://github.com/AlexisTak/zero-secret"
linkLabel: "Explorer le code et l’architecture"
featured: true
order: 1
---
