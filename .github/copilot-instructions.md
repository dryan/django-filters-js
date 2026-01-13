# GitHub Copilot Instructions

This document provides guidelines for AI assistants working on this codebase.

---

## Core Principle: Always Ask First

**Default to asking about preferences rather than choosing automatically.** When there are multiple valid approaches or unclear requirements, always ask the user for guidance before proceeding.

When you first encounter decisions about:

- Code organization patterns
- Naming conventions
- Architecture choices
- Testing strategies
- Documentation standards
- Any project-specific preferences

**Stop and ask the user** about their preferences for this project. Do not make assumptions based on general best practices alone.

---

## Always Verify Fixes

**Never claim something is "fixed" without verification.**

When making changes that should resolve an error or issue:

1. Make the change
2. Run the relevant command/test to verify it works
3. Only then report it as fixed

Examples:

- After fixing a config error, run the tool to verify it parses correctly
- After fixing a test, run the test to verify it passes
- After fixing a build error, run the build to verify it succeeds

If verification fails, continue fixing until it actually works.

---

## Show Full Output for Debugging

**Never hide command output with `head`, `tail`, or similar filtering tools.**

When running commands for verification or debugging:

- Show the full output so the user can help diagnose issues
- Don't truncate output with `head -n 10`, `tail -n 20`, etc.
- Don't pipe through `grep` unless specifically filtering for known patterns
- Let the user see all errors, warnings, and diagnostic information

The user needs complete information to assist with debugging. Hiding output makes troubleshooting harder.

---

## Performance First

Performance should always be a top consideration:

- Consider bundle size and runtime performance
- Write efficient code
- Minimize unnecessary computations and re-renders
- Use appropriate data structures and algorithms
- Be mindful of Web Component lifecycle methods

---

## Type Safety

- Everything should be strongly typed
- Avoid `any` - use `unknown` if the type is truly unknown
- Use type assertions sparingly and document why they're needed
- Follow TypeScript best practices

**Type vs Interface:**

- Start with `interface` for object shapes
- Switch to `type` when shapes get advanced (unions, intersections, mapped types)

---

## Web Components Best Practices

### Vanilla Web Components

- Use standard Custom Elements API
- Implement Shadow DOM when appropriate
- Follow the Custom Elements lifecycle: `constructor()`, `connectedCallback()`, `disconnectedCallback()`, `attributeChangedCallback()`
- Use `observedAttributes` static property for reactive attributes
- Keep components focused and composable

### Lit Components

- Use Lit decorators: `@customElement`, `@property`, `@state`, `@query`
- Leverage reactive properties for state management
- Use `html` template literals for templates
- Style with `css` tagged template literals
- Follow Lit's reactive update lifecycle
- Use `@query` and `@queryAll` instead of `querySelector`

### General Web Components Guidelines

- Always define a custom element name with a hyphen (e.g., `my-component`)
- Use semantic HTML within your components
- Implement proper accessibility (ARIA attributes, keyboard navigation)
- Emit custom events for component communication
- Use slots for content projection
- Document your public API (properties, methods, events, slots, CSS custom properties)

---

## Documentation Requirements

### Ask About Documentation Standards

On first encounter, ask the user:

1. What level of documentation is required? (JSDoc, inline comments, separate docs?)
2. Are there specific documentation tags or formats to follow?
3. Should all public APIs be documented?
4. What about internal/private methods?

### General Documentation Guidelines

- Document complex logic with inline comments
- Explain "why" not just "what"
- Keep documentation up to date with code changes
- Use clear, concise language
- For Web Components, document:
  - Properties and attributes
  - Methods
  - Events
  - Slots
  - CSS custom properties
  - CSS Shadow Parts

---

## Code Style and Formatting

This project uses:

- **Prettier** for code formatting (defaults only)
- **ESLint** for JavaScript/TypeScript linting
- **Stylelint** for CSS linting
- **Ruff** for Python linting and formatting (if Python exists)
- **EditorConfig** for editor consistency

**Let the tools handle formatting.** Focus on writing clear, maintainable code.

---

## Python Workflow

### Running Python Commands

**Always run Python commands through `uv`:**

```bash
# Correct
uv run python3 script.py
uv run pytest
uv run python3 -m module

# Incorrect
python3 script.py
pytest
```

