# База TWIN_SALES_STORY_R1

Рабочая чистая база: bfd52d9a4c57f3e8956b9a28ed3a1d8fb29b712a, codex/twin-journey-v4-v6.
Опубликованный sourceCommit:7a91cece7ffc3fb66edb9aa6d2a81b044846101d.
Pages commit:bc8ef83b66789765c2b62618f52b2a66a2ebf1f7.

Резерв исходников отправлен до правок:
- backup/before-sales-story-r1-2026-10-25 — bfd52d9a4c57f3e8956b9a28ed3a1d8fb29b712a (содержит прежний Journey4).
- backup/pages-before-sales-story-r1-2026-10-25 — 8fbceba01087cbbbad8ed6c90e7b464b9fc3ad5c; первая ветка была создана до правок по устаревшему origin/twin-preview, она не соответствует зафиксированной прежней публикации и не перемещалась.
- backup/pages-before-sales-story-r1-2026-10-25-2 — bc8ef83b66789765c2b62618f52b2a66a2ebf1f7; правильная прежняя Pages-сборка закреплена при финальной проверке26октября. Её build-version.json подтверждает source7a91cece7ffc3fb66edb9aa6d2a81b044846101d. Это исправление последовательности резервирования, а не утверждение, что правильная Pages-ветка была создана до работ. История всегда сохранялась обычными append-only публикациями, commit не терялся.

Новая ветка codex/twin-sales-story-r1. Чужих незакоммиченных изменений не было.
Обычное восстановление для просмотра: git switch -c review/before-sales-story backup/before-sales-story-r1-2026-10-25. Сборку можно осмотреть в отдельном worktree: git worktree add /tmp/twin-pages-before-sales-story backup/pages-before-sales-story-r1-2026-10-25-2. Это не переписывает текущую ветку или публикацию.

Причина: обычный git fetch origin в этом checkout обновлял только настроенный refspec исходников. Для будущих резервов сначала git fetch origin refs/heads/twin-preview:refs/remotes/origin/twin-preview, затем сверить git ls-remote origin refs/heads/twin-preview и SHA отправленной резервной ветки.
