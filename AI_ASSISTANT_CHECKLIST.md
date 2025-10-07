# AI Assistant Checklist

> Quick checklist for AI assistants working in this workspace

## 🎯 Before Starting Any Task

- [ ] Have I read [PROJECT_RULES.md](./PROJECT_RULES.md)?
- [ ] Do I understand the 3-phase workflow?
- [ ] Is this a new project or existing project?
- [ ] What phase should I start with?

---

## Phase 1: Research & Exploration

### New Project Research ✅

- [ ] Created `specs/001-project-name/research.md`
- [ ] Researched ≥3 technology stack options
- [ ] Used MCP Context7 for framework documentation
- [ ] Used web search for examples and best practices
- [ ] Documented architecture patterns explored
- [ ] Listed similar projects and inspirations
- [ ] Created decision table with rationale
- [ ] Documented chosen stack with clear reasoning
- [ ] Listed all resource references
- [ ] Asked user to approve before Phase 2

### Existing Project Analysis ✅

- [ ] Used `codebase_search` to understand architecture
- [ ] Identified core components and responsibilities
- [ ] Mapped existing patterns and conventions
- [ ] Located integration points for new feature
- [ ] Documented affected files and components
- [ ] Analyzed data dependencies
- [ ] Identified potential breaking changes
- [ ] Planned backwards compatibility strategy
- [ ] Asked user to approve before Phase 2

---

## Phase 2: Specification & PRD

### Create spec.md ✅

- [ ] Created `specs/001-feature/spec.md`
- [ ] Wrote clear overview and problem statement
- [ ] Listed all functional requirements (FR1, FR2, ...)
  - [ ] Each FR has specific sub-requirements (FR1.1, FR1.2, ...)
- [ ] Created user stories organized by epics
  - [ ] Each story has acceptance criteria
- [ ] Defined non-functional requirements (NFR1, NFR2, ...)
  - [ ] Performance metrics
  - [ ] Security requirements
  - [ ] Reliability standards
  - [ ] Usability requirements
- [ ] Listed technical constraints
- [ ] Defined success metrics
- [ ] Created review & acceptance checklist
- [ ] For existing projects: Documented integration points
- [ ] Asked user to review before Phase 3

### Create plan.md ✅

- [ ] Created `specs/001-feature/plan.md`
- [ ] Drew architecture diagram (text-based)
- [ ] Documented complete technology stack
- [ ] Explained component architecture
- [ ] Described data flow
- [ ] Defined API design (if applicable)
- [ ] Documented security implementation
- [ ] Planned performance optimization
- [ ] Created error handling strategy
- [ ] Defined testing strategy
- [ ] Documented build & deployment process
- [ ] Planned monitoring & observability
- [ ] Used MCP tools to include code examples
- [ ] Asked user to review before Phase 3

### Optional Documents ✅

- [ ] Created `data-model.md` if complex data structures
- [ ] Created `contracts/api-contracts.md` if API-heavy
- [ ] Created `quickstart.md` for quick reference

---

## Phase 3: Task Breakdown

### Create tasks.md ✅

- [ ] Created `specs/001-feature/tasks.md`
- [ ] Organized tasks into logical phases
  - [ ] Phase 1: Foundation
  - [ ] Phase 2: Core Features
  - [ ] Phase 3: Integration & Polish
  - [ ] Phase 4: Testing & Documentation
  - [ ] Phase 5: Deployment (if applicable)
- [ ] For each task:
  - [ ] Clear description
  - [ ] Reference to spec/plan sections
  - [ ] Specific actions checklist
  - [ ] Acceptance criteria
  - [ ] Listed dependencies
  - [ ] Estimated complexity (Low/Medium/High)
  - [ ] Files to create/modify
- [ ] Created testing checklist
- [ ] Created deployment checklist
- [ ] Listed resource references
- [ ] Asked user to approve before implementation

---

## Implementation Phase

### Start Implementation ✅

- [ ] Created todos using `todo_write` tool
- [ ] Marked first task as "in_progress"
- [ ] Started working on tasks systematically

### During Implementation ✅

- [ ] Following tasks in order (respecting dependencies)
- [ ] Testing each task before moving to next
- [ ] Updating todos as I complete tasks
- [ ] Writing tests alongside features
- [ ] Documenting as I build
- [ ] Handling errors gracefully
- [ ] Following code style from constitution (if exists)

### Per Task ✅

- [ ] Completed all action items
- [ ] Met all acceptance criteria
- [ ] Tested functionality
- [ ] Wrote/updated tests
- [ ] Updated documentation if needed
- [ ] Marked todo as "completed"
- [ ] Moved to next task

### Code Quality ✅

- [ ] TypeScript types are properly defined
- [ ] Code follows project conventions
- [ ] Functions have appropriate comments
- [ ] Complex logic is explained
- [ ] No obvious security issues
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met (UI code)

---

## Communication Checklist

### At Phase Start ✅

- [ ] Confirmed understanding of requirements
- [ ] Asked clarifying questions if needed
- [ ] Explained approach before starting
- [ ] Set expectations for deliverables

