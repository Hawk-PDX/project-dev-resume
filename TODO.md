# Portfolio Fixes - Loading and Projects

## Current Issues
- [ ] Loading delays (cold starts on Render free tier)
- [ ] Hunting-comm-app not showing as featured project
- [ ] Need to optimize API calls and add caching

## Tasks
- [x] Add localStorage caching to useData.js hooks
- [x] Add backend warmup endpoint
- [x] Update seed_db.py to ensure hunting-comm-app is featured
- [ ] Test certificate adding functionality
- [ ] Deploy and verify fixes

## Completed
- [x] Analyzed codebase and identified issues
- [x] Confirmed admin mode is enabled for certificates
- [x] Added caching to useCertificates and useProjects hooks
- [x] Added /api/warmup endpoint to backend
- [x] Updated seed_db.py with update_existing_projects function
- [x] Ran seed_db.py locally to update HuntSafe project
- [x] Ran migrations to ensure database is up to date
