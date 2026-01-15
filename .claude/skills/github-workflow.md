# GitHub Workflow Skill

## Repository
- URL: https://github.com/hephaex/Barami
- Branch: main

## GitHub CLI Commands
```bash
# Check auth status
gh auth status

# List issues
gh issue list

# View issue
gh issue view 1

# Create issue
gh issue create --title "Title" --body "Description"

# Close issue
gh issue close 1 --comment "Completed"

# Create PR
gh pr create --title "Title" --body "Description"

# List PRs
gh pr list

# View PR
gh pr view 1

# Merge PR
gh pr merge 1 --squash
```

## Git Commands
```bash
# Status
git status

# Add changes
git add .
git add services/news-api/

# Commit
git commit -m "feat: Add new endpoint"

# Push
git push origin main

# Pull
git pull origin main

# Log
git log --oneline -10

# Diff
git diff
git diff --staged
```

## Commit Message Format
```
type: short description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Tests
- `chore`: Maintenance

### Examples
```bash
git commit -m "feat: Add search endpoint to news API"
git commit -m "fix: Resolve pagination bug in news list"
git commit -m "refactor: Extract common components"
git commit -m "docs: Update API documentation"
git commit -m "chore: Update dependencies"
```

## Sprint Issues
- #1: Sprint 1 - Project Setup & News API
- #2: Sprint 2 - News Dashboard Frontend
- #3: Sprint 3 - Admin Dashboard & Monitoring
- #4: Sprint 4 - Docker Compose & Deployment

## Workflow
1. Check current issues: `gh issue list`
2. Make changes
3. Test locally
4. Stage changes: `git add .`
5. Commit: `git commit -m "type: description"`
6. Push: `git push origin main`
7. Close issue if completed: `gh issue close N`

## Labels (Create if needed)
```bash
gh label create "priority:high" --color "d73a4a"
gh label create "priority:medium" --color "fbca04"
gh label create "priority:low" --color "0e8a16"
gh label create "type:feature" --color "0052cc"
gh label create "type:bug" --color "d73a4a"
gh label create "type:docs" --color "0075ca"
gh label create "sprint:1" --color "5319e7"
gh label create "sprint:2" --color "5319e7"
gh label create "sprint:3" --color "5319e7"
gh label create "sprint:4" --color "5319e7"
```
