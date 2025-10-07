# Project Rules - Multi-Application Development Workflow

## Overview

This workspace contains multiple independent applications, each in its own folder. Applications may use different technology stacks and languages. This document defines the standardized development workflow that AI coding assistants must follow when working on any application in this workspace.

## Project Structure Standards

### Workspace Organization
```
/workspace-root/
├── app-name-1/                    # Each app in its own folder
│   ├── specs/                     # Specification documents
│   │   ├── 001-feature-name/      # Numbered feature specs
│   │   │   ├── spec.md           # Product Requirements Document (PRD)
│   │   │   ├── plan.md           # Technical implementation plan
│   │   │   ├── research.md       # Research findings and decisions
│   │   │   ├── data-model.md     # Data structures and schemas
│   │   │   ├── contracts/        # API contracts and interfaces
│   │   │   └── quickstart.md     # Quick reference guide
│   ├── memory/                    # Project-specific memory/context
│   │   └── constitution.md       # Development principles & guidelines
│   ├── src/                       # Source code
│   ├── README.md                  # Project overview
│   └── [tech-stack-specific-files]
├── app-name-2/
└── PROJECT_RULES.md              # This file (workspace-level)
```

### Folder Naming Conventions
- **Applications**: Use kebab-case (e.g., `flash-tldr-extension`, `data-pipeline-service`)
- **Spec folders**: Use numbered prefixes (e.g., `001-initial-feature`, `002-enhancement`)
- **Component folders**: Follow the language/framework conventions (e.g., `src/`, `lib/`, `components/`)

## Three-Phase Development Process

All application development must follow this structured workflow:

---

## PHASE 1: EXPLORATION & RESEARCH

**Goal**: Understand the problem space, architecture options, and technical decisions.

### For New Projects

#### 1.1 Initial Research
**AI Assistant Actions:**
- Create a new application folder with proper structure
- Research similar projects and solutions
- Use MCP server tools to gather relevant documentation:
  - `mcp_context7` for framework/library documentation
  - Web search for best practices and examples
  - Review existing projects in workspace for patterns
- Document findings in `specs/001-project-name/research.md`

**Research Document Template:**
```markdown
# Research: [Project Name]

## Problem Statement
[Clear description of what needs to be built]

## Technology Stack Options
### Option 1: [Stack Name]
- **Pros**: 
- **Cons**: 
- **Use Cases**: 

### Option 2: [Stack Name]
...

## Architecture Patterns Explored
[Document architectural approaches considered]

## Similar Projects & Inspirations
- [Project Name]: [URL] - [Key learnings]

## Key Technical Decisions
| Decision | Options Considered | Chosen Approach | Rationale |
|----------|-------------------|-----------------|-----------|
| ...      | ...               | ...             | ...       |

## Resources & References
- [Framework Documentation]: [URL]
- [Tutorial/Example]: [URL]
```

#### 1.2 Architecture Exploration
**AI Assistant Actions:**
- Identify architectural patterns suitable for the use case
- Consider scalability, maintainability, and performance
- Document architecture diagrams and component relationships
- Explore integration points with external services
- Research deployment and infrastructure requirements

### For Existing Projects

#### 1.1 Codebase Analysis
**AI Assistant Actions:**
- Use `codebase_search` to understand existing architecture
- Map out current components and their relationships
- Identify existing patterns and conventions
- Document technical debt and improvement opportunities
- Locate integration points and dependencies

**Analysis Checklist:**
- [ ] Core components and their responsibilities identified
- [ ] Data flow and state management understood
- [ ] External dependencies and APIs mapped
- [ ] Testing approach and coverage assessed
- [ ] Deployment and infrastructure documented
- [ ] Known issues and limitations catalogued

#### 1.2 Integration Points Analysis
**AI Assistant Actions:**
- Document how new features will integrate with existing code
- Identify affected components and potential breaking changes
- Map out data dependencies and side effects
- Plan backwards compatibility strategies
- Document migration requirements if needed

