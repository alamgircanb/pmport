// Python lab exercises (pandas). Each sets a variable named result; solutions are checked in the browser.
export interface PyExercise{id:string;level:string;title:string;prompt:string;hint:string;solution:string;
  /** Extra Python run before the learner's code (e.g. a messy DataFrame to clean). */
  setup?:string}
export const PY_EXERCISES:PyExercise[]=[
 {
  "id": "p01",
  "level": "Basics",
  "title": "How many tasks?",
  "prompt": "The DataFrame tasks holds every task. Set result to the number of tasks.",
  "hint": "len(df) returns the number of rows.",
  "solution": "result = len(tasks)"
 },
 {
  "id": "p02",
  "level": "Basics",
  "title": "In-progress projects",
  "prompt": "Set result to a list of the names of projects whose status is \"In Progress\".",
  "hint": "Filter with projects[projects[\"status\"] == \"In Progress\"], take the \"name\" column and call .tolist().",
  "solution": "result = projects.loc[projects[\"status\"] == \"In Progress\", \"name\"].tolist()"
 },
 {
  "id": "p03",
  "level": "Basics",
  "title": "Add an EV column",
  "prompt": "Add a column \"ev\" to projects (EV = budget × percent_complete). Set result to that column.",
  "hint": "projects[\"ev\"] = projects[\"budget\"] * projects[\"percent_complete\"]",
  "solution": "projects[\"ev\"] = projects[\"budget\"] * projects[\"percent_complete\"]\nresult = projects[\"ev\"]"
 },
 {
  "id": "p04",
  "level": "Grouping",
  "title": "Budget by department",
  "prompt": "Set result to the total budget per department (a Series indexed by department).",
  "hint": "projects.groupby(\"department\")[\"budget\"].sum()",
  "solution": "result = projects.groupby(\"department\")[\"budget\"].sum()"
 },
 {
  "id": "p05",
  "level": "Grouping",
  "title": "Average CPI",
  "prompt": "For projects with actual_cost > 0, calculate CPI = budget × percent_complete ÷ actual_cost. Set result to the average CPI (one number).",
  "hint": "Filter first, then compute the CPI column, then .mean().",
  "solution": "started = projects[projects[\"actual_cost\"] > 0]\nresult = (started[\"budget\"] * started[\"percent_complete\"] / started[\"actual_cost\"]).mean()"
 },
 {
  "id": "p06",
  "level": "Filtering",
  "title": "Tasks over their hours",
  "prompt": "Set result to a list of the names of tasks where actual_hours is greater than planned_hours.",
  "hint": "tasks[tasks[\"actual_hours\"] > tasks[\"planned_hours\"]][\"name\"].tolist()",
  "solution": "result = tasks.loc[tasks[\"actual_hours\"] > tasks[\"planned_hours\"], \"name\"].tolist()"
 },
 {
  "id": "p07",
  "level": "Joining",
  "title": "Hours per person",
  "prompt": "Join tasks to resources (owner_id → resource_id) and set result to total planned_hours per person's name.",
  "hint": "tasks.merge(resources, left_on=\"owner_id\", right_on=\"resource_id\"), then groupby(\"name_y\") or rename columns first.",
  "solution": "m = tasks.merge(resources, left_on=\"owner_id\", right_on=\"resource_id\", suffixes=(\"_task\", \"_person\"))\nresult = m.groupby(\"name_person\")[\"planned_hours\"].sum()"
 },
 {
  "id": "p08",
  "level": "Joining",
  "title": "Risk exposure",
  "prompt": "For risks with status \"Open\", calculate EMV = probability × impact_cost. Set result to total EMV per project_id.",
  "hint": "Filter, add an \"emv\" column, then groupby(\"project_id\")[\"emv\"].sum().",
  "solution": "open_risks = risks[risks[\"status\"] == \"Open\"].copy()\nopen_risks[\"emv\"] = open_risks[\"probability\"] * open_risks[\"impact_cost\"]\nresult = open_risks.groupby(\"project_id\")[\"emv\"].sum()"
 },
 {
  "id": "p09",
  "level": "Reshaping",
  "title": "Tasks by phase and status",
  "prompt": "Build a table counting tasks with one row per phase and one column per status. Fill missing combinations with 0. Set result to the table.",
  "hint": "pd.crosstab(tasks[\"phase\"], tasks[\"status\"]) does exactly this.",
  "solution": "result = pd.crosstab(tasks[\"phase\"], tasks[\"status\"])"
 },
 {
  "id": "p10",
  "level": "Dates",
  "title": "Average task duration",
  "prompt": "Convert start_date and end_date to dates and set result to the average task duration in days (end − start).",
  "hint": "pd.to_datetime(...), subtract, then .dt.days.mean().",
  "solution": "d = pd.to_datetime(tasks[\"end_date\"]) - pd.to_datetime(tasks[\"start_date\"])\nresult = d.dt.days.mean()"
 },
 {
  "id": "p11",
  "level": "Dates",
  "title": "Tasks starting per month",
  "prompt": "Set result to the number of tasks starting in each month, as a Series indexed by month number (1–12), sorted by month.",
  "hint": "pd.to_datetime(tasks[\"start_date\"]).dt.month, then .value_counts().sort_index().",
  "solution": "result = pd.to_datetime(tasks[\"start_date\"]).dt.month.value_counts().sort_index()"
 },
 {
  "id": "p12",
  "level": "Cleaning",
  "title": "Clean messy status text",
  "prompt": "The DataFrame raw has status values typed inconsistently (extra spaces, different capitals). Clean them to title case without spaces at the ends, then set result to the count of each status.",
  "hint": "raw[\"status\"].str.strip().str.title().value_counts()",
  "solution": "result = raw[\"status\"].str.strip().str.title().value_counts()",
  "setup": "raw = pd.DataFrame({\"task\": [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"G\"], \"status\": [\" done\", \"Done \", \"IN PROGRESS\", \"in progress\", \"Blocked\", \"done\", \" not started\"]})"
 }
];

/** Python helpers that compare a learner's result with the model answer (order of rows does not matter). */
export const PY_GRADER="import pandas as pd, math\ndef _canon(v):\n    import numpy as np\n    if isinstance(v, pd.DataFrame):\n        df = v.copy()\n        if not isinstance(df.index, pd.RangeIndex): df = df.reset_index()\n        rows = [tuple(_canon(x) for x in r) for r in df.itertuples(index=False)]\n        cols = sorted(range(len(df.columns)), key=lambda i: str(df.columns[i]))\n        rows2 = [tuple(_canon(r[i]) for i in cols) for r in df.itertuples(index=False)]\n        return ('df', sorted(map(repr, rows)), sorted(map(repr, rows2)))\n    if isinstance(v, pd.Series):\n        if isinstance(v.index, pd.RangeIndex): return ('list', sorted(repr(_canon(x)) for x in v.tolist()))\n        return ('map', sorted(repr((_canon(k), _canon(x))) for k, x in v.items()))\n    if isinstance(v, (list, tuple, set)): return ('list', sorted(repr(_canon(x)) for x in v))\n    if isinstance(v, (bool, np.bool_)): return bool(v)\n    if isinstance(v, (int, float, np.integer, np.floating)):\n        f = float(v); return round(f, 2) if not math.isnan(f) else 'nan'\n    return str(v).strip()\ndef _same(a, b):\n    ca, cb = _canon(a), _canon(b)\n    if isinstance(ca, tuple) and ca[0] == 'df' and isinstance(cb, tuple) and cb[0] == 'df':\n        return ca[1] == cb[1] or ca[2] == cb[2]\n    return ca == cb\n";
