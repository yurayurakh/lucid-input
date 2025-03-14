// Base type for formula tags
export interface FormulaTagData {
    id: string
    name: string
    category: string
    value: string | number
}

// Types for formula elements
export type FormulaItemType = 'tag' | 'operator' | 'number'

export type FormulaItem =
    | { type: 'tag'; tag: FormulaTagData }
    | { type: 'operator'; value: string }
    | { type: 'number'; value: number }

// Types for autocomplete
export interface AutocompleteItem {
    id: string
    name: string
    category: string
    value: string | number
}

// Valid mathematical operators
export const OPERATORS = ['+', '-', '*', '/', '^', '(', ')']

// Helper functions for working with formulas
export const isOperator = (char: string): boolean => OPERATORS.includes(char)