**Integration Points Document Template:**
```markdown
# Integration Points: [Feature Name]

## Affected Components
- **Component Name**: [Description of changes needed]
- **Component Name**: [Description of changes needed]

## Data Dependencies
- **Existing Data**: [How will this be used/modified]
- **New Data**: [What new data structures are needed]

## API Changes
- **Breaking Changes**: [List any breaking changes]
- **New Endpoints**: [List new APIs]
- **Modified Endpoints**: [List changes to existing APIs]

## Backwards Compatibility
[Strategy for maintaining compatibility]

## Migration Plan
[Steps needed to migrate existing data/code]
```

---

## PHASE 2: SPECIFICATION & PRD CREATION

**Goal**: Produce a detailed Product Requirements Document (PRD) with comprehensive feature specifications.

### 2.1 PRD Components

**Required Sections:**
1. **Overview**: Problem statement and solution summary
2. **Functional Requirements**: Detailed feature specifications (FR1, FR2, etc.)
3. **User Stories**: Organized by epics with acceptance criteria
4. **Non-Functional Requirements**: Performance, security, scalability (NFR1, NFR2, etc.)
5. **Technical Constraints**: Limitations and dependencies
6. **Success Metrics**: Measurable goals and KPIs
7. **Acceptance Checklist**: Review criteria before completion

### 2.2 MCP Tools for Documentation

**AI Assistant Actions:**

#### For New Projects (High-Level, Simple MVP)
```
1. Use `mcp_context7_resolve-library-uri` to find relevant framework docs
2. Use `mcp_context7_search-library-docs` to include code examples
3. Keep PRD focused on MVP features only
4. Reference supporting documentation and examples
5. Emphasize simplicity and quick iteration
```

**Example MCP Usage:**
```typescript
// Resolve Next.js documentation
mcp_context7_resolve-library-uri({ libraryName: "next.js" })

// Search for specific topics
mcp_context7_search-library-docs({ 
  resourceURI: "context7://libraries/nextjs",
  topic: "server components and data fetching",
  tokens: 5000
})
```

#### For Existing Projects (Detailed, Integration-Focused)
```
1. Document integration points with existing codebase
2. Reference specific files, functions, and patterns in current code
3. Include detailed technical specifications
4. Map out data migrations and compatibility concerns
5. Reference existing tests and patterns to follow
```

### 2.3 Spec Document Structure

**File Organization in `specs/NNN-feature-name/`:**

#### spec.md (Primary PRD)
```markdown
# [Feature Name] - Product Requirements Document

## Overview
[High-level description and value proposition]

## Problem Statement
### Current Pain Points
- [List specific problems]

### Target Users
- [Define user personas]

## Solution
### Core Value Proposition
[What makes this valuable]

### Key Differentiators
[What makes this unique]

## Functional Requirements
### FR1: [Feature Area]
- **FR1.1**: [Specific requirement]
- **FR1.2**: [Specific requirement]

### FR2: [Feature Area]
...

## User Stories
### Epic 1: [Epic Name]
**As a [user type]**, I want [goal] so that [benefit].

- **US1.1**: [Specific story]
- **US1.2**: [Specific story]

## Non-Functional Requirements
### NFR1: Performance
- **NFR1.1**: [Specific metric]

### NFR2: Security
...

## Success Metrics
[Measurable goals and KPIs]

## Review & Acceptance Checklist
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

#### plan.md (Technical Implementation Plan)
```markdown
# [Feature Name] - Technical Implementation Plan

## Architecture Overview
[System architecture diagram and description]

## Technology Stack
[Detailed stack decisions]

## Data Flow Architecture
[How data moves through the system]

## Implementation Details
[Component-by-component technical specifications]

## Build & Deployment Pipeline
[Build process and deployment strategy]

## Security Implementation
[Security measures and compliance]

## Performance Optimization
[Performance strategies and benchmarks]

## Error Handling Strategy
[Error categories and recovery approaches]

