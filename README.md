# LangGraph Projects Workspace

> Multi-application development workspace with standardized AI-assisted development workflow

**Workspace Purpose**: Build multiple independent applications with different technology stacks, following a structured 3-phase development process.

---

## 🌟 Overview

This workspace is designed for building multiple applications with AI coding assistant support. Each application lives in its own folder and can use any technology stack or programming language.

### Key Features

- **Multi-App Support**: Each application is independent with its own dependencies and tech stack
- **Standardized Workflow**: 3-phase development process (Research → Specification → Implementation)
- **AI-Optimized**: Structured documentation for effective AI coding assistance
- **Template-Based**: Quick start templates for new projects
- **Comprehensive Specs**: Detailed specifications with PRDs and technical plans

---

## 📁 Workspace Structure

```
langgraph-projects/
├── _templates/                  # Project templates
│   └── new-project/            # Complete project template
├── flash-tldr-extension/       # Example: Browser extension (TypeScript)
│   ├── specs/                  # Feature specifications
│   ├── memory/                 # Project constitution & guidelines
│   ├── src/                    # Source code
│   └── README.md
├── [your-app-name]/            # Your applications here
├── PROJECT_RULES.md            # Development workflow rules (READ FIRST)
├── QUICK_REFERENCE.md          # Quick reference guide
└── README.md                   # This file
```

---

## 🚀 Getting Started

### For AI Assistants

1. **First Time**: Read [PROJECT_RULES.md](./PROJECT_RULES.md) completely
2. **Quick Reference**: Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common tasks
3. **Follow Process**: Always follow the 3-phase development workflow

### For Developers

1. **Understand Workflow**: Read [PROJECT_RULES.md](./PROJECT_RULES.md)
2. **Start New Project**: Use templates in `_templates/` folder
3. **Work with AI**: Provide clear requirements and review each phase

---

## 🎯 Development Workflow

### Phase 1: Exploration & Research (15-30 min)

**Goal**: Understand problem space and make technology decisions

**Actions**:
- Research technology options
- Analyze architecture patterns
- Document decisions with rationale
- Use MCP tools for documentation

**Output**: `specs/001-feature/research.md`

---

### Phase 2: Specification & PRD (30-60 min)

**Goal**: Create comprehensive product requirements and technical plan

**Actions**:
- Write functional requirements (FRs)
- Create user stories with acceptance criteria
- Define non-functional requirements (NFRs)
- Document technical architecture
- Include API contracts and data models

**Output**: 
- `specs/001-feature/spec.md`
- `specs/001-feature/plan.md`
- `specs/001-feature/data-model.md` (optional)

---

### Phase 3: Task Breakdown & Implementation (15-30 min + development time)

**Goal**: Break down work into actionable tasks and implement

**Actions**:
- Create detailed task list with dependencies
- Define acceptance criteria per task
- List files to create/modify
- Use todo tool to track progress
- Implement systematically

**Output**: 
- `specs/001-feature/tasks.md`
- Implementation code

---

## 📋 Creating a New Project

### Option 1: AI Assistant

```
Tell AI: "Create a new project called 'my-awesome-app' for [description]"
```

The AI will:
1. Use the template structure
2. Guide you through Phase 1 (Research)
3. Create Phase 2 (Specification)
4. Break down Phase 3 (Tasks)
5. Implement the project

### Option 2: Manual

```bash
# Copy template
cp -r _templates/new-project/ ./my-awesome-app/
cd my-awesome-app

# Follow the 3-phase process with AI assistance
```

---

## 📚 Documentation

### Workspace-Level

- **[PROJECT_RULES.md](./PROJECT_RULES.md)** - Complete development workflow rules ⭐ START HERE
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference for common tasks
- **[_templates/](./templates/)** - Project templates

### Project-Level (Example: flash-tldr-extension)

