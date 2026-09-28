#!/usr/bin/env bash
# 一次性初始化仓库设置. 可重复执行: 已存在的标签与 ruleset 会被更新而不是重复创建.
set -euo pipefail

: "${REPO:?需要 REPO, 例如 tian-sandwichlab/agent-loop-demo}"
: "${FIXER_SLUG:?需要 FIXER_SLUG, 即 fixer App 的 slug}"
: "${REVIEWER_SLUG:?需要 REVIEWER_SLUG, 即 reviewer App 的 slug}"
: "${FIXER_CLIENT_ID:?需要 FIXER_CLIENT_ID}"
: "${REVIEWER_CLIENT_ID:?需要 REVIEWER_CLIENT_ID}"
: "${FIXER_KEY_FILE:?需要 FIXER_KEY_FILE, fixer App 私钥 .pem 路径}"
: "${REVIEWER_KEY_FILE:?需要 REVIEWER_KEY_FILE, reviewer App 私钥 .pem 路径}"

echo "== 仓库合并设置"
gh api -X PATCH "repos/$REPO" \
  -F allow_auto_merge=true -F delete_branch_on_merge=true \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false >/dev/null

echo "== 变量与密钥"
fixer_bot="${FIXER_SLUG}[bot]"
reviewer_bot="${REVIEWER_SLUG}[bot]"
gh variable set FIXER_BOT -R "$REPO" --body "$fixer_bot"
gh variable set REVIEWER_BOT -R "$REPO" --body "$reviewer_bot"
gh variable set FIXER_BOT_ID -R "$REPO" --body "$(gh api "users/$fixer_bot" --jq .id)"
gh variable set FIXER_CLIENT_ID -R "$REPO" --body "$FIXER_CLIENT_ID"
gh variable set REVIEWER_CLIENT_ID -R "$REPO" --body "$REVIEWER_CLIENT_ID"
gh secret set FIXER_PRIVATE_KEY -R "$REPO" < "$FIXER_KEY_FILE"
gh secret set REVIEWER_PRIVATE_KEY -R "$REPO" < "$REVIEWER_KEY_FILE"
if ! gh secret list -R "$REPO" --json name --jq '.[].name' | grep -qx ANTHROPIC_API_KEY; then
  echo "输入 ANTHROPIC_API_KEY(不回显):"
  gh secret set ANTHROPIC_API_KEY -R "$REPO"
fi

echo "== 标签"
while IFS='|' read -r name color desc; do
  gh label create "$name" -R "$REPO" --color "$color" --description "$desc" --force >/dev/null
done <<'LABELS'
triage|ededed|已收到, 等待自动分析
agent:analyzed|c5def5|自动分析已完成
agent:fix|1d76db|触发自动修复
agent:fixing|0e8a16|自动修复进行中
agent:pr-open|5319e7|修复 PR 已创建
agent:merged|6f42c1|修复已合并, 待部署
agent:needs-human|d93f0b|自动流程中止, 需要人工
agent:pr|bfdadc|由修复 agent 创建的 PR
deployed|0e8a16|已随部署上线
type:bug|d73a4a|缺陷
type:feature|a2eeef|新能力
type:question|d876e3|使用咨询
type:invalid|e4e669|无效或无关
ops:deploy-failed|b60205|日常部署失败
LABELS

echo "== GitHub Pages(构建来源: Actions)"
gh api -X POST "repos/$REPO/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/$REPO/pages" -f build_type=workflow >/dev/null

echo "== 默认分支 ruleset"
ruleset=$(cat <<'JSON'
{
  "name": "main-protection",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "bypass_actors": [
    { "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" }
  ],
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": true,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [{ "context": "ci" }]
      }
    }
  ]
}
JSON
)
existing=$(gh api "repos/$REPO/rulesets" --jq '.[] | select(.name == "main-protection") | .id')
if [ -n "$existing" ]; then
  gh api -X PUT "repos/$REPO/rulesets/$existing" --input - <<<"$ruleset" >/dev/null
else
  gh api -X POST "repos/$REPO/rulesets" --input - <<<"$ruleset" >/dev/null
fi

echo "完成. 核对: gh api repos/$REPO/rulesets; gh variable list -R $REPO; gh secret list -R $REPO"