## Testing Strategy
[Testing approach and coverage]

## Deployment Process
[Release and deployment procedures]

## Maintenance & Updates
[Long-term maintenance plan]
```

#### contracts/api-contracts.md (For API-heavy features)
```markdown
# API Contracts

## Endpoints

### GET /api/resource
**Description**: [What this endpoint does]

**Request:**
```json
{
  "param1": "value"
}
```

**Response:**
```json
{
  "data": {}
}
```

**Error Codes:**
- `400`: [Description]
- `404`: [Description]
```

#### data-model.md (Data Structures)
```markdown
# Data Model

## Core Entities

### EntityName
```typescript
interface EntityName {
  id: string;
  field1: string;
  field2: number;
  // ...
}
```

**Storage**: [Where and how this is stored]
**Relationships**: [Related entities]
```

---

## PHASE 3: TASK BREAKDOWN & IMPLEMENTATION PLAN

**Goal**: Create a detailed, actionable task list for AI coding assistant to execute.

### 3.1 Task Document Creation

**AI Assistant Actions:**
- Create `specs/NNN-feature-name/tasks.md`
- Break down PRD into specific, actionable tasks
- Organize tasks by component/area
- Include dependencies and ordering
- Reference specific sections of spec.md and plan.md

**Task Document Template:**
```markdown
# Implementation Tasks: [Feature Name]

**Based on**: 
- PRD: `specs/NNN-feature-name/spec.md`
- Plan: `specs/NNN-feature-name/plan.md`

## Task Organization

### Phase 1: Foundation (Tasks 1-5)
**Goal**: Set up project structure and core dependencies

#### Task 1: Project Initialization
- **Description**: Initialize project with tech stack
- **Spec Reference**: plan.md → Technology Stack
- **Actions**:
  - [ ] Create project structure
  - [ ] Initialize package manager
  - [ ] Configure build tools
  - [ ] Set up TypeScript/language config
- **Acceptance Criteria**:
  - Build process works
  - Development environment configured
- **Dependencies**: None
- **Estimated Complexity**: Low

#### Task 2: [Next Task]
...

### Phase 2: Core Features (Tasks 6-15)
**Goal**: Implement primary functional requirements

#### Task 6: [Feature Implementation]
- **Description**: [What needs to be built]
- **Spec Reference**: spec.md → FR1.1-FR1.5
- **Actions**:
  - [ ] [Specific action]
  - [ ] [Specific action]
- **Acceptance Criteria**:
  - [Specific criterion]
- **Dependencies**: Task 1, Task 3
- **Estimated Complexity**: High
- **Files to Create/Modify**:
  - `src/components/Feature.tsx`
  - `src/lib/helper.ts`

### Phase 3: Integration & Testing (Tasks 16-20)
...

### Phase 4: Polish & Documentation (Tasks 21-25)
...

## Resource References

### Documentation
- [Framework Docs]: [URL from research.md]
- [API Reference]: [URL]

### Code Examples
- [Similar Implementation]: [URL or file path]

### Integration Points (For Existing Projects)
- **Affected Files**: 
  - `src/existing/module.ts` - [What changes are needed]