This ensures:

- Consistent Python version across environments
- Automatic virtual environment management
- Dependencies are properly resolved

### Dependency Management

**NEVER manually edit `package.json` or `pyproject.toml` to manage dependencies.**

Always use the appropriate package manager commands:

**Node.js/npm:**

```bash
# Correct
npm install package-name
npm install -D package-name
npm uninstall package-name

# Incorrect
# Manually editing package.json dependencies
```

**Python/uv:**

```bash
# Correct
uv add package-name
uv add --dev package-name
uv remove package-name

# Incorrect
# Manually editing pyproject.toml dependencies
```

This ensures:

- Proper lock file updates
- Version resolution
- Dependency tree consistency
- No conflicts or mismatches

You may edit other sections of these files (scripts, configuration, metadata), but never the `dependencies` or `devDependencies` sections.

### Script Management

**Prefer `justfile` recipes over one-off bash scripts:**

- Use `just` for reusable commands and workflows
- Keep project-specific tasks in `justfile`
- Use bash scripts only for complex logic that doesn't fit in recipes
- Document `just` recipes with comments

**Example `justfile`:**

```just
# Run all tests
test:
    uv run pytest

# Type check Python code
typecheck:
    uv run ty

# Run linters
lint:
    uv run ruff check .
    npm run lint:js

# Format all code
format:
    uv run ruff format .
    npm run format

# Check everything (lint + type check + test)
check: lint typecheck test
```

---

## Testing

### Web Components Testing

Use `@web/test-runner` for browser-based tests:

- Test actual browser behavior
- Test with real Shadow DOM
- Use `@web/test-runner-commands` for advanced interactions
- Test across multiple browsers (Chromium, Firefox, WebKit)

**Browser Debugging:**

When debugging browser-based code or Web Components:

- Use the Chrome MCP server when available for interactive browser debugging
- Inspect actual DOM and Shadow DOM states in real-time
- Execute JavaScript in the browser context to test behavior
- Capture screenshots and performance traces for analysis
- This is especially useful for debugging complex Web Component interactions

### Python Testing

Use `pytest`:

- Write clear, focused test functions
- Use fixtures for setup/teardown
- Use parametrize for testing multiple cases
- Keep tests fast and isolated

**Python Type Checking:**

Use `ty` (Pyright CLI) for static type checking:

- Run `uv run ty` to type check Python code
- Use `uv run ty --watch` for continuous checking
- Configure strictness in `pyproject.toml` under `[tool.pyright]`
- Type checking modes: `basic`, `standard` (default), or `strict`
- Always add type hints to function signatures and complex variables

**Python Code Quality Tools:**

Use additional tools for code quality:

- **Vulture**: Detect dead/unused code (`uv run vulture src/`)

  - Reports functions, classes, variables, imports that are never used
  - Configure `min_confidence` in `pyproject.toml` (default: 80)
  - Useful for finding code that can be safely removed

- **django-upgrade**: Modernize Django code (Django projects only)

  - Run `uv run django-upgrade --target-version 5.1 src/**/*.py`
  - Updates deprecated Django patterns to modern equivalents
  - Automatically fixes outdated code
  - Only run on Django projects

- **Note**: pyupgrade functionality is already handled by Ruff's UP rules
  - Ruff includes all pyupgrade checks in the "UP" rule selector
  - No need to run pyupgrade separately

### General Testing Guidelines

- Write tests for critical functionality
- Test edge cases and error conditions
- Keep tests focused and maintainable
- Use descriptive test names
- Aim for high coverage but focus on meaningful tests

---

## Accessibility

- Follow WCAG 2.2 guidelines when applicable
- Use semantic HTML when working with markup
- Prefer native HTML elements over ARIA when possible
- Ensure keyboard navigation works correctly
- Test with screen readers when building UI components
- Use proper ARIA roles, states, and properties
- Ensure focus management is correct
- Provide text alternatives for non-text content

---

## Common Mistakes to Avoid

### DON'T

