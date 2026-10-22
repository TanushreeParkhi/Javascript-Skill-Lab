# Student Task Manager

A small task manager built with plain HTML, CSS and JavaScript. No frameworks, no build step.
Built during the **Interactive Frontend Development: 1-Day JavaScript Workshop**.

## Features

- Add tasks (input is trimmed and validated)
- Mark tasks complete or pending, delete tasks
- Filter by **All**, **Pending** or **Completed**
- Tasks survive a page refresh (`localStorage` + JSON)
- **Daily Tip** banner fetched from an API with `fetch` and `async/await`, cached for the day, with an offline fallback

## Run it

Open `index.html` in a browser, or use the **Live Server** extension in VS Code.

## Project structure

```
index.html   page structure (HTML)
style.css    layout and look (CSS)
script.js    behaviour: state, events, rendering, storage, API (JavaScript)
```

## How it works

Every feature follows the same loop:

1. **User action** (click, type, submit)
2. **Event** captured with `addEventListener`
3. **State change**: the `tasks` array is updated
4. **Persistence**: saved with `JSON.stringify` into `localStorage`
5. **DOM update**: `renderTasks()` redraws the list from the array

One task looks like this:

```json
{ "id": 1729300000000, "title": "Lab Report", "completed": false }
```

## API used

Daily Tip: `GET https://dummyjson.com/quotes/random` returns `{ "id", "quote", "author" }`.
No API key is needed. If the request fails, the banner shows a built-in tip instead.

## Git workflow used in the workshop

| Branch | Purpose |
|---|---|
| `main` | Always working. Nobody commits here directly |
| `feature/add-task` | Add, render, toggle, delete, filter |
| `feature/persistence` | `saveTasks()` and `loadTasks()` |
| `feature/daily-tip` | Daily Tip API sprint |

```bash
git switch -c feature/add-task
git add .
git commit -m "Implement add logic"
git push -u origin feature/add-task
# open a Pull Request on GitHub, review, merge into main
```

## Deploy with GitHub Pages

1. Push the merged code to `main`
2. Repository **Settings**, then **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, then **Save**
4. After a minute your site is live at `https://<username>.github.io/<repository>/`

## Ideas to extend

- Edit a task's title
- Due dates and sorting
- "Clear completed" button
- Dark mode toggle
- Save the chosen filter