- **New Dependencies**: 
  - [Package name] - [Why it's needed]

## Testing Checklist
- [ ] Unit tests for core functions
- [ ] Integration tests for component interactions
- [ ] End-to-end tests for user workflows
- [ ] Performance testing against NFR metrics
- [ ] Security testing against requirements

## Deployment Checklist
- [ ] Build process optimized
- [ ] Environment variables documented
- [ ] Deployment scripts created
- [ ] Documentation updated
- [ ] Migration scripts (if needed)
```

### 3.2 Using Todo Tool for Task Execution

**When implementing tasks, AI Assistant should:**

1. **Create initial todos** from the task breakdown:
```typescript
todo_write({
  merge: false,
  todos: [
    { id: "task-1", content: "Initialize project structure", status: "pending" },
    { id: "task-2", content: "Configure build tools", status: "pending" },
    // ...
  ]
})
```

2. **Mark tasks in progress** as you work on them:
```typescript
todo_write({
  merge: true,
  todos: [
    { id: "task-1", status: "in_progress" }
  ]
})
```

3. **Mark completed** and move to next:
```typescript
todo_write({
  merge: true,
  todos: [
    { id: "task-1", status: "completed" },
    { id: "task-2", status: "in_progress" }
  ]
})
```

---

## AI Assistant Guidelines for Each Phase

### Phase 1: Exploration Guidelines

**✅ DO:**
- Thoroughly research before proposing solutions
- Use multiple search queries with different phrasings
- Document all considered options, not just the chosen one
- Look for existing patterns in the workspace
- Consider trade-offs explicitly
- Ask clarifying questions if requirements are ambiguous

**❌ DON'T:**
- Jump to implementation without research
- Choose technologies without justification
- Skip documenting alternative approaches
- Ignore existing project patterns
- Make assumptions without validation

### Phase 2: Specification Guidelines

**✅ DO:**
- Write clear, specific, measurable requirements
- Include user stories with acceptance criteria
- Reference concrete examples and documentation
- Use consistent terminology throughout
- Create detailed non-functional requirements
- Organize requirements by priority/dependency

**❌ DON'T:**
- Write vague or ambiguous requirements
- Skip user stories or acceptance criteria
- Create specs without technical feasibility
- Mix implementation details in requirements
- Forget about edge cases and error conditions

### Phase 3: Task Breakdown Guidelines

**✅ DO:**
- Break work into small, actionable tasks
- Define clear acceptance criteria for each task
- Identify dependencies between tasks
- Estimate complexity (Low/Medium/High)
- Reference specific spec sections
- Include code-level details (files, functions)
- Group related tasks into logical phases

**❌ DON'T:**
- Create tasks that are too large or vague
- Forget to specify dependencies
- Skip acceptance criteria
- Mix unrelated work in single tasks
- Ignore testing and documentation tasks

---

## Constitution & Memory Guidelines

### Creating Project Constitution

**For each new application**, create `memory/constitution.md`:

**Required Sections:**
1. **Core Principles**: Fundamental values (privacy, UX, security, etc.)
2. **Development Guidelines**: Code style, standards, conventions
3. **Decision-Making Framework**: How to evaluate options
4. **Quality Assurance**: Testing and review standards
5. **Continuous Improvement**: Learning and adaptation processes

**Reference**: See `/flash-tldr-extension/memory/constitution.md` as example

### When to Update Constitution

**AI Assistant should propose updates when:**
- Significant architectural decisions are made
- New patterns or conventions are established
- Quality issues reveal gaps in guidelines
- User provides explicit feedback on process

---

## File Naming and Organization Standards

### Specification Files
- **PRD**: `spec.md` (always this name)
- **Technical Plan**: `plan.md` (always this name)
- **Research**: `research.md`
- **Tasks**: `tasks.md`
- **API Contracts**: `contracts/api-contracts.md`
- **Data Models**: `data-model.md`
- **Quick Reference**: `quickstart.md`

### Code Files
- Follow language/framework conventions
- Use consistent naming within project
- Document conventions in constitution.md

### Documentation Files
- **README.md**: Project overview and getting started
- **DEVELOPMENT_LOG.md**: Development history and decisions
- **TROUBLESHOOTING.md**: Common issues and solutions
- **INSTALLATION.md**: Detailed installation instructions

---

## MCP Tools Usage Guidelines

### When to Use MCP Context7

**Scenarios:**
1. **New Framework/Library**: Get up-to-date documentation
2. **Best Practices**: Find recommended patterns
3. **Code Examples**: Include reference implementations
4. **API References**: Document external services

**Process:**
```javascript
// Step 1: Resolve library URI
const uri = await mcp_context7_resolve-library-uri({ 
  libraryName: "react" 
});

// Step 2: Search for specific topics
const docs = await mcp_context7_search-library-docs({
  resourceURI: uri,
  topic: "hooks and state management",
  tokens: 5000  // Adjust based on needs
});

// Step 3: Include in spec.md or plan.md
```

### When to Use Web Search

**Scenarios:**
1. **Latest Updates**: Check for recent changes
2. **Community Patterns**: Find real-world examples
3. **Comparison**: Evaluate competing solutions
4. **Troubleshooting**: Research specific issues

---

## Quality Checklist

### Phase 1 Complete When:
- [ ] Research document exists with ≥3 options evaluated
- [ ] Technology stack chosen with clear rationale
- [ ] Architecture approach documented
- [ ] Integration points identified (existing projects)
- [ ] Resources and references compiled

### Phase 2 Complete When:
- [ ] spec.md contains all functional requirements
- [ ] plan.md contains technical implementation details
- [ ] User stories written with acceptance criteria
- [ ] Non-functional requirements specified
- [ ] Success metrics defined
- [ ] API contracts documented (if applicable)
- [ ] Data models defined
- [ ] All references to external docs included

### Phase 3 Complete When:
- [ ] tasks.md created with full task breakdown
- [ ] Tasks organized by phase/component
- [ ] Dependencies between tasks documented
- [ ] Acceptance criteria for each task defined
- [ ] Files to modify/create listed
- [ ] Testing strategy included
- [ ] Deployment checklist included

---

## Examples and Templates

### Example: Starting a New Web Application

**Phase 1 - Research:**
```bash
User: "I want to build a task management web app"

AI Assistant:
1. Creates: new-task-app/specs/001-initial-mvp/research.md
2. Researches:
   - Web frameworks (React, Vue, Svelte, Next.js)
   - State management approaches
   - Backend options (REST, GraphQL, tRPC)
   - Database options (Postgres, MongoDB, SQLite)
3. Uses MCP tools:
   - Resolves Next.js, React, Prisma documentation
   - Searches for task management examples
4. Documents findings with pros/cons/rationale
5. Proposes: Next.js + tRPC + Prisma + Postgres
```

**Phase 2 - Specification:**
```bash
AI Assistant:
1. Creates spec.md with:
   - Functional Requirements: Task CRUD, filtering, tags
   - User Stories: 10+ stories across 3 epics
   - NFRs: Performance (<100ms), Security (auth), UX
2. Creates plan.md with:
   - Architecture diagram
   - Component structure
   - API design
   - Database schema
3. Uses MCP for documentation:
   - Next.js App Router examples
   - tRPC procedures examples
   - Prisma schema references
```

**Phase 3 - Tasks:**
```bash
AI Assistant creates tasks.md:

Phase 1: Foundation (Tasks 1-5)
- Task 1: Initialize Next.js with TypeScript
- Task 2: Set up Prisma with Postgres
- Task 3: Configure tRPC router
- Task 4: Implement authentication
- Task 5: Create base UI components

Phase 2: Core Features (Tasks 6-12)
- Task 6: Task CRUD operations
- Task 7: Task filtering and search
- Task 8: Tag management
...

Then creates todos and starts implementation.
```

### Example: Adding Feature to Existing Project

**Phase 1 - Analysis:**
```bash
User: "Add export functionality to flash-tldr-extension"

AI Assistant:
1. Uses codebase_search to understand:
   - Current data structures
   - Storage mechanisms
   - UI patterns
2. Documents in research.md:
   - Integration points: StorageManager, SummaryOverlay
   - Affected files: popup.ts, storage-manager.ts
   - Export formats: Markdown, JSON, CSV
3. Evaluates implementation approaches
```

**Phase 2 - Specification:**
```bash
AI Assistant creates detailed spec with:
- FR1: Export single summary
- FR2: Export multiple summaries
- FR3: Choose export format
- Integration points with existing:
  - StorageManager.getSummaries()
  - Popup UI buttons
  - File download mechanism
- References existing patterns in codebase
```

**Phase 3 - Tasks:**
```bash
AI Assistant breaks down:
- Task 1: Add export methods to StorageManager
  - Files: src/lib/storage-manager.ts
  - Dependencies: None
- Task 2: Create export UI components
  - Files: src/popup/popup.ts, src/popup/popup.html
  - Dependencies: Task 1
- Task 3: Implement format converters
  - Files: src/lib/export-formatter.ts (new)
- Task 4: Add tests
...
```

---

## Special Considerations

### Multi-Language Projects

**When project uses multiple languages:**
- Document tech stack clearly in research.md
- Create separate build/deployment sections in plan.md
- Consider integration points between language boundaries
- Document tooling for each language component

### Monorepo vs Multi-Repo

**Current Setup**: Each app is independent in its folder
- Each app has complete independence
- Apps can share resources via workspace-level docs
- No shared dependencies unless explicitly designed

### Version Control Guidelines

**AI Assistant should:**
- NOT automatically commit changes
- Explain what files were modified and why
- Suggest appropriate commit messages
- Follow conventional commits format if project uses it

---

## Communication Guidelines

### When Interacting with User

**AI Assistant should:**

**At Phase Start:**
- Confirm understanding of requirements
- Ask clarifying questions if needed
- Explain the approach before starting

**During Phase:**
- Show progress transparently
- Explain significant decisions
- Ask for input on important choices

**At Phase Completion:**
- Summarize what was created
- Highlight key decisions made
- Ask if user wants to proceed to next phase or iterate

**Example:**
```
AI: "I've completed Phase 1 research for the task management app. 

Key decisions:
- Tech Stack: Next.js 14 + tRPC + Prisma + Postgres
- Architecture: Server Components with tRPC for data mutations
- Rationale: Best performance, type safety, and DX

Research document: specs/001-task-app-mvp/research.md

Would you like me to proceed to Phase 2 (creating the detailed spec), 
or would you like to review/modify any of these decisions first?"
```

---

## Troubleshooting Common Issues

### Issue: Requirements are ambiguous
**Solution:** 
- Ask specific clarifying questions
- Provide multiple interpretations
- Suggest concrete examples
- Reference similar features in research

### Issue: Too many options in Phase 1
**Solution:**
- Narrow down to top 2-3 options
- Use clear evaluation criteria
- Focus on project-specific needs
- Document rejected options briefly

### Issue: Spec is too large/complex
**Solution:**
- Break into multiple spec folders (001, 002, etc.)
- Focus on MVP for new projects
- Use incremental approach
- Reference other specs for dependencies

### Issue: Tasks are unclear
**Solution:**
- Add more acceptance criteria
- Include code examples
- Reference specific lines in existing files
- Break large tasks into subtasks

---

## Summary: Quick Reference

### Phase 1 Checklist ✅
- [ ] Create `specs/NNN-name/research.md`
- [ ] Research ≥3 options for major decisions
- [ ] Use MCP tools for documentation
- [ ] Document chosen approach with rationale
- [ ] Identify integration points (existing projects)

### Phase 2 Checklist ✅
- [ ] Create `spec.md` with all requirements
- [ ] Create `plan.md` with technical details
- [ ] Write user stories with acceptance criteria
- [ ] Define success metrics
- [ ] Document API contracts if needed
- [ ] Include code examples from MCP docs

### Phase 3 Checklist ✅
- [ ] Create `tasks.md` with full breakdown
- [ ] Organize tasks by phase
- [ ] Define dependencies
- [ ] Add acceptance criteria for each task
- [ ] List files to create/modify
- [ ] Create testing & deployment checklists

### Then: Implementation 🚀
- [ ] Create todos using `todo_write` tool
- [ ] Work through tasks systematically
- [ ] Mark progress transparently
- [ ] Test against acceptance criteria
- [ ] Update documentation

---

**Last Updated**: October 5, 2025  
**Version**: 1.0  
**Applies To**: All applications in langgraph-projects workspace





