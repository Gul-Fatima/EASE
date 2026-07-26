"""Contract tests — shared test suite every plugin must pass.

These tests run against EVERY plugin of a given category, ensuring:
- Schema-valid NormalizedSmellReport from every Analyzer
- No writes outside workspace boundaries
- Stable output across identical inputs
"""