### During Phase ✅

- [ ] Showing progress transparently
- [ ] Explaining significant decisions
- [ ] Asking for input on important choices
- [ ] Providing context for recommendations

### At Phase Completion ✅

- [ ] Summarized what was created
- [ ] Highlighted key decisions made
- [ ] Explained trade-offs if any
- [ ] Asked if user wants to proceed or iterate
- [ ] Provided next steps clearly

---

## Common Mistakes to Avoid

### ❌ Don't Do This

- [ ] ❌ Skip research and jump to code
- [ ] ❌ Choose technologies without justification
- [ ] ❌ Write vague requirements ("should be fast")
- [ ] ❌ Create large, unclear tasks
- [ ] ❌ Forget to document decisions
- [ ] ❌ Skip testing until the end
- [ ] ❌ Ignore existing project patterns
- [ ] ❌ Make assumptions without asking
- [ ] ❌ Start implementation without specs
- [ ] ❌ Forget to update todos

### ✅ Do This Instead

- [ ] ✅ Always start with research phase
- [ ] ✅ Document all technology decisions
- [ ] ✅ Write specific, measurable requirements
- [ ] ✅ Break tasks into small, clear steps
- [ ] ✅ Explain the "why" for decisions
- [ ] ✅ Test as you build features
- [ ] ✅ Follow existing project conventions
- [ ] ✅ Ask clarifying questions
- [ ] ✅ Complete specs before coding
- [ ] ✅ Keep todos current

---

## Tool Usage Checklist

### Codebase Search ✅

Use when:
- [ ] Understanding existing code structure
- [ ] Finding integration points
- [ ] Locating similar patterns
- [ ] Analyzing existing implementations

### MCP Context7 ✅

Use when:
- [ ] Need framework documentation
- [ ] Looking for code examples
- [ ] Understanding best practices
- [ ] Getting API references

### Web Search ✅

Use when:
- [ ] Researching latest updates
- [ ] Finding community patterns
- [ ] Comparing solutions
- [ ] Troubleshooting issues

### Todo Tool ✅

Use when:
- [ ] Starting implementation phase
- [ ] Tracking multiple tasks
- [ ] Showing progress to user
- [ ] Complex multi-step work

---

## Quality Gates

### Before Moving to Next Phase ✅

**Phase 1 → Phase 2**:
- [ ] All technology options documented
- [ ] Chosen stack has clear rationale
- [ ] Architecture approach explained
- [ ] User has approved

**Phase 2 → Phase 3**:
- [ ] All requirements documented
- [ ] User stories complete
- [ ] Technical plan detailed
- [ ] User has reviewed

**Phase 3 → Implementation**:
- [ ] All tasks defined clearly
- [ ] Dependencies documented
- [ ] Acceptance criteria specified
- [ ] User has approved

**Implementation → Done**:
- [ ] All todos completed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] User has accepted

---

## Emergency Checklist

### If User is Confused ✅

- [ ] Point to [PROJECT_RULES.md](./PROJECT_RULES.md)
- [ ] Explain which phase we're in
- [ ] Show what we've completed
- [ ] Clarify next steps

### If I'm Stuck ✅

- [ ] Re-read relevant spec sections
- [ ] Check plan.md for technical approach
- [ ] Search codebase for similar patterns
- [ ] Use MCP tools for documentation
- [ ] Ask user for clarification

### If Requirements Change ✅

- [ ] Update spec.md with new requirements
- [ ] Adjust plan.md if architecture changes
- [ ] Update tasks.md with new/modified tasks
- [ ] Explain impact to user
- [ ] Adjust timeline if needed

---

## Project Types Quick Reference

### New MVP Project

**Focus**: Simple, fast, prove concept  
**Phase 1**: Keep it simple, few options  
**Phase 2**: High-level spec, core features only  
**Phase 3**: Minimal viable tasks  

### Existing Project Enhancement

**Focus**: Quality, compatibility, integration  
**Phase 1**: Deep codebase analysis  
**Phase 2**: Detailed integration points  
**Phase 3**: Specific files to modify  

### Large Feature Addition

**Focus**: Comprehensive, scalable, tested  
**Phase 1**: Thorough research, multiple options  
**Phase 2**: Complete spec with edge cases  
**Phase 3**: Detailed task breakdown with tests  

---

## Final Checklist Before Done

- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Code follows project standards
- [ ] No lint errors introduced
- [ ] Performance acceptable
- [ ] Security considerations addressed
- [ ] User has reviewed and approved
- [ ] Todos marked complete
- [ ] Next steps communicated

---

## Quick Links

- 📖 [Full Rules](./PROJECT_RULES.md)
- ⚡ [Quick Reference](./QUICK_REFERENCE.md)
- 📦 [Templates](./_templates/)
- 📝 [Workspace README](./README.md)

---

**Print this checklist mentally before every task!**  
**When in doubt, refer to [PROJECT_RULES.md](./PROJECT_RULES.md)**

---

**Version**: 1.0  
**Last Updated**: October 5, 2025




