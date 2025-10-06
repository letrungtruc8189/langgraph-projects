# Quick Reference - Multi-App Development Workflow

## 🚀 Starting a New Project

### 1. Research Phase (15-30 min)
```bash
📁 Create: app-name/specs/001-project-name/research.md
🔍 Research: Tech stacks, architectures, patterns
🛠️ Tools: MCP Context7, web search, existing projects
📝 Output: Technology decisions with rationale
```

### 2. Specification Phase (30-60 min)
```bash
📁 Create: spec.md + plan.md + data-model.md
📋 Content: Functional requirements, user stories, NFRs
🛠️ Tools: MCP docs for examples/references
📝 Output: Complete PRD and technical plan
```

### 3. Task Breakdown Phase (15-30 min)
```bash
📁 Create: tasks.md
✅ Content: Actionable tasks with dependencies
🛠️ Tools: Break down spec into implementation steps
📝 Output: Ready-to-execute task list
```

### 4. Implementation Phase (varies)
```bash
🔧 Use: todo_write tool to track progress
⚡ Execute: Tasks systematically
✅ Test: Against acceptance criteria
📚 Document: As you build
```

---

## 📋 Essential Commands for AI Assistant

### Phase 1: Research
```javascript
// Get framework documentation
mcp_context7_resolve-library-uri({ libraryName: "next.js" })

// Search specific topics
mcp_context7_search-library-docs({ 
  resourceURI: "context7://libraries/nextjs",
  topic: "server components",
  tokens: 5000
})

// Analyze existing codebase
codebase_search({ 
  query: "How does authentication work?",
  target_directories: []
})
```

### Phase 3: Task Management
```javascript
// Create initial tasks
todo_write({
  merge: false,
  todos: [
    { id: "1", content: "Set up project", status: "pending" },
    { id: "2", content: "Core feature", status: "pending" }
  ]
})

// Update task status
todo_write({
  merge: true,
  todos: [{ id: "1", status: "completed" }]
})
```

---

## 📁 Required Files by Phase

### Phase 1: Research
- ✅ `specs/001-name/research.md` - Technology decisions

### Phase 2: Specification  
- ✅ `specs/001-name/spec.md` - Product requirements
- ✅ `specs/001-name/plan.md` - Technical plan
- ⚪ `specs/001-name/data-model.md` - Optional, data structures
- ⚪ `specs/001-name/contracts/api-contracts.md` - Optional, APIs

### Phase 3: Implementation
- ✅ `specs/001-name/tasks.md` - Task breakdown
- ⚪ `memory/constitution.md` - Optional, project principles

---

## 🎯 Quality Gates

### ✅ Research Phase Complete
- [ ] ≥3 technology options evaluated
- [ ] Chosen stack with clear rationale
- [ ] Architecture approach documented
- [ ] Integration points identified (if existing project)
- [ ] References to docs/examples included

### ✅ Specification Phase Complete
- [ ] All functional requirements listed (FR1, FR2...)
- [ ] User stories with acceptance criteria
- [ ] Non-functional requirements (performance, security)
- [ ] Success metrics defined
- [ ] Technical implementation plan
- [ ] API contracts (if applicable)

### ✅ Task Phase Complete
- [ ] All work broken into specific tasks
- [ ] Task dependencies documented
- [ ] Acceptance criteria per task
- [ ] Files to create/modify listed
- [ ] Testing strategy included
- [ ] Deployment checklist

### ✅ Implementation Complete
- [ ] All tasks completed and tested
- [ ] Documentation updated
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Deployment ready

---

## 🎨 Project Types: What to Emphasize

### New Project (MVP Focus)
**Phase 1**: Keep it simple, prove concept  
**Phase 2**: High-level spec, core features only  
**Phase 3**: Minimal viable tasks  
**Emphasis**: Speed, simplicity, iteration

### Existing Project (Enhancement)
**Phase 1**: Deep codebase analysis  
**Phase 2**: Detailed integration points  
**Phase 3**: Specific files to modify  
**Emphasis**: Compatibility, quality, testing

---

## 📊 Spec Document Structure

### spec.md (PRD)
```
# Title
## Overview
## Problem Statement
## Solution
## Functional Requirements (FR1, FR2...)
## User Stories (Epic 1, 2...)
## Non-Functional Requirements (NFR1, NFR2...)
## Success Metrics
## Acceptance Checklist
```

### plan.md (Technical)
```
# Title
## Architecture Overview
## Technology Stack
## Data Flow
## Implementation Details
## Security & Performance
## Testing Strategy
## Deployment Process
```

### research.md
```
# Title
## Problem Statement
## Technology Stack Options
## Architecture Patterns
## Similar Projects
## Key Decisions (table)
## Resources & References
```