1. **Don't make assumptions** - ask for clarification when uncertain
2. **Don't ignore performance** - always consider the impact of your changes
3. **Don't use `any` type** - use proper types or `unknown`
4. **Don't skip error handling** - handle edge cases and errors appropriately
5. **Don't mix concerns** - keep code modular and focused
6. **Don't ignore existing patterns** - follow established conventions in the codebase
7. **Don't commit commented-out code** - remove it or explain why it's needed
8. **Don't hardcode values** - use constants, config files, or environment variables
9. **Don't duplicate code** - extract shared logic into reusable functions
10. **Don't forget to update tests** - keep tests in sync with code changes
11. **Don't use `innerHTML` without sanitization** - XSS risk
12. **Don't forget Shadow DOM encapsulation** - styles and queries don't cross boundaries
13. **Don't leak memory** - clean up event listeners in `disconnectedCallback`

### DO

1. **Do ask questions** when the path forward is unclear
2. **Do consider performance** in all decisions
3. **Do follow existing patterns** in the codebase
4. **Do write clear, self-documenting code** with good variable names
5. **Do handle errors gracefully** with appropriate error messages
6. **Do keep functions small and focused** - single responsibility principle
7. **Do use meaningful names** for variables, functions, and types
8. **Do write tests** for new functionality
9. **Do keep dependencies up to date** - but test after updating
10. **Do document complex logic** with comments explaining "why"
11. **Do use Shadow DOM** when you need style encapsulation
12. **Do dispatch custom events** for component communication
13. **Do use slots** for flexible content composition
14. **Do implement proper lifecycle methods** for setup and cleanup

---

## File Organization

### Web Components Projects

```
src/
  components/        # Custom element definitions
    my-component.ts
    another-component.ts
  utils/            # Utility functions
  styles/           # Shared styles
  types/            # TypeScript type definitions
tests/              # Test files (if separate from src/)
```

### Python Projects

```
src/
  module_name/
    __init__.py
    module.py
tests/
  test_module.py
```

### Hybrid Projects

Organize by feature or domain, with clear separation between Python and TypeScript/JavaScript code.

### General Guidelines

- Keep related files together
- Use consistent file naming conventions (kebab-case for files, PascalCase for classes)
- Organize by feature or domain when appropriate
- Keep the project structure flat when possible
- Don't create unnecessary nesting

---

## Import/Export Patterns

### TypeScript/JavaScript

- Use path aliases configured in `tsconfig.json` (`@/`, `~/`, `@components/`, etc.)
- Prefer named exports over default exports
- Group imports logically:
  1. External dependencies (lit, third-party)
  2. Internal modules (@/, ~/)
  3. Relative imports (../, ./)
  4. Type imports (separate `import type` statements)

Example:

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { someUtil } from "@/utils/helpers";
import { sharedStyles } from "@styles/shared";

