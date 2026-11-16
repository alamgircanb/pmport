/**
 * Tips n Tech → Claude Tips & Tricks: content for /tips-n-tech/claude-tips.
 * Checked against Claude help-centre pages and Claude Code references in November 2026.
 * Claude changes often: re-check commands and shortcuts when you update this list.
 */

export type ClaudeCat='links'|'app'|'prompting'|'projects'|'code-keys'|'code-cmds'|'cli'|'setup';

export interface ClaudeTip{cat:ClaudeCat;title:string;what:string;how:string;code?:string;link?:string}

export const CLAUDE_CATS:{id:ClaudeCat;label:string;icon:string;color:string}[]=[
  {id:'links',label:'Links & URL tricks',icon:'🔗',color:'#49cce1'},
  {id:'app',label:'Claude app',icon:'💬',color:'#e58b5a'},
  {id:'prompting',label:'Prompting',icon:'🧠',color:'#b47cff'},
  {id:'projects',label:'Projects, memory & files',icon:'🗂️',color:'#3ddc97'},
  {id:'code-keys',label:'Claude Code keys',icon:'⌨️',color:'#6f8fff'},
  {id:'code-cmds',label:'Claude Code commands',icon:'⚡',color:'#ffb36b'},
  {id:'cli',label:'Command line',icon:'🖥️',color:'#7fe0ff'},
  {id:'setup',label:'Setup & safety',icon:'🛡️',color:'#ff8fb1'},
];