### tasks.md
```
# Title
## Phase 1: Foundation
  ### Task 1: [Name]
  - Description
  - Spec Reference
  - Actions (checklist)
  - Acceptance Criteria
  - Dependencies
  - Complexity
  - Files to modify
## Phase 2: Core Features
## Phase 3: Integration
## Phase 4: Polish
```

---

## 🛠️ Tools Decision Tree

### When to Use What?

**codebase_search**: Understanding existing code  
- "How does X work?"
- "Where is Y implemented?"
- Integration point analysis

**grep**: Finding exact text  
- Class/function names
- Specific strings/patterns
- Quick lookups

**mcp_context7**: External documentation  
- Framework/library docs
- Best practices
- Code examples
- API references

**web_search**: Latest information  
- Recent updates
- Community patterns
- Comparisons
- Troubleshooting

---

## 🚨 Common Mistakes to Avoid

### ❌ Phase 1
- Choosing tech without research
- Not documenting alternatives
- Skipping integration analysis (existing projects)
- No rationale for decisions

### ❌ Phase 2
- Vague requirements ("should be fast")
- Missing acceptance criteria
- No user stories
- Forgetting edge cases
- Missing NFRs

### ❌ Phase 3
- Tasks too large/vague
- No dependencies mapped
- Missing file references
- No testing tasks
- No acceptance criteria

### ❌ Implementation
- Starting without spec
- Not using todo tool
- Skipping tests
- Not updating docs

---

## 💡 Pro Tips

### For AI Assistants
1. **Always start with research** - Don't jump to code
2. **Ask clarifying questions** - Better to confirm than assume
3. **Use multiple search queries** - First result isn't always best
4. **Document decisions** - Explain the "why"
5. **Break down complexity** - Smaller tasks are better
6. **Reference examples** - Include code samples from docs
7. **Think about testing** - Plan tests with features
8. **Update todos frequently** - Track progress transparently

### For Users
1. **Be specific** - Clear requirements = better results
2. **Review research** - Check tech decisions before spec
3. **Iterate on specs** - It's OK to refine
4. **Trust the process** - Each phase builds on previous
5. **Provide feedback** - Help AI learn your preferences

---

## 📚 Example Workflows

### Example 1: New Web App
```
User: "Build a blog platform with Next.js"

AI Phase 1 (Research):
→ Creates specs/001-blog-platform/research.md
→ Researches: Next.js 14, CMS options, hosting
→ Uses MCP: Next.js docs, MDX examples
→ Decides: Next.js + MDX + Tailwind + Vercel
→ Documents: Why each choice, alternatives considered

AI Phase 2 (Spec):
→ Creates spec.md: Blog CRUD, markdown support, SEO
→ Creates plan.md: App Router architecture, build setup
→ Uses MCP: Next.js metadata examples, MDX plugins
→ Defines: 15 functional requirements, 8 user stories

AI Phase 3 (Tasks):
→ Creates tasks.md: 25 tasks across 4 phases
→ Foundation: Project setup, Next.js config
→ Core: Post CRUD, MDX rendering, routing
→ Polish: SEO, performance, deployment
→ Creates todos and starts implementation
```

### Example 2: Add Feature to Existing App
```
User: "Add comments to flash-tldr-extension summaries"

AI Phase 1 (Analysis):
→ Uses codebase_search: Storage, data models, UI patterns
→ Analyzes: StorageManager, summary overlay, data structures
→ Identifies: Integration with existing summary storage
→ Documents: Affected files, data migration needs

AI Phase 2 (Spec):
→ Creates spec.md: Comment CRUD, display, persistence
→ References: Existing StorageManager patterns
→ Integration points: SummaryOverlay, StoredSummary interface
→ Data model: Comment interface extending existing types

AI Phase 3 (Tasks):
→ Task 1: Extend StoredSummary interface (types.ts)
→ Task 2: Add comment methods to StorageManager
→ Task 3: Update overlay with comment UI (content.ts)
→ Task 4: Migration for existing summaries
→ Creates todos and implements
```

---

## 🔗 Quick Links

- **Full Rules**: [PROJECT_RULES.md](./PROJECT_RULES.md)
- **Example Constitution**: [flash-tldr-extension/memory/constitution.md](./flash-tldr-extension/memory/constitution.md)
- **Example Spec**: [flash-tldr-extension/specs/001-flash-tldr-extension/spec.md](./flash-tldr-extension/specs/001-flash-tldr-extension/spec.md)
- **Example Plan**: [flash-tldr-extension/specs/001-flash-tldr-extension/plan.md](./flash-tldr-extension/specs/001-flash-tldr-extension/plan.md)

---

**Version**: 1.0  
**Last Updated**: October 5, 2025



