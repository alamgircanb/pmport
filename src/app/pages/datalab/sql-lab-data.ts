// SQL Lab exercises. Every solution has been checked against the sample database (SQLite).
export interface SqlExercise{id:string;level:string;title:string;prompt:string;hint:string;solution:string;
  /** Set when row order matters: the result column (0-based) whose sequence must match. */
  orderCol?:number}
export const SQL_EXERCISES:SqlExercise[]=[
 {
  "id": "s01",
  "level": "Basics",
  "title": "See every project",
  "prompt": "List all columns for every project.",
  "hint": "Use SELECT * FROM a table.",
  "solution": "SELECT * FROM projects;"
 },
 {
  "id": "s02",
  "level": "Basics",
  "title": "Pick columns",
  "prompt": "Show each project's name, status and budget.",
  "hint": "List the columns after SELECT, separated by commas.",
  "solution": "SELECT name, status, budget FROM projects;"
 },
 {
  "id": "s03",
  "level": "Basics",
  "title": "Filter by status",
  "prompt": "Show the names of all projects with status 'In Progress'.",
  "hint": "Use WHERE status = 'In Progress'. Text values go in single quotes.",
  "solution": "SELECT name FROM projects WHERE status = 'In Progress';"
 },
 {
  "id": "s04",
  "level": "Basics",
  "title": "Biggest budgets first",
  "prompt": "List project names and budgets, largest budget first.",
  "hint": "ORDER BY budget DESC sorts from largest to smallest.",
  "solution": "SELECT name, budget FROM projects ORDER BY budget DESC;",
  "orderCol": 1
 },
 {
  "id": "s05",
  "level": "Basics",
  "title": "Combine conditions",
  "prompt": "Show the names of High priority projects in the IT department.",
  "hint": "Join two conditions with AND.",
  "solution": "SELECT name FROM projects WHERE priority = 'High' AND department = 'IT';"
 },
 {
  "id": "s06",
  "level": "Basics",
  "title": "Top 3 tasks by effort",
  "prompt": "Show the name and planned_hours of the 3 tasks with the most planned hours, largest first.",
  "hint": "ORDER BY planned_hours DESC, then LIMIT 3.",
  "solution": "SELECT name, planned_hours FROM tasks ORDER BY planned_hours DESC LIMIT 3;",
  "orderCol": 1
 },
 {
  "id": "s07",
  "level": "Basics",
  "title": "Pattern search",
  "prompt": "Find the names of all tasks whose name contains the word 'data' (any case).",
  "hint": "LIKE '%data%' matches text containing \"data\". In SQLite, LIKE ignores case for English letters.",
  "solution": "SELECT name FROM tasks WHERE name LIKE '%data%';"
 },
 {
  "id": "s08",
  "level": "Aggregation",
  "title": "Count projects",
  "prompt": "How many projects are there? Return one number.",
  "hint": "COUNT(*) counts rows.",
  "solution": "SELECT COUNT(*) FROM projects;"
 },
 {
  "id": "s09",
  "level": "Aggregation",
  "title": "Total portfolio budget",
  "prompt": "Return the total budget of all projects.",
  "hint": "SUM(budget) adds a column.",
  "solution": "SELECT SUM(budget) FROM projects;"
 },
 {
  "id": "s10",
  "level": "Aggregation",
  "title": "Projects per status",
  "prompt": "For each status, show the status and the number of projects.",
  "hint": "GROUP BY status with COUNT(*).",
  "solution": "SELECT status, COUNT(*) FROM projects GROUP BY status;"
 },
 {
  "id": "s11",
  "level": "Aggregation",
  "title": "Hours by phase",
  "prompt": "For each task phase, show the phase, total planned_hours and total actual_hours.",
  "hint": "GROUP BY phase with two SUM() columns.",
  "solution": "SELECT phase, SUM(planned_hours), SUM(actual_hours) FROM tasks GROUP BY phase;"
 },
 {
  "id": "s12",
  "level": "Aggregation",
  "title": "Busy departments",
  "prompt": "Show each department with more than one project, and its project count.",
  "hint": "Filter groups with HAVING COUNT(*) > 1 (WHERE cannot filter groups).",
  "solution": "SELECT department, COUNT(*) FROM projects GROUP BY department HAVING COUNT(*) > 1;"
 },
 {
  "id": "s13",
  "level": "Joins",
  "title": "Who manages what",
  "prompt": "Show each project name with its manager's name (from resources).",
  "hint": "JOIN resources ON resources.resource_id = projects.manager_id.",
  "solution": "SELECT p.name, r.name FROM projects p JOIN resources r ON r.resource_id = p.manager_id;"
 },
 {
  "id": "s14",
  "level": "Joins",
  "title": "Task owners",
  "prompt": "Show each task name, its project name and the owner's name.",
  "hint": "Join tasks to projects and to resources: two JOINs.",
  "solution": "SELECT t.name, p.name, r.name FROM tasks t JOIN projects p ON p.project_id = t.project_id JOIN resources r ON r.resource_id = t.owner_id;"
 },
 {
  "id": "s15",
  "level": "Joins",
  "title": "Workload per person",
  "prompt": "For each resource that owns tasks, show their name and total planned_hours across their tasks, largest first.",
  "hint": "JOIN tasks to resources, GROUP BY the person, ORDER BY the SUM descending.",
  "solution": "SELECT r.name, SUM(t.planned_hours) AS hours FROM tasks t JOIN resources r ON r.resource_id = t.owner_id GROUP BY r.resource_id, r.name ORDER BY hours DESC;",
  "orderCol": 1
 },
 {
  "id": "s16",
  "level": "Joins",
  "title": "People with no tasks",
  "prompt": "List the names of resources who own no tasks.",
  "hint": "LEFT JOIN tasks and keep rows where the task side IS NULL.",
  "solution": "SELECT r.name FROM resources r LEFT JOIN tasks t ON t.owner_id = r.resource_id WHERE t.task_id IS NULL;"
 },
 {
  "id": "s17",
  "level": "PM metrics",
  "title": "Cost variance",
  "prompt": "For each project show name and cost variance (CV = EV - AC), where EV = budget * percent_complete. Round CV to 2 decimals.",
  "hint": "EV is budget * percent_complete. Use ROUND(expression, 2).",
  "solution": "SELECT name, ROUND(budget * percent_complete - actual_cost, 2) AS cv FROM projects;"
 },
 {
  "id": "s18",
  "level": "PM metrics",
  "title": "CPI by project",
  "prompt": "For projects that have started (actual_cost > 0), show name and CPI = EV / AC, rounded to 2 decimals, lowest CPI first.",
  "hint": "CPI = (budget * percent_complete) / actual_cost. Multiply by 1.0 if needed to avoid integer division. ORDER BY cpi.",
  "solution": "SELECT name, ROUND(budget * percent_complete * 1.0 / actual_cost, 2) AS cpi FROM projects WHERE actual_cost > 0 ORDER BY cpi;",
  "orderCol": 1
 },
 {
  "id": "s19",
  "level": "PM metrics",
  "title": "Behind schedule",
  "prompt": "Show the names of projects whose SPI (EV / PV) is below 0.9. PV = budget * planned_percent. Ignore projects where planned_percent is 0.",
  "hint": "SPI = percent_complete / planned_percent, because budget cancels out.",
  "solution": "SELECT name FROM projects WHERE planned_percent > 0 AND percent_complete / planned_percent < 0.9;"
 },
 {
  "id": "s20",
  "level": "PM metrics",
  "title": "Risk exposure (EMV)",
  "prompt": "For open risks, show each project's name and its total expected monetary value (EMV = probability * impact_cost), largest first.",
  "hint": "Filter status = 'Open', JOIN projects, GROUP BY project, SUM(probability * impact_cost).",
  "solution": "SELECT p.name, SUM(k.probability * k.impact_cost) AS emv FROM risks k JOIN projects p ON p.project_id = k.project_id WHERE k.status = 'Open' GROUP BY p.project_id, p.name ORDER BY emv DESC;",
  "orderCol": 1
 },
 {
  "id": "s21",
  "level": "PM metrics",
  "title": "Hours overrun tasks",
  "prompt": "Show task name, planned_hours and actual_hours for tasks where actual hours exceed planned hours.",
  "hint": "Compare two columns in WHERE.",
  "solution": "SELECT name, planned_hours, actual_hours FROM tasks WHERE actual_hours > planned_hours;"
 },
 {
  "id": "s22",
  "level": "Advanced",
  "title": "RAG status",
  "prompt": "For each project show name and a RAG label: 'Green' if percent_complete / planned_percent >= 0.95, 'Amber' if >= 0.85, otherwise 'Red'. Treat planned_percent = 0 as 'Green'.",
  "hint": "Use CASE WHEN ... THEN ... ELSE ... END. Check planned_percent = 0 first.",
  "solution": "SELECT name, CASE WHEN planned_percent = 0 THEN 'Green' WHEN percent_complete / planned_percent >= 0.95 THEN 'Green' WHEN percent_complete / planned_percent >= 0.85 THEN 'Amber' ELSE 'Red' END AS rag FROM projects;"
 },
 {
  "id": "s23",
  "level": "Advanced",
  "title": "Above-average budgets",
  "prompt": "List names of projects whose budget is above the average project budget.",
  "hint": "Use a subquery: WHERE budget > (SELECT AVG(budget) FROM projects).",
  "solution": "SELECT name FROM projects WHERE budget > (SELECT AVG(budget) FROM projects);"
 },
 {
  "id": "s24",
  "level": "Advanced",
  "title": "Blocked work report",
  "prompt": "Using a CTE named blocked, find blocked tasks, then show the task name, project name and the project manager's name.",
  "hint": "WITH blocked AS (SELECT ... FROM tasks WHERE status = 'Blocked') SELECT ... FROM blocked JOIN ...",
  "solution": "WITH blocked AS (SELECT * FROM tasks WHERE status = 'Blocked') SELECT b.name, p.name, r.name FROM blocked b JOIN projects p ON p.project_id = b.project_id JOIN resources r ON r.resource_id = p.manager_id;"
 },
 {
  "id": "s25",
  "level": "Advanced",
  "title": "Rank by budget",
  "prompt": "Show each project name, department, budget and its budget rank within its department (1 = largest).",
  "hint": "Window function: RANK() OVER (PARTITION BY department ORDER BY budget DESC).",
  "solution": "SELECT name, department, budget, RANK() OVER (PARTITION BY department ORDER BY budget DESC) AS dept_rank FROM projects;"
 },
 {
  "id": "s26",
  "level": "Advanced",
  "title": "Running cost by start date",
  "prompt": "List projects by start_date with name, actual_cost and the running total of actual_cost.",
  "hint": "SUM(actual_cost) OVER (ORDER BY start_date) gives a running total.",
  "solution": "SELECT name, actual_cost, SUM(actual_cost) OVER (ORDER BY start_date) AS running_cost FROM projects ORDER BY start_date;",
  "orderCol": 2
 }
];