- **[spec.md](./flash-tldr-extension/specs/001-flash-tldr-extension/spec.md)** - Product requirements
- **[plan.md](./flash-tldr-extension/specs/001-flash-tldr-extension/plan.md)** - Technical plan
- **[constitution.md](./flash-tldr-extension/memory/constitution.md)** - Development principles

---

## 🛠️ Technology Stack by Project

### flash-tldr-extension
- **Type**: Browser Extension (Chrome/Edge)
- **Tech**: TypeScript, Webpack, Manifest V3
- **Purpose**: AI-powered content summarization

### [Your Projects]
- Add your projects here as you create them

---

## 💡 Best Practices

### For AI Assistants

1. **Always Research First**: Don't jump to implementation
2. **Use MCP Tools**: Leverage Context7 for documentation
3. **Document Decisions**: Explain the "why" not just "what"
4. **Break Down Complexity**: Smaller tasks are better
5. **Test as You Build**: Don't save testing for the end
6. **Update Documentation**: Keep docs current with code

### For Users

1. **Be Specific**: Clear requirements lead to better results
2. **Review Each Phase**: Check research/spec before implementation
3. **Trust the Process**: Each phase builds on the previous
4. **Provide Feedback**: Help AI learn your preferences
5. **Iterate**: It's okay to refine specs after review

---

## 🔧 Tools & MCP Servers

### Available MCP Tools

- **context7**: Framework and library documentation
- **brave-search**: Local business search
- **Web search**: General web search for research

### Usage Examples

```javascript
// Get Next.js documentation
mcp_context7_resolve-library-uri({ libraryName: "next.js" })
mcp_context7_search-library-docs({ 
  resourceURI: "context7://libraries/nextjs",
  topic: "server components"
})
```

See [mcp-setup.md](./mcp-setup.md) for configuration.

---

## 📊 Project Status

| Project | Status | Tech Stack | Description |
|---------|--------|------------|-------------|
| flash-tldr-extension | ✅ Active | TypeScript, Browser Extension | AI content summarization |
| [Your Project] | | | |

---

## 🤝 Contributing

Each project maintains its own contribution guidelines. Check individual project README files.

### Adding New Projects

1. Use template: `cp -r _templates/new-project/ ./new-project/`
2. Follow 3-phase development process
3. Update this README with project info

---

## 📖 Learning Resources

### Understanding the Workflow

1. Read [PROJECT_RULES.md](./PROJECT_RULES.md) - The complete guide
2. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick lookup
3. Review [flash-tldr-extension](./flash-tldr-extension/) - Real example
4. Use [_templates](./templates/) - Starting point

### Example Workflows

See [QUICK_REFERENCE.md → Example Workflows](./QUICK_REFERENCE.md#-example-workflows) for:
- Starting a new web app
- Adding features to existing projects
- Using MCP tools effectively

---

## 🐛 Troubleshooting

### AI Assistant Issues

**Problem**: AI not following workflow  
**Solution**: Point AI to [PROJECT_RULES.md](./PROJECT_RULES.md)

**Problem**: Skipping research phase  
**Solution**: Explicitly request Phase 1 research first

**Problem**: Tasks too large  
**Solution**: Request more granular task breakdown

### Project Issues

Check individual project TROUBLESHOOTING.md files.

---

## 📝 License

Each project maintains its own license. See individual project folders.

---

## 📮 Contact & Support

For workspace structure questions, create an issue or discussion.

For project-specific questions, check individual project README files.

---

**Last Updated**: October 5, 2025  
**Workspace Version**: 1.0  
**Maintained with**: AI Coding Assistant + Structured Workflow

---

## Quick Links

- 🎯 [Start Here: PROJECT_RULES.md](./PROJECT_RULES.md)
- ⚡ [Quick Reference](./QUICK_REFERENCE.md)
- 📦 [Templates](./_templates/)
- 🔍 [Example Project: FlashTL;DR](./flash-tldr-extension/)




