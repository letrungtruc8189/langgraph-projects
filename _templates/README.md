# Project Templates

This folder contains templates for creating new projects in the workspace.

## Available Templates

### `new-project/`
Complete template for starting a new application with all necessary files and documentation structure.

## Using Templates

### Option 1: Manual Copy
```bash
# From workspace root
cp -r _templates/new-project/ ./my-new-app/
cd my-new-app
```

### Option 2: AI Assistant
Simply tell the AI assistant:
```
"Create a new project called 'my-new-app' using the template"
```

The AI will:
1. Copy the template structure
2. Rename files appropriately
3. Update placeholder content
4. Guide you through the 3-phase development process

## Template Structure

```
new-project/
├── specs/
│   └── 001-initial-feature/
│       ├── research.md          # Phase 1: Research template
│       ├── spec.md             # Phase 2: Specification template
│       ├── plan.md             # Phase 2: Technical plan template
│       ├── tasks.md            # Phase 3: Task breakdown template
│       └── contracts/          # Optional API contracts
├── memory/                     # For project constitution (created as needed)
└── README.md                   # Project readme template
```

## Customizing Templates

Templates contain placeholder text like:
- `[Project Name]` - Replace with actual project name
- `[Description]` - Replace with actual descriptions
- `[Date]` - Replace with current date

The AI assistant will automatically replace these when creating a new project.

## Adding New Templates

To add a new template:

1. Create a new folder in `_templates/`
2. Add necessary files and structure
3. Use `[Placeholder]` syntax for values to be replaced
4. Update this README with template description

## Related Documentation

- [PROJECT_RULES.md](../PROJECT_RULES.md) - Full development workflow rules
- [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Quick reference guide

---

**Last Updated**: October 5, 2025




