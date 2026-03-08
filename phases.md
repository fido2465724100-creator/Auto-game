Now execute Phase 1 for this project.

Your task is to prepare the foundation for the MVP of Auto Industry Tycoon.

Please do the following in order:

1. Propose a clean folder structure for:
   - frontend (Next.js)
   - backend (NestJS)
   - shared types / shared game logic
   - data seed files

2. Define the MVP domain models in TypeScript for:
   - Company
   - GameState
   - Technology
   - ResearchProject
   - VehicleModel
   - Region
   - HistoricalEvent
   - MonthlyReport

3. Propose a Prisma schema for MVP persistence.

4. Create the initial seed data structures for:
   - regions
   - technologies (1900–1915 initial batch)
   - events
   - vehicle components

5. Implement a first backend simulation flow:
   - advance one month
   - progress research
   - simulate basic sales
   - calculate monthly finances
   - generate report

6. Build minimal frontend pages:
   - dashboard
   - research
   - vehicle design
   - markets
   - reports

7. Show all code file-by-file with explanations.

Important:
- prioritize correctness and maintainability
- use TypeScript everywhere
- keep formulas simple but expandable
- do not skip shared typing
- do not hardcode everything in components
- produce code in a way that can run and be extended