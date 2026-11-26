# Twin на twin.bytalent.ru

Ветка с инфраструктурой домена. Исходники сайта и публикация живут в своих ветках
(`work/twin-site-system`, `work/twin-v2`, `twin-preview`); здесь их нет и правок в них не нужно.

## Как устроено

- `twin-bytalent.yaml` — манифест для кластера, где работает ingress `85.193.82.51`.
- В поде `git-sync` раз в минуту подтягивает ветку `release/twin-bytalent-domain`, `nginx` её
  отдаёт. Старые ссылки с префиксом `/twin-web-concept/` из сборки для GitHub Pages по-прежнему
  открываются (страховка для закешированных файлов).
- Скрытые пути (`/.git`, `/.twin/…`) и `/docs/` отдают 404: там заметки задач, а не сайт.
- Ingress с `cert-manager.io/cluster-issuer: letsencrypt` выпускает HTTPS.

Production — ветка `release/twin-bytalent-domain`: главная там — Motion Preview без префикса
GitHub Pages, с canonical, robots.txt и sitemap.xml. Коммит в неё появляется на
https://twin.bytalent.ru примерно через минуту. Публикации в `twin-preview` на домен больше не
попадают: это превью на https://aurrrus.github.io/twin-web-concept/.

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

`build-version.json` показывает, какой релиз сейчас на сайте.

## Откат

В `--ref=release/twin-bytalent-domain` обоих контейнеров `git-sync` указать SHA рабочего коммита
release-ветки и закоммитить в эту ветку. Вернуть имя ветки, когда исправленный релиз готов.

Крайний случай — `--ref=twin-preview`: сайт вернётся к состоянию до переноса (на корне старый V1,
Motion Preview на `/v2/motion-preview/`).
