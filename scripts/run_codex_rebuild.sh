#!/bin/bash
cd /Users/alanlc/Documents/claudeai/100_Todo/projects/meetjoy-divination
PROMPT_CONTENT=$(cat scripts/codex_task_prompt.txt)
codex exec -m gpt-5.6-terra -c model_reasoning_effort="high" "$PROMPT_CONTENT"
