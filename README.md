# Twin на twin.bytalent.ru

Ветка с инфраструктурой домена. Исходники сайта и публикация живут в своих ветках
(`work/twin-site-system`, `work/twin-v2`, `twin-preview`); здесь их нет и правок в них не нужно.

## Как устроено

- `twin-bytalent.yaml` — манифест для кластера, где работает ingress `85.193.82.51`.
- В поде `git-sync` раз в минуту подтягивает ветку `twin-preview`, `nginx` её отдаёт.
  Ссылки с префиксом `/twin-web-concept/` из сборки для GitHub Pages работают и на корне домена.
- Ingress с `cert-manager.io/cluster-issuer: letsencrypt` выпускает HTTPS.

Публикация в `twin-preview` (как сейчас, `npm run publish:preview`) появляется на
https://twin.bytalent.ru примерно через минуту; GitHub Pages продолжает работать из той же ветки.

DNS: `twin.bytalent.ru → 85.193.82.51`, заведено в Beget.

## ArgoCD

Application `twin-bytalent` (проект `front-ends`, как agoi и остальные talent-фронтенды) в
https://acd.pin.capital следит за этой веткой и применяет манифест автоматически (prune,
self-heal). Репозиторий публичный, ключи не нужны. Создано через веб-интерфейс; то же из CLI:

```bash
argocd app create twin-bytalent --grpc-web --project front-ends --repo https://github.com/AURRRUS/twin-web-concept.git --revision infra/twin-bytalent --path . --directory-include twin-bytalent.yaml --dest-server https://kubernetes.default.svc --dest-namespace talent-front-ends-twin --sync-policy automated --auto-prune --self-heal --sync-option CreateNamespace=true
```

## Проверка

```bash
argocd app get twin-bytalent --grpc-web
curl -s https://twin.bytalent.ru/build-version.json
```

`build-version.json` показывает, какая публикация сейчас на сайте.

## Откат

В `--ref=twin-preview` контейнера `git-sync` указать SHA рабочего коммита `twin-preview`
и закоммитить в эту ветку. Вернуть `twin-preview`, когда исправленная публикация готова.