import type { MyType } from "@types/common";
```

### Python

- Follow PEP 8 import ordering
- Use absolute imports when possible
- Group imports:
  1. Standard library
  2. Third-party packages
  3. Local application imports

---

## Git and Version Control

- Write clear, descriptive commit messages
- Use gitmoji prefixes for commit messages (e.g., ✨ for new features, 🐛 for bug fixes, 📝 for documentation)
- Commit frequently - don't wait until everything is perfect
- Keep commits focused on a single change
- Follow the project's branching strategy
- Don't commit generated files or secrets
- Keep pull requests reasonably sized

---

## Browser/Platform Support

### Web Components

- Target modern browsers (ES2022+)
- Use native Custom Elements (no polyfills needed for modern browsers)
- Test in Chromium, Firefox, and WebKit
- Be aware of Safari quirks with Shadow DOM and custom elements

### Python

- Target Python 3.11+ (adjust based on project)
- Use type hints for Python 3.11+ features
- Be aware of breaking changes between Python versions

---

## Dependencies

### Ask Before Adding Dependencies

Before adding new dependencies:

1. Is this dependency necessary?
2. Are there alternatives already in the project?
3. What is the bundle size impact?
4. Is it actively maintained?
5. Does it have known security issues?
6. Is it tree-shakeable?

**Always ask the user before adding new dependencies.**

### Web Components Dependencies

- Prefer native Web APIs over libraries
- Use Lit for reactive components when complexity warrants it
- Keep bundle size small - Web Components should be lightweight
- Avoid large framework dependencies (React, Vue, Angular)

---

## Language-Specific Guidelines

### TypeScript

- Use ES2022+ features when appropriate
- Prefer `const` over `let`, avoid `var`
- Use async/await over raw promises
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Avoid deeply nested code
- Use `satisfies` operator for type checking without widening

### JavaScript

- Prefer TypeScript for new files
- If writing vanilla JS, add JSDoc types
- Follow the same patterns as TypeScript code

### CSS

- Use modern CSS features (custom properties, grid, flexbox, container queries)

### Python

- Follow PEP 8 style guide
- Use type hints (Python 3.11+ syntax) - **always type function signatures**
- Run `uv run ty` to validate type hints
- Write docstrings for functions and classes (Google or NumPy style)
- Use context managers for resource management
- Prefer list comprehensions and generators
- Use dataclasses or Pydantic for structured data
- Import types from `typing` when needed (e.g., `List`, `Dict`, `Optional`, `Union`)

- Follow PEP 8 style guide
- Use type hints (Python 3.11+ syntax)
- Write docstrings for functions and classes (Google or NumPy style)
- Use context managers for resource management
- Prefer list comprehensions and generators
- Use dataclasses or Pydantic for structured data

### HTML

- Use semantic HTML5 elements
- Ensure proper document structure
- Include appropriate meta tags
- Use ARIA only when necessary
- Keep markup clean and minimal
- For Web Components, use slots for content projection

---

## Security

- Never commit secrets, API keys, or passwords
- Validate and sanitize user input
- Use parameterized queries for database access
- Follow OWASP guidelines for web security
- Be cautious with `eval()` and similar dynamic execution
- Use HTTPS for external requests
- Handle authentication and authorization properly
- Sanitize HTML when using `innerHTML` (prefer `textContent` or template literals)
- Be careful with custom event data - don't leak sensitive info

---

## Web Components Specific

### Shadow DOM

- Use Shadow DOM for style encapsulation
- Understand the difference between open and closed Shadow Roots
- Use `:host`, `:host()`, and `:host-context()` for styling
- Use `::slotted()` for styling slotted content
- Use `::part()` for exposing styleable parts

### Custom Events

- Use `CustomEvent` with descriptive names
- Namespace event names to avoid conflicts (e.g., `my-component:change`)
- Include relevant data in `detail` property
- Set `bubbles: true` if event should bubble
- Set `composed: true` if event should cross Shadow DOM boundary
- Document all custom events

### Attributes vs Properties

- Reflect important properties as attributes (for CSS selectors and HTML)
- Use primitive types for attributes (string, number, boolean)
- Use properties for complex types (objects, arrays)
- Convert between attributes and properties appropriately
- Follow naming conventions: `kebab-case` for attributes, `camelCase` for properties

### Lifecycle

- Initialize in `constructor()` (but don't manipulate DOM or attributes)
- Set up in `connectedCallback()` (add event listeners, fetch data)
- Clean up in `disconnectedCallback()` (remove event listeners, cancel timers)
- Handle attribute changes in `attributeChangedCallback()`
- For Lit, use `firstUpdated()`, `updated()`, and `willUpdate()` lifecycle methods

---

## Questions or Uncertainty?

**When in doubt, ASK!** This is the most important rule.

It's better to ask for clarification than to make incorrect assumptions about:

- Project requirements
- Implementation approaches
- Design decisions
- Architecture patterns
- Conventions and standards
- Any aspect of the codebase

---

## Working with This Project

### First Steps

When you first start working with this project:

1. **Ask about the project type**: What kind of project is this? (library, application, Django site, 11ty site, etc.)
2. **Ask about tech stack**: Web Components? Lit? Python? Hybrid?
3. **Ask about conventions**: Are there coding standards or style guides to follow?
4. **Ask about priorities**: What are the most important considerations? (performance, accessibility, maintainability, etc.)
5. **Ask about workflow**: What is the development and deployment process?

### Ongoing Work

- Read existing code to understand established patterns
- Follow the conventions you see in the codebase
- Ask questions when you encounter ambiguity
- Suggest improvements when you see opportunities
- Be respectful of existing decisions while offering alternatives

---

## Communication

- Be clear and concise in explanations
- Provide context for decisions
- Explain trade-offs when multiple approaches exist
- Use examples to illustrate complex concepts
- Be open to feedback and alternative approaches

---

**Remember**: Every project is different. These guidelines are a starting point, but always defer to project-specific requirements and user preferences. **When in doubt, ask!**