export const CLAUDE_TIPS:ClaudeTip[]=[
  // Links & URL tricks
  {cat:'links',title:'Start a fresh chat from the address bar',what:'Opens a brand-new conversation.',how:'Type the address and press Enter.',code:'claude.ai/new',link:'https://claude.ai/new'},
  {cat:'links',title:'Pre-fill a prompt with a link',what:'Opens a new chat with your text already in the box, ready to review and send.',how:'Add ?q= and your URL-encoded prompt.',code:'claude.ai/new?q=Explain%20EVM%20simply',link:'https://claude.ai/new?q=Explain%20earned%20value%20management%20in%20plain%20English'},
  {cat:'links',title:'Ask Claude from Chrome\'s address bar',what:'Type a keyword, a space and your question; Claude opens with it.',how:'Chrome → Settings → Search engine → Manage site search → Add. Shortcut: c. URL: https://claude.ai/new?q=%s',code:'claude.ai/new?q=%s'},
  {cat:'links',title:'"Ask Claude" bookmarklet',what:'Highlight text on any page, click the bookmark, and Claude opens with that text.',how:'Make a bookmark whose address is the code below.',code:'javascript:(()=>window.open(\'https://claude.ai/new?q=\'+encodeURIComponent(\'Explain this: \'+getSelection())))()'},
  {cat:'links',title:'Share prompt links with your team',what:'Turn a good prompt into a link people click instead of copy-pasting.',how:'Use the prompt-link builder on this page, then share the link.'},
  {cat:'links',title:'Open the desktop app with a link',what:'claude:// links open Claude Desktop instead of the browser.',how:'Use claude://claude.ai/new (add ?q= to pre-fill).',code:'claude://claude.ai/new?q=Hello'},
  {cat:'links',title:'Jump to a chat or project in the desktop app',what:'Deep-link straight to a saved conversation or project.',how:'Use the ID from the web address.',code:'claude://claude.ai/project/PROJECT_ID'},
  {cat:'links',title:'Claude Code on the web',what:'Start a coding session in the browser on a GitHub repo.',how:'Open claude.ai/code and pick a repository.',code:'claude.ai/code',link:'https://claude.ai/code'},
  {cat:'links',title:'Pre-filled Claude Code session',what:'Opens Claude Code with the repo, branch and task filled in.',how:'Add q (or prompt), repo and branch.',code:'claude.ai/code/new?q=Fix%20the%20failing%20test&repo=OWNER%2FREPO&branch=main'},
  {cat:'links',title:'Open Claude Code in your terminal from a link',what:'claude-cli:// links open a terminal with Claude Code and your prompt ready.',how:'Add q= with the URL-encoded prompt; press Enter yourself to run it.',code:'claude-cli://open?q=review%20my%20changes'},
  {cat:'links',title:'Help centre',what:'Official answers on plans, limits and features.',how:'Search it before guessing.',code:'support.claude.com',link:'https://support.claude.com'},
  {cat:'links',title:'Developer docs',what:'API, prompt engineering guide and model details.',how:'Bookmark the prompt engineering overview.',code:'docs.claude.com',link:'https://docs.claude.com'},
  {cat:'links',title:'Claude Code docs',what:'Commands, settings, hooks, skills and deep links.',how:'Check here when a command changes.',code:'code.claude.com/docs',link:'https://code.claude.com/docs'},

  // Claude app
  {cat:'app',title:'See every shortcut',what:'Shows the keyboard shortcuts for the version you are using.',how:'Press Ctrl + / (Cmd + / on Mac).'},
  {cat:'app',title:'New line without sending',what:'Write multi-paragraph prompts comfortably.',how:'Press Shift + Enter.'},
  {cat:'app',title:'Search all your chats',what:'Find an old conversation in seconds.',how:'Press Ctrl + K (Cmd + K on Mac) and type.'},
  {cat:'app',title:'Edit a message to branch the chat',what:'Change an earlier prompt and Claude answers again from that point; the old branch is kept.',how:'Hover your message → edit (pencil) → save.'},
  {cat:'app',title:'Retry for a different answer',what:'Get another version of the last reply.',how:'Click Retry under the response.'},
  {cat:'app',title:'Styles',what:'Switch how Claude writes: concise, explanatory, formal, or your own custom style.',how:'Use the + / tools menu in the chat box, or create one from a writing sample.'},
  {cat:'app',title:'Incognito chat',what:'A chat that is not saved to your history or used for memory.',how:'Start an incognito chat from the new-chat screen.'},
  {cat:'app',title:'Web search',what:'Claude looks up current information and cites sources.',how:'Turn on web search in the tools menu, then ask about anything recent.'},
  {cat:'app',title:'Research',what:'Claude runs many searches and returns a report with citations.',how:'Turn on Research for bigger questions; it takes longer.'},
  {cat:'app',title:'Upload files and images',what:'Ask about PDFs, spreadsheets, screenshots or photos.',how:'Drag in, paste (Ctrl + V) or use the + button.'},
  {cat:'app',title:'Paste a screenshot of an error',what:'Faster than retyping; Claude reads the text and the layout.',how:'Win + Shift + S (or Cmd + Shift + 4), then Ctrl + V in the chat.'},
  {cat:'app',title:'Artifacts you can keep',what:'Documents, slides, sheets, pages and small apps open beside the chat and can be edited and shared.',how:'Ask for "a document", "a slide deck" or "an interactive page".'},
  {cat:'app',title:'Share a chat',what:'Send someone a read-only link to a conversation.',how:'Use Share at the top of the chat.'},
  {cat:'app',title:'Connectors',what:'Let Claude read and act in Gmail, Calendar, Drive and other apps you connect.',how:'Settings → Connectors, then ask naturally ("what\'s on my calendar Friday?").'},
  {cat:'app',title:'Voice on mobile',what:'Talk instead of typing, hands-free.',how:'Tap the voice button in the mobile app.'},
  {cat:'app',title:'Quick entry on Mac',what:'A Claude box pops up over any app.',how:'Desktop app: double-tap Option (change it in Settings → General).'},
  {cat:'app',title:'Choose the model and effort',what:'Pick a faster model for quick tasks and a stronger one for hard thinking.',how:'Use the model menu in the chat box.'},
  {cat:'app',title:'Scheduled tasks',what:'Ask Claude to run something later or on a schedule, like a Monday summary.',how:'Say "every Monday at 8 am, …" in a chat that supports it.'},

  // Prompting
  {cat:'prompting',title:'Give the context, not just the task',what:'Who it\'s for, why you need it and what good looks like.',how:'Add one line of background before the request.',code:'I\'m a PMP preparing a status report for a sponsor who has 2 minutes…'},
  {cat:'prompting',title:'Say what format you want',what:'Bullets, a table, 150 words, a .docx: say it.',how:'End your prompt with the format and length.',code:'Answer as a table with columns Risk | Impact | Owner.'},
  {cat:'prompting',title:'Show an example',what:'One good example beats a paragraph of description.',how:'Paste a sample and say "match this style".'},
  {cat:'prompting',title:'Use tags for long inputs',what:'Separates your instructions from the material.',how:'Wrap pasted text in simple tags.',code:'<notes> … </notes>  Summarize the notes above.'},
  {cat:'prompting',title:'Ask it to think step by step',what:'Better answers on calculations, plans and trade-offs.',how:'Add "think it through step by step before answering".'},
  {cat:'prompting',title:'Give Claude a role',what:'Sets the expertise and tone.',how:'Start with "Act as a senior business analyst reviewing…".'},
  {cat:'prompting',title:'Let it ask you questions first',what:'Avoids a polished answer to the wrong question.',how:'Add "ask me up to 3 questions before you start".'},
  {cat:'prompting',title:'Ask for options, then pick',what:'Good for headlines, emails and approaches.',how:'"Give me 3 versions with different tones."'},
  {cat:'prompting',title:'Iterate in small steps',what:'Edit what you have instead of starting again.',how:'"Keep everything, but make section 2 shorter."'},
  {cat:'prompting',title:'Ask it to critique itself',what:'Finds gaps before you do.',how:'"Review your answer as a skeptical sponsor. What\'s weak?"'},
  {cat:'prompting',title:'Ask for sources',what:'Lets you check facts quickly.',how:'"Cite your sources" (with web search on).'},
  {cat:'prompting',title:'Say what to leave out',what:'Stops filler and repeated caveats.',how:'"No introduction. No summary at the end."'},
  {cat:'prompting',title:'Turn a good chat into a reusable prompt',what:'Capture what worked.',how:'"Write a prompt that would get this result next time."'},
  {cat:'prompting',title:'Always review before you use it',what:'AI drafts; you decide. Check numbers, names and claims.',how:'Treat every answer as a first draft.'},

  // Projects, memory & files
  {cat:'projects',title:'Projects for ongoing work',what:'Keep chats, files and instructions for one course, client or goal together.',how:'Create a project and start chats inside it.'},
  {cat:'projects',title:'Project knowledge',what:'Upload syllabi, templates or style guides once; every chat in the project can use them.',how:'Add files to the project\'s knowledge.'},
  {cat:'projects',title:'Project instructions',what:'Standing rules for every chat in a project.',how:'e.g. "Use Canadian spelling. Answer for a PMO analyst audience."'},
  {cat:'projects',title:'Memory',what:'Claude can remember useful details about you across chats.',how:'Turn it on or off in Settings; ask "what do you remember about me?"'},
  {cat:'projects',title:'Tell it to remember something',what:'Saves a preference for future chats.',how:'"Remember that I prefer tables for comparisons."'},
  {cat:'projects',title:'Profile preferences',what:'Instructions that apply to every chat.',how:'Settings → Profile → personal preferences.'},
  {cat:'projects',title:'Search past chats',what:'Claude can look back at earlier conversations when you refer to them.',how:'Say "continue the resume we worked on last week".'},
  {cat:'projects',title:'Skills',what:'Saved, reusable instructions for a task Claude does the same way every time.',how:'Ask Claude to turn a repeated workflow into a skill.'},
  {cat:'projects',title:'Keep sensitive data out',what:'Don\'t paste passwords, ID numbers or confidential client data.',how:'Remove or mask them first.'},

  // Claude Code keys
  {cat:'code-keys',title:'Stop and redirect',what:'Interrupts Claude mid-turn; work so far is kept.',how:'Press Esc.'},
  {cat:'code-keys',title:'Rewind',what:'On an empty prompt, opens the rewind menu to roll back conversation, code or both.',how:'Press Esc twice.'},
  {cat:'code-keys',title:'Cycle permission modes',what:'Switches between default, accept-edits, plan and auto modes.',how:'Press Shift + Tab (Alt + M on some Windows terminals).'},
  {cat:'code-keys',title:'Run a shell command',what:'Runs it directly and adds the output to the session.',how:'Start the line with !',code:'! git status'},
  {cat:'code-keys',title:'Mention a file',what:'Autocompletes a file path so Claude reads it.',how:'Type @ then part of the name.',code:'@src/app/app.routes.ts'},
  {cat:'code-keys',title:'Show shortcut help',what:'Lists shortcuts on screen.',how:'Type ? on an empty prompt.'},
  {cat:'code-keys',title:'Search your prompt history',what:'Find and reuse an earlier prompt.',how:'Press Ctrl + R.'},
  {cat:'code-keys',title:'New line',what:'Multi-line prompts in any terminal.',how:'Ctrl + J, or \\ then Enter (Shift + Enter in most modern terminals).'},
  {cat:'code-keys',title:'Write the prompt in your editor',what:'Opens the prompt in your default text editor.',how:'Press Ctrl + G.'},
  {cat:'code-keys',title:'Paste an image',what:'Share a screenshot of a UI bug.',how:'Ctrl + V (Cmd + V in iTerm2, Alt + V on Windows).'},
  {cat:'code-keys',title:'Background a long command',what:'Keep working while a build or server runs.',how:'Press Ctrl + B.'},
  {cat:'code-keys',title:'Show the task checklist',what:'See what Claude plans to do and what\'s done.',how:'Press Ctrl + T.'},
  {cat:'code-keys',title:'See the full transcript',what:'Detailed view of every tool call.',how:'Press Ctrl + O.'},
  {cat:'code-keys',title:'Stash a half-written prompt',what:'Save it, ask something else, then bring it back.',how:'Ctrl + S; press again on an empty prompt to restore.'},
  {cat:'code-keys',title:'Switch model without losing your prompt',what:'Change models mid-thought.',how:'Alt + P (Option + P on Mac with Option set as Meta).'},

  // Claude Code commands
  {cat:'code-cmds',title:'/init',what:'Explores the repo and writes a starter CLAUDE.md.',how:'Run it in the first session of any project.',code:'/init'},
  {cat:'code-cmds',title:'/plan',what:'Plan mode: Claude proposes a plan and waits for approval before editing.',how:'Use for anything touching more than a file or two.',code:'/plan add a Tips n Tech page'},
  {cat:'code-cmds',title:'/rewind',what:'Rolls the conversation, the code or both back to a checkpoint.',how:'Use when Claude went down the wrong path.',code:'/rewind'},
  {cat:'code-cmds',title:'/clear',what:'Starts fresh with empty context; project memory stays.',how:'Use when switching to an unrelated task.',code:'/clear'},
  {cat:'code-cmds',title:'/compact',what:'Summarizes the session to free up context.',how:'Add focus instructions.',code:'/compact keep the API decisions'},
  {cat:'code-cmds',title:'/context',what:'Shows how full the context window is.',how:'Check it before a big task.',code:'/context'},
  {cat:'code-cmds',title:'/btw',what:'Ask a side question that stays out of the main conversation.',how:'Great for "what does this flag mean?"',code:'/btw what is a git worktree?'},
  {cat:'code-cmds',title:'/resume',what:'Reopen an earlier session by name or ID.',how:'Use it when you come back the next day.',code:'/resume'},
  {cat:'code-cmds',title:'/model and /effort',what:'Switch model; set reasoning effort from low to max.',how:'Use higher effort for tricky bugs.',code:'/effort high'},
  {cat:'code-cmds',title:'/diff',what:'Interactive view of uncommitted changes.',how:'Review before you commit.',code:'/diff'},
  {cat:'code-cmds',title:'/code-review',what:'Reviews your changes for bugs (alias /review).',how:'Run before opening a pull request.',code:'/code-review'},
  {cat:'code-cmds',title:'/security-review',what:'Checks branch changes for vulnerabilities.',how:'Run on anything handling logins or user input.',code:'/security-review'},
  {cat:'code-cmds',title:'/memory',what:'Edit CLAUDE.md files and see auto-memory entries.',how:'Refine project rules over time.',code:'/memory'},
  {cat:'code-cmds',title:'/permissions',what:'Manage which tools and commands run without asking.',how:'Allow safe ones like tests; deny risky ones.',code:'/permissions'},
  {cat:'code-cmds',title:'/usage',what:'Session cost and plan limits (/cost still works).',how:'Check during long sessions.',code:'/usage'},
  {cat:'code-cmds',title:'/export and /copy',what:'Save the conversation, or copy the last reply.',how:'Keep a record of decisions.',code:'/copy'},
  {cat:'code-cmds',title:'/doctor',what:'Checks your installation and setup.',how:'First step when something seems broken.',code:'/doctor'},
  {cat:'code-cmds',title:'/mcp',what:'Manage MCP servers (connected tools).',how:'/mcp reconnect all retries failed ones.',code:'/mcp'},
  {cat:'code-cmds',title:'Your own commands',what:'A SKILL.md file becomes a /command you can reuse.',how:'Put it in .claude/skills/NAME/SKILL.md.',code:'.claude/skills/deploy/SKILL.md'},

  // Command line
  {cat:'cli',title:'Start with a prompt',what:'Open a session that begins with your request.',how:'Put the prompt in quotes.',code:'claude "explain this repo"'},
  {cat:'cli',title:'Continue where you left off',what:'Reopens the most recent conversation in this folder.',how:'Use -c.',code:'claude -c'},
  {cat:'cli',title:'Resume a named session',what:'Pick up a specific earlier session.',how:'Use -r with the name or ID.',code:'claude -r "auth-refactor"'},
  {cat:'cli',title:'One-shot answer',what:'Prints the answer and exits; good for scripts.',how:'Use -p.',code:'claude -p "summarize CHANGELOG.md"'},
  {cat:'cli',title:'Pipe data in',what:'Send a file or command output to Claude.',how:'Pipe into claude -p.',code:'cat errors.log | claude -p "what failed?"'},
  {cat:'cli',title:'Start in plan mode',what:'Claude only plans until you approve.',how:'Set the permission mode at launch.',code:'claude --permission-mode plan'},
  {cat:'cli',title:'Work in an isolated worktree',what:'Keeps experiments away from your main checkout.',how:'Use -w.',code:'claude -w'},
  {cat:'cli',title:'JSON output for automation',what:'Machine-readable results in print mode.',how:'Add --output-format json.',code:'claude -p "list TODOs" --output-format json'},
  {cat:'cli',title:'Update Claude Code',what:'Get the newest version.',how:'Run the update command.',code:'claude update'},

  // Setup & safety
  {cat:'setup',title:'Keep a CLAUDE.md in every repo',what:'Project rules Claude reads every session: build commands, style, what not to touch.',how:'Generate with /init, then edit it.',code:'CLAUDE.md'},
  {cat:'setup',title:'Write rules as short bullets',what:'"Run npm test before committing" works better than paragraphs.',how:'Keep CLAUDE.md short and specific.'},
  {cat:'setup',title:'First-session checklist',what:'A quick, reliable setup order.',how:'/init → /memory → /mcp → /permissions.'},
  {cat:'setup',title:'Plan first on big changes',what:'A two-minute plan saves an hour of undoing.',how:'Shift + Tab into plan mode, read the plan, then approve.'},
  {cat:'setup',title:'Commit often',what:'Rewind is handy, but git is your real safety net.',how:'Commit after each working step.'},
  {cat:'setup',title:'Skip-permissions only in a sandbox',what:'--dangerously-skip-permissions lets Claude run anything without asking.',how:'Use it only in a throwaway container, never on your main machine.',code:'--dangerously-skip-permissions'},
  {cat:'setup',title:'Review every change',what:'Read diffs and test before merging, even when everything looks right.',how:'/diff, run the tests, then commit.'},
];

export const CLAUDE_KEYS:{keys:string[];what:string}[]=[
  {keys:['Esc'],what:'Stop Claude and redirect'},
  {keys:['Esc','Esc'],what:'Rewind menu'},
  {keys:['Shift','Tab'],what:'Cycle modes (plan, auto…)'},
  {keys:['!'],what:'Run a shell command'},
  {keys:['@'],what:'Mention a file'},
  {keys:['/'],what:'Commands and skills'},
  {keys:['Ctrl','R'],what:'Search prompt history'},
  {keys:['Ctrl','B'],what:'Background a task'},
  {keys:['Ctrl','T'],what:'Task checklist'},
  {keys:['Ctrl','G'],what:'Edit prompt in your editor'},
  {keys:['Ctrl','J'],what:'New line'},
  {keys:['?'],what:'Shortcut help'},
];
