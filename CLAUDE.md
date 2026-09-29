# 项目约束(供自动修复与 review agent 使用)

- 技术栈: TypeScript + Vite, 测试 Vitest, 包管理 pnpm.
- 验证命令: `pnpm lint`(类型检查), `pnpm test`, `pnpm build`; 三者全部通过才算完成.
- 修复缺陷时必须补一条修复前失败, 修复后通过的测试, 测试文件与被测文件同目录, 命名 `*.test.ts`.
- 实现需求时以「需求实施方案」为准: 每条验收标准至少一条测试, 不做方案「不做」列表中的内容, 不超出方案范围.
- 只做与 issue 直接相关的最小改动; 不重构, 不改格式, 不升级依赖.
- 禁止修改: `.github/`, `.claude/`, `CLAUDE.md`, `package.json`, `pnpm-lock.yaml`, `scripts/`. 需要改这些才能修复时, 停止并说明原因.
- 不执行 git 命令; 提交, 推送与开 PR 由工作流完成.
